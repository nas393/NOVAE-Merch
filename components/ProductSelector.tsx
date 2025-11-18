
import React from 'react';
import { Product } from '../types';

interface ProductSelectorProps {
  products: Product[];
  selectedProduct: Product | null;
  onSelect: (product: Product) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ products, selectedProduct, onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => onSelect(product)}
          className={`flex flex-col items-center justify-center text-center p-4 rounded-lg border-2 transition-all duration-200
            ${selectedProduct?.id === product.id 
              ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-500' 
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}
        >
          <div className={`mb-3 text-slate-600 ${selectedProduct?.id === product.id ? 'text-sky-600' : ''}`}>
            {product.icon}
          </div>
          <p className={`font-semibold text-slate-700 ${selectedProduct?.id === product.id ? 'text-sky-900' : ''}`}>
            {product.name}
          </p>
          <p className="text-sm text-slate-500 hidden sm:block">{product.description}</p>
        </button>
      ))}
    </div>
  );
};

export default ProductSelector;
