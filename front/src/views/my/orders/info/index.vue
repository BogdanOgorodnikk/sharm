<template>
  <OurPage wide-page width="wide" :title="$t('title.ordersInfo')" :back-route="backRouteParams">
    <OurButton
      v-if="canChangedOrder"
      class="mb-3"
      size="sm"
      :text="$t('button.addToOrder')"
      @click="onClickAddProductToOrder"
    >
      <template #icon-right>
        <OurSvgIcon color="white" name="Plus2" />
      </template>
    </OurButton>

    <OurTable :headers="tableHeaders" :items.sync="tableItems">
      <template #cell-amount="{ value }">
        <OurMoney class="orders-table-money" :item="value" />
      </template>

      <template #cell-actions="{ value }">
        <div class="orders-table-actions">
          <OurSvgIcon
            v-if="canChangedOrder"
            interactive
            size="sm"
            color="gray"
            name="Edit"
            @click="onClickEditOrderProduct(value)"
          />

          <OurSvgIcon
            v-if="canChangedOrder"
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
          <div v-if="deliveryAmount" class="orders-table-footer-wrapper">
            <div class="orders-table-footer-title">{{ $t("title.deliveryPrice") }}:</div>

            <OurMoney
              size="lg"
              :item="{ sum: deliveryAmount, currencySymbol: tableItems[0].amount.currencySymbol }"
            />
          </div>

          <div class="orders-table-footer-wrapper">
            <div class="orders-table-footer-title">{{ $t("title.orderAmount") }}:</div>

            <OurMoney size="lg" :item="generalAmount" />
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
import { getOrder, getOrderInfo, ORDER_CODES } from "@/api/orders";
import DeleteModal from "../delete/Modal";

export default {
  components: {
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
      isShownDeleteModal: false,
      deletedItem: {
        id: "",
        name: "",
      },
      canChangedOrder: false,
      deliveryAmount: 0,
    };
  },

  computed: {
    backRouteParams() {
      return {
        title: this.$t("title.myOrders"),
        name: "MyOrders",
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
  },

  async created() {
    await this.prefillTableItems();

    const response = await getOrder(this.$route.params.id);

    this.deliveryAmount = response.delivery_price;
  },

  methods: {
    async prefillTableItems() {
      const orderId = this.$route.params.id;
      const orders = await getOrderInfo(orderId);
      const [firstOrder] = orders;

      this.canChangedOrder = firstOrder.status === ORDER_CODES.expected;

      this.tableItems = orders.map((item) => {
        return {
          id: item.id,
          name: item.name,
          textile: item.textile,
          number: item.number,
          made: item.made,
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

      if (!this.tableItems.length) {
        this.$router.push({ name: "MyOrders" });
      }
    },

    onClickEditOrderProduct(item) {
      this.$router.push({ name: "MyOrdersEditProduct", params: { id: item.id } });
    },

    onClickAddProductToOrder() {
      this.$router.push({ name: "MyOrdersAddProduct", params: { orderId: this.$route.params.id } });
    },
  },
};
</script>

<style lang="postcss" scoped>
.orders {
  &-table {
    &-actions {
      @apply flex;
      @apply space-x-4;
    }

    &-money {
      &::v-deep {
        .money-block {
          @apply justify-start;
        }
      }
    }

    &-footer {
      &-wrapper {
        @apply flex items-center;
      }

      &-title {
        @apply text-lg font-medium normal-case text-base-dark;
        @apply pr-2;
      }
    }
  }
}
</style>
