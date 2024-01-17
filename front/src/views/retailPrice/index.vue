<template>
  <OurPage width="wide" wide-page :title="$t('title.retailPrice')">
    <template #header-right>
      <OurButton
        :text="$t('button.filter')"
        class="product-filter"
        size="sm"
        @click="onClickOpenFilterModal"
      >
        <template #icon-left>
          <OurSvgIcon name="Filter" size="sm" />
        </template>
      </OurButton>
    </template>

    <div class="product-header">
      <OurDropdown variant="transparent" :text="$t('label.showProductByType')">
        <div class="product-type-item" @click="onClickShowProductType(productTypes.sofa)">
          <div>
            {{ $t("label.sofa") }}
          </div>

          <OurSvgIcon v-if="isSelectedProductType.sofa" size="sm" name="Check" />
        </div>

        <div class="product-type-item" @click="onClickShowProductType(productTypes.cornerSofa)">
          <div>
            {{ $t("label.cornerSofa") }}
          </div>

          <OurSvgIcon v-if="isSelectedProductType.cornerSofa" size="sm" name="Check" />
        </div>

        <div class="product-type-item" @click="onClickShowProductType(productTypes.bed)">
          <div>
            {{ $t("label.bed") }}
          </div>

          <OurSvgIcon v-if="isSelectedProductType.bed" size="sm" name="Check" />
        </div>

        <div class="product-type-item" @click="onClickShowProductType(productTypes.modularSystem)">
          <div>
            {{ $t("label.modularSystem") }}
          </div>

          <OurSvgIcon v-if="isSelectedProductType.modularSystem" size="sm" name="Check" />
        </div>
      </OurDropdown>
    </div>

    <div class="product-wrapper">
      <ProductCard v-for="item in productItems" :key="item.id" :item="item" />
    </div>

    <FilterModal v-model="isShownFilterModal" :active-filter.sync="filter" />
  </OurPage>
</template>

<script>
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";
import OurSvgIcon from "@/components/OurSvgIcon";
import ProductCard from "./components/ProductCard";
import { mapActions, mapState } from "vuex";
import FilterModal from "./components/FilterModal";
import OurDropdown from "@/components/OurDropdown";
import { PRODUCT_TYPE } from "@/api/product";

export default {
  components: { OurDropdown, FilterModal, ProductCard, OurSvgIcon, OurButton, OurPage },

  data: () => ({
    isShownFilterModal: false,
    filter: {
      productIds: [],
      productType: [],
      priceFrom: "",
      priceTo: "",
      categoryIds: [],
      fillingIds: [],
      toggleMechanismIds: [],
      frameIds: [],
    },
    productTypes: PRODUCT_TYPE,
  }),

  computed: {
    ...mapState("product", ["retailProducts"]),

    isSelectedProductType() {
      return {
        sofa: !!this.filter.productType.find((item) => item === PRODUCT_TYPE.sofa),
        cornerSofa: !!this.filter.productType.find((item) => item === PRODUCT_TYPE.cornerSofa),
        bed: !!this.filter.productType.find((item) => item === PRODUCT_TYPE.bed),
        modularSystem: !!this.filter.productType.find(
          (item) => item === PRODUCT_TYPE.modularSystem
        ),
      };
    },

    isActiveFilter() {
      return (
        this.filter.productIds.length ||
        this.filter.productType.length ||
        this.filter.priceFrom ||
        this.filter.priceTo ||
        this.filter.categoryIds.length ||
        this.filter.fillingIds.length ||
        this.filter.toggleMechanismIds.length ||
        this.filter.frameIds.length
      );
    },

    productItems() {
      let products = [...this.retailProducts];

      if (this.isActiveFilter) {
        products = products.filter((item) => {
          let isFiltered = true;

          const productPrice = [
            Number(item.specialPrice),
            Number(item.firstCategory),
            Number(item.secondCategory),
            Number(item.thirdaryCategory),
            Number(item.fourthCategory),
            Number(item.fivesCategory),
          ];

          if (this.filter.productIds.length && isFiltered) {
            isFiltered = !!this.filter.productIds.find((product) => product === item.id);
          }

          if (this.filter.productType.length && isFiltered) {
            isFiltered = !!this.filter.productType.find((product) => product === item.type);
          }

          if (this.filter.priceFrom && isFiltered) {
            isFiltered = !!productPrice.find((price) => price >= this.filter.priceFrom);
          }

          if (this.filter.priceTo && isFiltered) {
            isFiltered = !!productPrice.find((price) => price <= this.filter.priceTo);
          }

          if (this.filter.fillingIds.length && isFiltered) {
            isFiltered = !!this.filter.fillingIds.find((filling) => filling === item.fillingId);
          }

          if (this.filter.toggleMechanismIds.length && isFiltered) {
            isFiltered = !!this.filter.toggleMechanismIds.find(
              (toggleMechanism) => toggleMechanism === item.toggleMechanismId
            );
          }

          if (this.filter.frameIds.length && isFiltered) {
            isFiltered = !!this.filter.frameIds.find((frame) => frame === item.frameId);
          }

          if (this.filter.categoryIds.length && isFiltered) {
            const specialCategory = !!this.filter.categoryIds.find((category) => category === 0);
            const firstCategory = !!this.filter.categoryIds.find((category) => category === 1);
            const secondCategory = !!this.filter.categoryIds.find((category) => category === 2);
            const thirdsCategory = !!this.filter.categoryIds.find((category) => category === 3);
            const fourthCategory = !!this.filter.categoryIds.find((category) => category === 4);
            const fivesCategory = !!this.filter.categoryIds.find((category) => category === 5);

            if (specialCategory) {
              isFiltered = !!item.specialPrice;
            }

            if (isFiltered && firstCategory) {
              isFiltered = !!item.firstCategory;
            }

            if (isFiltered && secondCategory) {
              isFiltered = !!item.secondCategory;
            }

            if (isFiltered && thirdsCategory) {
              isFiltered = !!item.thirdaryCategory;
            }

            if (isFiltered && fourthCategory) {
              isFiltered = !!item.fourthCategory;
            }

            if (isFiltered && fivesCategory) {
              isFiltered = !!item.fivesCategory;
            }
          }

          if (isFiltered) {
            return item;
          }
        });
      }

      return products.map((item) => {
        let photos = false;

        if (item.photos) {
          const photosInArray = item.photos.split(",");

          photos = photosInArray.map((photo) => {
            return {
              name: photo,
              image: `${process.env.VUE_APP_DOMAIN}/products/${item.name}/${photo}`,
            };
          });
        }

        return {
          ...item,
          specialPrice: {
            sum: item.specialPrice,
            currencySymbol: item.currencySymbol,
          },
          firstCategory: {
            sum: item.firstCategory,
            currencySymbol: item.currencySymbol,
          },
          secondCategory: {
            sum: item.secondCategory,
            currencySymbol: item.currencySymbol,
          },
          thirdaryCategory: {
            sum: item.thirdaryCategory,
            currencySymbol: item.currencySymbol,
          },
          fourthCategory: {
            sum: item.fourthCategory,
            currencySymbol: item.currencySymbol,
          },
          fivesCategory: {
            sum: item.fivesCategory,
            currencySymbol: item.currencySymbol,
          },
          generalSize: `${item.generalSizeLength} x ${item.generalSizeWidth} x ${item.generalSizeHeight}`,
          sleepSize: `${item.sizeLength} x ${item.sizeWidth}`,
          photos,
        };
      });
    },
  },

  async created() {
    await this.getRetailProducts();
  },

  methods: {
    ...mapActions("product", ["getRetailProducts"]),

    onClickShowProductType(type) {
      const isSelectedType = this.filter.productType.find((item) => item === type);

      if (isSelectedType) {
        this.filter.productType = this.filter.productType.filter((item) => item !== type);
      } else {
        this.filter.productType.push(type);
      }
    },

    onClickOpenFilterModal() {
      this.isShownFilterModal = true;
    },
  },
};
</script>

<style lang="postcss" scoped>
.product {
  &-filter {
    @apply w-auto;
  }

  &-header {
    @apply flex;
    @apply mb-6 space-x-4;

    &-button {
      @apply w-auto;
    }
  }

  &-wrapper {
    @apply grid grid-cols-1 gap-4 sm:grid-cols-2;
  }

  &-type-item {
    @apply flex items-center justify-between;

    div {
      @apply p-0;
    }
  }
}
</style>
