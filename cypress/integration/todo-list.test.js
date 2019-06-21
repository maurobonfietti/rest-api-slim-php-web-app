
describe("ToDo List Tests", () => {

    beforeEach(function () {
        cy.server();
        cy.visit("/");
    });

    it("Login Successful", () => {
        cy.title().should('include', 'ToDo List');
        cy.get('#btn-login').should('contain', 'Entrar');
        cy.contains('INICIA SESIÓN');
        cy.contains('Tu email');
        cy.contains('Tu contraseña');
        cy.get('#username')
            .type('test@example.com')
            .should('have.value', 'test@example.com');
        cy.get('#userpass')
            .type('12345678')
            .should('have.value', '12345678');
        cy.contains('Entrar').click();
        cy.url().should('include', 'index/1');
        cy.contains('tareas');
        cy.contains('Salir');
    });

    it("Login Error", () => {
        cy.title().should('include', 'ToDo List');
        cy.get('#btn-login').should('contain', 'Entrar');
        cy.contains('INICIA SESIÓN');
        cy.contains('Tu email');
        cy.contains('Tu contraseña');
        cy.get('#username')
            .type('test@example.com')
            .should('have.value', 'test@example.com');
        cy.get('#userpass')
            .type('123')
            .should('have.value', '123');
        cy.contains('Entrar').click();
        cy.contains('INICIA SESIÓN');
        cy.contains('Tu email');
        cy.contains('Tu contraseña');
    });

});
