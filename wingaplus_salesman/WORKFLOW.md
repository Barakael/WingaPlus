# Flutter Salesman App - Development Workflow

## 🎯 Project Overview

This Flutter app provides mobile access to WingaPro salesman features with the same design and functionality as your React web application.

## 📋 Implementation Status

### ✅ Completed (Phase 1)

1. **Project Structure**
   - ✅ `pubspec.yaml` - Dependencies configured
   - ✅ `lib/config/theme.dart` - Brand colors (#1973AE, #04BCF2)
   - ✅ `lib/config/constants.dart` - API configuration

2. **Data Models**
   - ✅ `User` - User authentication model
   - ✅ `Sale` - Sales transaction model
   - ✅ `Target` - Sales targets model
   - ✅ `ServiceRecord` - Service records model
   - ✅ `Product` - Product catalog model

3. **API Services**
   - ✅ `ApiService` - Base HTTP client with auth
   - ✅ `AuthService` - Login/logout functionality
   - ✅ `SalesService` - CRUD operations for sales

4. **State Management**
   - ✅ `AuthProvider` - Authentication state
   - ✅ `SalesProvider` - Sales data state

5. **Core Screens**
   - ✅ `LoginScreen` - User authentication
   - ✅ `SalesmanDashboard` - Main overview
   - ✅ `SplashScreen` - App initialization

6. **Reusable Widgets**
   - ✅ `StatsCard` - Statistics display
   - ✅ `AppBarCustom` - App bar with logout

### 🔨 To Be Implemented (Phase 2)

#### Sales Module Screens

1. **My Sales Screen** (`lib/screens/sales/my_sales_screen.dart`)
   ```dart
   Features needed:
   - List all sales with pagination
   - Filter by date (daily/monthly/yearly/range)
   - Search by product/customer
   - Pull-to-refresh
   - View/Edit/Delete actions
   - Export to PDF/Excel
   ```

2. **Sale Form Screen** (`lib/screens/sales/sale_form_screen.dart`)
   ```dart
   Features needed:
   - Product selection dropdown
   - Quantity input
   - Price calculation (auto profit)
   - Customer details (optional)
   - Offer/discount input
   - Store name input
   - Date picker
   - Form validation
   - Submit to API
   ```

3. **Sale Detail Screen** (`lib/screens/sales/sale_detail_screen.dart`)
   ```dart
   Features needed:
   - Display full sale details
   - Product info
   - Customer info
   - Pricing breakdown
   - Profit calculation
   - Edit button
   - Delete button
   ```

4. **Edit Sale Modal** (`lib/screens/sales/edit_sale_screen.dart`)
   ```dart
   Features needed:
   - Pre-filled form with existing data
   - Update sale information
   - Recalculate profit
   - Submit changes to API
   ```

#### Additional Screens

5. **Commission Tracking** (`lib/screens/commissions/commission_screen.dart`)
   ```dart
   Features needed:
   - Monthly earnings display
   - Performance charts (fl_chart)
   - Target vs achievement
   - Top products sold
   - Commission breakdown
   - Export report
   ```

6. **Targets Screen** (`lib/screens/targets/targets_screen.dart`)
   ```dart
   Features needed:
   - List all targets
   - Progress bars
   - Achievement percentage
   - Target details (amount, period)
   - Remaining amount to achieve
   ```

#### Reusable Widgets

7. **Filter Bottom Sheet** (`lib/widgets/sales/filter_bottom_sheet.dart`)
   ```dart
   - Date range picker
   - Filter type selection (daily/monthly/yearly/range)
   - Apply/Reset buttons
   ```

8. **Sale Card** (`lib/widgets/sales/sale_card.dart`)
   ```dart
   - Display sale in list format
   - Product name & quantity
   - Price & profit
   - Date
   - Action buttons
   ```

9. **Loading Widget** (`lib/widgets/common/loading_widget.dart`)
   ```dart
   - Centered progress indicator
   - Shimmer loading effect
   ```

## 🛠️ Quick Start Commands

### Initial Setup
```bash
# Navigate to project
cd /Users/barakael0/WingaPro/WingaPro_salesman

# Get dependencies
flutter pub get

# Check setup
flutter doctor
```

### Run Development
```bash
# Run on iOS simulator
flutter run -d ios

# Run on Android emulator
flutter run -d android

# Run with hot reload enabled (default)
flutter run
```

### Build Release
```bash
# Android APK
flutter build apk --release

# iOS (requires Xcode)
flutter build ios --release
```

## 🔗 API Configuration

**Important:** Update your API URL before running!

Edit `lib/config/constants.dart`:

```dart
// For local development
static const String baseUrl = 'http://localhost:8000/api';

// For testing on physical device (use your computer's IP)
static const String baseUrl = 'http://192.168.1.100:8000/api';

// For production
static const String baseUrl = 'https://api.WingaPro.com/api';
```

### Find Your Computer's IP (for physical device testing)

**macOS:**
```bash
ipconfig getifaddr en0
```

**Windows:**
```bash
ipconfig
# Look for "IPv4 Address"
```

## 📱 Testing Flow

### 1. Login Flow
```
1. Open app → Splash screen
2. Check auth → Navigate to Login
3. Enter: james@wingaelectronics.co.tz / password
4. Click Login → Navigate to Dashboard
5. View today's sales statistics
```

### 2. Dashboard Features
```
- View sales count, revenue, profit
- See quick action cards
- View recent sales list
- Pull down to refresh
- Click "New Sale" FAB → Navigate to Sale Form (when implemented)
- Click "My Sales" → Navigate to Sales List (when implemented)
```

### 3. Logout Flow
```
1. Click account icon (top right)
2. Click Logout
3. Clear token & navigate to Login
```

## 🎨 Design System

### Colors (Matching Web App)
```dart
Primary Blue: #1973AE
Secondary Blue: #04BCF2
Success: #10B981
Warning: #F59E0B
Error: #EF4444
Gray: #6B7280
Light Gray: #F3F4F6
```

### Typography
- Font: Inter (via Google Fonts)
- Sizes: 12-24px

### Spacing
- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- 2xl: 32px

## 🐛 Common Issues & Solutions

### "Cannot connect to localhost"
```bash
# Physical device cannot reach localhost
# Solution: Use computer's IP address
# Edit lib/config/constants.dart:
static const String baseUrl = 'http://192.168.1.X:8000/api';
```

### "CocoaPods error" (iOS)
```bash
cd ios
pod deintegrate
pod install
cd ..
flutter run
```

### "Gradle error" (Android)
```bash
cd android
./gradlew clean
cd ..
flutter clean
flutter pub get
flutter run
```

### "Certificate verification failed"
```bash
# For development only, allow HTTP in AndroidManifest.xml:
android:usesCleartextTraffic="true"
```

## 📊 Performance Optimization

### For Large Sales Lists
```dart
// Use ListView.builder for infinite scroll
// Implement pagination (load 20 items at a time)
// Cache images with cached_network_image
// Use const constructors where possible
```

### State Management Best Practices
```dart
// Only call notifyListeners() when data changes
// Use Consumer widget to limit rebuilds
// Keep providers focused (single responsibility)
```

## 🚀 Deployment Checklist

### Before Release

- [ ] Update API URL to production
- [ ] Remove debug logs
- [ ] Test on both iOS and Android
- [ ] Test with slow network
- [ ] Test offline scenarios
- [ ] Update app version in pubspec.yaml
- [ ] Create app icons (1024x1024)
- [ ] Create splash screen
- [ ] Configure proper signing (iOS/Android)
- [ ] Test with real user credentials

### App Store Requirements

**iOS:**
- [ ] App Store Connect account
- [ ] Screenshots (various device sizes)
- [ ] App description
- [ ] Privacy policy
- [ ] Apple Developer account ($99/year)

**Android:**
- [ ] Google Play Console account ($25 one-time)
- [ ] Screenshots (phone/tablet)
- [ ] App description
- [ ] Privacy policy
- [ ] Content rating questionnaire

## 📈 Future Enhancements

### Phase 3 (Optional)
- [ ] Offline mode (local database with sqflite)
- [ ] Push notifications (Firebase)
- [ ] Barcode scanner for product selection
- [ ] Camera integration for product photos
- [ ] Biometric authentication (fingerprint/face)
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Advanced analytics dashboard

## 🤝 Development Team Notes

### Code Style
- Use `const` constructors when possible
- Follow Effective Dart guidelines
- Keep widgets small and focused
- Use meaningful variable names
- Comment complex logic

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/sales-list-screen

# Commit changes
git add .
git commit -m "feat: implement sales list screen with filters"

# Push to remote
git push origin feature/sales-list-screen
```

---

**Status:** Phase 1 Complete ✅  
**Next:** Implement Sales List Screen  
**Est. Time to Complete All Screens:** 2-3 weeks

