<template>
  <OurCard>
    <OurInput
      v-model="form.amount"
      validation-rule="number"
      :label="$t('label.amount')"
      placeholder="0"
      :error="amountError"
    />

    <OurSelect
      v-model="form.currency"
      :label="$t('label.currency')"
      :error="currencyError"
      :options="currencyForSelect"
      value-key="label"
    />

    <OurTextarea v-model="form.note" :label="$t('label.note')" />

    <OurSelect
      v-model="form.clientId"
      :label="$t('label.client')"
      :placeholder="$t('placeholder.client')"
      :error="clientError"
      :options="usersForSelect"
    />
  </OurCard>
</template>

<script>
import OurCard from "@/components/OurCard";
import OurInput from "@/components/form/OurInput";
import OurSelect from "@/components/OurSelect";
import { required } from "vuelidate/lib/validators";
import OurTextarea from "@/components/OurTextarea";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    OurTextarea,
    OurSelect,
    OurInput,
    OurCard,
  },

  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },

  data: () => ({
    form: {
      amount: "",
      currency: "₴",
      note: "",
      clientId: "",
    },
    currencyForSelect: [
      {
        label: "₴",
      },
      {
        label: "$",
      },
      {
        label: "€",
      },
    ],
  }),

  validations: {
    form: {
      amount: { required },
      currency: { required },
      clientId: { required },
    },
  },

  computed: {
    ...mapGetters("user", ["usersForSelect"]),

    amountError() {
      const isDirty = this.$v.form.amount.$dirty;
      const isFilled = this.$v.form.amount.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    currencyError() {
      const isDirty = this.$v.form.currency.$dirty;
      const isFilled = this.$v.form.currency.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    clientError() {
      const isDirty = this.$v.form.clientId.$dirty;
      const isFilled = this.$v.form.clientId.required;

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
    await this.getUsers();

    this.prefillForm();
  },

  methods: {
    ...mapActions("user", ["getUsers"]),

    prefillForm() {
      let clientId = this.value.clientId;

      if (this.$route.query.clientId) {
        clientId = Number(this.$route.query.clientId);
      }

      this.form = {
        amount: this.value.amount,
        currency: this.value.currency,
        note: this.value.note,
        clientId,
      };
    },

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
