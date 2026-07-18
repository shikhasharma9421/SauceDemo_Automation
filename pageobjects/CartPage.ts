/**
 * @author Shikha Sharma
 * @description Cart Page - SauceDemo Automation Framework
 */

import { Page, Locator } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly pageTitle: Locator;
    readonly cartItems: Locator;
    readonly cartItemNames: Locator;
    readonly cartItemPrices: Locator;
    readonly cartItemQuantities: Locator;
    readonly removeBtn: Locator;
    readonly continueShoppingBtn: Locator;
    readonly checkoutBtn: Locator;

    constructor(page: Page) {
        this.page                = page;
        this.pageTitle           = page.locator('.title');
        this.cartItems           = page.locator('.cart_item');
        this.cartItemNames       = page.locator('.inventory_item_name');
        this.cartItemPrices      = page.locator('.inventory_item_price');
        this.cartItemQuantities  = page.locator('.cart_quantity');
        this.removeBtn           = page.locator('[data-test^="remove"]');
        this.continueShoppingBtn = page.locator('[data-test="continue-shopping"]');
        this.checkoutBtn         = page.locator('[data-test="checkout"]');
    }

    async goTo(): Promise<void> {
        await this.page.goto('/cart.html');
    }

    async getPageTitle(): Promise<string | null> {
        return await this.pageTitle.textContent();
    }

    async getCartItemCount(): Promise<number> {
        return await this.cartItems.count();
    }

    async getCartItemNames(): Promise<string[]> {
        return await this.cartItemNames.allTextContents();
    }

    async getCartItemPrices(): Promise<string[]> {
        return await this.cartItemPrices.allTextContents();
    }

    async isProductInCart(productName: string): Promise<boolean> {
        const names = await this.getCartItemNames();
        return names.map(n => n.trim()).includes(productName);
    }

    async removeProductByName(productName: string): Promise<void> {
        const items = this.cartItems;
        const count = await items.count();

        for (let i = 0; i < count; i++) {
            const name = (await items.nth(i).locator('.inventory_item_name').textContent())?.trim();
            if (name === productName) {
                await items.nth(i).locator('[data-test^="remove"]').click();
                return;
            }
        }
        throw new Error(`Product "${productName}" not found in cart`);
    }

    async continueShopping(): Promise<void> {
        await this.continueShoppingBtn.click();
    }

    async clickCheckout(): Promise<void> {
        await this.checkoutBtn.click();
    }
}
