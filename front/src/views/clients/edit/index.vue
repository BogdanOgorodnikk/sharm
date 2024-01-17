<template>
  <OurPage :title="$t('title.ordersEdit')" :back-route="backRouteParams" width="md">
    <OrderForm ref="orderForm" v-model="form" />

    <OurDeleteModal
      v-model="isShownDeleteModal"
      :item="item"
      delay-success-notify
      :order-info-id="orderInfoId"
    />

    <template #footer-left>
      <OurButton :text="$t('button.save')" @click="onSubmitForm" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToOrder" />
    </template>

    <template #footer-right>
      <OurButton
        variant="thirdaty"
        :text="$t('button.delete')"
        @click="onClickDeleteOrderProduct"
      />
    </template>
  </OurPage>
</template>

<script>
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";
import OurDeleteModal from "../delete/Modal";
import { getOrderProduct, updateOrderProduct } from "@/api/orders";
import { mapState } from "vuex";
import OrderForm from "@/views/clients/_components/OrderForm";

export default {
  components: {
    OrderForm,
    OurButton,
    OurPage,
    OurDeleteModal,
  },

  data: () => ({
    isShownDeleteModal: false,
    item: {},
    form: {
      productId: "",
      number: "",
      made: "",
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
    orderInfoId: "",
  }),

  computed: {
    ...mapState("product", ["products"]),
    ...mapState("textile", ["textiles"]),

    backRouteParams() {
      return {
        title: this.$t("title.ordersInfo"),
        name: "ClientOrderInfo",
        params: { id: this.orderInfoId },
      };
    },
  },

  async created() {
    await this.prefillForm();
  },

  methods: {
    async prefillForm() {
      const orderProductId = this.$route.params.id;

      this.form = await getOrderProduct(orderProductId);

      this.orderInfoId = this.form.order_id;
    },

    async onSubmitForm() {
      this.$refs.orderForm.validate();

      if (this.form.isValid) {
        const orderProductId = this.$route.params.id;

        let textile = `${this.form.textileMain}`;
        let textileCategories = `${this.form.textileMainCategory}`;

        if (this.form.textileA) {
          textile = `${textile}, ${this.form.textileA}`;
          textileCategories = `${textileCategories}, ${this.form.textileACategory}`;
        }

        if (this.form.textileB) {
          textile = `${textile}, ${this.form.textileB}`;
          textileCategories = `${textileCategories}, ${this.form.textileBCategory}`;
        }

        if (this.form.textileC) {
          textile = `${textile}, ${this.form.textileC}`;
          textileCategories = `${textileCategories}, ${this.form.textileCCategory}`;
        }

        const data = {
          product_id: this.form.productId,
          number: this.form.number,
          made: this.form.made,
          note: this.form.note,
          amount: this.form.amount,
          textile,
          textile_categories: textileCategories,
        };

        await updateOrderProduct(orderProductId, data);

        await this.$router.push({ name: "ClientOrderInfo", params: { id: this.orderInfoId } });
      }
    },

    onClickBackToOrder() {
      this.$router.push({ name: "ClientOrderInfo", params: { id: this.orderInfoId } });
    },

    onClickDeleteOrderProduct() {
      const selectedProduct = this.products.find((item) => item.id === this.form.productId);

      this.item = {
        id: this.$route.params.id,
        name: selectedProduct ? selectedProduct.name : this.$t("label.current"),
      };

      this.isShownDeleteModal = true;
    },
  },
};
</script>
