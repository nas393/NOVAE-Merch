import type React from 'react';

export interface Product {
  id: string;
  name: string;
  icon: React.ReactElement;
  description: string;
}
