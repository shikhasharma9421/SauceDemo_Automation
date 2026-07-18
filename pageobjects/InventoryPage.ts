/**
 * @author Shikha Sharma
 * @description Inventory Page - SauceDemo Automation Framework
 */

import { Page, Locator } from '@playwright/test';

export class InventoryPage {
    readonly page: Page;
    readonly appLogo: Locator;
    readonly pageTitle: Locator;
    readonly productItems: Locator;
    readonly productDescs: Locator;
    readonly productPrices: Locator;
    readonly productNames: Locator;
    readonly addToCartBtn: Locator;
    readonly removeFromCartBtn: Locator;
    readonly sortDropdown: Locator;
    readonly cartBadge: Locator;
    readonly cartIcon: Locator;
    readonly menuBtn: Locator;
    readonly menuClose: Locator;
    readonly menuAllItems: Locator;
    readonly menuAbout: Locator;
    readonly menuLogout: Locator;
    readonly menuReset: Locator;

    constructor(page: Page) {
        this.page            = page;
        this.appLogo         = page.locator('.app_logo');
        this.pageTitle       = page.locator('.title');
        this.productItems    = page.locator('.inventory_item');
        this.productDescs    = page.locator('.inventory_item_desc');
        this.productPrices   = page.locator('.inventory_item_price');
        this.productNames    = page.locator('.inventory_item_name');
        this.addToCartBtn    = page.locator('[data-test^="add-to-cart"]');
        this.removeFromCartBtn = page.locator('[data-test^="remove"]');
        this.sortDropdown    = page.locator('[data-test="product-sort-container"]');
        this.cartBadge       = page.locator('[data-test="shopping-cart-badge"]');
        this.cartIcon        = page.locator('[data-test="shopping-cart-link"]');
        this.menuBtn         = page.locator('#react-burger-menu-btn');
        this.menuClose       = page.locator('#react-burger-cross-btn');
        this.menuAllItems    = page.locator('[data-test="inventory-sidebar-link"]');
        this.menuAbout       = page.locator('[data-test="about-sidebar-link"]');
        this.menuLogout      = page.locator('[data-test="logout-sidebar-link"]');
        this.menuReset       = page.locator('[data-test="reset-sidebar-link"]');
    }

    async goTo(): Promise<void> {
        await this.page.goto('/inventory.html');
    }

    async getPageLogo(): Promise<boolean> {
        return await this.appLogo.isVisible();
    }

    async getPageTitle(): Promise<string | null> {
        return await this.pageTitle.textContent();
    }

    async getProductCount(): Promise<number> {
        return await this.productItems.count();
    }

    async getProductNames(): Promise<string[]> {
        return await this.productNames.allTextContents();
    }

    async getProductPrices(): Promise<string[]> {
        return await this.productPrices.allTextContents();
    }

    async sortBy(option: string): Promise<void> {
        await this.sortDropdown.selectOption(option);
    }

    // Case 2: generic behaviour — "does cart count increase?", "does button change to Remove?"
    async addProductToCart(index = 0): Promise<void> {
        const count = await this.productItems.count();
        if (index >= count) throw new Error(`Product at index ${index} not found — only ${count} product(s) on page`);
        const item = this.productItems.nth(index);
        await item.locator('[data-test^="add-to-cart"]').click();
        await item.locator('[data-test^="remove"]').waitFor({ state: 'visible' });
    }

    async removeProductFromCart(index = 0): Promise<void> {
        const count = await this.productItems.count();
        if (index >= count) throw new Error(`Product at index ${index} not found — only ${count} product(s) on page`);
        const item = this.productItems.nth(index);
        await item.locator('[data-test^="remove"]').click();
        await item.locator('[data-test^="add-to-cart"]').waitFor({ state: 'visible' });
    }

    // Case 1: specific product — add "Sauce Labs Backpack" → verify it landed in cart
    async addProductToCartByName(productName: string): Promise<void> {
        const products = this.productItems;
        const count    = await products.count();

        for (let i = 0; i < count; i++) {
            const name = (await products.nth(i).locator('.inventory_item_name').textContent())?.trim();
            if (name === productName) {
                const item = products.nth(i);
                await item.locator('[data-test^="add-to-cart"]').click();
                await item.locator('[data-test^="remove"]').waitFor({ state: 'visible' });
                return;
            }
        }
        throw new Error(`Product "${productName}" not found on the page`);
    }

    async removeProductFromCartByName(productName: string): Promise<void> {
        const products = this.productItems;
        const count    = await products.count();

        for (let i = 0; i < count; i++) {
            const name = (await products.nth(i).locator('.inventory_item_name').textContent())?.trim();
            if (name === productName) {
                const item = products.nth(i);
                await item.locator('[data-test^="remove"]').click();
                await item.locator('[data-test^="add-to-cart"]').waitFor({ state: 'visible' });
                return;
            }
        }
        throw new Error(`Product "${productName}" not found on the page`);
    }

    async clickProductTitleByName(productName: string): Promise<boolean> {
        const products = this.productItems;
        const count    = await products.count();

        for (let i = 0; i < count; i++) {
            const name = (await products.nth(i).locator('.inventory_item_name').textContent())?.trim();
            if (name === productName) {
                await products.nth(i).locator('.inventory_item_name').click();
                return true;
            }
        }
        throw new Error(`Product "${productName}" not found on the page`);
    }

    async getCartBadgeCount(): Promise<number> {
        const badge = this.cartBadge;
        if (await badge.isVisible()) {
            return parseInt((await badge.textContent()) ?? '0', 10);
        }
        return 0;
    }

    async isCartBadgeVisible(): Promise<boolean> {
        return await this.cartBadge.isVisible();
    }

    async clickCartIcon(): Promise<void> {
        await this.cartIcon.click();
    }

    async clickProductName(index = 0): Promise<void> {
        await this.productNames.nth(index).click();
    }

    async clickProductImage(index = 0): Promise<void> {
        const images = this.page.locator('.inventory_item_img');
        await images.nth(index).click();
    }

    async openMenu(): Promise<void> {
        await this.menuBtn.click();
    }

    async closeMenu(): Promise<void> {
        await this.menuClose.click();
    }

    async clickLogout(): Promise<void> {
        await this.openMenu();
        await this.menuLogout.click();
    }

    async clickAllItems(): Promise<void> {
        await this.openMenu();
        await this.menuAllItems.click();
    }

    async clickResetAppState(): Promise<void> {
        await this.openMenu();
        await this.menuReset.click();
        await this.closeMenu();
    }
}
