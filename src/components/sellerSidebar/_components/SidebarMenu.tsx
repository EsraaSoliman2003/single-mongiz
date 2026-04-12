"use client";

import Link from "next/link";
import {
  HiHome,
  HiOutlineCollection,
  HiOutlineTag,
  HiOutlineTicket,
  HiOutlineShoppingBag,
  HiOutlineClipboardList,
  HiOutlineStar,
  HiOutlineArchive,
} from "react-icons/hi";
import { useTranslations } from "next-intl";

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

type MenuItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

export default function SidebarMenu({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  const t = useTranslations();

  const allMenuItems: MenuItem[] = [
    {
      name: t("dashboard"),
      icon: <HiHome className="text-xl" />,
      path: "/seller",
    },
    {
      name: t("products"),
      icon: <HiOutlineShoppingBag className="text-xl" />,
      path: `/seller/products`,
    },
    {
      name: t("Orders"),
      icon: <HiOutlineClipboardList className="text-xl" />,
      path: `/seller/orders`,
    },
    {
      name: t("Inventory"),
      icon: <HiOutlineArchive className="text-xl" />,
      path: `/seller/inventory`,
    }
  ];

  return (
    <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
      {allMenuItems.map((item) => {
        const isActive = pathname === item.path;

        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={onNavigate}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition",
              isActive
                ? "bg-main text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            )}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}