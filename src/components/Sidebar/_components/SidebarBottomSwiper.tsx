"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import {
    HiHome,
    HiOutlinePhotograph,
    HiOutlineCollection,
    HiOutlineQuestionMarkCircle,
    HiOutlineUsers,
    HiOutlineCog,
    HiOutlinePhone,
    HiOutlineSupport,
    HiOutlineTag,
    HiOutlineTicket,
    HiOutlineStar,
    HiOutlineClipboardList,
    HiOutlineShoppingBag,
} from "react-icons/hi";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Bell, Image } from "lucide-react";

export default function SidebarBottomSwiper({
    onNavigate,
}: {
    onNavigate: () => void;
}) {
    const pathname = usePathname();
    const t = useTranslations();

    const items = [
        {
            name: t("dashboard"),
            icon: <HiHome className="text-xl" />,
            path: "/admin",
        },
        {
            name: t("Logo"),
            icon: <Image className="text-xl" />,
            path: "/admin/logo",
        },
        {
            name: t("Slider"),
            icon: <HiOutlinePhotograph className="text-xl" />,
            path: "/admin/slider",
        },
        {
            name: t("Banners"),
            icon: <HiOutlineCollection className="text-xl" />,
            path: "/admin/banner",
        },
        {
            name: t("Coupon"),
            icon: <HiOutlineTicket className="text-xl" />,
            path: `/admin/coupon`,
        },
        {
            name: t("Brand"),
            icon: <HiOutlineTag className="text-xl" />,
            path: `/admin/brands`,
        },
        {
            name: t("categories"),
            icon: <HiOutlineCollection className="text-xl" />,
            path: `/admin/categories`,
        },
        {
            name: t("products"),
            icon: <HiOutlineShoppingBag className="text-xl" />,
            path: `/admin/products`,
        },
        {
            name: t("Orders"),
            icon: <HiOutlineClipboardList className="text-xl" />,
            path: `/admin/orders`,
        },
        {
            name: t("customers"),
            icon: <HiOutlineUsers className="text-xl" />,
            path: "/admin/customers",
        },
        {
            name: t("reviews"),
            icon: <HiOutlineStar className="text-xl" />,
            path: `/admin/reviews`,
        },
        {
            name: t("FAQs"),
            icon: <HiOutlineQuestionMarkCircle className="text-xl" />,
            path: "/admin/faq",
        },
        {
            name: t("Contact Info"),
            icon: <HiOutlinePhone className="text-xl" />,
            path: "/admin/contact-info",
        },
        // {
        //   name: t("How It Work"),
        //   icon: <BookOpen className="text-xl" />,
        //   path: "/admin/how-it-work",
        // },
        {
            name: t("Notification Mobile"),
            icon: <Bell className="text-xl" />,
            path: "/admin/notification-mobile",
        },
        // {
        //   name: t("Social"),
        //   icon: <Share2 className="text-xl" />,
        //   path: "/admin/social",
        // },
        {
            name: t("Support"),
            icon: <HiOutlineSupport className="text-xl" />,
            path: "/admin/support",
        },
        // {
        //   name: t("settings"),
        //   icon: <HiOutlineCog className="text-xl" />,
        //   path: "/admin/settings",
        // },
    ];

    const isActive = (itemPath: string) => {
        if (itemPath === "/admin") {
            return pathname === "/admin";
        }

        return pathname.startsWith(itemPath);
    };

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white py-2 z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.15)] lg:hidden">

            {/* left fade */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white to-transparent z-10" />

            {/* right fade */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white to-transparent z-10" />

            <Swiper spaceBetween={10} slidesPerView={3.6} className="px-2 h-12">
                {items.map((item) => {
                    const active = isActive(item.path);

                    return (
                        <SwiperSlide key={item.path}>
                            <Link
                                href={item.path}
                                onClick={onNavigate}
                                className={`flex flex-col items-center text-xs transition ${active ? "text-main" : "text-gray-500"
                                    }`}
                            >
                                <div
                                    className={`w-8 h-8 flex items-center justify-center rounded-xl transition ${active ? "text-main" : ""
                                        }`}
                                >
                                    {item.icon}
                                </div>
                                <span>{item.name}</span>
                            </Link>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
}