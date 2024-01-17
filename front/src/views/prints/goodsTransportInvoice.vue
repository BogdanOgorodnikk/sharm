<template>
  <div class="transport-invoice">
    <div class="mr-40 mb-5 text-right text-sm">
      Додаток 7 <br />
      до Правил перевезень вантажів автомобільним <br />
      транспортом в Україні <br />
      (пункт 11.1 глави 11)
    </div>

    <div class="text-center">
      <div class="mb-2 text-[1.125rem] font-medium">ТОВАРНО-ТРАНСПОРТНА НАКЛАДНА</div>
      <div class="flex items-end justify-center">
        <div class="mr-8">
          № <span class="border-b border-black">Р{{ transportInvoice.order_id }}</span>
        </div>

        <div>
          <span class="border-b border-black">{{ transportInvoiceDate }}</span>
        </div>
      </div>

      <div class="mt-5">Форма № 1-ТН</div>
    </div>

    <div class="mt-3 flex space-x-5">
      <div class="flex w-full text-sm">
        <div class="mr-2">Автомобіль</div>

        <div class="flex w-full flex-col">
          <div class="border-b border-black">
            {{ car.brand }} {{ car.model }} {{ car.license_plate }}
          </div>

          <div class="mt-1 text-center text-xs">(марка, модель, тип, реєстраційний номер)</div>
        </div>
      </div>

      <div class="flex w-full text-sm">
        <div class="mr-2 whitespace-nowrap">Причіп/напівпричіп</div>

        <div class="flex w-full flex-col">
          <div class="border-b border-black">
            <template v-if="trailer">
              {{ trailer.brand }} {{ trailer.model }} {{ trailer.license_plate }}
            </template>

            <template v-else> - </template>
          </div>

          <div class="mt-1 text-center text-xs">(марка, модель, тип, реєстраційний номер)</div>
        </div>
      </div>

      <div class="flex w-full text-sm">
        <div class="mr-2 whitespace-nowrap">Вид перевезень</div>

        <div class="flex w-full flex-col">
          <div class="border-b border-black">вантажні перевезення</div>
        </div>
      </div>
    </div>

    <div class="mt-3 flex items-end space-x-5">
      <div class="flex w-full text-sm">
        <div class="mr-2 whitespace-nowrap">Автомобільний перевізник</div>

        <div class="flex w-full flex-col">
          <div class="border-b border-black">
            {{ car.owner }}
          </div>

          <div class="mt-1 text-center text-xs">(найменування / П. І. Б.)</div>
        </div>
      </div>

      <div>
        <div class="flex text-sm">
          <div
            v-for="(item, index) in String(car.tax_number)"
            :key="index"
            class="border border-black pt-2 pl-2 pr-0.5 pb-0.5"
          >
            {{ item }}
          </div>
        </div>

        <div class="mt-1 whitespace-nowrap text-center text-xs">(податковий номер)</div>
      </div>

      <div class="flex w-full text-sm">
        <div class="mr-2 whitespace-nowrap">Водій</div>

        <div class="flex w-full flex-col">
          <div class="border-b border-black">
            {{ driver.full_name }} {{ driver.driver_license_number }}
          </div>

          <div class="mt-1 text-center text-xs">(П. І. Б., номер посвідчення водія)</div>
        </div>
      </div>
    </div>

    <div class="mt-3 flex items-end space-x-5">
      <div class="flex w-full text-sm">
        <div class="mr-2 whitespace-nowrap">Замовник</div>

        <div class="flex w-full flex-col">
          <div class="border-b border-black">Огороднік Микола Анатолійович</div>

          <div class="mt-1 text-center text-xs">(найменування / П. І. Б.)</div>
        </div>
      </div>

      <div>
        <div class="flex text-sm">
          <div
            v-for="(item, index) in '2772310774'"
            :key="index"
            class="border border-black pt-2 pl-2 pr-0.5 pb-0.5"
          >
            {{ item }}
          </div>
        </div>

        <div class="mt-1 whitespace-nowrap text-center text-xs">(податковий номер)</div>
      </div>
    </div>

    <div class="mt-3 flex items-end space-x-5">
      <div class="flex w-full text-sm">
        <div class="mr-2 whitespace-nowrap">Вантажовідправник</div>

        <div class="flex w-full flex-col">
          <div class="border-b border-black">
            Огороднік Микола Анатолійович, Хмельницька обл., м.Шепетівка, вул. Горбатюка, 12
          </div>

          <div class="mt-1 text-center text-xs">
            (повне найменування, місцезнаходження / П. І. Б., місце проживання)
          </div>
        </div>
      </div>

      <div>
        <div class="flex text-sm">
          <div
            v-for="(item, index) in '2772310774'"
            :key="index"
            class="border border-black pt-2 pl-2 pr-0.5 pb-0.5"
          >
            {{ item }}
          </div>
        </div>

        <div class="mt-1 whitespace-nowrap text-center text-xs">(податковий номер)</div>
      </div>
    </div>

    <div class="mt-3 flex items-end space-x-5">
      <div class="flex w-full text-sm">
        <div class="mr-2 whitespace-nowrap">Вантажоодержувач</div>

        <div class="flex w-full flex-col">
          <div class="border-b border-black">{{ client.name }}, {{ client.place }}</div>

          <div class="mt-1 text-center text-xs">
            (повне найменування, місцезнаходження / П. І. Б., місце проживання)
          </div>
        </div>
      </div>

      <div>
        <div class="flex text-sm">
          <div
            v-for="(item, index) in client.tax_number || ['', '', '', '', '', '', '', '', '', '']"
            :key="index"
            class="border border-black pt-2 pl-2 pr-0.5 pb-0.5"
          >
            {{ item }}
          </div>
        </div>

        <div class="mt-1 whitespace-nowrap text-center text-xs">(податковий номер)</div>
      </div>
    </div>

    <div class="mt-3 flex items-end space-x-5">
      <div class="flex w-full text-sm">
        <div class="mr-2 whitespace-nowrap">Пункт навантаження</div>

        <div class="flex w-full flex-col">
          <div class="border-b border-black">Хмельницька обл. м. Шепетівка, вул. Рампова, 14</div>

          <div class="mt-1 text-center text-xs">(місцезнаходження)</div>
        </div>
      </div>

      <div class="flex w-full text-sm">
        <div class="mr-2 whitespace-nowrap">Пункт розвантаження</div>

        <div class="flex w-full flex-col">
          <div class="border-b border-black">{{ transportInvoice.unloading_place }}</div>

          <div class="mt-1 text-center text-xs">(місцезнаходження)</div>
        </div>
      </div>
    </div>

    <div class="mt-3 flex items-end space-x-5">
      <div class="flex w-full text-sm">
        <div class="mr-2 whitespace-nowrap">кількість місць</div>

        <div class="flex w-full flex-col">
          <div class="border-b border-black">
            {{ convertNumberToString(productsNumber).convertedInteger }}
          </div>

          <div class="mt-1 text-center text-xs">(словами)</div>
        </div>
      </div>

      <div class="flex w-full text-sm">
        <div class="mr-2 whitespace-nowrap">масою брутто, кг</div>

        <div class="flex w-full flex-col">
          <div class="border-b border-black">
            {{ convertNumberToString(productsNumber * 100).convertedInteger }}
          </div>

          <div class="mt-1 text-center text-xs">(словами)</div>
        </div>
      </div>

      <div class="flex w-full text-sm">
        <div class="mr-2 whitespace-nowrap">отримав водій/експедитор</div>

        <div class="flex w-full flex-col">
          <div class="border-b border-black" />

          <div class="mt-1 text-center text-xs">(П. І. Б., посада, підпис)</div>
        </div>
      </div>
    </div>

    <div class="mt-3 flex items-start space-x-5">
      <div class="flex w-full text-sm">
        <div class="mr-2 whitespace-nowrap">Усього відпущено на загальну суму</div>

        <div class="flex w-full flex-col">
          <div class="border-b border-black">
            {{ generalAmountString }}
          </div>

          <div class="mt-1 text-center text-xs">(словами, з урахуванням ПДВ)</div>
        </div>
      </div>

      <div class="flex w-full text-sm">
        <div class="mr-2 whitespace-nowrap">, у тому числі ПДВ</div>

        <div class="flex w-full flex-col">
          <div class="border-b border-black">0,00 грн</div>
        </div>
      </div>
    </div>

    <div class="mt-3 flex items-start space-x-5">
      <div class="flex w-full text-sm">
        <div class="mr-2 whitespace-nowrap">Супровідні документи на вантаж</div>

        <div class="flex w-full flex-col">
          <div class="border-b border-black">
            Видаткова накладна № {{ transportInvoice.order_id }} від {{ invoiceDate }}
          </div>
        </div>
      </div>
    </div>

    <div class="mb-2 mt-3 text-center text-[1.125rem] font-medium">ВІДОМОСТІ ПРО ВАНТАЖ</div>

    <div class="transport-invoice-products">
      <div class="transport-invoice-products-item">
        <div class="transport-invoice-products-item-col text-center">
          № <br />
          з/п
        </div>
        <div class="transport-invoice-products-item-col text-center">
          Найменування вантажу (номер контейнера), у разі <br />
          перевезення небезпечних вантажів: клас небезпечних <br />
          речовин, до якого віднесено вантаж
        </div>
        <div class="transport-invoice-products-item-col text-center">
          Одиниця <br />
          виміру
        </div>
        <div class="transport-invoice-products-item-col text-center">Кількість місць</div>
        <div class="transport-invoice-products-item-col text-center">
          Ціна без ПДВ за <br />
          одиницю, грн
        </div>
        <div class="transport-invoice-products-item-col text-center">
          Загальна сума з ПДВ, <br />
          грн
        </div>
        <div class="transport-invoice-products-item-col text-center">
          Вид <br />
          пакування
        </div>
        <div class="transport-invoice-products-item-col text-center">Документи з вантажем</div>
        <div class="transport-invoice-products-item-col text-center">Маса брутто, кг</div>
      </div>

      <div class="transport-invoice-products-item">
        <div class="transport-invoice-products-item-col text-center font-medium">1</div>
        <div class="transport-invoice-products-item-col text-center font-medium">2</div>
        <div class="transport-invoice-products-item-col text-center font-medium">3</div>
        <div class="transport-invoice-products-item-col text-center font-medium">4</div>
        <div class="transport-invoice-products-item-col text-center font-medium">5</div>
        <div class="transport-invoice-products-item-col text-center font-medium">6</div>
        <div class="transport-invoice-products-item-col text-center font-medium">7</div>
        <div class="transport-invoice-products-item-col text-center font-medium">8</div>
        <div class="transport-invoice-products-item-col text-center font-medium">9</div>
      </div>

      <div v-for="(item, index) in products" :key="index" class="transport-invoice-products-item">
        <div class="transport-invoice-products-item-col text-center">{{ index + 1 }}</div>
        <div class="transport-invoice-products-item-col">{{ item.name }}</div>
        <div class="transport-invoice-products-item-col text-center">шт</div>
        <div class="transport-invoice-products-item-col text-right">{{ item.number }}</div>
        <div class="transport-invoice-products-item-col text-right">{{ item.price }}</div>
        <div class="transport-invoice-products-item-col text-right">{{ item.amount }}</div>
        <div class="transport-invoice-products-item-col text-center">т</div>
        <div class="transport-invoice-products-item-col text-center">
          Видаткова накладна № {{ transportInvoice.order_id }} від
          {{ invoiceDate }}
        </div>
        <div class="transport-invoice-products-item-col text-right">{{ item.number * 100 }}</div>
      </div>

      <div class="transport-invoice-products-item">
        <div class="transport-invoice-products-item-col col-span-2">Усього:</div>
        <div class="transport-invoice-products-item-col text-center"></div>
        <div class="transport-invoice-products-item-col text-right">{{ productsNumber }}</div>
        <div class="transport-invoice-products-item-col text-center"></div>
        <div class="transport-invoice-products-item-col text-right">
          {{ formattedGeneralAmount }}
        </div>
        <div class="transport-invoice-products-item-col text-center"></div>
        <div class="transport-invoice-products-item-col text-center"></div>
        <div class="transport-invoice-products-item-col text-center"></div>
      </div>
    </div>

    <div class="ml-10 mt-3 flex space-x-5 text-sm">
      <div>
        <div class="mb-8">Здав (відповідальна особа вантажовідправника)</div>

        <div class="border-b border-black" />

        <div class="mt-1 text-center text-xs">(П.І.Б., посада, підпис)</div>
      </div>

      <div>
        <div class="mb-8">Прийняв (відповідальна особа вантажоодержувача)</div>

        <div class="border-b border-black" />

        <div class="mt-1 text-center text-xs">(П.І.Б., посада, підпис)</div>
      </div>
    </div>

    <div class="mb-2 mt-4 text-center text-[1.125rem] font-medium">
      ВІДОМОСТІ ПРО ПАРАМЕТРИ ТРАНСПОРТНОГО ЗАСОБУ
    </div>

    <div class="transport-invoice-veh">
      <div class="transport-invoice-veh-item">
        <div
          class="transport-invoice-veh-item-col flex flex-col items-center justify-center text-center"
        >
          Він-код
        </div>
        <div
          class="transport-invoice-veh-item-col flex flex-col items-center justify-center text-center"
        >
          Рік випуску
        </div>

        <div class="transport-invoice-veh-item-col flex flex-col !p-0 text-center">
          <div class="border-b-2 border-black p-2">Габарити автомобіля</div>

          <div class="flex h-full">
            <div class="transport-invoice-veh-item-col w-full p-2 text-center">
              Довжина, <br />
              мм
            </div>
            <div class="transport-invoice-veh-item-col w-full p-2 text-center">
              Ширина, <br />
              мм
            </div>
            <div class="transport-invoice-veh-item-col w-full p-2 text-center">
              Висота, <br />
              мм
            </div>
          </div>
        </div>

        <div class="transport-invoice-veh-item-col flex flex-col !p-0 text-center">
          <div class="border-b-2 border-black p-2">Вага автомобіля</div>

          <div class="flex h-full">
            <div class="transport-invoice-veh-item-col w-full p-2 text-center">без вантажу, т</div>
            <div class="transport-invoice-veh-item-col w-full p-2 text-center">з вантаже, т</div>
          </div>
        </div>

        <div
          class="transport-invoice-veh-item-col flex flex-col items-center justify-center text-center"
        >
          Підпис відповідальної сторони <br />
          (перевізник або водій)
        </div>
      </div>

      <div class="transport-invoice-veh-item">
        <div class="transport-invoice-veh-item-col text-center font-medium">10</div>
        <div class="transport-invoice-veh-item-col text-center font-medium">11</div>

        <div class="transport-invoice-veh-item-col flex !p-0 font-medium">
          <div class="w-full border-r-2 border-black p-2 text-center">12</div>
          <div class="w-full border-r-2 border-black p-2 text-center">13</div>
          <div class="w-full p-2 text-center">14</div>
        </div>

        <div class="transport-invoice-veh-item-col flex !p-0 font-medium">
          <div class="w-full border-r-2 border-black p-2 text-center">15</div>
          <div class="w-full p-2 text-center">16</div>
        </div>

        <div class="transport-invoice-veh-item-col text-center font-medium">17</div>
      </div>

      <div class="transport-invoice-veh-item">
        <div class="transport-invoice-veh-item-col text-center">{{ car.vin_code }}</div>
        <div class="transport-invoice-veh-item-col text-center">
          {{ car.year_create }}
        </div>

        <div class="transport-invoice-veh-item-col flex !p-0">
          <div class="w-full border-r-2 border-black p-2 text-center">{{ car.length }}</div>
          <div class="w-full border-r-2 border-black p-2 text-center">{{ car.width }}</div>
          <div class="w-full p-2 text-center">{{ car.height }}</div>
        </div>

        <div class="transport-invoice-veh-item-col flex !p-0">
          <div class="w-full border-r-2 border-black p-2 text-center">{{ car.weight }}</div>
          <div class="w-full p-2 text-center">
            {{ car.weight + (productsNumber * 100) / 1000 }}
          </div>
        </div>

        <div class="transport-invoice-veh-item-col text-center"></div>
      </div>

      <div v-if="trailer" class="transport-invoice-veh-item">
        <div class="transport-invoice-veh-item-col text-center">
          {{ trailer.vin_code }}
        </div>
        <div class="transport-invoice-veh-item-col text-center">
          {{ trailer.year_create }}
        </div>

        <div class="transport-invoice-veh-item-col flex !p-0">
          <div class="w-full border-r-2 border-black p-2 text-center">{{ trailer.length }}</div>
          <div class="w-full border-r-2 border-black p-2 text-center">{{ trailer.width }}</div>
          <div class="w-full p-2 text-center">{{ trailer.height }}</div>
        </div>

        <div class="transport-invoice-veh-item-col flex !p-0">
          <div class="w-full border-r-2 border-black p-2 text-center">{{ trailer.weight }}</div>
          <div class="w-full p-2 text-center">
            {{ trailer.weight + (productsNumber * 100) / 1000 }}
          </div>
        </div>

        <div class="transport-invoice-veh-item-col text-center"></div>
      </div>
    </div>

    <div class="mb-2 mt-3 text-center text-[1.125rem] font-medium">
      ВАНТАЖНО-РОЗВАНТАЖУВАЛЬНІ ОПЕРАЦІї
    </div>

    <div class="transport-invoice-load">
      <div class="transport-invoice-load-item">
        <div
          class="transport-invoice-load-item-col flex flex-col items-center justify-center text-center"
        >
          Операція
        </div>
        <div
          class="transport-invoice-load-item-col flex flex-col items-center justify-center text-center"
        >
          Маса брутто, т
        </div>

        <div class="transport-invoice-load-item-col flex flex-col !p-0 text-center">
          <div class="border-b-2 border-black p-2">Час (год. хв.)</div>

          <div class="flex h-full">
            <div class="transport-invoice-load-item-col w-full p-2 text-center">прибуття</div>
            <div class="transport-invoice-load-item-col w-full p-2 text-center">вибуття</div>
            <div class="transport-invoice-load-item-col w-full p-2 text-center">простою</div>
          </div>
        </div>

        <div
          class="transport-invoice-load-item-col flex flex-col items-center justify-center text-center"
        >
          Підпис відповідальної сторони
        </div>
      </div>

      <div class="transport-invoice-load-item">
        <div class="transport-invoice-load-item-col text-center font-medium">18</div>
        <div class="transport-invoice-load-item-col text-center font-medium">19</div>

        <div class="transport-invoice-load-item-col flex !p-0 font-medium">
          <div class="w-full border-r-2 border-black p-2 text-center">20</div>
          <div class="w-full border-r-2 border-black p-2 text-center">21</div>
          <div class="w-full p-2 text-center">22</div>
        </div>

        <div class="transport-invoice-load-item-col text-center font-medium">23</div>
      </div>

      <div class="transport-invoice-load-item">
        <div class="transport-invoice-load-item-col text-center">Навантаження</div>
        <div class="transport-invoice-load-item-col text-center"></div>

        <div class="transport-invoice-load-item-col flex !p-0">
          <div class="w-full border-r-2 border-black p-2 text-center"></div>
          <div class="w-full border-r-2 border-black p-2 text-center"></div>
          <div class="w-full p-2 text-center"></div>
        </div>

        <div class="transport-invoice-load-item-col text-center"></div>
      </div>

      <div class="transport-invoice-load-item">
        <div class="transport-invoice-load-item-col text-center">Розвантаження</div>
        <div class="transport-invoice-load-item-col text-center"></div>

        <div class="transport-invoice-load-item-col flex !p-0">
          <div class="w-full border-r-2 border-black p-2 text-center"></div>
          <div class="w-full border-r-2 border-black p-2 text-center"></div>
          <div class="w-full p-2 text-center"></div>
        </div>

        <div class="transport-invoice-load-item-col text-center"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrderInfo } from "@/api/orders";
import { getUser } from "@/api/user";
import { separatedMoney } from "@/services/money.service";
import { format } from "date-fns";
import { getTransportInvoice } from "@/api/transportInvoice";
import numberToString from "number-to-cyrillic";

import uk from "date-fns/locale/uk";
import { mapActions, mapState } from "vuex";

export default {
  data: () => ({
    transportInvoice: {},
    products: [],
    client: {
      id: "",
      name: "",
    },
    order: {},
  }),

  computed: {
    ...mapState("car", ["car"]),
    ...mapState("trailer", ["trailer"]),
    ...mapState("driver", ["driver"]),

    transportInvoiceDate() {
      return format(new Date(this.transportInvoice.data_create), '"dd" MMMM yyyy року', {
        locale: uk,
      });
    },

    invoiceDate() {
      return format(new Date(this.transportInvoice.data_create), "dd MMMM yyyy р.", {
        locale: uk,
      });
    },

    generalAmount() {
      let amount = Number(this.order.delivery_price) || 0;

      this.products.forEach((item) => {
        amount += item.defaultAmount;
      });

      return amount;
    },

    productsNumber() {
      let number = 0;

      this.products.forEach((item) => {
        number += Number(item.number);
      });

      return number;
    },

    generalAmountString() {
      const amount = this.convertNumberToString(this.generalAmount);

      return `${amount.convertedInteger} ${amount.integerCurrency}
       ${amount.fractionalString} ${amount.fractionalCurrency}`;
    },

    formattedGeneralAmount() {
      const preparedAmount = separatedMoney(this.generalAmount);

      return `${preparedAmount.integer},${preparedAmount.penny}`;
    },
  },

  watch: {
    products: {
      handler: "onChangeProducts",
      deep: true,
    },
  },

  async mounted() {
    await this.prefillTransportInvoicePrint();
  },

  methods: {
    ...mapActions("car", ["getCar"]),
    ...mapActions("trailer", ["getTrailer"]),
    ...mapActions("driver", ["getDriver"]),

    convertNumberToString(number) {
      return numberToString.convert(number);
    },

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

    async prefillTransportInvoicePrint() {
      this.transportInvoice = await getTransportInvoice(this.$route.params.id);

      await this.getCar(this.transportInvoice.car_id);

      if (this.transportInvoice.trailer_id) {
        await this.getTrailer(this.transportInvoice.trailer_id);
      }

      await this.getDriver(this.transportInvoice.driver_id);

      this.client = await getUser(this.transportInvoice.customer_id);

      const orders = await getOrderInfo(this.transportInvoice.order_id);

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
.transport-invoice {
  &-products {
    @apply border-2 border-black;
    @apply my-1;

    &-item {
      @apply text-xs;
      @apply grid;
      @apply border-b-2 border-black;
      grid-template-columns: 4rem auto 5rem 6rem 8rem 8rem 5rem 12rem 8rem;

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

  &-veh {
    @apply border-2 border-black;
    @apply my-1;

    &-item {
      @apply text-xs;
      @apply grid;
      @apply border-b-2 border-black;
      grid-template-columns: 20rem 5rem 15rem 10rem auto;

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

  &-load {
    @apply border-2 border-black;
    @apply my-1;

    &-item {
      @apply text-xs;
      @apply grid;
      @apply border-b-2 border-black;
      grid-template-columns: 20rem 20rem 20rem 20rem auto;

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
}
</style>
