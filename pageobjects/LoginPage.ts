/**
 * @author Shikha Sharma
 * @description Login Page - SauceDemo Automation Framework
 */

import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly username: Locator;
    readonly password: Locator;
    readonly loginBtn: Locator;
    readonly errorMsg: Locator;
    readonly pagelogo: Locator;

    constructor(page: Page) {
        this.page        = page;
        this.username    = page.locator('#user-name');
        this.password    = page.locator('#password');
        this.loginBtn    = page.locator('#login-button');
        this.errorMsg    = page.locator('[data-test="error"]');
        this.pagelogo    = page.locator('.login_logo');
    }

    async goTo(): Promise<void> {
        await this.page.goto('/');
    }

    async login(username: string, password: string): Promise<void> {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginBtn.click();
    }

    async getErrorMessage(): Promise<string | null> {
        return await this.errorMsg.textContent();
    }

    async isLoginPageVisible(): Promise<boolean> {
        return await this.username.isVisible();
    }

    async isPageLogoVisible(): Promise<boolean> {
        return await this.pagelogo.isVisible();
    }

    async isLoginButtonEnabled(): Promise<boolean> {
        return await this.loginBtn.isEnabled();
    }

    async getPageTitle(): Promise<string> {
        return await this.page.title();
    }
}
