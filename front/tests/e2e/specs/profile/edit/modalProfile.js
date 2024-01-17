describe("Employee edit page", () => {
  before(() => {
    cy.setupDB();
  });

  beforeEach(() => {
    cy.loginUser("user_two@e2e.example.com");
    cy.visit('/')

    cy.url().should("contain", "/");
  });

  it("Modal is visible", () => {
    cy.get("[data-cy=business-page]").should("be.visible");

    cy.get("[data-cy=user-block]").click();

    cy.get("[data-cy=modal-profile]").should("be.visible");
  });

  context("Form fields", () => {
    it("Form fields exist and can change user profile", () => {
      cy.get("[data-cy=business-page]").should("be.visible");

      cy.get("[data-cy=user-block]").click();

      cy.get("[data-cy=modal-profile]").should("be.visible");

      cy.get("[data-cy=name-input] input").as("name");
      cy.get("[data-cy=surname-input] input").as("surname");
      cy.get("[data-cy=phone-input] input").as("phone");
      cy.get("[data-cy=email-input] input").as("email");
      cy.get("[data-cy=language-select]").as("language");

      cy.get("[data-cy=update-profile-button]").click();

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
    });

    it("Empty form can not be submitted", () => {
      cy.get("[data-cy=business-page]").should("be.visible");

      cy.get("[data-cy=user-block]").click();

      cy.get("[data-cy=modal-profile]").should("be.visible");

      cy.get("[data-cy=name-input] input").as("name");
      cy.get("@name").clear();

      cy.get("[data-cy=phone-input] input").as("phone");
      cy.get("@phone").clear();

      cy.get("[data-cy=update-profile-button]").click();

      cy.get("[data-cy=input-error-message]").as("nameErrorMsg");
      cy.get("[data-cy=input-error-message]").as("phoneErrorMsg");

      cy.get("@name").should("have.class", "error-input");
      cy.get("@nameErrorMsg").should("be.visible");

      cy.get("[data-cy=phone-input] .phone").should("have.class", "error");
      cy.get("@phoneErrorMsg").should("be.visible");
    });

    it("Form with wrong phone can not be submitted", () => {
      cy.get("[data-cy=business-page]").should("be.visible");

      cy.get("[data-cy=user-block]").click();

      cy.get("[data-cy=modal-profile]").should("be.visible");

      cy.get("[data-cy=phone-input] input").as("phone");
      cy.get("@phone").type("09851020");

      cy.get("[data-cy=update-profile-button]").click();

      cy.get("[data-cy=input-error-message]").as("phoneErrorMsg");

      cy.get("[data-cy=phone-input] .phone").should("have.class", "error");
      cy.get("@phoneErrorMsg").should("be.visible");
    });
  });
  context("Button", () => {
    it("Open change password form", () => {
      cy.get("[data-cy=business-page]").should("be.visible");

      cy.get("[data-cy=user-block]").click();

      cy.get("[data-cy=modal-profile]").should("be.visible");

      cy.get("[data-cy=change-password-button]").click();

      cy.get("[data-cy=modal-change-password]").should("be.visible");
    });
  });
});
