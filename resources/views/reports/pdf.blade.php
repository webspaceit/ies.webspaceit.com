<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $title }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'DejaVu Sans', Arial, Helvetica, sans-serif;
            font-size: 9pt;
            color: #1e293b;
            line-height: 1.4;
        }

        @page {
            margin: 10px;
        }

        .page-content {
            padding: 0;
        }

        /* ── HEADER ── */
        .header {
            background-color: #007C47;
            color: #ffffff;
            padding: 16px 20px;
            text-align: center;
            margin-bottom: 0;
        }

        .company-name {
            font-size: 18pt;
            font-weight: bold;
            letter-spacing: 1px;
        }

        .report-title {
            font-size: 11pt;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-top: 3px;
            opacity: 0.9;
        }

        .report-period {
            font-size: 8pt;
            margin-top: 5px;
            opacity: 0.75;
            font-style: italic;
        }

        .header-stripe {
            height: 4px;
            background-color: #005c35;
        }

        /* ── SUMMARY CARDS ── */
        .summary-section {
            padding: 12px 8px 8px;
        }

        .summary-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 8px 0;
        }

        .summary-box {
            padding: 12px 14px;
            text-align: center;
            vertical-align: middle;
        }

        .summary-box.income-box {
            background-color: #007C47;
            color: #ffffff;
        }

        .summary-box.expense-box {
            background-color: #dc2626;
            color: #ffffff;
        }

        .summary-box.balance-box {
            background-color: #2563eb;
            color: #ffffff;
        }

        .summary-label {
            font-size: 7pt;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            margin-bottom: 4px;
            font-weight: 600;
            opacity: 0.85;
        }

        .summary-value {
            font-size: 13pt;
            font-weight: bold;
            margin-bottom: 2px;
        }

        .summary-sub {
            font-size: 6.5pt;
            opacity: 0.65;
        }

        /* ── TABLE SECTION ── */
        .table-section {
            padding: 4px 8px 8px;
        }

        .section-header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 6px;
        }

        .section-title {
            font-size: 10pt;
            font-weight: bold;
            color: #007C47;
            padding: 0 0 4px 0;
            border-bottom: 2px solid #007C47;
            text-align: left;
        }

        .section-count {
            font-size: 8pt;
            color: #64748b;
            padding: 0 0 4px 0;
            border-bottom: 2px solid #007C47;
            text-align: right;
            white-space: nowrap;
        }

        table.data-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #d1d5db;
            margin-top: 4px;
        }

        table.data-table thead th {
            background-color: #007C47;
            color: #ffffff;
            padding: 7px 6px;
            text-align: left;
            font-weight: 700;
            font-size: 7.5pt;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: 1px solid #006b3d;
        }

        table.data-table tbody tr:nth-child(even) {
            background-color: #f8fafc;
        }

        table.data-table tbody tr:nth-child(odd) {
            background-color: #ffffff;
        }

        table.data-table tbody td {
            padding: 6px;
            font-size: 8pt;
            border: 1px solid #e5e7eb;
            vertical-align: middle;
        }

        .sl-no {
            text-align: center;
            color: #64748b;
            font-weight: 600;
        }

        .date {
            white-space: nowrap;
            color: #475569;
        }

        .type-badge {
            display: inline-block;
            padding: 2px 8px;
            font-size: 7pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .type-badge.income {
            background-color: #dcfce7;
            color: #166534;
            border: 1px solid #bbf7d0;
        }

        .type-badge.expense {
            background-color: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
        }

        .amount {
            text-align: right;
            font-weight: 700;
            font-family: 'Courier New', monospace;
            font-size: 8pt;
        }

        .amount.income { color: #16a34a; }
        .amount.expense { color: #dc2626; }

        /* ── FOOTER ── */
        .footer {
            margin-top: 12px;
            padding: 8px 8px 4px;
            border-top: 2px solid #007C47;
            text-align: center;
        }

        .footer-stripe {
            height: 3px;
            background-color: #005c35;
            margin: 0 auto 6px;
            width: 50px;
        }

        .generated-info {
            font-size: 7pt;
            color: #94a3b8;
        }

        .footer-disclaimer {
            font-size: 6.5pt;
            color: #64748b;
            margin-top: 2px;
            font-style: italic;
        }

        .no-data {
            text-align: center;
            padding: 40px;
            color: #94a3b8;
            font-style: italic;
            font-size: 9pt;
        }
    </style>
</head>
<body>
    <div class="page-content">
        <!-- Header -->
        <div class="header">
            @if($showLogo && $logoPath)
            <div style="margin-bottom: 6px;">
                <img src="{{ public_path('storage/' . $logoPath) }}" style="height: 40px; width: auto;" />
            </div>
            @endif
            <div class="company-name">{{ $companyName }}</div>
            @if($headerText)
            <div style="font-size: 9pt; opacity: 0.9; margin-top: 2px;">{{ $headerText }}</div>
            @endif
            <div class="report-title">{{ $title }}</div>
            <div class="report-period">{{ $periodLabel }}</div>
            @if($subHeaderText)
            <div style="font-size: 7pt; opacity: 0.65; margin-top: 3px;">{{ $subHeaderText }}</div>
            @endif
        </div>
        <div class="header-stripe"></div>

        <!-- Summary Cards -->
        <div class="summary-section">
            <table class="summary-table">
                <tr>
                    @if($showIncome)
                    <td class="summary-box income-box" width="33.33%">
                        <div class="summary-label">Total Income</div>
                        <div class="summary-value">+{{ number_format($totalIncome, 2) }} Tk.</div>
                        <div class="summary-sub">{{ $periodLabel }}</div>
                    </td>
                    @endif

                    @if($showExpense)
                    <td class="summary-box expense-box" width="33.33%">
                        <div class="summary-label">Total Expenses</div>
                        <div class="summary-value">-{{ number_format($totalExpense, 2) }} Tk.</div>
                        <div class="summary-sub">{{ $periodLabel }}</div>
                    </td>
                    @endif

                    @if($showBalance)
                    <td class="summary-box balance-box" width="33.33%">
                        <div class="summary-label">Net Balance</div>
                        <div class="summary-value">{{ $netBalance >= 0 ? '+' : '' }}{{ number_format($netBalance, 2) }} Tk.</div>
                        <div class="summary-sub">{{ $periodLabel }}</div>
                    </td>
                    @endif
                </tr>
            </table>
        </div>

        <!-- Transaction Table -->
        <div class="table-section">
            <table class="section-header-table">
                <tr>
                    <td class="section-title">Transaction Details</td>
                    <td class="section-count">{{ count($transactions) }} records</td>
                </tr>
            </table>

            <table class="data-table" style="margin-top:0px;">
                <thead>
                    <tr>
                        <th height="20" style="width: 5%;">Sl.</th>
                        <th height="20" style="width: 11%;">Date</th>
                        <th height="20" style="width: 8%;">Type</th>
                        <th height="20" style="width: 14%;">Heading</th>
                        <th height="20" style="width: 13%;">Category</th>
                        <th height="20" style="width: 22%;">Description</th>
                        <th height="20" style="width: 14%;">Project</th>
                        <th height="20" style="width: 13%; text-align: right;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($transactions as $index => $transaction)
                    <tr>
                        <td class="sl-no">{{ $index + 1 }}</td>
                        <td class="date">{{ $transaction->transaction_date_formatted }}</td>
                        <td>
                            <span class="type-badge {{ $transaction->type }}">
                                {{ ucfirst($transaction->type) }}
                            </span>
                        </td>
                        <td>{{ $transaction->heading_name ?? '-' }}</td>
                        <td>{{ $transaction->category_name ?? '-' }}</td>
                        <td>{{ $transaction->description }}</td>
                        <td>{{ $transaction->project_name ?? '-' }}</td>
                        <td class="amount {{ $transaction->type }}">
                            {{ $transaction->type === 'income' ? '+' : '-' }}{{ number_format($transaction->amount, 2) }}
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="8" class="no-data">No transactions found for the selected period.</td>
                    </tr>
                    @endforelse
                </tbody>
          </table>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-stripe"></div>
            <div class="generated-info">
                Generated on: {{ $generatedAt }}
            </div>
            <div class="footer-disclaimer">
                {{ $footerText }}
            </div>
        </div>
    </div>
</body>
</html>
