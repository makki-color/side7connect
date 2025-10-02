"use client";

import { appFirebase, auth, db } from '@/lib/firebase'; // appFirebaseをインポート
import { getAnalytics } from 'firebase/analytics';
import { signInAnonymously } from 'firebase/auth';
import { onValue, push, ref } from 'firebase/database';
import { useEffect, useState } from 'react';

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [userName, setUserName] = useState('Guest');

    useEffect(() => {
        // Analyticsをクライアントサイドで初期化
        let analytics = null;
        if (typeof window !== 'undefined') {
            analytics = getAnalytics(appFirebase);
            console.log('Analytics initialized:', analytics);
        }

        signInAnonymously(auth).then(() => {
            setUserName(localStorage.getItem('userName') || 'Guest');
        }).catch((error) => {
            console.error('Auth error:', error);
        });
        const messagesRef = ref(db, 'messages');
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            setMessages(data ? Object.values(data) : []);
        }, (error) => {
            console.error('Firebase error:', error);
        });
    }, []);

    const sendMessage = () => {
        if (input.trim() && userName.trim()) {
            push(ref(db, 'messages'), {
                text: input,
                userName: userName || 'Guest',
                timestamp: Date.now(),
            });
            setInput('');
        }
    };

    return (
        <div className="p-4 bg-gradient-to-r from-blue-800 to-red-600">
            <input
                type="text"
                placeholder="ユーザー名"
                value={userName}
                onChange={(e) => {
                    setUserName(e.target.value);
                    localStorage.setItem('userName', e.target.value);
                }}
                className="border p-2 mb-2 text-black w-full"
            />
            <div className="mb-4 max-h-96 overflow-y-auto">
                {messages.map((msg, i) => (
                    <div key={i} className="flex items-center mb-2">
                        <img src="/rx78.png" alt="RX-78" className="w-6 h-6 mr-2" />
                        <p className="text-white">
                            {msg.userName}: {msg.text} - {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                    </div>
                ))}
            </div>
            <div className="flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="border p-2 text-black flex-1"
                />
                <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white p-2">
                    Send
                </button>
            </div>
        </div>
    );
}