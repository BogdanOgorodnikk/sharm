<template>
  <OurPage :back-route="backRouteParams" :title="$t('title.carAdd')" width="md">
    <CarForm ref="carForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.create')" @click="onSubmitForm" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToCarList" />
    </template>
  </OurPage>
</template>

<script>
import { mapActions } from "vuex";

import CarForm from "../_components/CarForm";
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";

export default {
  name: "CarAdd",

  components: {
    OurButton,
    OurPage,
    CarForm,
  },

  data() {
    return {
      form: {},
    };
  },

  computed: {
    backRouteParams() {
      return {
        title: this.$t("title.car"),
        name: "CarList",
      };
    },
  },

  methods: {
    ...mapActions("car", ["addCar"]),

    onClickBackToCarList() {
      this.$router.push({ name: "CarList" });
    },

    async onSubmitForm() {
      this.$refs.carForm.validate();

      if (this.form.isValid) {
        await this.addCar(this.form);

        await this.$router.push({ name: "CarList" });
      }
    },
  },
};
</script>
