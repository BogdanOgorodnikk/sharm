<template>
  <OurModal v-model="isShownModal" width="md" :title="$t('title.filter')">
    <OurCard>
      <OurDatePicker v-model="form.dateFrom" :label="$t('label.dateFrom')" />
      <OurDatePicker v-model="form.dateTo" :label="$t('label.dateTo')" />

      <OurSelect
        v-model="form.region"
        value-key="label"
        :options="regionOptions"
        :label="$t('label.region')"
      />

      <OurMultiselect
        v-model="form.towns"
        :options="townOptions"
        value-key="label"
        :label="$t('label.town')"
      />

      <OurMultiselect
        v-model="form.clientIds"
        :options="usersForSelect"
        :label="$t('label.client')"
      />

      <OurMultiselect
        v-model="form.statuses"
        :options="statusesForSelect"
        :label="$t('label.status')"
        value-key="code"
      />
    </OurCard>

    <template #footer-left>
      <OurButton :text="$t('button.find')" @click="onSubmitForm" />

      <OurButton :text="$t('button.close')" variant="secondary" @click="onClickCloseModal" />
    </template>

    <template #footer-right>
      <OurButton variant="thirdary" :text="$t('button.reset')" @click="onClickResetFilters" />
    </template>
  </OurModal>
</template>

<script>
import OurModal from "@/components/OurModal";
import OurButton from "@/components/OurButton";
import OurCard from "@/components/OurCard";
import OurMultiselect from "@/components/OurSelectMulti";
import { mapActions, mapGetters } from "vuex";
import OurDatePicker from "@/components/OurDatepicker";
import { ORDER_CODES } from "@/api/orders";
import { getTowns, REGIONS_CODE } from "@/api/town";
import OurSelect from "@/components/OurSelect";

export default {
  components: {
    OurSelect,
    OurDatePicker,
    OurMultiselect,
    OurCard,
    OurButton,
    OurModal,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    activeFilter: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      townOptions: [],
      form: {
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
    ...mapGetters("user", ["usersForSelect"]),

    isShownModal: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },

    regionOptions() {
      return REGIONS_CODE;
    },

    statusesForSelect() {
      return [
        {
          code: ORDER_CODES.cancel,
          label: this.$t("label.orderCodes.cancel"),
        },
        {
          code: ORDER_CODES.expected,
          label: this.$t("label.orderCodes.expected"),
        },
        {
          code: ORDER_CODES.inProgress,
          label: this.$t("label.orderCodes.inProgress"),
        },
        {
          code: ORDER_CODES.finished,
          label: this.$t("label.orderCodes.finished"),
        },
      ];
    },
  },

  watch: {
    "form.region": {
      handler: "onChangeRegion",
      deep: true,
    },
  },

  async created() {
    await this.getUsers();
  },

  methods: {
    ...mapActions("user", ["getUsers"]),

    async onChangeRegion() {
      this.form.towns = [];
      this.townOptions = await getTowns(this.form.region);
    },

    onClickCloseModal() {
      this.isShownModal = false;
    },

    onSubmitForm() {
      const data = {
        ...this.form,
      };

      this.$emit("update:activeFilter", data);

      this.isShownModal = false;
    },

    onClickResetFilters() {
      this.form = {
        dateFrom: "",
        dateTo: "",
        regions: [],
        towns: [],
        clientIds: [],
        statuses: [],
      };

      this.$emit("update:activeFilter", this.form);

      this.isShownModal = false;
    },
  },
};
</script>
