<template>
  <div>
    <div class="multiselect-wrapper" :class="multiselectClass">
      <label v-if="label" class="label" :class="labelClasses" :for="id">
        {{ label }}
      </label>

      <Multiselect
        :id="id"
        ref="select"
        v-model="selectValue"
        class="multiselect"
        :options="selectOptions"
        :options-limit="optionsLimit"
        :label="itemLabel"
        :group-label="groupLabel"
        :group-values="groupValues"
        :track-by="valueKey"
        :open-direction="openDirection"
        select-label=""
        deselect-label=""
        selected-label=""
        :hide-selected="hideSelected"
        :disabled="disabled"
        :placeholder="placeholder"
        :allow-empty="allowEmpty"
        :internal-search="withInternalSearch"
        :loading="isLoading"
        :preserve-search="withInput"
        @open="onOpen"
        @close="onClose"
        @search-change="findOptions"
        @remove="removeValue"
        @input="onInput"
      >
        <template #placeholder>
          <span v-if="value" class="text-base-dark"> {{ value }}</span>
          <span v-else> {{ placeholder }}</span>
        </template>

        <template #singleLabel="props">
          <!-- @slot Use it to add single label. -->
          <slot :scope-props="props" name="singleLabel" />
        </template>

        <template slot="option" slot-scope="props">
          <!-- @slot Use it to add option. -->
          <slot :scope-props="props" name="option" />

          <div v-if="groupValues && !isShownOptionSlot">
            <div v-if="props.option.$groupLabel">
              {{ props.option.$groupLabel }}
            </div>

            <div
              v-else-if="props.option.isSubGroup"
              class="group-label"
              :style="leftMarginForSubCategory(props.option.level)"
            >
              {{ props.option.label }}
            </div>

            <div v-else :style="leftMarginForSubCategory(props.option.level)">
              {{ props.option.label }}
            </div>
          </div>
        </template>

        <template #noResult>
          {{ $t("component.ourSelect.listIsEmpty") }}
        </template>

        <template #noOptions>
          {{ $t("component.ourSelect.noDataToShow") }}
        </template>

        <template #caret="{ toggle }">
          <div v-if="!selectValue" class="multiselect-caret" @mousedown.prevent.stop="toggle">
            <OurSvgIcon interactive color="gray" name="Angle-down" class="icon" />
          </div>

          <div v-else class="multiselect-caret">
            <OurSvgIcon
              interactive
              size="sm"
              color="gray"
              name="Close"
              @click="[onClickRemoveValue(), toggle()]"
            />
          </div>
        </template>
      </Multiselect>

      <div v-if="isShownAfterCaretSlot" class="after-caret-slot">
        <!-- @slot Use it to add something after caret. -->
        <slot name="after-caret" />
      </div>
    </div>

    <div v-if="description && !error" class="description">
      {{ description }}
    </div>

    <p v-if="error && !value.length" class="error-message" data-cy="select-error-message">
      {{ error }}
    </p>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import getRandomId from "@/services/randomId.service";
import OurSvgIcon from "@/components/OurSvgIcon";

export default {
  name: "OurSelect",

  components: {
    Multiselect,
    OurSvgIcon,
  },

  props: {
    /**
     * Generates unique element id.
     * @ignore
     */
    id: {
      type: String,
      default: () => getRandomId(),
    },

    /**
     * Set input select value.
     */
    value: {
      type: [String, Number],
      default: "",
    },

    /**
     * Set options for component.
     */
    options: {
      type: Array,
      default: () => [],
    },

    /**
     * Set component label.
     */
    label: {
      type: String,
      default: "",
    },

    /**
     * Label from option Object, that will be visible in the dropdown.
     */
    itemLabel: {
      type: String,
      default: "label",
    },

    /**
     * Set input placeholder.
     */
    placeholder: {
      type: String,
      default: "",
    },

    /**
     * Set error message.
     */
    error: {
      type: String,
      default: "",
    },

    /**
     * Make input inactive.
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Allows to remove all selected values. Otherwise one must be left selected.
     */
    allowEmpty: {
      type: Boolean,
      default: false,
    },

    /**
     * Set name of the property containing the group label.
     */
    groupLabel: {
      type: String,
      default: "label",
    },

    /**
     * Set name of the property containing the group values.
     */
    groupValues: {
      type: String,
      default: "",
    },

    /**
     * Allow internal search.
     */
    withInternalSearch: {
      type: Boolean,
      default: true,
    },

    /**
     * Set limits the options displayed in the dropdown to the first X options.
     */
    optionsLimit: {
      type: Number,
      default: 300,
    },

    /**
     * Set api url for options.
     */
    apiUrl: {
      type: String,
      default: "",
    },

    /**
     * Set track value key.
     */
    valueKey: {
      type: String,
      default: "id",
    },

    /**
     * Fixed opening direction (instead of auto). Options are "above"/"top" or "below"/"bottom".
     * @values auto, top, bottom
     */
    openDirection: {
      type: String,
      default: "auto",
    },

    /**
     * Set description for input.
     */
    description: {
      type: String,
      default: "",
    },

    hideSelected: {
      type: Boolean,
      default: false,
    },

    withInput: Boolean,
  },

  data: () => ({
    isLoading: false,
    asyncValue: "",
    asyncOptions: [],
    isOpen: false,
  }),

  computed: {
    multiselectClass() {
      return {
        error: this.error && !this.value.length,
        "multiselect-wrapper-disabled": this.disabled,
        "group-select": this.groupValues,
        "after-caret": this.isShownAfterCaretSlot,
      };
    },

    isShownAfterCaretSlot() {
      return !!this.$slots["after-caret"];
    },

    isShownOptionSlot() {
      return !!this.$slots["option"];
    },

    labelClasses() {
      return {
        "label-color": this.isOpen,
        "error-label": this.error && !this.value.length,
      };
    },

    selectOptions() {
      return this.withInternalSearch ? this.options : this.asyncOptions;
    },

    selectValue: {
      get() {
        if (this.groupValues) {
          const option = this.options.find((option) => {
            return option[this.groupValues].find((item) => item[this.valueKey] === this.value);
          });

          return option?.[this.groupValues].find((option) => option[this.valueKey] === this.value);
        }

        return this.options.find((option) => option[this.valueKey] === this.value);
      },
      set(newItem) {
        this.$emit("input", newItem?.[this.valueKey]);
      },
    },
  },

  watch: {
    options: {
      handler: "onChangeOptions",
      deep: true,
    },
  },

  methods: {
    onOpen() {
      this.$emit("open");
      this.isOpen = true;
    },

    onClickRemoveValue() {
      this.selectValue = "";

      this.$emit("removeValue");
    },

    onChangeOptions() {
      const subOptions = document.querySelectorAll(".group-label");

      subOptions.forEach((subOption) => {
        const subOptionsParent = subOption.parentElement.parentElement;

        subOptionsParent.classList.add("multiselect__option");
        subOptionsParent.classList.add("multiselect__option--group");
        subOptionsParent.classList.add("multiselect__option--disabled");
      });
    },

    onClose() {
      this.isOpen = false;

      this.$emit("close");
    },

    onInput() {
      this.$emit("change");
    },

    leftMarginForSubCategory(level) {
      const baseMargin = 1;

      if (level > 1) {
        return `margin-left: ${baseMargin * (level - 1)}rem`;
      }
    },

    removeValue(itemToRemove) {
      this.$emit("remove", itemToRemove);

      if (this.withInternalSearch) return;

      this.asyncValue = null;
    },

    async findOptions(query) {
      if (this.withInput) {
        this.$emit("input", query);
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.multiselect-wrapper {
  @apply flex w-full items-center;
  @apply rounded-lg border border-gray-300 bg-white;
  @apply relative;

  &:hover {
    @apply border-gray-400;
    @apply transition duration-100 ease-in-out;
  }

  &:focus-within {
    @apply border-gray-500 ring-4 ring-gray-600 ring-opacity-15;
  }

  .multiselect {
    &-caret {
      @apply -mt-1.5 mr-4;
      @apply cursor-pointer;
    }

    &--active {
      @apply z-[inherit];

      .icon {
        @apply rotate-180 transform transition-all duration-300;
      }
    }

    &.multiselect--above {
      &::v-deep {
        .multiselect__content-wrapper {
          @apply bottom-full;
        }
      }
    }

    &::v-deep {
      @apply flex flex-row-reverse justify-between;
      @apply static min-h-full w-full overflow-hidden text-left;
      @apply pt-6;

      .multiselect {
        &__tags {
          @apply rounded-none border-0 bg-transparent;
          @apply mb-px pt-1 pb-2 pl-4 pr-4;
          @apply min-h-full w-full;
        }

        &__input {
          @apply text-base font-medium text-base-dark;
          @apply mb-px p-0;
          @apply relative inline-block min-h-full w-full align-top;
          @apply border-none bg-white;

          &:focus {
            @apply shadow-none outline-none ring-0;
          }

          &::placeholder {
            @apply text-base font-medium text-gray-400;
            @apply pt-px;
          }
        }

        &__placeholder {
          @apply inline-block;
          @apply whitespace-nowrap text-base font-medium text-gray-400;
          @apply mb-0 w-0 pt-px;
        }

        &__content-wrapper {
          @apply mt-10 mb-2 rounded-lg drop-shadow-xl;
          @apply absolute right-0;
          @apply z-50 block max-h-60 w-full overflow-auto;
          @apply bg-white;
          -webkit-overflow-scrolling: touch;
        }

        &__content {
          @apply inline-block list-none align-top;
          @apply m-0 min-w-full p-0;

          .multiselect__element:first-child {
            .multiselect__option--group {
              @apply !pt-4;
            }
          }
        }

        &__element {
          @apply block;
        }

        &__option {
          @apply whitespace-nowrap text-base font-normal normal-case text-base-dark no-underline;
          @apply relative block min-h-full cursor-pointer align-middle;
          @apply p-3;

          &:hover {
            @apply bg-gray-100;
          }

          &:active,
          &--selected {
            @apply !bg-gray-200 font-medium;
          }

          &:disabled {
            @apply text-gray-500;
          }

          &--highlight {
            @apply bg-transparent;
          }

          &--disabled {
            @apply pointer-events-none;
          }

          &--group {
            @apply bg-transparent;
            @apply text-xs font-medium uppercase text-gray-450;
            @apply pb-2 pt-6;
          }
        }

        &__single {
          @apply font-medium text-base-dark;
          @apply mb-px p-0;
          @apply relative inline-block w-full align-top;
          @apply border-none bg-white;
        }
      }
    }
  }
}

.multiselect-wrapper-disabled {
  @apply border-gray-100 bg-gray-100;

  &:hover {
    @apply border-gray-100;
  }

  &:focus-within {
    @apply border-gray-100 ring-0;
  }

  &::v-deep {
    .multiselect--disabled {
      @apply rounded-lg bg-transparent;
      @apply pointer-events-none opacity-100;

      .multiselect__single {
        @apply bg-gray-100;
      }
    }
  }
}

.icon {
  @apply transition-all duration-300;
}

.label {
  @apply absolute top-2.5 left-4 block;
  @apply text-sm font-normal text-gray-500;
  @apply z-10;

  &-color {
    @apply text-sm font-normal text-gray-500;
    z-index: 9999;
  }
}

.error {
  @apply border-red-300;

  &:hover {
    @apply border-red-400;
  }

  &:focus-within {
    @apply border-red-500 ring-4 ring-red-100;
  }

  &-label {
    @apply text-red-500;
  }

  &-message {
    @apply text-xs font-normal text-red-500;
    @apply mt-2 pl-4;
  }
}

.description {
  @apply text-xs font-normal text-gray-450;
  @apply pl-4 pt-2;
}

.group-label {
  @apply text-xs font-medium uppercase text-gray-450;
}

.after-caret {
  @apply flex-col items-start md:flex-row md:items-center;

  .after-caret-slot {
    @apply pb-2.5 pl-4 pr-4 md:pb-0 md:pl-0;
  }
}
</style>
