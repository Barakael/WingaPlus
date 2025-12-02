import 'package:flutter/material.dart';

import '../../design/tokens.dart';
import 'wingaplus_destination.dart';

typedef WingaProNavCallback = void Function(int index);

class WingaProNavRail extends StatelessWidget {
  final List<WingaProDestination> destinations;
  final int currentIndex;
  final WingaProNavCallback onDestinationSelected;

  const WingaProNavRail({
    super.key,
    required this.destinations,
    required this.currentIndex,
    required this.onDestinationSelected,
  });

  @override
  Widget build(BuildContext context) {
    return NavigationRail(
      backgroundColor: Theme.of(context).colorScheme.surface,
      selectedIndex: currentIndex,
      onDestinationSelected: onDestinationSelected,
      minExtendedWidth: 220,
      extended: MediaQuery.sizeOf(context).width >= 1400,
      leading: const SizedBox(height: WingaProSpacing.xl),
      groupAlignment: -0.8,
      labelType: NavigationRailLabelType.none,
      destinations: destinations
          .map(
            (dest) => NavigationRailDestination(
              icon: Icon(dest.icon),
              selectedIcon: Icon(
                dest.icon,
                color: WingaProColors.brandPrimary,
              ),
              label: Text(dest.label),
            ),
          )
          .toList(),
    );
  }
}

class WingaProNavDrawer extends StatelessWidget {
  final List<WingaProDestination> destinations;
  final int currentIndex;
  final WingaProNavCallback onDestinationSelected;

  const WingaProNavDrawer({
    super.key,
    required this.destinations,
    required this.currentIndex,
    required this.onDestinationSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: SafeArea(
        child: ListView.builder(
          itemCount: destinations.length,
          itemBuilder: (context, index) {
            final destination = destinations[index];
            final isSelected = index == currentIndex;
            return ListTile(
              leading: Icon(
                destination.icon,
                color: isSelected
                    ? WingaProColors.brandPrimary
                    : WingaProColors.gray500,
              ),
              title: Text(
                destination.label,
                style: TextStyle(
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                ),
              ),
              selected: isSelected,
              selectedTileColor: WingaProColors.primary50,
              onTap: () {
                Navigator.of(context).pop();
                onDestinationSelected(index);
              },
            );
          },
        ),
      ),
    );
  }
}

class WingaProBottomNav extends StatelessWidget {
  final List<WingaProDestination> destinations;
  final int currentIndex;
  final WingaProNavCallback onDestinationSelected;

  const WingaProBottomNav({
    super.key,
    required this.destinations,
    required this.currentIndex,
    required this.onDestinationSelected,
  });

  @override
  Widget build(BuildContext context) {
    return NavigationBar(
      height: 68,
      selectedIndex: currentIndex,
      onDestinationSelected: onDestinationSelected,
      destinations: destinations
          .map(
            (dest) => NavigationDestination(
              icon: Icon(dest.icon),
              label: dest.label,
            ),
          )
          .toList(),
    );
  }
}
