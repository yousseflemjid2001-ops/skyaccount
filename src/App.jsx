import React, { useState, useEffect, useMemo, isValidElement } from 'react';
import {
    LayoutDashboard,
    FileText,
    Users,
    Package,
    TrendingUp,
    TrendingDown,
    Settings,
    Briefcase,
    Building,
    Layers,


    LogOut,
    Lock,
    Plus,
    Search,
    Bell,
    ChevronRight,
    Languages,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    X,
    MoreVertical,
    Download,
    Mail,
    Clock,
    Printer,
    ChevronLeft,
    Wallet,

    ShoppingCart,
    CreditCard,
    History,
    Phone,
    MapPin,
    Eye,
    Trash2,
    BarChart2,
    AlertTriangle,
    ShoppingBag,
    BookOpen,
    Pencil,
    Shield,
    Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts';
import translations from './translations.js';
import { generateInvoicePDF, generateReportPDF } from './utils/pdfUtils.js';
import { initialAccounts } from './data/initialAccounts.js';
import { formatCurrency } from './utils/formatCurrency.js';
import SalesInvoiceView from './components/SalesInvoiceView';
import PurchaseInvoiceView from './components/PurchaseInvoiceView';
import FormInput from './components/FormInput';
import useLocalStorage from './hooks/useLocalStorage'; // Deprecated for Supabase
import { api } from './services/api';

// --- Reusable Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick, isRtl, index }) => (
    <motion.div
        initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${active ? 'sidebar-active' : ''}`}
        style={{
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '12px',
            color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
        }}
    >
        <Icon size={20} color={active ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
        <span className="font-medium" style={{ fontSize: '14px', fontWeight: active ? '700' : '500' }}>{label}</span>
    </motion.div>
);

const Modal = ({ isOpen, onClose, title, children, isRtl }) => (
    <AnimatePresence>
        {isOpen && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
                    onClick={onClose}
                />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 40 }}
                    className="glass"
                    style={{ position: 'relative', width: '100%', maxWidth: '600px', padding: '32px', zIndex: 1, direction: isRtl ? 'rtl' : 'ltr' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '700' }}>{title}</h3>
                        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>
                    </div>
                    {children}
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);



// --- Sections ---

const Sidebar = ({ activeTab, setActiveTab, t, isRtl, onLogout }) => {
    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: t.dashboard },
        { id: 'sales', icon: ShoppingCart, label: t.sales },
        { id: 'purchases', icon: ShoppingBag, label: t.purchases },
        { id: 'inventory', icon: Package, label: t.inventory },
        { id: 'customers', icon: Users, label: t.customersSuppliers },
        { id: 'treasury', icon: Wallet, label: t.treasury },
        { id: 'chart', icon: BookOpen, label: t.chartOfAccounts },
        { id: 'reports', icon: FileText, label: t.reports },
        { id: 'settings', icon: Settings, label: t.settings },
    ];

    return (
        <div className="glass" style={{
            width: '280px',
            height: 'calc(100vh - 32px)',
            margin: '16px',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            zIndex: 10,
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            direction: isRtl ? 'rtl' : 'ltr'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', padding: '0 12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}>
                    <Layers size={24} color="white" />
                </div>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>{t.appName}</h1>
                    <p style={{ fontSize: '11px', color: '#94a3b8' }}>v2.4.0 (Enterprise)</p>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                {menuItems.map((item, index) => (
                    <SidebarItem
                        key={item.id}
                        index={index}
                        icon={item.icon}
                        label={item.label}
                        active={activeTab === item.id}
                        onClick={() => {
                            setActiveTab(item.id);
                        }}
                        isRtl={isRtl}
                    />
                ))}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <SidebarItem
                    icon={LogOut}
                    label={t.logout}
                    active={false}
                    onClick={onLogout}
                    isRtl={isRtl}
                    index={10}
                />
            </div>
        </div>
    );
};

// --- View Implementation ---

const TableView = ({ title, subtitle, buttonLabel, onAdd, headers = [], data = [], t, isRtl, onExport, searchPlaceholder, onView, onDelete, onEdit, onPrint, dateRange, setDateRange }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const safeData = Array.isArray(data) ? data : [];
    const safeHeaders = Array.isArray(headers) ? headers : [];

    const filteredData = safeData.filter(row => {
        if (!row) return false;
        return Object.values(row).some(val =>
            String(val || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'white' }}>{title}</h2>
                    <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>{subtitle}</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={onAdd}
                    style={{ background: '#1d4ed8', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 20px rgba(29, 78, 216, 0.3)' }}
                >
                    <Plus size={20} /> {buttonLabel}
                </motion.button>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div className="glass" style={{ flex: 1, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)' }}>
                    <Search size={18} color="#94a3b8" />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={searchPlaceholder || t?.searchBy || "Search..."}
                        style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontSize: '14px' }}
                    />
                </div>

                {dateRange && setDateRange && (
                    <div className="glass" style={{ display: 'flex', gap: '15px', padding: '10px 20px', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
                            <Calendar size={16} />
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>{t.fromDate}:</span>
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
                                    style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '12px', outline: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>{t.toDate}:</span>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
                                    style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '12px', outline: 'none' }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="glass" style={{ overflow: 'hidden', padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.02)', color: '#94a3b8', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <tr>
                            {safeHeaders.map((h, i) => <th key={i} style={{ padding: '16px 24px', fontWeight: '600' }}>{h}</th>)}
                            <th style={{ padding: '16px 24px', textAlign: 'center' }}>{t?.actions || "Actions"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((row, i) => (
                            <tr key={i} className="glass-hover" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                {Object.keys(row).filter(k => k !== 'items' && k !== 'activities' && k !== 'transactions' && k !== '_original').map((key, j) => {
                                    const val = row[key];
                                    if (key === 'status') {
                                        const isPaid = val === 'Paid' || val === 'مدفوع' || val === 'Payé' || val === 'Pending';
                                        return (
                                            <td key={j} style={{ padding: '16px 24px' }}>
                                                <span style={{
                                                    padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700',
                                                    background: isPaid ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: isPaid ? '#22c55e' : '#ef4444'
                                                }}>
                                                    {val}
                                                </span>
                                            </td>
                                        );
                                    }
                                    if (typeof val === 'object' && val !== null && !isValidElement(val)) {
                                        return null;
                                    }
                                    if (isValidElement(val)) {
                                        return <td key={j} style={{ padding: '16px 24px' }}>{val}</td>;
                                    }
                                    return (
                                        <td key={j} style={{ padding: '16px 24px', color: key === 'amount' || key === 'balance' ? (isRtl ? '#22c55e' : '#38bdf8') : 'white', fontWeight: j === 0 || key === 'amount' ? '700' : '400' }}>
                                            {val}
                                        </td>
                                    );
                                })}
                                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                        {onPrint && (
                                            <button onClick={() => onPrint(row._original || row)} style={{ color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer' }} title={t?.print || "Print"}><Printer size={18} /></button>
                                        )}
                                        {onEdit && (
                                            <button onClick={() => onEdit(row._original || row)} style={{ color: '#38bdf8', background: 'transparent', border: 'none', cursor: 'pointer' }} title={t?.edit || "Edit"}><Pencil size={18} /></button>
                                        )}
                                        {onView && (
                                            <button onClick={() => onView(row._original || row)} style={{ color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer' }} title={t?.view || "View"}><Eye size={18} /></button>
                                        )}
                                        {onDelete && (
                                            <button onClick={() => onDelete(row._original || row)} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }} title={t?.delete || "Delete"}>
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '13px', color: '#94a3b8' }}>
                    <div>
                        {t.showing} 1 {t.of} {data.length} {t.records}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="glass" style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px' }}>{t.previous}</button>
                        <button className="glass" style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px' }}>{t.next}</button>
                    </div>
                </div>
            </div>
        </div >
    );
};

const InventoryView = ({ t, isRtl, inventory, onAdd, fCurrency, onEdit, onDelete }) => {
    const lowStockCount = inventory.filter(i => (i.stock || 0) <= 5).length;
    const stockValue = inventory.reduce((acc, i) => acc + (parseInt((typeof i.buyPrice === 'string' ? i.buyPrice : i.buyPrice || '0').toString().replace(/\D/g, '')) * (i.stock || 0)), 0);
    const totalProducts = inventory.length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Stats Cards */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <div className="glass" style={{ flex: 1, padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), transparent)' }}>
                    <div>
                        <p style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>{t.lowStockProducts}</p>
                        <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{lowStockCount}</h3>
                    </div>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <AlertTriangle size={24} color="#ef4444" />
                    </div>
                </div>

                <div className="glass" style={{ flex: 1, padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), transparent)' }}>
                    <div>
                        <p style={{ color: '#22c55e', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>{t.stockValue}</p>
                        <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{fCurrency(stockValue)}</h3>
                    </div>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BarChart2 size={24} color="#22c55e" />
                    </div>
                </div>

                <div className="glass" style={{ flex: 1, padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), transparent)' }}>
                    <div>
                        <p style={{ color: '#38bdf8', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>{t.totalProducts}</p>
                        <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{totalProducts}</h3>
                    </div>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Package size={24} color="#38bdf8" />
                    </div>
                </div>
            </div>

            <TableView
                title={t.inventory}
                subtitle={t.inventorySubtitle}
                buttonLabel={t.addProduct}
                onAdd={onAdd}
                headers={[t.code, t.productName, t.category, t.buyingPrice, t.sellingPrice, t.quantity]}
                data={inventory.map(item => ({
                    code: <span style={{ fontFamily: 'monospace', color: '#94a3b8' }}>{item.code || 'PRD-000'}</span>,
                    name: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {item.name}
                            {(item.stock || 0) <= 5 && <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', fontWeight: '700' }}>{t.lowStock}</span>}
                        </div>
                    ),
                    category: item.category,
                    buy: item.buyPrice,
                    sell: item.sellPrice,
                    stock: <span style={{ padding: '4px 12px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '6px', fontWeight: '700', fontSize: '13px' }}>{item.stock}</span>,
                    _original: item
                }))}
                t={t}
                isRtl={isRtl}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        </div>
    );
};






const TreasuryView = ({ t, isRtl, transactions, onAdd, accounts, onDelete, onEdit, fCurrency }) => {
    const [filterAccount, setFilterAccount] = useState('all');

    const filteredTransactions = transactions.filter(tr =>
        filterAccount === 'all' || tr.accountId === filterAccount
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ color: '#94a3b8', fontSize: '14px' }}>Filter by Account:</span>
                    <select
                        value={filterAccount}
                        onChange={(e) => setFilterAccount(e.target.value)}
                        className="glass"
                        style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', color: 'white', background: 'rgba(255,255,255,0.05)', outline: 'none' }}
                    >
                        <option value="all" style={{ background: '#1e293b' }}>{t.all}</option>
                        {accounts && accounts.map(acc => (
                            <option key={acc.code} value={acc.code} style={{ background: '#1e293b' }}>{acc.code} - {acc.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                {[
                    { label: t.cashIn, value: fCurrency(1250000), color: '#22c55e' },
                    { label: t.cashOut, value: fCurrency(450000), color: '#ef4444' },
                    { label: t.balance, value: fCurrency(800000), color: '#38bdf8' }
                ].map((stat, i) => (
                    <div key={i} className="glass" style={{ flex: 1, padding: '24px', background: `linear-gradient(135deg, ${stat.color}10, transparent)` }}>
                        <p style={{ color: stat.color, fontSize: '14px', fontWeight: '600' }}>{stat.label}</p>
                        <h3 style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px' }}>{stat.value}</h3>
                    </div>
                ))}
            </div>
            <TableView
                title={t.treasury}
                subtitle="Gestion des flux de trésorerie et des comptes bancaires"
                buttonLabel={t.newTransaction}
                onAdd={onAdd}
                headers={[t.date, t.description, t.type, t.method, t.amount]}
                data={filteredTransactions.map(tr => ({
                    date: tr.date,
                    desc: tr.desc,
                    status: tr.type === 'Cash In' || tr.type === 'قبض' ? 'Payé' : 'Sortie',
                    method: tr.method,
                    amount: fCurrency(tr.anim)
                }))}
                t={t}
                isRtl={isRtl}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onEdit}
            />
        </div>
    );
};

const ChartOfAccountsView = ({ t, isRtl, onAdd, accounts, onDelete, fCurrency }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    // Stats for cards
    const stats = useMemo(() => {
        const calculateTotal = (type) => accounts
            .filter(a => a.type === type && !a.parent)
            .reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0);

        return [
            { id: 'assets', label: t.assets || 'Assets', value: calculateTotal('Asset'), color: '#38bdf8', bgColor: 'rgba(56, 189, 248, 0.1)', icon: Briefcase },
            { id: 'liabilities', label: t.liabilities || 'Liabilities', value: calculateTotal('Liability'), color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)', icon: Building }, // Assuming Building icon for now or similar
            { id: 'equity', label: t.equity || 'Equity', value: calculateTotal('Equity'), color: '#c084fc', bgColor: 'rgba(192, 132, 252, 0.1)', icon: Layers }, // Assuming Layers
            { id: 'revenue', label: t.revenue || 'Revenue', value: calculateTotal('Revenue'), color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.1)', icon: TrendingUp },
            { id: 'expenses', label: t.expenses || 'Expenses', value: calculateTotal('Expense'), color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)', icon: TrendingDown }, // Assuming TrendingDown
        ];
    }, [accounts, t]);

    const filteredAccounts = accounts.filter(acc => {
        const matchesSearch = (acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || acc.code.includes(searchTerm));
        const matchesFilter = activeFilter === 'All' || acc.type === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const getNature = (type) => {
        return (type === 'Asset' || type === 'Expense') ? (t.debit || 'Debit') : (t.credit || 'Credit');
    };

    const getNatureColor = (type) => {
        return (type === 'Asset' || type === 'Expense') ? '#38bdf8' : '#ef4444';
    };

    const getTypeBadRequest = (type) => {
        if (type === 'Asset') return { bg: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' };
        if (type === 'Liability') return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' };
        if (type === 'Equity') return { bg: 'rgba(192, 132, 252, 0.1)', color: '#c084fc' };
        if (type === 'Revenue') return { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' };
        if (type === 'Expense') return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
        return { bg: 'rgba(148, 163, 184, 0.1)', color: '#94a3b8' };
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'white' }}>{t.chartOfAccounts}</h2>
                    <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>{t.manageChartOfAccounts || 'Manage your financial structure'}</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={onAdd}
                    style={{ background: '#1d4ed8', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 20px rgba(29, 78, 216, 0.3)' }}
                >
                    <Plus size={20} /> {t.addAccount}
                </motion.button>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass"
                        style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: stat.bgColor, border: `1px solid ${stat.color}30` }}
                    >
                        <div>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: stat.color, marginBottom: '8px' }}>{stat.label}</p>
                            <h3 style={{ fontSize: '20px', fontWeight: '800', color: stat.color }}>{fCurrency(stat.value)}</h3>
                        </div>
                        <stat.icon size={24} color={stat.color} style={{ opacity: 0.8 }} />
                    </motion.div>
                ))}
            </div>

            {/* Filters & Table */}
            <div className="glass" style={{ padding: '0', overflow: 'hidden' }}>
                {/* Toolbar */}
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '20px', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {['All', 'Asset', 'Liability', 'Equity', 'Revenue', 'Expense'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: activeFilter === filter ? 'white' : 'transparent',
                                    color: activeFilter === filter ? '#0f172a' : '#94a3b8',
                                    fontWeight: activeFilter === filter ? '700' : '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {t[filter.toLowerCase()] || filter}
                            </button>
                        ))}
                    </div>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={18} color="#94a3b8" style={{ position: 'absolute', top: '50%', [isRtl ? 'right' : 'left']: '12px', transform: 'translateY(-50%)' }} />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t.searchPlaceholder || "Search..."}
                            style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: isRtl ? '10px 40px 10px 12px' : '10px 12px 10px 40px',
                                borderRadius: '10px',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                {/* Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.02)', color: '#94a3b8', fontSize: '13px' }}>
                        <tr>
                            <th style={{ padding: '16px 24px', fontWeight: '600' }}>{t.accountName}</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600' }}>{t.code || 'Code'}</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600' }}>{t.accountType}</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600' }}>{t.nature || 'Nature'}</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600' }}>{t.balance}</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600' }}>{t.status}</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600', textAlign: 'center' }}>{t.actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAccounts.map((acc, i) => {
                            const typeStyle = getTypeBadRequest(acc.type);
                            return (
                                <tr key={i} className="glass-hover" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingRight: isRtl && acc.parent ? '20px' : '0', paddingLeft: !isRtl && acc.parent ? '20px' : '0' }}>
                                            {!acc.parent && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: typeStyle.color }}></div>}
                                            <span style={{ fontWeight: !acc.parent ? '700' : '400', color: 'white' }}>{acc.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', fontFamily: 'monospace', color: '#94a3b8' }}>{acc.code}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', background: typeStyle.bg, color: typeStyle.color }}>
                                            {t[acc.type.toLowerCase()] || acc.type}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px', color: getNatureColor(acc.type), fontWeight: '600' }}>
                                        {getNature(acc.type)}
                                    </td>
                                    <td style={{ padding: '16px 24px', color: 'white', fontWeight: '700' }}>
                                        {fCurrency(acc.balance)}
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                                            {t.activeAccount || 'Active'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                        <button onClick={() => onDelete(acc)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', opacity: 0.8 }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const CustomersSuppliersView = ({ t, isRtl, contacts, onAdd, onEdit, onDelete, onViewStatement }) => {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredContacts = contacts.filter(c => {
        const name = c?.name?.toLowerCase() || '';
        const phone = c?.phone || '';
        const matchesFilter = filter === 'all' || c.type === filter;
        const matchesSearch = name.includes(searchTerm.toLowerCase()) ||
            phone.includes(searchTerm);
        return matchesFilter && matchesSearch;
    });

    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header & Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>{t.customersSuppliers}</h2>
                    <p style={{ color: '#94a3b8', fontSize: '14px' }}>{t.customersSuppliers}</p>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px' }}>
                        {[{ id: 'all', label: t.all }, { id: 'client', label: t.clients }, { id: 'supplier', label: t.suppliers }].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setFilter(tab.id)}
                                style={{
                                    padding: '8px 24px', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                                    background: filter === tab.id ? '#38bdf8' : 'transparent',
                                    color: filter === tab.id ? 'white' : '#94a3b8',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={onAdd}
                        style={{ background: '#1d4ed8', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 20px rgba(29, 78, 216, 0.3)' }}
                    >
                        <Plus size={20} /> {t.addAccount}
                    </motion.button>
                </div>
            </div>

            {/* Search */}
            <div className="glass" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Search size={20} color="#94a3b8" />
                <input
                    placeholder={t.searchBy}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '16px', width: '100%', outline: 'none' }}
                />
            </div>

            {/* Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {filteredContacts.map((contact, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass" // Keep plain glass as base
                        style={{ padding: '24px', borderRadius: '16px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
                    >
                        {/* Actions */}
                        <div style={{ position: 'absolute', top: '16px', left: isRtl ? '16px' : 'auto', right: isRtl ? 'auto' : '16px', display: 'flex', gap: '8px' }}>
                            <button onClick={() => onEdit(contact)} style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><FileText size={16} /></button>
                            <button onClick={() => onDelete(contact)} style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                        </div>

                        {/* Avatar */}
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: contact.type === 'client' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(167, 139, 250, 0.1)',
                            color: contact.type === 'client' ? '#38bdf8' : '#a78bfa',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '800'
                        }}>
                            {getInitials(contact.name)}
                        </div>

                        {/* Info */}
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{contact.name}</h3>
                            <span style={{
                                padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                                background: contact.type === 'client' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(167, 139, 250, 0.1)',
                                color: contact.type === 'client' ? '#38bdf8' : '#a78bfa'
                            }}>
                                {contact.type === 'client' ? t.client : t.supplier}
                            </span>
                        </div>

                        {/* Details */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '14px' }}>
                                <Phone size={14} /> {contact.phone || '0501234567'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '14px' }}>
                                <MapPin size={14} /> {contact.location || (isRtl ? 'الرياض' : 'Riyadh')}
                            </div>
                        </div>

                        {/* Balance */}
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', marginTop: '8px' }}>
                            <span style={{ fontSize: '13px', color: '#94a3b8' }}>{t.currentBalance}</span>
                            <span style={{ fontWeight: '800', fontSize: '16px', color: String(contact.balance || 0).includes('-') || (typeof contact.balance === 'number' && contact.balance < 0) ? '#ef4444' : '#22c55e' }}>{contact.balance}</span>
                        </div>

                        {/* Account Statement Button */}
                        <button onClick={() => onViewStatement(contact)} className="glass-hover" style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <FileText size={16} /> {t.accountStatementBtn}
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// --- Login View ---

const LoginView = ({ t, isRtl, onLogin, lang }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (email === 'admin@gmail.com' && password === '123456789') {
            onLogin();
        } else {
            setError(t.invalidCredentials);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: '#020617',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', direction: isRtl ? 'rtl' : 'ltr'
        }}>
            {/* Background Blobs */}
            <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', zIndex: 0 }}>
                <motion.div animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }} transition={{ duration: 15, repeat: Infinity }} style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)', filter: 'blur(50px)' }} />
                <motion.div animate={{ scale: [1, 1.3, 1], x: [0, -30, 0] }} transition={{ duration: 18, repeat: Infinity }} style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(129, 140, 248, 0.08) 0%, transparent 70%)', filter: 'blur(70px)' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                style={{
                    width: '100%', maxWidth: '1000px', height: '640px',
                    display: 'flex', position: 'relative', zIndex: 1,
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '40px', overflow: 'hidden',
                    boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.7)'
                }}
            >
                {/* Left Side: Branding/Design */}
                <div style={{
                    flex: 1, padding: '60px',
                    background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    borderRight: isRtl ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                    borderLeft: isRtl ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                    position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '18px',
                            background: 'linear-gradient(135deg, #38bdf8, #1d4ed8)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '32px', boxShadow: '0 10px 30px rgba(56, 189, 248, 0.4)'
                        }}>
                            <Layers size={32} color="white" />
                        </div>
                        <h1 style={{
                            fontSize: '40px', fontWeight: '900', marginBottom: '24px', color: 'white',
                            letterSpacing: '-1.5px', lineHeight: 1.1
                        }}>
                            {t.appName} <span style={{ color: '#38bdf8' }}>Enterprise</span>
                        </h1>
                        <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '40px', maxWidth: '340px' }}>
                            {lang === 'fr' ? "La solution complète pour votre gestion comptable et commerciale." :
                                lang === 'ar' ? "الحل المتكامل لإدارة حساباتك وتجارتك." :
                                    "The complete solution for your accounting and business management."}
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {[
                                { icon: TrendingUp, text: lang === 'fr' ? "Suivi des revenus en temps réel" : lang === 'ar' ? "متابعة الإيرادات لحظياً" : "Real-time revenue tracking" },
                                { icon: Users, text: lang === 'fr' ? "Gestion clients & fournisseurs" : lang === 'ar' ? "إدارة العملاء والموردين" : "Client & supplier management" },
                                { icon: Shield, text: lang === 'fr' ? "Sécurité de données bancaire" : lang === 'ar' ? "أمان بيانات بنكي" : "Bank-level data security" }
                            ].map((feature, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ color: '#38bdf8' }}><feature.icon size={20} /></div>
                                    <span style={{ fontSize: '15px', color: '#cbd5e1', fontWeight: '500' }}>{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div style={{ flex: 1, padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>{t.loginTitle}</h2>
                        <p style={{ color: '#64748b', fontSize: '15px' }}>{t.loginSubtitle}</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                padding: '12px 16px',
                                borderRadius: '12px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                color: '#ef4444',
                                fontSize: '14px',
                                marginBottom: '24px',
                                fontWeight: '600',
                                textAlign: 'center'
                            }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', color: '#cbd5e1', fontWeight: '600' }}>{t.email}</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '50%', [isRtl ? 'right' : 'left']: '20px', transform: 'translateY(-50%)', color: '#64748b' }}>
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@skyaccount.com"
                                    style={{
                                        width: '100%', padding: '16px 20px', paddingLeft: isRtl ? '20px' : '56px', paddingRight: isRtl ? '56px' : '20px',
                                        borderRadius: '16px', background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', outline: 'none',
                                        fontSize: '15px', transition: 'all 0.3s ease'
                                    }}
                                    className="login-input"
                                />
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <label style={{ fontSize: '14px', color: '#cbd5e1', fontWeight: '600' }}>{t.password}</label>
                                <a href="#" style={{ fontSize: '13px', color: '#38bdf8', textDecoration: 'none', fontWeight: '600' }}>{t.forgotPassword}</a>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '50%', [isRtl ? 'right' : 'left']: '20px', transform: 'translateY(-50%)', color: '#64748b' }}>
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    style={{
                                        width: '100%', padding: '16px 20px', paddingLeft: isRtl ? '20px' : '56px', paddingRight: isRtl ? '56px' : '20px',
                                        borderRadius: '16px', background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', outline: 'none',
                                        fontSize: '15px', transition: 'all 0.3s ease'
                                    }}
                                    className="login-input"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input type="checkbox" id="remember" style={{ accentColor: '#38bdf8' }} />
                            <label htmlFor="remember" style={{ fontSize: '14px', color: '#94a3b8', cursor: 'pointer' }}>{lang === 'ar' ? "تذكرني" : "Se souvenir de moi"}</label>
                        </div>

                            </div>
                        </div>

                        <div style={{
                            marginTop: '8px',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            background: 'rgba(56, 189, 248, 0.05)',
                            border: '1px solid rgba(56, 189, 248, 0.1)',
                            fontSize: '13px',
                            color: '#94a3b8',
                            lineHeight: 1.5
                        }}>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ color: '#38bdf8', fontWeight: '600' }}>Email:</span>
                                <span style={{ color: 'white' }}>admin@gmail.com</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <span style={{ color: '#38bdf8', fontWeight: '600' }}>{t.password}:</span>
                                <span style={{ color: 'white' }}>123456789</span>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            style={{
                                background: 'linear-gradient(135deg, #38bdf8, #1d4ed8)',
                                color: 'white', padding: '18px', borderRadius: '16px',
                                border: 'none', fontWeight: '800', fontSize: '16px', cursor: 'pointer',
                                marginTop: '10px'
                            }}
                        >
                            {t.loginButton}
                        </motion.button>
                    </form >

    <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '14px', color: '#64748b' }}>
        {lang === 'fr' ? "Besoin d'aide ?" : lang === 'ar' ? "تحتاج مساعدة؟" : "Need help?"} <a href="#" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '700' }}>{lang === 'ar' ? "تواصل معي" : "Contactez le support"}</a>
    </p>
                </div >
            </motion.div >

    <style>{`.login-input:focus { border-color: #38bdf8 !important; background: rgba(56, 189, 248, 0.05) !important; }`}</style>
        </div >
    );
};

// --- App ---

const AuthenticatedApp = ({ lang, setLang, onLogout }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [salesView, setSalesView] = useState('list');
    const [purchasesView, setPurchasesView] = useState('list');
    const [customersView, setCustomersView] = useState('list'); // 'list' or 'statement'
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);

    const [modalType, setModalType] = useState(null);

    const t = translations[lang];
    const isRtl = lang === 'ar';

    const [sales, setSales] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [treasury, setTreasury] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [companySettings, setCompanySettings] = useLocalStorage('companySettings', {
        name: 'Ilyas Accountant',
        email: 'admin@ilyas.com',
        phone: '0501234567',
        address: '123 Business Street, Tech City',
        taxNumber: '300012345600003',
        currency: 'DA'
    });

    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    // Load Data from Supabase
    useEffect(() => {
        const loadData = async () => {
            try {
                const [p, c, a, t, i] = await Promise.all([
                    api.products.list(),
                    api.contacts.list(),
                    api.accounts.list(),
                    api.transactions.list(),
                    api.invoices.list()
                ]);

                // Map Products
                if (p) setInventory(p.map(x => ({ ...x, buyPrice: x.buy_price, sellPrice: x.sell_price, minLimit: x.min_stock })));

                // Map Contacts
                if (c) setCustomers(c.map(x => ({ ...x, location: x.location || '' })));

                // Map Accounts
                setAccounts(a && a.length > 0 ? a : []);

                // Map Treasury
                if (t) setTreasury(t.map(x => ({ ...x, anim: x.amount, desc: x.description })));

                // Split invoices
                if (i && c) {
                    const mappedInvoices = i.map(inv => {
                        const contact = c.find(con => con.id === inv.contact_id);
                        return {
                            ...inv,
                            client: contact?.name,
                            supplier: contact?.name,
                            amount: formatCurrency(inv.total_amount, companySettings?.currency || 'DA') // Keep amount as string for UI display compatibility if needed, but safer to keep original value too?
                            // Logic: UI uses amount for display.
                        };
                    });
                    setSales(mappedInvoices.filter(inv => inv.type === 'sale'));
                    setPurchases(mappedInvoices.filter(inv => inv.type === 'purchase'));
                }
            } catch (error) {
                console.error("Failed to load data:", error);
            }
        };
        loadData();
    }, [companySettings]);

    const fCurrency = (val) => formatCurrency(val, companySettings?.currency || 'DA');

    // Filter Logic
    const filterByDate = (items, dateKey = 'date') => {
        if (!dateRange.start || !dateRange.end) return items;
        return items.filter(item => {
            const d = item[dateKey];
            return d >= dateRange.start && d <= dateRange.end;
        });
    };

    const filteredSales = filterByDate(sales);
    const filteredPurchases = filterByDate(purchases);
    const filteredTreasury = filterByDate(treasury);

    const [invForm, setInvForm] = useState({ client: '', amount: '', date: new Date().toISOString().split('T')[0] });
    const [transForm, setTransForm] = useState({ id: null, desc: '', amount: '', type: 'In', method: 'Cash', accountId: '' });
    const [productForm, setProductForm] = useState({ name: '', code: `PRD-${Math.floor(Math.random() * 1000)}`, barcode: '', category: '', unit: 'Piece', buy: '', sell: '', stock: '', minLimit: 5 });
    const [contactForm, setContactForm] = useState({ name: '', type: 'client', email: '', balance: '', phone: '', address: '', taxNumber: '' });
    const [accountForm, setAccountForm] = useState({ code: '', name: '', type: 'Asset', parent: '', balance: '0' });

    useEffect(() => { document.body.dir = isRtl ? 'rtl' : 'ltr'; }, [isRtl]);

    const handleAddSale = async () => {
        try {
            const contact = customers.find(c => c.name === invForm.client);
            const newInvoice = {
                number: `INV-${Date.now()}`,
                type: 'sale',
                date: invForm.date,
                contact_id: contact?.id,
                total_amount: parseFloat(invForm.amount),
                status: 'Pending'
            };
            const saved = await api.invoices.create(newInvoice);
            const mappedSaved = {
                ...saved,
                client: contact?.name,
                supplier: contact?.name,
                amount: fCurrency(saved.total_amount)
            };
            setSales([mappedSaved, ...sales]);
            setModalType(null);
        } catch (e) { console.error(e); alert("Failed to save sale"); }
    };

    const handleAddPurchase = async () => {
        try {
            const contact = customers.find(c => c.name === invForm.client);
            const newInvoice = {
                number: `PUR-${Date.now()}`,
                type: 'purchase',
                date: invForm.date,
                contact_id: contact?.id,
                total_amount: parseFloat(invForm.amount),
                status: 'Paid'
            };
            const saved = await api.invoices.create(newInvoice);
            const mappedSaved = {
                ...saved,
                client: contact?.name,
                supplier: contact?.name,
                amount: fCurrency(saved.total_amount)
            };
            setPurchases([mappedSaved, ...purchases]);
            setModalType(null);
        } catch (e) { console.error(e); alert("Failed to save purchase"); }
    };

    const handleAddTrans = async () => {
        const transaction = {
            date: invForm.date || new Date().toISOString().split('T')[0],
            description: transForm.desc,
            type: transForm.type === 'In' || transForm.type === t.cashIn ? 'Cash In' : 'Cash Out',
            method: transForm.method,
            amount: parseFloat(transForm.amount),
            account_id: transForm.accountId || null
        };

        try {
            let saved;
            if (transForm.id) {
                saved = await api.transactions.update(transForm.id, transaction);
                const mapped = { ...saved, anim: fCurrency(saved.amount), desc: saved.description };
                setTreasury(treasury.map(tr => tr.id === saved.id ? mapped : tr));
            } else {
                saved = await api.transactions.create(transaction);
                const mapped = { ...saved, anim: fCurrency(saved.amount), desc: saved.description };
                setTreasury([mapped, ...treasury]);
            }
            setModalType(null);
        } catch (e) { console.error(e); alert("Failed to save transaction"); }
    };

    const handleEditProduct = (product) => {
        setProductForm({
            id: product.id,
            name: product.name,
            code: product.code,
            barcode: product.barcode || '',
            category: product.category,
            unit: product.unit || 'Piece',
            buy: typeof product.buyPrice === 'string' ? product.buyPrice.replace(/[^0-9.-]+/g, '') : product.buyPrice,
            sell: typeof product.sellPrice === 'string' ? product.sellPrice.replace(/[^0-9.-]+/g, '') : product.sellPrice,
            stock: product.stock,
            minLimit: product.minLimit || 5
        });
        setModalType('addProduct');
    };

    const handleAddProduct = async () => {
        const productData = {
            name: productForm.name,
            code: productForm.code,
            category: productForm.category,
            stock: parseInt(productForm.stock || 0),
            buy_price: parseFloat(productForm.buy),
            sell_price: parseFloat(productForm.sell),
            min_stock: parseInt(productForm.minLimit || 5),
            // Extras not in schema but maybe useful? schema has basic cols.
        };

        try {
            let saved;
            if (productForm.id) {
                saved = await api.products.update(productForm.id, productData);
                const mapped = { ...saved, buyPrice: saved.buy_price, sellPrice: saved.sell_price, minLimit: saved.min_stock };
                setInventory(inventory.map(p => p.id === mapped.id ? mapped : p));
            } else {
                saved = await api.products.create(productData);
                const mapped = { ...saved, buyPrice: saved.buy_price, sellPrice: saved.sell_price, minLimit: saved.min_stock };
                setInventory([mapped, ...inventory]);
            }
            setModalType(null);
            setProductForm({ name: '', code: `PRD-${Math.floor(Math.random() * 1000)}`, barcode: '', category: '', unit: 'Piece', buy: '', sell: '', stock: '', minLimit: 5 });
        } catch (e) { console.error(e); alert("Failed to save product"); }
    };

    // Additional Handlers for Deletion
    const handleDeleteSale = async (invoice) => {
        if (!window.confirm("Delete this invoice?")) return;
        try {
            await api.invoices.delete(invoice.id);
            setSales(sales.filter(s => s.id !== invoice.id));
        } catch (e) { console.error(e); }
    };

    const handleDeletePurchase = async (invoice) => {
        if (!window.confirm("Delete this purchase?")) return;
        try {
            await api.invoices.delete(invoice.id);
            setPurchases(purchases.filter(p => p.id !== invoice.id));
        } catch (e) { console.error(e); }
    };

    const handleDeleteTransaction = async (tr) => {
        if (!window.confirm("Delete this transaction?")) return;
        try {
            await api.transactions.delete(tr.id);
            setTreasury(treasury.filter(item => item.id !== tr.id));
        } catch (e) { console.error(e); alert("Failed to delete transaction"); }
    };

    const handleDeleteProduct = async (product) => {
        if (!window.confirm("Delete this product?")) return;
        try {
            await api.products.delete(product.id);
            setInventory(inventory.filter(p => p.id !== product.id));
        } catch (e) { console.error(e); }
    };

    const handleDeleteContact = async (contact) => {
        if (!window.confirm("Delete this contact?")) return;
        try {
            await api.contacts.delete(contact.id);
            setCustomers(customers.filter(c => c.id !== contact.id));
        } catch (e) { console.error(e); }
    };

    const handleDeleteAccount = async (account) => {
        if (!window.confirm("Delete this account?")) return;
        try {
            await api.accounts.delete(account.id);
            setAccounts(accounts.filter(a => a.id !== account.id));
        } catch (e) { console.error(e); }
    };

    const handleAddContact = async () => {
        const contactData = {
            name: contactForm.name,
            type: contactForm.type,
            // email: contactForm.email, // Not in schema but useful
            phone: contactForm.phone,
            location: contactForm.address,
            balance: parseFloat(typeof contactForm.balance === 'string' ? contactForm.balance.replace(/[^0-9.-]+/g, '') : contactForm.balance || 0),
            // taxNumber: contactForm.taxNumber // Not in schema
        };
        try {
            const saved = await api.contacts.create(contactData);
            setCustomers([saved, ...customers]);
            setModalType(null);
        } catch (e) { console.error(e); alert("Failed to save contact"); }
    };

    const handleAddAccount = async () => {
        const accountData = {
            code: accountForm.code,
            name: accountForm.name,
            type: accountForm.type,
            parent_id: accountForm.parent || null,
            balance: parseFloat(accountForm.balance || 0),
            is_system: false
        };
        try {
            const saved = await api.accounts.create(accountData);
            setAccounts([...accounts, saved]);
            setModalType(null);
        } catch (e) { console.error(e); alert("Failed to save account"); }
    };

    return (
        <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', direction: isRtl ? 'rtl' : 'ltr' }}>
            <div className="blob blob-1"></div><div className="blob blob-2"></div><div className="blob blob-3"></div>

            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} t={t} isRtl={isRtl} onLogout={onLogout} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Header
                    lang={lang} setLang={setLang} t={t} isRtl={isRtl} settings={companySettings}
                    dateRange={dateRange} setDateRange={setDateRange}
                    showFilter={activeTab !== 'dashboard' && activeTab !== 'settings'}
                />

                <main style={{ flex: 1, padding: '0 32px 32px 32px', overflowY: 'auto' }}>
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                            {activeTab === 'dashboard' && <DashboardView t={t} isRtl={isRtl} onAddInvoice={() => { setSelectedInvoice(null); setSalesView('create'); setActiveTab('sales'); }} sales={filteredSales} purchases={filteredPurchases} customers={customers} fCurrency={fCurrency} />}

                            {activeTab === 'sales' && (
                                salesView === 'list' ? (
                                    <TableView
                                        title={t.sales}
                                        subtitle={t.salesSubtitle}
                                        buttonLabel={t.newInvoiceShort}
                                        onAdd={() => { setSelectedInvoice(null); setSalesView('create'); }}
                                        headers={[t.invoiceId, t.client, t.date, t.status, t.amount]}
                                        data={filteredSales.map(s => ({
                                            id: <span style={{ fontWeight: '700', color: '#38bdf8' }}>{s.number || s.id.substring(0, 8)}</span>,
                                            client: s.client || '---',
                                            date: s.date,
                                            status: s.status,
                                            amount: s.amount,
                                            _original: s
                                        }))}
                                        t={t}
                                        isRtl={isRtl}
                                        onEdit={(invoice) => {
                                            setSelectedInvoice(invoice);
                                            setSalesView('create');
                                        }}
                                        onDelete={handleDeleteSale}
                                        onPrint={(invoice) => {
                                            setSelectedInvoice(invoice);
                                            setSalesView('create');
                                            setTimeout(() => window.print(), 500);
                                        }}
                                        dateRange={dateRange}
                                        setDateRange={setDateRange}
                                    />
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <button onClick={() => setSalesView('list')} style={{ alignSelf: 'start', background: 'transparent', color: '#38bdf8', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>← {t.previous}</button>
                                        <SalesInvoiceView
                                            t={t}
                                            isRtl={isRtl}
                                            initialData={selectedInvoice}
                                            inventory={inventory}
                                            customers={customers}
                                            settings={companySettings}
                                            onSave={async (newInvoice) => {
                                                try {
                                                    const contact = customers.find(c => c.name === newInvoice.client);
                                                    const invoiceData = {
                                                        number: newInvoice.id,
                                                        type: 'sale',
                                                        date: newInvoice.date,
                                                        contact_id: contact?.id,
                                                        total_amount: parseFloat(String(newInvoice.amount).replace(/[^0-9.-]+/g, '')),
                                                        status: newInvoice.status || 'Pending'
                                                    };

                                                    let saved;
                                                    if (selectedInvoice) {
                                                        saved = await api.invoices.update(selectedInvoice.id, invoiceData);
                                                    } else {
                                                        saved = await api.invoices.create(invoiceData, (newInvoice.items || []).map(it => ({
                                                            product_id: inventory.find(p => p.code === it.code)?.id,
                                                            quantity: it.qty,
                                                            price: parseFloat(it.price),
                                                            total: parseFloat(it.price) * it.qty
                                                        })));
                                                    }

                                                    // Update Inventory
                                                    if (newInvoice.items) {
                                                        const newInventory = [...inventory];
                                                        await Promise.all(newInvoice.items.map(async item => {
                                                            const product = inventory.find(p => p.code === item.code);
                                                            if (product) {
                                                                const newStock = Math.max(0, (product.stock || 0) - item.qty);
                                                                await api.products.update(product.id, { stock: newStock });
                                                                const productIndex = newInventory.findIndex(p => p.id === product.id);
                                                                newInventory[productIndex] = { ...product, stock: newStock };
                                                            }
                                                        }));
                                                        setInventory(newInventory);
                                                    }

                                                    // Update Customer Balance
                                                    if (contact) {
                                                        const currentBalance = parseFloat(String(contact.balance || 0).replace(/[^0-9.-]+/g, '')) || 0;
                                                        const invoiceAmount = parseFloat(String(newInvoice.amount).replace(/[^0-9.-]+/g, '')) || 0;
                                                        const newBalance = currentBalance + invoiceAmount;
                                                        await api.contacts.update(contact.id, { balance: newBalance });
                                                        setCustomers(customers.map(c => c.id === contact.id ? { ...c, balance: newBalance } : c));
                                                    }

                                                    const mappedSaved = {
                                                        ...saved,
                                                        client: newInvoice.client,
                                                        amount: fCurrency(saved.total_amount)
                                                    };

                                                    if (selectedInvoice) {
                                                        setSales(sales.map(s => s.id === saved.id ? mappedSaved : s));
                                                    } else {
                                                        setSales([mappedSaved, ...sales]);
                                                    }
                                                    setSalesView('list');
                                                } catch (e) { console.error(e); alert("Failed to save invoice"); }
                                            }}
                                        />
                                    </div>
                                )
                            )}

                            {activeTab === 'purchases' && (
                                purchasesView === 'list' ? (
                                    <TableView
                                        title={t.purchases}
                                        subtitle={t.purchasesSubtitle}
                                        buttonLabel={t.newPurchase}
                                        onAdd={() => { setSelectedPurchase(null); setPurchasesView('create'); }}
                                        headers={[t.invoiceId, t.supplier, t.date, t.status, t.amount]}
                                        data={filteredPurchases.map(p => ({
                                            id: <span style={{ fontWeight: '700', color: '#10b981' }}>{p.number || p.id.substring(0, 8)}</span>,
                                            supplier: p.supplier || '---',
                                            date: p.date,
                                            status: p.status,
                                            amount: p.amount,
                                            _original: p
                                        }))}
                                        t={t}
                                        isRtl={isRtl}
                                        onEdit={(purchase) => {
                                            setSelectedPurchase(purchase);
                                            setPurchasesView('create');
                                        }}
                                        onDelete={handleDeletePurchase}
                                        onPrint={(purchase) => {
                                            setSelectedPurchase(purchase);
                                            setPurchasesView('create');
                                            setTimeout(() => window.print(), 500);
                                        }}
                                        dateRange={dateRange}
                                        setDateRange={setDateRange}
                                    />
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <button onClick={() => setPurchasesView('list')} style={{ alignSelf: 'start', background: 'transparent', color: '#38bdf8', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>← {t.previous}</button>
                                        <PurchaseInvoiceView
                                            t={t}
                                            isRtl={isRtl}
                                            initialData={selectedPurchase}
                                            inventory={inventory}
                                            customers={customers}
                                            settings={companySettings}
                                            onSave={async (newPurchase) => {
                                                try {
                                                    const contact = customers.find(c => c.name === newPurchase.supplier);
                                                    const invoiceData = {
                                                        number: newPurchase.id,
                                                        type: 'purchase',
                                                        date: newPurchase.date,
                                                        contact_id: contact?.id,
                                                        total_amount: parseFloat(String(newPurchase.amount).replace(/[^0-9.-]+/g, '')),
                                                        status: newPurchase.status || 'Paid'
                                                    };

                                                    let saved;
                                                    if (selectedPurchase) {
                                                        saved = await api.invoices.update(selectedPurchase.id, invoiceData);
                                                    } else {
                                                        saved = await api.invoices.create(invoiceData, (newPurchase.items || []).map(it => ({
                                                            product_id: inventory.find(p => p.code === it.code)?.id,
                                                            quantity: it.qty,
                                                            price: parseFloat(it.price),
                                                            total: parseFloat(it.price) * it.qty
                                                        })));
                                                    }

                                                    // Update Inventory (Increase Stock)
                                                    if (newPurchase.items) {
                                                        const newInventory = [...inventory];
                                                        await Promise.all(newPurchase.items.map(async item => {
                                                            const product = inventory.find(p => p.code === item.code);
                                                            if (product) {
                                                                const newStock = (product.stock || 0) + item.qty;
                                                                await api.products.update(product.id, { stock: newStock });
                                                                const productIndex = newInventory.findIndex(p => p.id === product.id);
                                                                newInventory[productIndex] = { ...product, stock: newStock };
                                                            }
                                                        }));
                                                        setInventory(newInventory);
                                                    }

                                                    // Update Customer (Supplier) Balance
                                                    if (contact) {
                                                        const currentBalance = parseFloat(String(contact.balance || 0).replace(/[^0-9.-]+/g, '')) || 0;
                                                        const invoiceAmount = parseFloat(String(newPurchase.amount).replace(/[^0-9.-]+/g, '')) || 0;
                                                        const newBalance = currentBalance - invoiceAmount;
                                                        await api.contacts.update(contact.id, { balance: newBalance });
                                                        setCustomers(customers.map(c => c.id === contact.id ? { ...c, balance: newBalance } : c));
                                                    }

                                                    const mappedSaved = {
                                                        ...saved,
                                                        supplier: newPurchase.supplier,
                                                        amount: fCurrency(saved.total_amount)
                                                    };

                                                    if (selectedPurchase) {
                                                        setPurchases(purchases.map(p => p.id === saved.id ? mappedSaved : p));
                                                    } else {
                                                        setPurchases([mappedSaved, ...purchases]);
                                                    }
                                                    setPurchasesView('list');
                                                } catch (e) { console.error(e); alert("Failed to save purchase"); }
                                            }}
                                        />
                                    </div>
                                )
                            )}

                            {activeTab === 'treasury' && (
                                <TreasuryView
                                    t={t}
                                    isRtl={isRtl}
                                    transactions={filteredTreasury}
                                    accounts={accounts}
                                    fCurrency={fCurrency}
                                    onAdd={() => {
                                        setTransForm({ id: null, desc: '', amount: '', type: 'In', method: 'Cash', accountId: '' });
                                        setModalType('transaction');
                                    }}
                                    onDelete={handleDeleteTransaction}
                                    onEdit={(tr) => {
                                        setTransForm({
                                            id: tr.id,
                                            desc: tr.desc,
                                            amount: parseFloat(tr.anim.replace(/[^0-9.-]+/g, '')),
                                            type: tr.type === 'Cash In' || tr.type === t.cashIn || tr.type === 'قبض' ? 'In' : 'Out',
                                            method: tr.method,
                                            accountId: tr.accountId || ''
                                        });
                                        setModalType('transaction');
                                    }}
                                />
                            )}

                            {activeTab === 'inventory' && <InventoryView t={t} isRtl={isRtl} inventory={inventory} onAdd={() => {
                                setProductForm({ name: '', code: `PRD-${Math.floor(Math.random() * 1000)}`, barcode: '', category: '', unit: 'Piece', buy: '', sell: '', stock: '', minLimit: 5 });
                                setModalType('addProduct');
                            }} onEdit={handleEditProduct} onDelete={handleDeleteProduct} fCurrency={fCurrency} />}
                            {activeTab === 'customers' && (
                                customersView === 'list' ? (
                                    <CustomersSuppliersView
                                        t={t}
                                        isRtl={isRtl}
                                        contacts={customers}
                                        onAdd={() => { setContactForm({ name: '', type: 'client', email: '', balance: '', phone: '', address: '', taxNumber: '' }); setModalType('addContact'); }}
                                        onEdit={(contact) => {
                                            setContactForm({ ...contact, address: contact.location, balance: contact.balance.replace(/[^\d.-]/g, '') });
                                            setModalType('addContact');
                                        }}
                                        onDelete={handleDeleteContact}
                                        onViewStatement={(contact) => { setSelectedContact(contact); setCustomersView('statement'); }}
                                    />
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <button onClick={() => setCustomersView('list')} style={{ alignSelf: 'start', background: 'transparent', color: '#38bdf8', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>← {t.previous}</button>
                                        <AccountStatementView t={t} isRtl={isRtl} contact={selectedContact} dateRange={dateRange} />
                                    </div>
                                )
                            )}

                            {activeTab === 'reports' && <ReportsView t={t} isRtl={isRtl} sales={filteredSales} purchases={filteredPurchases} expenses={filteredTreasury.filter(t => t.type === 'Cash Out' || t.type === 'مصاريف')} inventory={inventory} treasury={filteredTreasury} fCurrency={fCurrency} dateRange={dateRange} setDateRange={setDateRange} />}
                            {activeTab === 'settings' && <SettingsView t={t} isRtl={isRtl} settings={companySettings} onSave={setCompanySettings} />}
                            {activeTab === 'chart' && (
                                <ChartOfAccountsView
                                    t={t}
                                    isRtl={isRtl}
                                    onAdd={() => { setAccountForm({ code: '', name: '', type: 'Asset', parent: '', balance: '0' }); setModalType('addAccount'); }}
                                    accounts={accounts}
                                    onDelete={handleDeleteAccount}
                                    fCurrency={fCurrency}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            <Modal isOpen={!!modalType} onClose={() => setModalType(null)} title={(t && modalType && t[modalType]) || (t && t.save) || "Save"} isRtl={isRtl}>
                {(modalType === 'sale' || modalType === 'purchase') && (
                    <>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <FormInput half label={t.reference} placeholder="REF-2024-001" isRtl={isRtl} />
                            <FormInput half label={t.date} type="date" value={invForm.date} isRtl={isRtl} />
                        </div>
                        <FormInput label={modalType === 'sale' ? t.clientName : t.supplierName} value={invForm.client} onChange={v => setInvForm({ ...invForm, client: v })} isRtl={isRtl} />
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <FormInput half label={t.amount} value={invForm.amount} onChange={v => setInvForm({ ...invForm, amount: v })} type="number" isRtl={isRtl} />
                            <FormInput half label={t.paymentMethod} type="select" options={[{ label: 'Cash', value: 'cash' }, { label: 'Bank', value: 'bank' }]} isRtl={isRtl} />
                        </div>
                        <FormInput label={t.notes} isRtl={isRtl} />
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={modalType === 'sale' ? handleAddSale : handleAddPurchase} style={{ flex: 1, background: '#38bdf8', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>{t.save}</button>
                            <button onClick={() => setModalType(null)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white', padding: '14px', borderRadius: '12px', border: 'none' }}>{t.cancel}</button>
                        </div>
                    </>
                )}
                {modalType === 'addProduct' && (
                    <>
                        <FormInput label={t.productName} value={productForm.name} onChange={v => setProductForm({ ...productForm, name: v })} isRtl={isRtl} />

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <FormInput half label={t.code} value={productForm.code} onChange={v => setProductForm({ ...productForm, code: v })} isRtl={isRtl} />
                            <FormInput half label={t.barcode} value={productForm.barcode} onChange={v => setProductForm({ ...productForm, barcode: v })} isRtl={isRtl} />
                        </div>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <FormInput half label={t.category} value={productForm.category} onChange={v => setProductForm({ ...productForm, category: v })} isRtl={isRtl} />
                            <FormInput half label={t.unit} value={productForm.unit} onChange={v => setProductForm({ ...productForm, unit: v })} isRtl={isRtl} />
                        </div>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <FormInput half label={t.buyingPrice} type="number" value={productForm.buy} onChange={v => setProductForm({ ...productForm, buy: v })} isRtl={isRtl} />
                            <FormInput half label={t.sellingPrice} type="number" value={productForm.sell} onChange={v => setProductForm({ ...productForm, sell: v })} isRtl={isRtl} />
                        </div>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <FormInput half label={t.minLimit} type="number" value={productForm.minLimit} onChange={v => setProductForm({ ...productForm, minLimit: v })} isRtl={isRtl} />
                            <FormInput half label={t.currentQuantity} type="number" value={productForm.stock} onChange={v => setProductForm({ ...productForm, stock: v })} isRtl={isRtl} />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={handleAddProduct} style={{ flex: 1, background: '#1d4ed8', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>{t.save}</button>
                            <button onClick={() => setModalType(null)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white', padding: '14px', borderRadius: '12px', border: 'none' }}>{t.cancel}</button>
                        </div>
                    </>
                )}
                {modalType === 'addContact' && (
                    <>
                        <FormInput label={t.customerName} value={contactForm.name} onChange={v => setContactForm({ ...contactForm, name: v })} isRtl={isRtl} />
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <FormInput half label={t.phone} value={contactForm.phone} onChange={v => setContactForm({ ...contactForm, phone: v })} isRtl={isRtl} />
                            <FormInput half label={t.type} type="select" options={[{ label: t.client, value: 'client' }, { label: t.supplier, value: 'supplier' }]} value={contactForm.type} onChange={v => setContactForm({ ...contactForm, type: v })} isRtl={isRtl} />
                        </div>
                        <FormInput label={t.address} value={contactForm.address} onChange={v => setContactForm({ ...contactForm, address: v })} isRtl={isRtl} />
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <FormInput half label={t.email} value={contactForm.email} onChange={v => setContactForm({ ...contactForm, email: v })} isRtl={isRtl} />
                            <FormInput half label={t.taxNumber} value={contactForm.taxNumber} onChange={v => setContactForm({ ...contactForm, taxNumber: v })} isRtl={isRtl} />
                        </div>
                        <FormInput label={t.openingBalance} type="number" value={contactForm.balance} onChange={v => setContactForm({ ...contactForm, balance: v })} isRtl={isRtl} />
                        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '-12px', marginBottom: '20px' }}>{t.balanceHelper}</p>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={handleAddContact} style={{ flex: 1, background: '#38bdf8', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>{t.save}</button>
                            <button onClick={() => setModalType(null)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white', padding: '14px', borderRadius: '12px', border: 'none' }}>{t.cancel}</button>
                        </div>
                    </>
                )}
                {modalType === 'transaction' && (
                    <>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <FormInput half label={t.transactionDate} type="date" value={invForm.date} isRtl={isRtl} />
                            <FormInput half label={t.reference} placeholder="TRE-001" isRtl={isRtl} />
                        </div>
                        <FormInput label={t.description} value={transForm.desc} onChange={v => setTransForm({ ...transForm, desc: v })} isRtl={isRtl} />
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <FormInput half label="Account" type="select" options={[{ label: '-- Select Account --', value: '' }, ...accounts.map(a => ({ label: `${a.code} - ${a.name}`, value: a.code }))]} value={transForm.accountId} onChange={v => setTransForm({ ...transForm, accountId: v })} isRtl={isRtl} />
                            <FormInput half label={t.amount} value={transForm.amount} onChange={v => setTransForm({ ...transForm, amount: v })} type="number" isRtl={isRtl} />
                        </div>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <FormInput half label={t.type} type="select" options={[{ label: t.cashIn, value: 'In' }, { label: t.cashOut, value: 'Out' }]} value={transForm.type} onChange={v => setTransForm({ ...transForm, type: v })} isRtl={isRtl} />
                            <FormInput half label={t.method} type="select" options={[{ label: 'Treasury / Cash', value: 'cash' }, { label: 'National Bank', value: 'bank' }]} isRtl={isRtl} />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={handleAddTrans} style={{ flex: 1, background: '#38bdf8', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>{t.save}</button>
                            <button onClick={() => setModalType(null)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white', padding: '14px', borderRadius: '12px', border: 'none' }}>{t.cancel}</button>
                        </div>
                    </>
                )}
                {modalType === 'addAccount' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Row 1: Code (Right) - Type (Left) [RTL assumption] */}
                        {/* Actually in screenshot: Code is Left/Right depends on lang, let's stick to standard flow but re-order */}
                        {/* Screenshot shows: Account Code | Account Classification */}
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <FormInput half label={t.accountCode} placeholder={t.codePlaceholder} value={accountForm.code} onChange={v => setAccountForm({ ...accountForm, code: v })} isRtl={isRtl} />
                            <FormInput half label={t.classification} type="select" options={[{ label: t.assets, value: 'Asset' }, { label: t.liabilities, value: 'Liability' }, { label: t.equity, value: 'Equity' }, { label: t.revenue, value: 'Revenue' }, { label: t.expenses, value: 'Expense' }]} value={accountForm.type} onChange={v => setAccountForm({ ...accountForm, type: v })} isRtl={isRtl} />
                        </div>

                        {/* Row 2: Account Name */}
                        <FormInput label={t.accountName} placeholder={t.namePlaceholder} value={accountForm.name} onChange={v => setAccountForm({ ...accountForm, name: v })} isRtl={isRtl} />

                        {/* Row 3: Opening Balance | Parent Account */}
                        {/* Screenshot: Balance | Parent */}
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <FormInput half label={t.openingBalance} placeholder="0" type="number" value={accountForm.balance} onChange={v => setAccountForm({ ...accountForm, balance: v })} isRtl={isRtl} />
                            <FormInput half label={t.accountFather} type="select" options={[{ label: t.parentOptionDefault, value: '' }, ...accounts.map(a => ({ label: `${a.code} - ${a.name}`, value: a.code }))]} value={accountForm.parent} onChange={v => setAccountForm({ ...accountForm, parent: v })} isRtl={isRtl} />
                        </div>

                        {/* Row 4: Description */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8' }}>{t.description}</label>
                            <textarea
                                placeholder={t.descPlaceholder}
                                className="glass"
                                style={{
                                    padding: '12px',
                                    borderRadius: '10px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    outline: 'none',
                                    minHeight: '80px',
                                    resize: 'none',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        {/* Checkbox */}
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end', marginTop: '4px', marginBottom: '12px' }}>
                            <label htmlFor="activeAccount" style={{ fontSize: '14px', cursor: 'pointer' }}>{t.activeAccount}</label>
                            <input type="checkbox" id="activeAccount" defaultChecked style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#38bdf8' }} />
                        </div>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={handleAddAccount} style={{ flex: 1, background: '#1d4ed8', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>{t.save}</button>
                            <button onClick={() => setModalType(null)} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '14px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}>{t.cancel}</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

// Supporting Components (Header, StatCard, etc from previous version)
const Header = ({ lang, setLang, t, isRtl, settings }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', marginBottom: '16px', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
            <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', width: '300px' }}>
                <Search size={18} color="#94a3b8" />
                <input placeholder={t.searchPlaceholder} style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%' }} />
            </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => setLang(lang === 'en' ? 'ar' : lang === 'ar' ? 'fr' : 'en')} className="glass" style={{ padding: '8px 16px', color: '#38bdf8', fontWeight: '700' }}>{t.languageName}</button>
            <Bell className="text-gray-400" size={20} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                    <p style={{ fontWeight: '700', fontSize: '13px' }}>{settings?.name || "Ilyas Accountant"}</p>
                    <p style={{ fontSize: '11px', color: '#94a3b8' }}>{t.admin}</p>
                </div>
                <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'linear-gradient(45deg, #1e293b, #334155)' }}></div>
            </div>
        </div>
    </div>
);

const StatCard = ({ title, value, change, trend, icon: Icon, chartData, index }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="glass glass-hover" style={{ padding: '24px', flex: 1, minWidth: '240px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-primary)' }}><Icon size={24} /></div>
        </div>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '4px' }}>{title}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '700' }}>{value}</h3>
            <div style={{ fontSize: '12px', color: trend === 'up' ? '#22c55e' : '#ef4444' }}>{change}</div>
        </div>
    </motion.div>
);

const DateFilterBar = null; // Replaced by Header integration

const DashboardView = ({ t, isRtl, onAddInvoice, sales, purchases, customers, fCurrency }) => {
    const totalRev = sales.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
    const totalPur = purchases.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
    const profit = totalRev - totalPur;

    // Chart Data logic
    const chartData = [
        { name: 'Revenue', value: totalRev },
        { name: 'Expenses', value: totalPur }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'white', marginBottom: '4px' }}>{t.overview}</h2>
                    <p style={{ color: '#94a3b8', fontSize: '14px' }}>{t.welcomeBack}</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAddInvoice}
                    style={{ background: 'linear-gradient(135deg, #38bdf8, #1d4ed8)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 20px rgba(56, 189, 248, 0.2)' }}
                >
                    <Plus size={20} /> {t.newInvoiceShort}
                </motion.button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                <StatCard index={0} title={t.totalRevenue} value={fCurrency(totalRev)} change="+100%" trend="up" icon={TrendingUp} />
                <StatCard index={1} title={t.purchases} value={fCurrency(totalPur)} change="+100%" trend="down" icon={ShoppingCart} />
                <StatCard index={2} title={t.customersSuppliers} value={customers.length} change="+0%" trend="up" icon={Users} />
                <StatCard index={3} title={t.netProfit} value={fCurrency(profit)} change="+100%" trend="up" icon={ArrowUpRight} />
            </div>

            <div className="glass" style={{ padding: '24px', height: '350px' }}>
                <h3 style={{ marginBottom: '20px' }}>{t.revenueAnalytics}</h3>
                <ResponsiveContainer width="100%" height="85%">
                    <AreaChart data={chartData.length > 0 ? chartData : [{ name: 'N/A', value: 0 }]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke="#38bdf8" fill="rgba(56, 189, 248, 0.2)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

/* Placeholder for Account Statement used in Treasury */
const AccountStatementView = ({ t, isRtl }) => {
    const transactions = [
        { date: '2024/03/20', statement: 'Sales Invoice', docNo: 'INV-1768455734828', debit: '59,800', credit: '-', balance: '59,800' },
        { date: '2024/03/21', statement: 'Sales Invoice', docNo: 'INV-1769196812581', debit: '33,350', credit: '-', balance: '93,150' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button className="glass" style={{ padding: '8px' }} onClick={() => { }}><ChevronLeft size={20} /></button>
                    <h2 style={{ fontSize: '24px', fontWeight: '700' }}>{t.accountStatement}</h2>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => window.print()} className="glass" style={{ padding: '10px 16px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: 'none' }}><Printer size={18} /> {t.save}</button>
                    <button onClick={() => {
                        generateReportPDF(
                            t.accountStatement || "Account Statement",
                            [t.date, t.statement, t.documentNumber, t.debit, t.credit, t.balance],
                            transactions.map(tr => [tr.date, tr.statement, tr.docNo, tr.debit, tr.credit, tr.balance]),
                            t
                        );
                    }} className="glass" style={{ padding: '10px 16px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: 'none' }}><Download size={18} /> {t.downloadPDF}</button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div className="glass" style={{ flex: 1, padding: '20px' }}>
                    <p style={{ color: '#94a3b8', fontSize: '12px' }}>Account Name</p>
                    <p style={{ fontWeight: '700', fontSize: '18px' }}>Modern Tech Institution</p>
                </div>
                <div className="glass" style={{ flex: 1, padding: '20px' }}>
                    <p style={{ color: '#94a3b8', fontSize: '12px' }}>Phone</p>
                    <p style={{ fontWeight: '700', fontSize: '18px' }}>0501234567</p>
                </div>
                <div className="glass" style={{ flex: 1, padding: '20px' }}>
                    <p style={{ color: '#22c55e', fontSize: '12px' }}>Current Balance (Debit)</p>
                    <p style={{ fontWeight: '800', fontSize: '20px', color: '#22c55e' }}>93,150 DA</p>
                </div>
            </div>

            <div className="glass" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <FormInput half label="From Date" type="date" isRtl={isRtl} />
                    <FormInput half label="To Date" type="date" isRtl={isRtl} />
                    <button className="glass" style={{ alignSelf: 'center', padding: '12px 24px', height: '45px', marginTop: '12px' }}>Refresh</button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', color: '#94a3b8', fontSize: '13px' }}>
                            <th style={{ padding: '12px 20px' }}>{t.date}</th>
                            <th style={{ padding: '12px 20px' }}>{t.statement}</th>
                            <th style={{ padding: '12px 20px' }}>{t.documentNumber}</th>
                            <th style={{ padding: '12px 20px' }}>{t.debit}</th>
                            <th style={{ padding: '12px 20px' }}>{t.credit}</th>
                            <th style={{ padding: '12px 20px' }}>{t.balance}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tr, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '16px 20px' }}>{tr.date}</td>
                                <td style={{ padding: '16px 20px' }}>
                                    <span style={{ padding: '4px 8px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', borderRadius: '4px', fontSize: '12px' }}>{tr.statement}</span>
                                </td>
                                <td style={{ padding: '16px 20px', fontSize: '13px', color: '#94a3b8' }}>{tr.docNo}</td>
                                <td style={{ padding: '16px 20px' }}>{tr.debit}</td>
                                <td style={{ padding: '16px 20px' }}>{tr.credit}</td>
                                <td style={{ padding: '16px 20px', fontWeight: '700' }}>{tr.balance}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ReportsView = ({ t, isRtl, sales = [], purchases = [], expenses = [], inventory = [], treasury = [], fCurrency, dateRange, setDateRange }) => {
    const [activeSubTab, setActiveSubTab] = useState('incomeStatement');

    // Calculations
    const totalRevenue = sales.reduce((acc, sale) => acc + (typeof sale.total === 'number' ? sale.total : parseFloat(String(sale.total || '0').replace(/[^0-9.-]+/g, ''))), 0);

    // Cost of goods sold (simplified estimate based on purchases for now, ideally per item margin)
    // For a more accurate COGS in real apps, we'd track specific batch costs. Here we'll sum purchase invoices or assume a margin.
    // Let's use the 'buyPrice' of sold items if available in sales history, else fallback to total purchases for the period.
    // Since 'sales' structure in this mock doesn't detailed items with buy prices easily accessible without deep dive, 
    // we will use Total Purchases as a proxy for COGS for this period (Cash Basis Accounting style) or just hardcode a simpler margin if preferred.
    // Better approach for this MVP: Sum of (Item Buy Price * Qty) from Sales if we had that detail preserved safely.
    // Let's use Total Purchases as "Cost of Sales" for now as it's common in simple cash-basis systems.
    const costOfSales = purchases.reduce((acc, p) => acc + (typeof p.total === 'number' ? p.total : parseFloat(String(p.total || '0').replace(/[^0-9.-]+/g, ''))), 0);

    const grossProfit = totalRevenue - costOfSales;

    const operatingExpenses = expenses.reduce((acc, exp) => acc + (typeof exp.anim === 'number' ? exp.anim : parseFloat(String(exp.anim || '0').replace(/[^0-9.-]+/g, ''))), 0);

    const netProfit = grossProfit - operatingExpenses;

    const stockValue = inventory.reduce((acc, i) => {
        const bp = typeof i.buyPrice === 'number' ? i.buyPrice : parseFloat(String(i.buyPrice || '0').replace(/[^0-9.-]+/g, ''));
        return acc + (bp * (i.stock || 0));
    }, 0);
    const cashOnHand = treasury.reduce((acc, tr) => {
        const amt = typeof tr.anim === 'number' ? tr.anim : parseFloat(String(tr.anim || '0').replace(/[^0-9.-]+/g, ''));
        return tr.type === 'Cash In' || tr.type === 'قبض' ? acc + amt : acc - amt;
    }, 0);

    // Placeholder for liabilities (e.g. unpaid supplier invoices)
    const liabilities = purchases.filter(p => p.status === 'Pending').reduce((acc, p) => acc + (typeof p.total === 'number' ? p.total : parseFloat(String(p.total || '0').replace(/[^0-9.-]+/g, ''))), 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '12px', order: isRtl ? 2 : 1 }}>
                        <button className="glass" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: 'none', color: '#94a3b8' }} onClick={() => window.print()}><Printer size={18} /> {t.printing}</button>
                        <button onClick={() => {
                            const title = t[activeSubTab] || "Financial Report";
                            // Generate simple PDF data
                            const reportData = [
                                { label: t.revenue, value: fCurrency(totalRevenue) },
                                { label: t.costOfSales, value: fCurrency(costOfSales) },
                                { label: t.formattedGrossProfit, value: fCurrency(grossProfit) },
                                { label: t.formattedNetProfit, value: fCurrency(netProfit) }
                            ];
                            generateReportPDF(title, ["Item", "Amount"], reportData.map(r => [r.label, r.value]), t);
                        }} className="glass" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: 'none', color: '#94a3b8' }}><Download size={18} /> {t.downloadPDF}</button>
                    </div>

                    {dateRange && setDateRange && (
                        <div className="glass" style={{ display: 'flex', gap: '15px', padding: '8px 16px', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
                                <Calendar size={16} />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontSize: '11px', color: '#64748b' }}>{t.fromDate}:</span>
                                    <input
                                        type="date"
                                        value={dateRange.start}
                                        onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
                                        style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '12px', outline: 'none' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontSize: '11px', color: '#64748b' }}>{t.toDate}:</span>
                                    <input
                                        type="date"
                                        value={dateRange.end}
                                        onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
                                        style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '12px', outline: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ order: isRtl ? 1 : 2, textAlign: isRtl ? 'left' : 'right' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700' }}>{t.financialReports}</h2>
                    <p style={{ color: '#94a3b8', fontSize: '14px' }}>Analyze your financial health</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', justifyContent: 'flex-end' }}>
                {['incomeStatement', 'balanceSheet'].map(tab => (
                    <button key={tab} onClick={() => setActiveSubTab(tab)} style={{ padding: '8px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap', background: activeSubTab === tab ? '#1d4ed8' : 'rgba(255,255,255,0.03)', color: activeSubTab === tab ? 'white' : '#94a3b8' }}>{t[tab]}</button>
                ))}
            </div>

            <div className="glass" style={{ padding: '24px' }}>
                {activeSubTab === 'incomeStatement' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp size={20} color="#38bdf8" /> {t.incomeStatement}</h3>
                        </div>

                        {/* 1. Total Sales */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '25px', background: '#dcfce7', borderRadius: '8px', alignItems: 'center' }}>
                            <span style={{ color: '#166534', fontWeight: '700', fontSize: '14px' }}>{t.revenue}</span>
                            <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                                <strong style={{ fontSize: '24px', color: '#166534', display: 'block' }}>{fCurrency(totalRevenue)}</strong>
                            </div>
                        </div>

                        {/* 2. Cost of Sales */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '25px', background: '#fee2e2', borderRadius: '8px', alignItems: 'center' }}>
                            <span style={{ color: '#991b1b', fontWeight: '700', fontSize: '14px' }}>{t.costOfSales}</span>
                            <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                                <strong style={{ fontSize: '24px', color: '#991b1b', display: 'block' }}>{fCurrency(costOfSales)}</strong>
                            </div>
                        </div>

                        {/* 3. Gross Profit */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '25px', background: '#e0f2fe', borderRadius: '8px', alignItems: 'center' }}>
                            <span style={{ color: '#075985', fontWeight: '700', fontSize: '14px' }}>{t.grossProfit || "Gross Profit"}</span>
                            <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                                <strong style={{ fontSize: '24px', color: '#075985', display: 'block' }}>{fCurrency(grossProfit)}</strong>
                            </div>
                        </div>

                        {/* 4. Operating Expenses */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '25px', background: '#ffedd5', borderRadius: '8px', alignItems: 'center' }}>
                            <span style={{ color: '#9a3412', fontWeight: '700', fontSize: '14px' }}>{t.operatingExpenses || "Operating Expenses (-)"}</span>
                            <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                                <strong style={{ fontSize: '24px', color: '#9a3412', display: 'block' }}>{fCurrency(operatingExpenses)}</strong>
                            </div>
                        </div>

                        {/* 5. Net Profit */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '25px', background: '#dcfce7', borderRadius: '8px', alignItems: 'center', marginTop: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <span style={{ color: '#15803d', fontWeight: '800', fontSize: '16px' }}>{t.netProfit}</span>
                            <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                                <strong style={{ fontSize: '28px', color: '#15803d', display: 'block' }}>{fCurrency(netProfit)}</strong>
                            </div>
                        </div>
                    </div>
                )}
                {activeSubTab === 'balanceSheet' && (
                    <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <h4 style={{ color: '#38bdf8', marginBottom: '16px' }}>{t.assets}</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}><span>{t.stock}</span><span style={{ fontWeight: '700' }}>{fCurrency(stockValue)}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}><span>{t.cash}</span><span style={{ fontWeight: '700' }}>{fCurrency(cashOnHand)}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px', marginTop: '16px' }}><strong>{t.totalAssets}</strong><strong>{fCurrency(stockValue + cashOnHand)}</strong></div>
                        </div>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <h4 style={{ color: '#ef4444', marginBottom: '16px' }}>{t.liabilities}</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}><span>{t.customersSuppliers}</span><span style={{ fontWeight: '700' }}>{fCurrency(liabilities)}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}><span>{t.netProfit}</span><span style={{ fontWeight: '700', color: '#22c55e' }}>{fCurrency(netProfit)}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', marginTop: '16px' }}><strong>{t.totalLiabilities}</strong><strong>{fCurrency(liabilities + netProfit)}</strong></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const SettingsView = ({ t, isRtl, settings, onSave }) => {
    const [localSettings, setLocalSettings] = useState(settings);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
                <h2 style={{ fontSize: '24px', fontWeight: '700' }}>{t.settings}</h2>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>{t.manageSettings || "Manage your application preferences"}</p>
            </div>

            <div className="glass" style={{ padding: '24px', maxWidth: '600px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>{t.companyData}</h3>
                <FormInput
                    label={t.companyNameEn || "Company Name"}
                    value={localSettings.name}
                    onChange={(v) => setLocalSettings({ ...localSettings, name: v })}
                    isRtl={isRtl}
                />
                <FormInput
                    label={t.email}
                    value={localSettings.email}
                    onChange={(v) => setLocalSettings({ ...localSettings, email: v })}
                    isRtl={isRtl}
                />
                <div style={{ display: 'flex', gap: '20px' }}>
                    <FormInput
                        half
                        label={t.phone}
                        value={localSettings.phone}
                        onChange={(v) => setLocalSettings({ ...localSettings, phone: v })}
                        isRtl={isRtl}
                    />
                    <FormInput
                        half
                        label={t.taxNumber}
                        value={localSettings.taxNumber}
                        onChange={(v) => setLocalSettings({ ...localSettings, taxNumber: v })}
                        isRtl={isRtl}
                    />
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <FormInput
                        half
                        label={t.address}
                        value={localSettings.address}
                        onChange={(v) => setLocalSettings({ ...localSettings, address: v })}
                        isRtl={isRtl}
                    />
                    <FormInput
                        half
                        label={t.currency || "Currency"}
                        value={localSettings.currency}
                        onChange={(v) => setLocalSettings({ ...localSettings, currency: v })}
                        isRtl={isRtl}
                    />
                </div>
                <button
                    onClick={() => {
                        try {
                            onSave(localSettings);
                            alert(t.saveChanges || "Settings saved successfully!");
                        } catch (err) {
                            console.error("Save error:", err);
                            alert("Error saving settings.");
                        }
                    }}
                    className="glass sidebar-active"
                    style={{ padding: '12px 24px', border: 'none', cursor: 'pointer', fontWeight: '700', marginTop: '12px' }}
                >
                    {t.save}
                </button>
            </div>
        </div>
    );
};

// --- End of App ---

const App = () => {
    const [lang, setLang] = useState('fr');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const t = translations[lang];
    const isRtl = lang === 'ar';

    useEffect(() => {
        document.body.dir = isRtl ? 'rtl' : 'ltr';
        document.body.style.fontFamily = lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif";
    }, [lang, isRtl]);

    if (!isLoggedIn) {
        return <LoginView t={t} isRtl={isRtl} onLogin={() => setIsLoggedIn(true)} lang={lang} />;
    }

    return <AuthenticatedApp lang={lang} setLang={setLang} onLogout={() => setIsLoggedIn(false)} />;
};

export default App;
