# Flutter ↔ Web Design Sync Guide

This document explains how we aligned the salesman Flutter app with the React frontend and how to keep both experiences in sync going forward.

## 1. Shared Design Tokens

- Source of truth: `frontend/tailwind.config.js` (colors, typography, animations).  
- Flutter mirror: `lib/design/tokens.dart`.  
- When updating a token on the web, copy the new value into `WingaplusColors`, `WingaplusSpacing`, etc., then rebuild the app so every widget picks up the change automatically.

## 2. Theme Configuration

- `lib/config/theme.dart` now consumes the tokens and builds Material 3 light/dark themes that match the React palette (primary blue #1973AE, secondary purple, accent green, gray surfaces).  
- Text uses Inter via Google Fonts, matching the web’s default font stack.  
- Buttons, cards, inputs, and FABs share the same radii, padding, and colors as the React components.

### Updating the Theme

1. Edit the relevant token in `tokens.dart`.  
2. Adjust any component-specific overrides in `theme.dart` (e.g., card shadows, input borders).  
3. Run `flutter analyze` to confirm no errors, then `flutter run` or `hot reload` to see changes.

## 3. Layout & Components (Next Steps)

The following widgets keep the Flutter UI visually identical to the React layout:

| React Concept | Flutter Counterpart | Path |
| --- | --- | --- |
| `Layout` (navbar + sidebar) | `WingaplusShell` | `lib/widgets/layout/wingaplus_shell.dart` |
| KPI cards (`StatsCard`, etc.) | `WingaplusStatCard`, `WingaplusSection` | `lib/widgets/ui/` |
| Toast styling | `WingaplusToast` (coming soon) | `lib/widgets/feedback/` |

> **Action**: When porting a new React component, first ask “does a Flutter widget already exist?” If not, add it to the UI kit so other screens can reuse it.

## 4. Screen Parity Checklist

1. **Identify** the React page (e.g., `Dashboard`, `Sales Report`).  
2. **Create** the Flutter screen under `lib/screens/<module>/<name>_screen.dart`.  
3. **Compose** it from shared widgets (`WingaplusStatCard`, `WingaplusSectionHeader`, etc.).  
4. **Wire** it to data providers (`AuthProvider`, `SalesProvider`, future `TargetsProvider`).  
5. **Route** it inside `MaterialApp.routes` and the forthcoming `WingaplusShell` navigation map.

## 5. Future Improvements

- **Component Library Expansion**: build chips, badges, timelines, progress rings to match web micro-components.  
- **Animation Utilities**: mirror Tailwind’s `fade-in`, `slide-up`, `pulse-slow` using implicit animations (`AnimatedOpacity`, `SlideTransition`).  
- **Dark Mode Toggle**: expose a settings option (like the React navbar) to switch `ThemeMode`.  
- **Shared Docs**: when the React design system evolves, update this guide and include screenshots or Figma references for the Flutter team.  
- **Testing**: add widget tests that assert colors/typography for critical widgets, ensuring regressions fail fast.

## 6. Workflow Summary

1. Pull latest `frontend` to capture any tailwind/theming changes.  
2. Update `tokens.dart` (and `theme.dart` if necessary).  
3. Implement or adjust Flutter widgets/screens.  
4. Run `flutter test` and `flutter run -d <device>` to verify on real hardware.  
5. Commit with a message like `feat(flutter): sync theme with web design`.

Following this loop keeps both apps visually aligned while allowing either side to evolve intentionally.

