"use client";

import React, { useEffect } from "react";
import OrderItem from "./OrderItem";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchSellerOrders } from "@/rtk/slices/orders/ordersSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function OrdersList() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { sellerOrders, sellerOrdersLoading } = useAppSelector((s) => s.order);

  const router = useRouter();
  const sp = useSearchParams();

  const pageSize = 12;

  const currentPage = Number(sp.get("page") || 1);

  useEffect(() => {
    dispatch(fetchSellerOrders());
  }, [dispatch]);

  if (sellerOrdersLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-primary"></div>
      </div>
    );
  }

  const orders = [...sellerOrders].reverse();

  const pageCount = Math.ceil(orders.length / pageSize);

  const paginatedOrders = orders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(sp.toString());
    params.set("page", newPage.toString());
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Orders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedOrders.map((order) => (
          <OrderItem key={order.id} {...order} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded border hover:bg-gray-100 transition disabled:opacity-50"
        >
          {t("Previous")}
        </button>

        <span className="px-2 py-2">
          {currentPage} / {pageCount}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pageCount}
          className="px-4 py-2 rounded border hover:bg-gray-100 transition disabled:opacity-50"
        >
          {t("Next")}
        </button>
      </div>
    </div>
  );
}