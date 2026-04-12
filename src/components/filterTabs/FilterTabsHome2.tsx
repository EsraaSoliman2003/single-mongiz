"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation } from "swiper/modules";

import ProductsSection from "../productsSection/ProductsSection";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import NoData from "../noData/NoData";
import ProductSkeleton from "@/skeleton/ProductSkeleton";
import SubCategorySkeleton from "@/skeleton/SubCategorySkeleton";
import { fetchCategoryByIdHome2, fetchProductsByCategoryHome2, fetchSubCategoriesHome2 } from "@/rtk/slices/home/homeSlice2";

const categoryId = 3;

const FilterTabs = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations();

  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  /* Products */

  /* Subcategories */
  const { category, subCategories, products, loading } = useAppSelector((s) => s.home2);

  /* Fetch once */
  useEffect(() => {
    dispatch(fetchProductsByCategoryHome2({ categoryId }));
    dispatch(fetchSubCategoriesHome2(categoryId));
    dispatch(fetchCategoryByIdHome2(categoryId));
  }, [dispatch]);

  /* Change tab */
  const handleChangeSubCategory = (subCategoryId: number) => {
    dispatch(fetchProductsByCategoryHome2({ categoryId, subCategoryId }));
  };

  if (loading) {
    return (
      <div className="w-full my-5">
        <div className="container flex items-center py-4">
          <h2 className="text-lg font-bold text-gray-900 w-2/5 md:w-1/2">
            ...
          </h2>

          <div className="flex gap-3 w-3/5 md:w-1/2 justify-end">
            <SubCategorySkeleton />
          </div>
        </div>

        <div className="container">
          <ProductSkeleton count={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full my-5">
      <div className="container flex items-center py-4">
        <h2 className="text-lg font-bold text-gray-900 whitespace-nowrap w-2/5 md:w-1/2">
          {category?.name}
        </h2>

        <div className="flex items-center gap-3 w-3/5 md:w-1/2 justify-end">
          <Swiper
            modules={[Navigation]}
            observer
            observeParents
            onBeforeInit={(swiper) => {
              // @ts-ignore
              swiper.params.navigation.prevEl = prevRef.current;
              // @ts-ignore
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            spaceBetween={24}
            slidesPerView="auto"
            className="flex-1"
          >
            {subCategories?.length > 0 &&
              subCategories.map((item) => (
                <SwiperSlide key={item.id} className="w-auto!">
                  <button
                    onClick={() => handleChangeSubCategory(item.id)}
                    className="relative pb-2 text-md text-gray-500 transition whitespace-nowrap hover:text-orange-500"
                  >
                    {item.name}
                  </button>
                </SwiperSlide>
              ))}
          </Swiper>

          <button
            ref={prevRef}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200"
          >
            {t("dir") === "rtl" ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>

          <button
            ref={nextRef}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200"
          >
            {t("dir") === "rtl" ? (
              <ChevronLeft size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
        </div>
      </div>

      {products.length > 0 ? (
        <ProductsSection products={products} className="container" />
      ) : (
        <NoData />
      )}
    </div>
  );
};

export default FilterTabs;