<template>
  <OurPage width="lg" :title="$t('title.profile')">
    <OurCard>
      <OurInput
        v-model="form.name"
        :label="$t('label.companyName')"
        :placeholder="$t('placeholder.companyName')"
        :error="nameError"
      />

      <OurInput
        v-model="form.email"
        :label="$t('label.email')"
        :placeholder="$t('placeholder.email')"
        disabled
      />

      <OurPhoneInput
        v-model="form.phone"
        :label="$t('label.phone')"
        :placeholder="$t('placeholder.phone')"
        :error="phoneError"
      />

      <OurInput
        v-model="form.region"
        :label="$t('label.region')"
        :placeholder="$t('placeholder.region')"
        disabled
      />

      <OurInput
        v-model="form.town"
        :label="$t('label.town')"
        :placeholder="$t('placeholder.town')"
        disabled
      />

      <OurInput
        v-model="form.deliveryPlace"
        :label="$t('label.deliveryPlace')"
        :placeholder="$t('placeholder.deliveryPlace')"
      />

      <OurSelect
        v-model="form.language"
        :label="$t('label.language')"
        :placeholder="$t('placeholder.language')"
        value-key="code"
        :error="languageError"
        :options="languages"
      />
    </OurCard>

    <template #footer-left>
      <OurButton :text="$t('button.save')" @click="onSubmitForm" />
    </template>

    <template #footer-right>
      <OurButton
        :text="$t('button.changePassword')"
        variant="secondary"
        @click="onClickOpenChangePassPage"
      />
    </template>
  </OurPage>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { required } from "vuelidate/lib/validators";
import { phoneMaxLength, phoneMinLength, clearPhone } from "@/services/validate.service";
import i18nService from "@/services/i18n.service";

import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";
import OurCard from "@/components/OurCard";
import OurInput from "@/components/form/OurInput";
import OurPhoneInput from "@/components/OurPhoneInput";
import OurSelect from "@/components/OurSelect";

export default {
  components: {
    OurSelect,
    OurPhoneInput,
    OurInput,
    OurCard,
    OurButton,
    OurPage,
  },

  data: () => ({
    form: {
      name: "",
      email: "",
      phone: "",
      region: "",
      town: "",
      deliveryPlace: "",
      language: "",
    },
  }),

  validations: {
    form: {
      name: { required },
      phone: { required, phoneMinLength, phoneMaxLength },
      language: { required },
    },
  },

  computed: {
    ...mapState("user", ["user"]),

    ...mapGetters("user", ["languages"]),

    nameError() {
      const isDirty = this.$v.form.name.$dirty;
      const isFilled = this.$v.form.name.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    phoneError() {
      const isDirty = this.$v.form.phone.$dirty;
      const isFilled = this.$v.form.phone.required;
      const isMinLength = this.$v.form.phone.phoneMinLength;
      const isMaxLength = this.$v.form.phone.phoneMaxLength;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      } else if (isDirty && !isMinLength) {
        error = this.$t("validation.phoneLength");
      } else if (isDirty && !isMaxLength) {
        error = this.$t("validation.phoneLength");
      }

      return error;
    },

    languageError() {
      const isDirty = this.$v.form.language.$dirty;
      const isFilled = this.$v.form.language.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
  },

  async created() {
    await this.getUserProfile();

    this.prefillForm();
  },

  methods: {
    ...mapActions("user", ["getUserProfile", "updateUserProfile"]),

    prefillForm() {
      const activeLanguage = this.languages.find(
        (language) => language.code === i18nService.getActiveLanguage()
      );

      this.form = {
        name: this.user.name,
        email: this.user.email,
        phone: this.user.phone,
        region: this.user.region,
        town: this.user.town,
        deliveryPlace: this.user.deliveryPlace,
        language: activeLanguage.code,
      };
    },

    async onSubmitForm() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      this.form.phone = `+${clearPhone(this.form.phone)}`;

      const formData = {
        name: this.form.name,
        phone: this.form.phone,
        delivery_place: this.form.deliveryPlace,
      };

      await this.updateUserProfile(formData);

      if (this.form.language !== i18nService.getActiveLanguage()) {
        i18nService.setActiveLanguage(this.form.language);

        window.location.reload();
      }
    },

    onClickOpenChangePassPage() {
      this.$router.push({ name: "ChangePassword" });
    },
  },
};
</script>
