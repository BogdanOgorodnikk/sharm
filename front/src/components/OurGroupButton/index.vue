<template>
  <div class="radio-buttons" :class="theme">
    <div v-for="item in options" :key="item.value" class="radio-wrapper">
      <t-radio
        :id="item.value"
        v-model="selectedItem"
        class="radio"
        :name="name"
        :value="item.value"
      />

      <label :for="item.value" class="label">
        <OurSvgIcon
          v-if="item.name"
          :tooltip="item.iconTooltip"
          size="sm"
          class="icon"
          :name="item.name"
        />

        <span v-if="item.label" class="label-text">
          {{ item.label }}
        </span>
      </label>
    </div>
  </div>
</template>

<script>
import OurSvgIcon from "@/components/OurSvgIcon";
import TRadio from "vue-tailwind/dist/t-radio";

export default {
  name: "OurRadioButtons",

  components: { OurSvgIcon, TRadio },

  props: {
    /**
     * Set buttons name.
     */
    name: {
      type: String,
      required: true,
      default: "",
    },

    /**
     * Set data for buttons.
     */
    options: {
      type: Array,
      default: () => [],
    },

    /**
     * Set current value.
     */
    value: {
      type: [String, Number],
      default: "",
    },
  },

  data: () => ({
    selected: "",
  }),

  computed: {
    selectedItem: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>

<style lang="postcss" scoped>
.radio-buttons {
  @apply flex;

  .radio-wrapper {
    @apply flex;

    &:first-child {
      .label {
        @apply rounded-l-lg;
      }
    }

    &:last-child {
      .label {
        @apply rounded-r-lg;
      }
    }

    .radio {
      @apply absolute opacity-0;

      &:checked {
        & + .label {
          @apply bg-white/50;
        }
      }
    }

    .label {
      @apply bg-base-dark/5;
      @apply cursor-pointer p-3;

      &:hover {
        @apply bg-opacity-10;
      }

      &:active {
        @apply bg-opacity-15;
        @apply ring-4 ring-gray-600/15;
      }

      .icon {
        @apply block;

        &::v-deep g [fill] {
          @apply fill-current text-base-dark opacity-100;
        }
      }

      &-text {
        @apply font-medium;
      }
    }
  }
}
</style>
