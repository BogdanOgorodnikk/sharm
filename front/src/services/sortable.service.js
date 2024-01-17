import Sortable from "sortablejs";

const defaultOptions = {
  animation: 150,
  handle: ".sortable",
  draggable: ".draggable-item",
  swapThreshold: 1,
  invertSwap: true,
  ghostClass: "sortable-ghost",
  dragClass: "sortable-drag",
};

function createSortable(el, options) {
  return Sortable.create(el, {
    ...defaultOptions,
    ...options,
  });
}

export default {
  bind(el, binding) {
    const table = el;

    table._sortable = createSortable(table.querySelector("tbody"), binding.value);
  },
};
