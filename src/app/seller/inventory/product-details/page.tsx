"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { useTranslations } from "next-intl";
import { fetchInventoryById } from "@/rtk/slices/inventory/inventory";
import Image from "next/image";
import { Package, DollarSign, Layers } from "lucide-react";

export default function OrderDetailsPage() {
    const t = useTranslations();
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const Id = searchParams.get("id");

    useEffect(() => {
        if (Id) {
            dispatch(fetchInventoryById(Number(Id)));
        }
    }, [dispatch, Id]);

    const { item, loading } = useAppSelector((s) => s.inventory);

    if (loading) {
        return (
            <section className="p-6 lg:p-10 w-full animate-pulse">
                {/* Header */}
                <div className="mb-8 space-y-2">
                    <div className="h-6 w-40 bg-gray-200 rounded" />
                    <div className="h-4 w-60 bg-gray-100 rounded" />
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row gap-8">

                    {/* LEFT */}
                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200 rounded" />
                            <div className="h-10 w-full bg-gray-100 rounded-lg" />
                        </div>

                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200 rounded" />
                            <div className="h-10 w-full bg-gray-100 rounded-lg" />
                        </div>

                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200 rounded" />
                            <div className="h-10 w-full bg-gray-100 rounded-lg" />
                        </div>
                    </div>

                    {/* RIGHT (IMAGE) */}
                    <div className="w-full md:w-65 h-65 bg-gray-100 rounded-xl" />
                </div>
            </section>
        );
    }

    return (
        <section className="p-6 lg:p-10 w-full">
            {/* Header */}
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-main">
                    {t("productDetails")}
                </h3>
            </div>

            {/* Form Style Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row gap-8">

                {/* LEFT */}
                <div className="flex-1 space-y-6">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            {t("name")}
                        </label>
                        <input
                            type="text"
                            value={item?.name || ""}
                            readOnly
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 cursor-not-allowed"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            {t("Price")}
                        </label>
                        <input
                            type="text"
                            value={`${item?.price ?? ""} EGP`}
                            readOnly
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 cursor-not-allowed"
                        />
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            {t("quantity")}
                        </label>
                        <input
                            type="text"
                            value={item?.quantity ?? ""}
                            readOnly
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 cursor-not-allowed"
                        />
                    </div>

                </div>

                {/* RIGHT (IMAGE) */}
                <div className="w-full md:w-65 space-y-3">
                    <label className="block text-sm font-medium text-gray-600">
                        {t("image")}
                    </label>

                    <div className="w-full h-65 relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                        <Image
                            src={item?.imagePath || "/placeholder.png"}
                            alt={item?.name || "Product Image"}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}