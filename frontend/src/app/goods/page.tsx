'use client';
import debounce from 'lodash/debounce';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface GoodsItem {
    id: number;
    itemName: string;
    itemPrice: number;
    itemUrl: string;
    imageUrl: string;
}

export default function GoodsPage() {
    const [goods, setGoods] = useState<GoodsItem[]>([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const limit = typeof window !== 'undefined' && window.innerWidth < 640 ? 30 : 100;

    const fetchGoods = debounce(() => {
        fetch('/data/goods.json')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch goods.json');
                return res.json();
            })
            .then(data => setGoods(data.filter((item: GoodsItem) =>
                item.itemName.toLowerCase().includes(search.toLowerCase())
            ).slice((page - 1) * limit, page * limit)))
            .catch(err => console.error('Fetch error:', err));
    }, 500);

    useEffect(() => {
        console.log('Goods:', goods); // デバッグ用
        fetchGoods();
    }, [page, search]);

    return (
        <>
            <Head>
                <title>Side7Connect | ガンプラ＆グッズ</title>
                <meta name="description" content="最新ガンプラを最安値で！RX-78、ユニコーン、ザクIIをチェック！" />
            </Head>
            <div className="bg-blue-900 text-white min-h-screen p-4 bg-gradient-to-r from-blue-900 to-gray-800">
                <div className="bg-gray-200 h-[90px] w-full max-w-[728px] mx-auto mb-4 text-center text-black">
                    AdSense 728x90（仮）
                </div>
                <h1 className="text-4xl font-bold mb-6 text-center drop-shadow-lg">ガンプラ＆グッズ</h1>
                <input
                    type="text"
                    placeholder="RGνガンダムをロックオン！"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-lg mx-auto p-3 mb-6 text-black rounded-lg border-2 border-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    tabIndex={0}
                    aria-label="ガンプラを検索"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {goods.length ? goods.map((item: GoodsItem) => (
                        <div key={item.id} className="bg-gray-800 border-2 border-white rounded-lg p-4 hover:scale-105 transition-transform shadow-lg">
                            <div className="relative">
                                <Image
                                    src={item.imageUrl || 'https://via.placeholder.com/200x200/4682B4/FFFFFF?text=Mecha'}
                                    alt={item.itemName}
                                    width={200}
                                    height={200}
                                    loading="lazy"
                                    className="w-full h-48 object-cover rounded"
                                />
                                <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold p-1 rounded">
                                    ジオン兵#123推し！
                                </span>
                            </div>
                            <h2 className="text-lg font-semibold mt-2">{item.itemName}</h2>
                            <p className="text-red-400 font-medium">¥{item.itemPrice}</p>
                            <a
                                href={item.itemUrl}
                                className="bg-red-600 hover:bg-red-700 p-2 rounded inline-block mt-2 w-full text-center"
                                tabIndex={0}
                            >
                                購入！
                            </a>
                        </div>
                    )) : (
                        <p className="text-center text-xl">ザクの残骸しか見つからなかった…</p>
                    )}
                </div>
                <div className="bg-gray-200 h-[250px] w-full max-w-[300px] mx-auto mt-6 text-center text-black">
                    AdSense 300x250（仮）
                </div>
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="bg-gray-600 hover:bg-gray-700 p-3 rounded disabled:opacity-50"
                        tabIndex={0}
                    >
                        前へ
                    </button>
                    <button
                        onClick={() => setPage(page + 1)}
                        className="bg-red-600 hover:bg-red-700 p-3 rounded"
                        tabIndex={0}
                    >
                        コロニー移動！
                    </button>
                </div>
            </div>
        </>
    );
}