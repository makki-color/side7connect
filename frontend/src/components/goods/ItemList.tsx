'use client';

import { GoodsItem } from '@/lib/rakuten';
import Image from 'next/image';
import { FC } from 'react';

interface ItemListProps {
  items: GoodsItem[];
  category: string;
  viewMode: 'grid' | 'list';
  title: string;
  error: string | null;
  onItemClick: (item: GoodsItem) => void;
}

const ItemList: FC<ItemListProps> = ({ items, category, viewMode, title, error, onItemClick }) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
      {error && <p className="text-purple-200 mb-4">{error}</p>}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {items.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg overflow-hidden hover:shadow-2xl hover:bg-opacity-15 transition-all border border-purple-400 border-opacity-20"
            >
              <Image
                src={item.imageUrl || '/placeholder.png'}
                alt={item.itemName}
                width={300}
                height={300}
                loading="lazy"
                quality={90}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                className="w-full aspect-square object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.png';
                }}
              />
              <div className="p-3 md:p-4">
                <p className="text-xs md:text-sm text-purple-300 mb-1">{category}</p>
                <h3 className="text-sm md:text-base font-medium text-white mb-2 md:mb-3 line-clamp-2">{item.itemName}</h3>
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <p className="text-lg md:text-xl font-bold text-white">¥{item.itemPrice.toLocaleString()}</p>
                  {item.reviewAverage && (
                    <p className="text-xs md:text-sm text-yellow-400">★ {item.reviewAverage.toFixed(1)} ({item.reviewCount || 0}件)</p>
                  )}
                </div>
                <a
                  href={item.itemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onItemClick(item)}
                  className="block w-full py-2 md:py-2.5 rounded text-sm md:text-base font-medium bg-purple-600 text-white hover:bg-purple-700 text-center"
                >
                  詳細を見る
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg p-4 flex gap-4 hover:shadow-2xl hover:bg-opacity-15 transition-all border border-purple-400 border-opacity-20"
            >
              <Image
                src={item.imageUrl || '/placeholder.png'}
                alt={item.itemName}
                width={128}
                height={128}
                loading="lazy"
                quality={90}
                sizes="128px"
                className="w-32 h-32 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.png';
                }}
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-purple-300 mb-1">{category}</p>
                  <h3 className="text-lg font-medium text-white mb-2">{item.itemName}</h3>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-white">¥{item.itemPrice.toLocaleString()}</p>
                  <div className="flex items-center gap-3">
                    {item.reviewAverage && (
                      <p className="text-sm text-yellow-400">★ {item.reviewAverage.toFixed(1)} ({item.reviewCount || 0}件)</p>
                    )}
                    <a
                      href={item.itemUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onItemClick(item)}
                      className="px-6 py-2.5 rounded font-medium bg-purple-600 text-white hover:bg-purple-700"
                    >
                      詳細を見る
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemList;