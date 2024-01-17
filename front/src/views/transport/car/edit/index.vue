<template>
  <OurPage :back-route="backRouteParams" :title="$t('title.carEdit')" width="md">
    <CarForm ref="carForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.save')" @click="onSubmitForm" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToCarList" />
    </template>

    <template #footer-right>
      <OurButton :text="$t('button.delete')" variant="thirdary" @click="onClickDeleteCar" />
    </template>

    <DeleteModal v-model="isShownModal" :item="form" delay-success-notify />
  </OurPage>
</template>

<script>
import { mapState, mapActions } from "vuex";
import CarForm from "../_components/CarForm";
import DeleteModal from "../delete/Modal";
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";

export default {
  name: "CarEdit",

  components: {
    OurButton,
    OurPage,
    CarForm,
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
        owner: "",
        taxNumber: "",
      },
      isShownModal: false,
    };
  },

  computed: {
    ...mapState("car", ["car"]),

    backRouteParams() {
      return {
        title: this.$t("title.car"),
        name: "CarList",
      };
    },
  },

  watch: {
    car: {
      handler: "onChangeCar",
      deep: true,
    },
  },

  async created() {
    const carId = this.$route.params.id;

    await this.getCar(carId);
  },

  methods: {
    ...mapActions("car", ["getCar", "updateCar"]),

    onChangeCar() {
      this.form.id = this.car.id;
      this.form.brand = this.car.brand;
      this.form.model = this.car.model;
      this.form.licensePlate = this.car.license_plate;
      this.form.vinCode = this.car.vin_code;
      this.form.year = this.car.year_create;
      this.form.length = this.car.length;
      this.form.width = this.car.width;
      this.form.height = this.car.height;
      this.form.weight = this.car.weight;
      this.form.owner = this.car.owner;
      this.form.taxNumber = this.car.tax_number;
    },

    onClickBackToCarList() {
      this.$router.push({ name: "CarList" });
    },

    async onSubmitForm() {
      this.$refs.carForm.validate();

      const car = { id: this.car.id, ...this.form };

      if (this.form.isValid) {
        await this.updateCar(car);

        await this.$router.push({ name: "CarList" });
      }
    },

    onClickDeleteCar() {
      this.isShownModal = true;
    },
  },
};
</script>
