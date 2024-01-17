<template>
  <OurPage :title="$t('title.prices')">
    <template #header-right>
      <OurButton v-if="isMobileDevice" size="sm" @click="onClickOpenAddPricePage">
        <template #icon-left>
          <OurSvgIcon size="sm" class="add-button-icon" name="Plus2" color="white" />
        </template>
      </OurButton>

      <OurButton
        v-else
        size="sm"
        :text="$t('button.createPrice')"
        @click="onClickOpenAddPricePage"
      />
    </template>

    <OurTable selectable :headers="tableHeaders" :items.sync="tableItems" @clickRow="onClickRow">
      <template #thead-actions="{ selectedRows }">
        <OurButton
          size="sm"
          variant="thirdary"
          :text="$t('button.delete')"
          @click="onClickDeleteTextile(selectedRows)"
        />
      </template>

      <template #cell-retail="{ value }">
        <OurCheckbox :value="value.value" @click.stop.native="onClickSetRetailPrice(value.id)" />
      </template>

      <template #cell-download="{ value }">
        <OurLink
          class="prices-download-button"
          :text="value"
          variant="secondary"
          dashed
          size="xs"
        />
      </template>
    </OurTable>

    <DeleteModal v-model="isShownModal" :selected-rows="selectedRows" :items="tableItems" />
  </OurPage>
</template>

<script>
import OurPage from "@/components/OurPage";
import OurTable from "@/components/OurTable";
import OurButton from "@/components/OurButton";
import OurSvgIcon from "@/components/OurSvgIcon";
import { mapActions, mapGetters, mapState } from "vuex";
import OurLink from "@/components/OurButtonLink";
import DeleteModal from "../delete/MassModal";
import OurCheckbox from "@/components/OurCheckbox";

export default {
  components: {
    OurCheckbox,
    OurLink,
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
          value: "name",
          text: this.$t("label.name"),
          tdClass: "",
          thClass: "",
        },
        {
          value: "currency",
          text: this.$t("label.currency"),
          tdClass: "",
          thClass: "",
        },
        {
          value: "date",
          text: this.$t("label.from"),
          tdClass: "",
          thClass: "",
        },
        {
          value: "retail",
          text: this.$t("label.retailPrice"),
          tdClass: "",
          thClass: "",
        },
        {
          value: "download",
          text: this.$t("label.download"),
          tdClass: "text-right",
          thClass: "text-right",
        },
      ],
      tableItems: [],
      isShownModal: false,
      selectedRows: [],
      updatedItemId: "",
    };
  },

  computed: {
    ...mapState("prices", ["prices"]),
    ...mapGetters("breakpoint", ["isMobileDevice"]),
  },

  watch: {
    prices: {
      handler: "onChangePrices",
      deep: true,
      immediate: true,
    },
  },

  async created() {
    await this.getPrices();
  },

  methods: {
    ...mapActions("prices", ["getPrices", "setRetailPrice"]),

    async onClickSetRetailPrice(priceId) {
      this.updatedItemId = priceId;

      await this.setRetailPrice(priceId);
    },

    onClickRow(row) {
      this.$router.push({ name: "PricesEdit", params: { id: row.id } });
    },

    onChangePrices() {
      this.tableItems = this.prices.map((item) => {
        return {
          isChecked: false,
          id: item.id,
          name: item.name,
          currency: item.currency,
          date: item.from_date,
          retail: {
            value:
              this.updatedItemId === item.id
                ? item.isRetail
                : this.updatedItemId
                ? false
                : item.isRetail,
            id: item.id,
          },
          download: this.$t("label.download"),
        };
      });
    },

    onClickOpenAddPricePage() {
      this.$router.push({ name: "PricesAdd" });
    },

    onClickDeleteTextile(selectedRows) {
      this.selectedRows = [...selectedRows];
      this.isShownModal = true;
    },
  },
};
</script>

<style lang="postcss" scoped>
.prices {
  &-header {
    @apply flex space-x-4;
    @apply mb-6;
  }

  &-download-button {
    &::v-deep {
      button {
        @apply lowercase;
      }
    }
  }
}
</style>
