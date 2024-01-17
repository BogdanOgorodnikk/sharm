<template>
  <OurPage wide-page width="wide" :title="$t('title.ordersInfo')" :back-route="backRouteParams">
    <div class="orders-client">
      {{ $t("label.orderClient") }}:
      <router-link class="orders-client-name" :to="clientOrdersRoute">{{
        client.name
      }}</router-link>
    </div>

    <div class="orders-client-info-block">
      <div class="orders-client-info">
        <OurSvgIcon class="gray" name="Phone" />

        <div class="orders-client-info-title">{{ client.phone }}</div>
      </div>

      <div class="orders-client-info">
        <OurSvgIcon class="gray" name="Mail" />

        <div class="orders-client-info-title">{{ client.email }}</div>
      </div>
    </div>

    <div class="orders-info-actions">
      <OurButton size="sm" :text="$t('button.addToOrder')" @click="onClickAddProductToOrder">
        <template #icon-right>
          <OurSvgIcon color="white" name="Plus2" />
        </template>
      </OurButton>

      <OurButton
        variant="transparent"
        size="sm"
        class="orders-info-actions-button"
        :text="$t('button.printInvoice')"
        @click="onClickPrintInvoice"
      >
        <template #icon-right>
          <OurSvgIcon color="black" name="Printer" />
        </template>
      </OurButton>
    </div>

    <div class="orders-info-actions">
      <OurButton
        v-if="!order.isTransportInvoice"
        size="sm"
        :text="$t('button.createTransportInvoice')"
        @click="onClickCreateTransportInvoice"
      >
        <template #icon-right>
          <OurSvgIcon color="white" name="Plus2" />
        </template>
      </OurButton>

      <OurButton
        v-else
        size="sm"
        :text="$t('button.editTransportInvoice')"
        @click="onClickEditTransportInvoice"
      >
        <template #icon-right>
          <OurSvgIcon color="white" name="Edit" />
        </template>
      </OurButton>

      <OurButton
        v-if="order.isTransportInvoice"
        variant="transparent"
        size="sm"
        class="orders-info-actions-button"
        :text="$t('button.printTransportInvoice')"
        @click="onClickPrintTransportInvoice"
      >
        <template #icon-right>
          <OurSvgIcon color="black" name="Printer" />
        </template>
      </OurButton>
    </div>

    <OurTable :headers="tableHeaders" :items.sync="tableItems">
      <template #cell-amount="{ value }">
        <OurMoney :item="value" />
      </template>

      <template #cell-made="{ value }">
        <OurInput
          v-model="value.number"
          validation-rule="number"
          class="orders-table-made-input"
          @blur="onBlurChangeMadeProduct(value)"
        />
      </template>

      <template #cell-actions="{ value }">
        <div class="orders-table-actions">
          <OurSvgIcon
            interactive
            size="sm"
            color="gray"
            name="Edit"
            @click="onClickEditOrderProduct(value)"
          />

          <OurSvgIcon
            interactive
            size="sm"
            color="red"
            name="Trash"
            @click="onClickDeleteOrderProduct(value)"
          />
        </div>
      </template>

      <template #tfoot>
        <td :colspan="tableHeaders.length">
          <OurInput
            v-model="deliveryAmount"
            class="mb-2"
            :label="$t('label.deliveryAmount')"
            placeholder="0"
            @input="onInputSetDeliveryAmount"
          />

          <div class="orders-table-footer-wrapper">
            <div class="orders-table-footer-title">{{ $t("title.orderAmount") }}:</div>

            <OurMoney size="lg" :item="generalAmount" />
          </div>

          <div class="orders-table-footer-delivery">
            <span class="orders-table-footer-title">{{ $t("label.deliveryPlace") }}:</span>
            {{ deliveryPlace }}
          </div>
        </td>
      </template>
    </OurTable>

    <DeleteModal
      v-model="isShownDeleteModal"
      :item="deletedItem"
      @orderProductDeleted="onOrderProductDelete"
    />
  </OurPage>
</template>

<script>
import OurPage from "@/components/OurPage";
import OurTable from "@/components/OurTable";
import OurMoney from "@/components/OurMoney";
import OurButton from "@/components/OurButton";
import OurSvgIcon from "@/components/OurSvgIcon";
import { getOrder, getOrderInfo, updateOrder, updateOrderProduct } from "@/api/orders";
import OurInput from "@/components/form/OurInput";
import DeleteModal from "../delete/Modal";
import { getUser } from "@/api/user";
import debounce from "lodash.debounce";

export default {
  components: {
    OurInput,
    OurSvgIcon,
    OurButton,
    OurMoney,
    OurTable,
    OurPage,
    DeleteModal,
  },

  data() {
    return {
      tableHeaders: [
        {
          value: "name",
          text: this.$t("label.name"),
          tdClass: "",
          thClass: "",
        },
        {
          value: "textile",
          text: this.$t("label.textile"),
          tdClass: "",
          thClass: "",
        },
        {
          value: "number",
          text: this.$t("label.number"),
          tdClass: "",
          thClass: "",
        },
        {
          value: "made",
          text: this.$t("label.made"),
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
          value: "size",
          text: this.$t("label.size"),
          tdClass: "",
          thClass: "",
        },
        {
          value: "frame",
          text: this.$t("label.frame"),
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
          value: "actions",
          text: "",
          tdClass: "",
          thClass: "",
        },
      ],
      tableItems: [],
      client: {
        id: "",
        name: "",
      },
      isShownDeleteModal: false,
      deletedItem: {
        id: "",
        name: "",
      },
      deliveryAmount: 0,
      isInited: false,
      order: {},
    };
  },

  computed: {
    clientOrdersRoute() {
      return {
        name: "ClientsOrders",
        params: { id: this.client.id },
      };
    },

    backRouteParams() {
      return {
        title: this.$t("title.clientsOrders"),
        name: "ClientsOrders",
        params: { id: this.client.id },
      };
    },

    generalAmount() {
      let amount = Number(this.deliveryAmount) || 0;
      let currencySymbol = "";

      this.tableItems.forEach((item) => {
        amount += item.amount.sum;
        currencySymbol = item.amount.currencySymbol;
      });

      return {
        sum: amount,
        currencySymbol,
      };
    },

    deliveryPlace() {
      const yard = this.client.deliveryPlace ? this.client.deliveryPlace : "";

      return `${this.client.region} ${this.$t("label.region")} ${this.$t("label.town")} ${
        this.client.town
      } ${yard}`;
    },
  },

  async created() {
    await this.prefillTableItems();

    const response = await getOrder(this.$route.params.id);

    this.order = response;

    this.deliveryAmount = response.delivery_price;

    setTimeout(() => {
      this.isInited = true;
    }, 600);
  },

  methods: {
    onClickCreateTransportInvoice() {
      this.$router.push({
        name: "TransportInvoiceAdd",
        params: { orderId: this.$route.params.id },
      });
    },

    onClickEditTransportInvoice() {
      this.$router.push({
        name: "TransportInvoiceEdit",
        params: { id: this.order.transportInvoiceId, orderId: this.$route.params.id },
      });
    },

    onClickPrintTransportInvoice() {
      let win = window.open(
        location.origin + `/prints/transport-invoice/${this.order.transportInvoiceId}`,
        "printSchedule",
        "width=842,height=595"
      );

      if (win) {
        win.addEventListener("message", ($event) => {
          if (win && ($event.data === "printed" || $event.data === "close")) {
            win.close();
            win = null;
          }
        });
      }
    },

    onInputSetDeliveryAmount: debounce(async function () {
      if (this.isInited) {
        await updateOrder(this.$route.params?.id, { delivery_price: this.deliveryAmount });
      }
    }, 500),

    async onBlurChangeMadeProduct(item) {
      const editedItem = this.tableItems.find((orderProduct) => orderProduct.id === item.id);

      if (item.number > editedItem.number) {
        item.number = editedItem.number;
      }

      await updateOrderProduct(item.id, { made: item.number });
    },

    async prefillTableItems() {
      const orderId = this.$route.params.id;
      const orders = await getOrderInfo(orderId);
      const [firstOrder] = orders;

      this.client = await getUser(firstOrder.clientId);

      this.tableItems = orders.map((item) => {
        return {
          id: item.id,
          name: item.name,
          textile: item.textile,
          number: item.number,
          made: {
            id: item.id,
            number: item.made,
          },
          note: item.note,
          size: `${item.sizeWidth} x ${item.sizeLength}`,
          frame: item.frame,
          amount: {
            sum: item.amount,
            currencySymbol: item.currencySymbol,
          },
          actions: {
            id: item.id,
            name: item.name,
          },
        };
      });
    },

    onClickDeleteOrderProduct(item) {
      this.isShownDeleteModal = true;

      this.deletedItem = {
        id: item.id,
        name: item.name,
      };
    },

    onOrderProductDelete() {
      this.tableItems = this.tableItems.filter((item) => item.id !== this.deletedItem.id);
    },

    onClickEditOrderProduct(item) {
      this.$router.push({ name: "ClientEditProduct", params: { id: item.id } });
    },

    onClickAddProductToOrder() {
      this.$router.push({ name: "ClientAddProduct", params: { orderId: this.$route.params.id } });
    },

    onClickPrintInvoice() {
      let win = window.open(
        location.origin + `/prints/invoice/${this.$route.params.id}`,
        "printSchedule",
        "width=842,height=595"
      );

      if (win) {
        win.addEventListener("message", ($event) => {
          if (win && ($event.data === "printed" || $event.data === "close")) {
            win.close();
            win = null;
          }
        });
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.orders {
  &-client {
    @apply text-xl font-medium text-base-dark;
    @apply mb-4;

    &-name {
      @apply text-lg font-normal text-blue-500 underline;
    }

    &-info {
      @apply flex items-center;

      &-block {
        @apply mb-4 space-y-2;
      }

      &-title {
        @apply pl-2 text-blue-500;
      }
    }
  }

  &-info {
    &-actions {
      @apply mb-4 space-y-2 sm:flex sm:space-x-4 sm:space-y-0;

      &-button {
        @apply w-auto;
      }
    }
  }

  &-table {
    &-made {
      &-input {
        @apply w-12;

        &::v-deep {
          .input {
            @apply rounded-none;
            @apply p-0;
          }
        }
      }
    }

    &-actions {
      @apply flex;
      @apply space-x-4;
    }

    &-footer {
      &-wrapper {
        @apply flex items-center;
      }

      &-title {
        @apply text-lg font-medium normal-case text-base-dark;
        @apply pr-2;
      }

      &-delivery {
        @apply text-base font-normal lowercase text-base-dark;
        @apply mt-2;
      }
    }
  }
}
</style>
