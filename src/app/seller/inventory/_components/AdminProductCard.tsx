"use client";

import Image from "next/image";
import { pen } from "@/assets";
import { FiRepeat, FiTrash2 } from "react-icons/fi";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useAppSelector } from "@/rtk/hooks";
import { useState } from "react";
import { ExternalLink } from "lucide-react";

interface Props {
  id: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  handleDelete?: (id: number) => void;
}

const ProductCard: React.FC<Props> = ({
  id,
  name,
  price,
  image,
  quantity,
  handleDelete
}) => {
  const t = useTranslations();
  const { deleteLoading } = useAppSelector((s) => s.inventory)

  return (
    <div className="rounded-xl bg-white box-shadow">
      {/* Image */}
      <div className="px-2 pt-2">
        <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden bg-gray-50">
          {image && (
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain"
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex items-center justify-between">
        <div>

          <h3 className="mt-2 text-sm title-color line-clamp-1">{name}</h3>
          {/* <p className="text-sm text-gray-600 mt-1">{price}</p> */}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Edit */}
          <Link
            href={`/seller/inventory/product-details?id=${id}`}
            className="relative w-5 h-5 block text-blue-500 hover:text-blue-600 transition-all"
            aria-label={t("edit")}
          >
            <ExternalLink size={20} />
          </Link>

          {/* Transfer */}
          <Link
            href={`/seller/inventory/transferproduct?id=${id}`}
            className="relative w-5 h-5 block text-gray-400 hover:text-gray-600 transition-all"
          >
            <FiRepeat size={20} />
          </Link>

          {/* Delete */}
          {
            handleDelete && (
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => handleDelete(id)}
                className="text-red-500 hover:text-red-600 transition"
                aria-label={t("deleteLabel")}
              >
                <FiTrash2 size={20} />
              </button>
            )
          }
        </div>
      </div>

    </div>
  );
};

export default ProductCard;
