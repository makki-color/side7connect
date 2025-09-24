import { LRUCache } from 'lru-cache';

const cache = new LRUCache({
    max: 100,
    ttl: 1000 * 60 * 5, // 5分キャッシュ
});

interface RakutenItem {
    Item: {
        itemCode: string;
        itemName: string;
        itemPrice: number;
        itemUrl: string;
        mediumImageUrls: { imageUrl: string }[];
    };
}

export async function fetchRakutenGoods(keyword: string, page: number = 1) {
    const cacheKey = `${keyword}:${page}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        console.log('Returning cached data for:', cacheKey);
        return cachedData;
    }

    const apiKey = process.env.NEXT_PUBLIC_RAKUTEN_API_KEY;
    if (!apiKey) {
        console.error('Rakuten API key is missing');
        return [];
    }
    const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?applicationId=${apiKey}&keyword=${encodeURIComponent(keyword)}&page=${page}&hits=30`;
    try {
        const res = await fetch(url);
        if (res.status === 429) {
            console.warn('Rate limit exceeded, retrying after 1 second...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            return fetchRakutenGoods(keyword, page);
        }
        if (!res.ok) throw new Error(`Rakuten API error: ${res.status}`);
        const data = await res.json();
        const mappedData = data.Items.map((item: RakutenItem) => ({
            id: item.Item.itemCode,
            itemName: item.Item.itemName,
            itemPrice: item.Item.itemPrice,
            itemUrl: item.Item.itemUrl,
            imageUrl: item.Item.mediumImageUrls[0]?.imageUrl || 'https://via.placeholder.com/200',
        }));
        cache.set(cacheKey, mappedData);
        return mappedData;
    } catch (err) {
        console.error('Rakuten fetch error:', err);
        return [];
    }
}