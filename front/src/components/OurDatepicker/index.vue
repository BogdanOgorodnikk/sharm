<template>
  <div class="form-group" :class="datepickerWrapperClasses">
    <div class="input-block">
      <t-datepicker
        :id="id"
        ref="datepicker"
        v-model="selectedDate"
        date-format="d.m.Y"
        :user-format="customDateFormat"
        :week-start="1"
        :locale="activeLanguage"
        :placeholder="placeholder"
        :disabled="disabled"
        class="datepicker"
        :clearable="false"
        :classes="datepickerClasses"
      >
        <template #day="{ isSelected, dayFormatted }">
          <span v-if="isSelected" @click.prevent.stop="onClickClearDate">
            {{ dayFormatted }}
          </span>

          <span v-else>{{ dayFormatted }}</span>
        </template>
      </t-datepicker>

      <label :for="id">
        <!-- @slot Use it to add icon. -->
        <slot name="icon" />
      </label>

      <label v-if="isShownRightSlot" :for="id" class="right-slot-label">
        <!-- @slot Use it to add something right. -->
        <slot name="right" />
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
import getRandomId from "@/services/randomId.service";

import OurSvgIcon from "@/components/OurSvgIcon";

import Ukrainian from "vue-tailwind/dist/l10n/uk";
import TDatepicker from "vue-tailwind/dist/t-datepicker";

export default {
  name: "OurDatePicker",

  components: {
    OurSvgIcon,
    TDatepicker,
  },

  props: {
    /**
     * Set date picker label.
     */
    label: {
      type: String,
      default: "",
    },

    /**
     * Set date picker placeholder.
     */
    placeholder: {
      type: String,
      default: "",
    },

    /**
     * Set date picker value (timestamp).
     */
    value: {
      type: String,
      default: "",
    },

    /**
     * Make component inactive.
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Set error text.
     */
    error: {
      type: String,
      default: "",
    },

    /**
     * Generates unique element id.
     * @ignore
     */
    id: {
      type: String,
      default: () => getRandomId(),
    },

    /**
     * Set description text.
     */
    description: {
      type: String,
      default: "",
    },

    /**
     * The size of the component.
     * @values sm, md, lg
     */
    size: {
      type: String,
      default: "md",
    },

    /**
     * Set custom date format.
     * [See all formats here.](https://www.vue-tailwind.com/docs/datepicker/)
     */
    customDateFormat: {
      type: String,
      default: "d.m.Y",
    },
  },

  computed: {
    selectedDate: {
      get() {
        if (!this.value) return;

        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },

    datepickerWrapperClasses() {
      return {
        "right-slot": this.isShownRightSlot,
        "size-sm": this.size === "sm",
        "size-md": this.size === "md",
        "size-lg": this.size === "lg",
      };
    },

    isShownRightSlot() {
      return !!this.$slots["right"];
    },

    activeLanguage() {
      return Ukrainian;
    },

    inputClass() {
      const classes = {
        disabled: this.disabled ? "disabled" : "",
        error: this.error ? "error-input" : "",
      };

      return `${classes.error} ${classes.disabled}}`;
    },

    labelClass() {
      return {
        "error-label": this.error,
        "label-sm": this.size === "sm",
        "label-md": this.size === "md",
        "label-lg": this.size === "lg",
      };
    },

    datepickerClasses() {
      return {
        wrapper: "flex flex-col",
        dropdownWrapper: "relative z-50",
        dropdown:
          "origin-top-left absolute rounded-lg shadow bg-white overflow-hidden mt-2 pl-1 pr-1 pb-4",
        enterClass: "opacity-0 scale-95",
        enterActiveClass: "transition transform ease-out duration-100",
        enterToClass: "opacity-100 scale-100",
        leaveClass: "opacity-100 scale-100",
        leaveActiveClass: "transition transform ease-in duration-75",
        leaveToClass: "opacity-0 scale-95",
        inlineWrapper: "",
        inlineViews: "rounded bg-white border mt-1 inline-flex",
        inputWrapper: "",
        input: `input w-full ${this.inputClass}`,
        navigator: "pt-2 px-3 items-center",
        navigatorViewButton: `transition ease-in-out duration-100 inline-flex cursor-pointer rounded-full pr-1 pl-3
          py-1 -ml-1 hover:bg-gray-100 text-base-dark`,
        navigatorViewButtonIcon: "fill-current text-gray-400",
        navigatorViewButtonBackIcon: "fill-current text-gray-400",
        navigatorViewButtonMonth: "text-gray-700 font-semibold",
        navigatorViewButtonYear: "text-gray-500 ml-1",
        navigatorViewButtonYearRange: "text-gray-500 ml-1",
        navigatorLabel: "py-1",
        navigatorLabelMonth: "text-gray-700 font-semibold",
        navigatorLabelYear: "text-gray-500 ml-1",
        navigatorPrevButton: `transition ease-in-out duration-100 inline-flex cursor-pointer
          hover:bg-gray-100 rounded-full p-1 ml-2 ml-auto disabled:opacity-50 disabled:cursor-not-allowed`,
        navigatorNextButton: `transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-100
          rounded-full p-1 -mr-1 disabled:opacity-50 disabled:cursor-not-allowed`,
        navigatorPrevButtonIcon: "text-gray-400 navigation-btn-icon",
        navigatorNextButtonIcon: "text-gray-400 navigation-btn-icon",
        calendarWrapper: "px-3 pt-2",
        calendarHeaderWrapper: "",
        calendarHeaderWeekDay:
          "uppercase text-xs text-gray-500 w-8 h-8 flex items-center justify-center",
        calendarDaysWrapper: "",
        calendarDaysDayWrapper: "w-full h-8 flex shrink-0 items-center calendar-day-button",
        otherMonthDay: `text-sm rounded-lg w-8 h-8 mx-auto hover:bg-gray-100 text-gray-400 disabled:opacity-50
          disabled:cursor-not-allowed`,
        emptyDay: "",
        inRangeFirstDay: "text-sm bg-base-dark text-white w-full h-8 rounded-l-full",
        inRangeLastDay: "text-sm bg-base-dark text-white w-full h-8 rounded-r-full",
        inRangeDay:
          "text-sm bg-gray-200 w-full h-8 disabled:opacity-50 disabled:cursor-not-allowed",
        selectedDay:
          "text-sm rounded-lg w-8 h-8 mx-auto bg-base-dark text-white disabled:opacity-50 disabled:cursor-not-allowed",
        activeDay:
          "text-sm rounded-lg bg-gray-100 w-8 h-8 mx-auto disabled:opacity-50 disabled:cursor-not-allowed",
        highlightedDay:
          "text-sm rounded-lg bg-gray-200 w-8 h-8 mx-auto disabled:opacity-50 disabled:cursor-not-allowed",
        day: `text-sm text-base-dark rounded-lg w-8 h-8 mx-auto hover:bg-gray-100
          disabled:opacity-50 disabled:cursor-not-allowed`,
        today: `text-sm rounded-lg w-8 h-8 mx-auto hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed
          border-2 border-base-dark text-base-dark`,
        monthWrapper: "px-3 pt-2",
        selectedMonth: "text-sm text-base-dark rounded-lg w-full h-12 mx-auto bg-base-dark",
        activeMonth: "text-sm text-base-dark rounded-lg w-full h-12 mx-auto bg-gray-200",
        month: "text-sm text-base-dark rounded-lg w-full h-12 mx-auto hover:bg-gray-100",
        yearWrapper: "px-3 pt-2",
        year: "text-sm text-base-dark rounded-lg w-full h-12 mx-auto hover:bg-gray-100",
        selectedYear:
          "text-sm text-base-dark rounded-lg w-full h-12 mx-auto bg-base-dark text-white",
        activeYear: "text-sm text-base-dark rounded-lg w-full h-12 mx-auto bg-gray-200",
      };
    },
  },

  methods: {
    onClickClearDate() {
      this.selectedDate = "";

      this.$refs.datepicker.$refs.dropdown.localShow = false;
    },
  },
};
</script>

<style lang="postcss" scoped>
.form-group {
  @apply relative;
  @apply max-w-full;

  .description {
    @apply text-xs font-normal text-gray-450;
    @apply pl-4 pt-2;
  }
}

.input-block::v-deep {
  @apply relative;

  &:focus-within {
    .input {
      @apply border-gray-500 ring-4 ring-gray-600 ring-opacity-15;
    }

    .error-input {
      @apply border-red-500 ring-red-100 !important;
    }
  }

  .navigation-btn-icon {
    @apply h-4 !important;
  }

  .right-slot-label {
    @apply absolute left-4 md:top-4 md:right-4 md:left-auto !important;
    @apply pt-0.5;
  }

  .input {
    @apply font-medium text-base-dark;
    @apply rounded-lg border border-solid border-gray-300 bg-white shadow-none;
    @apply pl-4 pr-4 md:pr-11;

    &:hover {
      @apply border-gray-400;
    }

    &:focus {
      @apply border-gray-500 ring-4 ring-gray-600 ring-opacity-15;
    }

    &::placeholder {
      @apply font-medium text-gray-400;
    }

    &:disabled {
      @apply text-gray-500;
      @apply border-gray-100 bg-gray-100;
    }
  }

  .error-input {
    @apply border-red-300 !important;

    &:hover {
      @apply border-red-400 !important;
    }

    &:focus {
      @apply border-red-500 ring-red-100 !important;
    }
  }
}

.label {
  @apply absolute font-normal text-gray-500;

  &-sm {
    @apply text-xs;
    @apply left-4 top-2;
  }

  &-md {
    @apply text-sm;
    @apply left-4 top-2.5;
  }

  &-lg {
    @apply text-base;
    @apply left-4 top-3;
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
}

.size {
  &-sm {
    .right-slot-label {
      @apply top-[3.125rem];
    }

    &::v-deep {
      &.right-slot {
        .input {
          @apply md:pb-2 !important;
        }
      }

      .input {
        @apply text-xs;
        @apply pt-8 pb-2;

        &::placeholder {
          @apply text-xs;
        }
      }
    }
  }

  &-md {
    .right-slot-label {
      @apply top-14;
    }

    &::v-deep {
      &.right-slot {
        .input {
          @apply md:pb-2.5 !important;
        }
      }

      .input {
        @apply text-base;
        @apply pt-7 pb-2.5;

        &::placeholder {
          @apply text-base;
        }
      }
    }
  }

  &-lg {
    .right-slot-label {
      @apply top-[3.875rem];
    }

    &::v-deep {
      &.right-slot {
        .input {
          @apply md:pb-3 !important;
        }
      }

      .input {
        @apply text-lg;
        @apply pt-8 pb-3;

        &::placeholder {
          @apply text-lg;
        }
      }
    }
  }
}

.right-slot {
  &::v-deep {
    .input {
      @apply pb-11;
    }
  }
}

.close-icon {
  @apply absolute;
  top: 18px;
  right: 10px;
}
</style>
