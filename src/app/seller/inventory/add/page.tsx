"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { Loader2, Plus } from "lucide-react";
import { addInventory } from "@/rtk/slices/inventory/inventory";
import FormImageUpload from "@/app/admin/_components/FormImageUpload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Page() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { addLoading } = useAppSelector((s) => s.inventory);
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    mainPrice: "",
    quantity: "",
    image: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.mainPrice || !form.quantity) {
      toast("Please fill all required fields");
      return;
    }

    try {
      await dispatch(
        addInventory({
          name: form.name,
          price: Number(form.mainPrice),
          quantity: Number(form.quantity),
          image: form.image || undefined,
        })
      );
      router.push("/seller/inventory");
      toast.success(t("Product added successfully"));
    } catch (e) {
      toast.error(typeof e === "string" ? e : t("Failed to add product"));
    }

    setForm({
      name: "",
      mainPrice: "",
      quantity: "",
      image: null,
    });
  };

  return (
    <section className="p-6 lg:pt-10 w-full">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-main">{t("AddProduct")}</h3>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row gap-8">
        {/* LEFT Inputs */}
        <div className="flex-1 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              {t("name")}
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              {t("Price")}
            </label>
            <input
              type="number"
              name="mainPrice"
              value={form.mainPrice}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              {t("quantity")}
            </label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>

        {/* RIGHT Image */}
        <div className="w-full md:w-65 space-y-3">
          <label className="block text-sm font-medium text-gray-600">
            {t("image")}
          </label>
          <FormImageUpload
            name="image"
            previewUrl={form.image ? URL.createObjectURL(form.image) : null}
            onChange={handleChange}
            showClearButton
            square
            className="w-full border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-400 transition-colors"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3 mt-6 justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="py-2 px-6 text-white bg-main flex items-center gap-2 rounded-lg justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={addLoading}
        >
          {addLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {t("Add")}
        </button>
      </div>
    </section>
  );
}