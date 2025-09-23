'use client';
import { fetchGundamNews } from '@/lib/rss';
import Head from 'next/head';
import { useEffect, useState } from 'react';

interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetchGundamNews().then(data => setNews(data));
  }, []);

  return (
    <>
      <Head>
        <title>Side7Connect | ガンダムニュース</title>
        <meta name="description" content="最新ガンダムニュースをチェック！" />
      </Head>
      <div className="bg-blue-900 text-white min-h-screen p-4 bg-gradient-to-r from-blue-900 to-gray-800">
        <h1 className="text-4xl font-bold mb-6 text-center drop-shadow-lg">ガンダムニュース</h1>
        <div className="max-w-4xl mx-auto">
          {news.length ? news.map((item: NewsItem) => (
            <div key={item.id} className="mb-4 p-4 bg-gray-800 rounded-lg">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-400">{item.pubDate}</p>
              <p className="mt-2">{item.description}</p>
              <a href={item.link} className="text-red-400 hover:underline" tabIndex={0}>
                詳細を読む
              </a>
            </div>
          )) : (
            <p className="text-center">ニュースが見つからなかった…</p>
          )}
        </div>
        <footer className="text-center mt-6 text-sm text-gray-400">
          &copy; 2025 Side7Connect
        </footer>
      </div>
    </>
  );
}