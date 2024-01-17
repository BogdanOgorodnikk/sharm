<template>
  <OurPage wide-page width="wide" :title="$t('title.allOrders')">
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
        <OurMoney :item="value" class="table-money" />
      </template>

      <template #cell-status="{ value }">
        <OurDropdown
          :class="value.color"
          class="table-status-dropdown"
          :text="value.label"
          list-x-position="left"
          @click.native.stop="onClickCodeDropdown"
          @blur="onClickCodeDropdown"
        >
          <div
            v-if="value.code !== orderCodes.cancel"
            @click="onClickUpdateOrderStatus(value.id, orderCodes.cancel)"
          >
            {{ $t("label.orderCodes.cancel") }}
          </div>

          <div
            v-if="value.code !== orderCodes.expected"
            @click="onClickUpdateOrderStatus(value.id, orderCodes.expected)"
          >
            {{ $t("label.orderCodes.expected") }}
          </div>

          <div
            v-if="value.code !== orderCodes.inProgress"
            @click="onClickUpdateOrderStatus(value.id, orderCodes.inProgress)"
          >
            {{ $t("label.orderCodes.inProgress") }}
          </div>

          <div
            v-if="value.code !== orderCodes.finished"
            @click="onClickUpdateOrderStatus(value.id, orderCodes.finished)"
          >
            {{ $t("label.orderCodes.finished") }}
          </div>
        </OurDropdown>
      </template>

      <template #cell-deliveryDate="{ value }">
        <div class="table-delivery-date" @click.stop="onClickOpenDeliveryModal(value)">
          {{ value.label }}
        </div>
      </template>

      <template #cell-actions="{ value }">
        <OurSvgIcon
          interactive
          size="sm"
          color="red"
          name="Trash"
          class="delete-icon"
          @click.stop.native="onClickDeleteOrder(value)"
        />
      </template>
    </OurTable>

    <DeleteOrderModal
      v-model="isShownDeleteModal"
      :order-id="selectedRowId"
      @orderDeleted="onOrderDeleted"
    />

    <FilterModal v-model="isShownFilterModal" :active-filter.sync="filter" />

    <DeliveryDateModal v-model="isShownDeliveryModal" :delivery="delivery" />
  </OurPage>
</template>

<script>
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";
import OurMoney from "@/components/OurMoney";
import OurSvgIcon from "@/components/OurSvgIcon";
import OurTable from "@/components/OurTable";
import { mapActions, mapState } from "vuex";
import OurSelect from "@/components/OurSelect";
import { ORDER_CODES } from "@/api/orders";
import OurDropdown from "@/components/OurDropdown";
import OurDatePicker from "@/components/OurDatepicker";
import TDatepicker from "vue-tailwind/dist/t-datepicker";
import DeleteOrderModal from "../delete/DeleteOrderModal";
import FilterModal from "./components/FilterModal";
import { parsedDate } from "@/services/date.service";
import DeliveryDateModal from "./components/DeliveryDateModal";

export default {
  components: {
    DeliveryDateModal,
    FilterModal,
    OurDatePicker,
    OurDropdown,
    OurSelect,
    OurTable,
    OurSvgIcon,
    OurMoney,
    OurButton,
    OurPage,
    TDatepicker,
    DeleteOrderModal,
  },

  data() {
    return {
      isShownDeleteModal: false,
      selectedRowId: "",
      delivery: {},
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
          value: "client",
          text: this.$t("label.client"),
          tdClass: "",
          thClass: "",
        },
        {
          value: "region",
          text: this.$t("label.region"),
          tdClass: "",
          thClass: "",
        },
        {
          value: "town",
          text: this.$t("label.town"),
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
          thClass: "text-left whitespace-nowrap",
        },
        {
          value: "actions",
          text: "",
          tdClass: "",
          thClass: "",
        },
      ],
      orderCodes: ORDER_CODES,
      isShownCurrentItem: false,
      isShownFilterModal: false,
      isShownDeliveryModal: false,
      filter: {
        dateFrom: "",
        dateTo: "",
        region: "",
        towns: [],
        clientIds: [],
        statuses: [],
      },
    };
  },

  computed: {
    ...mapState("orders", ["orders"]),

    isActiveFilter() {
      return (
        this.filter.dateFrom ||
        this.filter.dateTo ||
        this.filter.region ||
        this.filter.towns.length ||
        this.filter.clientIds.length ||
        this.filter.statuses.length
      );
    },

    tableItems() {
      const statusLocale = {
        [ORDER_CODES.cancel]: this.$t("label.orderCodes.cancel"),
        [ORDER_CODES.expected]: this.$t("label.orderCodes.expected"),
        [ORDER_CODES.inProgress]: this.$t("label.orderCodes.inProgress"),
        [ORDER_CODES.finished]: this.$t("label.orderCodes.finished"),
      };

      const statusColors = {
        [ORDER_CODES.cancel]: "table-status-dropdown-cancel",
        [ORDER_CODES.expected]: "table-status-dropdown-expected",
        [ORDER_CODES.inProgress]: "table-status-dropdown-inProgress",
        [ORDER_CODES.finished]: "table-status-dropdown-finished",
      };

      let orders = [...this.orders];

      if (this.isActiveFilter) {
        orders = orders.filter((item) => {
          let isFiltered = true;

          if (this.filter.dateFrom && isFiltered) {
            isFiltered = parsedDate(this.filter.dateFrom) <= parsedDate(item.data_create);
          }

          if (this.filter.dateTo && isFiltered) {
            isFiltered = parsedDate(this.filter.dateTo) >= parsedDate(item.data_create);
          }

          if (this.filter.region && isFiltered) {
            isFiltered = this.filter.region === item.clientRegion;
          }

          if (this.filter.towns.length && isFiltered) {
            isFiltered = !!this.filter.towns.find((town) => town === item.clientTown);
          }

          if (this.filter.clientIds.length && isFiltered) {
            isFiltered = !!this.filter.clientIds.find((client) => client === item.clientId);
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
          client: item.clientName,
          region: item.clientRegion,
          town: item.clientTown,
          amount: {
            sum: item.amount,
            currencySymbol: item.currencySymbol,
          },
          status: {
            label: statusLocale[item.status],
            color: statusColors[item.status],
            code: item.status,
            isEdited: false,
            id: item.id,
          },
          deliveryDate: {
            label: item.delivery_date ? item.delivery_date : this.$t("label.setDeliveryDate"),
            date: item.delivery_date,
            id: item.id,
          },
          actions: item.id,
        };
      });
    },
  },

  async created() {
    document.addEventListener("click", this.onClickItem);

    await this.getOrders();
  },

  beforeDestroy() {
    document.removeEventListener("click", this.onClickItem);
  },

  methods: {
    ...mapActions("orders", ["getOrders", "updateOrder"]),

    onClickOpenFilterModal() {
      this.isShownFilterModal = true;
    },

    onClickOpenDeliveryModal(value) {
      this.delivery = value;
      this.isShownDeliveryModal = true;
    },

    async onClickUpdateOrderStatus(orderId, orderCode) {
      const data = {
        status: orderCode,
      };

      await this.updateOrder({ orderId, data });

      this.isShownCurrentItem = false;
    },

    onClickItem() {
      if (this.isShownCurrentItem) {
        this.isShownCurrentItem = false;
      }
    },

    onClickCodeDropdown() {
      this.isShownCurrentItem = true;
    },

    onClickDeleteOrder(id) {
      this.selectedRowId = id;
      this.isShownDeleteModal = true;
    },

    onOrderDeleted() {
      this.tableItems = this.tableItems.filter((item) => item.id !== this.selectedRowId);
    },

    onClickTableRow(row) {
      if (!this.isShownCurrentItem) {
        this.$router.push({ name: "OrdersInfo", params: { id: row.id } });
      }
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
}

.table {
  &-delivery-date {
    @apply border-b border-transparent;
    @apply inline-block cursor-pointer;

    &:hover {
      @apply border-dashed border-base-dark;
    }
  }

  &-money {
    &::v-deep {
      .money-block {
        @apply justify-start;
      }
    }
  }

  &-status-dropdown {
    &::v-deep {
      .dropdown-wrapper {
        @apply text-sm font-normal;
        @apply p-0;
        @apply rounded-none border-0 bg-transparent;

        &-list {
          @apply absolute;

          .dropdown-block {
            @apply top-5 w-auto;
          }
        }

        .svg-icon {
          @apply relative top-0 right-0;
        }
      }
    }

    &-cancel {
      &::v-deep {
        .dropdown-wrapper {
          @apply text-red-600;

          .svg-icon {
            g [fill] {
              @apply text-red-600;
            }
          }
        }
      }
    }

    &-expected {
      &::v-deep {
        .dropdown-wrapper {
          @apply text-orange-400;

          .svg-icon {
            g [fill] {
              @apply text-orange-400;
            }
          }
        }
      }
    }

    &-inProgress {
      &::v-deep {
        .dropdown-wrapper {
          @apply text-blue-500;

          .svg-icon {
            g [fill] {
              @apply text-blue-500;
            }
          }
        }
      }
    }

    &-finished {
      &::v-deep {
        .dropdown-wrapper {
          @apply text-green-600;

          .svg-icon {
            g [fill] {
              @apply text-green-600;
            }
          }
        }
      }
    }
  }
}
</style>
