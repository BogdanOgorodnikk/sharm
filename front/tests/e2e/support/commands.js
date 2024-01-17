// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.config({
  defaultCommandTimeout: 8000, // 8 seconds
});

Cypress.Commands.add("setupDB", (...emails) => {
  cy.request({ url: "/e2e/db/clean", method: "PATCH", headers: {} });

  emails.forEach((email) => {
    cy.request({ url: "/e2e/db/seed", body: { email: email }, headers: {} });
  });
});

Cypress.Commands.add(
  "loginUserApi",
  (email = "user_one@e2e.example.com", password = "11111111") => {
    cy.request({
      url: "/login",
      body: {
        email: email,
        password: password,
      },
      headers: {},
      toMain: true,
    }).then((response) => {
      cy.log(response);
      cy.request({
        url: "/login-to-app",
        body: {
          appId: 2,
        },
        headers: {
          Authorization: `Bearer ${response.body.data.token}`,
        },
        toMain: true,
      }).then((response) => {
        Cypress.env("authToken", `Bearer ${response.body.data.token}`);
        cy.log(response);
      });
    });
  }
);

Cypress.Commands.add("loginUser", (email = "user_one@e2e.example.com", password = "11111111") => {
  cy.request({
    url: "/login",
    body: {
      email: email,
      password: password,
    },
    headers: {},
    toMain: true,
  }).then((response) => {
    cy.request({
      url: "/login-to-app",
      body: {
        appId: 2,
      },
      headers: {
        Authorization: `Bearer ${response.body.data.token}`,
      },
      toMain: true,
    }).then((response) => {
      localStorage.setItem("token", response.body.data.token);
      localStorage.setItem("token-expires", response.body.data.expires);
    });
  });
});

Cypress.Commands.overwrite("request", (originalFn, ...options) => {
  let requestData = options[0];

  if (requestData === Object(requestData)) {
    const baseUrl = requestData.toMain ? "mainBaseUrl" : "appBaseUrl";
    const url = Cypress.env(baseUrl) + Cypress.env("restApiPrefix") + requestData.url;

    delete requestData.toMain;

    requestData = {
      method: "POST",
      failOnStatusCode: false,
      headers: {
        Authorization: Cypress.env("authToken"),
      },
      ...requestData,
      url: url,
    };

    return originalFn(requestData);
  }

  return originalFn(...options);
});
