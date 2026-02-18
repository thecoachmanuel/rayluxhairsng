import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    PlusSquareIcon,
    GridIcon,
    StarBadgeIcon,
    SlidesIcon,
    BannerIcon,
    BrushIcon,
    MailIcon,
    TicketIcon,
    TruckIcon,
    UsersIcon,
    ChartBarIcon,
    CreditCardIcon,
    ReceiptIcon,
    ChatBubbleIcon,
} from '../../assets/assets';

const SideBar = () => {
    const pathname = usePathname()
    const menuItems = [
        { name: 'Add Product', path: '/seller', icon: PlusSquareIcon },
        { name: 'Product List', path: '/seller/product-list', icon: GridIcon },
        { name: 'Featured Section', path: '/seller/featured', icon: StarBadgeIcon },
        { name: 'Hero Slider', path: '/seller/hero-slider', icon: SlidesIcon },
        { name: 'Homepage Banner', path: '/seller/banner', icon: BannerIcon },
        { name: 'Branding & Footer', path: '/seller/branding', icon: BrushIcon },
        { name: 'Newsletter', path: '/seller/newsletter', icon: MailIcon },
        { name: 'Coupons', path: '/seller/coupons', icon: TicketIcon },
        { name: 'Shipping & Fees', path: '/seller/shipping', icon: TruckIcon },
        { name: 'VIP Membership', path: '/seller/membership', icon: UsersIcon },
        { name: 'Customers', path: '/seller/customers', icon: UsersIcon },
        { name: 'Analytics', path: '/seller/analytics', icon: ChartBarIcon },
        { name: 'Payments', path: '/seller/payments', icon: CreditCardIcon },
        { name: 'Orders', path: '/seller/orders', icon: ReceiptIcon },
        { name: 'Messages', path: '/seller/messages', icon: ChatBubbleIcon },
    ];

    return (
        <div className='w-20 md:w-64 border-r min-h-screen text-base border-gray-300 py-2 flex flex-col'>
            {menuItems.map((item) => {

                const isActive = pathname === item.path;

                const Icon = item.icon;

                return (
                    <Link href={item.path} key={item.name} passHref>
                        <div
                            className={
                                `flex items-center py-3 px-4 gap-3 ${isActive
                                    ? "border-r-4 md:border-r-[6px] bg-orange-600/10 border-orange-500/90"
                                    : "hover:bg-gray-100/90 border-white"
                                }`
                            }
                        >
                            <Icon />
                            <p className='md:block hidden text-center'>{item.name}</p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default SideBar;
