<template>
  <div class="slider">
    <div class="slider-header">
      <div class="slider-title">
        {{ title }}
      </div>

      <div class="slider-controls">
        <OurSvgIcon
          class="slider-controls-left"
          name="Left-2"
          :color="prevControlColor"
          size="lg"
          @click="onClickPrev"
        />

        <OurSvgIcon
          class="slider-controls-right"
          name="Right-2"
          :color="nextControlColor"
          size="lg"
          @click="onClickNext"
        />
      </div>
    </div>

    <swiper
      ref="slider"
      :slides-per-view="slidesPerView"
      :space-between="spaceBetween"
      class="slider-content"
    >
      <swiper-slide v-for="(item, index) in items" :key="index" class="slider-item">
        <slot>
          <div class="image" @click="onClickImage">
            <img :alt="item.name" :src="item.image" />
          </div>
        </slot>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper-vue2";
import "swiper/css";

import OurButton from "@/components/OurButton";
import OurMoney from "@/components/OurMoney";
import OurSvgIcon from "@/components/OurSvgIcon";

export default {
  name: "OurSlider",

  components: {
    Swiper,
    SwiperSlide,
    OurMoney,
    OurButton,
    OurSvgIcon,
  },

  props: {
    /**
     * Set title.
     */
    title: {
      type: String,
      default: "",
    },

    /**
     * Set slides data.
     */
    items: {
      type: Array,
      required: true,
    },

    /**
     * Set number of visible slides.
     */
    slidesPerView: {
      type: Number,
      default: 4,
    },

    /**
     * Set margin between slide.
     */
    spaceBetween: {
      type: Number,
      default: 24,
    },
  },

  data() {
    return {
      swiper: {},
    };
  },

  computed: {
    prevControlColor() {
      return this.swiper.isBeginning ? "gray" : "";
    },

    nextControlColor() {
      return this.swiper.isEnd ? "gray" : "";
    },
  },

  mounted() {
    this.swiper = this.$refs.slider.$el.swiper;
  },

  methods: {
    onClickPrev() {
      this.swiper.slidePrev();
    },

    onClickNext() {
      this.swiper.slideNext();
    },

    onClickImage() {
      this.$emit("clickImage");
    },
  },
};
</script>

<style lang="postcss" scoped>
.slider {
  .slider-header {
    @apply mb-2 flex justify-between;

    .slider-title {
      @apply text-2xl font-bold;
    }

    .slider-controls {
      @apply space-x-7;
      @apply whitespace-nowrap;

      &::v-deep {
        svg {
          g [fill] {
            @apply opacity-100;
          }
        }
      }

      &-right,
      &-left {
        @apply cursor-pointer;
      }
    }
  }

  .slider-content {
    .slider-item {
      @apply rounded-lg border border-solid border-gray-100;
      .image {
        @apply flex justify-center;
        @apply p-2;
      }
    }
  }
}
</style>
