# WingaPlus Salesman Mobile App

A Flutter mobile application for salesmen to manage sales, track commissions, and monitor targets. This app connects to the same Laravel API as your web application.

## 📱 Features Implemented

### ✅ **Authentication**
- Login with existing credentials
- Secure token storage
- Auto-login on app restart
- Logout functionality

### ✅ **Dashboard**
- Today's sales statistics
- Revenue & profit tracking
- Quick action cards
- Recent sales list
- Pull-to-refresh

### ✅ **Core Infrastructure**
- API service with authentication
- State management (Provider)
- Error handling
- Theme configuration (matching web app colors)
- Models for User, Sale, Target, Service, Product

## 🎨 Design

The app uses the same color scheme as your web application:
- **Primary Blue**: `#1973AE`
- **Secondary Blue**: `#04BCF2`
- **Success Green**: `#10B981`
- **Warning Yellow**: `#F59E0B`
- **Error Red**: `#EF4444`

## 🚀 Setup Instructions

### Prerequisites

1. **Install Flutter** (3.0.0 or higher)
   ```bash
   # macOS (using Homebrew)
   brew install flutter
   
   # Verify installation
   flutter doctor
   ```

2. **Install Xcode** (for iOS development)
   - Download from Mac App Store
   - Install Xcode Command Line Tools:
   ```bash
   sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
   sudo xcodebuild -runFirstLaunch
   ```

3. **Install Android Studio** (for Android development)
   - Download from https://developer.android.com/studio
   - Install Android SDK and create virtual device

### Project Setup

1. **Navigate to project directory**
   ```bash
   cd /Users/barakael0/WingaPlus/wingaplus_salesman
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Configure API URL**
   
   Edit `lib/config/constants.dart` and update the `baseUrl`:
   ```dart
   // For development (local Laravel)
   static const String baseUrl = 'http://localhost:8000/api';
   
   // For production
   static const String baseUrl = 'https://your-domain.com/api';
   
   // For testing on physical device (replace with your computer's IP)
   static const String baseUrl = 'http://192.168.1.X:8000/api';
   ```

4. **Run the app**
   
   **For iOS Simulator:**
   ```bash
   flutter run -d ios
   ```
   
   **For Android Emulator:**
   ```bash
   flutter run -d android
   ```
   
   **For Physical Device:**
   ```bash
   # List available devices
   flutter devices
   
   # Run on specific device
   flutter run -d <device-id>
   ```

### iOS Setup (Additional Steps)

1. **Configure iOS permissions**
   
   The app may need additional permissions. Edit `ios/Runner/Info.plist`:
   ```xml
   <key>NSCameraUsageDescription</key>
   <string>We need camera access to capture product images</string>
   <key>NSPhotoLibraryUsageDescription</key>
   <string>We need photo library access to select product images</string>
   ```

2. **Update minimum iOS version**
   
   Edit `ios/Podfile`:
   ```ruby
   platform :ios, '12.0'
   ```

3. **Install CocoaPods dependencies**
   ```bash
   cd ios
   pod install
   cd ..
   ```

### Android Setup (Additional Steps)

1. **Update minimum Android SDK**
   
   Edit `android/app/build.gradle`:
   ```gradle
   android {
       defaultConfig {
           minSdkVersion 21
           targetSdkVersion 34
       }
   }
   ```

2. **Enable internet permission**
   
   Edit `android/app/src/main/AndroidManifest.xml`:
   ```xml
   <uses-permission android:name="android.permission.INTERNET" />
   ```

## 🔐 Login Credentials

Use your existing seeded credentials:

```
Email: james@wingaelectronics.co.tz
Password: password

Email: mary@wingaelectronics.co.tz
Password: password

Email: david@wingaelectronics.co.tz
Password: password
```

## 📂 Project Structure

```
lib/
├── config/
│   ├── theme.dart              # App theme & colors
│   └── constants.dart          # API URLs & constants
├── models/
│   ├── user.dart
│   ├── sale.dart
│   ├── target.dart
│   ├── service.dart
│   └── product.dart
├── services/
│   ├── api_service.dart        # Base API client
│   ├── auth_service.dart       # Authentication
│   └── sales_service.dart      # Sales operations
├── providers/
│   ├── auth_provider.dart      # Auth state management
│   └── sales_provider.dart     # Sales state management
├── screens/
│   ├── auth/
│   │   └── login_screen.dart
│   └── dashboard/
│       └── salesman_dashboard.dart
├── widgets/
│   └── common/
│       └── stats_card.dart
└── main.dart
```

## 🛠️ Development Commands

### Run app
```bash
flutter run
```

### Run with hot reload
```bash
flutter run --hot
# Press 'r' to hot reload
# Press 'R' to hot restart
```

### Build for release
```bash
# Android APK
flutter build apk --release

# Android App Bundle (for Play Store)
flutter build appbundle --release

# iOS (requires Mac)
flutter build ios --release
```

### Check for issues
```bash
flutter doctor
flutter analyze
```

### Clean build
```bash
flutter clean
flutter pub get
```

## 📱 Testing on Physical Device

### iOS (iPhone/iPad)

1. Connect device via USB
2. Trust computer on device
3. In Xcode, select your team in Signing & Capabilities
4. Run: `flutter run`

### Android

1. Enable Developer Options on device
2. Enable USB Debugging
3. Connect via USB
4. Run: `flutter run`

## 🔄 Next Steps - Remaining Screens

The following screens need to be implemented:

1. **My Sales Screen** (`lib/screens/sales/my_sales_screen.dart`)
   - Sales list with filters
   - Search functionality
   - Pagination
   - Pull-to-refresh

2. **Sale Form Screen** (`lib/screens/sales/sale_form_screen.dart`)
   - Create new sale
   - Product selection
   - Price calculation
   - Form validation

3. **Sale Detail Screen** (`lib/screens/sales/sale_detail_screen.dart`)
   - View sale details
   - Edit/Delete options

4. **Commission Screen** (`lib/screens/commissions/commission_screen.dart`)
   - Monthly earnings
   - Performance charts
   - Target progress

5. **Targets Screen** (`lib/screens/targets/targets_screen.dart`)
   - View targets
   - Progress tracking

## 🌐 API Integration

The app connects to your Laravel API at:
- **Local**: `http://localhost:8000/api`
- **Production**: Update in `lib/config/constants.dart`

### API Endpoints Used

- `POST /login` - Authentication
- `GET /sales` - List sales
- `POST /sales` - Create sale
- `PUT /sales/{id}` - Update sale
- `DELETE /sales/{id}` - Delete sale
- `GET /targets` - List targets
- `GET /services` - List services
- `GET /products` - List products

## 🐛 Troubleshooting

### Issue: "Cannot connect to API"
- Check API URL in `constants.dart`
- For physical device, use computer's IP instead of `localhost`
- Ensure Laravel API is running
- Check CORS configuration in Laravel

### Issue: "Certificate verification failed"
- For development, you may need to allow HTTP traffic
- Edit `ios/Runner/Info.plist` or `android/app/src/main/AndroidManifest.xml`

### Issue: "Build failed"
```bash
flutter clean
flutter pub get
flutter run
```

### Issue: "CocoaPods error" (iOS)
```bash
cd ios
pod deintegrate
pod install
cd ..
flutter run
```

## 📦 Dependencies

Main packages used:
- `provider` - State management
- `http` / `dio` - API requests
- `flutter_secure_storage` - Secure token storage
- `google_fonts` - Custom fonts
- `intl` - Date/number formatting
- `fl_chart` - Charts (for commission screen)
- `pdf` / `excel` - Export functionality

## 🚀 Deployment

### Android (Google Play Store)

1. Create keystore for signing
2. Build app bundle: `flutter build appbundle --release`
3. Upload to Google Play Console

### iOS (App Store)

1. Configure signing in Xcode
2. Build archive: `flutter build ios --release`
3. Open Xcode and archive
4. Upload to App Store Connect

## 📝 Notes

- This is the initial foundation with Login and Dashboard
- Additional screens (Sales, Commissions, Targets) need to be implemented
- The app uses the same API as your web application
- All authentication tokens are stored securely
- The app supports both light and dark themes

## 🤝 Support

For issues or questions:
1. Check `flutter doctor` output
2. Review API connection settings
3. Check Laravel API logs
4. Verify authentication tokens

---

**Version:** 1.0.0  
**Last Updated:** November 15, 2025
