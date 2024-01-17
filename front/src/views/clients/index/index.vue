<template>
  <OurPage width="4xl">
    <OurTable :headers="tableHeaders" :items.sync="tableItems" @clickRow="onClickRow">
      <template #cell-price="{ value }">
        <OurSelect
          v-model="value.id"
          class="table-client-select"
          :options="pricesForSelect"
          @change="onChangeUpdateUser(value)"
          @removeValue="onChangeUpdateUser(value)"
          @click.stop.native="onClickSelectShownCurrentItem"
        />
      </template>

      <template #cell-debt="{ value }">
        <OurMoney sign="negative" :item="value" />
      </template>
    </OurTable>
  </OurPage>
</template>

<script>
import OurPage from "@/components/OurPage";
import OurTable from "@/components/OurTable";
import { getClients } from "@/api/clients";
import OurSelect from "@/components/OurSelect";
import { mapActions, mapGetters } from "vuex";
import OurMoney from "@/components/OurMoney";

export default {
  components: {
    OurMoney,
    OurSelect,
    OurTable,
    OurPage,
  },

  data() {
    return {
      isShownCurrentItem: false,
      tableHeaders: [
        {
          value: "companyName",
          text: this.$t("label.companyName"),
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
          value: "price",
          text: this.$t("label.price"),
          tdClass: "",
          thClass: "",
        },
        {
          value: "email",
          text: this.$t("label.email"),
          tdClass: "",
          thClass: "",
        },
        {
          value: "phone",
          text: this.$t("label.phone"),
          tdClass: "",
          thClass: "",
        },
        {
          value: "debt",
          text: this.$t("label.debt"),
          tdClass: "",
          thClass: "",
        },
      ],

      tableItems: [],
    };
  },

  computed: {
    ...mapGetters("prices", ["pricesForSelect"]),
  },

  async created() {
    document.addEventListener("click", this.onClickItem);

    await Promise.all([this.getPrices(), this.prefillTableItems()]);
  },

  beforeDestroy() {
    document.addEventListener("click", this.onClickItem);
  },

  methods: {
    ...mapActions("user", ["updateUser"]),
    ...mapActions("prices", ["getPrices"]),

    onClickSelectShownCurrentItem() {
      this.isShownCurrentItem = true;
    },

    onClickItem() {
      if (this.isShownCurrentItem) {
        this.isShownCurrentItem = false;
      }
    },

    async onChangeUpdateUser(item) {
      const data = {
        id: item.clientId,
        priceId: item.id ? item.id : 0,
      };

      await this.updateUser(data);
    },

    async prefillTableItems() {
      const clients = await getClients();

      this.tableItems = clients.map((item) => {
        return {
          id: item.id,
          companyName: item.name,
          region: item.region,
          town: item.town,
          price: {
            id: item.priceId,
            label: item.priceName,
            clientId: item.id,
          },
          email: item.email,
          phone: item.phone,
          debt: {
            sum: item.usersDebt,
            currencySymbol: item.currency,
          },
        };
      });
    },

    onClickRow(row) {
      if (!this.isShownCurrentItem) {
        this.$router.push({ name: "ClientsOrders", params: { id: row.id } });
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.table-client {
  &-select {
    @apply -mt-2.5 w-32;

    &::v-deep {
      .multiselect-wrapper {
        @apply static;

        .multiselect {
          @apply items-center;
          @apply pt-0;

          .multiselect-caret {
            @apply mt-0;
          }

          .multiselect__tags {
            @apply mb-0 pt-2;
          }

          .multiselect__content-wrapper {
            @apply !top-auto !bottom-auto mt-[8.5rem];
          }
        }
      }
    }
  }
}
</style>
