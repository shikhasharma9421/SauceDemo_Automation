/**
 * @author Shikha Sharma
 * @description Checkout Page - SauceDemo Automation Framework
 *              (covers step one - info, step two - overview, and completion)
 */

import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
    readonly page: Page;

    // Step one - information
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueBtn: Locator;
    readonly cancelBtn: Locator;
    readonly errorMsg: Locator;

    // Step two - overview
    readonly cartItems: Locator;
    readonly cartItemNames: Locator;
    readonly subtotalLabel: Locator;
    readonly taxLabel: Locator;
    readonly totalLabel: Locator;
    readonly finishBtn: Locator;

    // Complete
    readonly completeHeader: Locator;
    readonly completeText: Locator;
    readonly backHomeBtn: Locator;

    constructor(page: Page) {
        this.page            = page;

        this.firstNameInput  = page.locator('[data-test="firstName"]');
        this.lastNameInput   = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueBtn     = page.locator('[data-test="continue"]');
        this.cancelBtn       = page.locator('[data-test="cancel"]');
        this.errorMsg        = page.locator('[data-test="error"]');

        this.cartItems       = page.locator('.cart_item');
        this.cartItemNames   = page.locator('.inventory_item_name');
        this.subtotalLabel   = page.locator('.summary_subtotal_label');
        this.taxLabel        = page.locator('.summary_tax_label');
        this.totalLabel      = page.locator('.summary_total_label');
        this.finishBtn       = page.locator('[data-test="finish"]');

        this.completeHeader  = page.locator('.complete-header');
        this.completeText    = page.locator('.complete-text');
        this.backHomeBtn     = page.locator('[data-test="back-to-products"]');
    }

    async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }

    async clickContinue(): Promise<void> {
        await this.continueBtn.click();
    }

    async clickCancel(): Promise<void> {
        await this.cancelBtn.click();
    }

    async getErrorMessage(): Promise<string | null> {
        return await this.errorMsg.textContent();
    }

    async getOverviewItemNames(): Promise<string[]> {
        return await this.cartItemNames.allTextContents();
    }

    async getSubtotal(): Promise<string | null> {
        return await this.subtotalLabel.textContent();
    }

    async getTax(): Promise<string | null> {
        return await this.taxLabel.textContent();
    }

    async getTotal(): Promise<string | null> {
        return await this.totalLabel.textContent();
    }

    async clickFinish(): Promise<void> {
        await this.finishBtn.click();
    }

    async getCompleteHeader(): Promise<string | null> {
        return await this.completeHeader.textContent();
    }

    async getCompleteText(): Promise<string | null> {
        return await this.completeText.textContent();
    }

    async isOrderComplete(): Promise<boolean> {
        return await this.completeHeader.isVisible();
    }

    async clickBackHome(): Promise<void> {
        await this.backHomeBtn.click();
    }
}
