<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use App\Models\Sale;
use App\Mail\WarrantyFiled;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

echo "=== Warranty Data Diagnostic ===\n\n";

// Step 1: Check what tables exist
echo "Step 1: Checking database tables...\n";
$tables = DB::select("SHOW TABLES");
$tableList = array_map(function($t) { 
    return array_values((array)$t)[0]; 
}, $tables);

echo "Tables found: " . implode(", ", $tableList) . "\n\n";

// Step 2: Check warranties table
echo "Step 2: Checking warranties table...\n";
$warrantyCount = DB::table('warranties')->count();
echo "Warranties table row count: $warrantyCount\n";

if ($warrantyCount > 0) {
    echo "Sample warranty:\n";
    $sample = DB::table('warranties')->first();
    echo json_encode($sample, JSON_PRETTY_PRINT) . "\n";
}

echo "\n";

// Step 3: Check sales table (might have warranty data)
echo "Step 3: Checking sales table for warranty data...\n";
$salesCount = DB::table('sales')->count();
echo "Total sales: $salesCount\n";

$salesWithWarranty = DB::table('sales')->where('has_warranty', true)->count();
echo "Sales with warranty: $salesWithWarranty\n";

if ($salesWithWarranty > 0) {
    echo "Sample sale with warranty:\n";
    $sample = DB::table('sales')->where('has_warranty', true)->first();
    echo json_encode($sample, JSON_PRETTY_PRINT) . "\n";
}

echo "\n";

// Step 4: Show columns in sales table
echo "Step 4: Sales table structure...\n";
$columns = DB::select("DESCRIBE sales");
echo "Columns: " . implode(", ", array_map(function($c) { return $c->Field; }, $columns)) . "\n\n";

// Step 5: Show columns in warranties table
if (in_array('warranties', $tableList)) {
    echo "Step 5: Warranties table structure...\n";
    $columns = DB::select("DESCRIBE warranties");
    echo "Columns: " . implode(", ", array_map(function($c) { return $c->Field; }, $columns)) . "\n";
}
