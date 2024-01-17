<template>
  <div class="space-y-6">
    <OurCard>
      <OurSelect
        v-model="orderProduct.productId"
        :error="productIdError"
        :label="$t('label.productName')"
        :placeholder="$t('placeholder.productName')"
        :options="productsForSelect"
        @removeValue="onRemoveProduct"
        @change="onChangeProduct"
      />

      <OurInput
        v-model="orderProduct.number"
        validation-rule="number"
        :error="numberError"
        :label="$t('label.number')"
        placeholder="1"
        @input="onChangeTextiles"
      />

      <OurTextarea
        v-model="orderProduct.note"
        :label="$t('label.note')"
        :placeholder="$t('label.note')"
      />
    </OurCard>

    <OurCard>
      <OurSelect
        v-model="orderProduct.textileMain"
        :error="textileMainError"
        :label="$t('label.textile')"
        :placeholder="$t('placeholder.textileName')"
        :options="textilesForSelect(orderProduct.productId)"
        group-label="category"
        group-values="textiles"
        value-key="label"
        @input="onChangeTextiles('textileMain')"
        @removeValue="onChangeTextiles('textileMain')"
      />

      <OurSelect
        v-model="orderProduct.textileMainCategory"
        :options="categoriesOptions"
        :label="$t('label.category')"
        :placeholder="$t('placeholder.category')"
        :error="textileMainCategoryError"
        value-key="label"
        disabled
      />
    </OurCard>

    <OurCard>
      <OurSelect
        v-model="orderProduct.textileA"
        :error="textileAError"
        :label="$t('label.textile')"
        :placeholder="$t('placeholder.textileName')"
        :options="textilesForSelect(orderProduct.productId)"
        group-label="category"
        group-values="textiles"
        value-key="label"
        @removeValue="onChangeTextiles('textileA')"
        @input="onChangeTextiles('textileA')"
      />

      <OurSelect
        v-model="orderProduct.textileACategory"
        disabled
        :options="categoriesOptions"
        :label="$t('label.category')"
        :placeholder="$t('placeholder.category')"
        :error="textileACategoryError"
        value-key="label"
      />
    </OurCard>

    <OurCard v-if="orderProduct.textileA || orderProduct.textileACategory">
      <OurSelect
        v-model="orderProduct.textileB"
        :error="textileBError"
        :label="$t('label.textile')"
        :placeholder="$t('placeholder.textileName')"
        :options="textilesForSelect(orderProduct.productId)"
        group-label="category"
        group-values="textiles"
        value-key="label"
        @input="onChangeTextiles('textileB')"
        @removeValue="onChangeTextiles('textileB')"
      />

      <OurSelect
        v-model="orderProduct.textileBCategory"
        disabled
        :options="categoriesOptions"
        :label="$t('label.category')"
        :placeholder="$t('placeholder.category')"
        :error="textileBCategoryError"
        value-key="label"
      />
    </OurCard>

    <OurCard v-if="orderProduct.textileB || orderProduct.textileBCategory">
      <OurSelect
        v-model="orderProduct.textileC"
        :error="textileCError"
        :label="$t('label.textile')"
        :placeholder="$t('placeholder.textileName')"
        :options="textilesForSelect(orderProduct.productId)"
        group-label="category"
        group-values="textiles"
        value-key="label"
        @removeValue="onChangeTextiles('textileC')"
        @input="onChangeTextiles('textileC')"
      />

      <OurSelect
        v-model="orderProduct.textileCCategory"
        disabled
        :options="categoriesOptions"
        :label="$t('label.category')"
        :placeholder="$t('placeholder.category')"
        :error="textileCCategoryError"
        value-key="label"
      />
    </OurCard>

    <OurCard>
      <OurInput
        v-model="orderProduct.amount"
        disabled
        :error="amountError"
        validation-rule="number"
        :label="$t('label.amountWithCurrency', { currencySymbol: orderProduct.currencySymbol })"
      />
    </OurCard>
  </div>
</template>

<script>
import OurCard from "@/components/OurCard";
import OurSelect from "@/components/OurSelect";
import OurInput from "@/components/form/OurInput";
import OurTextarea from "@/components/OurTextarea";
import { mapActions, mapGetters, mapState } from "vuex";
import { required, requiredIf, minValue } from "vuelidate/lib/validators";

export default {
  components: {
    OurTextarea,
    OurInput,
    OurSelect,
    OurCard,
  },

  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      isPrefilledForm: false,
      orderProduct: {
        productId: "",
        number: "",
        note: "",
        textileMainCategory: "",
        textileMain: "",
        textileACategory: "",
        textileA: "",
        textileBCategory: "",
        textileB: "",
        textileCCategory: "",
        textileC: "",
        amount: "",
        currencySymbol: "",
      },
    };
  },

  validations: {
    orderProduct: {
      productId: { required },
      number: { required, minValue: minValue(1) },
      textileMainCategory: { required },
      textileMain: { required },
      amount: { required, minValue: minValue(0) },
      textileACategory: {
        required: requiredIf(function () {
          return this.orderProduct.textileA;
        }),
      },
      textileA: {
        required: requiredIf(function () {
          return this.orderProduct.textileACategory;
        }),
      },
      textileBCategory: {
        required: requiredIf(function () {
          return this.orderProduct.textileB;
        }),
      },
      textileB: {
        required: requiredIf(function () {
          return this.orderProduct.textileBCategory;
        }),
      },
      textileCCategory: {
        required: requiredIf(function () {
          return this.orderProduct.textileC;
        }),
      },
      textileC: {
        required: requiredIf(function () {
          return this.orderProduct.textileCCategory;
        }),
      },
    },
  },

  computed: {
    ...mapState("product", ["products"]),
    ...mapState("textile", ["textiles"]),
    ...mapGetters("textile", ["textilesForSelect"]),

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

    productIdError() {
      const isDirty = this.$v.orderProduct.productId.$dirty;
      const isFilled = this.$v.orderProduct.productId.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    numberError() {
      const isDirty = this.$v.orderProduct.number.$dirty;
      const isFilled = this.$v.orderProduct.number.required;
      const isMinValue = this.$v.orderProduct.number.minValue;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      } else if (isDirty && !isMinValue) {
        error = this.$t("validation.minValue", { number: 1 });
      }

      return error;
    },

    textileMainCategoryError() {
      const isDirty = this.$v.orderProduct.textileMainCategory.$dirty;
      const isFilled = this.$v.orderProduct.textileMainCategory.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    textileMainError() {
      const isDirty = this.$v.orderProduct.textileMain.$dirty;
      const isFilled = this.$v.orderProduct.textileMain.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    amountError() {
      const isDirty = this.$v.orderProduct.amount.$dirty;
      const isFilled = this.$v.orderProduct.amount.required;
      const isMinValue = this.$v.orderProduct.amount.minValue;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      } else if (isDirty && !isMinValue) {
        error = this.$t("validation.minValue", { number: 0 });
      }

      return error;
    },

    textileACategoryError() {
      const isDirty = this.$v.orderProduct.textileACategory.$dirty;
      const isFilled = this.$v.orderProduct.textileACategory.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    textileAError() {
      const isDirty = this.$v.orderProduct.textileA.$dirty;
      const isFilled = this.$v.orderProduct.textileA.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    textileBCategoryError() {
      const isDirty = this.$v.orderProduct.textileBCategory.$dirty;
      const isFilled = this.$v.orderProduct.textileBCategory.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    textileBError() {
      const isDirty = this.$v.orderProduct.textileB.$dirty;
      const isFilled = this.$v.orderProduct.textileB.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    textileCCategoryError() {
      const isDirty = this.$v.orderProduct.textileCCategory.$dirty;
      const isFilled = this.$v.orderProduct.textileCCategory.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    textileCError() {
      const isDirty = this.$v.orderProduct.textileC.$dirty;
      const isFilled = this.$v.orderProduct.textileC.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
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
  },

  watch: {
    orderProduct: {
      handler: "onChangeOrderProduct",
      deep: true,
    },
    value: {
      handler: "onChangeValue",
      deep: true,
    },
  },

  async created() {
    await Promise.all([this.getTextiles(), this.getProducts(this.value.client_id)]);
  },

  methods: {
    ...mapActions("textile", ["getTextiles"]),
    ...mapActions("product", ["getProducts"]),

    onRemoveProduct() {
      this.orderProduct = {
        ...this.orderProduct,
        textileMain: "",
        productId: "",
        textileA: "",
        textileB: "",
        textileC: "",
        textileMainCategory: "",
        textileACategory: "",
        textileBCategory: "",
        textileCCategory: "",
        amount: 0,
      };
    },

    onChangeProduct() {
      this.orderProduct = {
        ...this.orderProduct,
        textileMain: "",
        textileA: "",
        textileB: "",
        textileC: "",
        textileMainCategory: "",
        textileACategory: "",
        textileBCategory: "",
        textileCCategory: "",
        amount: 0,
      };
    },

    onChangeTextiles(textile) {
      const textileMain = this.textiles.find(
        (textile) => textile.name === this.orderProduct.textileMain
      );
      const textileA = this.textiles.find((textile) => textile.name === this.orderProduct.textileA);
      const textileB = this.textiles.find((textile) => textile.name === this.orderProduct.textileB);
      const textileC = this.textiles.find((textile) => textile.name === this.orderProduct.textileC);

      let mostExpenseCategory = -1;

      if (textile === "textileMain") {
        this.orderProduct.textileMainCategory =
          textileMain?.category >= 0
            ? textileMain?.category
            : this.orderProduct.textileMainCategory;
      } else if (textile === "textileA") {
        this.orderProduct.textileACategory =
          textileA?.category >= 0 ? textileA?.category : this.orderProduct.textileACategory;
      } else if (textile === "textileB") {
        this.orderProduct.textileBCategory =
          textileB?.category >= 0 ? textileB?.category : this.orderProduct.textileBCategory;
      } else if (textile === "textileC") {
        this.orderProduct.textileCCategory =
          textileC?.category >= 0 ? textileC?.category : this.orderProduct.textileCCategory;
      }

      const textileCategories = [
        this.orderProduct.textileMainCategory !== "" && this.orderProduct.textileMainCategory >= 0
          ? this.orderProduct.textileMainCategory
          : textileMain?.category,
        this.orderProduct.textileACategory !== "" && this.orderProduct.textileACategory >= 0
          ? this.orderProduct.textileACategory
          : textileA?.category,
        this.orderProduct.textileBCategory !== "" && this.orderProduct.textileBCategory >= 0
          ? this.orderProduct.textileBCategory
          : textileB?.category,
        this.orderProduct.textileCCategory !== "" && this.orderProduct.textileCCategory >= 0
          ? this.orderProduct.textileCCategory
          : textileC?.category,
      ];

      if (!this.orderProduct[textile]) {
        this.orderProduct[`${textile}Category`] = "";
      }

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

      const selectedProduct = this.products.find(
        (product) => product.id === this.orderProduct.productId
      );
      const sum = selectedProduct?.[categoryCode[mostExpenseCategory]] * this.orderProduct?.number;

      this.orderProduct.amount = sum ? sum : 0;
    },

    async onChangeValue() {
      if (!this.isPrefilledForm && this.value.textile_categories) {
        await Promise.all([this.getTextiles(), this.getProducts(this.value.client_id)]);

        this.orderProduct = {
          productId: this.value.product_id,
          number: this.value.number,
          note: this.value.note,
          amount: this.value.amount,
          currencySymbol: this.value.currencySymbol,
        };

        const [categoryMain, categoryA, categoryB, categoryC] =
          this.value.textile_categories.split(", ");
        const [textileMain, textileA, textileB, textileC] = this.value.textile.split(",");

        this.orderProduct = {
          ...this.orderProduct,
          textileMain,
          textileMainCategory: categoryMain,
        };

        if (categoryA) {
          this.orderProduct = {
            ...this.orderProduct,
            textileACategory: categoryA,
            textileA,
          };
        }

        if (categoryB) {
          this.orderProduct = {
            ...this.orderProduct,
            textileBCategory: categoryB,
            textileB,
          };
        }

        if (categoryC) {
          this.orderProduct = {
            ...this.orderProduct,
            textileCCategory: categoryC,
            textileC,
          };
        }

        this.isPrefilledForm = true;
      }
    },

    validate() {
      this.$v.$touch();
    },

    onChangeOrderProduct(orderProduct) {
      orderProduct.isValid = !this.$v.$invalid;

      this.$emit("input", orderProduct);
    },
  },
};
</script>
