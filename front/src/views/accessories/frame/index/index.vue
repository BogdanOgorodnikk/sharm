<template>
  <OurPage :back-route="backRouteParams" :title="$t('title.frame')" width="md">
    <template #header-right>
      <OurButton v-if="isMobileDevice" size="sm" @click="onClickAddFrame">
        <template #icon-left>
          <OurSvgIcon size="sm" class="add-button-icon" name="Plus2" color="white" />
        </template>
      </OurButton>

      <OurButton v-else size="sm" :text="$t('button.add')" @click="onClickAddFrame" />
    </template>

    <OurCard class="card">
      <OurTableList
        :list="frames"
        @clickEdit="onClickEditFrame"
        @clickDelete="onClickDeleteFrame"
      />
    </OurCard>

    <DeleteModal v-model="isShownModal" :item="selectedRow" />
  </OurPage>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import draggable from "vuedraggable";

import DeleteModal from "../delete/Modal";
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";
import OurSvgIcon from "@/components/OurSvgIcon";
import OurCard from "@/components/OurCard";
import OurTableList from "@/components/OurTableList";

export default {
  components: {
    OurTableList,
    OurCard,
    OurSvgIcon,
    OurButton,
    OurPage,
    DeleteModal,
    draggable,
  },

  data() {
    return {
      isShownModal: false,
      selectedRow: {},
    };
  },

  computed: {
    ...mapState("frame", ["frames"]),

    ...mapGetters("breakpoint", ["isMobileDevice"]),

    backRouteParams() {
      return {
        title: this.$t("title.accessories"),
        name: "AccessoriesList",
      };
    },
  },

  async created() {
    await this.getFrames();
  },

  methods: {
    ...mapActions("frame", ["getFrames"]),

    onClickAddFrame() {
      this.$router.push({ name: "FrameAdd" });
    },

    onClickEditFrame(id) {
      this.$router.push({ name: "FrameEdit", params: { id } });
    },

    onClickDeleteFrame(id, name) {
      this.selectedRow.id = id;
      this.selectedRow.name = name;
      this.isShownModal = true;
    },
  },
};
</script>

<style lang="postcss" scoped>
.add-button-icon {
  &:deep(g [fill]) {
    @apply opacity-100;
  }
}
</style>
