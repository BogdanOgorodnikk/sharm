<template>
  <OurPage :back-route="backRouteParams" :title="$t('title.trailerEdit')" width="md">
    <TrailerForm ref="trailerForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.save')" @click="onSubmitForm" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToTrailerList" />
    </template>

    <template #footer-right>
      <OurButton :text="$t('button.delete')" variant="thirdary" @click="onClickDeleteTrailer" />
    </template>

    <DeleteModal v-model="isShownModal" :item="form" delay-success-notify />
  </OurPage>
</template>

<script>
import { mapState, mapActions } from "vuex";
import TrailerForm from "../_components/TrailerForm";
import DeleteModal from "../delete/Modal";
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";

export default {
  name: "TrailerEdit",

  components: {
    OurButton,
    OurPage,
    TrailerForm,
    DeleteModal,
  },

  data() {
    return {
      form: {
        id: "",
        brand: "",
        model: "",
        licensePlate: "",
        vinCode: "",
        year: "",
        length: "",
        width: "",
        height: "",
        weight: "",
      },
      isShownModal: false,
    };
  },

  computed: {
    ...mapState("trailer", ["trailer"]),

    backRouteParams() {
      return {
        title: this.$t("title.trailer"),
        name: "TrailerList",
      };
    },
  },

  watch: {
    trailer: {
      handler: "onChangeTrailer",
      deep: true,
    },
  },

  async created() {
    const trailerId = this.$route.params.id;

    await this.getTrailer(trailerId);
  },

  methods: {
    ...mapActions("trailer", ["getTrailer", "updateTrailer"]),

    onChangeTrailer() {
      this.form.id = this.trailer.id;
      this.form.brand = this.trailer.brand;
      this.form.model = this.trailer.model;
      this.form.licensePlate = this.trailer.license_plate;
      this.form.vinCode = this.trailer.vin_code;
      this.form.year = this.trailer.year_create;
      this.form.length = this.trailer.length;
      this.form.width = this.trailer.width;
      this.form.height = this.trailer.height;
      this.form.weight = this.trailer.weight;
    },

    onClickBackToTrailerList() {
      this.$router.push({ name: "TrailerList" });
    },

    async onSubmitForm() {
      this.$refs.trailerForm.validate();

      const trailer = { id: this.trailer.id, ...this.form };

      if (this.form.isValid) {
        await this.updateTrailer(trailer);

        await this.$router.push({ name: "TrailerList" });
      }
    },

    onClickDeleteTrailer() {
      this.isShownModal = true;
    },
  },
};
</script>
