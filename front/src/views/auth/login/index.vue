<template>
  <div class="auth-wrapper">
    <Logo class="card-logo" :path="logoPath" size="3xl" />

    <div class="card-logo-title">
      {{ $t("title.brandName") }}
    </div>

    <OurCard class="card">
      <div class="card-title">
        {{ $t("title.signIn") }}
      </div>

      <OurInput
        v-model="form.email"
        :label="$t('label.email')"
        :placeholder="$t('placeholder.email')"
        :error="emailError"
      />

      <OurInput
        v-model="form.password"
        :label="$t('label.password')"
        :placeholder="$t('placeholder.password')"
        :error="passwordError"
        type="password"
      />

      <div class="login-footer">
        <OurButton :text="$t('button.login')" @click="onSubmitForm" />

        <OurRow class="login-wrapper-link">
          <router-link class="login-link" :to="forgotPasswordRoute">
            {{ $t("title.forgotPassword") }}
          </router-link>

          <router-link class="login-link" :to="signUpRoute">
            {{ $t("title.signUp") }}
          </router-link>
        </OurRow>
      </div>
    </OurCard>

    <Languages class="auth-languages" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { required, email, minLength } from "vuelidate/lib/validators";
import { PASSWORD_MIN_LENGTH } from "@/services/validate.service";
import router from "@/router";

import OurCard from "@/components/OurCard";
import OurInput from "@/components/form/OurInput";
import OurButton from "@/components/OurButton";
import OurRow from "@/components/OurRow";
import Logo from "@/layouts/_components/Logo";
import Languages from "@/views/auth/_components/Languages";
import { layout } from "@/configs/ourApp.config";

export default {
  name: "Login",

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
      password: "",
    },
  }),

  validations: {
    form: {
      email: { required, email },
      password: { required, minLength: minLength(PASSWORD_MIN_LENGTH) },
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

    passwordError() {
      const isDirty = this.$v.form.password.$dirty;
      const isFilled = this.$v.form.password.required;
      const minLength = this.$v.form.password.minLength;

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

    signUpRoute() {
      return { name: "SignUp" };
    },

    forgotPasswordRoute() {
      return { name: "ForgotPassword" };
    },
  },

  methods: {
    ...mapActions(["login"]),

    async onSubmitForm() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      const formData = {
        email: this.form.email,
        password: this.form.password,
      };

      await this.login(formData);

      router.push({ name: "MainLayout" });
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
}

.auth-languages {
  @apply mt-8;
  @apply justify-center;
}
</style>
