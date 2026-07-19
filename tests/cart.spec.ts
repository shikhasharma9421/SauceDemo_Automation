import { test, expect } from '@playwright/test';
import { LoginPage } from '../pageobjects/LoginPage';
import { InventoryPage } from '../pageobjects/InventoryPage';
import { CartPage } from '../pageobjects/CartPage';
import { config } from '../utils/env';

test.describe('Cart Page', () => {

    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        loginPage     = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage      = new CartPage(page);

        await loginPage.goTo();
        await loginPage.login(config.standardUser.username, config.standardUser.password);
        await expect(page).toHaveURL(/inventory/);
    });

    test('TC01 - Cart page title is "Your Cart"', async () => {
        await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
        await inventoryPage.clickCartIcon();

        expect(await cartPage.getPageTitle()).toBe('Your Cart');
    });

    test('TC02 - Added products appear in the cart with correct names', async () => {
        await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
        await inventoryPage.addProductToCartByName('Sauce Labs Bike Light');
        await inventoryPage.clickCartIcon();

        expect(await cartPage.getCartItemCount()).toBe(2);
        expect(await cartPage.isProductInCart('Sauce Labs Backpack')).toBe(true);
        expect(await cartPage.isProductInCart('Sauce Labs Bike Light')).toBe(true);
    });

    test('TC03 - Cart item prices are displayed in $XX.XX format', async () => {
        await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
        await inventoryPage.clickCartIcon();

        const prices = await cartPage.getCartItemPrices();
        for (const price of prices) {
            expect(price).toMatch(/^\$\d+\.\d{2}$/);
        }
    });

    test('TC04 - Removing a product from the cart takes it out of the list', async () => {
        await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
        await inventoryPage.addProductToCartByName('Sauce Labs Bike Light');
        await inventoryPage.clickCartIcon();

        await cartPage.removeProductByName('Sauce Labs Backpack');

        expect(await cartPage.getCartItemCount()).toBe(1);
        expect(await cartPage.isProductInCart('Sauce Labs Backpack')).toBe(false);
        expect(await cartPage.isProductInCart('Sauce Labs Bike Light')).toBe(true);
    });

    test('TC05 - Continue Shopping button returns to the inventory page', async ({ page }) => {
        await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
        await inventoryPage.clickCartIcon();

        await cartPage.continueShopping();
        await expect(page).toHaveURL(/inventory/);
    });

    test('TC06 - Checkout button navigates to checkout step one', async ({ page }) => {
        await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
        await inventoryPage.clickCartIcon();

        await cartPage.clickCheckout();
        await expect(page).toHaveURL(/checkout-step-one/);
    });

    test('TC07 - Cart is empty when no products have been added', async () => {
        await inventoryPage.clickCartIcon();
        expect(await cartPage.getCartItemCount()).toBe(0);
    });

});
