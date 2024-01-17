<template>
  <OurCard>
    <OurUppload
      :label="$t('label.productImage')"
      :allowed-file-types="['.png', '.jpg', '.jpeg']"
      :downloaded-files="form.files"
      multiple
      :max-files="15"
      @changeFiles="onChangeFiles"
    />

    <OurInput
      v-model="form.name"
      :label="$t('label.productName')"
      :placeholder="$t('placeholder.productName')"
      :error="nameError"
    />

    <OurSelect
      v-model="form.type"
      :label="$t('label.productType')"
      :placeholder="$t('placeholder.productType')"
      :error="typeError"
      :options="productTypeForSelect"
      value-key="code"
    />

    <div class="product-add-block">
      <OurSelect
        v-model="form.filling"
        :label="$t('label.filling')"
        :placeholder="$t('placeholder.filling')"
        :error="fillingError"
        :options="fillingsForSelect"
      />

      <OurButtonLink
        class="product-add-component-link"
        :text="$t('button.createFilling')"
        dashed
        variant="secondary"
        size="sm"
        :route="buttonLinks.filling"
        router-link
        target-blank
      />
    </div>

    <div class="product-add-block">
      <OurSelect
        v-model="form.toggleMechanism"
        :label="$t('label.toggleMechanism')"
        :placeholder="$t('placeholder.toggleMechanism')"
        :error="toggleMechanismError"
        :options="toggleMechanismsForSelect"
      />

      <OurButtonLink
        class="product-add-component-link"
        :text="$t('button.createToggleMechanism')"
        dashed
        variant="secondary"
        size="sm"
        :route="buttonLinks.toggleMechanism"
        router-link
        target-blank
      />
    </div>

    <div class="product-add-block">
      <OurSelect
        v-model="form.frame"
        :label="$t('label.frame')"
        :placeholder="$t('placeholder.frame')"
        :error="frameError"
        :options="framesForSelect"
      />

      <OurButtonLink
        class="product-add-component-link"
        :text="$t('button.createFrame')"
        dashed
        variant="secondary"
        size="sm"
        :route="buttonLinks.frame"
        router-link
        target-blank
      />
    </div>

    <div>
      <div class="product-add-size-table-title">{{ $t("label.sleepingPlace") }}</div>

      <div class="product-add-size-table">
        <div class="product-add-size-table-header">
          <div class="product-add-size-table-header-item">{{ $t("label.lengthInSM") }}</div>

          <div class="product-add-size-table-header-item">{{ $t("label.widthInSM") }}</div>
        </div>

        <div class="product-add-size-table-body">
          <div class="product-add-size-table-row">
            <OurInput
              v-model="form.sleepSize.length"
              :label="productSizeLabel.length"
              class="product-add-size-table-row-input"
              placeholder="2000"
              :error="sleepSizeLengthError"
              validation-rule="number"
            />

            <OurInput
              v-model="form.sleepSize.width"
              :label="productSizeLabel.width"
              class="product-add-size-table-row-input"
              placeholder="1000"
              :error="sleepSizeWidthError"
              validation-rule="number"
            />
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="product-add-size-table-title">{{ $t("label.generalSize") }}</div>

      <div class="product-add-size-table">
        <div class="product-add-size-table-header">
          <div class="product-add-size-table-header-item">{{ $t("label.lengthInSM") }}</div>

          <div class="product-add-size-table-header-item">{{ $t("label.widthInSM") }}</div>

          <div class="product-add-size-table-header-item">{{ $t("label.heightInSM") }}</div>
        </div>

        <div class="product-add-size-table-body">
          <div class="product-add-size-table-row">
            <OurInput
              v-model="form.generalSize.length"
              :label="productSizeLabel.length"
              class="product-add-size-table-row-input"
              placeholder="2000"
              :error="generalSizeLengthError"
              validation-rule="number"
            />

            <OurInput
              v-model="form.generalSize.width"
              :label="productSizeLabel.width"
              class="product-add-size-table-row-input"
              placeholder="1000"
              :error="generalSizeWidthError"
              validation-rule="number"
            />

            <OurInput
              v-model="form.generalSize.height"
              :label="productSizeLabel.height"
              class="product-add-size-table-row-input"
              placeholder="300"
              :error="generalSizeHeightError"
              validation-rule="number"
            />
          </div>
        </div>
      </div>
    </div>

    <OurTextarea v-model="form.note" :label="$t('label.note')" />
  </OurCard>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import OurCard from "@/components/OurCard";
import OurInput from "@/components/form/OurInput";
import OurSelect from "@/components/OurSelect";
import OurButton from "@/components/OurButton";
import OurButtonLink from "@/components/OurButtonLink";
import OurUppload from "@/components/OurUppload";
import { mapActions, mapGetters } from "vuex";
import { PRODUCT_TYPE } from "@/api/product";
import OurTextarea from "@/components/OurTextarea";

export default {
  components: { OurTextarea, OurButton, OurSelect, OurInput, OurCard, OurButtonLink, OurUppload },

  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      form: {
        files: [],
        name: "",
        type: "",
        filling: "",
        toggleMechanism: "",
        frame: "",
        sleepSize: {
          width: "",
          length: "",
        },
        generalSize: {
          width: "",
          length: "",
          height: "",
        },
        note: "",
      },
      productTypeForSelect: [
        {
          code: PRODUCT_TYPE.sofa,
          label: this.$t("label.sofa"),
        },
        {
          code: PRODUCT_TYPE.cornerSofa,
          label: this.$t("label.cornerSofa"),
        },
        {
          code: PRODUCT_TYPE.bed,
          label: this.$t("label.bed"),
        },
        {
          code: PRODUCT_TYPE.modularSystem,
          label: this.$t("label.modularSystem"),
        },
      ],
    };
  },

  validations: {
    form: {
      name: { required },
      type: { required },
      filling: { required },
      toggleMechanism: { required },
      frame: { required },
      sleepSize: {
        width: { required },
        length: { required },
      },
      generalSize: {
        width: { required },
        length: { required },
        height: { required },
      },
    },
  },

  computed: {
    ...mapGetters("filling", ["fillingsForSelect"]),
    ...mapGetters("toggleMechanism", ["toggleMechanismsForSelect"]),
    ...mapGetters("frame", ["framesForSelect"]),
    ...mapGetters("breakpoint", ["isMobileDevice"]),

    productSizeLabel() {
      return {
        length: this.isMobileDevice ? this.$t("label.lengthInSM") : "",
        width: this.isMobileDevice ? this.$t("label.widthInSM") : "",
        height: this.isMobileDevice ? this.$t("label.heightInSM") : "",
      };
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

    typeError() {
      const isDirty = this.$v.form.type.$dirty;
      const isFilled = this.$v.form.type.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    fillingError() {
      const isDirty = this.$v.form.filling.$dirty;
      const isFilled = this.$v.form.filling.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    toggleMechanismError() {
      const isDirty = this.$v.form.toggleMechanism.$dirty;
      const isFilled = this.$v.form.toggleMechanism.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    frameError() {
      const isDirty = this.$v.form.frame.$dirty;
      const isFilled = this.$v.form.frame.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    sleepSizeWidthError() {
      const isDirty = this.$v.form.sleepSize.width.$dirty;
      const isFilled = this.$v.form.sleepSize.width.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    sleepSizeLengthError() {
      const isDirty = this.$v.form.sleepSize.length.$dirty;
      const isFilled = this.$v.form.sleepSize.length.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    generalSizeWidthError() {
      const isDirty = this.$v.form.generalSize.width.$dirty;
      const isFilled = this.$v.form.generalSize.width.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    generalSizeLengthError() {
      const isDirty = this.$v.form.generalSize.length.$dirty;
      const isFilled = this.$v.form.generalSize.length.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    generalSizeHeightError() {
      const isDirty = this.$v.form.generalSize.height.$dirty;
      const isFilled = this.$v.form.generalSize.height.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    buttonLinks() {
      return {
        filling: { name: "FillingAdd" },
        toggleMechanism: { name: "ToggleMechanismAdd" },
        frame: { name: "FrameAdd" },
      };
    },
  },

  watch: {
    form: {
      handler: "onChangeForm",
      deep: true,
    },
  },

  async created() {
    await Promise.all([this.getFillings(), this.getToggleMechanisms(), this.getFrames()]);

    this.prefillForm();
  },

  methods: {
    ...mapActions("filling", ["getFillings"]),
    ...mapActions("toggleMechanism", ["getToggleMechanisms"]),
    ...mapActions("frame", ["getFrames"]),

    prefillForm() {
      this.form.name = this.value.name;
      this.form.type = this.value.type;
      this.form.filling = this.value.filling;
      this.form.toggleMechanism = this.value.toggleMechanism;
      this.form.frame = this.value.frame;
      this.form.sleepSize = {
        width: this.value.sleepSize?.width,
        length: this.value.sleepSize?.length,
      };
      this.form.generalSize = {
        width: this.value.generalSize?.width,
        length: this.value.generalSize?.length,
        height: this.value.generalSize?.height,
      };
      this.form.note = this.value.note;

      this.form.files = this.value.files?.length ? [...this.value.files] : [];
    },

    onChangeForm(form) {
      form.isValid = !this.$v.$invalid;

      this.$emit("input", form);
    },

    onChangeFiles(files) {
      this.form.files = [...files];
    },

    validate() {
      this.$v.$touch();
    },
  },
};
</script>

<style lang="postcss" scoped>
.product-add {
  &-block {
    @apply space-y-1;
  }

  &-component-link {
    @apply ml-2;
  }

  &-size-table {
    &-title {
      @apply text-xl font-medium text-base-dark;
      @apply mb-2 ml-4;
    }

    &-button {
      @apply ml-4 mt-2;
    }

    &-header {
      @apply mb-1 hidden md:flex;

      &-item {
        @apply w-full;
        @apply text-sm font-normal text-gray-500;
        @apply pl-4;
      }
    }

    &-body {
      @apply border-gray-300 md:rounded-xl md:border;
    }

    &-row {
      @apply block md:flex;
      @apply md:border-b md:border-gray-300;
      @apply space-y-3 md:space-y-0;

      &:last-child {
        @apply md:border-0;
      }

      &-input {
        @apply w-full;
        @apply md:border-r md:border-gray-300;

        &:last-child {
          @apply md:border-none;
        }

        &::v-deep {
          .input-block {
            @apply h-full;
          }

          .input {
            @apply md:py-2.5 md:px-4;
            @apply md:rounded-none md:border-0;
            @apply md:bg-transparent;

            &:hover {
              @apply md:border-gray-300;
            }

            &:focus {
              @apply md:border-gray-300 md:ring-0;
            }
          }
        }
      }
    }
  }
}
</style>
