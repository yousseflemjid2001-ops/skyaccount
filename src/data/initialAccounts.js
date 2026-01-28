export const initialAccounts = [
    // 1. Assets
    { code: '1000', name: 'Assets', type: 'Asset', parent: null, balance: '0' },
    { code: '1100', name: 'Current Assets', type: 'Asset', parent: '1000', balance: '0' },
    { code: '1110', name: 'Cash and Cash Equivalents', type: 'Asset', parent: '1100', balance: '120000' },
    { code: '1120', name: 'Accounts Receivable', type: 'Asset', parent: '1100', balance: '45000' },
    { code: '1130', name: 'Inventory', type: 'Asset', parent: '1100', balance: '502500' },
    { code: '1200', name: 'Fixed Assets', type: 'Asset', parent: '1000', balance: '0' },
    { code: '1210', name: 'Equipment', type: 'Asset', parent: '1200', balance: '150000' },

    // 2. Liabilities
    { code: '2000', name: 'Liabilities', type: 'Liability', parent: null, balance: '0' },
    { code: '2100', name: 'Current Liabilities', type: 'Liability', parent: '2000', balance: '0' },
    { code: '2110', name: 'Accounts Payable', type: 'Liability', parent: '2100', balance: '35000' },
    { code: '2120', name: 'Sales Tax Payable', type: 'Liability', parent: '2100', balance: '12500' },

    // 3. Equity
    { code: '3000', name: 'Equity', type: 'Equity', parent: null, balance: '0' },
    { code: '3100', name: 'Owner\'s Capital', type: 'Equity', parent: '3000', balance: '1000000' },
    { code: '3200', name: 'Retained Earnings', type: 'Equity', parent: '3000', balance: '0' },

    // 4. Revenue
    { code: '4000', name: 'Revenue', type: 'Revenue', parent: null, balance: '0' },
    { code: '4100', name: 'Sales Revenue', type: 'Revenue', parent: '4000', balance: '0' },
    { code: '4200', name: 'Service Revenue', type: 'Revenue', parent: '4000', balance: '0' },

    // 5. Expenses
    { code: '5000', name: 'Expenses', type: 'Expense', parent: null, balance: '0' },
    { code: '5100', name: 'Cost of Goods Sold', type: 'Expense', parent: '5000', balance: '0' },
    { code: '5200', name: 'Operating Expenses', type: 'Expense', parent: '5000', balance: '0' },
    { code: '5210', name: 'Rent Expense', type: 'Expense', parent: '5200', balance: '0' },
    { code: '5220', name: 'Salaries Expense', type: 'Expense', parent: '5200', balance: '0' },
    { code: '5230', name: 'Utilities Expense', type: 'Expense', parent: '5200', balance: '0' },
];
