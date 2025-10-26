# Test Offers Calculation

## Test Case 1:
- **Unit Price**: 1000
- **Cost Price**: 600  
- **Quantity**: 1
- **Offers**: 50

**Expected Base Profit**: (1000 - 600) * 1 = 400
**Expected Final Ganji**: 400 - 50 = 350

## Test Case 2:
- **Unit Price**: 2000
- **Cost Price**: 1200
- **Quantity**: 2  
- **Offers**: 100

**Expected Base Profit**: (2000 - 1200) * 2 = 1600
**Expected Final Ganji**: 1600 - 100 = 1500

## How to Test:
1. Open the React app
2. Create a sale with the values from Test Case 1
3. Check the browser console for debug logs:
   - "Sale data being sent:" should show offers: 50
   - "Created sale response:" should show ganji: 350
4. If the ganji is not 350, there's still an issue with the backend calculation

## Backend Logic (should be working now):
```php
// In SalesController.php store method:
if (array_key_exists('cost_price', $validated)) {
    $costPrice = $validated['cost_price'] ?? 0;
    $sellingPrice = $validated['selling_price'] ?? 0;
    $quantity = $validated['quantity'] ?? 1;
    $offers = $validated['offers'] ?? 0;
    
    $baseProfit = ($sellingPrice - $costPrice) * $quantity;
    $validated['ganji'] = $baseProfit - $offers; // Should be 350 for Test Case 1
}
```