
import React from 'react';
import { Product } from './types';
import { TShirtIcon, EnvelopeIcon, FlyerIcon, WebsiteIcon, BoxIcon, MugIcon } from './components/icons';

export const PRODUCTS: Product[] = [
  {
    id: 'tshirt',
    name: 'T-Shirt',
    icon: <TShirtIcon className="w-8 h-8" />,
    description: 'Classic crew-neck t-shirts.'
  },
  {
    id: 'mug',
    name: 'Mug',
    icon: <MugIcon className="w-8 h-8" />,
    description: 'Ceramic coffee mugs.'
  },
  {
    id: 'envelope',
    name: 'Envelope',
    icon: <EnvelopeIcon className="w-8 h-8" />,
    description: 'Standard business envelopes.'
  },
  {
    id: 'flyer',
    name: 'Flyer',
    icon: <FlyerIcon className="w-8 h-8" />,
    description: 'Promotional business flyers.'
  },
  {
    id: 'website',
    name: 'Website',
    icon: <WebsiteIcon className="w-8 h-8" />,
    description: 'Digital website mockups.'
  },
  {
    id: 'kit',
    name: 'Kit',
    icon: <BoxIcon className="w-8 h-8" />,
    description: 'Branded merchandise kits.'
  }
];
