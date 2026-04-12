"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchReviewsByProduct } from "@/rtk/slices/userProductReviewSlice/userProductReviewSlice";
import CardReview from "./CardReview";
import SectionHeader from "@/app/admin/_components/SectionHeader";

export default function ProductContent() {
    const params = useParams();
    const id = params?.id; // string | undefined
    const t = useTranslations();
    const dispatch = useAppDispatch();

    const { items, loading } = useAppSelector((s) => s.userProductReview);
    useEffect(() => {
        dispatch(fetchReviewsByProduct({ productId: Number(id) }))
    }, [dispatch])

    return (
        <div className="p-4 md:p-8 space-y-6">
            <SectionHeader
                title={t("reviewsTitle")}
                subtitle={t("reviewsSubtitle")}
            />            {items.map((review, index) => (
                <CardReview key={index} review={review} />
            ))}
        </div>
    );
}
