<template>
  <t-dropdown :classes="dropdownClasses" toggle-on-focus class="dropdown" @blur="onBlur">
    <div
      slot="trigger"
      slot-scope="{ keydownHandler, focusHandler, mousedownHandler, blurHandler }"
      class="relative"
    >
      <slot
        :keydown-handler="keydownHandler"
        :focus-handler="focusHandler"
        :mousedown-handler="mousedownHandler"
        :blur-handler="blurHandler"
        name="action-button"
      >
        <button
          ref="dropdown"
          class="dropdown-wrapper"
          :class="buttonClasses"
          @mousedown="[mousedownHandler(), onMouseDownRotateIcon()]"
          @focus="focusHandler"
          @keydown="keydownHandler"
          @blur="[blurHandler($event), onBlurRotateIcon()]"
        >
          {{ text }}
          <OurSvgIcon
            v-if="dropdownIcon"
            name="Angle-down"
            class="icon"
            :size="iconSize"
            :class="iconClass"
            @blur="[blurHandler($event), onBlurRotateIcon()]"
          />
        </button>
      </slot>
    </div>

    <div slot-scope="{ hide }" class="dropdown-list" @click="hide()">
      <!-- @slot Use it to add something instead. -->
      <slot />
    </div>
  </t-dropdown>
</template>

<script>
import TDropdown from "vue-tailwind/dist/t-dropdown";
import OurSvgIcon from "@/components/OurSvgIcon";

export default {
  name: "OurDropdown",

  components: {
    OurSvgIcon,
    TDropdown,
  },

  props: {
    /**
     * Set button text.
     */
    text: {
      type: String,
      required: true,
    },

    /**
     * The variant of the button.
     * @values primary, secondary, thirdary, transparent, link
     */
    variant: {
      type: String,
      default: "primary",
    },

    /**
     * The size of the button.
     * @values xs, sm, md, lg
     */
    size: {
      type: String,
      default: "md",
    },

    /**
     * Make the dropdown icon visible.
     */
    dropdownIcon: {
      type: Boolean,
      default: true,
    },

    /**
     * The position of dropdown list on the y-axis.
     * @values top, bottom
     */
    listYPosition: {
      type: String,
      default: "bottom",
    },

    /**
     * The position of dropdown list on the x-axis.
     * @values left, right
     */
    listXPosition: {
      type: String,
      default: "right",
    },
  },

  data: () => ({
    isShownItems: false,
  }),

  computed: {
    buttonClasses() {
      const size = `size-${this.size}`;
      const padding = this.dropdownIcon ? "padding-right" : "";

      return [this.variant, size, padding];
    },

    dropdownListYPosition() {
      return this.listYPosition === "bottom" ? "top-0" : "bottom-12";
    },

    dropdownListXPosition() {
      return this.listXPosition === "right" ? "dropdown-list-right" : "left-0";
    },

    iconClass() {
      return this.isShownItems ? "icon-rotate" : "";
    },

    iconSize() {
      const sizes = {
        sm: "xs",
        md: "sm",
        lg: "md",
      };

      return sizes[this.size];
    },

    dropdownClasses() {
      return {
        button: `block px-4 py-2 text-white transition duration-100 ease-in-out bg-blue-500 border
          border-transparent rounded shadow-sm hover:bg-blue-600 focus:border-blue-500 focus:ring-2
          focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50
          disabled:cursor-not-allowed`,
        wrapper: "inline-flex flex-col",
        dropdownWrapper: "relative z-10 mb-0 dropdown-wrapper-list",
        dropdown: `${
          (this.dropdownListYPosition, this.dropdownListXPosition)
        } absolute w-56 rounded-lg shadow bg-white mt-1 dropdown-block`,
        enterClass: "opacity-0 scale-95",
        enterActiveClass: "transition transform ease-out duration-100",
        enterToClass: "opacity-100 scale-100",
        leaveClass: "opacity-100 scale-100",
        leaveActiveClass: "transition transform ease-in duration-75",
        leaveToClass: "opacity-0 scale-95",
      };
    },
  },

  methods: {
    onMouseDownRotateIcon() {
      this.isShownItems = !this.isShownItems;
    },

    onBlurRotateIcon() {
      this.isShownItems = false;
    },

    onBlur() {
      this.$emit("blur");
    },
  },
};
</script>

<style lang="postcss" scoped>
.dropdown-wrapper {
  @apply font-medium;
  @apply rounded-lg outline-none;
  @apply transition duration-100 ease-in-out;
  @apply pr-9 pl-4 outline-none;
  @apply flex items-center;

  &:focus {
    @apply ring-4 ring-gray-200;
  }
}

.dropdown-list-bottom {
  @apply top-0;
}

.dropdown-list-top {
  @apply bottom-12;
}

.icon {
  @apply absolute right-3 transition-all duration-300;
}

.icon-rotate {
  @apply rotate-180 transform;
}

.size {
  &-xs {
    @apply text-xs;
  }

  &-sm {
    @apply text-sm;
    @apply p-2.5;

    .icon {
      @apply top-3;
    }

    &.padding-right {
      @apply pr-8;
    }

    &.link.padding-right {
      @apply pr-5;
    }
  }

  &-md {
    @apply text-base;
    @apply p-3;

    .icon {
      @apply top-3.5;
    }

    &.padding-right {
      @apply pr-9;
    }

    &.link.padding-right {
      @apply pr-6;
    }
  }

  &-lg {
    @apply text-lg;
    @apply p-4;

    .icon {
      @apply top-4;
    }

    &.padding-right {
      @apply pr-10;
    }

    &.link.padding-right {
      @apply pr-7;
    }
  }
}

.primary {
  @apply border border-solid border-base-dark bg-base-dark text-white;

  .icon::v-deep g [fill] {
    @apply fill-current text-white;
  }

  &:hover {
    @apply border-gray-700 bg-gray-700;
  }

  &:focus {
    @apply bg-gray-700;
  }

  &:active {
    @apply border-gray-600 bg-gray-600;
  }

  &:disabled {
    @apply text-gray-400;
    @apply border-gray-300 bg-white;
  }
}

.secondary {
  @apply border border-solid border-base-dark bg-transparent text-base-dark;

  .icon::v-deep g [fill] {
    @apply fill-current text-base-dark;
  }

  &:hover {
    @apply border-gray-700 text-gray-700;
  }

  &:focus {
    @apply border-gray-700 text-gray-700;
  }

  &:active {
    @apply border-gray-600 text-gray-600;
  }

  &:disabled {
    @apply text-gray-400;
    @apply border-gray-300;
  }
}

.thirdary {
  @apply border border-solid border-transparent bg-transparent text-base-dark;

  .icon::v-deep g [fill] {
    @apply fill-current text-base-dark;
  }

  &:hover {
    @apply border-base-dark border-opacity-0 bg-base-dark bg-opacity-5;
  }

  &:focus {
    @apply border-gray-200 bg-base-dark bg-opacity-5;
  }

  &:active {
    @apply border-base-dark border-opacity-0 bg-base-dark bg-opacity-10 text-gray-600;
  }

  &:disabled {
    @apply text-gray-400;
  }
}

.transparent {
  @apply border bg-base-dark bg-opacity-5;

  .icon::v-deep g [fill] {
    @apply fill-current text-base-dark;
  }

  &:focus {
    @apply border-gray-100 bg-opacity-10 ring-4 ring-gray-100;
  }

  &:hover {
    @apply bg-opacity-10;
  }

  &:active {
    @apply bg-opacity-15;
  }
}

.link {
  @apply font-normal text-gray-500;
  @apply border border-t-0 border-r-0 border-l-0 border-dashed border-gray-500;
  @apply rounded-none bg-transparent;
  @apply p-0;

  .icon {
    @apply top-0 right-0;

    ::v-deep g [fill] {
      @apply fill-current text-base-dark;
    }
  }

  &:focus {
    @apply ring-0;
  }
}

.dropdown-list {
  @apply max-h-44 overflow-x-auto overflow-y-auto rounded-lg;
}

::v-deep .dropdown-list-right {
  @apply right-0;
  @apply md:!w-auto;
}

::v-deep .dropdown-list div {
  @apply text-base font-normal text-base-dark;
  @apply p-3;
}

::v-deep .dropdown-list div:hover {
  @apply cursor-pointer bg-gray-100;
}

::v-deep .dropdown-list div:active {
  @apply bg-gray-200 font-medium;
}

::v-deep .dropdown-list div:disabled {
  @apply bg-gray-500;
}
</style>

<!-- Sweet theme -->
<style scoped lang="postcss">
.sweet-theme {
  &.primary {
    @apply bg-gradient-to-r from-violet-600 to-blue-600;
    @apply border-none;
  }

  &.secondary {
    @apply border-violet-900 border-opacity-40;

    .text-wrap {
      @apply bg-clip-text text-transparent;
      @apply bg-gradient-to-r from-violet-600 to-blue-600;
    }
  }
}
</style>

<!-- Accent theme -->
<style scoped lang="postcss">
.accent-theme {
  &.button {
    &:focus {
      @apply ring-4 ring-accent ring-opacity-15;
    }
  }

  &.primary {
    @apply border-accent bg-accent;
    @apply border border-solid text-white;

    &:focus {
      @apply bg-accent bg-opacity-80;
    }

    &:hover {
      @apply bg-accent bg-opacity-80;
      @apply border-accent border-opacity-5;
    }

    &:active {
      @apply bg-accent bg-opacity-70;
      @apply border-accent border-opacity-5;
    }

    &:disabled {
      @apply text-white;
      @apply border-transparent bg-accent bg-opacity-50;
    }
  }

  &.secondary {
    @apply border border-solid bg-transparent text-accent;
    @apply border-accent border-opacity-90;

    &:focus {
      @apply border-accent border-opacity-80;
      @apply text-accent text-opacity-70;
    }

    &:hover {
      @apply border-accent border-opacity-80;
      @apply text-accent text-opacity-70;
    }

    &:active {
      @apply border-accent border-opacity-70;
      @apply text-accent text-opacity-60;
    }

    &:disabled {
      @apply text-accent text-opacity-40;
      @apply border-accent border-opacity-20;
    }
  }

  &.thirdary {
    @apply border border-transparent bg-transparent text-base-dark;

    &:focus {
      @apply bg-accent bg-opacity-5;
      @apply border-accent border-opacity-20;
    }

    &:hover {
      @apply bg-accent bg-opacity-5;
      @apply border-accent border-opacity-0;
    }

    &:active {
      @apply bg-accent bg-opacity-10 text-gray-600;
      @apply border-accent border-opacity-0;
    }

    &:disabled {
      @apply text-gray-400;
    }
  }

  &.transparent {
    @apply bg-accent bg-opacity-5;

    &:focus {
      @apply bg-opacity-10 ring-4 ring-accent ring-opacity-5;
      @apply border-accent;
    }

    &:hover {
      @apply bg-opacity-10;
    }

    &:active {
      @apply bg-opacity-15;
    }
  }
}
</style>
