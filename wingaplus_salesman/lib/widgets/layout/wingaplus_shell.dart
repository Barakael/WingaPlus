import 'package:flutter/material.dart';

import '../../design/tokens.dart';
import 'wingaplus_destination.dart';
import 'wingaplus_nav.dart';
import 'wingaplus_top_bar.dart';

class WingaProShell extends StatefulWidget {
  final List<WingaProDestination> destinations;
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

  const WingaProShell({
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
  State<WingaProShell> createState() => _WingaProShellState();
}

class _WingaProShellState extends State<WingaProShell> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    final isDesktop = width >= 1100;
    final isTablet = width >= 768;

    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: WingaProTopBar(
        title: widget.title ?? widget.destinations[widget.currentIndex].label,
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
          : WingaProNavDrawer(
              destinations: widget.destinations,
              currentIndex: widget.currentIndex,
              onDestinationSelected: widget.onDestinationSelected,
            ),
      body: Row(
        children: [
          if (isDesktop)
            WingaProNavRail(
              destinations: widget.destinations,
              currentIndex: widget.currentIndex,
              onDestinationSelected: widget.onDestinationSelected,
            ),
          Expanded(
            child: Container(
              padding: EdgeInsets.all(
                isTablet ? WingaProSpacing.xl : WingaProSpacing.lg,
              ),
              decoration: BoxDecoration(
                color: Theme.of(context).brightness == Brightness.dark
                    ? WingaProColors.gray900
                    : WingaProColors.gray100,
              ),
              child: ClipRRect(
                borderRadius: WingaProRadius.lg,
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
          : WingaProBottomNav(
              destinations: widget.destinations,
              currentIndex: widget.currentIndex,
              onDestinationSelected: widget.onDestinationSelected,
            ),
      floatingActionButton: widget.floatingActionButton,
    );
  }
}
