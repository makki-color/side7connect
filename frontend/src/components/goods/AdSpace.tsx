'use client';

import { FC } from 'react';

const AdSpace: FC = () => {
  return (
    <div className="mt-8 hidden md:block">
      <div className="w-[300px] h-[250px] bg-white bg-opacity-10 backdrop-blur-md text-center flex items-center justify-center rounded border border-purple-400 border-opacity-20 sticky top-4">
        <span className="text-purple-200">広告 (300x250)</span>
      </div>
    </div>
  );
};

export default AdSpace;