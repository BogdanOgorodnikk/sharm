<template>
  <OurModal v-model="isShownModal" width="md" :title="$t('title.filter')">
    <OurCard>
      <OurDatePicker v-model="form.dateFrom" :label="$t('label.dateFrom')" />
      <OurDatePicker v-model="form.dateTo" :label="$t('label.dateTo')" />

      <OurMultiselect
        v-model="form.clientIds"
        :options="usersForSelect"
        :label="$t('label.client')"
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
        clientIds: [],
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
  },

  async created() {
    await this.getUsers();
  },

  methods: {
    ...mapActions("user", ["getUsers"]),

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
        clientIds: [],
      };

      this.$emit("update:activeFilter", this.form);

      this.isShownModal = false;
    },
  },
};
</script>
