<template>
  <div class="form-group" :class="theme">
    <div class="input-block">
      <t-input
        :id="id"
        :value="value"
        :placeholder="placeholder"
        :type="inputType"
        :class="[inputClass, maxWidthClass]"
        :disabled="disabled"
        class="input"
        :maxlength="maxLength"
        @blur="onBlur"
        @input="onInput"
        @change="onChange"
        @keyup.enter="onKeyupEnter"
        @keyup="onKeyup"
      />

      <label v-if="isPasswordType" class="icon-label" :for="id">
        <OurSvgIcon
          folder="General"
          :name="passwordIconName"
          color="gray"
          class="icon-label-password"
          @click="onClickShowPassword"
        />
      </label>

      <label v-if="isShownIconSlot" class="icon-label" :for="id">
        <slot name="icon" />
      </label>

      <label v-if="isShownIconButtonSlot" class="icon-button-label" :for="id">
        <slot name="icon-button" />
      </label>
    </div>

    <label class="label" :class="labelClass" :for="id">
      {{ label }}
    </label>

    <p v-if="error" class="error-message" data-cy="input-error-message">
      {{ error }}
    </p>

    <p v-if="description && !error" class="description">
      {{ description }}
    </p>
  </div>
</template>

<script>
import { getTheme } from "@/services/OurUiService";
import getRandomId from "@/services/randomId.service";
import { NUMBER_REG_EXP, LETTERS_AND_SYMBOLS_REG_EXP } from "@/services/validate.service";

import OurSvgIcon from "@/components/OurSvgIcon";

const VALIDATION_RULES = {
  number: NUMBER_REG_EXP,
  symbol: LETTERS_AND_SYMBOLS_REG_EXP,
};

export default {
  name: "OurInput",
  components: {
    OurSvgIcon,
  },

  props: {
    label: {
      type: String,
      default: "",
    },

    maxLength: {
      type: String,
      default: "",
    },

    placeholder: {
      type: String,
      default: "",
    },

    value: {
      type: [String, Number],
      default: "",
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
      default: function () {
        this.$t("validation.required");
      },
    },

    tooltipTitle: {
      type: String,
      default: "",
    },

    tooltipVariant: {
      type: String,
      default: "light",
    },

    tooltipIconId: {
      type: String,
      default: () => getRandomId(),
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

    type: {
      type: String,
      default: "text",
      validator: (value) => !Object.keys(VALIDATION_RULES).includes(value),
    },

    validationRule: {
      type: String,
      default: "",
    },
  },

  data: () => ({
    isTextType: false,
  }),

  computed: {
    theme() {
      return getTheme();
    },

    inputClass() {
      return {
        disabled: this.disabled,
        "size-md": this.size === "md",
        "size-lg": this.size === "lg",
        "error-input": this.error,
        "input-default-padding": !this.isShownIconButtonSlot && !this.isShownIconSlot,
        "input-with-icon-padding": this.isShownIconButtonSlot || this.isShownIconSlot,
      };
    },

    isShownIconSlot() {
      return !!this.$slots["icon"];
    },

    isShownIconButtonSlot() {
      return !!this.$slots["icon-button"];
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

    isPasswordType() {
      return this.type === "password";
    },

    inputType() {
      return this.isTextType ? "text" : this.type;
    },

    passwordIconName() {
      return this.isTextType ? "Visible" : "Hidden";
    },
  },

  methods: {
    onInput(value) {
      if (this.validationRule) {
        const input = document.querySelector(`#${this.id}`);

        if (VALIDATION_RULES[this.validationRule]) {
          value = this.transformValue(value, VALIDATION_RULES[this.validationRule]);
        } else {
          value = this.transformValue(value, this.validationRule);
        }

        input.value = value;
      }

      this.$emit("input", value);
    },

    onChange() {
      this.$emit("change");
    },

    onBlur() {
      this.$emit("blur");
    },

    onKeyupEnter() {
      this.$emit("keyupEnter");
    },

    onKeyup() {
      this.$emit("keyup");
    },

    transformValue(value, exp) {
      const regExp = new RegExp(exp, "ig");
      const matches = String(value).match(regExp);

      return matches ? matches.join("") : "";
    },

    onClickShowPassword() {
      this.isTextType = !this.isTextType;
    },
  },
};
</script>

<style lang="postcss" scoped>
.form-group {
  @apply relative;

  .input {
    @apply font-medium text-base-dark;
    @apply rounded-lg border border-solid border-gray-300 bg-white shadow-none;
    @apply pl-4;

    &:hover {
      @apply border-gray-400;

      & + .icon-button-label span {
        @apply border-gray-400;
        @apply transition duration-100 ease-in-out;
      }
    }

    &:focus {
      @apply border-gray-500 ring-4 ring-gray-600 ring-opacity-15;

      & + .icon-button-label span {
        @apply border-gray-500;
        @apply transition duration-100 ease-in-out;
      }
    }

    &::placeholder {
      @apply font-medium text-gray-400;
    }

    &-block {
      @apply relative flex;
    }

    &-default-padding {
      @apply pr-4;
    }

    &-with-icon-padding {
      @apply pr-11;
    }
  }

  .label {
    @apply absolute font-normal text-gray-500;

    &-md {
      @apply text-sm;
      @apply left-4 top-2.5;
    }

    &-lg {
      @apply text-base;
      @apply left-4 top-3;
    }
  }

  .required:after {
    content: "*";
    @apply absolute pl-0.5 font-medium text-red-600;
  }

  .description {
    @apply text-xs font-normal text-gray-450;
    @apply pl-4 pt-2;
  }

  .disabled {
    @apply text-base-dark;
    @apply border-gray-100 bg-gray-100 opacity-100;
    @apply cursor-default;

    &:hover {
      @apply border-gray-100;
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

    &-input {
      @apply border-red-300;

      &:hover {
        @apply border-red-400;
      }

      &:focus {
        @apply border-red-500 ring-red-100;
      }
    }
  }
}

.icon {
  &-label {
    @apply flex items-center justify-center;
    @apply h-full w-11;
    @apply absolute right-0;

    &-password {
      @apply cursor-pointer;

      &:hover {
        ::v-deep g [fill] {
          @apply transition duration-100 ease-in-out;
          @apply text-gray-500;
        }
      }
    }
  }

  &-button-label {
    @apply flex items-center justify-center;
    @apply h-full w-11;
    @apply absolute right-0;
    @apply cursor-pointer;

    &:hover span::v-deep g [fill] {
      @apply transition duration-100 ease-in-out;
      @apply text-gray-600;
    }

    span::v-deep g [fill] {
      @apply fill-current text-gray-500;
    }
  }
}

.size {
  &-md {
    @apply text-base;
    @apply pt-7 pb-2.5;

    &::placeholder {
      @apply text-base;
    }
  }

  &-lg {
    @apply text-lg;
    @apply pt-8 pb-3;

    &::placeholder {
      @apply text-lg;
    }
  }
}
</style>
