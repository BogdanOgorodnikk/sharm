<template>
  <OurPage width="md" :title="$t('title.productsEdit')" :back-route="backRouteParams">
    <ProductForm v-if="isPrefilledForm" ref="textileForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.save')" @click="onSubmitForm" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToTextileList" />
    </template>

    <template #footer-right>
      <OurButton :text="$t('button.delete')" variant="thirdary" @click="onClickDeleteProduct" />
    </template>

    <DeleteModal v-model="isShownModal" :item="form" />
  </OurPage>
</template>

<script>
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";
import ProductForm from "../_components/ProductForm";
import { mapActions, mapState } from "vuex";
import { createFormData } from "@/services/data.service";
import OurDropdown from "@/components/OurDropdown";
import DeleteModal from "../delete/Modal";

export default {
  components: {
    OurDropdown,
    ProductForm,
    OurButton,
    OurPage,
    DeleteModal,
  },

  data() {
    return {
      form: {
        id: "",
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
      isShownModal: false,
      isPrefilledForm: false,
    };
  },

  computed: {
    ...mapState("product", ["product"]),

    backRouteParams() {
      return {
        title: this.$t("title.products"),
        name: "Products",
      };
    },
  },

  watch: {
    product: {
      handler: "onChangeProduct",
      deep: true,
    },
  },

  async created() {
    const productId = this.$route.params.id;

    await this.getProduct(productId);
  },

  methods: {
    ...mapActions("product", ["updateProduct", "getProduct"]),

    async onChangeProduct() {
      this.form.id = this.product.id;
      this.form.name = this.product.name;
      this.form.type = this.product.type;
      this.form.filling = this.product.fillId;
      this.form.toggleMechanism = this.product.toggleMechanismId;
      this.form.frame = this.product.frameId;
      this.form.sleepSize = {
        width: this.product.sizeWidth,
        length: this.product.sizeLength,
      };
      this.form.generalSize = {
        width: this.product.generalSizeWidth,
        length: this.product.generalSizeLength,
        height: this.product.generalSizeHeight,
      };
      this.form.note = this.product.note;

      if (this.product.photos) {
        const photosInArray = this.product.photos.split(",");

        for (let i = 0; i < photosInArray.length; i++) {
          const fileSrc = `${process.env.VUE_APP_DOMAIN}/products/${this.product.name}/${photosInArray[i]}`;

          const data = await fetch(fileSrc);
          const blob = await data.blob();
          const file = new File([blob], photosInArray[i]);

          this.form.files.push({ file, imageUrl: fileSrc });
        }
      }

      this.isPrefilledForm = true;
    },

    onClickBackToTextileList() {
      this.$router.push({ name: "Products" });
    },

    onClickDeleteProduct() {
      this.form.id = this.product.id;
      this.isShownModal = true;
    },

    async onSubmitForm() {
      this.$refs.textileForm.validate();

      if (this.form.isValid) {
        const data = {
          name: this.form.name,
          type: this.form.type,
          fill_id: this.form.filling,
          toggle_mechanism_id: this.form.toggleMechanism,
          frame_id: this.form.frame,
          size_width: this.form.sleepSize.width,
          size_length: this.form.sleepSize.length,
          general_size_width: this.form.generalSize.width,
          general_size_length: this.form.generalSize.length,
          general_size_height: this.form.generalSize.height,
          note: this.form.note,
          files: this.form.files,
        };

        const formData = createFormData(data);

        await this.updateProduct({ productId: this.product.id, data: formData });

        await this.$router.push({ name: "Products" });
      }
    },
  },
};
</script>
