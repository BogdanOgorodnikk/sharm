<template>
  <OurPage :back-route="backRouteParams" :title="$t('title.trailerAdd')" width="md">
    <TrailerForm ref="trailerForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.create')" @click="onSubmitForm" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToTrailerList" />
    </template>
  </OurPage>
</template>

<script>
import { mapActions } from "vuex";

import TrailerForm from "../_components/TrailerForm";
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";

export default {
  name: "TrailerAdd",

  components: {
    OurButton,
    OurPage,
    TrailerForm,
  },

  data() {
    return {
      form: {},
    };
  },

  computed: {
    backRouteParams() {
      return {
        title: this.$t("title.trailer"),
        name: "TrailerList",
      };
    },
  },

  methods: {
    ...mapActions("trailer", ["addTrailer"]),

    onClickBackToTrailerList() {
      this.$router.push({ name: "TrailerList" });
    },

    async onSubmitForm() {
      this.$refs.trailerForm.validate();

      if (this.form.isValid) {
        await this.addTrailer(this.form);

        await this.$router.push({ name: "TrailerList" });
      }
    },
  },
};
</script>
