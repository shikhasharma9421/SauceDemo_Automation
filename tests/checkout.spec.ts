import { test, expect } from '@playwright/test';
import { LoginPage } from '../pageobjects/LoginPage';
import { InventoryPage } from '../pageobjects/InventoryPage';
import { CartPage } from '../pageobjects/CartPage';
import { CheckoutPage } from '../pageobjects/CheckoutPage';

test.describe('Checkout Page', () => {

    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        loginPage     = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage      = new CartPage(page);
        checkoutPage  = new CheckoutPage(page);

        await loginPage.goTo();
        await loginPage.login('standard_user', 'secret_sauce');
        await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
        await inventoryPage.clickCartIcon();
        await cartPage.clickCheckout();
        await expect(page).toHaveURL(/checkout-step-one/);
    });

    test('TC01 - Missing first name shows an error', async () => {
        await checkoutPage.fillCheckoutInfo('', 'Sharma', '110001');
        await checkoutPage.clickContinue();

        expect(await checkoutPage.getErrorMessage()).toContain('First Name is required');
    });

    test('TC02 - Missing last name shows an error', async () => {
        await checkoutPage.fillCheckoutInfo('Shikha', '', '110001');
        await checkoutPage.clickContinue();

        expect(await checkoutPage.getErrorMessage()).toContain('Last Name is required');
    });

    test('TC03 - Missing postal code shows an error', async () => {
        await checkoutPage.fillCheckoutInfo('Shikha', 'Sharma', '');
        await checkoutPage.clickContinue();

        expect(await checkoutPage.getErrorMessage()).toContain('Postal Code is required');
    });

    test('TC04 - Valid info navigates to the checkout overview', async ({ page }) => {
        await checkoutPage.fillCheckoutInfo('Shikha', 'Sharma', '110001');
        await checkoutPage.clickContinue();

        await expect(page).toHaveURL(/checkout-step-two/);
    });

    test('TC05 - Overview lists the checked-out product', async () => {
        await checkoutPage.fillCheckoutInfo('Shikha', 'Sharma', '110001');
        await checkoutPage.clickContinue();

        const items = await checkoutPage.getOverviewItemNames();
        expect(items).toContain('Sauce Labs Backpack');
    });

    test('TC06 - Overview shows subtotal, tax, and total', async () => {
        await checkoutPage.fillCheckoutInfo('Shikha', 'Sharma', '110001');
        await checkoutPage.clickContinue();

        expect(await checkoutPage.getSubtotal()).toContain('Item total');
        expect(await checkoutPage.getTax()).toContain('Tax');
        expect(await checkoutPage.getTotal()).toContain('Total');
    });

    test('TC07 - Cancel on step one returns to the cart page', async ({ page }) => {
        await checkoutPage.clickCancel();
        await expect(page).toHaveURL(/cart/);
    });

    test('TC08 - Finishing the order shows the confirmation message', async () => {
        await checkoutPage.fillCheckoutInfo('Shikha', 'Sharma', '110001');
        await checkoutPage.clickContinue();
        await checkoutPage.clickFinish();

        expect(await checkoutPage.isOrderComplete()).toBe(true);
        expect(await checkoutPage.getCompleteHeader()).toContain('Thank you for your order!');
    });

    test('TC09 - Back Home button returns to the inventory page after order completion', async ({ page }) => {
        await checkoutPage.fillCheckoutInfo('Shikha', 'Sharma', '110001');
        await checkoutPage.clickContinue();
        await checkoutPage.clickFinish();

        await checkoutPage.clickBackHome();
        await expect(page).toHaveURL(/inventory/);
    });

});
