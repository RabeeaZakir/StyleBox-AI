/**
 * ======================================================
 * StyleBox AI — AI-Generated Test Suite (Assignment 4)
 * ======================================================
 * These test cases were generated with the help of an AI
 * assistant (Claude) after describing the app's requirements:
 *   - randomItem() should return a matching item, or null if none exist
 *   - mostUsedColor() should return the color that appears most often
 *   - showCompatibility() should score outfits based on color matching
 *   - outfitHTML() should render a filled slot or an empty-state slot
 *   - getFavoriteIconClass() should reflect the favorite boolean
 *
 * Each describe() block below covers: a normal/functional case,
 * at least one edge case, and (where relevant) an error/invalid case.
 */

const fs = require("fs");
const path = require("path");

let app;

beforeEach(() => {
  // Load the real index.html into jsdom so every getElementById()
  // call inside script.js resolves against actual page elements.
  const html = fs.readFileSync(
    path.resolve(__dirname, "../index.html"),
    "utf8",
  );
  document.documentElement.innerHTML = html;

  // jsdom does not implement window.confirm / window.alert — stub them
  window.confirm = jest.fn(() => true);
  window.alert = jest.fn();
  window.scrollTo = jest.fn();

  // Start each test with a clean, empty localStorage
  window.localStorage.clear();

  // Re-require script.js fresh for every test so wardrobe state resets
  jest.resetModules();
  app = require("../js/script.js");
});

describe("randomItem()", () => {
  test("returns an item belonging to the requested category", () => {
    const item = app.randomItem("Shoes");
    expect(item).not.toBeNull();
    expect(item.category).toBe("Shoes");
  });

  test("edge case: returns null when the wardrobe has no items in that category", () => {
    app.wardrobe.length = 0; // empty the wardrobe entirely
    const item = app.randomItem("Top");
    expect(item).toBeNull();
  });

  test("error case: returns null for a category that does not exist at all", () => {
    const item = app.randomItem("Swimwear");
    expect(item).toBeNull();
  });
});

describe("mostUsedColor()", () => {
  test("returns the color that appears most frequently in the wardrobe", () => {
    // demo wardrobe has 2x Black, 2x White, others 1x each
    expect(app.mostUsedColor()).toBe("Black");
  });

  test("edge case: returns '-' when the wardrobe is empty", () => {
    app.wardrobe.length = 0;
    expect(app.mostUsedColor()).toBe("-");
  });
});

describe("getFavoriteIconClass()", () => {
  test("returns 'solid' when the item is marked favorite", () => {
    expect(app.getFavoriteIconClass(true)).toBe("solid");
  });

  test("returns 'regular' when the item is not a favorite", () => {
    expect(app.getFavoriteIconClass(false)).toBe("regular");
  });
});

describe("outfitHTML()", () => {
  test("renders item name and color when an item is provided", () => {
    const item = { name: "Blue Jeans", color: "Blue", image: "jeans.png" };
    const html = app.outfitHTML(item, "👖", "Bottom");
    expect(html).toContain("Blue Jeans");
    expect(html).toContain("Blue");
  });

  test("edge case: renders a 'No Item' placeholder when item is null", () => {
    const html = app.outfitHTML(null, "👕", "Top");
    expect(html).toContain("No Item");
    expect(html).toContain("Top");
  });
});

describe("showCompatibility()", () => {
  test("gives a base score of 70% when no colors match at all", () => {
    const top = { color: "Red" };
    const bottom = { color: "Green" };
    const shoes = { color: "Blue" };
    expect(app.showCompatibility(top, bottom, shoes)).toBe(70);
  });

  test("adds 10% for each matching color pair (top+bottom match here)", () => {
    const top = { color: "Black" };
    const bottom = { color: "Black" };
    const shoes = { color: "White" };
    expect(app.showCompatibility(top, bottom, shoes)).toBe(80);
  });

  test("edge case: score is capped at 100% even if every piece matches", () => {
    const top = { color: "Black" };
    const bottom = { color: "Black" };
    const shoes = { color: "Black" };
    expect(app.showCompatibility(top, bottom, shoes)).toBe(100);
  });

  test("error case: missing pieces (null) are skipped without crashing", () => {
    const top = { color: "Black" };
    expect(() => app.showCompatibility(top, null, null)).not.toThrow();
    expect(app.showCompatibility(top, null, null)).toBe(70);
  });
});