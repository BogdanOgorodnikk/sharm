<template>
  <OurPage wide-page width="wide" :title="$t('title.myOrders')">
    <template #header-right>
      <OurButton :text="$t('button.filter')" size="sm" @click="onClickOpenFilterModal">
        <template #icon-left>
          <OurSvgIcon name="Filter" size="sm" />
        </template>
      </OurButton>
    </template>

    <OurTable
      :headers="tableHeaders"
      :items="tableItems"
      class="order-table"
      @clickRow="onClickTableRow"
    >
      <template #cell-amount="{ value }">
        <OurMoney :item="value" class="order-table-money" />
      </template>

      <template #cell-status="{ value }">
        <div :class="value.color">
          {{ value.label }}
        </div>
      </template>

      <template #cell-actions="{ value }">
        <OurSvgIcon
          v-if="value.canDeleted"
          interactive
          size="sm"
          color="red"
          name="Trash"
          class="delete-icon"
          @click.stop.native="onClickDeleteOrder(value.id)"
        />
      </template>
    </OurTable>

    <DeleteOrderModal
      v-model="isShownDeleteModal"
      :order-id="selectedRowId"
      @orderDeleted="onOrderDeleted"
    />

    <FilterModal v-model="isShownFilterModal" :active-filter.sync="filter" />
  </OurPage>
</template>

<script>
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";
import OurMoney from "@/components/OurMoney";
import OurSvgIcon from "@/components/OurSvgIcon";
import OurTable from "@/components/OurTable";
import { mapActions, mapState } from "vuex";
import { ORDER_CODES } from "@/api/orders";
import DeleteOrderModal from "../delete/DeleteOrderModal";
import FilterModal from "./components/FilterModal";
import { parsedDate } from "@/services/date.service";

export default {
  components: {
    FilterModal,
    OurTable,
    OurSvgIcon,
    OurMoney,
    OurButton,
    OurPage,
    DeleteOrderModal,
  },

  data() {
    return {
      isShownDeleteModal: false,
      selectedRowId: "",
      tableHeaders: [
        {
          value: "orderNumber",
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
          tdClass: "text-left",
          thClass: "",
        },
        {
          value: "status",
          text: this.$t("label.status"),
          tdClass: "text-left",
          thClass: "w-40 text-left",
        },
        {
          value: "deliveryDate",
          text: this.$t("label.deliveryDate"),
          tdClass: "text-left",
          thClass: "text-left whitespace-nowrap w-20",
        },
        {
          value: "actions",
          text: "",
          tdClass: "",
          thClass: "w-4",
        },
      ],
      orderCodes: ORDER_CODES,
      isShownFilterModal: false,
      userOrders: [],
      filter: {
        dateFrom: "",
        dateTo: "",
        statuses: [],
      },
    };
  },

  computed: {
    ...mapState("orders", ["orders"]),

    isActiveFilter() {
      return this.filter.dateFrom || this.filter.dateTo || this.filter.statuses.length;
    },

    tableItems() {
      const statusLocale = {
        [ORDER_CODES.cancel]: this.$t("label.orderCodes.cancel"),
        [ORDER_CODES.expected]: this.$t("label.orderCodes.expected"),
        [ORDER_CODES.inProgress]: this.$t("label.orderCodes.inProgress"),
        [ORDER_CODES.finished]: this.$t("label.orderCodes.finished"),
      };

      const statusColors = {
        [ORDER_CODES.cancel]: "order-table-status-cancel",
        [ORDER_CODES.expected]: "order-table-status-expected",
        [ORDER_CODES.inProgress]: "order-table-status-inProgress",
        [ORDER_CODES.finished]: "order-table-status-finished",
      };

      let orders = [...this.userOrders];

      if (this.isActiveFilter) {
        orders = orders.filter((item) => {
          let isFiltered = true;

          if (this.filter.dateFrom && isFiltered) {
            isFiltered = parsedDate(this.filter.dateFrom) <= parsedDate(item.data_create);
          }

          if (this.filter.dateTo && isFiltered) {
            isFiltered = parsedDate(this.filter.dateTo) >= parsedDate(item.data_create);
          }

          if (this.filter.statuses.length && isFiltered) {
            isFiltered = !!this.filter.statuses.find((status) => status === item.status);
          }

          if (isFiltered) {
            return item;
          }
        });
      }

      return orders.map((item) => {
        return {
          id: item.id,
          orderNumber: item.id,
          date: item.data_create,
          amount: {
            sum: item.amount,
            currencySymbol: item.currencySymbol,
          },
          status: {
            label: statusLocale[item.status],
            color: statusColors[item.status],
          },
          deliveryDate: item.delivery_date,
          actions: {
            id: item.id,
            canDeleted: item.status === ORDER_CODES.expected,
          },
        };
      });
    },
  },

  async created() {
    await this.getOrders();

    this.userOrders = [...this.orders];
  },

  methods: {
    ...mapActions("orders", ["getOrders"]),

    onClickOpenFilterModal() {
      this.isShownFilterModal = true;
    },

    onClickDeleteOrder(id) {
      this.selectedRowId = id;
      this.isShownDeleteModal = true;
    },

    onOrderDeleted() {
      this.userOrders = this.userOrders.filter((item) => item.id !== this.selectedRowId);
    },

    onClickTableRow(row) {
      this.$router.push({ name: "MyOrdersInfo", params: { id: row.id } });
    },
  },
};
</script>

<style lang="postcss" scoped>
.order-table {
  .delete-icon {
    @apply opacity-0;
  }

  &::v-deep {
    .table-row {
      &:hover {
        .delete-icon {
          @apply opacity-100;
        }
      }
    }
  }

  &-money {
    &::v-deep {
      .money-block {
        @apply justify-start;
      }
    }
  }

  &-status {
    &-cancel {
      @apply text-red-600;
    }

    &-expected {
      @apply text-orange-400;
    }

    &-inProgress {
      @apply text-blue-500;
    }

    &-finished {
      @apply text-green-600;
    }
  }
}
</style>
