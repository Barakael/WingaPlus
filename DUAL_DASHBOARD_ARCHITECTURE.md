# Dual Dashboard Architecture & Visual Guide

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      LOGIN / AUTH                            │
│              (Shop Owner Authentication)                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │    App Component       │
        │  (Main Entry Point)    │
        └────────────┬───────────┘
                     │
          ┌──────────┴──────────┐
          │ State Management    │
          ├──────────┬──────────┤
          │ activeTab│dashbMode │
          └──────────┴──────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
   ┌─────────────┐         ┌──────────────┐
   │   Layout    │         │   Navbar     │
   │ (Container) │         │ (Top Bar)    │
   └────┬────────┘         └──────┬───────┘
        │                         │
        │                    ┌────▼──────────┐
        │                    │ DashboardTab  │
        │                    │  Switcher     │
        │                    │ [SHOP] [WING] │
        │                    └────┬──────────┘
        │                         │ onModeChange
        │                         │ (triggers state)
        │                         │
        ▼                         │
   ┌─────────────────────────────▼─────────┐
   │           Sidebar Component            │
   │  getMenuItems(dashboardMode)           │
   │                                        │
   │ Shop Mode:                             │
   │ ├─ Dashboard                           │
   │ ├─ Products                            │
   │ ├─ Store                               │
   │ ├─ Staff                               │
   │ ├─ Reports                             │
   │ └─ Settings                            │
   │                                        │
   │ Salesman Mode:                         │
   │ ├─ Dashboard                           │
   │ ├─ My Sales                            │
   │ ├─ Ufundi                              │
   │ ├─ Targets                             │
   │ ├─ Matumizi                            │
   │ ├─ Warranties                          │
   │ └─ Settings                            │
   └────────────┬────────────────────────────┘
                │ onTabChange
                │
        ┌───────▼──────────┐
        │ renderContent()  │
        │ Router Logic     │
        └───────┬──────────┘
                │
    ┌───────────┴──────────────┐
    │ Conditional Routing       │
    │ Based on:                 │
    │ - user.role              │
    │ - dashboardMode          │
    │ - activeTab              │
    └───────────┬──────────────┘
                │
    ┌───────────┴──────────────────────┐
    │                                  │
    ▼                                  ▼
SHOP OWNER - SHOP MODE         SHOP OWNER - SALESMAN MODE
├─ ShopOwnerDashboard          ├─ SalesmanSales
├─ ShopProducts                ├─ ServiceView
├─ ShopSales                   ├─ TargetManagement
├─ ShopStaff                   ├─ ExpenditureView
├─ Reports                     ├─ WarrantyView
└─ Settings                    └─ Settings
```

## State Flow Diagram

```
┌─────────────────┐
│  App Component  │
│    State        │
└────────┬────────┘
         │
    ┌────┴──────┐
    │            │
    ▼            ▼
dashboardMode  activeTab
('shop'/'sal')  (page)
    │            │
    │            │ setActiveTab
    │            │
    │      onTabChange(page)
    │            │
    └──┬─────────┘
       │
setDashboard         handleDashboard
ModeChange(mode)     ModeChange(mode)
       │                    │
       │                    │
       ├────────┬───────────┤
       │        │           │
    Effect: Effect:   Update
    1. Reset    2. Persist  Modal
       Tab      to Local    State
              Storage
       │        │
       ▼        ▼
    Dashboard   localStorage
    Defaults    [dashboardMode_<userId>]
    to
    'dashboard'
```

## Component Hierarchy

```
App
├── Layout
│   ├── Navbar
│   │   ├── Menu Button
│   │   ├── Logo
│   │   ├── DashboardTabSwitcher (SHOP OWNER ONLY)
│   │   │   ├── Shop Dashboard Button
│   │   │   └── Winga (Salesman) Button
│   │   ├── Theme Toggle
│   │   └── User Menu
│   │
│   ├── Sidebar
│   │   └── Nav Items (based on mode)
│   │       ├── Shop Mode Items
│   │       └── Salesman Mode Items
│   │
│   └── Main Content Area
│       └── renderContent() result
│           ├── Dashboard (conditional)
│           ├── ShopOwnerDashboard
│           ├── SalesmanSales
│           ├── ShopProducts
│           ├── ShopSales
│           ├── etc.
│
└── SaleForm Modal (overlay)
```

## Data Flow Diagram

```
USER ACTION: Click Switcher Button
           │
           ▼
   ┌───────────────┐
   │ onClick Event │
   │ onModeChange()│
   └───────┬───────┘
           │
    ┌──────▼──────────┐
    │ Update App State│
    │ setDashboard    │
    │ Mode(mode)      │
    └────────┬────────┘
             │
    ┌────────▼───────────┐
    │ Reset activeTab    │
    │ to 'dashboard'     │
    └────────┬───────────┘
             │
    ┌────────▼──────────────┐
    │ Persist to Storage    │
    │ localStorage[key]     │
    │ = mode               │
    └────────┬──────────────┘
             │
    ┌────────▼────────────┐
    │ Update Browser      │
    │ History             │
    │ State               │
    └────────┬────────────┘
             │
    ┌────────▼─────────────────┐
    │ Re-render Components      │
    ├──────────────────────────┤
    │ 1. Navbar Updates        │
    │    (Button highlight)    │
    │ 2. Sidebar Regenerates   │
    │    (New menu items)      │
    │ 3. Content Updates       │
    │    (New dashboard)       │
    └──────────────────────────┘
```

## UI Layout Diagram

### Desktop Layout (≥ 768px)

```
┌───────────────────────────────────────────────────────────┐
│  [≡] WingaPro  [Shop Dashboard | Winga] 🌙 👤 ⏻          │
└───────────────────────────────────────────────────────────┘
┌────────────┬─────────────────────────────────────────────┐
│            │                                             │
│ SIDEBAR    │        MAIN CONTENT AREA                    │
│            │                                             │
│ Dashboard  │     ┌────────────────────────────────────┐  │
│ [Products] │     │  Page Title                        │  │
│ Store      │     │                                    │  │
│ Staff      │     │  Content Based on Mode & Tab       │  │
│ Reports    │     │                                    │  │
│ Settings   │     │  Switches smoothly when:           │  │
│            │     │  - Dashboard mode changes          │  │
│            │     │  - Tab changes                     │  │
│            │     │                                    │  │
│            │     └────────────────────────────────────┘  │
│            │                                             │
└────────────┴─────────────────────────────────────────────┘
```

### Tablet Layout (768px - 1024px)

```
┌──────────────────────────────────────────┐
│ [≡] WingaPro [Switcher] 🌙 👤 ⏻         │
├──────────────────────────────────────────┤
│  [Shop Dashboard | Winga]                │
├──────────────────────────────────────────┤
├────────────┬────────────────────────────┤
│ SIDEBAR    │   MAIN CONTENT             │
│            │                            │
│ Dashboard  │   ┌──────────────────────┐ │
│ Products   │   │  Content              │ │
│ Store      │   │                       │ │
│ Staff      │   │                       │ │
│ Reports    │   │                       │ │
│ Settings   │   │                       │ │
│            │   │                       │ │
└────────────┴───┴──────────────────────┘ │
└──────────────────────────────────────────┘
```

### Mobile Layout (< 768px)

```
┌──────────────────────────────┐
│ [≡] WingaPro  🌙 👤 ⏻       │
├──────────────────────────────┤
│ [Shop] [Winga]  [← Full Width]
├──────────────────────────────┤
│                              │
│     MAIN CONTENT             │
│                              │
│  (Sidebar hidden by default) │
│  (Open with hamburger menu)  │
│                              │
└──────────────────────────────┘
```

## Menu Structure Diagram

### Shop Owner - Shop Dashboard Mode

```
Dashboard (Active by default)
├─ Overview
│  ├─ Revenue Stats
│  ├─ Profit Stats
│  ├─ Sales Count
│  ├─ Product Count
│  ├─ Staff Count
│  └─ Low Stock Alert

Products
├─ Inventory List
├─ Add Product
├─ Edit Product
└─ Delete Product

Store (Sales)
├─ Sales Records
├─ Sales Details
├─ Customers
└─ Transactions

Staff
├─ Staff List
├─ Add Staff
├─ Edit Staff
└─ Assign Tasks

Reports
├─ Sales Report
├─ Revenue Report
├─ Profit Report
└─ Performance Metrics

Settings
├─ Shop Profile
├─ Shop Settings
└─ Preferences
```

### Shop Owner - Salesman (Winga) Mode

```
Dashboard (Active by default)
├─ Performance Overview
│  ├─ Total Ganji
│  ├─ Total Sales
│  ├─ Targets Progress
│  ├─ Commission Status
│  └─ Period Analysis

My Sales
├─ Sales List
├─ Sale Details
├─ Performance Metrics
└─ Commission Calculation

Ufundi (Services)
├─ Service List
├─ Add Service
├─ Service Details
└─ Service Completion

Targets
├─ Current Targets
├─ Target Progress
├─ Achievement Status
└─ Target History

Matumizi (Expenditures)
├─ Expense List
├─ Add Expense
├─ Expense Details
└─ Expense Analysis

Warranties
├─ Warranty List
├─ File Warranty
├─ Warranty Status
└─ Warranty History

Settings
├─ Personal Profile
├─ Preferences
└─ Notifications
```

## API Routing by Mode

```
┌─ Shop Mode Queries
│  ├─ GET /api/sales?shop_id={shopId}
│  ├─ GET /api/products?shop_id={shopId}
│  ├─ GET /api/users?shop_id={shopId}
│  ├─ POST /api/products (shop_id)
│  └─ PUT /api/products/{id} (shop_id)
│
└─ Salesman Mode Queries
   ├─ GET /api/sales?salesman_id={salesmanId}
   ├─ GET /api/services?salesman_id={salesmanId}
   ├─ GET /api/expenditures?salesman_id={salesmanId}
   ├─ GET /api/targets?salesman_id={salesmanId}
   ├─ POST /api/sales (salesman_id)
   └─ POST /api/expenditures (salesman_id)
```

## CSS Class Structure for Switcher

```
DashboardTabSwitcher
├─ Container
│  ├─ Background: white / dark:gray-700
│  ├─ Padding: px-4 py-2
│  └─ Shadow: shadow-md
│
├─ Shop Button (inactive)
│  ├─ Background: bg-gray-100 / dark:bg-gray-600
│  ├─ Text: text-gray-700 / dark:text-gray-300
│  ├─ Hover: hover:bg-gray-200 / dark:hover:bg-gray-500
│  └─ Transition: transition-all duration-200
│
├─ Shop Button (active)
│  ├─ Background: bg-[#1973AE]
│  ├─ Text: text-white
│  ├─ Shadow: shadow-lg
│  └─ Transition: transition-all duration-200
│
├─ Winga Button (inactive)
│  └─ Same as Shop (inactive)
│
└─ Winga Button (active)
   └─ Same as Shop (active)
```

## LocalStorage Key Structure

```
Key Format: dashboardMode_<userId>
Value: 'shop' | 'salesman'

Examples:
- dashboardMode_123 = 'shop'
- dashboardMode_124 = 'salesman'
- dashboardMode_125 = 'shop'

Persistence:
- Set when mode changes
- Retrieved on login
- Cleared on logout
```

## Event Flow Diagram

```
User Interaction Timeline
─────────────────────────

[Time] [Action]              [Component]      [State Change]
────────────────────────────────────────────────────────────

T0     App Mounts            App              dashboardMode='shop'
       Shop Owner Logged In  App

T1     Page Loads            Navbar           Shows Switcher
       Dashboard             Sidebar          Shows Shop Items
       Default Content       Main             Shows Shop Dash

T2     Click "Winga"         Switcher         onClick triggered
                             DashboardTabSwitcher

T3     onModeChange('sal')   App              setDashboardMode('sal')

T4     Re-render Triggered   App              Effect runs
                             Sidebar          getMenuItems updates

T5     State Updated         Sidebar          menuItems change
                             Main             renderContent updates

T6     DOM Updates           Navbar           Winga highlighted
       Smooth Transition     Sidebar          Salesman items shown
       Content Changes       Main             Salesman content shown

T7     Mode Persisted        localStorage     dashboardMode_<id>='sal'

T8     History Updated       Browser History  state.page='dashboard'
```

## Error Handling Flow

```
Error Scenario → Detection → Recovery → Result

Missing Mode  → Check props → Default to 'shop' → No crash
Invalid Value → Validate type → Fallback to 'shop' → Safe state
API Failure   → Catch error → Show error UI → User feedback
State Sync    → Sync checks → Reload state → Consistent UI
```

## Performance Optimization Points

```
Component        Optimization
─────────────────────────────
DashboardTab..   Memoization, no unnecessary re-renders
Sidebar          Conditional rendering based on mode
Navbar           Tab switcher only for shop owners
App              Efficient routing logic
renderContent()  Mode-based branching (not exhaustive)
localStorage     Only writes on mode change
```

## Browser Compatibility Matrix

```
          Chrome  Firefox  Safari  Edge  Mobile
──────────────────────────────────────────────
Switcher   ✅      ✅       ✅      ✅     ✅
Sidebar    ✅      ✅       ✅      ✅     ✅
Routing    ✅      ✅       ✅      ✅     ✅
Storage    ✅      ✅       ✅      ✅     ✅
Animation  ✅      ✅       ✅      ✅     ✅
Dark Mode  ✅      ✅       ✅      ✅     ✅
```

## User Journey Map

```
                   Shop Owner Journey
        ┌──────────────────────────────┐
        │         LOGIN                │
        │    (Single Account)          │
        └──────────┬───────────────────┘
                   │
         ┌─────────▼─────────┐
         │   Choose Role:    │
         │  (Via Switcher)   │
         │  [Shop] [Winga]   │
         └─┬───────────────┬─┘
           │               │
    ┌──────▼──────┐   ┌────▼──────┐
    │ SHOP OWNER  │   │ SALESMAN   │
    │  DASHBOARD  │   │ DASHBOARD  │
    │             │   │ (WINGA)    │
    ├─────────────┤   ├────────────┤
    │ • Overview  │   │ • Overview │
    │ • Products  │   │ • My Sales │
    │ • Store     │   │ • Ufundi   │
    │ • Staff     │   │ • Targets  │
    │ • Reports   │   │ • Matumizi │
    │ • Settings  │   │ • Warranty │
    │             │   │ • Settings │
    │             │   │            │
    └──────┬──────┘   └────┬───────┘
           │               │
           └───────┬───────┘
                   │
           ┌───────▼────────┐
           │   Switch Back  │
           │  (Anytime)     │
           └────────────────┘
```

---

This architecture supports the complete dual-dashboard implementation with clear separation of concerns and efficient state management.
