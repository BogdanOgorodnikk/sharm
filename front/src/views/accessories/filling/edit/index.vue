<template>
  <OurPage :back-route="backRouteParams" :title="$t('title.fillingEdit')" width="md">
    <FillingForm ref="fillingForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.save')" @click="onSubmitForm" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToFillingList" />
    </template>

    <template #footer-right>
      <OurButton :text="$t('button.delete')" variant="thirdary" @click="onClickDeleteFilling" />
    </template>

    <DeleteModal v-model="isShownModal" :item="form" delay-success-notify />
  </OurPage>
</template>

<script>
import { mapState, mapActions } from "vuex";
import FillingForm from "../_components/FillingForm";
import DeleteModal from "../delete/Modal";
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";

export default {
  name: "FillingEdit",

  components: {
    OurButton,
    OurPage,
    FillingForm,
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
    ...mapState("filling", ["filling"]),

    backRouteParams() {
      return {
        title: this.$t("title.filling"),
        name: "FillingList",
      };
    },
  },

  watch: {
    filling: {
      handler: "onChangeFilling",
      deep: true,
    },
  },

  async created() {
    const fillingId = this.$route.params.id;

    await this.getFilling(fillingId);
  },

  methods: {
    ...mapActions("filling", ["getFilling", "updateFilling"]),

    onChangeFilling() {
      this.form.id = this.filling.id;
      this.form.name = this.filling.name;
    },

    onClickBackToFillingList() {
      this.$router.push({ name: "FillingList" });
    },

    async onSubmitForm() {
      this.$refs.fillingForm.validate();

      const filling = { id: this.filling.id, ...this.form };

      if (this.form.isValid) {
        await this.updateFilling(filling);

        await this.$router.push({ name: "FillingList" });
      }
    },

    onClickDeleteFilling() {
      this.isShownModal = true;
    },
  },
};
</script>
