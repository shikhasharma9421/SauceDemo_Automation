/**
 * @author Shikha Sharma
 * @description Product Details Page - SauceDemo Automation Framework
 *              (single-product view opened from the inventory grid)
 */

import { Page, Locator } from '@playwright/test';

export class ProductsPage {
    readonly page: Page;
    readonly productName: Locator;
    readonly productDesc: Locator;
    readonly productPrice: Locator;
    readonly productImage: Locator;
    readonly addToCartBtn: Locator;
    readonly removeFromCartBtn: Locator;
    readonly backToProductsBtn: Locator;
    readonly cartBadge: Locator;
    readonly cartIcon: Locator;

    constructor(page: Page) {
        this.page              = page;
        this.productName       = page.locator('.inventory_details_name');
        this.productDesc       = page.locator('.inventory_details_desc');
        this.productPrice      = page.locator('.inventory_details_price');
        this.productImage      = page.locator('.inventory_details_img');
        this.addToCartBtn      = page.locator('[data-test^="add-to-cart"]');
        this.removeFromCartBtn = page.locator('[data-test^="remove"]');
        this.backToProductsBtn = page.locator('[data-test="back-to-products"]');
        this.cartBadge         = page.locator('[data-test="shopping-cart-badge"]');
        this.cartIcon          = page.locator('[data-test="shopping-cart-link"]');
    }

    async getProductName(): Promise<string | null> {
        return await this.productName.textContent();
    }

    async getProductDescription(): Promise<string | null> {
        return await this.productDesc.textContent();
    }

    async getProductPrice(): Promise<string | null> {
        return await this.productPrice.textContent();
    }

    async addToCart(): Promise<void> {
        await this.addToCartBtn.click();
        await this.removeFromCartBtn.waitFor({ state: 'visible' });
    }

    async removeFromCart(): Promise<void> {
        await this.removeFromCartBtn.click();
        await this.addToCartBtn.waitFor({ state: 'visible' });
    }

    async isAddToCartVisible(): Promise<boolean> {
        return await this.addToCartBtn.isVisible();
    }

    async getCartBadgeCount(): Promise<number> {
        if (await this.cartBadge.isVisible()) {
            return parseInt((await this.cartBadge.textContent()) ?? '0', 10);
        }
        return 0;
    }

    async goBackToProducts(): Promise<void> {
        await this.backToProductsBtn.click();
    }

    async clickCartIcon(): Promise<void> {
        await this.cartIcon.click();
    }
}
