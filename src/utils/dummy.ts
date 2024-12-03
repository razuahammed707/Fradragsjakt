import ClothingImg from '../../public/images/expenses/clothing.png';
import TravelImg from '../../public/images/expenses/travel.png';
import TransportImg from '../../public/images/expenses/transport.png';
import GasImg from '../../public/images/expenses/gas.png';
import MealsImg from '../../public/images/expenses/meals.png';
import SuppliesImg from '../../public/images/expenses/supplies.png';
import InsuranceImg from '../../public/images/expenses/insurance.png';
import PaymentImg from '../../public/payment.png';
import MoreImg from '../../public/More.png';

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

export const expense_categories = [
  {
    id: 1,
    imageSrc: ClothingImg,
    category: 'Clothing',
    totalItemByCategory: 0,
    amount: 0,
  },
  {
    id: 2,
    imageSrc: TravelImg,
    category: 'Travel',
    totalItemByCategory: 0,
    amount: 0,
  },
  {
    id: 3,
    imageSrc: TransportImg,
    category: 'Transport',
    totalItemByCategory: 0,
    amount: 0,
  },
  {
    id: 4,
    imageSrc: GasImg,
    category: 'Gas',
    totalItemByCategory: 0,
    amount: 0,
  },
  {
    id: 5,
    imageSrc: MealsImg,
    category: 'Meals',
    totalItemByCategory: 0,
    amount: 0,
  },
  {
    id: 6,
    imageSrc: SuppliesImg,
    category: 'Supplies',
    totalItemByCategory: 0,
    amount: 0,
  },
  {
    id: 7,
    imageSrc: InsuranceImg,
    category: 'Insurance',
    totalItemByCategory: 0,
    amount: 0,
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

export const categories = [
  // { label: 'Supplies', amount: 0, image: '/Supplies.svg' },
  { label: 'Clothing', amount: 0, image: ClothingImg },
  { label: 'Travel', amount: 0, image: TravelImg },
  { label: 'Transport', amount: 0, image: TransportImg },
  { label: 'Gas', amount: 0, image: GasImg },
  { label: 'Meals', amount: 0, image: MealsImg },
  { label: 'Insurance', amount: 0, image: InsuranceImg },
  { label: 'Payment', amount: 0, image: PaymentImg },
  { label: 'More', amount: 'NOK 500', image: MoreImg },
];
export const predefinedCategories = [
  {
    id: 1,
    name: 'Office and Workspace',
    items: [
      {
        name: 'Rent',
        amount: 0,
      },
      {
        name: 'Utilities',
        amount: 0,
      },
      {
        name: 'Office Supplies',
        amount: 0,
      },
      {
        name: 'Furniture and Equipment',
        amount: 15000,
      },
      {
        name: 'Maintenance and Repairs',
        amount: 0,
      },
    ],
    total_amount: 0,
  },
  {
    id: 2,
    name: 'Technology and Communication',
    items: [
      {
        name: 'Computer Hardware',
        amount: 15000,
      },
      {
        name: 'Software Subscriptions',
        amount: 0,
      },
      {
        name: 'Internet and Phone Expenses',
        amount: 0,
      },
      {
        name: 'Cloud Storage and Services',
        amount: 0,
      },
      {
        name: 'Website Hosting',
        amount: 0,
      },
    ],
    total_amount: 0,
  },
  {
    id: 3,
    name: 'Professional Services',
    items: [
      {
        name: 'Accounting and Legal Fees',
        amount: 0,
      },
      {
        name: 'Consulting Services',
        amount: 0,
      },
      {
        name: 'Professional Memberships',
        amount: 0,
      },
      {
        name: 'Training and Certification',
        amount: 0,
      },
    ],
    total_amount: 0,
  },
  {
    id: 4,
    name: 'Marketing and Advertising',
    items: [
      {
        name: 'Online Advertising',
        amount: 0,
      },
      {
        name: 'Print Materials',
        amount: 0,
      },
      {
        name: 'Social Media Marketing',
        amount: 0,
      },
      {
        name: 'Business Cards',
        amount: 0,
      },
      {
        name: 'Marketing Software',
        amount: 0,
      },
    ],
    total_amount: 0,
  },
  {
    id: 5,
    name: 'Travel and Transportation',
    items: [
      {
        name: 'Business Meal Expenses',
        amount: 0,
      },
      {
        name: 'Vehicle Expenses',
        amount: 0,
      },
      {
        name: 'Fuel',
        amount: 0,
      },
      {
        name: 'Parking and Tolls',
        amount: 0,
      },
      {
        name: 'Public Transportation',
        amount: 0,
      },
    ],
    total_amount: 0,
  },
  {
    id: 6,
    name: 'Employee-Related Expenses',
    items: [
      {
        name: 'Salaries and Wages',
        amount: 0,
      },
      {
        name: 'Benefits',
        amount: 0,
      },
      {
        name: 'Recruitment Costs',
        amount: 0,
      },
      {
        name: 'Training Programs',
        amount: 0,
      },
    ],
    total_amount: 0,
  },
];
