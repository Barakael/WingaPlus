#!/bin/bash

# Build Release IPA Script for WingaPro Salesman App
# This creates an independent app that doesn't require debug mode

set -e

echo "🚀 Building WingaPro Salesman App for Release..."

# Navigate to project directory
cd "$(dirname "$0")"

# Clean previous builds
echo "📦 Cleaning previous builds..."
flutter clean

# Get dependencies
echo "📥 Getting dependencies..."
flutter pub get

# Build iOS release
echo "🔨 Building iOS release..."
flutter build ios --release --no-codesign

echo ""
echo "✅ Build complete!"
echo ""
echo "📱 Next steps to create installable app:"
echo ""
echo "1. Open Xcode:"
echo "   open ios/Runner.xcworkspace"
echo ""
echo "2. In Xcode:"
echo "   - Select 'Any iOS Device' or your iPhone from device dropdown"
echo "   - Go to Product > Archive"
echo "   - Wait for archive to complete"
echo "   - In Organizer window, click 'Distribute App'"
echo "   - Choose 'Ad Hoc' or 'Development' distribution"
echo "   - Select your team and provisioning profile"
echo "   - Export the .ipa file"
echo ""
echo "3. Install on iPhone:"
echo "   - Transfer .ipa to iPhone (via AirDrop, email, or iTunes)"
echo "   - Or use: xcrun devicectl device install app --device <device-id> <path-to-ipa>"
echo ""
echo "💡 For easier installation, you can also use:"
echo "   - TestFlight (for App Store distribution)"
echo "   - Xcode: Window > Devices and Simulators > Install .ipa"
echo ""



