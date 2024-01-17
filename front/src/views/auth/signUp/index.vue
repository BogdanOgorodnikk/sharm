<template>
  <div class="auth-wrapper">
    <Logo class="card-logo" :path="logoPath" size="3xl" />

    <div class="card-logo-title">
      {{ $t("title.brandName") }}
    </div>

    <OurCard class="card">
      <div class="card-title">
        {{ $t("title.signUp") }}
      </div>

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
        :error="emailError"
      />

      <OurInput
        v-model="form.password"
        :label="$t('label.password')"
        :placeholder="$t('placeholder.password')"
        :error="passwordError"
        type="password"
      />

      <OurPhoneInput
        v-model="form.phone"
        :label="$t('label.phone')"
        :placeholder="$t('placeholder.phone')"
        :error="phoneError"
      />

      <OurSelect
        v-model="form.region"
        :label="$t('label.region')"
        :placeholder="$t('placeholder.region')"
        :error="regionError"
        :options="regionOptions"
        value-key="label"
      />

      <OurSelect
        v-model="form.town"
        :label="$t('label.town')"
        :placeholder="$t('placeholder.town')"
        :error="townError"
        :options="townOptions"
        value-key="label"
      />

      <OurInput
        v-model="form.deliveryPlace"
        :label="$t('label.deliveryPlace')"
        :placeholder="$t('placeholder.deliveryPlace')"
      />

      <div class="login-footer">
        <OurButton :text="$t('button.signUp')" @click="onSubmitForm" />

        <OurRow class="login-wrapper-link">
          <router-link class="login-link" :to="signInRoute">
            {{ $t("title.haveAccount") }}
          </router-link>
        </OurRow>
      </div>
    </OurCard>

    <Languages class="auth-languages" />
  </div>
</template>

<script>
import { required, email, minLength } from "vuelidate/lib/validators";
import {
  PASSWORD_MIN_LENGTH,
  phoneMaxLength,
  phoneMinLength,
  clearPhone,
} from "@/services/validate.service";
import router from "@/router";
import { REGIONS_CODE, getTowns } from "@/api/town";
import { signUp } from "@/api/auth";

import OurCard from "@/components/OurCard";
import OurInput from "@/components/form/OurInput";
import OurButton from "@/components/OurButton";
import OurRow from "@/components/OurRow";
import Logo from "@/layouts/_components/Logo";
import Languages from "@/views/auth/_components/Languages";
import OurPhoneInput from "@/components/OurPhoneInput";
import OurSelect from "@/components/OurSelect";
import { layout } from "@/configs/ourApp.config";

export default {
  name: "Login",

  components: {
    OurSelect,
    OurPhoneInput,
    Languages,
    Logo,
    OurRow,
    OurButton,
    OurInput,
    OurCard,
  },

  data: () => ({
    townOptions: [],
    form: {
      name: "",
      email: "",
      password: "",
      phone: "",
      region: "",
      town: "",
      deliveryPlace: "",
    },
  }),

  validations: {
    form: {
      name: { required },
      email: { required, email },
      password: { required, minLength: minLength(PASSWORD_MIN_LENGTH) },
      phone: { required, phoneMinLength, phoneMaxLength },
      region: { required },
      town: { required },
    },
  },

  computed: {
    logoPath() {
      return layout.auth.logoPath;
    },

    nameError() {
      const isDirty = this.$v.form.name.$dirty;
      const isFilled = this.$v.form.name.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
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

    regionError() {
      const isDirty = this.$v.form.region.$dirty;
      const isFilled = this.$v.form.region.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    townError() {
      const isDirty = this.$v.form.town.$dirty;
      const isFilled = this.$v.form.town.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    signInRoute() {
      return { name: "Login" };
    },

    regionOptions() {
      return REGIONS_CODE;
    },
  },

  watch: {
    "form.region": {
      handler: "onChangeRegion",
      deep: true,
    },
  },

  methods: {
    async onChangeRegion() {
      this.townOptions = await getTowns(this.form.region);
    },

    async onSubmitForm() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      this.form.phone = `+${clearPhone(this.form.phone)}`;

      const formData = {
        name: this.form.name,
        email: this.form.email,
        phone: this.form.phone,
        town: this.form.town,
        region: this.form.region,
        delivery_place: this.form.deliveryPlace,
        password: this.form.password,
      };

      await signUp(formData);

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
}

.auth-languages {
  @apply mt-8;
  @apply justify-center;
}
</style>
