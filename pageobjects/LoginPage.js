/**
 * @author Shikha Sharma
 * @description Login Page - SauceDemo Automation Framework
 */

class LoginPage {

    constructor(page) {
        this.page        = page;
        this.username    = page.locator('#user-name');
        this.password    = page.locator('#password');
        this.loginBtn    = page.locator('#login-button');
        this.errorMsg    = page.locator('[data-test="error"]');
        this.pagelogo    = page.locator('.login_logo');
    }

    async goTo() {
        await this.page.goto('/');
    }

    async login(username, password) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginBtn.click();
    }

    async getErrorMessage() {
        return await this.errorMsg.textContent();
    }

    async isLoginPageVisible() {
        return await this.username.isVisible();
    }

    async isPageLogoVisible() {
        return await this.pagelogo.isVisible();
    }

    async isLoginButtonEnabled() {
        return await this.loginBtn.isEnabled();
    }

    async getPageTitle() {
        return await this.page.title();
    }
}

module.exports = { LoginPage };