# Shop Components

This folder contains reusable components specific to the Shop module.

## Components

### AddProductModal
- **Purpose**: Independent component for adding new products to inventory
- **Location**: `./AddProductModal.tsx`
- **Usage**: Used in `ShopProducts.tsx` when the "Add Product" button is clicked
- **Props**:
  - `isOpen`: boolean - Controls modal visibility
  - `onClose`: function - Callback when modal is closed
  - `onSuccess`: function - Callback when product is successfully created
  - `categories`: Category[] - List of available product categories

## Future Components

This folder can be extended with other Shop-specific components such as:
- Product filtering components
- Inventory management widgets
- Stock alert components
- Bulk import/export components
