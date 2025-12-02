import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'config/theme.dart';
import 'providers/auth_provider.dart';
import 'providers/sales_provider.dart';
import 'screens/auth/login_screen.dart';
import 'screens/dashboard/salesman_dashboard.dart';
import 'screens/sales/my_sales_screen.dart';
import 'screens/warranties/warranty_screen.dart';
import 'screens/services/service_screen.dart';
import 'screens/commissions/commission_tracking_screen.dart';
import 'screens/targets/target_management_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()..initialize()),
        ChangeNotifierProvider(create: (_) => SalesProvider()),
      ],
      child: MaterialApp(
        title: 'WingaPro Salesman',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: ThemeMode.light,
        home: const SplashScreen(),
        routes: {
          '/login': (context) => const LoginScreen(),
          '/dashboard': (context) => const SalesmanDashboard(),
          '/my-sales': (context) => const MySalesScreen(),
          '/warranties': (context) => const WarrantyScreen(),
          '/services': (context) => const ServiceScreen(),
          '/commissions': (context) => const CommissionTrackingScreen(),
          '/targets': (context) => const TargetManagementScreen(),
        },
      ),
    );
  }
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    // Use addPostFrameCallback to ensure context is ready
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _checkAuth();
    });
  }

  Future<void> _checkAuth() async {
    await Future.delayed(const Duration(seconds: 1)); // Minimum splash time

    if (!mounted) return;

    final authProvider = context.read<AuthProvider>();

    // Wait for auth initialization with timeout
    int attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait
    
    while (authProvider.isLoading && attempts < maxAttempts) {
      await Future.delayed(const Duration(milliseconds: 100));
      attempts++;
      if (!mounted) return;
    }

    if (!mounted) return;

    // Always navigate to login if initialization failed or user not authenticated
    if (authProvider.isAuthenticated) {
      Navigator.of(context).pushReplacementNamed('/dashboard');
    } else {
      Navigator.of(context).pushReplacementNamed('/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.primaryBlue,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.store_mall_directory_rounded,
              size: 100,
              color: AppTheme.white,
            ),
            const SizedBox(height: 24),
            Text(
              'WingaPro',
              style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: AppTheme.white,
                  ),
            ),
            const SizedBox(height: 8),
            Text(
              'Salesman App',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    color: AppTheme.white.withOpacity(0.9),
                  ),
            ),
            const SizedBox(height: 48),
            const CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(AppTheme.white),
            ),
          ],
        ),
      ),
    );
  }
}
