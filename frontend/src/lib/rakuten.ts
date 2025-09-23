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
    const apiKey = process.env.NEXT_PUBLIC_RAKUTEN_API_KEY;
    const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?applicationId=${apiKey}&keyword=${encodeURIComponent(keyword)}&page=${page}&hits=30`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Rakuten API error');
        const data = await res.json();
        return data.Items.map((item: RakutenItem) => ({
            id: item.Item.itemCode,
            itemName: item.Item.itemName,
            itemPrice: item.Item.itemPrice,
            itemUrl: item.Item.itemUrl,
            imageUrl: item.Item.mediumImageUrls[0]?.imageUrl || 'https://via.placeholder.com/200',
        }));
    } catch (err) {
        console.error('Rakuten fetch error:', err);
        return [];
    }
}