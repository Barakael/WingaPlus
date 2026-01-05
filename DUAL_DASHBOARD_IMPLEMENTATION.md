# Dual Dashboard Implementation for Shop Owners

## Overview
Shop owners can now access two separate dashboards from a single login account without needing separate credentials. This allows them to manage both their shop operations and their personal sales (Winga/Salesman) activities.

## Features

### 1. Dashboard Tab Switcher
- Located in the Navbar for easy access
- Visible only to shop owners
- Responsive design (hidden on mobile, visible on desktop and medium screens)
- Mobile version appears below the navbar on smaller screens

### 2. Two Dashboard Modes

#### Shop Dashboard Mode
**Route:** `activeTab` = 'dashboard'
**Sidebar Items:**
- Dashboard
- Products (manage inventory)
- Store (sales management)
- Staff (manage team)
- Reports (shop analytics)
- Settings (shop configuration)

**Features:**
- View shop overview and statistics
- Manage products and inventory
- Monitor store sales
- Manage staff members
- View detailed reports
- Configure shop settings

#### Salesman/Winga Dashboard Mode  
**Route:** `activeTab` = 'dashboard'
**Sidebar Items:**
- Dashboard (Salesman view)
- My Sales (personal sales records)
- Ufundi (services)
- Targets (sales targets)
- Matumizi (expenditures)
- Warranties (warranty management)
- Settings (personal settings)

**Features:**
- View personal sales performance
- Track commission and profit (Ganji)
- Manage service jobs (Ufundi)
- Monitor target achievement
- Track expenditures
- File warranties
- Manage personal settings

## Technical Implementation

### Component Structure

1. **DashboardTabSwitcher** (`/components/Layout/DashboardTabSwitcher.tsx`)
   - Renders the tab toggle buttons
   - Handles mode switching
   - Props: `activeMode`, `onModeChange`

2. **Updated Navbar** (`/components/Layout/Navbar.tsx`)
   - Conditionally shows DashboardTabSwitcher for shop owners
   - Passes `dashboardMode` and `onDashboardModeChange` to Layout
   - Responsive: hidden on mobile, shown on larger screens

3. **Updated Sidebar** (`/components/Layout/Sidebar.tsx`)
   - New prop: `dashboardMode` ('shop' or 'salesman')
   - Dynamically generates menu items based on mode
   - Shop owners see different menus based on selected mode

4. **Updated Layout** (`/components/Layout/Layout.tsx`)
   - New props: `dashboardMode`, `onDashboardModeChange`
   - Passes mode info to Sidebar and Navbar

5. **App Component** (`/App.tsx`)
   - Manages `dashboardMode` state
   - Routes content based on both `activeTab` and `dashboardMode`
   - For shop owners in salesman mode, routes to salesman pages
   - Persists mode preference in localStorage

### State Management

```typescript
// In App.tsx
const [dashboardMode, setDashboardMode] = useState<'shop' | 'salesman'>('shop');

const handleDashboardModeChange = (mode: 'shop' | 'salesman') => {
  setDashboardMode(mode);
  setActiveTab('dashboard');
  localStorage.setItem(`dashboardMode_${user?.id}`, mode);
};
```

### Routing Logic

```typescript
// In App.tsx renderContent()
if (user?.role === 'shop_owner') {
  if (dashboardMode === 'salesman') {
    // Route to salesman pages
    // - SalesmanSales for 'dashboard', 'my-sales'
    // - ServiceView for 'services'
    // - TargetManagement for 'targets'
    // - ExpenditureView for 'expenditures'
    // - etc.
  } else {
    // Route to shop owner pages via Dashboard component
    // - ShopOwnerDashboard handles all shop operations
  }
}
```

## User Experience Flow

1. **Login**
   - Shop owner logs in with their credentials
   - Default mode is 'shop' dashboard

2. **Switch to Salesman Mode**
   - Click "Winga (Salesman)" tab in navbar
   - Sidebar updates to show salesman options
   - Dashboard changes to salesman view
   - Can access personal sales, targets, expenditures, etc.

3. **Switch Back to Shop Mode**
   - Click "Shop Dashboard" tab in navbar
   - Sidebar updates to show shop options
   - Dashboard changes to shop management view
   - Can access products, sales, staff, etc.

4. **Persistent Preference**
   - Selected mode is saved in localStorage
   - User's preference persists across sessions

## Mobile Experience

### Small Screens (< 768px)
- Dashboard tab switcher appears below the navbar
- Takes full width with responsive button sizing
- Easy to tap on mobile devices

### Medium Screens (≥ 768px)
- Dashboard tab switcher appears in the navbar
- Compact horizontal layout
- Integrated with other navbar elements

## API Endpoints Used

### Shop Dashboard
- `GET /api/sales?shop_id={shopId}` - Get shop sales
- `GET /api/products?shop_id={shopId}` - Get shop products
- `GET /api/users?shop_id={shopId}` - Get shop staff

### Salesman Dashboard
- `GET /api/sales?salesman_id={salesmanId}` - Get personal sales
- `GET /api/services?salesman_id={salesmanId}` - Get personal services
- `GET /api/expenditures?salesman_id={salesmanId}` - Get expenditures
- `GET /api/targets?salesman_id={salesmanId}` - Get targets

## Security Considerations

1. **Role-Based Access**
   - Dashboard mode switcher only visible to shop owners
   - Other roles cannot access the feature

2. **Data Isolation**
   - Shop data and personal data are kept separate
   - API queries use either shop_id or salesman_id as appropriate

3. **Session Management**
   - Mode preference stored client-side
   - No sensitive data stored in localStorage

## Future Enhancements

1. **Quick Switch Button**
   - Add a floating action button for quick mode switching
   - Keyboard shortcut (e.g., Cmd+Shift+D) to toggle modes

2. **Mode-Specific Notifications**
   - Show notifications relevant to current mode only

3. **Cross-Mode Analytics**
   - View combined analytics across both modes
   - Compare shop performance with personal performance

4. **Advanced Permissions**
   - Allow shop owners to delegate operations to other salesman
   - Role-based sub-accounts within the shop

## Troubleshooting

### Tab Switcher Not Showing
- Verify user role is 'shop_owner'
- Check if screen size is ≥ 768px for navbar display
- Check browser console for errors

### Sidebar Not Updating
- Clear browser cache and localStorage
- Reload the page
- Verify `dashboardMode` prop is passed to Sidebar

### API Calls Failing
- Check if shop_id or salesman_id is correctly passed
- Verify user has permission to access the data
- Check network tab in dev tools

## Files Modified

1. `/frontend/src/components/Layout/DashboardTabSwitcher.tsx` - NEW
2. `/frontend/src/components/Layout/Navbar.tsx` - UPDATED
3. `/frontend/src/components/Layout/Sidebar.tsx` - UPDATED
4. `/frontend/src/components/Layout/Layout.tsx` - UPDATED
5. `/frontend/src/App.tsx` - UPDATED
6. `/frontend/src/components/Dashboard/ShopOwnerDashboard.tsx` - UPDATED
