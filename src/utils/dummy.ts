import { HomeIcon } from '@radix-ui/react-icons';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { FcLineChart, FcPackage } from 'react-icons/fc';

// menuConfig.js
export const menuConfig = {
  admin: [
    { href: '/', label: 'Dashboard', icon: HomeIcon },
    { href: '/orders', label: 'Orders', icon: FaShoppingCart, badge: 6 },
    { href: '/products', label: 'Products', icon: FcPackage },
    { href: '/customers', label: 'Customers', icon: FaUser },
    { href: '/analytics', label: 'Analytics', icon: FcLineChart },
  ],
  seller: [
    { href: '/', label: 'Dashboard', icon: HomeIcon },
    { href: '/orders', label: 'Orders', icon: FaShoppingCart, badge: 3 },
    { href: '/products', label: 'Products', icon: FcPackage },
  ],
  customer: [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/orders', label: 'My Orders', icon: FaShoppingCart },
  ],
};