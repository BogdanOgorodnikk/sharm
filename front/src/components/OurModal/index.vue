<template>
  <t-modal
    ref="pageModal"
    v-model="isShownModal"
    :classes="modalClasses"
    :class="modalWidthClass"
    :click-to-close="clickToClose"
    :esc-to-close="escToClose"
    hide-close-button
    @closed="onCloseModal"
  >
    <div class="modal">
      <div class="modal-header">
        <div class="modal-header-wrapper">
          <!-- @slot Use it to add something to header left. -->
          <slot name="header-left">
            <ArrowLink
              v-if="isShownArrowButton"
              :back-route="backRoute"
              data-cy="modal-arrow-button"
              @click="onClickBack"
            />

            <h3 class="modal-header-title" :class="headerTitleClass">
              {{ title }}
            </h3>
          </slot>
          <!-- @slot Use it to add something to header left after. -->
          <slot name="header-left-after" />
        </div>

        <slot name="header-right">
          <OurSvgIcon
            v-if="showCloseIcon"
            name="Close"
            class="icon"
            data-cy="close-modal"
            @click="onCloseModal"
          />
        </slot>
      </div>

      <div class="modal-body">
        <!-- @slot Use it to add something to modal body. -->
        <slot />
      </div>
    </div>

    <template v-if="isExistFooter" #footer>
      <div class="modal-footer">
        <div v-if="isExistSlot('footer-left')" class="modal-footer-left">
          <!-- @slot Use it to add something to footer left. -->
          <slot name="footer-left" />
        </div>

        <div v-if="isExistSlot('footer-right')" class="modal-footer-right">
          <!-- @slot Use it to add something to footer right. -->
          <slot name="footer-right" />
        </div>
      </div>
    </template>
  </t-modal>
</template>

<script>
import OurSvgIcon from "@/components/OurSvgIcon";
import ArrowLink from "./components/ArrowLink";
import TModal from "vue-tailwind/dist/t-modal";

export default {
  name: "OurModal",

  components: {
    ArrowLink,
    OurSvgIcon,
    TModal,
  },

  props: {
    /**
     * Set width for modal.
     * @values xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl
     */
    width: {
      type: String,
      default: "sm",
    },

    /**
     * Set modal's title.
     */
    title: {
      type: String,
      default: "",
    },
    /**
     * Set back route params (name, title, params).
     */
    backRoute: {
      type: Object,
      default: () => ({}),
    },

    /**
     * Make active click for close.
     */
    clickToClose: {
      type: Boolean,
      default: true,
    },

    /**
     * Make close icon active.
     */
    showCloseIcon: {
      type: Boolean,
      default: true,
    },

    /**
     * Make active ESC for close.
     */
    escToClose: {
      type: Boolean,
      default: true,
    },

    /**
     * Change modal state (hidden / shown).
     */
    value: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    modalWidthClass() {
      return {
        "size-xs": this.width === "xs", // 400px
        "size-sm": this.width === "sm", //   500px
        "size-md": this.width === "md", //   600px
        "size-lg": this.width === "lg", //   700px
        "size-xl": this.width === "xl", //   800px
        "size-2xl": this.width === "2xl", // 900px
        "size-3xl": this.width === "3xl", // 1000px
        "size-4xl": this.width === "4xl", // 1100px
        "size-5xl": this.width === "5xl", // 1200px
      };
    },

    modalClasses() {
      return {
        overlay: "z-50 bg-black bg-opacity-50 outline-none",
        wrapper: `flex justify-center flex-col z-50 px-3 py-12 modal-wrapper`,
        modal: `t-modal bg-base-light shadow rounded-2xl p-6`,
        footer: "rounded-b-2xl",
        overlayEnterClass: "opacity-0",
        overlayEnterActiveClass: "transition ease-out duration-300",
        overlayEnterToClass: "opacity-100",
        overlayLeaveClass: "opacity-100",
        overlayLeaveActiveClass: "transition ease-in duration-200",
        overlayLeaveToClass: "opacity-0",
        enterClass: "opacity-0 translate-y-4 sm:translate-y-0 transform sm:scale-95",
        enterActiveClass: "transition ease-out duration-300",
        enterToClass: "opacity-100 translate-y-0 transform sm:scale-100",
        leaveClass: "opacity-100 translate-y-0 transform sm:scale-100",
        leaveActiveClass: "transition ease-in duration-200",
        leaveToClass: "opacity-0 translate-y-4 sm:translate-y-0 transform sm:scale-95",
      };
    },

    headerTitleClass() {
      return Object.keys(this.backRoute).length ? "padding-left" : "";
    },

    isShownModal: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },

    isShownArrowButton() {
      return !!Object.keys(this.backRoute).length;
    },

    isExistFooter() {
      return this.isExistSlot("footer-left") || this.isExistSlot("footer-right");
    },
  },

  methods: {
    showModal() {
      this.isShownModal = true;
    },

    closeModal() {
      this.isShownModal = false;
    },

    onCloseModal() {
      this.closeModal();
    },

    onClickBack() {
      this.$emit("clickBack");
    },

    isExistSlot(slotName) {
      return !!this.$scopedSlots[slotName];
    },
  },
};
</script>

<style lang="postcss" scoped>
.modal {
  @apply rounded-t-2xl;

  &-header {
    @apply flex items-center justify-between;
    @apply pl-6 pr-4 pb-6;

    &-wrapper {
      @apply flex items-center;
    }

    &-title {
      @apply text-3xl font-medium text-base-dark;
    }

    .icon {
      @apply cursor-pointer;
    }
  }

  &-body {
    @apply space-y-4;
    @apply pb-0.5;
  }

  &-footer {
    @apply justify-between px-4 pt-6 md:flex md:px-6;
    @apply space-y-4 md:space-y-0;

    &-left,
    &-right {
      @apply md:flex;
      @apply space-y-4 md:space-x-4 md:space-y-0;
      @apply w-full;

      &::v-deep {
        .button {
          @apply w-full md:w-auto;
        }
      }
    }

    &-right {
      @apply justify-end;
    }
  }
}

.padding-left {
  @apply pl-2;
}

.size-xs::v-deep {
  .modal-wrapper {
    @apply md:w-100;
  }
}

.size-sm::v-deep {
  .modal-wrapper {
    @apply md:w-125;
  }
}

.size-md::v-deep {
  .modal-wrapper {
    @apply md:w-150;
  }
}

.size-lg::v-deep {
  .modal-wrapper {
    @apply md:w-175;
  }
}

.size-xl::v-deep {
  .modal-wrapper {
    @apply md:w-200;
  }
}

.size-2xl::v-deep {
  .modal-wrapper {
    @apply md:w-225;
  }
}

.size-3xl::v-deep {
  .modal-wrapper {
    @apply md:w-250;
  }
}

.size-4xl::v-deep {
  .modal-wrapper {
    @apply md:w-275;
  }
}

.size-5xl::v-deep {
  .modal-wrapper {
    @apply md:w-300;
  }
}
</style>

<!-- sweet theme -->
<style scoped lang="postcss">
.sweet-theme::v-deep {
  .t-modal {
    @apply bg-gradient-to-tr from-violet-50 via-blue-100 to-violet-50;
  }
}
</style>
