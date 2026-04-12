"use client";

import React, { useEffect } from "react";
import { FiClock } from "react-icons/fi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import Link from "next/link";
import OrdersSkeleton from "@/skeleton/OrdersSkeleton";
import NoData from "@/components/noData/NoData";
import { fetchSellerOrders } from "@/rtk/slices/orders/ordersSlice";

/* ================= STATUS TYPES ================= */

type OrderStatus = "new" | "cancelled" | "delivered" | "processing";

type OrderItemProps = {
  id: number;
  status: number; // coming as number from backend
  name: string;
  timeCreateOrder: string;
};

/* ================= STATUS STYLE ================= */

const statusStyles: Record<
  OrderStatus,
  { bg: string; text: string; dot: string }
> = {
  new: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    dot: "bg-yellow-500",
  },
  cancelled: {
    bg: "bg-red-100",
    text: "text-red-700",
    dot: "bg-red-500",
  },
  delivered: {
    bg: "bg-green-100",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  processing: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    dot: "bg-orange-500",
  },
};

/* ================= STATUS MAPPER ================= */

const statusMap: Record<number, OrderStatus> = {
  1: "processing", // In Progress
  2: "delivered",  // Completed
  3: "cancelled",  // Canceled
};

/* ================= ORDER ITEM ================= */

const OrderItem = ({
  id,
  status,
  name,
  timeCreateOrder,
}: OrderItemProps) => {
  const t = useTranslations();

  const mappedStatus = statusMap[status] ?? "new";
  const { bg, text, dot } = statusStyles[mappedStatus];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleString("ar-EG", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Link
      href={`/seller/orders/order-details?id=${id}`}
      className="group flex items-center justify-between py-4 px-2 rounded-xl hover:bg-gray-50 transition-colors duration-200"
    >
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FF89041A] border border-[#FF8904] text-[#FF8904] font-bold shadow-sm group-hover:shadow-md transition-shadow">
          {name?.charAt(0) || "U"}
        </div>

        <div>
          <p className="font-semibold">{name}</p>

          <p className="text-xs text-gray-500 flex items-center gap-2">
            {/* 🕒 Time */}
            <span>• {formatDate(timeCreateOrder)}</span>
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="text-left">
        <p className="font-semibold text-gray-800">#{id}</p>

        <div className="flex items-center justify-end gap-1 mt-1">
          <span className={`w-2 h-2 rounded-full ${dot}`} />
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
          >
            {t(mappedStatus)}
          </span>
        </div>
      </div>
    </Link>
  );
};

/* ================= MAIN COMPONENT ================= */

export default function LatestOrders() {
  const t = useTranslations();
  const { sellerOrders, sellerOrdersLoading } = useAppSelector((s) => s.order);
  console.log(sellerOrders)
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSellerOrders());
  }, [dispatch]);

  return (
    <div className="bg-white rounded-2xl p-6 hover:shadow-md transition-shadow">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
            <FiClock className="text-xl" />
          </div>

          <div>
            <h2 className="text-md font-bold text-gray-800">
              {t("latestOrdersTitle")}
            </h2>
            <p className="text-gray-500 text-sm">
              {t("latestOrdersSubtitle")}
            </p>
          </div>
        </div>

        <Link href={"/seller/orders"} className="flex items-center text-sm text-gray-500 cursor-pointer hover:text-[#FF8904] transition-colors group">
          <span>{t("viewAll")}</span>
          {t("dir") === "rtl" ? (
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          ) : (
            <ChevronRight className="w-4 h-4 mr-1 group-hover:translate-x-1 transition-transform" />
          )}
        </Link>
      </div>

      {/* Orders List */}
      <div className="divide-y divide-gray-100">
        {sellerOrdersLoading ? (
          <OrdersSkeleton />
        ) : sellerOrders?.length > 0
          ? (
              sellerOrders?.slice().reverse().slice(0, 10).map((item: any) => (
              <OrderItem
                key={item.id}
                id={item.id}
                status={item.status}
                name={item.customerName || "User"}
                  timeCreateOrder={item.timeCreateOrder}
                  
              />
            ))
          )
          : <NoData />
        }
      </div>
    </div>
  );
}