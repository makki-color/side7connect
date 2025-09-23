import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // APIキー後で（Firebaseコンソールから）
  apiKey: 'your_api_key',
  authDomain: 'your_project.firebaseapp.com',
  projectId: 'your_project',
  storageBucket: 'your_project.appspot.com',
  messagingSenderId: 'your_id',
  appId: 'your_app_id',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);