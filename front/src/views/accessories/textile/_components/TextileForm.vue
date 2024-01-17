<template>
  <OurCard>
    <OurFileInput
      :label="$t('label.textileImage')"
      :allowed-file-types="['.png', '.jpg', '.jpeg']"
      :downloaded-files="form.file"
      :max-files="1"
      @changeFiles="onChangeFiles"
    />

    <OurInput
      v-model="form.name"
      :label="$t('label.name')"
      :placeholder="$t('placeholder.textileName')"
      :error="textileNameError"
    />

    <OurSelect
      v-model="form.category"
      :label="$t('label.category')"
      :options="categoryOptions"
      :error="textileCategoryError"
      value-key="label"
    />
  </OurCard>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import OurCard from "@/components/OurCard";
import OurInput from "@/components/form/OurInput";
import OurFileInput from "@/components/OurUppload";
import OurSelect from "@/components/OurSelect";

export default {
  components: { OurSelect, OurFileInput, OurInput, OurCard },

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
        category: "",
        file: [],
      },
      categoryOptions: [
        {
          label: 0,
        },
        {
          label: 1,
        },
        {
          label: 2,
        },
        {
          label: 3,
        },
        {
          label: 4,
        },
        {
          label: 5,
        },
      ],
    };
  },

  validations: {
    form: {
      name: { required },
      category: { required },
    },
  },

  computed: {
    textileNameError() {
      const isDirty = this.$v.form.name.$dirty;
      const isFilled = this.$v.form.name.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    textileCategoryError() {
      const isDirty = this.$v.form.category.$dirty;
      const isFilled = this.$v.form.category.required;

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
    this.prefillForm();
  },

  methods: {
    prefillForm() {
      this.form.name = this.value.name;
      this.form.category = this.value.category;
      this.form.file = this.value.file ? [...this.value.file] : [];
    },

    onChangeForm(form) {
      form.isValid = !this.$v.$invalid;

      this.$emit("input", form);
    },

    onChangeFiles(files) {
      const [selectedFile] = files;

      this.form.file = selectedFile;
    },

    validate() {
      this.$v.$touch();
    },
  },
};
</script>
