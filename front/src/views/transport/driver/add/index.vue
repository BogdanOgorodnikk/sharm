<template>
  <OurPage :back-route="backRouteParams" :title="$t('title.driverAdd')" width="md">
    <DriverForm ref="driverForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.create')" @click="onSubmitForm" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToDriverList" />
    </template>
  </OurPage>
</template>

<script>
import { mapActions } from "vuex";

import DriverForm from "../_components/DriverForm";
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";

export default {
  name: "DriverAdd",

  components: {
    OurButton,
    OurPage,
    DriverForm,
  },

  data() {
    return {
      form: {},
    };
  },

  computed: {
    backRouteParams() {
      return {
        title: this.$t("title.driver"),
        name: "DriverList",
      };
    },
  },

  methods: {
    ...mapActions("driver", ["addDriver"]),

    onClickBackToDriverList() {
      this.$router.push({ name: "DriverList" });
    },

    async onSubmitForm() {
      this.$refs.driverForm.validate();

      if (this.form.isValid) {
        await this.addDriver(this.form);

        await this.$router.push({ name: "DriverList" });
      }
    },
  },
};
</script>
