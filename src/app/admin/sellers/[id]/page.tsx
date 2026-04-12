"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { approveSeller, fetchPublicSellerProfile } from "@/rtk/slices/seller/sellerSlice";
import {
    User,
    Mail,
    Phone,
    MapPin,
    BadgeCheck,
    FileText,
    CreditCard,
    X,
} from "lucide-react";
import { toast } from "sonner";

export default function SellerDetailsPage() {
    const t = useTranslations();
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const { profile, loading } = useAppSelector((s) => s.seller);

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            dispatch(fetchPublicSellerProfile(Number(id)));
        }
    }, [id, dispatch]);

    if (loading || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const handleApproveVendor = async (id: number) => {
        try {
            await dispatch(approveSeller(id)).unwrap();

            toast.success(t("vendorAccepted"));

            dispatch(fetchPublicSellerProfile(Number(id)));

        } catch (error) {
            toast.error(t("vendorApprovalFailed"));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* HEADER */}
                <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-6">
                    <div
                        onClick={() => profile.image && setPreviewImage(profile.image)}
                        className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border cursor-pointer hover:scale-105 transition"
                    >
                        {profile.image ? (
                            <Image
                                src={profile.image}
                                alt="seller"
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-full h-full text-gray-400 p-4" />
                        )}
                    </div>

                    <div className="flex-1">
                        <h1 className="text-xl font-semibold text-gray-800">
                            {profile.fullName || profile.name}
                        </h1>

                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                                <Mail size={14} /> {profile.email}
                            </span>
                            <span className="flex items-center gap-1">
                                <Phone size={14} /> {profile.phone}
                            </span>
                            <span className="flex items-center gap-1">
                                <MapPin size={14} /> {profile.address}
                            </span>
                        </div>
                    </div>
                </div>

                {/* CARDS */}
                <div className="grid md:grid-cols-2 gap-6">

                    {/* COMMERCIAL */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <FileText size={18} /> {t("CommercialRegister")}
                        </h2>

                        <p className="text-gray-600 text-sm">
                            {profile.commercialRegisterText}
                        </p>

                        {profile.commercialRegisterImage && (
                            <img
                                src={profile.commercialRegisterImage}
                                onClick={() =>
                                    setPreviewImage(profile.commercialRegisterImage ?? null)
                                }
                                className="w-full h-52 object-cover rounded-xl border cursor-pointer hover:opacity-90 transition"
                            />
                        )}
                    </div>

                    {/* TAX */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <CreditCard size={18} /> {t("TaxCard")}
                        </h2>

                        <p className="text-gray-600 text-sm">
                            {profile.taxCardText}
                        </p>

                        {profile.taxCardImage && (
                            <img
                                src={profile.taxCardImage}
                                onClick={() =>
                                    setPreviewImage(profile.taxCardImage ?? null)
                                }
                                className="w-full h-52 object-cover rounded-xl border cursor-pointer hover:opacity-90 transition"
                            />
                        )}
                    </div>
                </div>

                {/* Footer Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {t("SellerInfo")}
                        </h2>

                        {/* Status Badge */}
                        {profile.isApproved ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                <BadgeCheck size={14} />
                                {t("Approved")}
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                                {t("Pending")}
                            </span>
                        )}
                    </div>

                    {/* Info Grid */}
                    <div className="grid md:grid-cols-3 gap-6 text-sm">
                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <span className="text-gray-400 text-xs">
                                {t("CountryCode")}
                            </span>
                            <p className="mt-1 font-medium text-gray-800">
                                {profile.countryCode || "-"}
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <span className="text-gray-400 text-xs">
                                {t("SellerID")}
                            </span>
                            <p className="mt-1 font-medium text-gray-800">
                                #{profile.id}
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col justify-between">
                            <span className="text-gray-400 text-xs mb-2">
                                {t("Action")}
                            </span>

                            {!profile.isApproved ? (
                                <button
                                    onClick={() => {
                                        if (!profile.id) return;
                                        handleApproveVendor(profile.id);
                                    }}
                                    disabled={loading}
                                    className={`
                                        inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                                        text-sm font-medium transition-all duration-200
                                        border shadow-sm
                                        ${loading
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-green-600 text-white hover:bg-green-700 active:scale-[0.98]"
                                        }
                                    `}
                                >
                                    <BadgeCheck size={16} />
                                    {loading ? t("Loading") : t("Approve")}
                                </button>
                            ) : (
                                <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                                    <BadgeCheck size={16} />
                                    {t("AlreadyApproved")}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= IMAGE MODAL ================= */}
            {previewImage && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="relative max-w-3xl w-full px-4">
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute -top-10 right-0 text-white hover:text-red-400"
                        >
                            <X size={28} />
                        </button>

                        <img
                            src={previewImage}
                            className="w-full max-h-[80vh] object-contain rounded-xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}