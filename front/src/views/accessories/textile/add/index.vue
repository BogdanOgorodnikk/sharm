<template>
  <OurPage :back-route="backRouteParams" :title="$t('title.textileAdd')" width="md">
    <TextileForm ref="textileForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.create')" @click="onSubmitForm" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToTextileList" />
    </template>
  </OurPage>
</template>

<script>
import { mapActions } from "vuex";

import TextileForm from "../_components/TextileForm";
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";
import { createFormData } from "@/services/data.service";

export default {
  name: "TextileAdd",

  components: {
    OurButton,
    OurPage,
    TextileForm,
  },

  data() {
    return {
      form: {},
    };
  },

  computed: {
    backRouteParams() {
      return {
        title: this.$t("title.textile"),
        name: "TextileList",
      };
    },
  },

  methods: {
    ...mapActions("textile", ["addTextile"]),

    onClickBackToTextileList() {
      this.$router.push({ name: "TextileList" });
    },

    async onSubmitForm() {
      this.$refs.textileForm.validate();

      if (this.form.isValid) {
        const data = {
          name: this.form.name,
          category: this.form.category,
          file: this.form.file,
        };

        const formData = createFormData(data);

        await this.addTextile(formData);

        await this.$router.push({ name: "TextileList" });
      }
    },
  },
};
</script>
