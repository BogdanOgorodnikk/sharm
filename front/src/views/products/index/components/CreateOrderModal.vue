<template>
  <OurModal v-model="isShownModal" width="xl" :title="$t('title.createOrder')">
    <OurCard>
      <OurInput :label="$t('label.productName')" disabled :value="item.name" />

      <OurInput
        v-model="form.number"
        validation-rule="number"
        :label="$t('label.number')"
        placeholder="1"
      />

      <OurSelect
        v-model="form.textileId"
        :options="textilesForSelect(allowedCategories)"
        :label="$t('label.textile')"
        :placeholder="$t('placeholder.textileName')"
        group-label="category"
        group-values="textiles"
      />

      <OurTextarea
        v-model="form.note"
        :label="$t('label.note')"
        :placeholder="$t('placeholder.note')"
      />

      <div class="create-order-amount">
        <div class="create-order-amount-title">{{ $t("label.amount") }}:</div>

        <OurMoney :item="productAmount" />
      </div>
    </OurCard>

    <template #footer-left>
      <OurButton :text="$t('button.createOrder')" />
    </template>

    <template #footer-right>
      <OurButton variant="secondary" :text="$t('button.close')" @click="onClickCloseModal" />
    </template>
  </OurModal>
</template>

<script>
import OurModal from "@/components/OurModal";
import OurButton from "@/components/OurButton";
import OurCard from "@/components/OurCard";
import OurInput from "@/components/form/OurInput";
import OurSelect from "@/components/OurSelect";
import OurTextarea from "@/components/OurTextarea";
import OurMoney from "@/components/OurMoney";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  components: {
    OurMoney,
    OurTextarea,
    OurSelect,
    OurInput,
    OurCard,
    OurButton,
    OurModal,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    item: {
      type: Object,
      default: () => {},
    },
  },

  data: () => ({
    form: {
      number: "",
      textileId: "",
      note: "",
    },
  }),

  computed: {
    ...mapState("textile", ["textiles"]),
    ...mapGetters("textile", ["textilesForSelect"]),

    isShownModal: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },

    productAmount() {
      const selectedTextile = this.textiles.find((item) => item.id === this.form.textileId);
      const textileCategory = selectedTextile?.category;
      const categoryPrice = {
        0: this.item.specialPrice.sum,
        1: this.item.firstCategory.sum,
        2: this.item.secondCategory.sum,
        3: this.item.thirdaryCategory.sum,
        4: this.item.fourthCategory.sum,
        5: this.item.fivesCategory.sum,
      };

      const productPrice = categoryPrice[textileCategory];

      return {
        sum: productPrice * this.form.number,
        currencySymbol: this.item.currencySymbol,
      };
    },

    allowedCategories() {
      let categories = [];

      if (this.item.specialPrice.sum) categories.push(0);
      if (this.item.firstCategory.sum) categories.push(1);
      if (this.item.secondCategory.sum) categories.push(2);
      if (this.item.thirdaryCategory.sum) categories.push(3);
      if (this.item.fourthCategory.sum) categories.push(4);
      if (this.item.fivesCategory.sum) categories.push(5);

      return categories;
    },
  },

  async created() {
    await this.getTextiles();
  },

  methods: {
    ...mapActions("textile", ["getTextiles"]),

    onClickCloseModal() {
      this.isShownModal = false;
    },
  },
};
</script>

<style lang="postcss" scoped>
.create-order-amount {
  @apply flex items-center;

  &-title {
    @apply text-xl font-medium text-base-dark;
    @apply pr-1;
  }
}
</style>
