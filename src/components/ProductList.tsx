import React from 'react';
import ProductGrid from './ProductGrid';
import { Product } from '../types';

interface ProductListProps {
  products: Product[];
  onSetAlert?: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onSetAlert }) => {
  return <ProductGrid products={products} onSetAlert={onSetAlert} />;
};

export default ProductList;
