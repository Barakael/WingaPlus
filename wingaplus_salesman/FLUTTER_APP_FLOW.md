# Flutter App Flow Documentation

## Overview
This document describes the complete user flow in the Flutter mobile app, matching the React frontend (`@frontend`) navigation and design.

## User Flow

### 1. Login/Register Flow
- **Entry Point**: `SplashScreen` in `lib/main.dart`
  - Checks authentication status
  - Redirects to `/login` if not authenticated
  - Redirects to `/dashboard` if authenticated

- **Login Screen**: `lib/screens/auth/login_screen.dart`
  - Matches React `LoginForm.tsx` design
  - Uses `AuthProvider` for authentication
  - On success, navigates to `/dashboard`

### 2. Main App Navigation Structure

The app uses a unified navigation system matching the React `Sidebar.tsx`, `Navbar.tsx`, `Layout.tsx`, and `Breadcrumb.tsx`:

#### Navigation Component: `SalesmanNav`
Located in `lib/widgets/layout/salesman_nav.dart`

**Salesman Navigation Destinations** (matching React Sidebar):
1. **Dashboard** (`/dashboard`) - `SalesmanDashboard`
2. **My Sales** (`/my-sales`) - `MySalesScreen` 
3. **Ufundi** (`/services`) - `ServiceScreen`
4. **Ganji** (`/commissions`) - `CommissionTrackingScreen`
5. **Targets** (`/targets`) - `TargetManagementScreen`
6. **Warranties** (`/warranties`) - `WarrantyScreen`
7. **Settings** (`/settings`) - Coming soon

#### Layout Shell: `WingaplusShell`
Located in `lib/widgets/layout/wingaplus_shell.dart`

- **Responsive Layout**:
  - Desktop (>1100px): Fixed navigation rail on left
  - Tablet (768-1100px): Drawer + bottom nav
  - Mobile (<768px): Drawer + bottom nav
- **Top Bar**: `WingaplusTopBar` - matches React `Navbar.tsx`
  - Brand logo ("WP")
  - Menu button (mobile)
  - Theme toggle
  - User info & logout
- **Navigation**:
  - Desktop: `WingaplusNavRail` (matches React Sidebar)
  - Mobile: `WingaplusNavDrawer` + `WingaplusBottomNav`

### 3. Screen Pages (Matching React Components)

#### Dashboard (`SalesmanDashboard`)
**React Equivalent**: `Dashboard/SalesmanDashboard.tsx`

- **Location**: `lib/screens/dashboard/salesman_dashboard.dart`
- **Features**:
  - Welcome header with user name
  - Stats overview (Total Profit, Items Sold, Services Done)
  - Quick action cards (Commission/Ganji, Sales Records, Repair Service)
  - Recent sales list
- **Navigation**: All screens use `WingaplusShell` with `SalesmanNav.destinations`

#### My Sales (`MySalesScreen`)
**React Equivalent**: `Sales/SalesmanSales.tsx`

- **Location**: `lib/screens/sales/my_sales_screen.dart`
- **Features**:
  - Sales records table with filters (Daily/Monthly/Yearly)
  - Stats cards (Total Sales, Profit, Items)
  - Export buttons (PDF/Excel)
  - Pagination
  - FAB: "New Sale" (opens SaleForm)

#### Ganji/Commissions (`CommissionTrackingScreen`)
**React Equivalent**: `Sales/CommissionTracking.tsx`

- **Location**: `lib/screens/commissions/commission_tracking_screen.dart`
- **Features**:
  - Total Profit tracking (Sales + Services)
  - Monthly/Weekly performance charts
  - Target progress tracking
  - Export functionality
  - Performance statistics

#### Targets (`TargetManagementScreen`)
**React Equivalent**: `Sales/TargetManagement.tsx`

- **Location**: `lib/screens/targets/target_management_screen.dart`
- **Features**:
  - Create/Edit/Delete targets
  - Target types: Monthly/Yearly
  - Metrics: Profit (Ganji) or Items Sold
  - Bonus amount tracking
  - Status management (active/completed/failed)

#### Services/Ufundi (`ServiceScreen`)
**React Equivalent**: `Services/ServiceView.tsx`

- **Location**: `lib/screens/services/service_screen.dart`
- **Features**:
  - Service records list
  - Ganji tracking per service
  - FAB: "Record Service"

#### Warranties (`WarrantyScreen`)
**React Equivalent**: `Warranties/WarrantyView.tsx`

- **Location**: `lib/screens/warranties/warranty_screen.dart`
- **Features**:
  - Warranty records list
  - Status tracking (Active/Expired)
  - Expiry date tracking
  - FAB: "File Warranty"

### 4. Shared Components

#### Design Tokens
- **Location**: `lib/design/tokens.dart`
- **Purpose**: Centralized colors, spacing, typography matching React Tailwind config
- **Usage**: All widgets import `WingaplusColors`, `WingaplusSpacing`, `WingaplusRadius`

#### Dashboard Widgets
- `DashboardHeader` - Title/subtitle header
- `StatsOverviewGrid` - KPI cards grid
- `QuickActionsGrid` - Action buttons
- `RecentSalesList` - Recent sales list

#### Layout Widgets
- `WingaplusShell` - Main layout wrapper
- `WingaplusTopBar` - Top navigation bar
- `WingaplusNavRail` - Desktop sidebar
- `WingaplusNavDrawer` - Mobile drawer
- `WingaplusBottomNav` - Mobile bottom nav

## Navigation Flow Diagram

```
SplashScreen
    ↓
LoginScreen (if not authenticated)
    ↓
Dashboard (if authenticated)
    ├─→ My Sales → SaleForm (modal/screen)
    ├─→ Ufundi (Services)
    ├─→ Ganji (Commissions)
    ├─→ Targets
    ├─→ Warranties → File Warranty
    └─→ Settings (coming soon)
```

## Route Configuration

All routes defined in `lib/main.dart`:

```dart
routes: {
  '/login': LoginScreen,
  '/dashboard': SalesmanDashboard,
  '/my-sales': MySalesScreen,
  '/services': ServiceScreen,
  '/commissions': CommissionTrackingScreen,
  '/targets': TargetManagementScreen,
  '/warranties': WarrantyScreen,
}
```

## Design Alignment

### Colors (Matching React Tailwind)
- Primary Blue: `#1973AE`
- Secondary Blue: `#04BCF2`
- Success Green: `#10B981`
- Warning Yellow: `#F59E0B`
- Error Red: `#EF4444`

### Typography
- Font Family: Inter (via `google_fonts`)
- Sizes match React text scale

### Spacing
- All spacing uses `WingaplusSpacing` constants matching Tailwind spacing scale

### Components
- Cards: 12px border radius, shadow elevation
- Buttons: Primary blue background, 8px border radius
- Inputs: 8px border radius, primary blue focus ring

## Future Improvements

1. **SaleForm Screen**: Create full sale form matching React `SaleForm.tsx`
2. **Settings Screen**: User profile, theme toggle, preferences
3. **Breadcrumb Component**: Add breadcrumb navigation matching React
4. **Modal Components**: Create modal system for forms
5. **Data Providers**: Add dedicated providers for Services, Warranties
6. **Offline Support**: Cache data locally with sync

## How to Sync Future Changes

When React frontend changes:

1. **Design Tokens**: Update `lib/design/tokens.dart` to match `frontend/tailwind.config.js`
2. **Navigation**: Update `lib/widgets/layout/salesman_nav.dart` destinations if menu items change
3. **Screens**: Copy React component structure and adapt to Flutter widgets
4. **Styling**: Use design tokens for consistency

See `DESIGN_SYNC.md` for detailed sync process.


