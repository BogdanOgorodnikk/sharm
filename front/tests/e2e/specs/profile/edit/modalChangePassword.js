const PASSWORD_MIN_LENGTH = 8;

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

    cy.get("[data-cy=change-password-button]").click();

    cy.get("[data-cy=modal-change-password]").should("be.visible");
  });

  context("Form fields", () => {
    it("Form fields exist and can change user password", () => {
      cy.get("[data-cy=business-page]").should("be.visible");

      cy.get("[data-cy=user-block]").click();
      cy.get("[data-cy=modal-profile]").should("be.visible");

      cy.get("[data-cy=change-password-button]").click();
      cy.get("[data-cy=modal-change-password]").should("be.visible");

      cy.get("[data-cy=current-password-input] input").as("currentPassword");
      cy.get("[data-cy=new-password-input] input").as("newPassword");

      cy.get("@currentPassword").type("11111111");
      cy.get("@newPassword").type("12345678");

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();

      cy.get("@currentPassword").type("12345678");
      cy.get("@newPassword").type("11111111");

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=success-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
    });

    it("Empty form can not be submitted", () => {
      cy.get("[data-cy=business-page]").should("be.visible");

      cy.get("[data-cy=user-block]").click();
      cy.get("[data-cy=modal-profile]").should("be.visible");

      cy.get("[data-cy=change-password-button]").click();
      cy.get("[data-cy=modal-change-password]").should("be.visible");

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=current-password-input] input").as("currentPassword");
      cy.get("[data-cy=input-error-message]").as("currentPasswordErrorMsg");

      cy.get("[data-cy=new-password-input] input").as("newPassword");
      cy.get("[data-cy=input-error-message]").as("newPasswordErrorMsg");

      cy.get("@currentPassword").should("have.class", "error-input");
      cy.get("@currentPasswordErrorMsg").should("be.visible");

      cy.get("@newPassword").should("have.class", "error-input");
      cy.get("@newPasswordErrorMsg").should("be.visible");
    });

    it(`Form with password less than ${PASSWORD_MIN_LENGTH} symbols cannot be submitted`, () => {
      cy.get("[data-cy=business-page]").should("be.visible");

      cy.get("[data-cy=user-block]").click();
      cy.get("[data-cy=modal-profile]").should("be.visible");

      cy.get("[data-cy=change-password-button]").click();
      cy.get("[data-cy=modal-change-password]").should("be.visible");

      cy.get("[data-cy=current-password-input] input").as("currentPassword");
      cy.get("@currentPassword").type("123456");

      cy.get("[data-cy=new-password-input] input").as("newPassword");
      cy.get("@newPassword").type("123456");

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=input-error-message]").as("currentPasswordErrorMsg");
      cy.get("[data-cy=input-error-message]").as("newPasswordErrorMsg");

      cy.get("@currentPassword").should("have.class", "error-input");
      cy.get("@currentPasswordErrorMsg").should("be.visible");

      cy.get("@newPassword").should("have.class", "error-input");
      cy.get("@newPasswordErrorMsg").should("be.visible");
    });

    it(`Form with wrong current password cannot be submitted`, () => {
      cy.get("[data-cy=business-page]").should("be.visible");

      cy.get("[data-cy=user-block]").click();
      cy.get("[data-cy=modal-profile]").should("be.visible");

      cy.get("[data-cy=change-password-button]").click();
      cy.get("[data-cy=modal-change-password]").should("be.visible");

      cy.get("[data-cy=current-password-input] input").as("currentPassword");
      cy.get("@currentPassword").type("1234561111");

      cy.get("[data-cy=new-password-input] input").as("newPassword");
      cy.get("@newPassword").type("12345678");

      cy.get("[data-cy=submit-button]").click();

      cy.get("[data-cy=error-notify]").should("be.visible");
      cy.get("[data-cy=close-notify]").click();
    });
  });
  context("Buttons", () => {
    it("Open update profile form using back button", () => {
      cy.get("[data-cy=business-page]").should("be.visible");

      cy.get("[data-cy=user-block]").click();

      cy.get("[data-cy=modal-profile]").should("be.visible");

      cy.get("[data-cy=change-password-button]").click();

      cy.get("[data-cy=modal-change-password]").should("be.visible");

      cy.get("[data-cy=change-password-back-button]").click();
      cy.get("[data-cy=modal-profile]").should("be.visible");
    });

    it("Open update profile form using arrow button", () => {
      cy.get("[data-cy=business-page]").should("be.visible");

      cy.get("[data-cy=user-block]").click();

      cy.get("[data-cy=modal-profile]").should("be.visible");

      cy.get("[data-cy=change-password-button]").click();

      cy.get("[data-cy=modal-change-password]").should("be.visible");

      cy.get("[data-cy=modal-arrow-button]").click();
      cy.get("[data-cy=modal-profile]").should("be.visible");
    });
  });
});
