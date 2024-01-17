<template>
  <div class="auth-wrapper">
    <Logo class="card-logo" :path="logoPath" size="3xl" />

    <div class="card-logo-title">
      {{ $t("title.brandName") }}
    </div>

    <OurCard class="card">
      <div>
        <div class="card-title">
          {{ $t("title.canNotAuth") }}
        </div>

        <div class="card-description">
          {{ $t("title.sendNewPassInEmail") }}
        </div>
      </div>

      <OurInput
        v-model="form.email"
        :label="$t('label.email')"
        :placeholder="$t('placeholder.email')"
        :error="emailError"
      />

      <div class="login-footer">
        <OurButton :text="$t('button.resetPassword')" @click="onSubmitForm" />

        <OurRow class="login-wrapper-link">
          <router-link class="login-link" :to="signInRoute">
            {{ $t("title.backToAuth") }}
          </router-link>
        </OurRow>
      </div>
    </OurCard>

    <Languages class="auth-languages" />
  </div>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";
import router from "@/router";
import { resetPassword } from "@/api/auth";

import OurCard from "@/components/OurCard";
import OurInput from "@/components/form/OurInput";
import OurButton from "@/components/OurButton";
import OurRow from "@/components/OurRow";
import Logo from "@/layouts/_components/Logo";
import Languages from "@/views/auth/_components/Languages";
import { layout } from "@/configs/ourApp.config";

export default {
  name: "ForgotPassword",

  components: {
    Languages,
    Logo,
    OurRow,
    OurButton,
    OurInput,
    OurCard,
  },

  data: () => ({
    form: {
      email: "",
    },
  }),

  validations: {
    form: {
      email: { required, email },
    },
  },

  computed: {
    logoPath() {
      return layout.auth.logoPath;
    },

    emailError() {
      const isDirty = this.$v.form.email.$dirty;
      const isFilled = this.$v.form.email.required;
      const isEmail = this.$v.form.email.email;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      } else if (isDirty && !isEmail) {
        error = this.$t("validation.mustBeEmail");
      }

      return error;
    },

    signInRoute() {
      return { name: "Login" };
    },
  },

  methods: {
    async onSubmitForm() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      const formData = {
        email: this.form.email,
      };

      await resetPassword(formData);

      await router.push({ name: "Login" });
    },
  },
};
</script>

<style lang="postcss" scoped>
.login-wrapper-link {
  @apply mt-6 justify-center;
}

.login-link {
  @apply text-sm font-normal text-gray-500 underline;

  &:hover {
    @apply text-gray-600;
  }
}

.card {
  &-logo {
    @apply justify-center;

    &::v-deep {
      .logo-image {
        @apply h-32 w-32;
        @apply -mt-10 -ml-[2.3125rem];
      }
    }

    &-title {
      @apply text-center text-3xl font-medium text-base-dark;
      @apply mb-6 -mt-2;
    }
  }

  &-title {
    @apply text-center text-4xl font-medium text-base-dark;
  }

  &-description {
    @apply text-center text-base font-normal text-gray-500;
  }
}

.auth-languages {
  @apply mt-8;
  @apply justify-center;
}
</style>
