import { test, expect } from '@playwright/test';
import { LoginPage } from '../pageobjects/LoginPage';
import { InventoryPage } from '../pageobjects/InventoryPage';
import { ProductsPage } from '../pageobjects/ProductsPage';

test.describe('Product Details Page', () => {

    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let productsPage: ProductsPage;

    test.beforeEach(async ({ page }) => {
        loginPage     = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        productsPage  = new ProductsPage(page);

        await loginPage.goTo();
        await loginPage.login('standard_user', 'secret_sauce');
        await inventoryPage.clickProductTitleByName('Sauce Labs Backpack');
        await expect(page).toHaveURL(/inventory-item/);
    });

    test('TC01 - Product detail page shows the selected product name', async () => {
        expect(await productsPage.getProductName()).toBe('Sauce Labs Backpack');
    });

    test('TC02 - Description and price are visible', async () => {
        expect(await productsPage.getProductDescription()).toBeTruthy();
        expect(await productsPage.getProductPrice()).toMatch(/^\$\d+\.\d{2}$/);
    });

    test('TC03 - Add to cart from detail page updates the cart badge', async () => {
        await productsPage.addToCart();
        expect(await productsPage.getCartBadgeCount()).toBe(1);
    });

    test('TC04 - Remove from cart from detail page shows Add to cart again', async () => {
        await productsPage.addToCart();
        await productsPage.removeFromCart();

        expect(await productsPage.isAddToCartVisible()).toBe(true);
    });

    test('TC05 - Back to products button returns to the inventory listing', async ({ page }) => {
        await productsPage.goBackToProducts();
        await expect(page).toHaveURL(/inventory\.html/);
    });

    test('TC06 - Cart icon navigates to the cart page', async ({ page }) => {
        await productsPage.addToCart();
        await productsPage.clickCartIcon();
        await expect(page).toHaveURL(/cart/);
    });

});
