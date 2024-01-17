<template>
  <div class="invoice">
    <div class="invoice-wrapper border-b-2 border-black">
      <div>
        <div class="invoice-wrapper-title">
          {{ $t("page.print.invoice.name", { number: $route.params.id, date: printDate }) }}
        </div>
        <div class="invoice-wrapper-type">{{ $t("page.print.invoice.type") }}</div>
      </div>

      <img src="@/assets/images/logos/app/LogoDark.svg" alt="logo" />
    </div>

    <div class="invoice-info">
      <div class="invoice-info-item">
        <div class="mr-2">{{ $t("page.print.invoice.seller") }}:</div>
        <div class="font-medium" v-html="$t('page.print.invoice.sellerInfo')" />
      </div>

      <div class="invoice-info-item">
        <div class="mr-2">{{ $t("page.print.invoice.client") }}:</div>
        <div class="font-medium uppercase">{{ client.name }}</div>
      </div>

      <div class="invoice-info-item">
        <div class="mr-2">{{ $t("page.print.invoice.order") }}:</div>
        <div class="font-medium">{{ $t("page.print.invoice.orderName") }}</div>
      </div>
    </div>

    <div class="invoice-products">
      <div class="invoice-products-item">
        <div class="invoice-products-item-col text-center font-medium">№</div>
        <div class="invoice-products-item-col text-center font-medium">
          {{ $t("page.print.invoice.product") }}
        </div>
        <div class="invoice-products-item-col text-center font-medium">
          {{ $t("page.print.invoice.number") }}
        </div>
        <div class="invoice-products-item-col text-center font-medium">
          {{ $t("page.print.invoice.price") }}
        </div>
        <div class="invoice-products-item-col text-center font-medium">
          {{ $t("page.print.invoice.amount") }}
        </div>
      </div>

      <div v-for="(item, index) in products" :key="index" class="invoice-products-item">
        <div class="invoice-products-item-col text-center">{{ index + 1 }}</div>
        <div class="invoice-products-item-col">{{ item.name }}</div>
        <div class="invoice-products-item-col flex justify-center !p-0">
          <div class="w-full border-r-2 border-black py-2 pr-2 text-right">{{ item.number }}</div>
          <div class="w-full py-2 pl-2">{{ $t("page.print.invoice.numberType") }}</div>
        </div>
        <div class="invoice-products-item-col text-right">{{ item.price }}</div>
        <div class="invoice-products-item-col text-right">{{ item.amount }}</div>
      </div>

      <div v-if="order.delivery_price" class="invoice-products-item">
        <div class="invoice-products-item-col text-center">{{ products.length + 1 }}</div>
        <div class="invoice-products-item-col">{{ $t("page.print.invoice.delivery") }}</div>
        <div class="invoice-products-item-col flex justify-center !p-0">
          <div class="w-full py-2 pr-2 text-center">1</div>
        </div>
        <div class="invoice-products-item-col text-right">{{ order.preparedDelivery }}</div>
        <div class="invoice-products-item-col text-right">{{ order.preparedDelivery }}</div>
      </div>
    </div>

    <div class="invoice-amount space-y-4">
      <div class="invoice-amount-item">
        <div class="text-right font-medium">{{ $t("page.print.invoice.amountWithoutPdf") }}:</div>
        <div class="text-right font-medium">{{ generalAmount }}</div>
      </div>

      <div class="invoice-amount-item">
        <div class="text-right font-medium">{{ $t("page.print.invoice.withoutPdf") }}:</div>
        <div class="text-right font-medium">-</div>
      </div>

      <div class="invoice-amount-item">
        <div class="text-right font-medium">{{ $t("page.print.invoice.amountWithPdf") }}:</div>
        <div class="text-right font-medium">{{ generalAmount }}</div>
      </div>
    </div>

    <div class="mt-4">
      {{
        $t("page.print.invoice.allProducts", {
          number: order.delivery_price ? productsNumber + 1 : productsNumber,
          amount: generalAmount,
        })
      }}
    </div>

    <div class="mt-4 border-b-2 border-black pb-4">
      {{ $t("page.print.invoice.createPlace") }}: <span class="pl-4">м.Шепетівка</span>
    </div>

    <div class="mt-4 flex">
      <div class="mr-8 flex w-full">
        <div class="mr-2 font-medium">Відвантажив(ла):</div>

        <div class="w-full w-full border-b border-black" />
      </div>

      <div class="flex w-full">
        <div class="mr-2 font-medium">Отримав(ла):</div>

        <div class="w-full w-full border-b border-black" />
      </div>
    </div>
  </div>
</template>

<script>
import { getOrderInfo, getOrder } from "@/api/orders";
import { getUser } from "@/api/user";
import { separatedMoney } from "@/services/money.service";
import { format } from "date-fns";

export default {
  data: () => ({
    products: [],
    client: {
      id: "",
      name: "",
    },
    order: {},
  }),

  computed: {
    generalAmount() {
      let amount = Number(this.order.delivery_price) || 0;

      this.products.forEach((item) => {
        amount += item.defaultAmount;
      });

      const preparedAmount = separatedMoney(amount);

      return `${preparedAmount.integer},${preparedAmount.penny}`;
    },

    productsNumber() {
      let number = 0;

      this.products.forEach((item) => {
        number += Number(item.number);
      });

      return number;
    },

    printDate() {
      return format(new Date(), "dd.MM.yyyy");
    },
  },

  watch: {
    products: {
      handler: "onChangeProducts",
      deep: true,
    },
  },

  async mounted() {
    await this.prefillPrint();
  },

  methods: {
    onChangeProducts() {
      if (this.products.length) {
        setTimeout(() => {
          window.addEventListener("afterprint", () => {
            window.postMessage("printed");
          });

          window.print();
        }, 1000);
      }
    },

    async prefillPrint() {
      const orderId = this.$route.params.id;
      const orders = await getOrderInfo(orderId);
      const [firstOrder] = orders;

      this.client = await getUser(firstOrder.clientId);
      this.order = await getOrder(orderId);

      const deliveryPrice = separatedMoney(this.order.delivery_price);

      this.order.preparedDelivery = `${deliveryPrice.integer},${deliveryPrice.penny}`;

      this.products = orders.map((item) => {
        const amount = separatedMoney(item.amount);
        const price = separatedMoney(item.amount / item.number);

        return {
          name: `${item.name} (${item.textile} ${item.note})`,
          number: item.number,
          price: `${price.integer},${price.penny}`,
          amount: `${amount.integer},${amount.penny}`,
          defaultAmount: item.amount,
        };
      });
    },
  },
};
</script>

<style lang="postcss" scoped>
.invoice {
  @apply py-4;

  &-wrapper {
    @apply flex items-center justify-between;

    &-title {
      @apply text-base font-medium text-black;
    }

    &-type {
      @apply text-sm font-normal text-black;
    }
  }

  &-info {
    @apply mt-4 space-y-4;

    &-item {
      @apply grid text-xs;
      grid-template-columns: 8rem auto;
    }
  }

  &-products {
    @apply border-2 border-black;
    @apply my-1;

    &-item {
      @apply grid text-xs;
      @apply border-b-2 border-black;
      grid-template-columns: 4rem auto 6rem 8rem 8rem;

      &:last-of-type {
        @apply border-b-0;
      }

      &-col {
        @apply border-r-2 border-black;
        @apply p-0.5;

        &:last-of-type {
          @apply border-0;
        }
      }
    }
  }

  &-amount {
    @apply mt-4;

    &-item {
      @apply grid text-xs;
      grid-template-columns: auto 8rem;
    }
  }
}
</style>
