# Stage 3: Expanding Test Coverage

[Back to QA Tester Track](../qa-tester-track.md)

**Difficulty:** ⭐⭐⭐ | **Time:** 60-90 min

Login tests are passing. Now expand coverage to the core shopping flow and run tests across browsers.

## Tasks

1. **Generate page objects with Copilot**: Open the `CatalogPage.ts` skeleton in `tests/pages/`. Use Copilot to build it out. Share context by opening the eShop catalog page in your browser, inspecting the key elements, and telling Copilot:
   - "Here are the elements on the catalog page: [paste selectors]. Create a CatalogPage class following the BasePage pattern in `BasePage.ts`."
   - Ask Copilot to also generate a `BasketPage.ts` for the shopping cart page.

2. **Build a shopping flow test**: Describe the full user journey to Copilot and ask it to generate a test:
   - "Write a Playwright test that logs in, browses the catalog, adds a product to the basket, then verifies the basket shows the correct item and quantity."
   Review the generated test. Does it follow a realistic user flow? Adjust prompts and regenerate if needed.

3. **Run across browsers**: The `playwright.config.ts` already includes Chromium, Firefox, and WebKit. Run `npx playwright test` -- it will execute on all browsers. If tests fail on some browsers but not others, paste the error into Copilot Chat and ask for help diagnosing browser-specific issues.

4. **Mobile viewport testing**: Run tests against the Pixel 5 mobile profile (already configured). Ask Copilot: "The test fails on mobile because the menu is collapsed. How do I handle a hamburger menu in Playwright?" Apply the fix.

5. **Screenshot comparison**: Ask Copilot to add screenshot capture to key test steps (catalog page, basket page). Save them to a `screenshots/` directory. Compare screenshots across browsers manually -- note any layout differences.

## Verification

- `CatalogPage.ts` and `BasketPage.ts` are implemented and follow the `BasePage` pattern
- Shopping flow test passes end-to-end
- Tests run on Chromium, Firefox, and WebKit (document any browser-specific fixes)
- Mobile viewport test passes or has documented workarounds
- Screenshots saved for at least 2 browsers

## What Copilot Helps With vs. What Requires Your Judgment

Copilot generates page objects and browser configuration well. But when a test passes on Chromium and fails on WebKit, diagnosing the root cause (timing, rendering, event handling) takes testing experience. Copilot can suggest fixes, but you need to verify they actually solve the problem rather than just masking it.

---

Previous: [Stage 2: Your First Automated Tests with Copilot](stage-2-page-objects.md) | Next: [Stage 4: AI-Driven Testing with Playwright MCP](stage-4-ai-driven.md)
