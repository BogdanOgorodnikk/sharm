export default {
  setDocumentMeta(separator, suffix, to, from) {
    const nearestWithTitle = to.matched
      .slice()
      .reverse()
      .find((r) => r.meta && r.meta.title);
    const previousNearestWithMeta = from.matched
      .slice()
      .reverse()
      .find((r) => r.meta && r.meta.metaTags);

    if (typeof nearestWithTitle !== "undefined" || typeof previousNearestWithMeta !== "undefined") {
      document.title = nearestWithTitle
        ? nearestWithTitle.meta.title + separator + suffix
        : previousNearestWithMeta.meta.title + separator + suffix;
    } else {
      document.title = suffix;
    }

    const nearestWithMeta = to.matched
      .slice()
      .reverse()
      .find((r) => r.meta && r.meta.metaTags);

    Array.from(document.querySelectorAll("[data-vue-router-controlled]")).map((el) =>
      el.parentNode.removeChild(el)
    );

    if (!nearestWithMeta) {
      return false;
    } // Skip rendering meta tags if there are none.

    nearestWithMeta.meta.metaTags
      .map((tagDef) => {
        const tag = document.createElement("meta");

        Object.keys(tagDef).forEach((key) => {
          tag.setAttribute(key, tagDef[key]);
        });
        // We use this to track which meta tags we create, so we don't interfere with other ones.
        tag.setAttribute("data-vue-router-controlled", "");

        return tag;
      })
      .forEach((tag) => document.head.appendChild(tag)); // Add the meta tags to the document head.
  },
};
