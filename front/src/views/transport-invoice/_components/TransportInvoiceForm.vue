<template>
  <OurCard>
    <OurInput v-model="customer.name" :label="$t('label.customer')" disabled />

    <OurSelect
      v-model="form.carId"
      :label="$t('label.car')"
      :placeholder="$t('placeholder.car')"
      :error="carError"
      :options="carsForSelect"
    />

    <OurSelect
      v-model="form.trailerId"
      :label="$t('label.trailer')"
      :placeholder="$t('placeholder.trailer')"
      :options="trailersForSelect"
    />

    <OurSelect
      v-model="form.driverId"
      :label="$t('label.driver')"
      :placeholder="$t('placeholder.driver')"
      :error="driverError"
      :options="driversForSelect"
    />

    <OurInput
      v-model="form.unloadingPlace"
      :label="$t('label.unloadingPlace')"
      :placeholder="$t('placeholder.unloadingPlace')"
      :error="unloadingPlaceError"
    />
  </OurCard>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import OurCard from "@/components/OurCard";
import OurInput from "@/components/form/OurInput";
import OurSelect from "@/components/OurSelect";
import { mapActions, mapGetters } from "vuex";
import { getOrder } from "@/api/orders";
import { getUser } from "@/api/user";

export default {
  components: { OurSelect, OurInput, OurCard },

  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      customer: {},
      order: {},
      form: {
        carId: "",
        trailerId: "",
        driverId: "",
        customerId: "",
        unloadingPlace: "",
      },
    };
  },

  validations: {
    form: {
      carId: { required },
      driverId: { required },
      unloadingPlace: { required },
    },
  },

  computed: {
    ...mapGetters("car", ["carsForSelect"]),
    ...mapGetters("trailer", ["trailersForSelect"]),
    ...mapGetters("driver", ["driversForSelect"]),

    carError() {
      const isDirty = this.$v.form.carId.$dirty;
      const isFilled = this.$v.form.carId.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
    driverError() {
      const isDirty = this.$v.form.driverId.$dirty;
      const isFilled = this.$v.form.driverId.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
    unloadingPlaceError() {
      const isDirty = this.$v.form.unloadingPlace.$dirty;
      const isFilled = this.$v.form.unloadingPlace.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
  },

  watch: {
    form: {
      handler: "onChangeForm",
      deep: true,
    },
  },

  async created() {
    this.form = this.value;

    await Promise.all([this.getCars(), this.getTrailers(), this.getDrivers()]);

    this.order = await getOrder(this.$route.params.orderId);
    this.customer = await getUser(this.order.client_id);

    this.form = {
      ...this.form,
      unloadingPlace: this.form.unloadingPlace
        ? this.form.unloadingPlace
        : this.customer.deliveryPlace,
      customerId: this.order.client_id,
    };
  },

  methods: {
    ...mapActions("car", ["getCars"]),
    ...mapActions("trailer", ["getTrailers"]),
    ...mapActions("driver", ["getDrivers"]),

    onChangeForm(form) {
      form.isValid = !this.$v.$invalid;

      this.$emit("input", form);
    },

    validate() {
      this.$v.$touch();
    },
  },
};
</script>
