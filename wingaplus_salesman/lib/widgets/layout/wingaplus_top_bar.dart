import 'package:flutter/material.dart';

import '../../config/theme.dart';
import '../../design/tokens.dart';

class WingaProTopBar extends StatelessWidget implements PreferredSizeWidget {
  final VoidCallback? onMenuTap;
  final bool showMenuButton;
  final String title;
  final String? subtitle;
  final String? userName;
  final String? userRole;
  final VoidCallback? onLogout;
  final List<Widget>? actions;

  const WingaProTopBar({
    super.key,
    this.onMenuTap,
    this.showMenuButton = true,
    required this.title,
    this.subtitle,
    this.userName,
    this.userRole,
    this.onLogout,
    this.actions,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Material(
      color: Theme.of(context).appBarTheme.backgroundColor,
      elevation: 0,
      child: SafeArea(
        bottom: false,
        child: Container(
          height: preferredSize.height,
          padding: const EdgeInsets.symmetric(horizontal: WingaProSpacing.lg),
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(
                color: isDark ? WingaProColors.gray800 : WingaProColors.gray200,
              ),
            ),
          ),
          child: Row(
            children: [
              if (showMenuButton)
                IconButton(
                  icon: const Icon(Icons.menu_rounded),
                  onPressed: onMenuTap,
                ),
              const SizedBox(width: WingaProSpacing.md),
              _buildBrand(context),
              const SizedBox(width: WingaProSpacing.lg),
              Expanded(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                            color:
                                Theme.of(context).appBarTheme.foregroundColor,
                          ),
                    ),
                    if (subtitle != null)
                      Text(
                        subtitle!,
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: WingaProColors.gray500,
                            ),
                      ),
                  ],
                ),
              ),
              if (actions != null) ...actions!,
              const SizedBox(width: WingaProSpacing.lg),
              _buildUserChip(context),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBrand(BuildContext context) {
    const color = WingaProColors.brandPrimary;
    return Row(
      children: [
        Container(
          width: 36,
          height: 36,
          decoration: const BoxDecoration(
            color: color,
            borderRadius: WingaProRadius.sm,
            boxShadow: WingaProShadows.cardLight,
          ),
          alignment: Alignment.center,
          child: const Text(
            'WP',
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        const SizedBox(width: WingaProSpacing.sm),
        Text(
          'WingaPro',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
                color: color,
              ),
        ),
      ],
    );
  }

  Widget _buildUserChip(BuildContext context) {
    final displayName = userName ?? 'User';
    final role = userRole ?? 'Salesman';
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: WingaProSpacing.md,
        vertical: WingaProSpacing.sm,
      ),
      decoration: BoxDecoration(
        borderRadius: WingaProRadius.lg,
        color: Theme.of(context).brightness == Brightness.dark
            ? WingaProColors.gray700
            : WingaProColors.gray50,
        border: Border.all(
          color: Theme.of(context).brightness == Brightness.dark
              ? WingaProColors.gray700
              : WingaProColors.gray200,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const CircleAvatar(
            radius: 14,
            backgroundColor: WingaProColors.brandPrimary,
            child: Icon(
              Icons.person,
              size: 16,
              color: Colors.white,
            ),
          ),
          const SizedBox(width: WingaProSpacing.sm),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                displayName,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
              ),
              Text(
                role,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: WingaProColors.gray500,
                    ),
              ),
            ],
          ),
          if (onLogout != null) ...[
            const SizedBox(width: WingaProSpacing.sm),
            InkWell(
              onTap: onLogout,
              borderRadius: BorderRadius.circular(20),
              child: const Padding(
                padding: EdgeInsets.all(4.0),
                child: Icon(
                  Icons.logout,
                  size: 18,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(64);
}
