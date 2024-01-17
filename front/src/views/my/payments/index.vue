<template>
  <OurPage :title="$t('title.myPayments')" width="3xl">
    <OurTable :headers="tableHeaders" :items.sync="tableItems">
      <template #cell-amount="{ value }">
        <OurMoney :item="value" class="payment-table-money" />
      </template>
    </OurTable>
  </OurPage>
</template>

<script>
import OurPage from "@/components/OurPage";
import OurTable from "@/components/OurTable";
import { mapActions, mapState } from "vuex";
import OurMoney from "@/components/OurMoney";

export default {
  components: {
    OurMoney,
    OurTable,
    OurPage,
  },

  data() {
    return {
      tableHeaders: [
        {
          value: "number",
          text: this.$t("label.orderNumber"),
          tdClass: "",
          thClass: "",
        },
        {
          value: "date",
          text: this.$t("label.date"),
          tdClass: "",
          thClass: "",
        },
        {
          value: "amount",
          text: this.$t("label.amount"),
          tdClass: "",
          thClass: "",
        },
        {
          value: "note",
          text: this.$t("label.note"),
          tdClass: "",
          thClass: "",
        },
      ],
      tableItems: [],
    };
  },

  computed: {
    ...mapState("payments", ["payments"]),
  },

  watch: {
    payments: {
      handler: "onChangePayments",
      deep: true,
      immediate: true,
    },
  },

  async created() {
    await this.getPayments();
  },

  methods: {
    ...mapActions("payments", ["getPayments"]),

    onChangePayments() {
      this.tableItems = this.payments.map((item) => {
        return {
          number: item.id,
          date: item.data_create,
          amount: {
            sum: item.amount,
            currencySymbol: item.currency,
          },
          note: item.note,
        };
      });
    },
  },
};
</script>

<style lang="postcss" scoped>
.payment-table-money {
  &::v-deep {
    .money-block {
      @apply justify-start;
    }
  }
}
</style>
