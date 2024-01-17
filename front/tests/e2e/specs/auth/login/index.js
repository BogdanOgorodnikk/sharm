const PASSWORD_MIN_LENGTH = 8;

describe("Login page", () => {
  before(() => {
    cy.setupDB();
  });

  beforeEach(() => {
    cy.visit("/login");
  });

  it("Page is visible", () => {
    cy.get("[data-cy=login-page]").should("be.visible");
  });

  context("Form fields", () => {
    it("Submit with correct data", () => {
      cy.get("[data-cy=email-input] input").as("email");
      cy.get("[data-cy=password-input] input").as("password");

      cy.get("@email").type("user_two@e2e.example.com");
      cy.get("@password").type("11111111");

      cy.get("[data-cy=login-button]").click();

      cy.url().should("contain", "/");
      cy.get("[data-cy=business-page]").should("be.visible");
    });
    it("Empty form can not be submitted", () => {
      cy.get("[data-cy=login-button]").click();

      cy.get("[data-cy=email-input] input").as("email");
      cy.get("[data-cy=input-error-message]").as("emailErrorMsg");

      cy.get("[data-cy=password-input] input").as("password");
      cy.get("[data-cy=input-error-message]").as("passwordErrorMsg");

      cy.get("@email").should("have.class", "error-input");
      cy.get("@emailErrorMsg").should("be.visible");

      cy.get("@password").should("have.class", "error-input");
      cy.get("@passwordErrorMsg").should("be.visible");
    });
    it("Form with wrong email can not be submitted", () => {
      cy.get("[data-cy=email-input] input").as("email");

      cy.get("@email").type("test");

      cy.get("[data-cy=login-button]").click();

      cy.get("[data-cy=input-error-message]").as("emailErrorMsg");

      cy.get("@email").should("have.class", "error-input");
      cy.get("@emailErrorMsg").should("be.visible");
    });

    it(`Form with password less than ${PASSWORD_MIN_LENGTH} symbols cannot be submitted`, () => {
      cy.get("[data-cy=password-input] input").as("password");

      cy.get("@password").type("123");

      cy.get("[data-cy=login-button]").click();

      cy.get("[data-cy=input-error-message]").as("passwordErrorMsg");

      cy.get("@password").should("have.class", "error-input");

      cy.get("@passwordErrorMsg").should("be.visible");
      cy.get("@passwordErrorMsg").should("contain", PASSWORD_MIN_LENGTH);
    });

    it("Submit with wrong password", () => {
      cy.get("[data-cy=email-input] input").as("email");
      cy.get("[data-cy=password-input] input").as("password");

      cy.get("@email").type("yoda@i.ua");
      cy.get("@password").type("wrong-password");

      cy.get("[data-cy=login-button]").click();

      cy.url().should("contain", "/login");
      cy.get("[data-cy=error-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
    });

    context("Links", () => {
      it("Followed sign up link, and page exist", () => {
        cy.get("[data-cy=signup-link]").should("be.visible");
        cy.get("[data-cy=signup-link]").click();

        cy.url().should("contain", "/signup");

        cy.get("[data-cy=signup-page]").should("be.visible");
      });

      it("Followed password recovery link, and page exist", () => {
        cy.get("[data-cy=forgot-password]").should("be.visible");
        cy.get("[data-cy=forgot-password").click();

        cy.url().should("contain", "/forgot");

        cy.get("[data-cy=forgot-password-page]").should("be.visible");
      });
    });
  });
});
