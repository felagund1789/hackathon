import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

/**
 * Starter Login Tests
 *
 * These tests will fail initially because of bugs in LoginPage.ts.
 * Use Copilot Chat to diagnose the failures from the error messages.
 * After fixing the bugs, add new test cases by describing them to Copilot
 * in plain English (e.g., "Write a test that checks empty email shows an error").
 */

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;
  
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.waitForLoad();
  });
  
  test('should display login form', async () => {
    expect(await loginPage.isDisplayed()).toBe(true);
  });
  
  test('should login successfully with valid credentials', async ({ page }) => {
    // Arrange
    const validUsername = 'testuser@example.com';
    const validPassword = 'password123';
    
    // Act
    await loginPage.login(validUsername, validPassword);
    
    // Assert - Update this assertion based on your app's behavior
    await expect(page).not.toHaveURL(/login/);
  });
  
  test('should show error with invalid credentials', async () => {
    // Arrange
    const invalidUsername = 'invalid@example.com';
    const invalidPassword = 'wrongpassword';
    
    // Act
    await loginPage.login(invalidUsername, invalidPassword);
    
    // Assert
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });
  
  test('should show error with empty username', async () => {
    // Arrange & Act
    await loginPage.login('', 'somepassword');
    
    // Assert - Check for validation error or required field message
    // Update based on your app's validation behavior
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });
  
  test('should show error with empty password', async () => {
    // Arrange & Act
    await loginPage.login('testuser@example.com', '');
    
    // Assert
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });
  
  test('should navigate to forgot password page', async ({ page }) => {
    // Act
    await loginPage.goToForgotPassword();
    
    // Assert
    await expect(page).toHaveURL(/forgot|reset/);
  });
  
  test('should navigate to registration page', async ({ page }) => {
    // Act
    await loginPage.goToRegister();
    
    // Assert
    await expect(page).toHaveURL(/register|signup/);
  });
});
