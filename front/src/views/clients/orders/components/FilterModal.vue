<template>
  <OurModal v-model="isShownModal" width="md" :title="$t('title.filter')">
    <OurCard>
      <OurDatePicker v-model="form.dateFrom" :label="$t('label.dateFrom')" />
      <OurDatePicker v-model="form.dateTo" :label="$t('label.dateTo')" />

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
import OurDatePicker from "@/components/OurDatepicker";
import { ORDER_CODES } from "@/api/orders";

export default {
  components: {
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
      form: {
        dateFrom: "",
        dateTo: "",
        statuses: [],
      },
    };
  },

  computed: {
    isShownModal: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
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

  methods: {
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
        statuses: [],
      };

      this.$emit("update:activeFilter", this.form);

      this.isShownModal = false;
    },
  },
};
</script>
