    A Next.js-based web application with Firebase Realtime Database for real-time chat, goods, and news features, themed around Gundam.

    ## Features
    - **Chat**: Real-time messaging with anonymous login, displaying Gundam-themed images (`/rx78.png`).
    - **Goods**: Placeholder page for e-commerce integration (TBD).
    - **News**: Placeholder page for news updates (TBD).
    - **Analytics**: Firebase Analytics for user tracking (optional, AdSense preparation).

    ## Setup
    1. Clone the repository:
       ```bash
       git clone <repository-url>
       cd frontend
       ```
    2. Install dependencies:
       ```bash
       npm install
       ```
    3. Configure environment variables in `.env.local`:
       ```
       NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
       NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
       NEXT_PUBLIC_FIREBASE_DATABASE_URL=your-database-url
       NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
       NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
       NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
       NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
       NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
       ```
    4. Run the development server:
       ```bash
       npm run dev
       ```
    5. Access at `http://localhost:3000`.

    ## Project Structure
    - `app/`: Next.js App Router pages (`chat`, `goods`, `news`).
    - `src/lib/`: Firebase configuration (`firebase.ts`).
    - `public/`: Static assets (`rx78.png`).
    - `.env.local`: Environment variables for Firebase.

    ## Changelog
    ### 2025-10-02
    - **Fixed**: Firebase `auth/configuration-not-found` error.
      - **Cause**: Incorrect or missing `authDomain` in `.env.local`, SSR/CSR timing issue.
      - **Solution**: Validated environment variables, moved `signInAnonymously` to client-side (`typeof window !== 'undefined'` in `app/chat/page.tsx`).
    - **Fixed**: Next.js 15.5.3 stale version warning.
      - **Cause**: Outdated Next.js version causing compatibility issues with Firebase 12.3.0.
      - **Solution**: Updated to Next.js 15.0.3 (`npm install next@15.0.3`).
    - **Fixed**: Turbopack WASM bindings warnings.
      - **Cause**: Experimental Turbopack instability in Windows environment.
      - **Solution**: Disabled Turbopack (`"dev": "next dev"` in `package.json`, removed `experimental.turbopack` from `next.config.js`).
    - **Milestone**: Achieved 10/1 target (real-time chat with anonymous login, 500ms update, Gundam-themed UI).

    ### 2025-09-30
    - **Fixed**: `app` import error in `app/chat/page.tsx`.
      - **Cause**: `src/lib/firebase.ts` did not export `app` from `initializeApp`.
      - **Solution**: Added `export const appFirebase = app` in `src/lib/firebase.ts`.
    - **Fixed**: Firebase Analytics `getOrCreateDataLayer` error.
      - **Cause**: `getAnalytics` called in SSR, `window` undefined.
      - **Solution**: Moved `getAnalytics` to client-side in `app/chat/page.tsx` with `typeof window !== 'undefined'`.
    - **Fixed**: `useEffect` in non-Client Component error.
      - **Cause**: Missing `"use client"` directive in `app/chat/page.tsx`.
      - **Solution**: Added `"use client"` to file.
    - **Fixed**: `Couldn't find any pages or app directory` error.
      - **Cause**: Ran `npm run dev` in wrong directory (`C:\side7connect` instead of `C:\side7connect\frontend`).
      - **Solution**: Moved to `C:\side7connect\frontend`, ensured `app/chat/page.tsx` exists.

    ## Next Steps
    - Implement `goods` and `news` pages (`app/goods/page.tsx`, `app/news/page.tsx`).
    - Deploy to Vercel with environment variables.
    - Enhance Firebase Analytics for AdSense integration.