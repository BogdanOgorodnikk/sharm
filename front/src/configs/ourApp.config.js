const ROLES_CODE = {
  admin: "admin",
  client: "client",
};

const config = {
  theme: "",
  layout: {
    auth: {
      logoPath: "static/logos/LogoDark.svg",
      mobileLogoPath: "static/logos/LogoDark.svg",
    },
    admin: {
      logoPath: "static/logos/Logo.svg",
      mobileLogoPath: "static/logos/Logo.svg",
      menu: {
        items: [
          {
            root: true,
            svgIconName: "Couch",
            page: "Products",
            translate: "title.products",
          },
          {
            root: true,
            svgIconName: "Like",
            page: "RetailPriceList",
            translate: "title.retailPrice",
          },
          {
            root: true,
            svgIconName: "Clipboard-list",
            page: "OrdersList",
            translate: "title.allOrders",
            roles: [ROLES_CODE.admin],
          },
          {
            root: true,
            svgIconName: "Address-card",
            page: "ClientsList",
            translate: "title.clients",
            roles: [ROLES_CODE.admin],
          },
          {
            root: true,
            svgIconName: "Money",
            page: "PaymentsList",
            translate: "title.payments",
            roles: [ROLES_CODE.admin],
          },
          {
            root: true,
            svgIconName: "File",
            page: "PricesList",
            translate: "title.prices",
            roles: [ROLES_CODE.admin],
          },
          {
            root: true,
            svgIconName: "Settings4",
            page: "AccessoriesList",
            translate: "title.accessories",
            roles: [ROLES_CODE.admin],
          },
          {
            root: true,
            svgIconName: "Group",
            page: "UsersList",
            translate: "title.users",
            roles: [ROLES_CODE.admin],
          },
          {
            root: true,
            svgIconName: "Box3",
            page: "TransportList",
            translate: "title.transport",
            roles: [ROLES_CODE.admin],
          },
          {
            root: true,
            svgIconName: "Book",
            page: "TransportInvoiceList",
            translate: "title.transportInvoiceShort",
            roles: [ROLES_CODE.admin],
          },
          {
            root: true,
            svgIconName: "Clipboard-list",
            page: "MyOrders",
            translate: "title.myOrders",
            roles: [ROLES_CODE.client],
          },
          {
            root: true,
            svgIconName: "Money",
            page: "MyPayments",
            translate: "title.myPayments",
            roles: [ROLES_CODE.client],
          },
          {
            root: true,
            svgIconName: "Pantone",
            page: "ClientTextileList",
            translate: "title.textiles",
            roles: [ROLES_CODE.client],
          },
        ],
      },
    },
  },
  notify: {
    duration: {
      short: 4000,
      medium: 8000,
      long: 12000,
      permanent: 300000,
    },
  },
};

const { theme, layout, accentColor, notify } = config;

export { config, theme, layout, accentColor, notify as notifyConfig };
