<template>
  <OurCard>
    <OurInput
      v-model="form.brand"
      :label="$t('label.brand')"
      :placeholder="$t('placeholder.brand')"
      :error="brandError"
    />

    <OurInput
      v-model="form.model"
      :label="$t('label.model')"
      :placeholder="$t('placeholder.model')"
      :error="modelError"
    />

    <OurInput
      v-model="form.licensePlate"
      :label="$t('label.licensePlate')"
      :placeholder="$t('placeholder.licensePlate')"
      :error="licensePlateError"
    />

    <OurInput
      v-model="form.vinCode"
      :label="$t('label.vinCode')"
      :placeholder="$t('placeholder.vinCode')"
      :error="vinCodeError"
    />

    <OurInput
      v-model="form.year"
      :label="$t('label.year')"
      :placeholder="$t('placeholder.year')"
      :error="yearError"
    />

    <OurInput
      v-model="form.length"
      :label="$t('label.length')"
      :placeholder="$t('placeholder.length')"
      :error="lengthError"
    />

    <OurInput
      v-model="form.width"
      :label="$t('label.width')"
      :placeholder="$t('placeholder.width')"
      :error="widthError"
    />

    <OurInput
      v-model="form.height"
      :label="$t('label.height')"
      :placeholder="$t('placeholder.height')"
      :error="heightError"
    />

    <OurInput
      v-model="form.weight"
      :label="$t('label.weight')"
      :placeholder="$t('placeholder.weight')"
      :error="weightError"
    />

    <OurInput
      v-model="form.owner"
      :label="$t('label.owner')"
      :placeholder="$t('placeholder.owner')"
      :error="ownerError"
    />

    <OurInput
      v-model="form.taxNumber"
      :label="$t('label.taxNumber')"
      :placeholder="$t('placeholder.taxNumber')"
      :error="taxNumberError"
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
    };
  },

  validations: {
    form: {
      brand: { required },
      model: { required },
      licensePlate: { required },
      vinCode: { required },
      year: { required },
      length: { required },
      width: { required },
      height: { required },
      weight: { required },
      owner: { required },
      taxNumber: { required },
    },
  },

  computed: {
    brandError() {
      const isDirty = this.$v.form.brand.$dirty;
      const isFilled = this.$v.form.brand.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
    modelError() {
      const isDirty = this.$v.form.model.$dirty;
      const isFilled = this.$v.form.model.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
    licensePlateError() {
      const isDirty = this.$v.form.licensePlate.$dirty;
      const isFilled = this.$v.form.licensePlate.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
    vinCodeError() {
      const isDirty = this.$v.form.vinCode.$dirty;
      const isFilled = this.$v.form.vinCode.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
    yearError() {
      const isDirty = this.$v.form.year.$dirty;
      const isFilled = this.$v.form.year.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
    lengthError() {
      const isDirty = this.$v.form.length.$dirty;
      const isFilled = this.$v.form.length.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
    widthError() {
      const isDirty = this.$v.form.width.$dirty;
      const isFilled = this.$v.form.width.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
    heightError() {
      const isDirty = this.$v.form.height.$dirty;
      const isFilled = this.$v.form.height.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
    weightError() {
      const isDirty = this.$v.form.weight.$dirty;
      const isFilled = this.$v.form.weight.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
    ownerError() {
      const isDirty = this.$v.form.owner.$dirty;
      const isFilled = this.$v.form.owner.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
    taxNumberError() {
      const isDirty = this.$v.form.taxNumber.$dirty;
      const isFilled = this.$v.form.taxNumber.required;

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
