<template>
  <div class="form" :class="theme">
    <div class="wrapper" :class="wrapperClass">
      <label class="label" :class="labelClass" :for="id">
        {{ label }}
      </label>

      <div class="textarea-block">
        <t-textarea
          :id="id"
          ref="textarea"
          class="textarea"
          :value="value"
          :placeholder="placeholder"
          :type="type"
          :class="[textareaClass, maxWidthClass]"
          :disabled="disabled"
          :rows="rows"
          :inputmode="inputMode"
          @blur="onBlur"
          @input="onInput"
        />

        <label v-if="isShownIconSlot" class="icon-label" :for="id">
          <slot name="icon" />
        </label>
      </div>
    </div>

    <p v-if="error" class="error-message" data-cy="textarea-error-message">
      {{ error }}
    </p>

    <p v-if="description && !error" class="description">
      {{ description }}
    </p>
  </div>
</template>

<script>
import getRandomId from "@/services/randomId.service";
import { getTheme } from "@/services/OurUiService";
import TTextarea from "vue-tailwind/dist/t-textarea";

export default {
  name: "OurTextarea",

  components: {
    TTextarea,
  },

  props: {
    inputMode: {
      type: String,
      default: "text",
    },

    label: {
      type: String,
      default: "",
    },

    placeholder: {
      type: String,
      default: "",
    },

    value: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      default: "text",
    },

    required: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: "",
    },

    id: {
      type: String,
      default: () => getRandomId(),
    },

    maxWidth: {
      type: String,
      default: "full",
    },

    description: {
      type: String,
      default: "",
    },

    size: {
      type: String,
      default: "md",
    },

    rows: {
      type: String,
      default: "2",
    },
  },

  computed: {
    theme() {
      return getTheme();
    },

    textareaClass() {
      return {
        disabled: this.disabled,
        "size-md": this.size === "md",
        "size-lg": this.size === "lg",
        "error-textarea": this.error,
      };
    },

    wrapperClass() {
      return {
        disabled: this.disabled,
        "error-wrapper": this.error,
      };
    },

    labelClass() {
      return {
        required: this.required,
        "error-label": this.error,
        "label-md": this.size === "md",
        "label-lg": this.size === "lg",
      };
    },

    maxWidthClass() {
      return {
        "max-w-xs": this.maxWidth === "xs",
        "max-w-sm": this.maxWidth === "sm",
        "max-w-md": this.maxWidth === "md",
        "max-w-lg": this.maxWidth === "lg",
        "max-w-xl": this.maxWidth === "xl",
        "max-w-full": this.maxWidth === "full",
      };
    },

    isShownIconSlot() {
      return !!this.$slots["icon"];
    },
  },

  methods: {
    onInput(value) {
      this.$emit("input", value);
    },

    onBlur() {
      this.$emit("blur");
    },
  },
};
</script>

<style lang="postcss" scoped>
.form {
  @apply relative;

  .description {
    @apply text-xs font-normal text-gray-450;
    @apply pl-4 pt-2;
  }

  .disabled {
    @apply text-gray-500;
    @apply border-gray-100 bg-gray-100;
  }

  .wrapper {
    @apply rounded-lg border border-solid border-gray-300 shadow-none drop-shadow-none;
    @apply relative;

    &:hover {
      @apply border-gray-400;
    }

    &:focus-within {
      @apply border-gray-500 ring-4 ring-gray-600 ring-opacity-15;
    }

    .textarea-block {
      @apply relative flex;

      .textarea {
        @apply font-medium text-base-dark;
        @apply resize-none rounded-lg border-0 outline-none;
        @apply pt-0 pl-4;

        &:focus {
          @apply ring-0;
        }

        &::placeholder {
          @apply font-medium text-gray-400;
        }
      }

      .icon-label {
        @apply flex items-center justify-center;
        @apply w-11 pt-5;
        @apply absolute right-0;
      }
    }
  }
}

.size {
  &-md {
    @apply text-base;
    @apply pb-2.5 pr-4;

    &::placeholder {
      @apply text-base;
    }
  }

  &-lg {
    @apply text-lg;
    @apply pb-3 pr-4;

    &::placeholder {
      @apply text-lg;
    }
  }
}

.label {
  @apply block font-normal text-gray-500;
  @apply pl-4;

  &-md {
    @apply text-sm;
    @apply pt-2 pb-1;
  }

  &-lg {
    @apply text-base;
    @apply pt-8;
  }
}

.required {
  &:after {
    content: "*";
    @apply absolute pl-0.5 font-medium text-red-600;
  }
}

.error {
  &-message {
    @apply text-xs font-normal text-red-500;
    @apply mt-2 pl-4;
  }

  &-label {
    @apply text-red-500;
  }

  &-wrapper {
    @apply border-red-300;

    &:hover {
      @apply border-red-400;
    }

    &:focus-within {
      @apply border-red-500 ring-red-100;
    }
  }
}
</style>
