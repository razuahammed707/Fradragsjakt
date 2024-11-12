import ClothingImg from '../../public/images/expenses/clothing.png';
import TravelImg from '../../public/images/expenses/travel.png';
import TransportImg from '../../public/images/expenses/transport.png';
import GasImg from '../../public/images/expenses/gas.png';
import MealsImg from '../../public/images/expenses/meals.png';
import SuppliesImg from '../../public/images/expenses/supplies.png';
import InsuranceImg from '../../public/images/expenses/insurance.png';

import {
  LayoutDashboard,
  HandCoins,
  Landmark,
  CircleDollarSign,
  Newspaper,
  ListTree,
} from 'lucide-react';
import { FaUser } from 'react-icons/fa';
import { FcLineChart, FcPackage } from 'react-icons/fc';

export const menuConfig = {
  admin: [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/orders',
      label: 'Orders',
      icon: HandCoins,
      badge: 6,
    },
    {
      href: '/products',
      label: 'Products',
      icon: FcPackage,
      subItems: [
        { href: '/products/categories', label: 'Categories' },
        { href: '/products/new', label: 'New Product' },
      ],
    },
    {
      href: '/customers',
      label: 'Customers',
      icon: FaUser,
    },
    {
      href: '/analytics',
      label: 'Analytics',
      icon: FcLineChart,
      subItems: [
        { href: '/analytics/sales', label: 'Sales' },
        { href: '/analytics/traffic', label: 'Traffic' },
      ],
    },
  ],
  seller: [
    {
      href: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/orders',
      label: 'Orders',
      icon: HandCoins,
      badge: 3,
    },
    {
      href: '/products',
      label: 'Products',
      icon: FcPackage,
      subItems: [
        { href: '/products/inventory', label: 'Inventory' },
        { href: '/products/new', label: 'New Product' },
      ],
    },
  ],
  customer: [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/expenses',
      label: 'Expenses',
      icon: HandCoins,
    },
    {
      href: '/categories',
      label: 'Categories',
      icon: ListTree,
    },
    {
      href: '/rules',
      label: 'Rules',
      icon: HandCoins,
    },
    {
      href: '/deductions',
      label: 'Deductions',
      icon: Landmark,
      subItems: [
        { href: '/deductions/2024', label: '2024' },
        { href: '/deductions/2023', label: '2023' },
        { href: '/deductions/2022', label: '2022' },
      ],
    },
    {
      href: '/tax-file',
      label: 'Tax File',
      icon: Newspaper,
    },
    {
      href: '/write-offs',
      label: 'Write-offs',
      icon: CircleDollarSign,
    },
  ],
};

export const expenseType = [
  {
    id: 1,
    imageSrc: ClothingImg,
    type: 'Clothing',
    quantity: 15,
    amount: 500,
  },
  {
    id: 2,
    imageSrc: TravelImg,
    type: 'Travel',
    quantity: 20,
    amount: 500,
  },
  {
    id: 3,
    imageSrc: TransportImg,
    type: 'Transport',
    quantity: 25,
    amount: 500,
  },
  {
    id: 4,
    imageSrc: GasImg,
    type: 'Gas',
    quantity: 40,
    amount: 500,
  },
  {
    id: 5,
    imageSrc: MealsImg,
    type: 'Meals',
    quantity: 15,
    amount: 500,
  },
  {
    id: 6,
    imageSrc: SuppliesImg,
    type: 'Supplies',
    quantity: 35,
    amount: 500,
  },
  {
    id: 7,
    imageSrc: InsuranceImg,
    type: 'Insurance',
    quantity: 40,
    amount: 500,
  },
];

export const expenseWriteOffs = [
  {
    id: 1,
    title: 'Business meals',
    quantity: 18,
    amount: '$200',
  },
  {
    id: 2,
    title: 'Travels',
    quantity: 1,
    amount: '$6',
  },
  {
    id: 3,
    title: 'Clothing',
    quantity: 1,
    amount: '$3',
  },
  {
    id: 4,
    title: 'Supplies',
    quantity: 1,
    amount: '$12',
  },
  {
    id: 5,
    title: 'Payment',
    quantity: 1,
    amount: '$5',
  },
  {
    id: 6,
    title: 'Gas',
    quantity: 1,
    amount: '$2',
  },
  {
    id: 7,
    title: 'Review your deductions',
    quantity: 0,
    amount: 46,
  },
  {
    id: 8,
    title: 'Questions answered',
    quantity: 0,
    amount: '8 out of 9',
  },
  {
    id: 9,
    title: 'Potential saving total from 46 write-offs',
    quantity: 0,
    amount: '$2,086',
  },
];

export const summaryWriteOffs = [
  {
    id: 1,
    title: 'Review your deductions',
    quantity: 46,
    amount: 0,
  },
  {
    id: 2,
    title: 'Questions answered',
    quantity: '8 out of 9',
    amount: 0,
  },
  {
    id: 3,
    title: 'Potential saving total from 46 write-offs',
    quantity: 1,
    amount: '$2,086',
  },
];
export const transactions = [
  {
    description: 'Uber One Sydney AU Aus',
    category: 'Transport',
    type: 'Business',
    amount: 100.55,
  },
  {
    description: 'foodpanda.com Dhaka BGD card',
    category: 'Meals',
    type: "Don't know",
    amount: 30.65,
  },
  {
    description: 'International Transaction Fee',
    category: 'Travel',
    type: 'Personal',
    amount: 30.65,
  },
  {
    description: 'Uber One Sydney AU Aus',
    category: 'Transport',
    type: 'Personal',
    amount: 30.65,
  },
  {
    description: 'BFC Dhaka BGD',
    category: 'Meals',
    type: 'Business',
    amount: 30.65,
  },
];
