# Dual Dashboard Quick Start Guide

## For Shop Owners

### Getting Started

1. **Login** with your shop owner credentials
2. You'll see the **Shop Dashboard** by default
3. Look at the **top navbar** - you'll see two buttons:
   - "Shop Dashboard" (active by default)
   - "Winga (Salesman)"

### Switching Between Modes

#### To Access Salesman Mode (Winga):
1. Click the **"Winga (Salesman)"** button in the navbar
2. The sidebar will automatically update with new menu options
3. You'll see your personal salesman dashboard

#### To Return to Shop Mode:
1. Click the **"Shop Dashboard"** button in the navbar
2. The sidebar will update back to shop options
3. You're back to managing your shop

### What Each Mode Shows

#### 🏪 Shop Dashboard (Default)
**Sidebar Menu:**
- Dashboard → Overview of your shop (revenue, profit, sales count, products, staff, inventory levels)
- Products → Manage your shop's inventory
- Store → Track all shop sales
- Staff → Manage your team members (salesman, storekeeper)
- Reports → Detailed business analytics
- Settings → Configure your shop

**Best for:** Managing your shop operations, inventory, team, and sales

#### 👥 Winga (Salesman) Dashboard
**Sidebar Menu:**
- Dashboard → Your personal performance (ganji, targets, sales, commissions)
- My Sales → Your personal sales records
- Ufundi → Service/repair jobs you're handling
- Targets → Your sales targets and goals
- Matumizi → Your expenditures and costs
- Warranties → Warranties you've filed
- Settings → Your personal settings

**Best for:** Tracking your personal sales, commissions, targets, and expenditures

### Key Benefits

✅ **Single Login Account**
- No need to log in/out with different accounts
- Everything in one place

✅ **Separate Data Views**
- Shop data separate from personal data
- Clear distinction between roles

✅ **Easy Switching**
- One-click toggle between modes
- Sidebar updates automatically

✅ **Persistent Preference**
- Your selected mode is remembered
- Opens to your last used dashboard next time

### Tips & Tricks

**On Mobile:**
- The dashboard switcher appears below the navbar
- Tap either button to switch modes
- Takes full width for easy touch targets

**On Desktop:**
- The switcher appears in the navbar
- Compact, integrated design
- Easy mouse click navigation

**Remembering Your Choice:**
- Switch to "Winga" mode and close your browser
- Next time you log in, you'll be in Winga mode
- Your preference is saved per device

### Common Tasks

#### As a Shop Manager (Shop Mode):
1. View shop overview → Click "Dashboard"
2. Check inventory → Click "Products"
3. Review sales → Click "Store"
4. Manage team → Click "Staff"
5. Analyze performance → Click "Reports"

#### As a Salesman (Winga Mode):
1. View your performance → Click "Dashboard"
2. Record a sale → Click "My Sales"
3. File a service → Click "Ufundi"
4. Check your targets → Click "Targets"
5. Record expenses → Click "Matumizi"

### Troubleshooting

**❓ I don't see the dashboard switcher**
- Make sure you're logged in as a shop owner
- Check if you're on a large enough screen (or look below navbar on mobile)
- Try refreshing the page

**❓ My sidebar doesn't match my selected mode**
- Refresh the page
- Clear your browser cache
- Try logging out and back in

**❓ My mode preference isn't being saved**
- Check if localStorage is enabled in your browser
- Try clearing browser cache
- Use a different browser

**❓ I see pages from the wrong mode**
- The system might have defaulted to shop mode
- Click the switcher button again to refresh
- Check your browser console for errors

### Visual Indicators

**Active Tab Indicator:**
- Active button has **blue background** (#1973AE)
- White text on blue background
- Slight shadow effect
- Smooth transition animation when switching

**Inactive Tab Indicator:**
- Light gray background
- Gray text
- Hover effect (slightly darker)
- Clear visual hierarchy

### Mobile Responsiveness

**Small Screens (< 768px - Phones):**
```
[Menu] [WingaPro Logo] [Theme] [User] [Logout]
[Shop Dashboard] [Winga (Salesman)]  ← Below navbar
```

**Medium+ Screens (≥ 768px - Tablets & Desktop):**
```
[Menu] [WingaPro Logo] [Switcher] [Theme] [User] [Logout]
                        ↑
                   In navbar
```

### Data Security

- Your shop data is only visible in Shop mode
- Your personal sales data is only visible in Salesman mode
- No data mixing between modes
- Each mode uses appropriate API queries

### Performance

- Switching modes is instant
- No page reload needed
- Smooth transitions
- Optimized for low bandwidth

### Accessibility

- All buttons are keyboard accessible
- Proper color contrast for readability
- Dark mode support for eye comfort
- Works on all modern browsers

## For Administrators

### Enabling the Feature

The feature is **automatically enabled** for all shop owners. No configuration needed.

### Checking the Implementation

1. Verify `DashboardTabSwitcher.tsx` exists in `/components/Layout/`
2. Check App.tsx has `dashboardMode` state
3. Ensure Sidebar.tsx has `dashboardMode` prop handling
4. Verify renderContent() in App.tsx has shop owner routing logic

### Customizing the Feature

**To change button colors:**
Edit `DashboardTabSwitcher.tsx`, line 14-15:
```tsx
'bg-[#1973AE]' // Change this color
```

**To change button text:**
Edit `DashboardTabSwitcher.tsx`, lines 20 & 26:
```tsx
<span>Custom Text</span>
```

**To change menu items:**
Edit `Sidebar.tsx`, `getMenuItems()` function

## Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Navigate between buttons |
| Enter | Activate selected button |
| Escape | Close mobile sidebar |

## Browser Support

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## API Endpoints Used

### In Shop Mode:
```
GET /api/sales?shop_id={shopId}
GET /api/products?shop_id={shopId}
GET /api/users?shop_id={shopId}
```

### In Salesman Mode:
```
GET /api/sales?salesman_id={salesmanId}
GET /api/services?salesman_id={salesmanId}
GET /api/expenditures?salesman_id={salesmanId}
GET /api/targets?salesman_id={salesmanId}
```

## Feedback & Issues

If you encounter issues:
1. Check the troubleshooting section above
2. Clear browser cache and localStorage
3. Try a different browser
4. Contact your system administrator

## Version Info

- **Feature Version:** 1.0
- **Release Date:** January 2026
- **Status:** Production Ready
- **Last Updated:** 2026-01-05

---

**Happy switching! 🎯**
