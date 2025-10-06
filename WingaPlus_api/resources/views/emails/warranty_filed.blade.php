<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Warranty – {{ $warranty->phone_name }}</title>
<style>
    body{
        margin:0;
        padding:0;
        background:#f2f3f5;
        font-family:"Sans-serif",Roboto,Arial,sans-serif;
        color:#333;
    }
    .card{
        max-width:640px;
        margin:20px auto;
        background:#fff;
        border-radius:10px;
        box-shadow:0 2px 8px rgba(0,0,0,0.08);
        overflow:hidden;
    }
    .header{
        background:#1e293b;
        color:#fff;
        text-align:center;
        padding:18px;
    }
    .header h1{
        margin:0;
        font-size:20px;
        font-weight:800;
    }
    .content{
        padding:20px 24px;
        font-size:15px;
    }
    .content p{
        margin:0 0 14px 0;
        line-height:1.4;
    }
    .meta{
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
        gap:10px 20px;
        margin:10px 0 18px;
        font-size:14px;
    }
    .meta-item strong{
        color:#555;
        display:inline-block;
        min-width:110px;
    }
    .terms{
        background:#f8fafc;
        border-left:4px solid #1e293b;
        border-radius:6px;
        padding:14px 18px;
        font-size:13.5px;
        line-height:1.4;
    }
    .terms ul{
        margin:0;
        padding-left:18px;
    }
    .terms li{
        margin-bottom:6px;
    }
    .footer{
        text-align:center;
        background:#f8f9fa;
        padding:12px;
        font-size:13px;
        color:#666;
    }
</style>
</head>
<body>
<div class="card">
    <div class="header">
        <h1>Warranty Confirmation</h1>
    </div>
    <div class="content">
        <p>Dear {{ $sale->customer_name }},</p>
        <p>Thank you for purchasing a <strong>{{ $sale->product_name }}</strong>. Your warranty is now active.</p>

        <div class="meta">
            <div class="meta-item"><strong>Phone Type:</strong> {{ $sale->product_name }}</div>
            <div class="meta-item"><strong>IMEI/Serial:</strong> {{ $warrantyDetails['imei_number'] ?? 'N/A' }}</div>
            <div class="meta-item"><strong>Phone Specs:</strong> {{ $warrantyDetails['color'] ?? 'N/A' }} - {{ $warrantyDetails['storage'] ?? 'N/A' }}</div>
            <div class="meta-item"><strong>Purchase Date:</strong> {{ $sale->created_at->format('M d, Y') }}</div>
            <div class="meta-item"><strong>Warranty Period:</strong> {{ $sale->warranty_months }} months</div>
            <div class="meta-item"><strong>Warranty Expires:</strong> {{ $sale->warranty_end ? $sale->warranty_end->format('M d, Y') : 'N/A' }}</div>
        </div>      
          <div class="terms">
            <strong>Warranty Terms:</strong>
            <ul>
                <li>Covers manufacturing defects and hardware failures under normal use.</li>
                <li>Excludes damage from water, accidents, or unauthorized repairs.</li>
                <li>Repairs use genuine parts; replacement only if irreparable.</li>
                <li>Keep this email for warranty validation; non-transferable and non-refundable.</li>
            </ul>
        </div>
    </div>
    <div class="footer">
        Need help? Contact our support team.  
        <strong>{{ $userName }}</strong>
    </div>
</div>
</body>
</html>
