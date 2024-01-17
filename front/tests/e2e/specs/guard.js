describe("Router guard", () => {
  context("Unauthenticated user", () => {
    beforeEach(() => {
      cy.visit("/login");
    });

    it("Unauthenticated user goes to the sign up page, it is visible", () => {
      cy.visit("/signup");

      cy.url().should("contain", "/signup");

      cy.get("[data-cy=signup-page]").should("be.visible");
    });

    it("Unauthenticated user goes to the forgot password page, it is visible", () => {
      cy.visit("/forgot");

      cy.url().should("contain", "/forgot");

      cy.get("[data-cy=forgot-password-page]").should("be.visible");
    });

    it("Unauthenticated user goes to the home page, redirects to the login", () => {
      cy.visit("/dashboard");

      cy.url().should("contain", "/login");

      cy.get("[data-cy=login-page]").should("be.visible");
    });
  });

  // context("Authenticated user", () => {
  //   before(() => {
  //     cy.setupDB();
  //   });
  //
  //   beforeEach(() => {
  //     cy.visit("/login");
  //
  //     cy.loginUser();
  //   });
  //
  //   it("Authenticated user goes to the login page, redirects to the home page", () => {
  //     cy.url().should("contain", "/");
  //     cy.get("[data-cy=business-page]").should("be.visible");
  //
  //
  //     cy.visit("/login");
  //
  //     cy.url().should("contain", "/");
  //
  //     cy.get("[data-cy=business-page]").should("be.visible");
  //   });
  //
  //   it("Authenticated user goes to the forgot password page, redirects to the home page", () => {
  //   cy.get("[data-cy=business-page]").should("be.visible");
  //
  //     cy.visit("/forgot");
  //
  //     cy.url().should("contain", "/");
  //
  //     cy.get("[data-cy=business-page]").should("be.visible");
  //     });
  // });
});
