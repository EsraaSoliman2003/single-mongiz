// VendorDetailsDemo.tsx
"use client";

import React, { useEffect } from "react";
import { Phone, Mail, MapPin, X } from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchPublicSellerProfile } from "@/rtk/slices/seller/sellerSlice";

const VendorDetailsDemo: React.FC = () => {
    const t = useTranslations();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const sellerId = searchParams.get("seller");

    const deleteFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("seller");
        router.push(`${pathname}?${params.toString()}`);
    };

    const dispatch = useAppDispatch();
    const { profile } = useAppSelector((s) => s.seller)

    useEffect(() => {
        if (sellerId) {
            dispatch(fetchPublicSellerProfile(Number(sellerId)));
        }
    }, [sellerId]);

    if (!sellerId) {
        return null;
    }

    return (
        <div className="relative">
            {/* Close button to clear filter */}
            <button
                onClick={deleteFilter}
                className={`absolute top-0 ${t("dir") === "rtl" ? "left-0" : "right-0"} p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all`}
                aria-label="Clear filter"
            >
                <X size={20} />
            </button>

            {/* Vendor Image and Basic Info */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative w-full md:w-70 lg:w-80 h-48 rounded-md overflow-hidden">
                    <Image
                        src={profile?.image || "/not-found.jpg"}
                        alt={profile?.name || ""}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className={`flex-1 space-y-2 m-auto text-center md:text-start`}>
                    <h2 className="text-2xl lg:text-3xl font-light text-gray-800">{profile?.name}</h2>
                    <div className="text-gray-400 text-sm">
                        <span>الكود:</span>
                        <span className="text-gray-600 mx-2">{profile?.id}</span>
                    </div>
                </div>
            </div>

            {/* Vendor Contact Info */}
            <div className="mt-8 flex justify-around flex-col md:flex-row gap-4 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-gray-500 justify-center md:justify-start">
                    <MapPin size={18} className="text-gray-400" />
                    <span className="text-gray-600 text-sm">
                        {profile?.address}
                    </span>
                </div>

                <div className="flex items-center gap-3 text-gray-500 justify-center md:justify-start">
                    <Mail size={18} className="text-gray-400" />
                    <span className="text-gray-600 text-sm">{profile?.email}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-500 justify-center md:justify-start">
                    <Phone size={18} className="text-gray-400" />
                    <span className="text-gray-600 text-sm">{profile?.phone}</span>
                </div>
            </div>
        </div>
    );
};

export default VendorDetailsDemo;