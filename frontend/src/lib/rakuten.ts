export interface GoodsItem {
    id: string;
    itemName: string;
    itemPrice: number;
    itemUrl: string;
    imageUrl: string;
    reviewAverage?: number;
    reviewCount?: number;
}

interface SearchParams {
    genreId?: string;
    availability?: number;
    category?: string;
    sort?: string;
}

export async function fetchRakutenGoods(keyword: string, page: number, params: SearchParams = {}) {
    const apiKey = process.env.NEXT_PUBLIC_RAKUTEN_API_KEY;
    if (!apiKey) {
        console.error('Environment variable NEXT_PUBLIC_RAKUTEN_API_KEY is missing');
        throw new Error('Rakuten API key is not configured');
    }

    let validKeyword = keyword || 'ガンプラ';
    if (validKeyword.length > 128) {
        validKeyword = validKeyword.slice(0, 128);
        console.warn('Keyword truncated to 128 characters:', validKeyword);
    }

    const { genreId, availability = 0, sort = 'standard' } = params;

    const urlParams = new URLSearchParams({
        applicationId: apiKey,
        keyword: validKeyword,
        page: page.toString(),
        hits: '30',
        sort,
        availability: availability.toString(),
    });

    if (genreId && /^\d{1,6}$/.test(genreId)) {
        urlParams.append('genreId', genreId);
    }

    const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?${urlParams.toString()}`;
    console.log('Rakuten API URL:', url);
    console.log('Request params:', { keyword: validKeyword, page, genreId, availability, sort, applicationId: apiKey.slice(0, 4) + '...' });

    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Rakuten API response error:', { status: res.status, errorText });
            if (errorText.includes('specify valid applicationId')) {
                throw new Error('無効な楽天APIキーです。管理者に連絡してください。');
            }
            throw new Error(`Rakuten API error: ${res.status} - ${errorText}`);
        }
        const data = await res.json();
        console.log('Raw API response:', {
            count: data.count,
            page: data.page,
            pageCount: data.pageCount,
            hits: data.hits,
            Items: data.Items?.length || 0,
            firstItem: data.Items?.[0] || null,
        });

        if (!data.Items || !Array.isArray(data.Items)) {
            console.warn('No items found in API response');
            return [];
        }

        const items: GoodsItem[] = data.Items.map((item: any) => {
            // 高解像度画像を優先的に使用
            const rawUrl =
                item.Item.imageUrl ||
                item.Item.mediumImageUrls?.[0]?.imageUrl ||
                '/placeholder.png';

            // 画像サイズ指定パラメータ（例：_ex=128x128）をより大きく置き換える
            const highResUrl = rawUrl.replace(/_ex=\d+x\d+/, '_ex=600x600');

            return {
                id: item.Item.itemCode,
                itemName: item.Item.itemName,
                itemPrice: item.Item.itemPrice,
                itemUrl: item.Item.itemUrl,
                imageUrl: highResUrl,
                reviewAverage: item.Item.reviewAverage,
                reviewCount: item.Item.reviewCount,
            };
        });

        console.log('Processed items:', items.length);
        console.log('First processed item:', items[0]);
        return items;
    } catch (error) {
        console.error('Rakuten fetch error:', error);
        throw error;
    }
}