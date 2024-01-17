describe("Forgot password page", () => {
  before(() => {
    cy.setupDB();
  });

  beforeEach(() => {
    cy.visit("/forgot");
  });

  it("Page is visible", () => {
    cy.get("[data-cy=forgot-password-page]").should("be.visible");
  });

  it("Email field exist and can get input data", () => {
    cy.get("[data-cy=email-input] input").as("email");

    cy.get("@email")
      .type("test_user@e2e.example.com")
      .should("have.value", "test_user@e2e.example.com");
  });

  it("Submit with correct data", () => {
    cy.get("[data-cy=email-input] input").as("email");

    cy.get("@email").type("user_one@e2e.example.com");

    cy.get("[data-cy=submit-button]").click();

    cy.get("[data-cy=success-notify]").should("be.visible");
    cy.get("[data-cy=close-notify]").click();
  });

  it("API error sending non-existent email", () => {
    cy.get("[data-cy=email-input] input").as("email");

    cy.get("@email").type("test_user@test.com");

    cy.get("[data-cy=submit-button]").click();

    cy.get("[data-cy=error-notify]").should("be.visible");
    cy.get("[data-cy=close-notify]").click();

    cy.url().should("contain", "/forgot");

    cy.get("[data-cy=forgot-password-page]").should("be.visible");
  });

  it("Empty form can not be submitted", () => {
    cy.get("[data-cy=submit-button]").click();

    cy.get("[data-cy=email-input]").as("email");
    cy.get("[data-cy=input-error-message]").as("emailErrorMsg");

    cy.get("@emailErrorMsg").should("be.visible");
  });

  it("Form with wrong email can not be submitted", () => {
    cy.get("[data-cy=email-input] input").as("email");

    cy.get("@email").type("test");

    cy.get("[data-cy=submit-button]").click();

    cy.get("[data-cy=input-error-message]").as("emailErrorMsg");

    cy.get("@email").should("have.class", "error-input");
    cy.get("@emailErrorMsg").should("be.visible");
  });

  it("Closing the forgot password page, going to the login page and it exists", () => {
    cy.get("[data-cy=login-link]").should("be.visible");
    cy.get("[data-cy=login-link]").click();

    cy.url().should("contain", "/login");

    cy.get("[data-cy=login-page]").should("be.visible");
  });
});
