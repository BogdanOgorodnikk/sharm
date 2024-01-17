<template>
  <OurPage :title="$t('title.payments')" width="3xl">
    <template #header-right>
      <OurButton :text="$t('button.filter')" size="sm" @click="onClickOpenFilterModal">
        <template #icon-left>
          <OurSvgIcon name="Filter" size="sm" />
        </template>
      </OurButton>
    </template>

    <OurButton
      size="sm"
      class="mb-3"
      :text="$t('button.createPayment')"
      @click="onClickOpenAddPaymentPage"
    >
      <template #icon-left>
        <OurSvgIcon name="Money" />
      </template>
    </OurButton>

    <OurTable :headers="tableHeaders" :items="tableItems" class="payment-table">
      <template #cell-amount="{ value }">
        <OurMoney :item="value" class="payment-table-money" />
      </template>

      <template #cell-actions="{ value }">
        <div class="payment-table-actions">
          <OurSvgIcon
            interactive
            size="sm"
            color="gray"
            name="Edit"
            class="payment-table-icon"
            @click="onClickOpenEditPaymentPage(value)"
          />

          <OurSvgIcon
            interactive
            size="sm"
            color="red"
            name="Trash"
            class="payment-table-icon"
            @click="onClickDeletePayment(value)"
          />
        </div>
      </template>
    </OurTable>

    <DeleteModal v-model="isShownDeleteModal" :item-id="selectedPayment" />

    <FilterModal v-model="isShownFilterModal" :active-filter.sync="filter" />
  </OurPage>
</template>

<script>
import OurPage from "@/components/OurPage";
import OurTable from "@/components/OurTable";
import OurButton from "@/components/OurButton";
import OurSvgIcon from "@/components/OurSvgIcon";
import { mapActions, mapMutations, mapState } from "vuex";
import OurMoney from "@/components/OurMoney";
import DeleteModal from "../delete/Modal";
import FilterModal from "./components/FilterModal";
import { parsedDate } from "@/services/date.service";

export default {
  components: {
    FilterModal,
    OurMoney,
    OurSvgIcon,
    OurButton,
    OurTable,
    OurPage,
    DeleteModal,
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
          value: "client",
          text: this.$t("label.client"),
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
        {
          value: "actions",
          text: "",
          tdClass: "",
          thClass: "",
        },
      ],
      selectedPayment: "",
      isShownDeleteModal: false,
      hasQueryInRoute: false,
      isShownFilterModal: false,
      filter: {
        dateFrom: "",
        dateTo: "",
        clientIds: [],
      },
    };
  },

  computed: {
    ...mapState("payments", ["payments"]),

    isActiveFilter() {
      return this.filter.dateFrom || this.filter.dateTo || this.filter.clientIds.length;
    },

    tableItems() {
      let payments = [...this.payments];

      if (this.isActiveFilter) {
        payments = payments.filter((item) => {
          let isFiltered = true;

          if (this.filter.dateFrom && isFiltered) {
            isFiltered = parsedDate(this.filter.dateFrom) <= parsedDate(item.data_create);
          }

          if (this.filter.dateTo && isFiltered) {
            isFiltered = parsedDate(this.filter.dateTo) >= parsedDate(item.data_create);
          }

          if (this.filter.clientIds.length && isFiltered) {
            isFiltered = !!this.filter.clientIds.find((client) => client === item.clientId);
          }

          if (isFiltered) {
            return item;
          }
        });
      }

      return payments.map((item) => {
        return {
          number: item.id,
          date: item.data_create,
          client: item.userName,
          amount: {
            sum: item.amount,
            currencySymbol: item.currency,
          },
          note: item.note,
          actions: item.id,
        };
      });
    },
  },

  async created() {
    let query = "";

    if (this.$route.query.clientId) {
      query = this.$route.query.clientId;

      this.hasQueryInRoute = true;
    }

    await this.getPayments(query);
  },

  beforeDestroy() {
    if (this.hasQueryInRoute) {
      this.SET_PAYMENTS(null);
    }
  },

  methods: {
    ...mapActions("payments", ["getPayments"]),

    ...mapMutations("payments", ["SET_PAYMENTS"]),

    onClickOpenAddPaymentPage() {
      this.$router.push({ name: "PaymentsAdd" });
    },

    onClickOpenEditPaymentPage(id) {
      this.$router.push({ name: "PaymentsEdit", params: { id } });
    },

    onClickDeletePayment(id) {
      this.selectedPayment = id;
      this.isShownDeleteModal = true;
    },

    onClickOpenFilterModal() {
      this.isShownFilterModal = true;
    },
  },
};
</script>

<style lang="postcss" scoped>
.payment-table {
  &-actions {
    @apply flex items-end;
    @apply space-x-3;
  }

  &-icon {
    @apply opacity-0;
  }

  &-money {
    &::v-deep {
      .money-block {
        @apply justify-start;
      }
    }
  }

  &::v-deep {
    .table-row {
      &:hover {
        .payment-table-icon {
          @apply opacity-100;
        }
      }
    }
  }
}
</style>
