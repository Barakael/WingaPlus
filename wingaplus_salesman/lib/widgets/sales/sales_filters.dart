import 'package:flutter/material.dart';

import '../../design/tokens.dart';

typedef SalesFilterChanged = void Function(String filter);

class SalesFilterBar extends StatelessWidget {
  final String activeFilter;
  final SalesFilterChanged onChanged;

  static const _filters = ['Daily', 'Weekly', 'Monthly', 'Custom'];

  const SalesFilterBar({
    super.key,
    required this.activeFilter,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: WingaplusSpacing.sm,
      runSpacing: WingaplusSpacing.sm,
      children: _filters.map((filter) {
        final isSelected = filter == activeFilter;
        return ChoiceChip(
          label: Text(filter),
          selected: isSelected,
          onSelected: (_) => onChanged(filter),
          selectedColor: WingaplusColors.brandPrimary,
          labelStyle: TextStyle(
            color: isSelected ? Colors.white : WingaplusColors.gray600,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
          ),
        );
      }).toList(),
    );
  }
}

