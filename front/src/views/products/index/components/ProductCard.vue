<template>
  <div class="product-card">
    <div>
      <OurSlider
        v-if="item.photos"
        class="product-card-slider"
        :slides-per-view="1"
        :items="item.photos"
        @clickImage="onClickImageOpenModal"
      />

      <div v-else class="product-card-without-image">
        <OurSvgIcon name="Image-not" size="3xl" />

        <div class="product-card-without-image-title">
          {{ $t("label.photoWithout") }}
        </div>
      </div>
    </div>

    <OurButton
      v-if="false"
      :text="$t('button.createOrder')"
      class="product-card-button"
      @click="onClickShowCreateOrderModal"
    />

    <div class="product-card-block">
      <div class="product-card-title">
        {{ $t("label.productName") }}: <span class="product-card-title-span">{{ item.name }}</span>
      </div>

      <div class="product-card-title">
        {{ $t("label.productType") }}:
        <span class="product-card-title-span">{{ $t(`label.${item.type}`) }}</span>
      </div>

      <div class="product-card-prices">
        <div class="product-card-prices-title">{{ $t("label.price") }}:</div>

        <div class="product-card-prices-list">
          <div class="product-card-prices-list-item">
            <div class="product-card-prices-list-title">{{ $t("label.specialPrice") }}:</div>

            <OurMoney
              v-if="item.specialPrice.sum"
              class="product-card-prices-list-money"
              :item="item.specialPrice"
              size="xl"
            />

            <div v-else class="product-card-prices-not">–</div>
          </div>

          <div class="product-card-prices-list-item">
            <div class="product-card-prices-list-title">
              {{ $t("label.categoryNumber", { title: 1 }) }}:
            </div>

            <OurMoney
              v-if="item.firstCategory.sum"
              class="product-card-prices-list-money"
              :item="item.firstCategory"
              size="xl"
            />

            <div v-else class="product-card-prices-not">–</div>
          </div>

          <div class="product-card-prices-list-item">
            <div class="product-card-prices-list-title">
              {{ $t("label.categoryNumber", { title: 2 }) }}:
            </div>

            <OurMoney
              v-if="item.secondCategory.sum"
              class="product-card-prices-list-money"
              :item="item.secondCategory"
              size="xl"
            />

            <div v-else class="product-card-prices-not">–</div>
          </div>

          <div class="product-card-prices-list-item">
            <div class="product-card-prices-list-title">
              {{ $t("label.categoryNumber", { title: 3 }) }}:
            </div>

            <OurMoney
              v-if="item.thirdaryCategory.sum"
              class="product-card-prices-list-money"
              :item="item.thirdaryCategory"
              size="xl"
            />

            <div v-else class="product-card-prices-not">–</div>
          </div>

          <div class="product-card-prices-list-item">
            <div class="product-card-prices-list-title">
              {{ $t("label.categoryNumber", { title: 4 }) }}:
            </div>

            <OurMoney
              v-if="item.fourthCategory.sum"
              class="product-card-prices-list-money"
              :item="item.fourthCategory"
              size="xl"
            />

            <div v-else class="product-card-prices-not">–</div>
          </div>

          <div class="product-card-prices-list-item">
            <div class="product-card-prices-list-title">
              {{ $t("label.categoryNumber", { title: 5 }) }}:
            </div>

            <OurMoney
              v-if="item.fivesCategory.sum"
              class="product-card-prices-list-money"
              :item="item.fivesCategory"
              size="xl"
            />

            <div v-else class="product-card-prices-not">–</div>
          </div>
        </div>
      </div>

      <div class="product-card-title">
        {{ $t("label.productFilling") }}:
        <span class="product-card-title-span">{{ item.filling }}</span>
      </div>
      <div class="product-card-title">
        {{ $t("label.toggleMechanism") }}:
        <span class="product-card-title-span">{{ item.toggleMechanism }}</span>
      </div>
      <div class="product-card-title">
        {{ $t("label.frame") }}: <span class="product-card-title-span">{{ item.frame }}</span>
      </div>
      <div class="product-card-title">
        {{ $t("label.sleepingPlace") }}:
        <span class="product-card-title-span">{{ item.sleepSize }}</span>
      </div>
      <div class="product-card-title">
        {{ $t("label.generalSize") }}:
        <span class="product-card-title-span">{{ item.generalSize }}</span>
      </div>
      <div class="product-card-title">
        {{ $t("label.note") }}:
        <span v-if="item.note" class="product-card-title-span">{{ item.note }}</span>

        <span v-else class="product-card-title-span">–</span>
      </div>

      <div v-if="isAdmin" class="product-card-actions">
        <OurSvgIcon
          pill
          color="gray"
          interactive
          class="product-card-actions-icon"
          name="Edit"
          @click="onClickOpenEditProductPage"
        />

        <OurSvgIcon
          pill
          color="red"
          interactive
          class="product-card-actions-icon"
          name="Trash"
          @click="onClickDeleteProduct"
        />
      </div>
    </div>

    <SliderImageModal
      v-if="item.photos"
      v-model="isShownSliderImageModal"
      :title="item.name"
      :photos="item.photos"
    />

    <DeleteModal v-model="isShownDeleteModal" :item="item" />
  </div>
</template>

<script>
import OurMoney from "@/components/OurMoney";
import OurSlider from "@/components/OurSlider";
import SliderImageModal from "./SliderImageModal";
import OurButton from "@/components/OurButton";
import OurSvgIcon from "@/components/OurSvgIcon";
import DeleteModal from "../../delete/Modal";
import CreateOrderModal from "@/views/products/index/components/CreateOrderModal";
import { mapGetters } from "vuex";

export default {
  components: {
    CreateOrderModal,
    OurSvgIcon,
    OurButton,
    SliderImageModal,
    OurSlider,
    OurMoney,
    DeleteModal,
  },

  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },

  data: () => ({
    isShownSliderImageModal: false,
    isShownDeleteModal: false,
    isShownCreateOrderModal: false,
  }),

  computed: {
    ...mapGetters("user", ["isAdmin"]),
  },

  methods: {
    onClickImageOpenModal() {
      this.isShownSliderImageModal = true;
    },

    onClickDeleteProduct() {
      this.isShownDeleteModal = true;
    },

    onClickShowCreateOrderModal() {
      this.isShownCreateOrderModal = true;
    },

    onClickOpenEditProductPage() {
      this.$router.push({ name: "ProductsEdit", params: { id: this.item.id } });
    },
  },
};
</script>

<style lang="postcss" scoped>
.product-card {
  @apply rounded-lg bg-white shadow-md;

  &:hover {
    @apply shadow-xl;
  }

  &-button {
    @apply rounded-t-none;
    @apply w-full;

    &:focus {
      @apply ring-transparent;
    }
  }

  &-actions {
    @apply flex items-center justify-end space-x-4;
    @apply !mt-5;
  }

  &-without-image {
    @apply flex flex-col items-center justify-center;
    @apply rounded-t-lg bg-gray-300;
    @apply aspect-video w-full;

    &-title {
      @apply text-xl font-medium text-base-dark;
      @apply mt-2;
    }
  }

  &-slider {
    @apply relative;

    &::v-deep {
      .slider-header {
        @apply absolute z-10 mb-0 w-full;

        .slider-controls-left {
          @apply absolute -left-1 top-32;
          @apply rounded-full bg-white shadow-xl;
          @apply cursor-pointer;

          &:hover {
            @apply bg-base-dark;

            svg {
              g [fill] {
                @apply text-white;
              }
            }

            .svg-icon-gray-light {
              g [fill] {
                @apply text-gray-500;
              }
            }
          }
        }

        .slider-controls-right {
          @apply absolute -right-1 top-32;
          @apply rounded-full bg-white shadow-xl;
          @apply cursor-pointer;

          &:hover {
            @apply bg-base-dark;

            svg {
              g [fill] {
                @apply text-white;
              }
            }

            .svg-icon-gray-light {
              g [fill] {
                @apply text-gray-500;
              }
            }
          }
        }
      }

      .slider-content {
        @apply overflow-hidden;
        @apply cursor-pointer;
      }

      .slider-item {
        @apply !w-full !rounded-t-lg !border-0;
        @apply !p-0;

        .image {
          @apply aspect-video !p-0;

          img {
            @apply rounded-t-lg;
            @apply w-full;
          }
        }
      }
    }
  }

  &-block {
    @apply space-y-2 p-4;
  }

  &-title {
    @apply text-lg font-medium text-base-dark;

    &-span {
      @apply text-base font-normal;
    }
  }

  &-prices {
    &-title {
      @apply text-lg font-medium text-base-dark;
    }

    &-not {
      @apply text-base font-normal text-base-dark;
    }

    &-list {
      @apply mt-2 ml-2 space-y-2;

      &-item {
        @apply flex items-center;
        @apply space-x-2;
      }

      &-title {
        @apply text-base font-normal font-medium text-base-dark;
        @apply flex items-center;

        &:before {
          content: "";
          @apply mr-2 block h-1.5 w-1.5;
          @apply rounded-full bg-gray-400;
        }
      }
    }
  }
}
</style>
