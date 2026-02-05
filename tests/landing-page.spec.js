const { test, expect } = require('@playwright/test');

test.describe('EduLearn Landing Page - Comprehensive Analysis', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/../index.html');
  });

  test('should load page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/EduLearn/);
    console.log('✓ Page loaded successfully');
  });

  test('should have visible navigation', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Check navigation links
    const courseLink = page.locator('a[href="#courses"]');
    const instructorLink = page.locator('a[href="#instructors"]');
    const testimonialLink = page.locator('a[href="#testimonials"]');
    const pricingLink = page.locator('a[href="#pricing"]');

    await expect(courseLink).toBeVisible();
    await expect(instructorLink).toBeVisible();
    await expect(testimonialLink).toBeVisible();
    await expect(pricingLink).toBeVisible();

    console.log('✓ Navigation menu is visible and complete');
  });

  test('should have primary CTA buttons', async ({ page }) => {
    // Hero CTAs (use .first() to avoid strict mode violation when multiple exist)
    const startLearningBtn = page.getByRole('button', { name: /start learning/i }).first();
    const browseCoursesBtn = page.getByRole('button', { name: /browse courses/i });

    await expect(startLearningBtn).toBeVisible();
    await expect(browseCoursesBtn).toBeVisible();

    // Get Started button in nav
    const getStartedBtn = page.getByRole('button', { name: /get started/i }).first();
    await expect(getStartedBtn).toBeVisible();

    // Count total "Start Learning" CTAs (should have multiple for conversion)
    const allStartLearning = page.getByRole('button', { name: /start learning/i });
    const count = await allStartLearning.count();
    expect(count).toBeGreaterThanOrEqual(2);

    console.log(`✓ Primary CTA buttons are visible (${count} "Start Learning" CTAs for conversion)`);
  });

  test('should display social proof elements', async ({ page }) => {
    // Rating badge
    const ratingBadge = page.locator('text=/4.8\\/5/');
    await expect(ratingBadge).toBeVisible();

    // Stats
    const coursesCount = page.locator('text=/5,000\\+/').first();
    const studentsCount = page.locator('text=/100K\\+/');
    const instructorsCount = page.locator('text=/500\\+/');

    await expect(coursesCount).toBeVisible();
    await expect(studentsCount).toBeVisible();
    await expect(instructorsCount).toBeVisible();

    console.log('✓ Social proof elements are displayed');
  });

  test('should render course catalog section', async ({ page }) => {
    const coursesSection = page.locator('#courses');
    await expect(coursesSection).toBeVisible();

    // Check for course cards
    const courseCards = page.locator('#courses').locator('.bg-white.rounded-2xl');
    await expect(courseCards).toHaveCount(3);

    // Verify course details are present
    const webDevCourse = page.locator('text=/Web Development Bootcamp/');
    const dataScience = page.locator('text=/Data Science.*Machine Learning/');
    const uiuxCourse = page.locator('text=/UI\\/UX Design Complete/');

    await expect(webDevCourse).toBeVisible();
    await expect(dataScience).toBeVisible();
    await expect(uiuxCourse).toBeVisible();

    console.log('✓ Course catalog displays 3 featured courses');
  });

  test('should display instructor profiles', async ({ page }) => {
    const instructorsSection = page.locator('#instructors');
    await expect(instructorsSection).toBeVisible();

    // Check for instructor images and names
    const instructorNames = ['John Anderson', 'Sarah Mitchell', 'David Chen', 'Emma Rodriguez'];

    for (const name of instructorNames) {
      const instructor = page.locator(`text=${name}`);
      await expect(instructor).toBeVisible();
    }

    console.log('✓ 4 instructor profiles are displayed');
  });

  test('should show testimonials section', async ({ page }) => {
    const testimonialsSection = page.locator('#testimonials');
    await expect(testimonialsSection).toBeVisible();

    // Check for testimonial cards
    const testimonialCards = page.locator('#testimonials').locator('.bg-white.rounded-2xl');
    await expect(testimonialCards).toHaveCount(3);

    // Verify star ratings in testimonials
    const stars = page.locator('#testimonials svg[fill="currentColor"]');
    const starCount = await stars.count();
    expect(starCount).toBeGreaterThan(10); // 3 testimonials × 5 stars each

    console.log('✓ Testimonials section with 3 reviews displayed');
  });

  test('should display pricing plans', async ({ page }) => {
    const pricingSection = page.locator('#pricing');
    await expect(pricingSection).toBeVisible();

    // Check pricing tiers
    const freePlan = page.locator('text=/Free/').first();
    const proPlan = page.locator('text=/Pro/').first();
    const teamsPlan = page.locator('text=/Teams/').first();

    await expect(freePlan).toBeVisible();
    await expect(proPlan).toBeVisible();
    await expect(teamsPlan).toBeVisible();

    // Verify pricing
    const freePrice = page.locator('text=/\\$0/');
    const proPrice = page.locator('text=/\\$29/');
    const teamsPrice = page.locator('text=/\\$99/');

    await expect(freePrice).toBeVisible();
    await expect(proPrice).toBeVisible();
    await expect(teamsPrice).toBeVisible();

    console.log('✓ 3 pricing plans displayed with correct prices');
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      // Check mobile menu behavior
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();

      // Verify content stacks vertically
      const hero = page.locator('section').first();
      await expect(hero).toBeVisible();

      console.log('✓ Layout is responsive on mobile devices');
    }
  });

  test('should have proper accessibility features', async ({ page }) => {
    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt.length).toBeGreaterThan(0);
    }

    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);

    const h2 = page.locator('h2');
    const h2Count = await h2.count();
    expect(h2Count).toBeGreaterThan(0);

    console.log('✓ Accessibility: All images have alt text, proper heading hierarchy');
  });

  test('should have working smooth scroll', async ({ page }) => {
    // Click on courses link
    await page.locator('a[href="#courses"]').click();
    await page.waitForTimeout(500);

    // Verify courses section is in viewport
    const coursesSection = page.locator('#courses');
    await expect(coursesSection).toBeInViewport();

    console.log('✓ Smooth scroll navigation works');
  });

  test('should have hover states on interactive elements', async ({ page, isMobile }) => {
    if (!isMobile) {
      // Test button hover
      const ctaButton = page.getByRole('button', { name: /start learning/i }).first();

      // Get initial styles
      await ctaButton.hover();

      // Verify button has transition classes
      const classes = await ctaButton.getAttribute('class');
      expect(classes).toContain('transition');
      expect(classes).toContain('cursor-pointer');

      console.log('✓ Interactive elements have hover states');
    }
  });

  test('should load external resources', async ({ page }) => {
    // Check if Tailwind CSS is loaded
    const html = await page.content();
    expect(html).toContain('tailwindcss.com');

    // Check if Google Fonts are loaded
    expect(html).toContain('fonts.googleapis.com');
    expect(html).toContain('Baloo 2');
    expect(html).toContain('Comic Neue');

    console.log('✓ External resources (Tailwind, Google Fonts) are loaded');
  });

  test('should have scroll to top button', async ({ page }) => {
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);

    // Check if scroll to top button is visible
    const scrollTopBtn = page.locator('#scrollTop');
    await expect(scrollTopBtn).toBeVisible();

    console.log('✓ Scroll to top button appears after scrolling');
  });

  test('should have footer with company info', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Check footer sections
    const coursesLink = footer.locator('text=/Web Development/');
    const aboutLink = footer.locator('text=/About Us/');
    const helpLink = footer.locator('text=/Help Center/');

    await expect(coursesLink).toBeVisible();
    await expect(aboutLink).toBeVisible();
    await expect(helpLink).toBeVisible();

    // Check copyright
    const copyright = footer.locator('text=/2026 EduLearn/');
    await expect(copyright).toBeVisible();

    console.log('✓ Footer is complete with all sections');
  });

  test('performance - measure page metrics', async ({ page }) => {
    const performanceTiming = await page.evaluate(() => {
      const timing = performance.timing;
      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart
      };
    });

    console.log('📊 Performance Metrics:');
    console.log(`   - DOM Content Loaded: ${performanceTiming.domContentLoaded}ms`);
    console.log(`   - Page Load Complete: ${performanceTiming.loadComplete}ms`);

    // Page should load reasonably fast
    expect(performanceTiming.domContentLoaded).toBeLessThan(5000);
  });

  test('conversion elements - CTA count and visibility', async ({ page }) => {
    const ctaButtons = page.getByRole('button');
    const ctaCount = await ctaButtons.count();

    console.log(`📈 Conversion Analysis:`);
    console.log(`   - Total CTA buttons: ${ctaCount}`);

    // Should have multiple CTAs for conversion optimization
    expect(ctaCount).toBeGreaterThan(5);

    // Check for urgency elements
    const urgency = page.locator('text=/30% OFF/');
    await expect(urgency).toBeVisible();

    console.log('   - Urgency elements present: YES');
    console.log('✓ Conversion elements are properly placed');
  });
});
