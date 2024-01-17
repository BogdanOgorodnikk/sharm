<template>
  <OurPage :back-route="backRouteParams" :title="$t('title.toggleMechanismEdit')" width="md">
    <ToggleMechanismForm ref="toggleMechanismForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.save')" @click="onSubmitForm" />

      <OurButton
        :text="$t('button.back')"
        variant="secondary"
        @click="onClickBackToToggleMechanismList"
      />
    </template>

    <template #footer-right>
      <OurButton
        :text="$t('button.delete')"
        variant="thirdary"
        @click="onClickDeleteToggleMechanism"
      />
    </template>

    <DeleteModal v-model="isShownModal" :item="form" delay-success-notify />
  </OurPage>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ToggleMechanismForm from "../_components/ToggleMechanismForm";
import DeleteModal from "../delete/Modal";
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";

export default {
  name: "ToggleMechanismEdit",

  components: {
    OurButton,
    OurPage,
    ToggleMechanismForm,
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
    ...mapState("toggleMechanism", ["toggleMechanism"]),

    backRouteParams() {
      return {
        title: this.$t("title.toggleMechanism"),
        name: "ToggleMechanismList",
      };
    },
  },

  watch: {
    toggleMechanism: {
      handler: "onChangeToggleMechanism",
      deep: true,
    },
  },

  async created() {
    const toggleMechanismId = this.$route.params.id;

    await this.getToggleMechanism(toggleMechanismId);
  },

  methods: {
    ...mapActions("toggleMechanism", ["getToggleMechanism", "updateToggleMechanism"]),

    onChangeToggleMechanism() {
      this.form.id = this.toggleMechanism.id;
      this.form.name = this.toggleMechanism.name;
    },

    onClickBackToToggleMechanismList() {
      this.$router.push({ name: "ToggleMechanismList" });
    },

    async onSubmitForm() {
      this.$refs.toggleMechanismForm.validate();

      const toggleMechanism = { id: this.toggleMechanism.id, ...this.form };

      if (this.form.isValid) {
        await this.updateToggleMechanism(toggleMechanism);

        await this.$router.push({ name: "ToggleMechanismList" });
      }
    },

    onClickDeleteToggleMechanism() {
      this.isShownModal = true;
    },
  },
};
</script>
