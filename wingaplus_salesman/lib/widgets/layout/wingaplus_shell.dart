import 'package:flutter/material.dart';

import '../../design/tokens.dart';
import 'wingaplus_destination.dart';
import 'wingaplus_nav.dart';
import 'wingaplus_top_bar.dart';

class WingaplusShell extends StatefulWidget {
  final List<WingaplusDestination> destinations;
  final int currentIndex;
  final ValueChanged<int> onDestinationSelected;
  final Widget child;
  final String? title;
  final String? subtitle;
  final String? userName;
  final String? userRole;
  final VoidCallback? onLogout;
  final Widget? floatingActionButton;
  final List<Widget>? actions;

  const WingaplusShell({
    super.key,
    required this.destinations,
    required this.currentIndex,
    required this.onDestinationSelected,
    required this.child,
    this.title,
    this.subtitle,
    this.userName,
    this.userRole,
    this.onLogout,
    this.floatingActionButton,
    this.actions,
  });

  @override
  State<WingaplusShell> createState() => _WingaplusShellState();
}

class _WingaplusShellState extends State<WingaplusShell> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    final isDesktop = width >= 1100;
    final isTablet = width >= 768;

    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: WingaplusTopBar(
        title:
            widget.title ?? widget.destinations[widget.currentIndex].label,
        subtitle: widget.subtitle,
        showMenuButton: !isDesktop,
        onMenuTap: () => _scaffoldKey.currentState?.openDrawer(),
        userName: widget.userName,
        userRole: widget.userRole,
        onLogout: widget.onLogout,
        actions: widget.actions,
      ),
      drawer: isDesktop
          ? null
          : WingaplusNavDrawer(
              destinations: widget.destinations,
              currentIndex: widget.currentIndex,
              onDestinationSelected: widget.onDestinationSelected,
            ),
      body: Row(
        children: [
          if (isDesktop)
            WingaplusNavRail(
              destinations: widget.destinations,
              currentIndex: widget.currentIndex,
              onDestinationSelected: widget.onDestinationSelected,
            ),
          Expanded(
            child: Container(
              padding: EdgeInsets.all(
                isTablet ? WingaplusSpacing.xl : WingaplusSpacing.lg,
              ),
              decoration: BoxDecoration(
                color: Theme.of(context).brightness == Brightness.dark
                    ? WingaplusColors.gray900
                    : WingaplusColors.gray100,
              ),
              child: ClipRRect(
                borderRadius: WingaplusRadius.lg,
                child: Container(
                  color: Theme.of(context).colorScheme.surface,
                  child: widget.child,
                ),
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: isDesktop
          ? null
          : WingaplusBottomNav(
              destinations: widget.destinations,
              currentIndex: widget.currentIndex,
              onDestinationSelected: widget.onDestinationSelected,
            ),
      floatingActionButton: widget.floatingActionButton,
    );
  }
}

