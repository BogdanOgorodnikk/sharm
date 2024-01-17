<template>
  <OurPage :title="$t('title.ordersAdd')" width="wide" :back-route="backRouteParams">
    <OrdersForm ref="ordersForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.issue')" @click="onSubmitForm" />

      <OurButton variant="secondary" :text="$t('button.back')" @click="onClickBackToProducts" />
    </template>
  </OurPage>
</template>

<script>
import OurPage from "@/components/OurPage";
import OrdersForm from "@/components/OrdersForm";
import OurButton from "@/components/OurButton";
import notify from "@/services/notify.service";
import { mapActions } from "vuex";

export default {
  components: {
    OurButton,
    OrdersForm,
    OurPage,
  },

  data: () => ({
    form: {},
  }),

  computed: {
    backRouteParams() {
      return {
        title: this.$t("title.products"),
        name: "Products",
      };
    },
  },

  methods: {
    ...mapActions("orders", ["addOrders"]),

    async onSubmitForm() {
      this.$refs.ordersForm.validate();

      if (this.form.isValid) {
        let isEmptyProducts = false;

        const filledProducts = this.form.products.filter((item) => item.productId);

        const products = filledProducts.map((item) => {
          let textile = `${item.textileMain}`;
          let textileCategories = `${item.textileMainCategory}`;

          if (item.textileA) {
            textile = `${textile}, ${item.textileA}`;
            textileCategories = `${textileCategories}, ${item.textileACategory}`;
          }

          if (item.textileB) {
            textile = `${textile}, ${item.textileB}`;
            textileCategories = `${textileCategories}, ${item.textileBCategory}`;
          }

          if (item.textileC) {
            textile = `${textile}, ${item.textileC}`;
            textileCategories = `${textileCategories}, ${item.textileCCategory}`;
          }

          isEmptyProducts = isEmptyProducts ? isEmptyProducts : !item.productId;

          return {
            productId: item.productId,
            number: item.number,
            note: item.note,
            amount: item.amount.sum,
            textile,
            textileCategories,
          };
        });

        if (isEmptyProducts) {
          return notify.error("ordersCantBeEmpty");
        }

        const data = {
          clientId: this.form.clientId,
          amount: this.form.amount.sum,
          products,
        };

        await this.addOrders(data);

        await this.$router.push({ name: "Products" });
      }
    },

    onClickBackToProducts() {
      this.$router.push({ name: "Products" });
    },
  },
};
</script>
