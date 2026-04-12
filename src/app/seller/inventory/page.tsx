"use client";

import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import { useTranslations } from "next-intl";
import AdminGridLayout from "@/components/adminGridLayout/AdminGridLayout";
import AdminProductCard from "./_components/AdminProductCard";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { deleteInventory, fetchInventory, uploadInventoryExcel } from "@/rtk/slices/inventory/inventory";
import { toast } from "sonner";
import SectionHeader from "./_components/SectionHeader";

export default function Page() {
    const t = useTranslations();
    const dispatch = useAppDispatch();

    const handleDelete = (id: number) => {
        toast.custom((toastId) => (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-85 space-y-4">

                {/* Message */}
                <p className="text-sm font-medium leading-relaxed text-gray-800">
                    {t("deleteConfirmProduct")}؟
                </p>

                {/* Buttons */}
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-900 text-sm hover:bg-gray-300 transition"
                        onClick={() => toast.dismiss(toastId)}
                    >
                        {t("Cancel")}
                    </button>

                    <button
                        type="button"
                        className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 transition"
                        onClick={async () => {
                            toast.dismiss(toastId);
                            try {
                                await dispatch(deleteInventory(id));
                                toast.success(t("Product deleted successfully"));
                            } catch (e) {
                                toast.error(typeof e === "string" ? e : t("Failed to delete product"));
                            }
                        }}
                    >
                        {t("Delete")}
                    </button>
                </div>
            </div>
        ));
    };

    const { data, loading, error } = useAppSelector((s) => s.inventory)
    useEffect(() => {
        dispatch(fetchInventory());
    }, [dispatch]);

    return (
        <div className="p-4 md:p-8 space-y-6">
            <SectionHeader />

            <div className="relative mt-6">
                <AdminGridLayout isEmpty={data.length === 0}>
                    {data.map((product) => (
                        <AdminProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            image={product?.imagePath}
                            quantity={product?.quantity}
                            handleDelete={handleDelete}
                        />
                    ))}
                </AdminGridLayout>
            </div>
        </div>
    );
}