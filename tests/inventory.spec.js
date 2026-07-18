const { test, expect } = require('@playwright/test');
const { LoginPage }    = require('../pageobjects/LoginPage');
const { InventoryPage } = require('../pageobjects/InventoryPage');

test.describe('Inventory Page - Core Functionality', () => {

    let loginPage;
    let productsPage;

    test.beforeEach(async ({ page }) => {
        loginPage    = new LoginPage(page);
        productsPage = new InventoryPage(page);
        await loginPage.goTo();
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(/inventory/);
    });

    test('TC01 - Exactly 6 products are displayed on inventory page', async () => {
        const count = await productsPage.getProductCount();
        expect(count).toBe(6);
    });

    test('TC02 - Each product card has title, description, price, and Add to cart button', async () => {
        const cards = productsPage.productItems;
        const count = await cards.count();
        expect(count).toBe(6);

        for (let i = 0; i < count; i++) {
            const card    = cards.nth(i);
            const title   = (await card.locator('.inventory_item_name').textContent()).trim();
            const desc    = (await card.locator('.inventory_item_desc').textContent()).trim();
            const price   = (await card.locator('.inventory_item_price').textContent()).trim();
            const btnText = (await card.locator('[data-test^="add-to-cart"]').textContent()).trim();

            expect(title,   `Product ${i + 1}: title should not be empty`).toBeTruthy();
            expect(desc,    `Product ${i + 1}: description should not be empty`).toBeTruthy();
            expect(price,   `Product ${i + 1}: price should match $XX.XX format`).toMatch(/^\$\d+\.\d{2}$/);
            expect(btnText, `Product ${i + 1}: button text should be 'Add to cart'`).toBe('Add to cart');
        }
    });

    test('TC03 - Add to cart button changes to Remove after clicking', async () => {
        const targetProduct = 'Sauce Labs Backpack';
        const products      = productsPage.productItems;
        const count         = await products.count();

        for (let i = 0; i < count; i++) {
            const name = (await products.nth(i).locator('.inventory_item_name').textContent()).trim();
            if (name === targetProduct) {
                const addBtn = products.nth(i).locator('[data-test^="add-to-cart"]');
                await expect(addBtn).toHaveText('Add to cart');
                await addBtn.click();

                const removeBtn = products.nth(i).locator('[data-test^="remove"]');
                await expect(removeBtn).toHaveText('Remove');
                await expect(addBtn).not.toBeVisible();
                break;
            }
        }
    });

    test('TC04 - Cart badge increments to 1, 2, 3 as products are added one by one', async () => {
        await productsPage.addProductToCartByName('Sauce Labs Backpack');
        expect(await productsPage.getCartBadgeCount()).toBe(1);

        await productsPage.addProductToCartByName('Sauce Labs Bike Light');
        expect(await productsPage.getCartBadgeCount()).toBe(2);

        await productsPage.addProductToCartByName('Sauce Labs Bolt T-Shirt');
        expect(await productsPage.getCartBadgeCount()).toBe(3);
    });

    test('TC05 - Cart badge disappears after removing the only item', async () => {
        await productsPage.addProductToCartByName('Sauce Labs Backpack');
        await expect(productsPage.cartBadge).toBeVisible();

        await productsPage.removeProductFromCartByName('Sauce Labs Backpack');
        await expect(productsPage.cartBadge).not.toBeVisible();
    });

    test('TC06 - Default sort order on page load is Name A to Z', async () => {
        const names  = await productsPage.getProductNames();
        const sorted = [...names].sort((a, b) => a.localeCompare(b));
        expect(names).toEqual(sorted);
    });

    test('TC07 - Sorting by Price low to high displays products in ascending price order', async () => {
        await productsPage.sortBy('lohi');
        const prices = await productsPage.getProductPrices();
        const values = prices.map(p => parseFloat(p.replace('$', '')));
        const sorted = [...values].sort((a, b) => a - b);
        expect(values).toEqual(sorted);
    });

    test('TC08 - Clicking Sauce Labs Backpack title navigates to its detail page', async ({ page }) => {
        const targetProduct = 'Sauce Labs Backpack';
        const products      = productsPage.productItems;
        const count         = await products.count();

        for (let i = 0; i < count; i++) {
            const name = (await products.nth(i).locator('.inventory_item_name').textContent()).trim();
            if (name === targetProduct) {
                await products.nth(i).locator('.inventory_item_name').click();
                break;
            }
        }

        await expect(page).toHaveURL(/inventory-item/);
        await expect(page.locator('.inventory_details_name')).toHaveText(targetProduct);
    });

    test('TC09 - Logout via hamburger menu redirects to login page', async ({ page }) => {
        await productsPage.clickLogout();

        await expect(page).toHaveURL('/');
        await expect(loginPage.loginBtn).toBeVisible();
        await expect(loginPage.username).toBeVisible();
    });

    test('TC11 - Dynamically find product by name and add it to cart', async ({ page }) => {
        const targetProduct = 'Sauce Labs Fleece Jacket';

        await productsPage.addProductToCartByName(targetProduct);

        expect(await productsPage.getCartBadgeCount()).toBe(1);

        const products = productsPage.productItems;
        const count    = await products.count();

        for (let i = 0; i < count; i++) {
            const name = (await products.nth(i).locator('.inventory_item_name').textContent()).trim();
            if (name === targetProduct) {
                const removeBtn = products.nth(i).locator('[data-test^="remove"]');
                await expect(removeBtn).toHaveText('Remove');
                break;
            }
        }
    });

});

test.describe('Inventory Page - Access Control', () => {

    test('TC10 - Inventory page is not accessible without login and shows error', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await page.goto('/inventory.html');

        await expect(page).not.toHaveURL(/inventory/);
        await expect(loginPage.errorMsg).toContainText('Epic sadface');
    });

});
