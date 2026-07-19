import { test, expect } from '@playwright/test';
import { LoginPage } from '../pageobjects/LoginPage';
import { InventoryPage } from '../pageobjects/InventoryPage';
import { CartPage } from '../pageobjects/CartPage';
import { CheckoutPage } from '../pageobjects/CheckoutPage';
import { config } from '../utils/env';

test.describe('End-to-End Purchase Flow', () => {

    test('Standard user can log in, add products to cart, and complete checkout', async ({ page }) => {
        const loginPage    = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);
        const cartPage     = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        // 1. Log in
        await loginPage.goTo();
        await loginPage.login(config.standardUser.username, config.standardUser.password);
        await expect(page).toHaveURL(/inventory/);

        // 2. Add products to cart from the inventory page
        await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
        await inventoryPage.addProductToCartByName('Sauce Labs Bike Light');
        expect(await inventoryPage.getCartBadgeCount()).toBe(2);

        // 3. Go to cart and verify the products landed there
        await inventoryPage.clickCartIcon();
        await expect(page).toHaveURL(/cart/);
        expect(await cartPage.getCartItemCount()).toBe(2);
        expect(await cartPage.isProductInCart('Sauce Labs Backpack')).toBe(true);
        expect(await cartPage.isProductInCart('Sauce Labs Bike Light')).toBe(true);

        // 4. Proceed to checkout and fill in customer info
        await cartPage.clickCheckout();
        await expect(page).toHaveURL(/checkout-step-one/);
        await checkoutPage.fillCheckoutInfo('Shikha', 'Sharma', '110001');
        await checkoutPage.clickContinue();

        // 5. Verify the order overview before finishing
        await expect(page).toHaveURL(/checkout-step-two/);
        const overviewItems = await checkoutPage.getOverviewItemNames();
        expect(overviewItems).toContain('Sauce Labs Backpack');
        expect(overviewItems).toContain('Sauce Labs Bike Light');

        // 6. Complete the order
        await checkoutPage.clickFinish();
        await expect(page).toHaveURL(/checkout-complete/);
        expect(await checkoutPage.isOrderComplete()).toBe(true);
        expect(await checkoutPage.getCompleteHeader()).toContain('Thank you for your order!');

        // 7. Return to the products page
        await checkoutPage.clickBackHome();
        await expect(page).toHaveURL(/inventory/);
    });

});
