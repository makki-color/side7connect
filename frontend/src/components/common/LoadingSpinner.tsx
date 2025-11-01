'use client';

import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center py-12">
            <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
        </div>
    );
}