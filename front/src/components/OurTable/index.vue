<template>
  <div class="table-wrapper">
    <div
      v-show="isShownFixedOrActionsHeader"
      ref="headerFixedRow"
      class="table-custom-header"
      :class="[headerClasses.actionsHeader, headerClasses.fixedHeader]"
      :style="tableRowWidthStyle"
    >
      <OurCheckbox
        v-if="selectable"
        v-model="selectAll"
        :partial="!isSelectedAllRows"
        class="table-custom-header-item"
        size="sm"
      />

      <template v-if="selectedRowsLength">
        <div class="selected-rows-count">
          {{ selectedRowsLength }}
        </div>

        <div class="actions-slot-wrap">
          <!-- @slot Use it to add actions instead table head (it appears when you select items in table). -->
          <slot name="thead-actions" :selected-rows="selectedRows" />
        </div>
      </template>

      <template v-else>
        <div
          v-for="(item, index) in headers"
          :key="index"
          class="table-custom-header-item"
          :class="item.thClass"
        >
          <template v-if="isExistSlot(`thead-${item.value}`)">
            <!-- @slot Use it to customise table header item. -->
            <slot :name="`thead-${item.value}`" :text="item.text" />
          </template>

          <template v-else>
            {{ item.text }}
          </template>
        </div>
      </template>
    </div>

    <div ref="tableWrapper" class="table-wrap" :class="tableWrapClass">
      <t-table class="our-table" :data="tableItems" :headers="headers" :class="tableClasses">
        <template #thead="{ thClass, data }">
          <thead>
            <tr ref="headerRow" :class="headerClasses.hideHeader">
              <th v-if="selectable" class="table-checkbox">
                <OurCheckbox
                  v-model="selectAll"
                  size="sm"
                  :show-partial-icon="!isSelectedAllRows"
                  partial
                />
              </th>

              <th v-for="(item, index) in data" :key="index" :class="[thClass, item.thClass]">
                <template v-if="isExistSlot(`thead-${item.value}`)">
                  <!-- @slot Use it to customise table header item. -->
                  <slot :name="`thead-${item.value}`" :text="item.text" />
                </template>

                <template v-else>
                  {{ item.text }}
                </template>
              </th>
            </tr>
          </thead>
        </template>

        <template #row="{ row, rowIndex }">
          <tr v-if="rowIndex === firstRow" class="more-row">
            <td v-if="isShownSlot.beforeFirstRow" :colspan="colsCount" :class="firstRowClass">
              <!-- @slot Use it to add something before first row. -->
              <slot name="before-first-row" />
            </td>

            <td v-else class="first-row" />
          </tr>

          <DateSeparator
            v-if="isShownDateSeparator(rowIndex, row.date)"
            :date="row.date.primaryRow || row.date"
            :cols-count="colsCount"
          />

          <tr class="table-row" :class="rowBackgroundClass(row)" @click="onClickRow(row)">
            <td v-if="selectable" class="col-checkbox">
              <TableCheckbox
                :values.sync="selectedRows"
                :value="rowIndex"
                data-cy="table-body-checkbox"
                @click.native.stop="onClickSelectRow(rowIndex)"
              />
            </td>

            <td
              v-for="(value, key, index) in getFilteredRow(row)"
              :key="index"
              :class="getTdClass(key)"
            >
              <template v-if="isExistSlot(`cell-${key}`)">
                <!-- @slot Use it to customise table cell item (in whole column). -->
                <slot :name="`cell-${key}`" :value="value" />
              </template>

              <template v-else-if="isExistSlot('cell-other')">
                <slot name="cell-other" :value="value" />
              </template>

              <template v-else-if="key === 'date'">
                <div>
                  {{ value }}
                </div>
              </template>

              <template v-else-if="key === 'email'">
                <div @click.stop>
                  <OurLink :text="value" :url="`mailto:${value}`" size="sm" />
                </div>
              </template>

              <template v-else-if="key === 'link'">
                <OurLink
                  v-if="value.route"
                  :data-cy="`${key}-link`"
                  :text="value.label"
                  router-link
                  :route="value.route"
                  size="sm"
                />

                <span v-else>
                  {{ value }}
                </span>
              </template>

              <template v-else-if="key === 'money'">
                <OurMoney :item="value" />
              </template>

              <template v-else-if="key === 'tags'">
                <div class="tags-cell">
                  <OurTag
                    v-for="item in value.tags"
                    :key="item"
                    :text="item"
                    :variant="value.variant"
                  />
                </div>
              </template>

              <template v-else-if="value && value.hasOwnProperty('secondaryRow')">
                <div :data-cy="`${key}-cell`">
                  {{ value.primaryRow || emptyItem }}
                </div>

                <div class="secondary-row">
                  <template v-if="Array.isArray(value.secondaryRow)">
                    <div v-for="(secondaryRow, idx) in value.secondaryRow" :key="idx">
                      <span class="children-empty">
                        {{ secondaryRow }}
                      </span>
                    </div>
                  </template>

                  <template v-else>
                    {{ value.secondaryRow }}
                  </template>
                </div>
              </template>

              <template v-else>
                <div :data-cy="`${key}-cell`">
                  {{ value || emptyItem }}
                </div>
              </template>
            </td>
          </tr>

          <tr v-if="rowIndex === lastRow" class="more-row">
            <td v-if="isShownSlot.afterLastRow" :colspan="colsCount">
              <!-- @slot Use it to add something after last row. -->
              <slot name="after-last-row" />
            </td>

            <td v-else class="last-row" />
          </tr>
        </template>

        <template v-if="isExistSlot('tfoot')" #tfoot>
          <tfoot class="table-footer">
            <tr ref="footerRow" class="table-footer-row">
              <td v-if="selectable" />

              <!-- @slot Use it to add something in table footer. -->
              <slot name="tfoot" :cols-count="colsCount" />
            </tr>

            <tr ref="footerFixedRow" class="table-footer-fixed-row" :style="tableRowWidthStyle">
              <td v-if="selectable" />

              <!-- @slot Use it to add something in table footer. -->
              <slot name="tfoot" :cols-count="colsCount" />
            </tr>
          </tfoot>
        </template>

        <template v-if="!isLoading && !tableItems.length" #tbody>
          <EmptyTableMsg :colspan="colsCount" :filters="filters" />
        </template>
      </t-table>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { dateConverter } from "@/services/date.service";
import { isSameDay, isValid, secondsToMilliseconds } from "date-fns";

import OurMoney from "@/components/OurMoney";
import OurTag from "@/components/OurTag";
import OurLink from "@/components/OurButtonLink";
import OurCheckbox from "@/components/OurCheckbox";
import TTable from "vue-tailwind/dist/t-table";
import TableCheckbox from "./components/TableCheckbox";
import EmptyTableMsg from "./components/EmptyTableMsg";
import DateSeparator from "./components/DateSeparator";

const ONE_REM = 16;

export default {
  name: "OurTable",
  components: {
    OurTag,
    OurLink,
    OurMoney,
    OurCheckbox,
    TTable,
    TableCheckbox,
    EmptyTableMsg,
    DateSeparator,
  },

  props: {
    /**
     * Set items (rows) for table.
     */
    items: {
      type: Array,
      default: () => [],
      required: true,
    },

    /**
     * Set headers for table.
     */
    headers: {
      type: Array,
      default: () => [],
      required: true,
    },

    /**
     * Set filters for table.
     */
    filters: {
      type: Object,
      default: () => ({}),
    },

    /**
     * It allows to select table rows.
     */
    selectable: {
      type: Boolean,
      default: false,
    },

    /**
     * Make footer fixed.
     */
    fixedFooter: {
      type: Boolean,
      default: false,
    },

    /**
     * Make header sticky.
     */
    stickyHeader: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    selectAll: false,
    canSelectAll: true,
    selectedRows: [],
    tableItems: [],
    firstRow: 0,
    emptyItem: "-",
    tableWidth: 0,
    pagePositionY: 0,
  }),

  computed: {
    ...mapState("loader", ["isLoading"]),
    ...mapState("layout", ["fixedAsideMenu"]),

    tableWrapClass() {
      return this.selectedRowsLength ? "!rounded-t-none" : "rounded-lg";
    },

    selectedRowsLength() {
      return this.selectedRows.length;
    },

    isSelectedAllRows() {
      return this.selectedRowsLength === this.tableItems.length;
    },

    colsCount() {
      return this.headers.length + 1;
    },

    lastRow() {
      return this.items.length - 1;
    },

    isShownSlot() {
      return {
        beforeFirstRow: !!this.$slots["before-first-row"],
        afterLastRow: !!this.$slots["after-last-row"],
      };
    },

    tableClasses() {
      return {
        "fixed-footer": this.isFixedFooter,
      };
    },

    headerClasses() {
      return {
        actionsHeader: this.selectedRowsLength ? "actions-header" : "",
        fixedHeader: this.isFixedHeader && this.stickyHeader ? "table-fixed-header" : "",
        hideHeader: this.selectedRowsLength && !this.isFixedHeader ? "hide-header" : "",
      };
    },

    isShownFixedOrActionsHeader() {
      return this.isFixedHeader || this.selectedRowsLength;
    },

    isFixedFooter() {
      return this.fixedFooter && !this.isShownFooterPosition && this.isCheckedMoreOneTableItems;
    },

    isFixedHeader() {
      return !this.isShownHeaderPosition;
    },

    isShownHeaderPosition() {
      const positionForFixHeader =
        this.$refs?.headerRow?.getBoundingClientRect().top + window.pageYOffset || 0;

      return positionForFixHeader >= this.pagePositionY;
    },

    isShownFooterPosition() {
      const windowHeight = window.innerHeight;
      const pageBottom = this.pagePositionY + windowHeight;
      const positionForFixFooter =
        this.$refs?.footerRow?.getBoundingClientRect().bottom + window.pageYOffset;

      return pageBottom >= positionForFixFooter;
    },

    isCheckedMoreOneTableItems() {
      const checkedTableItems = this.tableItems.filter((item) => item.isChecked);

      return checkedTableItems.length > 1;
    },

    tableRowWidthStyle() {
      return `width: ${this.tableWidth / ONE_REM}rem`;
    },

    firstRowClass() {
      let hasContentBeforeFirstRowSlot = false;

      this.$slots["before-first-row"]?.forEach((item) => {
        if (!hasContentBeforeFirstRowSlot) {
          hasContentBeforeFirstRowSlot = !!item.tag;
        }
      });

      return hasContentBeforeFirstRowSlot ? "" : "first-row";
    },
  },

  watch: {
    selectAll: {
      handler: "onChangeSelectAll",
      deep: true,
    },
    selectedRows: "onChangeSelectedRows",
    tableItems: {
      handler: "onChangeTableItems",
      deep: true,
    },
    items: {
      handler: "onChangeItems",
      deep: true,
    },
    fixedAsideMenu: "onChangeFixedAsideMenu",
    isFixedFooter: "onChangeFixedFooter",
    isFixedHeader: "onChangeFixedHeader",
  },

  created() {
    this.tableItems = this.items;

    document.addEventListener("keyup", this.onKeyupClearCheckbox);
    document.addEventListener("scroll", this.onScrollGetPosition);
  },

  updated() {
    this.tableWidth = this.$refs.tableWrapper.offsetWidth;
  },

  beforeDestroy() {
    document.removeEventListener("keyup", this.onKeyupClearCheckbox);
    document.removeEventListener("scroll", this.onScrollGetPosition);
  },

  methods: {
    onChangeFixedFooter() {
      if (this.isFixedFooter) {
        this.$nextTick(() => {
          this.setFooterItemsWidth();
        });
      } else {
        this.setFooterItemsWidth(true);
      }
    },

    onChangeFixedHeader() {
      this.setHeaderItemsWidth();
    },

    setFooterItemsWidth(setNullWidth) {
      const ZERO_WIDTH = 0;

      if (this.$refs.footerFixedRow) {
        const [...mainFooterItems] = this.$refs.footerRow.children;
        const [...fixedFooterItems] = this.$refs.footerFixedRow.children;

        fixedFooterItems.forEach((item, index) => {
          item.style.width = setNullWidth
            ? `${ZERO_WIDTH}rem`
            : `${mainFooterItems[index].offsetWidth / ONE_REM}rem`;
        });
      }
    },

    setHeaderItemsWidth() {
      if (!this.selectedRowsLength) {
        const [...mainHeaderItems] = this.$refs.headerRow.children;
        const [...fixedHeaderItems] = this.$refs.headerFixedRow.children;

        fixedHeaderItems.forEach((item, index) => {
          item.style.width = `${mainHeaderItems[index]?.offsetWidth / ONE_REM}rem`;
        });
      }
    },

    onChangeFixedAsideMenu() {
      this.tableWidth = this.$refs.tableWrapper.offsetWidth;

      this.setHeaderItemsWidth();
    },

    onScrollGetPosition() {
      this.pagePositionY = window.pageYOffset;
    },

    onChangeTableItems(tableItems) {
      this.$emit("update:items", tableItems);
    },

    onKeyupClearCheckbox(event) {
      const escKeyCode = 27;

      if (event.keyCode === escKeyCode && this.selectable) {
        this.selectedRows = [];
      }
    },

    onChangeItems() {
      if (!this.items.length || this.tableItems.length !== this.items.length) {
        this.selectedRows = [];
      }

      const checkedTableItems = this.tableItems.filter((item) => item.isChecked);

      this.tableItems = this.items;

      this.tableItems.forEach((item) => {
        checkedTableItems.forEach((checkedItem) => {
          if (item.id === checkedItem.id) {
            item.isChecked = true;
          }
        });
      });
    },

    isShownDateSeparator(rowIndex, date) {
      const index = !rowIndex ? rowIndex : rowIndex - 1;

      const prevItem = this.tableItems[index];
      const prevDateInMilliseconds = secondsToMilliseconds(prevItem?.date?.primaryRow);
      const dateInMilliseconds = secondsToMilliseconds(date?.primaryRow);
      const isSameDate = isSameDay(dateInMilliseconds, prevDateInMilliseconds);

      if (!rowIndex) {
        let hasContentBeforeFirstRowSlot = false;

        this.$slots["before-first-row"]?.forEach((item) => {
          if (!hasContentBeforeFirstRowSlot) {
            hasContentBeforeFirstRowSlot = !!item.tag;
          }
        });

        return isValid(prevDateInMilliseconds) && hasContentBeforeFirstRowSlot;
      }

      return isValid(prevDateInMilliseconds) && !isSameDate;
    },

    rowBackgroundClass(row) {
      return row.isChecked ? "table-row-checked" : "";
    },

    onClickSelectRow(rowIndex) {
      const isRowChecked = this.tableItems[rowIndex].isChecked;

      this.tableItems[rowIndex].isChecked = !isRowChecked;
    },

    getFilteredRow(row) {
      const filteredRow = Object.entries(row).filter((col) => {
        const [key] = col;
        const isShownCol = this.headers.some((header) => header.value === key);

        if (isShownCol) return col;
      });

      return Object.fromEntries(filteredRow);
    },

    onClickRow(row) {
      this.$emit("clickRow", row);
    },

    isExistSlot(slotName) {
      return !!this.$scopedSlots[slotName];
    },

    getTdClass(key) {
      return this.headers.find((item) => item.value === key)?.tdClass;
    },

    onChangeSelectAll(selectAll) {
      if (selectAll && this.canSelectAll) {
        this.selectedRows = this.tableItems.map((item, index) => index);

        this.tableItems.forEach((item) => {
          item.isChecked = true;
        });
      } else if (!selectAll) {
        this.selectedRows = [];

        this.tableItems.forEach((item) => {
          item.isChecked = false;
        });
      }

      this.canSelectAll = true;
    },

    onChangeSelectedRows(selectedRows) {
      if (selectedRows.length) {
        this.canSelectAll = false;

        this.isCheckedMoreOneTableItems ? this.setFooterItemsWidth() : "";
      } else {
        this.$nextTick(() => {
          this.setHeaderItemsWidth();
        });
      }

      this.selectAll = !!selectedRows.length;
    },

    dateConverter(value, format) {
      return dateConverter(value, format);
    },
  },
};
</script>

<style lang="postcss" scoped>
.table-wrapper {
  @apply relative;
}

.more-row {
  .first-row {
    @apply py-1 !important;
  }

  .last-row {
    @apply py-1 !important;
  }

  td {
    @apply px-0 py-4 !important;

    & :deep:first-child {
      @apply mx-auto;
    }
  }
}

.table-fixed-header {
  @apply fixed top-0;
  @apply bg-white shadow-xl;

  &.actions-header {
    @apply rounded-t-none;
  }
}

.actions-header {
  @apply rounded-t-lg bg-blue-100;

  .selected-rows-count {
    @apply flex items-center;
    @apply font-medium text-base-dark;
  }

  .actions-slot-wrap {
    @apply flex items-center space-x-4 pl-4;
  }
}

.table-custom-header {
  @apply flex items-center;
  @apply z-10;

  &-item {
    @apply flex-none;
    @apply text-sm font-normal text-gray-500;
    @apply py-5 px-[1.125rem];

    &:first-child {
      @apply p-5;
    }

    &:nth-child(2) {
      @apply pl-0;
    }

    &:last-child {
      @apply p-5;
    }
  }
}

.table-wrap {
  @apply overflow-auto rounded-lg;

  .our-table::v-deep {
    @apply min-w-full border-none bg-white text-sm;
    @apply w-full;

    thead {
      @apply border-b border-solid border-gray-200;

      tr {
        th {
          @apply bg-white px-[1.125rem] py-5;
          @apply text-sm font-normal text-gray-500;

          &:first-child,
          &:last-child {
            @apply p-5;
          }

          &:nth-child(2) {
            @apply pl-0;
          }
        }
      }
    }

    tbody {
      @apply divide-none;

      tr {
        td {
          @apply overflow-hidden text-ellipsis whitespace-nowrap p-[1.125rem] py-5;
          @apply align-top;

          &:first-child,
          &:last-child {
            @apply p-5;
          }

          &:nth-child(2) {
            @apply pl-0;
          }

          .tags-cell {
            @apply flex space-x-2;
          }
        }
      }
    }

    tfoot {
      @apply border-b border-solid border-gray-200;

      tr {
        td {
          @apply p-[1.125rem] py-5;

          &:first-child {
            @apply p-5;
          }

          &:nth-child(2) {
            @apply pl-0;
          }
        }
      }
    }

    .secondary-row {
      @apply mt-1 text-xs text-gray-500;
    }
  }
}

.col-checkbox {
  @apply w-[3.75rem];
}

.table-row {
  @apply transition duration-100;
  @apply hover:bg-gray-50;

  &-checked {
    @apply transition duration-100;
    @apply bg-gray-100;
  }
}

.children-empty {
  @apply inline-block;
}

.fixed-footer {
  .table {
    &-footer {
      @apply relative;

      &-fixed-row {
        visibility: inherit;
      }
    }
  }
}

.hide-header {
  @apply relative -top-[3.75rem];
  visibility: collapse;
}

.table-footer-fixed-row {
  @apply fixed bottom-0;
  @apply bg-white shadow-2xl;
  visibility: collapse;
}

.table-loader {
  @apply !top-auto;
}

.fixed-header-table-loader {
  @apply !top-[3.75rem];
}

.table-checkbox {
  @apply w-[3.75rem];
}
</style>
