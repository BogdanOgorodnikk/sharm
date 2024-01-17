<template>
  <OurPage wide-page width="wide" :title="$t('title.clientsOrders')" :back-route="backRouteParams">
    <template #header-right>
      <OurButton :text="$t('button.filter')" size="sm" @click="onClickOpenFilterModal">
        <template #icon-left>
          <OurSvgIcon name="Filter" size="sm" />
        </template>
      </OurButton>
    </template>

    <div class="client-info-wrapper">
      <div class="client-info-title">
        {{ $t("label.client") }}: <span class="client-info-name">{{ client.name }}</span>
      </div>

      <div class="client-info-block">
        <OurSvgIcon name="Phone" />

        <div class="client-info-value">{{ client.phone }}</div>
      </div>

      <div class="client-info-block">
        <OurSvgIcon class="gray" name="Mail" />

        <div class="client-info-value">{{ client.email }}</div>
      </div>
    </div>

    <div class="client-info-title mt-3">
      {{ $t("label.deliveryPlace") }}: <span class="client-info-delivery">{{ deliveryPlace }}</span>
    </div>

    <div class="client-info-block mt-3">
      <div class="client-info-title">{{ $t("label.debt") }}:</div>

      <OurMoney sign="negative" class="pl-2" size="xl" :item="debt" />
    </div>

    <div class="client-header-actions">
      <OurButton
        size="sm"
        class="client-header-actions-button"
        :text="$t('button.createPayment')"
        @click="onClickOpenCreatePaymentPage"
      >
        <template #icon-left>
          <OurSvgIcon name="Money" />
        </template>
      </OurButton>

      <OurButton
        size="sm"
        class="client-header-actions-button"
        :text="$t('button.paymentHistory')"
        variant="secondary"
        @click="onClickOpenPaymentsPage"
      >
        <template #icon-left>
          <OurSvgIcon name="Archive" />
        </template>
      </OurButton>
    </div>

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

    <DeliveryDateModal
      v-model="isShownDeliveryModal"
      :delivery="delivery"
      @changeDeliveryDate="onChangeDeliveryDate"
    />
  </OurPage>
</template>

<script>
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";
import OurMoney from "@/components/OurMoney";
import OurSvgIcon from "@/components/OurSvgIcon";
import OurTable from "@/components/OurTable";
import OurDropdown from "@/components/OurDropdown";
import { getClientOrders, ORDER_CODES, updateOrder } from "@/api/orders";
import { getUser } from "@/api/user";
import { getClientDebt } from "@/api/clients";
import DeleteOrderModal from "../delete/DeleteOrderModal";
import FilterModal from "./components/FilterModal";
import { parsedDate } from "@/services/date.service";
import DeliveryDateModal from "./components/DeliveryDateModal";

export default {
  components: {
    DeliveryDateModal,
    FilterModal,
    DeleteOrderModal,
    OurDropdown,
    OurTable,
    OurSvgIcon,
    OurMoney,
    OurButton,
    OurPage,
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
          value: "amount",
          text: this.$t("label.amount"),
          tdClass: "",
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
          tdClass: "text-right",
          thClass: "text-right whitespace-nowrap",
        },
        {
          value: "actions",
          text: "",
          tdClass: "",
          thClass: "",
        },
      ],
      client: {},
      debt: {},
      orderCodes: ORDER_CODES,
      orders: [],
      isShownCurrentItem: false,
      isShownFilterModal: false,
      isShownDeliveryModal: false,
      filter: {
        dateFrom: "",
        dateTo: "",
        statuses: [],
      },
    };
  },

  computed: {
    backRouteParams() {
      return {
        title: this.$t("title.clients"),
        name: "ClientsList",
      };
    },

    deliveryPlace() {
      const yard = this.client.deliveryPlace ? this.client.deliveryPlace : "";

      return `${this.client.region} ${this.$t("label.region")} ${this.$t("label.town")} ${
        this.client.town
      } ${yard}`;
    },

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

    await this.getTableData();
  },

  beforeDestroy() {
    document.removeEventListener("click", this.onClickItem);
  },

  methods: {
    onClickDeleteOrder(id) {
      this.selectedRowId = id;
      this.isShownDeleteModal = true;
    },

    onClickOpenDeliveryModal(value) {
      this.delivery = value;
      this.isShownDeliveryModal = true;
    },

    onOrderDeleted() {
      this.orders = this.orders.filter((item) => item.id !== this.selectedRowId);
    },

    onClickOpenFilterModal() {
      this.isShownFilterModal = true;
    },

    async getTableData() {
      const clientId = this.$route.params.id;

      this.orders = await getClientOrders(clientId);
      this.client = await getUser(clientId);
      this.debt = await getClientDebt(clientId);
    },

    onClickItem() {
      if (this.isShownCurrentItem) {
        this.isShownCurrentItem = false;
      }
    },

    async onClickUpdateOrderStatus(orderId, orderCode) {
      const data = {
        status: orderCode,
      };

      const orderIndex = this.orders.findIndex((item) => item.id === orderId);

      this.orders[orderIndex].status = orderCode;

      await updateOrder(orderId, data);
      this.debt = await getClientDebt(this.$route.params.id);
      this.isShownCurrentItem = false;
    },

    onClickCodeDropdown() {
      this.isShownCurrentItem = true;
    },

    async onChangeDeliveryDate(data) {
      const orderIndex = this.orders.findIndex((item) => item.id === this.delivery.id);

      this.orders[orderIndex].delivery_date = data.delivery_date;

      await updateOrder(this.delivery.id, data);
    },

    onClickTableRow(row) {
      if (!this.isShownCurrentItem) {
        this.$router.push({ name: "ClientOrderInfo", params: { id: row.id } });
      }
    },

    onClickOpenCreatePaymentPage() {
      const route = this.$router.resolve({ name: "PaymentsAdd" });

      window.open(`${route.href}?clientId=${this.$route.params.id}`, "_blank");
    },

    onClickOpenPaymentsPage() {
      const route = this.$router.resolve({ name: "PaymentsList" });

      window.open(`${route.href}?clientId=${this.$route.params.id}`, "_blank");
    },
  },
};
</script>

<style lang="postcss" scoped>
.client {
  &-info {
    &-wrapper {
      @apply items-center sm:flex;
      @apply space-y-2 sm:space-x-5 sm:space-y-0;
    }

    &-block {
      @apply flex items-center;
    }

    &-title {
      @apply text-lg font-medium text-base-dark;
    }

    &-value {
      @apply text-base font-normal text-blue-500;
    }

    &-name {
      @apply text-lg font-normal text-base-dark;
    }

    &-delivery {
      @apply text-lg font-normal lowercase text-base-dark;
    }
  }

  &-header {
    &-actions {
      @apply sm:flex;
      @apply my-4 space-y-2 sm:space-x-4 sm:space-y-0;

      &-button {
        @apply w-auto;
      }
    }
  }
}

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
