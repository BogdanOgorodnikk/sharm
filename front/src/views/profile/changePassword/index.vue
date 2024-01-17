<template>
  <OurPage width="lg" :title="$t('title.changePassword')">
    <OurCard>
      <OurInput
        v-model="form.currentPassword"
        :label="$t('label.currentPassword')"
        :placeholder="$t('placeholder.currentPassword')"
        type="password"
        :error="currentPasswordError"
      />

      <OurInput
        v-model="form.newPassword"
        :label="$t('label.newPassword')"
        :placeholder="$t('placeholder.newPassword')"
        type="password"
        :error="newPasswordError"
      />
    </OurCard>

    <template #footer-left>
      <OurButton :text="$t('button.changePassword')" @click="onSubmitForm" />
    </template>

    <template #footer-right>
      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickOpenProfilePage" />
    </template>
  </OurPage>
</template>

<script>
import { mapActions } from "vuex";
import { minLength, required } from "vuelidate/lib/validators";
import { PASSWORD_MIN_LENGTH } from "@/services/validate.service";

import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";
import OurCard from "@/components/OurCard";
import OurInput from "@/components/form/OurInput";

export default {
  components: {
    OurInput,
    OurCard,
    OurButton,
    OurPage,
  },

  data: () => ({
    form: {
      currentPassword: "",
      newPassword: "",
    },
  }),

  validations: {
    form: {
      currentPassword: { required, minLength: minLength(PASSWORD_MIN_LENGTH) },
      newPassword: { required, minLength: minLength(PASSWORD_MIN_LENGTH) },
    },
  },

  computed: {
    currentPasswordError() {
      const isDirty = this.$v.form.currentPassword.$dirty;
      const isFilled = this.$v.form.currentPassword.required;
      const minLength = this.$v.form.currentPassword.minLength;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      } else if (isDirty && !minLength) {
        error = this.$t("validation.passwordMinLength", {
          length: PASSWORD_MIN_LENGTH,
        });
      }

      return error;
    },

    newPasswordError() {
      const isDirty = this.$v.form.newPassword.$dirty;
      const isFilled = this.$v.form.newPassword.required;
      const minLength = this.$v.form.newPassword.minLength;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      } else if (isDirty && !minLength) {
        error = this.$t("validation.passwordMinLength", {
          length: PASSWORD_MIN_LENGTH,
        });
      }

      return error;
    },
  },

  methods: {
    ...mapActions(["changeUserPassword"]),

    async onSubmitForm() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      const formData = {
        current_password: this.form.currentPassword,
        new_password: this.form.newPassword,
      };

      await this.changeUserPassword(formData);

      await this.$router.push({ name: "Profile" });
    },

    onClickOpenProfilePage() {
      this.$router.push({ name: "Profile" });
    },
  },
};
</script>
