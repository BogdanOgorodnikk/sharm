<template>
  <OurCard>
    <OurInput
      v-model="form.name"
      :label="$t('label.name')"
      :placeholder="$t('placeholder.fillingName')"
      :error="fillingNameError"
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
        name: "",
      },
    };
  },

  validations: {
    form: {
      name: { required },
    },
  },

  computed: {
    fillingNameError() {
      const isDirty = this.$v.form.name.$dirty;
      const isFilled = this.$v.form.name.required;

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
