/**
 * Maps database role values to user-friendly display names
 */
export const getRoleDisplayName = (role: string): string => {
  const roleMap: Record<string, string> = {
    'salesman': 'Winga',
    'shop_owner': 'Shop Owner',
    'storekeeper': 'Storekeeper',
    'super_admin': 'Super Admin',
  };
  
  return roleMap[role] || role.replace('_', ' ');
};

/**
 * Gets the color class for a role badge
 */
export const getRoleBadgeColor = (role: string): string => {
  switch (role) {
    case 'super_admin':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'shop_owner':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'salesman':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'storekeeper':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};
