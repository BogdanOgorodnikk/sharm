<template>
  <OurModal v-model="isShownModal" width="xl" :title="$t('page.products.productModalImage')">
    <OurCard>
      <OurSlider :title="title" class="slider-image-modal" :slides-per-view="1" :items="photos" />
    </OurCard>

    <template #footer-right>
      <OurButton variant="secondary" :text="$t('button.close')" @click="onClickCloseModal" />
    </template>
  </OurModal>
</template>

<script>
import OurModal from "@/components/OurModal";
import OurButton from "@/components/OurButton";
import OurSlider from "@/components/OurSlider";
import OurCard from "@/components/OurCard";

export default {
  components: {
    OurCard,
    OurSlider,
    OurButton,
    OurModal,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      default: "",
    },

    photos: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    isShownModal: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },

  methods: {
    onClickCloseModal() {
      this.isShownModal = false;
    },
  },
};
</script>

<style lang="postcss" scoped>
.slider-image-modal {
  @apply overflow-hidden;

  &::v-deep {
    .slider-controls-left,
    .slider-controls-right {
      &:hover {
        svg {
          g [fill] {
            @apply opacity-70;
          }
        }
      }
    }

    .slider-item {
      .image {
        @apply max-h-[30rem];

        img {
          @apply w-full;
        }
      }
    }
  }
}
</style>
