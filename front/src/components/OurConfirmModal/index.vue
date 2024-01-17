<template>
  <t-modal
    v-model="isShownModal"
    :classes="modalClasses"
    :class="modalWidthClass"
    data-cy="confirm-modal"
    hide-close-button
    @closed="onCloseModal"
  >
    <div class="modal">
      <slot name="header">
        <div class="modal-header">
          <div class="modal-header-wrapper">
            <h3 class="modal-header-title">
              {{ title }}
            </h3>
          </div>

          <OurSvgIcon name="Close" class="icon" @click="onCloseModal" />
        </div>
      </slot>

      <div class="modal-body">
        <OurCard>
          <div class="confirm-modal-description">
            <slot />
          </div>
        </OurCard>
      </div>
    </div>

    <div class="footer">
      <OurButton
        data-cy="accept-button"
        :disabled="disableAcceptButton"
        :text="actionButtonText"
        @click="emitConfirmAction"
      />

      <OurButton variant="secondary" :text="$t('button.cancel')" @click="onCloseModal" />
    </div>
  </t-modal>
</template>

<script>
import OurSvgIcon from "@/components/OurSvgIcon";
import OurButton from "@/components/OurButton";
import OurCard from "@/components/OurCard";
import TModal from "vue-tailwind/dist/t-modal";

export default {
  name: "OurConfirmModal",

  components: {
    OurCard,
    OurButton,
    OurSvgIcon,
    TModal,
  },

  props: {
    disableAcceptButton: {
      type: Boolean,
      default: false,
    },

    /**
     * Set action button text.
     */
    actionButtonText: {
      type: String,
      default: "",
    },

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
     * Change modal state (hidden / shown).
     */
    value: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    modalWidthClass() {
      const widths = {
        xs: "size-xs", // 400px
        sm: "size-sm", //   500px
        md: "size-md", //   600px
        lg: "size-lg", //   700px
        xl: "size-xl", //   800px
        "2xl": "size-2xl", // 900px
        "3xl": "size-3xl", // 1000px
        "4xl": "size-4xl", // 1100px
        "5xl": "size-5xl", // 1200px
      };

      return widths[this.width];
    },

    modalClasses() {
      return {
        overlay: "z-50 bg-black bg-opacity-50 outline-none",
        wrapper: `flex justify-center flex-col z-50 px-3 py-12 modal-wrapper`,
        modal: "bg-base-light shadow rounded-2xl md:p-6 px-4 py-6",
        footer: "bg-base-light rounded-b-2xl",
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
    showModal() {
      this.isShownModal = true;
    },

    closeModal() {
      this.isShownModal = false;
    },

    onCloseModal() {
      this.closeModal();
    },

    emitConfirmAction() {
      this.$emit("actionConfirmed");
      this.closeModal();
    },
  },
};
</script>

<style lang="postcss" scoped>
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

.modal-header {
  @apply flex items-center justify-between;
  @apply pr-4 pl-4 pb-4 md:pl-6 md:pb-6;
}

.modal-header-wrapper {
  @apply flex items-center;
}

.modal-header-title {
  @apply text-2xl font-medium text-black;
}

.icon {
  @apply cursor-pointer;
}

.modal {
  @apply rounded-t-2xl bg-base-light;
}

.confirm-modal-description {
  @apply text-base font-normal text-base-dark;
}

.confirm-modal-description::v-deep span {
  @apply font-bold;
}

.footer {
  @apply flex flex-col md:flex-row;
  @apply px-4 pt-6 md:px-6;
  @apply space-x-0 space-y-4 md:space-x-4 md:space-y-0;
}
</style>
