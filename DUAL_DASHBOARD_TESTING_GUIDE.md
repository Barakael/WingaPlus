# Dual Dashboard - Testing Guide

## Pre-Testing Checklist

- [ ] All files are saved
- [ ] No TypeScript errors in VSCode
- [ ] Frontend server can start without errors
- [ ] Test user account with shop_owner role exists
- [ ] Test user account with salesman role exists
- [ ] Test user account with super_admin role exists

## Unit Tests

### 1. Component Rendering Tests

#### DashboardTabSwitcher Component
```
Test Case: Component renders without errors
- Verify component imports successfully
- Check both buttons render
- Verify icons display
- Confirm text labels are visible
```

#### Navbar Component
```
Test Case: Navbar displays correctly
- For shop_owner role: DashboardTabSwitcher visible (desktop) or below navbar (mobile)
- For other roles: No DashboardTabSwitcher visible
- Verify all navbar elements present (menu, logo, theme toggle, user, logout)
```

#### Sidebar Component
```
Test Case: Menu items change based on dashboardMode
- In 'shop' mode: Shows Products, Store, Staff, Reports, Settings
- In 'salesman' mode: Shows My Sales, Ufundi, Targets, Matumizi, Warranties
- For non-shop_owner roles: Normal menu behavior unchanged
```

## Integration Tests

### 2. Navigation Flow Tests

#### Test: Switch from Shop to Salesman Mode
```
Steps:
1. Login as shop owner
2. Verify on Shop Dashboard (default)
3. Click "Winga (Salesman)" button
4. Verify:
   - Button is highlighted blue
   - Sidebar menu changes to salesman items
   - Dashboard content updates to salesman view
   - activeTab is 'dashboard'

Expected: Smooth transition, no errors
```

#### Test: Switch Back to Shop Mode
```
Steps:
1. Currently in Salesman mode
2. Click "Shop Dashboard" button
3. Verify:
   - Button is highlighted blue
   - Sidebar menu changes back to shop items
   - Dashboard content updates to shop view
   - activeTab is 'dashboard'

Expected: Smooth transition, no errors
```

#### Test: Navigation Within Modes

**Shop Mode Navigation:**
```
1. In Shop Dashboard
2. Click "Products" in sidebar
3. Verify: ShopProducts component loads
4. Click "Store" in sidebar
5. Verify: ShopSales component loads
6. Click "Reports" in sidebar
7. Verify: Reports component loads
```

**Salesman Mode Navigation:**
```
1. In Salesman Dashboard
2. Click "My Sales" in sidebar
3. Verify: SalesmanSales component loads
4. Click "Targets" in sidebar
5. Verify: TargetManagement component loads
6. Click "Matumizi" in sidebar
7. Verify: ExpenditureView component loads
```

### 3. State Management Tests

#### Test: Mode Preference Persistence
```
Steps:
1. Login as shop owner
2. Click "Winga (Salesman)" to switch modes
3. Refresh the page (F5)
4. Verify: Still in Salesman mode

Expected: Mode preference persists via localStorage
```

#### Test: LocalStorage Key
```
Steps:
1. Open DevTools → Application → LocalStorage
2. Login as shop owner
3. Look for key: "dashboardMode_<userId>"
4. Verify value is "shop" (default)
5. Switch to salesman mode
6. Verify value changes to "salesman"

Expected: Correct key and value stored
```

#### Test: Multiple Users
```
Steps:
1. Login as shop_owner_1
2. Switch to salesman mode
3. Logout
4. Login as shop_owner_2
5. Verify: Shop mode is default (not salesman)
6. Logout
7. Login as shop_owner_1 again
8. Verify: Salesman mode is active (persisted)

Expected: Each user has independent preference
```

## End-to-End Tests

### 4. User Role Tests

#### Test: Shop Owner Role
```
Precondition: User has role 'shop_owner'

1. Login
2. Verify: "Shop Dashboard" and "Winga" buttons visible
3. Switch to salesman mode
4. Verify: Can access My Sales, Targets, Expenditures
5. Switch back to shop mode
6. Verify: Can access Products, Store, Staff, Reports

Expected: All features accessible, no permission errors
```

#### Test: Regular Salesman Role
```
Precondition: User has role 'salesman'

1. Login
2. Verify: No "Shop Dashboard" / "Winga" switcher visible
3. Verify: Sidebar shows standard salesman menu
4. Click My Sales, Targets, Ufundi
5. Verify: All pages load correctly

Expected: Normal experience, no switcher, no errors
```

#### Test: Super Admin Role
```
Precondition: User has role 'super_admin'

1. Login
2. Verify: No "Shop Dashboard" / "Winga" switcher visible
3. Verify: Sidebar shows admin menu (Shops, Users, Reports)
4. Click Shops, Users
5. Verify: All pages load correctly

Expected: Normal experience, no switcher, no errors
```

### 5. Responsive Design Tests

#### Desktop (≥ 768px)
```
Test on: Browser window > 768px wide

1. Login as shop owner
2. Verify: Switcher visible in navbar (inline)
3. Verify: Switcher doesn't overflow
4. Click switcher buttons
5. Verify: Sidebar updates smoothly
6. Check layout: No overlaps or misalignment

Expected: Professional inline layout
```

#### Tablet (768px - 1024px)
```
Test on: Tablet size browser

1. Resize to ~800px width
2. Login as shop owner
3. Verify: Switcher still visible in navbar
4. Open sidebar on mobile menu
5. Verify: Sidebar items match current mode
6. Verify: Touch targets adequate (min 44px)

Expected: Proper scaling, touch-friendly
```

#### Mobile (< 768px)
```
Test on: Mobile browser or <768px window

1. Resize to ~375px width (mobile)
2. Login as shop owner
3. Verify: Switcher below navbar (not in navbar)
4. Verify: Buttons take full width
5. Click switcher buttons
6. Verify: Mobile experience smooth
7. Open sidebar menu
8. Verify: Menu items correct for current mode

Expected: Optimized mobile layout
```

### 6. Data Isolation Tests

#### Test: Shop Data Only in Shop Mode
```
Steps:
1. Login as shop owner
2. Switch to Shop mode
3. Go to Dashboard
4. Verify stats show: Revenue, Profit, Sales, Products, Staff, Low Stock
5. Verify data is from shop (shop_id used)
6. Check API calls in Network tab
7. Verify: /api/sales?shop_id=X queries

Expected: Only shop data visible
```

#### Test: Salesman Data Only in Salesman Mode
```
Steps:
1. Login as shop owner (who is also a salesman)
2. Switch to Salesman mode
3. Go to Dashboard
4. Verify stats show: Ganji, Sales, Targets, Commissions
5. Verify data is personal (salesman_id used)
6. Check API calls in Network tab
7. Verify: /api/sales?salesman_id=X queries

Expected: Only personal/salesman data visible
```

### 7. Navigation History Tests

#### Test: Browser Back/Forward
```
Steps:
1. Login as shop owner
2. Click Products (in shop mode)
3. Click Dashboard (in shop mode)
4. Click "Winga (Salesman)"
5. Click My Sales
6. Click browser Back button
7. Verify: Returns to Salesman Dashboard
8. Click browser Back again
9. Verify: Returns to Shop Dashboard (BEFORE switching)

Expected: History preserved correctly
```

## Visual Tests

### 8. Styling & UI Tests

#### Tab Switcher Styling
```
Verify:
- Active tab: Blue background (#1973AE)
- Active tab: White text
- Inactive tab: Light gray background
- Inactive tab: Gray text
- Hover effect: Visual feedback on inactive tab
- Icons: Correct for Store and Users
- Text: "Shop Dashboard" and "Winga (Salesman)" display correctly
- Dark mode: Colors adjust appropriately
```

#### Sidebar Styling
```
Verify:
- Active menu item: Blue highlight
- Menu items align with current mode
- Icons display correctly
- Hover states working
- Dark mode: Proper contrast
- Mobile: Touch targets adequate (44px minimum)
```

#### Navbar Integration
```
Verify:
- Switcher fits without overflow
- Switcher doesn't push other elements
- Alignment: Centered appropriately
- Mobile: Switcher below navbar, full width
- Dark mode: Proper visibility
```

## Performance Tests

### 9. Loading & Performance

#### Test: Mode Switch Speed
```
Steps:
1. Open DevTools → Performance tab
2. Login as shop owner
3. Record: Click switcher button
4. Stop recording
5. Measure: Time to change sidebar
6. Verify: < 300ms transition

Expected: Smooth, instant switching
```

#### Test: Initial Load Time
```
Steps:
1. Clear cache
2. Fresh login as shop owner
3. DevTools → Network tab
4. Measure: Time to dashboard load
5. Verify: All assets load
6. Check: No failed requests

Expected: Normal loading, no errors
```

## Error Handling Tests

### 10. Error Scenarios

#### Test: Missing dashboardMode Prop
```
Scenario: Layout rendered without dashboardMode prop

Expected Behavior:
- Component should use default 'shop'
- Should not crash
- Sidebar should show shop items
```

#### Test: Invalid dashboardMode Value
```
Scenario: dashboardMode = 'invalid'

Expected Behavior:
- Should fallback to shop mode
- Sidebar should show shop items
- No console errors
```

#### Test: Missing onDashboardModeChange Handler
```
Scenario: Navbar rendered without onDashboardModeChange

Expected Behavior:
- Buttons should render
- Should not crash
- Click should not cause errors
```

#### Test: User Object Missing
```
Scenario: User context is null

Expected Behavior:
- Should not render dashboard
- Should redirect to login (existing behavior)
- No crashes
```

## Dark Mode Tests

### 11. Dark Mode Compatibility

```
Steps:
1. Toggle dark mode (moon icon)
2. Verify: Switcher colors update
3. Verify: Sidebar colors update
4. Verify: Text contrast remains adequate
5. Verify: Icons visible
6. Click switcher buttons
7. Verify: Colors update correctly

Expected: Proper dark mode support
```

## Accessibility Tests

### 12. Accessibility Compliance

#### Keyboard Navigation
```
Steps:
1. Tab through navbar elements
2. Verify: Switcher buttons are focusable
3. Verify: Focus ring visible
4. Tab to switcher buttons
5. Press Enter to activate
6. Verify: Mode changes
7. Tab through sidebar
8. Verify: All menu items focusable
9. Press Enter on menu items
10. Verify: Navigation works

Expected: Full keyboard accessibility
```

#### Screen Reader
```
Steps:
1. Use screen reader (e.g., NVDA, JAWS)
2. Navigate to navbar
3. Verify: "Shop Dashboard" button announced
4. Verify: "Winga (Salesman)" button announced
5. Navigate to sidebar
6. Verify: All menu items announced

Expected: Proper ARIA labels and semantic HTML
```

#### Color Contrast
```
Steps:
1. Use color contrast checker
2. Check: Active button (blue bg, white text)
3. Check: Inactive button (gray bg, gray text)
4. Check: Sidebar items (various states)
5. Verify: All meet WCAG AA standard (4.5:1)

Expected: Adequate contrast for readability
```

## Edge Cases & Special Scenarios

### 13. Edge Case Tests

#### Multiple Rapid Clicks
```
Steps:
1. Rapidly click switcher buttons multiple times
2. Verify: No state corruption
3. Verify: Sidebar updates correctly
4. Verify: No duplicate renders

Expected: Stable state, no glitches
```

#### Window Resize During Session
```
Steps:
1. Login as shop owner (wide window)
2. Verify: Switcher in navbar
3. Resize window to mobile size
4. Verify: Switcher moves below navbar
5. Resize back to desktop
6. Verify: Switcher returns to navbar
7. Verify: No broken layout

Expected: Responsive behavior works
```

#### Tab Switching While Loading
```
Steps:
1. Click menu item (page starts loading)
2. Immediately click mode switcher
3. Verify: No crashes
4. Verify: State resolves correctly
5. Verify: Page loads in correct context

Expected: Graceful handling of race conditions
```

#### Rapid Logout/Login
```
Steps:
1. Login as shop owner_1
2. Switch to salesman mode
3. Logout
4. Login as shop_owner_2
5. Verify: Shop mode (default)
6. Verify: No data from owner_1 visible

Expected: Clean session separation
```

## Browser Compatibility Tests

### 14. Cross-Browser Testing

Test on each browser:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Chrome Mobile
- [ ] Safari Mobile

For each browser verify:
- Switcher renders correctly
- Colors display properly
- Animations are smooth
- Responsive design works
- No console errors

## Production Readiness Checklist

Before deploying to production:

### Code Quality
- [ ] No TypeScript errors
- [ ] No console warnings/errors
- [ ] Code follows project conventions
- [ ] All imports are correct

### Functionality
- [ ] All navigation works
- [ ] Mode switching works
- [ ] Data isolation confirmed
- [ ] Error handling in place

### Performance
- [ ] Mode switch is instant (< 300ms)
- [ ] No memory leaks
- [ ] Initial load time acceptable
- [ ] No unnecessary re-renders

### Accessibility
- [ ] Keyboard navigation works
- [ ] Color contrast adequate
- [ ] Screen reader compatible
- [ ] Mobile friendly

### Browser Support
- [ ] Works on target browsers
- [ ] Responsive design correct
- [ ] No layout breaks
- [ ] Cross-browser tested

### Documentation
- [ ] README updated
- [ ] Quick start guide complete
- [ ] API documentation updated
- [ ] Comments added to code

### Deployment
- [ ] Code committed to git
- [ ] Build succeeds
- [ ] No deployment errors
- [ ] Feature toggle ready (if needed)

---

## Test Report Template

```
TEST EXECUTION REPORT
====================

Date: [YYYY-MM-DD]
Tester: [Name]
Browser: [Name & Version]
Screen Size: [WxH]
Build Version: [Version]

PASSED TESTS: [X/Y]
FAILED TESTS: [0]
BLOCKED TESTS: [0]

CRITICAL ISSUES: [None]
MAJOR ISSUES: [None]
MINOR ISSUES: [None]

NOTES:
[Any observations]

CONCLUSION:
[Ready for production / Needs fixes]

Signed: _________________ Date: _____
```

---

## Automated Test Examples (Jest)

```typescript
// Example test structure
describe('DashboardTabSwitcher', () => {
  it('renders both buttons', () => {
    // Test implementation
  });

  it('calls onModeChange when clicked', () => {
    // Test implementation
  });

  it('highlights active mode', () => {
    // Test implementation
  });
});

describe('Sidebar with dashboardMode', () => {
  it('shows shop items in shop mode', () => {
    // Test implementation
  });

  it('shows salesman items in salesman mode', () => {
    // Test implementation
  });

  it('updates when mode changes', () => {
    // Test implementation
  });
});

describe('App routing with dashboardMode', () => {
  it('routes to shop pages in shop mode', () => {
    // Test implementation
  });

  it('routes to salesman pages in salesman mode', () => {
    // Test implementation
  });
});
```

---

**All tests should pass before marking as production-ready!**
