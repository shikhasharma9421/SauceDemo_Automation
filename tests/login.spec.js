const { test, expect } = require('@playwright/test');
const { LoginPage }    = require('../pageobjects/LoginPage');

test.describe('Login Tests', () => {

    let loginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goTo();
    });

    test('Successful login with valid credentials', async ({ page }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(/inventory/);
    });

    test('Login with wrong password shows error', async () => {
        await loginPage.login('standard_user', 'wrongpass');
        const error = await loginPage.getErrorMessage();
        expect(error).toContain('Username and password do not match');
    });

    test('Locked out user cannot login', async () => {
        await loginPage.login('locked_out_user', 'secret_sauce');
        const error = await loginPage.getErrorMessage();
        expect(error).toContain('Sorry, this user has been locked out');
    });

    test('Empty username shows error', async () => {
        await loginPage.login('', 'secret_sauce');
        const error = await loginPage.getErrorMessage();
        expect(error).toContain('Username is required');
    });

});