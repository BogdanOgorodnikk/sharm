<template>
  <OurPage :back-route="backRouteParams" :title="$t('title.toggleMechanism')" width="md">
    <template #header-right>
      <OurButton v-if="isMobileDevice" size="sm" @click="onClickAddToggleMechanism">
        <template #icon-left>
          <OurSvgIcon size="sm" class="add-button-icon" name="Plus2" color="white" />
        </template>
      </OurButton>

      <OurButton v-else size="sm" :text="$t('button.add')" @click="onClickAddToggleMechanism" />
    </template>

    <OurCard class="card">
      <OurTableList
        :list="toggleMechanisms"
        @clickEdit="onClickEditToggleMechanism"
        @clickDelete="onClickDeleteToggleMechanism"
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
    ...mapState("toggleMechanism", ["toggleMechanisms"]),

    ...mapGetters("breakpoint", ["isMobileDevice"]),

    backRouteParams() {
      return {
        title: this.$t("title.accessories"),
        name: "AccessoriesList",
      };
    },
  },

  async created() {
    await this.getToggleMechanisms();
  },

  methods: {
    ...mapActions("toggleMechanism", ["getToggleMechanisms"]),

    onClickAddToggleMechanism() {
      this.$router.push({ name: "ToggleMechanismAdd" });
    },

    onClickEditToggleMechanism(id) {
      this.$router.push({ name: "ToggleMechanismEdit", params: { id } });
    },

    onClickDeleteToggleMechanism(id, name) {
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
