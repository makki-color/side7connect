'use client';
import Head from 'next/head';
import { useState } from 'react';

export default function ChatPage() {
    const [message, setMessage] = useState('');

    const sendMessage = () => {
        // Firebase後で
        console.log('Message:', message);
        setMessage('');
    };

    return (
        <>
            <Head>
                <title>Side7Connect | ガンダムトーク</title>
                <meta name="description" content="ガンダムファンとトーク！" />
            </Head>
            <div className="bg-blue-900 text-white min-h-screen p-4 bg-gradient-to-r from-blue-900 to-gray-800">
                <h1 className="text-4xl font-bold mb-6 text-center drop-shadow-lg">ガンダムトーク</h1>
                <div className="max-w-4xl mx-auto">
                    <div className="h-96 bg-gray-800 p-4 rounded-lg mb-4">
                        <p>チャットエリア（準備中）</p>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="ユニコーン最高！"
                            className="flex-1 p-2 text-black rounded-lg"
                            tabIndex={0}
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-red-600 hover:bg-red-700 p-2 rounded"
                            tabIndex={0}
                        >
                            送信！
                        </button>
                    </div>
                </div>
                <footer className="text-center mt-6 text-sm text-gray-400">
                    &copy; 2025 Side7Connect
                </footer>
            </div>
        </>
    );
}