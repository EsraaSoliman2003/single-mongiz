"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchInventory, uploadInventoryExcel } from "@/rtk/slices/inventory/inventory";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import Link from "next/link";

export default function SectionHeader() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { uploadLoading } = useAppSelector((s) => s.inventory)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Handle Excel Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await dispatch(uploadInventoryExcel(file)).unwrap();
      toast.success("File uploaded successfully");
      dispatch(fetchInventory()); // refresh data
    } catch (err: any) {
      toast.error(err || "Upload failed");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex items-center justify-between mb-6 bg-white rounded-2xl px-6 py-4 transition duration-300">
      <div>
        <h2 className="text-xl font-bold text-gray-800 relative inline-block">
          {t("Inventory")}
          <span className="block w-10 h-0.75 bg-main rounded-full mt-2"></span>
        </h2>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          {t("InventorySubtitle")}
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          href="/seller/inventory/add"
          className="
    px-4 py-2 rounded-md text-sm flex items-center justify-center gap-2 transition
    bg-main text-white hover:opacity-90 cursor-pointer
  "
        >
          + {t("Add")}
        </Link>

        <button
          type="button"
          disabled={uploadLoading}
          onClick={() => fileInputRef.current?.click()}
          className="
            px-4 py-2 rounded-md text-sm flex items-center justify-center gap-2 transition
            bg-main text-white hover:opacity-90 cursor-pointer disabled:opacity-60
          "
        >
          {uploadLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-white"></div>
          )}
          <span>{t("Import")}</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}