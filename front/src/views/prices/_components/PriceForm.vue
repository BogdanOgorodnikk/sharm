<template>
  <div>
    <OurCard>
      <OurInput
        v-model="form.name"
        :label="$t('label.name')"
        :placeholder="$t('placeholder.priceName')"
        :error="priceNameError"
      />

      <OurSelect
        v-model="form.currency"
        :label="$t('label.currency')"
        :error="currencyError"
        :options="currencyForSelect"
        value-key="label"
      />

      <OurDatePicker v-model="form.fromDate" :error="priceDateError" :label="$t('label.from')" />

      <OurHint v-if="editedPage">
        <div>
          {{ $t("description.raiseOrLowerPrice") }}
        </div>
      </OurHint>

      <OurInput
        v-if="editedPage"
        v-model="priceCoefficient"
        :label="$t('label.raiseOrLowerPrice')"
      />
    </OurCard>

    <OurCard class="price-card">
      <div class="price-table">
        <div class="price-table-header">
          <div class="price-table-header-item price-table-header-item-product">
            {{ $t("label.product") }}
          </div>

          <div class="price-table-header-item price-table-header-item-price">
            {{ $t("label.prices") }}
          </div>
        </div>

        <div class="price-table-body">
          <div v-for="(item, index) in form.tableItems" :key="index" class="price-table-row">
            <OurSelect
              v-model="item.productId"
              :options="productsForSelect"
              :placeholder="$t('placeholder.productName')"
              class="price-table-row-select price-table-row-select-product"
            />

            <OurInput
              v-model="item.specialPrice"
              :placeholder="$t('label.specialPrice')"
              class="price-table-row-input"
              validation-rule="number"
            />
            <OurInput
              v-model="item.firstCategory"
              :placeholder="$t('label.categoryNumber', { title: 1 })"
              class="price-table-row-input"
              validation-rule="number"
            />
            <OurInput
              v-model="item.secondCategory"
              :placeholder="$t('label.categoryNumber', { title: 2 })"
              class="price-table-row-input"
              validation-rule="number"
            />
            <OurInput
              v-model="item.thirdaryCategory"
              :placeholder="$t('label.categoryNumber', { title: 3 })"
              class="price-table-row-input"
              validation-rule="number"
            />
            <OurInput
              v-model="item.fourthCategory"
              :placeholder="$t('label.categoryNumber', { title: 4 })"
              class="price-table-row-input"
              validation-rule="number"
            />
            <OurInput
              v-model="item.fivesCategory"
              :placeholder="$t('label.categoryNumber', { title: 5 })"
              class="price-table-row-input price-table-row-input-last"
              validation-rule="number"
            />

            <OurSvgIcon
              interactive
              size="xs"
              class="price-table-row-delete"
              name="Close"
              color="gray"
              pill
              @click="onClickRemoveItem(index)"
            />
          </div>
        </div>
      </div>

      <OurLink
        class="price-table-add-button"
        :text="$t('button.addMore')"
        variant="secondary"
        dashed
        size="xs"
        @mousedown="onClickAddTableItem"
      />
    </OurCard>
  </div>
</template>

<script>
import debounce from "lodash.debounce";

import OurCard from "@/components/OurCard";
import OurInput from "@/components/form/OurInput";
import OurDatePicker from "@/components/OurDatepicker";
import OurSelect from "@/components/OurSelect";
import OurLink from "@/components/OurButtonLink";
import OurSvgIcon from "@/components/OurSvgIcon";
import { getProducts } from "@/api/product";
import { required } from "vuelidate/lib/validators";
import OurHint from "@/components/OurHint";

export default {
  components: {
    OurHint,
    OurSvgIcon,
    OurLink,
    OurSelect,
    OurDatePicker,
    OurInput,
    OurCard,
  },

  props: {
    value: {
      type: Object,
      default: () => ({}),
    },

    editedPage: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    priceCoefficient: "",
    form: {
      name: "",
      currency: "₴",
      fromDate: "",
      tableItems: [
        {
          productId: "",
          specialPrice: "",
          firstCategory: "",
          secondCategory: "",
          thirdaryCategory: "",
          fourthCategory: "",
          fivesCategory: "",
        },
        {
          productId: "",
          specialPrice: "",
          firstCategory: "",
          secondCategory: "",
          thirdaryCategory: "",
          fourthCategory: "",
          fivesCategory: "",
        },
      ],
    },
    products: [],
    currencyForSelect: [
      {
        label: "₴",
      },
      {
        label: "$",
      },
      {
        label: "€",
      },
    ],
  }),

  validations: {
    form: {
      name: { required },
      currency: { required },
      fromDate: { required },
    },
  },

  computed: {
    priceNameError() {
      const isDirty = this.$v.form.name.$dirty;
      const isFilled = this.$v.form.name.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    currencyError() {
      const isDirty = this.$v.form.currency.$dirty;
      const isFilled = this.$v.form.currency.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    priceDateError() {
      const isDirty = this.$v.form.fromDate.$dirty;
      const isFilled = this.$v.form.fromDate.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    productsForSelect() {
      const selectedProducts = this.form.tableItems.map((item) => item.productId);

      return this.products.map((item) => {
        const isSelectedProduct = selectedProducts.find((product) => product === item.id);

        return {
          id: item.id,
          $isDisabled: !!isSelectedProduct,
          label: item.name,
        };
      });
    },
  },

  watch: {
    form: {
      handler: "onChangeForm",
      deep: true,
    },

    priceCoefficient: "onChangePriceCoefficient",
  },

  async created() {
    this.products = await getProducts();

    this.prefillForm();
  },

  methods: {
    onChangePriceCoefficient: debounce(async function () {
      this.form.tableItems.forEach((item) => {
        item.specialPrice = this.calculatePercentRatio(item.specialPrice);
        item.firstCategory = this.calculatePercentRatio(item.firstCategory);
        item.secondCategory = this.calculatePercentRatio(item.secondCategory);
        item.thirdaryCategory = this.calculatePercentRatio(item.thirdaryCategory);
        item.fourthCategory = this.calculatePercentRatio(item.fourthCategory);
        item.fivesCategory = this.calculatePercentRatio(item.fivesCategory);
      });
    }, 1500),

    calculatePercentRatio(amount) {
      const fullPercent = 100;
      const percentCoeff = this.priceCoefficient / fullPercent;

      const ratio = amount * percentCoeff;

      return Number(amount) + ratio;
    },

    prefillForm() {
      this.form.name = this.value.productName;
      this.form.fromDate = this.value.date;
      this.form.currency = this.value.currencySymbol;
      this.form.tableItems = this.value?.products?.length
        ? [...this.value.products]
        : [...this.form.tableItems];
    },

    onChangeForm(form) {
      form.isValid = !this.$v.$invalid;

      this.$emit("input", form);
    },

    validate() {
      this.$v.$touch();
    },

    onClickAddTableItem() {
      this.form.tableItems.push({
        productId: "",
        specialPrice: "",
        firstCategory: "",
        secondCategory: "",
        thirdaryCategory: "",
        fourthCategory: "",
        fivesCategory: "",
      });
    },

    onClickRemoveItem(index) {
      const minTableItemsLength = 2;

      this.form.tableItems = this.form.tableItems.filter((item, itemIndex) => itemIndex !== index);

      if (minTableItemsLength > this.form.tableItems.length) {
        this.form.tableItems.push({
          productId: "",
          specialPrice: "",
          firstCategory: "",
          secondCategory: "",
          thirdaryCategory: "",
          fourthCategory: "",
          fivesCategory: "",
        });
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.price {
  &-card {
    @apply mt-6;
  }

  &-table {
    &-add-button {
      @apply mt-2 ml-2;
    }

    &-header {
      @apply hidden md:flex;
      @apply mb-1;

      &-item {
        @apply text-sm font-normal text-gray-500;
        @apply pl-4;

        &-product {
          @apply flex-none;
          @apply w-56;
        }

        &-price {
          @apply w-full;
        }
      }
    }

    &-body {
      @apply border-gray-300 md:rounded-xl md:border;
      @apply space-y-4 md:space-y-0;
    }

    &-row {
      @apply relative md:flex;
      @apply rounded-xl border border-gray-300 md:rounded-none md:border-0 md:border-b;

      &:last-child {
        @apply md:border-b-0;
      }

      &-select {
        @apply flex-none cursor-pointer;

        &::v-deep {
          .multiselect-wrapper {
            @apply rounded-none rounded-xl border-0;

            &:focus-within {
              @apply border-gray-300 ring-0;
            }

            &:hover {
              @apply border-gray-300;
            }
          }

          .multiselect {
            @apply p-2.5;

            .multiselect__tags {
              @apply p-0;
            }

            .multiselect-caret {
              @apply mr-0 mt-0 flex;
            }
          }
        }

        &-product {
          @apply md:w-56;
        }
      }

      &-input {
        &::v-deep {
          .input-block {
            @apply h-full;
          }

          .input {
            @apply p-2.5;
            @apply rounded-none border-b-0 border-r-0 border-l-0 md:border-l md:border-t-0;

            &:hover {
              @apply border-gray-300;
            }

            &:focus {
              @apply border-gray-300 ring-0;
            }
          }
        }

        &-last {
          &::v-deep {
            .input {
              @apply rounded-b-xl md:rounded-r-xl md:rounded-l-none;
            }
          }
        }
      }

      &-delete {
        @apply absolute -right-5 md:top-1.5;
        @apply shadow-2xl;

        top: calc(50% - 0.75rem);
      }
    }
  }
}
</style>
