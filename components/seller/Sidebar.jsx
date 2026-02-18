import React from 'react';
import Link from 'next/link';
import { assets } from '../../assets/assets';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const SideBar = () => {
    const pathname = usePathname()
    const menuItems = [
        { name: 'Add Product', path: '/seller', icon: assets.add_icon },
        { name: 'Product List', path: '/seller/product-list', icon: assets.product_list_icon },
        { name: 'Featured Section', path: '/seller/featured', icon: assets.star_icon },
        { name: 'Hero Slider', path: '/seller/hero-slider', icon: assets.arrow_right_icon_colored },
        { name: 'Homepage Banner', path: '/seller/banner', icon: assets.box_icon },
        { name: 'Branding & Footer', path: '/seller/branding', icon: assets.box_icon },
        { name: 'Newsletter', path: '/seller/newsletter', icon: assets.redirect_icon },
        { name: 'Coupons', path: '/seller/coupons', icon: assets.decrease_arrow },
        { name: 'Shipping & Fees', path: '/seller/shipping', icon: assets.box_icon },
        { name: 'Customers', path: '/seller/customers', icon: assets.user_icon },
        { name: 'Analytics', path: '/seller/analytics', icon: assets.increase_arrow },
        { name: 'Payments', path: '/seller/payments', icon: assets.order_icon },
        { name: 'Orders', path: '/seller/orders', icon: assets.order_icon },
        { name: 'Messages', path: '/seller/messages', icon: assets.redirect_icon },
    ];

    return (
        <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-300 py-2 flex flex-col'>
            {menuItems.map((item) => {

                const isActive = pathname === item.path;

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
                            <Image
                                src={item.icon}
                                alt={`${item.name.toLowerCase()}_icon`}
                                className="w-5 h-5"
                            />
                            <p className='md:block hidden text-center'>{item.name}</p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default SideBar;
