<template>
  <OurPage :back-route="backRouteParams" :title="$t('title.driverEdit')" width="md">
    <DriverForm ref="driverForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.save')" @click="onSubmitForm" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToDriverList" />
    </template>

    <template #footer-right>
      <OurButton :text="$t('button.delete')" variant="thirdary" @click="onClickDeleteDriver" />
    </template>

    <DeleteModal v-model="isShownModal" :item="form" delay-success-notify />
  </OurPage>
</template>

<script>
import { mapState, mapActions } from "vuex";
import DriverForm from "../_components/DriverForm";
import DeleteModal from "../delete/Modal";
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";

export default {
  name: "DriverEdit",

  components: {
    OurButton,
    OurPage,
    DriverForm,
    DeleteModal,
  },

  data() {
    return {
      form: {
        id: "",
        fullName: "",
        driverLicenseNumber: "",
      },
      isShownModal: false,
    };
  },

  computed: {
    ...mapState("driver", ["driver"]),

    backRouteParams() {
      return {
        title: this.$t("title.driver"),
        name: "DriverList",
      };
    },
  },

  watch: {
    driver: {
      handler: "onChangeDriver",
      deep: true,
    },
  },

  async created() {
    const driverId = this.$route.params.id;

    await this.getDriver(driverId);
  },

  methods: {
    ...mapActions("driver", ["getDriver", "updateDriver"]),

    onChangeDriver() {
      this.form.id = this.driver.id;
      this.form.fullName = this.driver.full_name;
      this.form.driverLicenseNumber = this.driver.driver_license_number;
    },

    onClickBackToDriverList() {
      this.$router.push({ name: "DriverList" });
    },

    async onSubmitForm() {
      this.$refs.driverForm.validate();

      const driver = { id: this.driver.id, ...this.form };

      if (this.form.isValid) {
        await this.updateDriver(driver);

        await this.$router.push({ name: "DriverList" });
      }
    },

    onClickDeleteDriver() {
      this.isShownModal = true;
    },
  },
};
</script>
