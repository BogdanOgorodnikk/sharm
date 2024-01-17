<template>
  <OurPage :back-route="backRouteParams" :title="$t('title.frameAdd')" width="md">
    <FrameForm ref="frameForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.create')" @click="onSubmitForm" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToFrameList" />
    </template>
  </OurPage>
</template>

<script>
import { mapActions } from "vuex";

import FrameForm from "../_components/FrameForm";
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";

export default {
  name: "FrameAdd",

  components: {
    OurButton,
    OurPage,
    FrameForm,
  },

  data() {
    return {
      form: {},
    };
  },

  computed: {
    backRouteParams() {
      return {
        title: this.$t("title.frame"),
        name: "FrameList",
      };
    },
  },

  methods: {
    ...mapActions("frame", ["addFrame"]),

    onClickBackToFrameList() {
      this.$router.push({ name: "FrameList" });
    },

    async onSubmitForm() {
      this.$refs.frameForm.validate();

      if (this.form.isValid) {
        await this.addFrame(this.form);

        await this.$router.push({ name: "FrameList" });
      }
    },
  },
};
</script>
