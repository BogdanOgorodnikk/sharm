<template>
  <OurPage :back-route="backRouteParams" :title="$t('title.textileEdit')" width="md">
    <TextileForm v-if="isPrefilledForm" ref="textileForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.save')" @click="onSubmitForm" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToTextileList" />
    </template>

    <template #footer-right>
      <OurButton :text="$t('button.delete')" variant="thirdary" @click="onClickDeleteTextile" />
    </template>

    <DeleteModal v-model="isShownModal" :item="form" />
  </OurPage>
</template>

<script>
import { mapState, mapActions } from "vuex";
import TextileForm from "../_components/TextileForm";
import DeleteModal from "../delete/Modal";
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";
import OurDropdown from "@/components/OurDropdown";
import { createFormData } from "@/services/data.service";

export default {
  name: "TextileEdit",

  components: {
    OurDropdown,
    OurButton,
    OurPage,
    TextileForm,
    DeleteModal,
  },

  data() {
    return {
      form: {
        id: "",
        name: "",
      },
      isShownModal: false,
      isPrefilledForm: false,
    };
  },

  computed: {
    ...mapState("textile", ["textile"]),

    backRouteParams() {
      return {
        title: this.$t("title.textile"),
        name: "TextileList",
      };
    },
  },

  watch: {
    textile: {
      handler: "onChangeTextile",
      deep: true,
    },
  },

  async created() {
    const textileId = this.$route.params.id;

    await this.getTextile(textileId);
  },

  methods: {
    ...mapActions("textile", ["getTextile", "updateTextile"]),

    async onChangeTextile() {
      this.form.id = this.textile.id;
      this.form.name = this.textile.name;
      this.form.category = this.textile.category;
      this.form.file = [];

      if (this.textile.textile_image) {
        const fileSrc = `${process.env.VUE_APP_DOMAIN}/textile/${this.textile.name}/${this.textile.textile_image}`;

        const data = await fetch(fileSrc);
        const blob = await data.blob();
        const file = new File([blob], this.textile.textile_image);

        this.form.file = [{ file, imageUrl: fileSrc }];
      }

      this.isPrefilledForm = true;
    },

    onClickBackToTextileList() {
      this.$router.push({ name: "TextileList" });
    },

    async onSubmitForm() {
      this.$refs.textileForm.validate();

      if (this.form.isValid) {
        const data = {
          id: this.textile.id,
          name: this.form.name,
          category: this.form.category,
          file: this.form.file,
        };

        const formData = createFormData(data);

        await this.updateTextile({ textileId: this.textile.id, data: formData });

        await this.$router.push({ name: "TextileList" });
      }
    },

    onClickDeleteTextile() {
      this.isShownModal = true;
    },
  },
};
</script>
