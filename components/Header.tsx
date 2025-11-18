
import React from 'react';
import { ImageEditAutoIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ImageEditAutoIcon className="w-8 h-8 text-sky-600" />
          <span className="text-xl font-semibold text-slate-800">Merch Mockup Generator</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
