/**
 * @author Shikha Sharma
 * @description Inventory Page - SauceDemo Automation Framework
 */

class InventoryPage {

    constructor(page) {
        this.page            = page;
        this.appLogo         = page.locator('.app_logo');
        this.pageTitle       = page.locator('.title');
        this.productItems    = page.locator('.inventory_item');
        this.productDescs    = page.locator('.inventory_item_desc');
        this.productPrices   = page.locator('.inventory_item_price');
        this.productNames    = page.locator('.inventory_item_name');
        this.addToCartBtn    = page.locator('[data-test^="add-to-cart"]');
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

    async goTo() {
        await this.page.goto('/inventory.html');
    }

    async getPageTitle() {
        return await this.pageTitle.textContent();
    }

    async getProductCount() {
        return await this.productItems.count();
    }

    async getProductNames() {
        return await this.productNames.allTextContents();
    }

    async getProductPrices() {
        return await this.productPrices.allTextContents();
    }

    async sortBy(option) {
        await this.sortDropdown.selectOption(option);
    }

    async addProductToCart(index = 0) {
        const addButtons = this.page.locator('[data-test^="add-to-cart"]');
        await addButtons.nth(index).click();
    }

    async removeProductFromCart(index = 0) {
        const removeButtons = this.page.locator('[data-test^="remove"]');
        await removeButtons.nth(index).click();
    }

    async addProductToCartByName(productName) {
        const products = this.productItems;
        const count    = await products.count();

        for (let i = 0; i < count; i++) {
            const name = (await products.nth(i).locator('.inventory_item_name').textContent()).trim();
            if (name === productName) {
                await products.nth(i).locator('[data-test^="add-to-cart"]').click();
                return true;
            }
        }
        throw new Error(`Product "${productName}" not found on the page`);
    }

    async removeProductFromCartByName(productName) {
        const products = this.productItems;
        const count    = await products.count();

        for (let i = 0; i < count; i++) {
            const name = (await products.nth(i).locator('.inventory_item_name').textContent()).trim();
            if (name === productName) {
                await products.nth(i).locator('[data-test^="remove"]').click();
                return true;
            }
        }
        throw new Error(`Product "${productName}" not found on the page`);
    }

    async clickProductTitleByName(productName) {
        const products = this.productItems;
        const count    = await products.count();

        for (let i = 0; i < count; i++) {
            const name = (await products.nth(i).locator('.inventory_item_name').textContent()).trim();
            if (name === productName) {
                await products.nth(i).locator('.inventory_item_name').click();
                return true;
            }
        }
        throw new Error(`Product "${productName}" not found on the page`);
    }

    async getCartBadgeCount() {
        const badge = this.cartBadge;
        if (await badge.isVisible()) {
            return parseInt(await badge.textContent(), 10);
        }
        return 0;
    }

    async isCartBadgeVisible() {
        return await this.cartBadge.isVisible();
    }

    async clickCartIcon() {
        await this.cartIcon.click();
    }

    async clickProductName(index = 0) {
        await this.productNames.nth(index).click();
    }

    async clickProductImage(index = 0) {
        const images = this.page.locator('.inventory_item_img');
        await images.nth(index).click();
    }

    async openMenu() {
        await this.menuBtn.click();
    }

    async closeMenu() {
        await this.menuClose.click();
    }

    async clickLogout() {
        await this.openMenu();
        await this.menuLogout.click();
    }

    async clickAllItems() {
        await this.openMenu();
        await this.menuAllItems.click();
    }

    async clickResetAppState() {
        await this.openMenu();
        await this.menuReset.click();
        await this.closeMenu();
    }
}

module.exports = { InventoryPage };
