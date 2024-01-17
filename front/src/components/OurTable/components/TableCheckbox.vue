<template>
  <label class="checkbox-wrap">
    <t-checkbox v-model="selected" :value="value" class="checkbox" :disabled="disabled" />
  </label>
</template>

<script>
import TCheckbox from "vue-tailwind/dist/t-checkbox";

export default {
  name: "OurCheckbox",

  components: { TCheckbox },

  props: {
    values: {
      type: Array,
      default: () => [],
    },

    value: {
      type: Number,
      default: null,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    selected: {
      get() {
        return this.values;
      },
      set(values) {
        this.$emit("update:values", values);
      },
    },
  },
};
</script>

<style lang="postcss" scoped>
.checkbox-wrap {
  @apply flex max-w-max items-center;

  .checkbox {
    @apply border border-solid border-gray-300;
    @apply h-5 w-5;

    &:disabled {
      @apply border-gray-100 bg-gray-100;
    }

    &:hover {
      @apply border-gray-400;
    }

    &:focus {
      @apply border-gray-500 ring-4 ring-gray-200;
    }

    &:active {
      @apply border-base-dark bg-base-dark;
    }

    &:checked {
      @apply border-base-dark bg-base-dark;
    }
  }
}
</style>
