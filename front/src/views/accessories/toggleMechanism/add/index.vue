<template>
  <OurPage :back-route="backRouteParams" :title="$t('title.toggleMechanismAdd')" width="md">
    <ToggleMechanismForm ref="toggleMechanismForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.create')" @click="onSubmitForm" />

      <OurButton
        :text="$t('button.back')"
        variant="secondary"
        @click="onClickBackToToggleMechanismList"
      />
    </template>
  </OurPage>
</template>

<script>
import { mapActions } from "vuex";

import ToggleMechanismForm from "../_components/ToggleMechanismForm";
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";

export default {
  name: "ToggleMechanismAdd",

  components: {
    OurButton,
    OurPage,
    ToggleMechanismForm,
  },

  data() {
    return {
      form: {},
    };
  },

  computed: {
    backRouteParams() {
      return {
        title: this.$t("title.toggleMechanism"),
        name: "ToggleMechanismList",
      };
    },
  },

  methods: {
    ...mapActions("toggleMechanism", ["addToggleMechanism"]),

    onClickBackToToggleMechanismList() {
      this.$router.push({ name: "ToggleMechanismList" });
    },

    async onSubmitForm() {
      this.$refs.toggleMechanismForm.validate();

      if (this.form.isValid) {
        await this.addToggleMechanism(this.form);

        await this.$router.push({ name: "ToggleMechanismList" });
      }
    },
  },
};
</script>
