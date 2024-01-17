<template>
  <OurPage :back-route="backRouteParams" :title="$t('title.fillingAdd')" width="md">
    <FillingForm ref="fillingForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.create')" @click="onSubmitForm" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToFillingList" />
    </template>
  </OurPage>
</template>

<script>
import { mapActions } from "vuex";

import FillingForm from "../_components/FillingForm";
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";

export default {
  name: "FillingAdd",

  components: {
    OurButton,
    OurPage,
    FillingForm,
  },

  data() {
    return {
      form: {},
    };
  },

  computed: {
    backRouteParams() {
      return {
        title: this.$t("title.filling"),
        name: "FillingList",
      };
    },
  },

  methods: {
    ...mapActions("filling", ["addFilling"]),

    onClickBackToFillingList() {
      this.$router.push({ name: "FillingList" });
    },

    async onSubmitForm() {
      this.$refs.fillingForm.validate();

      if (this.form.isValid) {
        await this.addFilling(this.form);

        await this.$router.push({ name: "FillingList" });
      }
    },
  },
};
</script>
