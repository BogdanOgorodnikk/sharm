<template>
  <OurPage :back-route="backRouteParams" :title="$t('title.frameEdit')" width="md">
    <FrameForm ref="frameForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.save')" @click="onSubmitForm" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToFrameList" />
    </template>

    <template #footer-right>
      <OurButton :text="$t('button.delete')" variant="thirdary" @click="onClickDeleteFrame" />
    </template>

    <DeleteModal v-model="isShownModal" :item="form" delay-success-notify />
  </OurPage>
</template>

<script>
import { mapState, mapActions } from "vuex";
import FrameForm from "../_components/FrameForm";
import DeleteModal from "../delete/Modal";
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";
import OurDropdown from "@/components/OurDropdown";

export default {
  name: "FrameEdit",

  components: {
    OurDropdown,
    OurButton,
    OurPage,
    FrameForm,
    DeleteModal,
  },

  data() {
    return {
      form: {
        id: "",
        name: "",
      },
      isShownModal: false,
    };
  },

  computed: {
    ...mapState("frame", ["frame"]),

    backRouteParams() {
      return {
        title: this.$t("title.frame"),
        name: "FrameList",
      };
    },
  },

  watch: {
    frame: {
      handler: "onChangeFrame",
      deep: true,
    },
  },

  async created() {
    const frameId = this.$route.params.id;

    await this.getFrame(frameId);
  },

  methods: {
    ...mapActions("frame", ["getFrame", "updateFrame"]),

    onChangeFrame() {
      this.form.id = this.frame.id;
      this.form.name = this.frame.name;
    },

    onClickBackToFrameList() {
      this.$router.push({ name: "FrameList" });
    },

    async onSubmitForm() {
      this.$refs.frameForm.validate();

      const frame = { id: this.frame.id, ...this.form };

      if (this.form.isValid) {
        await this.updateFrame(frame);

        await this.$router.push({ name: "FrameList" });
      }
    },

    onClickDeleteFrame() {
      this.isShownModal = true;
    },
  },
};
</script>
