"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { resetDraft, setField } from "@/rtk/slices/ui/ProductSlice";
import StepIndicator from "./_components/StepIndicator";
import BasicInformation from "./_components/BasicInformation";
import Pricing from "./_components/Pricing";
import Media from "./_components/Media";
import Attributes from "./_components/Attributes";
import Keywords from "./_components/Keywords";
import FormSubmitButton from "../../_components/FormSubmitButton";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { fetchInventoryById, transferProduct } from "@/rtk/slices/inventory/inventory";
/* ---------------------------------- */
/* Step Icon Type (matches StepIndicator) */
/* ---------------------------------- */

type StepIcon =
  | "FileText"
  | "FileEdit"
  | "DollarSign"
  | "Image"
  | "Layers"
  | "Tag"
  | "Key"
  | "Settings";

const AddProductForm: React.FC = () => {
  const router = useRouter();
  const t = useTranslations("addProduct");
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const { item, loading, addLoading } = useAppSelector((s) => s.inventory)
  const productId = searchParams.get("id");

  useEffect(() => {
    return () => {
      dispatch(resetDraft());
    };
  }, [dispatch]);

  useEffect(() => {
    if (productId) {
      dispatch(fetchInventoryById(Number(productId)));
    }
  }, [productId, dispatch]);

  useEffect(() => {
    if (item) {
      dispatch(setField({ key: "name", value: item?.name || "" }));
      dispatch(setField({ key: "mainPrice", value: item?.price || 0 }));
      dispatch(setField({ key: "quantity", value: item?.quantity || 0 }));
      dispatch(setField({ key: "mainImageUrl", value: item?.imagePath ?? null }));
    }
  }, [item, dispatch]);


  const [currentStep, setCurrentStep] = useState(0);
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const productDraft = useAppSelector((s) => s.productDraft);

  /* ---------------------------------- */
  /* Step Meta (for StepIndicator only) */
  /* ---------------------------------- */

  const stepMeta: { key: string; icon: StepIcon }[] = [
    { key: "basic", icon: "FileText" },
    { key: "attributes", icon: "Layers" },
    { key: "media", icon: "Image" },
    { key: "pricing", icon: "DollarSign" },
    // { key: "types", icon: "Tag" },
    { key: "keywords", icon: "Settings" },
  ];

  /* ---------------------------------- */
  /* Step Renderers (for actual UI) */
  /* ---------------------------------- */

  const stepRenderers: (() => React.ReactNode)[] = [
    () => <BasicInformation />,
    () => <Attributes />,
    () => (
      <Media
        mainFile={mainFile}
        setMainFile={setMainFile}
        imageFiles={imageFiles}
        setImageFiles={setImageFiles}
      />
    ),
    () => <Pricing />,
    // () => <ProductTypes />,
    () => <Keywords />,
  ];

  /* ---------------------------------- */
  /* Validation Per Step */
  /* ---------------------------------- */

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0:
        return (
          productDraft.name.trim() !== "" &&
          productDraft.categoryId !== null &&
          productDraft.categoryId !== 0 &&
          productDraft.brandId !== 0 &&
          productDraft.description?.trim() !== ""

        );

      case 2:
        if (!item)
          return !!mainFile;

      case 3:
        return (
          productDraft.mainPrice > 0 &&
          productDraft.mainPrice < 1000000
        );

      default:
        return true;
    }
  };

  /* ---------------------------------- */
  /* Navigation */
  /* ---------------------------------- */

  const handleNext = () => {
    if (!isCurrentStepValid()) {
      alert("Please fill all required fields before continuing.");
      return;
    }

    if (currentStep < stepMeta.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  /* ---------------------------------- */
  /* Submit */
  /* ---------------------------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (item) {
        await dispatch(
          transferProduct({
            id: item.id,

            // name: productDraft.name,
            description: productDraft.description,
            // mainPrice: productDraft.mainPrice,
            categoryId: productDraft.categoryId,
            brandId: productDraft.brandId,
            subCategoryId: productDraft.subCategoryId,

            discount: productDraft.discount,
            // quantity: productDraft.quantity,
            limitProducts: productDraft.limitProducts,
            limitStock: productDraft.limitStock,

            // mainImage: mainFile ?? undefined,
            // images: imageFiles,

            // New items: do NOT exist in selectedProduct
            additionalData: productDraft.additionalData ?? [],
            variants: productDraft.variants.map((v) => ({
              attributes: v.attributes,
              quantity: v.quantity,
            })),

            keywords: productDraft.keywords,
            
          })
        ).unwrap();
      } else {
        toast("Product not found");
      }
      dispatch(resetDraft());
      router.push("/seller/products");
      toast(t("productAddedsuccessfully"))
    } catch (error) {
      console.log(error);
    }
  };

  const CurrentStep = stepRenderers[currentStep];

  /* ---------------------------------- */
  /* JSX */
  /* ---------------------------------- */

  if (loading)
    return (
      <div className="text-center min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-dark flex items-center gap-2">
          {t("title")}
        </h1>

        {/* Step Indicator */}
        <StepIndicator
          steps={stepMeta}
          currentStep={currentStep}
          onStepClick={setCurrentStep}
        />

        {/* Current Step */}
        {CurrentStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-6 py-2 border border-gray-300 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            {t("previous")}
          </button>

          {currentStep === stepMeta.length - 1 ? (
            <FormSubmitButton
              text={t("submit")}
              className="min-w-40"
              loading={addLoading}
            />
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={!isCurrentStepValid()}
              className="px-6 py-2 bg-main text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {t("next")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;