<template>
  <OurCard>
    <OurInput
      v-model="form.fullName"
      :label="$t('label.fullName')"
      :placeholder="$t('placeholder.fullName')"
      :error="fullNameError"
    />

    <OurInput
      v-model="form.driverLicenseNumber"
      :label="$t('label.driverLicenseNumber')"
      :placeholder="$t('placeholder.driverLicenseNumber')"
      :error="driverLicenseNumberError"
    />
  </OurCard>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import OurCard from "@/components/OurCard";
import OurInput from "@/components/form/OurInput";

export default {
  components: { OurInput, OurCard },

  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      form: {
        fullName: "",
        driverLicenseNumber: "",
      },
    };
  },

  validations: {
    form: {
      fullName: { required },
      driverLicenseNumber: { required },
    },
  },

  computed: {
    fullNameError() {
      const isDirty = this.$v.form.fullName.$dirty;
      const isFilled = this.$v.form.fullName.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
    driverLicenseNumberError() {
      const isDirty = this.$v.form.driverLicenseNumber.$dirty;
      const isFilled = this.$v.form.driverLicenseNumber.required;

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

  created() {
    this.form = this.value;
  },

  methods: {
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
