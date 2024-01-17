<template>
  <div>
    <OurCard v-if="isAdmin" class="mb-4">
      <OurSelect
        v-model="clientId"
        :label="$t('label.client')"
        :placeholder="$t('placeholder.client')"
        :options="usersForSelectWithPrice"
        :error="clientError"
      />
    </OurCard>

    <OurCard>
      <div class="orders-table">
        <div class="orders-table-header">
          <div class="orders-table-header-item orders-table-header-item-name">
            {{ $t("label.productName") }}
          </div>
          <div class="orders-table-header-item orders-table-header-item-number">
            {{ $t("label.number") }}
          </div>
          <div class="orders-table-header-item orders-table-header-item-textile">
            {{ $t("label.textile") }}
          </div>
          <div class="orders-table-header-item orders-table-header-item-textile-place">
            {{ $t("label.category") }}
          </div>
          <div class="orders-table-header-item orders-table-header-item-comment">
            {{ $t("label.note") }}
          </div>
          <div class="orders-table-header-item orders-table-header-item-money">
            {{ $t("label.amount") }}
          </div>
        </div>

        <div class="orders-table-body">
          <div v-for="(item, index) in tableItems" :key="index" class="orders-table-row">
            <OurSelect
              v-model="item.productId"
              :placeholder="$t('placeholder.productName')"
              class="orders-table-row-select name-select"
              :options="productsForSelect"
              @removeValue="onRemoveProduct(index)"
              @change="onChangeProduct(index)"
            />

            <OurInput
              v-model="item.number"
              validation-rule="number"
              class="orders-table-row-input number-input"
              :class="{ 'order-input-error': tableItemError(index, 'number') }"
              @input="onChangeTextiles(index)"
            />

            <div class="orders-table-row-textile-wrapper">
              <div class="orders-table-row-textile">
                <OurSelect
                  v-model="item.textileMain"
                  :with-input="isAdmin"
                  :disabled="!item.productId"
                  :options="textilesForSelect(item.productId)"
                  :placeholder="$t('placeholder.selectTextile')"
                  class="orders-table-row-select textile-select"
                  group-label="category"
                  group-values="textiles"
                  value-key="label"
                  :class="{ 'order-select-error': tableItemError(index, 'textileMain') }"
                  @input="onChangeTextiles(index, 'textileMain')"
                />

                <OurSelect
                  v-model="item.textileMainCategory"
                  :options="categoriesOptions"
                  :disabled="!item.textileMain || !isAdmin"
                  :placeholder="$t('placeholder.category')"
                  :class="{ 'order-select-error': tableItemError(index, 'textileMainCategory') }"
                  value-key="label"
                  class="orders-table-row-select orders-table-row-textile-input"
                  @change="onChangeTextiles(index)"
                />
              </div>

              <div class="orders-table-row-textile">
                <OurSelect
                  v-model="item.textileA"
                  :with-input="isAdmin"
                  :disabled="!item.productId"
                  :options="textilesForSelect(item.productId)"
                  class="orders-table-row-select textile-select"
                  group-label="category"
                  group-values="textiles"
                  value-key="label"
                  :class="{ 'order-select-error': tableItemError(index, 'textileA') }"
                  @input="onChangeTextiles(index, 'textileA')"
                />

                <OurSelect
                  v-model="item.textileACategory"
                  :options="categoriesOptions"
                  :disabled="!item.textileA || !isAdmin"
                  value-key="label"
                  class="orders-table-row-select orders-table-row-textile-input"
                  :class="{ 'order-select-error': tableItemError(index, 'textileACategory') }"
                  @change="onChangeTextiles(index)"
                />
              </div>

              <div class="orders-table-row-textile">
                <OurSelect
                  v-model="item.textileB"
                  :with-input="isAdmin"
                  :class="{ 'order-select-error': tableItemError(index, 'textileB') }"
                  :disabled="!item.productId"
                  :options="textilesForSelect(item.productId)"
                  class="orders-table-row-select textile-select"
                  group-label="category"
                  group-values="textiles"
                  value-key="label"
                  @input="onChangeTextiles(index, 'textileB')"
                />

                <OurSelect
                  v-model="item.textileBCategory"
                  :disabled="!item.textileB || !isAdmin"
                  :options="categoriesOptions"
                  value-key="label"
                  class="orders-table-row-select orders-table-row-textile-input"
                  :class="{ 'order-select-error': tableItemError(index, 'textileBCategory') }"
                  @change="onChangeTextiles(index)"
                />
              </div>

              <div class="orders-table-row-textile">
                <OurSelect
                  v-model="item.textileC"
                  :with-input="isAdmin"
                  :class="{ 'order-select-error': tableItemError(index, 'textileC') }"
                  :disabled="!item.productId"
                  :options="textilesForSelect(item.productId)"
                  class="orders-table-row-select textile-select"
                  group-label="category"
                  group-values="textiles"
                  value-key="label"
                  @input="onChangeTextiles(index, 'textileC')"
                />

                <OurSelect
                  v-model="item.textileCCategory"
                  :disabled="!item.textileC || !isAdmin"
                  :options="categoriesOptions"
                  value-key="label"
                  :class="{ 'order-select-error': tableItemError(index, 'textileCCategory') }"
                  class="orders-table-row-select orders-table-row-textile-input"
                  @change="onChangeTextiles(index)"
                />
              </div>
            </div>

            <OurTextarea
              v-model="item.note"
              rows="8"
              class="orders-table-row-textarea comment-input"
            />

            <OurMoney
              v-if="item.amount.sum"
              :item="item.amount"
              size="xl"
              class="orders-table-row-money"
            />

            <OurSvgIcon
              interactive
              size="xs"
              class="orders-table-row-delete"
              name="Close"
              color="gray"
              pill
              @click="onClickRemoveItem(index)"
            />
          </div>
        </div>
      </div>

      <div class="orders-actions">
        <OurLink
          :text="$t('button.addMore')"
          variant="secondary"
          dashed
          size="xs"
          @mousedown="onClickAddTableItem"
        />

        <OurLink
          url="/textiles"
          target-blank
          :text="$t('button.viewTextile')"
          variant="secondary"
          dashed
          size="xs"
        />
      </div>

      <div class="orders-general-amount">
        <div class="orders-general-amount-title">{{ $t("title.orderAmount") }}:</div>

        <OurMoney class="orders-general-amount-money" size="xl" :item="orderGeneralAmount" />
      </div>
    </OurCard>
  </div>
</template>

<script>
import OurSelect from "@/components/OurSelect";
import OurCard from "@/components/OurCard";
import OurInput from "@/components/form/OurInput";
import OurMoney from "@/components/OurMoney";
import OurLink from "@/components/OurButtonLink";
import OurSvgIcon from "@/components/OurSvgIcon";
import { mapActions, mapGetters, mapState } from "vuex";
import OurMultiselect from "@/components/OurSelectMulti";
import OurTextarea from "@/components/OurTextarea";
import { requiredIf } from "vuelidate/lib/validators";

export default {
  components: {
    OurTextarea,
    OurMultiselect,
    OurSvgIcon,
    OurLink,
    OurMoney,
    OurInput,
    OurCard,
    OurSelect,
  },

  data() {
    return {
      clientId: "",
      tableItems: [
        {
          productId: "",
          number: "",
          textileMainCategory: "",
          textileMain: "",
          textileACategory: "",
          textileA: "",
          textileBCategory: "",
          textileB: "",
          textileCCategory: "",
          textileC: "",
          note: "",
          amount: {},
        },
      ],
    };
  },

  validations: {
    clientId: {
      required: requiredIf(function () {
        return this.isAdmin;
      }),
    },
    tableItems: {
      $each: {
        number: {
          required: requiredIf(function (item) {
            return item.productId;
          }),
        },
        textileMain: {
          required: requiredIf(function (item) {
            return item.productId;
          }),
        },
        textileA: {
          required: requiredIf(function (item) {
            return item.textileACategory && item.productId;
          }),
        },
        textileB: {
          required: requiredIf(function (item) {
            return item.textileBCategory && item.productId;
          }),
        },
        textileC: {
          required: requiredIf(function (item) {
            return item.textileCCategory && item.productId;
          }),
        },
        textileMainCategory: {
          required: requiredIf(function (item) {
            return item.textileMain;
          }),
        },
        textileACategory: {
          required: requiredIf(function (item) {
            return item.textileA;
          }),
        },
        textileBCategory: {
          required: requiredIf(function (item) {
            return item.textileB;
          }),
        },
        textileCCategory: {
          required: requiredIf(function (item) {
            return item.textileC;
          }),
        },
      },
    },
  },

  computed: {
    ...mapState("product", ["products"]),
    ...mapState("textile", ["textiles"]),
    ...mapGetters("textile", ["textilesForSelect"]),
    ...mapGetters("user", ["isAdmin", "usersForSelectWithPrice"]),

    clientError() {
      const isDirty = this.$v.clientId.$dirty;
      const isFilled = this.$v.clientId.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    categoriesOptions() {
      return [
        {
          label: 0,
        },
        {
          label: 1,
        },
        {
          label: 2,
        },
        {
          label: 3,
        },
        {
          label: 4,
        },
        {
          label: 5,
        },
      ];
    },

    productsForSelect() {
      const productsWithCategory = this.products.filter(
        (item) =>
          item.specialPrice ||
          item.firstCategory ||
          item.secondCategory ||
          item.thirdaryCategory ||
          item.fourthCategory ||
          item.firstCategory
      );

      return productsWithCategory.map((item) => ({
        id: item.id,
        label: item.name,
      }));
    },

    orderGeneralAmount() {
      const [firstProduct] = this.products;
      const currencySymbol = firstProduct?.currencySymbol;
      let sum = 0;

      this.tableItems.forEach((item) => {
        sum += item.amount?.sum || 0;
      });

      return {
        sum,
        currencySymbol,
      };
    },
  },

  watch: {
    tableItems: {
      handler: "onChangeTableItems",
      deep: true,
    },
    clientId: "onChangeClientId",
  },

  async created() {
    if (this.isAdmin) {
      await Promise.all([this.getTextiles(), this.getUsers()]);
    } else {
      await Promise.all([this.getProducts(), this.getTextiles()]);
    }
  },

  methods: {
    ...mapActions("product", ["getProducts"]),
    ...mapActions("textile", ["getTextiles"]),
    ...mapActions("user", ["getUsers"]),

    validate() {
      this.$v.$touch();
    },

    async onChangeClientId() {
      await this.getProducts(this.clientId);

      this.tableItems.forEach((item, index) => {
        this.onChangeTextiles(index);
      });

      const form = {
        clientId: this.clientId,
        products: this.tableItems,
        amount: this.orderGeneralAmount,
        isValid: !this.$v.$invalid,
      };

      this.$emit("input", form);
    },

    onChangeTableItems(tableItems) {
      const form = {
        clientId: this.clientId,
        products: tableItems,
        amount: this.orderGeneralAmount,
        isValid: !this.$v.$invalid,
      };

      this.$emit("input", form);
    },

    tableItemError(index, value) {
      const isDirty = this.$v.tableItems.$each[index][value].$dirty;
      const isFilled = this.$v.tableItems.$each[index][value].required;

      return isDirty && !isFilled;
    },

    onRemoveProduct(index) {
      this.tableItems[index].productId = "";
      this.tableItems[index].number = "";
      this.tableItems[index].textileMain = "";
      this.tableItems[index].textileA = "";
      this.tableItems[index].textileACategory = "";
      this.tableItems[index].textileB = "";
      this.tableItems[index].textileBCategory = "";
      this.tableItems[index].textileC = "";
      this.tableItems[index].textileCCategory = "";
      this.tableItems[index].note = "";
      this.tableItems[index].amount = {};
    },

    onChangeProduct(index) {
      this.tableItems[index].number = "";
      this.tableItems[index].textileMain = "";
      this.tableItems[index].textileA = "";
      this.tableItems[index].textileACategory = "";
      this.tableItems[index].textileB = "";
      this.tableItems[index].textileBCategory = "";
      this.tableItems[index].textileC = "";
      this.tableItems[index].textileCCategory = "";
      this.tableItems[index].note = "";
      this.tableItems[index].amount = {};
    },

    onChangeTextiles(index, textile) {
      const item = this.tableItems[index];

      const textileMain = this.textiles.find((textile) => textile.name === item.textileMain);
      const textileA = this.textiles.find((textile) => textile.name === item.textileA);
      const textileB = this.textiles.find((textile) => textile.name === item.textileB);
      const textileC = this.textiles.find((textile) => textile.name === item.textileC);

      let mostExpenseCategory = -1;

      if (textile === "textileMain") {
        this.tableItems[index].textileMainCategory =
          textileMain?.category >= 0 ? textileMain?.category : item.textileMainCategory;
      } else if (textile === "textileA") {
        this.tableItems[index].textileACategory =
          textileA?.category >= 0 ? textileA?.category : item.textileACategory;
      } else if (textile === "textileB") {
        this.tableItems[index].textileBCategory =
          textileB?.category >= 0 ? textileB?.category : item.textileBCategory;
      } else if (textile === "textileC") {
        this.tableItems[index].textileCCategory =
          textileC?.category >= 0 ? textileC?.category : item.textileCCategory;
      }

      const textileCategories = [
        item.textileMainCategory !== "" && item.textileMainCategory >= 0
          ? item.textileMainCategory
          : textileMain?.category,
        item.textileACategory !== "" && item.textileACategory >= 0
          ? item.textileACategory
          : textileA?.category,
        item.textileBCategory !== "" && item.textileBCategory >= 0
          ? item.textileBCategory
          : textileB?.category,
        item.textileCCategory !== "" && item.textileCCategory >= 0
          ? item.textileCCategory
          : textileC?.category,
      ];

      textileCategories.forEach((category) => {
        mostExpenseCategory = category > mostExpenseCategory ? category : mostExpenseCategory;
      });

      const categoryCode = {
        0: "specialPrice",
        1: "firstCategory",
        2: "secondCategory",
        3: "thirdaryCategory",
        4: "fourthCategory",
        5: "fivesCategory",
      };

      const selectedProduct = this.products.find((product) => product.id === item.productId);
      const sum = selectedProduct?.[categoryCode[mostExpenseCategory]] * item?.number;

      if (isNaN(sum) && item.amount?.sum !== 0) {
        item.amount = {
          sum: 0,
        };
      } else if (sum && item.amount.sum !== sum) {
        item.amount = {
          sum,
          currencySymbol: selectedProduct?.currencySymbol,
        };
      }
    },

    onClickAddTableItem() {
      this.tableItems.push({
        productId: "",
        number: "",
        textileMainCategory: "",
        textileMain: "",
        textileACategory: "",
        textileA: "",
        textileBCategory: "",
        textileB: "",
        textileCCategory: "",
        textileC: "",
        note: "",
        amount: {},
      });
    },

    onClickRemoveItem(index) {
      const minTableItemsLength = 1;

      this.tableItems = this.tableItems.filter((item, itemIndex) => itemIndex !== index);

      if (minTableItemsLength > this.tableItems.length) {
        this.tableItems.push({
          productId: "",
          number: "",
          textileMainCategory: "",
          textileMain: "",
          textileACategory: "",
          textileA: "",
          textileBCategory: "",
          textileB: "",
          textileCCategory: "",
          textileC: "",
          note: "",
          amount: {},
        });
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.orders-info {
  @apply mb-6;
}

.order-input-error {
  &::v-deep {
    .input {
      @apply bg-red-100;
    }
  }
}

.order-select-error {
  &::v-deep {
    .multiselect-wrapper {
      @apply bg-red-100;

      .multiselect__tags,
      .multiselect__input {
        @apply bg-red-100;
      }
    }
  }
}

.orders {
  &-actions {
    @apply !mt-2 flex space-x-4;
    @apply ml-2;
  }

  &-general-amount {
    @apply flex items-center;

    &-title {
      @apply text-xl font-medium text-base-dark;
      @apply pr-2;
    }

    &-money {
      &::v-deep {
        .money-block {
          @apply text-base-dark;
        }
      }
    }
  }
}

.orders-table {
  @apply md:overflow-x-scroll xl:overflow-x-visible;

  &-header {
    @apply mb-1 hidden md:flex;
    @apply w-[65rem] md:w-auto;

    &-item {
      @apply text-sm font-normal text-gray-500;
      @apply pl-4;

      &-name,
      &-textile {
        @apply w-56;
      }

      &-textile-place {
        @apply w-40;
      }

      &-number {
        @apply w-[5.625rem];
      }

      &-money {
        @apply pr-4 text-right;
      }

      &-comment {
        @apply w-40;
      }
    }
  }

  &-body {
    @apply border-gray-300 md:rounded-xl md:border;
    @apply md:w-[65rem] xl:w-auto;
    @apply space-y-4 md:space-y-0;
  }

  &-row {
    @apply relative md:flex;
    @apply rounded-xl border border-gray-300 md:rounded-none md:border-0 md:border-b;

    &:last-child {
      @apply md:border-0;
    }

    &-select {
      @apply flex-none cursor-pointer;

      &:first-child {
        &::v-deep {
          .multiselect-wrapper {
            @apply rounded-t-xl md:rounded-tl-xl md:rounded-tr-none;
          }
        }
      }

      &::v-deep {
        .multiselect-wrapper {
          @apply rounded-none border-0 border-b !border-gray-300;

          &:focus-within {
            @apply border-gray-300 ring-0;
          }

          &:hover {
            @apply border-gray-300;
          }
        }

        .multiselect-angle {
          @apply mt-0;

          .svg-icon {
            @apply block;
          }
        }

        .multiselect {
          @apply py-2.5 px-4;

          .multiselect__tags {
            @apply mb-[0.1875rem] p-0;
          }

          .multiselect-caret {
            @apply mr-0 mt-0 flex;
          }
        }
      }

      &.name-select {
        @apply h-max md:w-56;

        &::v-deep {
          .multiselect-wrapper {
            @apply h-[2.8125rem];
          }
        }
      }

      &.textile-select {
        @apply w-full flex-auto md:w-56 md:flex-none;

        &::v-deep {
          .multiselect-wrapper {
            @apply rounded-none;
          }
        }
      }
    }

    &-textarea {
      @apply md:w-40;

      &::v-deep {
        .wrapper {
          @apply rounded-none border-0 md:border-x;
          @apply h-full;

          &:hover {
            @apply border-gray-300;
          }

          &:focus-within {
            @apply border-gray-300 ring-0;
          }

          .textarea {
            @apply !rounded-xl shadow-none md:rounded-none;
          }
        }
      }
    }

    &-textile {
      @apply flex;
      @apply border-gray-300 md:border-l;

      &-wrapper {
        .orders-table-row-textile {
          .orders-table-row-textile-input::v-deep .multiselect-wrapper {
            @apply !border-r-0 !border-l;
          }

          &:last-of-type {
            .orders-table-row-select {
              &::v-deep {
                .multiselect-wrapper {
                  @apply md:border-b-0;
                }
              }
            }
          }
        }
      }

      .orders-table-row-select {
        &::v-deep {
          .multiselect__single {
            @apply pt-px;
          }
        }
      }

      &-input {
        @apply w-full !flex-auto md:w-40 md:!flex-none;

        &::v-deep {
          .input {
            @apply !border-r !border-b;

            &:disabled {
              @apply border-gray-300;
            }
          }
        }
      }
    }

    &-input {
      @apply flex-none;

      &::v-deep {
        .input-block {
          @apply h-full;
        }

        .input {
          @apply py-2.5 px-4;
          @apply rounded-none border-t-0 border-b-0 border-r-0 border-l-0 md:border-l;

          &:hover {
            @apply border-gray-300;
          }

          &:focus {
            @apply border-gray-300 ring-0;
          }
        }
      }

      &.number-input {
        @apply md:w-[5.625rem];

        &::v-deep {
          .input-block {
            @apply items-start;

            .input {
              @apply h-[2.8125rem] border-b;
            }
          }
        }
      }

      &.comment-input {
        @apply md:w-40;
      }
    }

    &-money {
      @apply px-4 pt-4 pb-[0.4375rem];
      @apply flex items-start justify-start;
      @apply h-max overflow-x-auto;
      @apply border-t border-gray-300 md:border-b md:border-t-0;
      @apply w-full;

      @media (min-width: 768px) {
        width: calc(100% - 53.625rem);
      }

      &::v-deep {
        .money-block {
          @apply text-base-dark;
        }
      }
    }

    &-delete {
      @apply absolute -right-5;
      top: calc(50% - 0.75rem);
    }
  }
}
</style>
