import React, { useState, useEffect, useMemo, isValidElement } from 'react';
import {
    LayoutDashboard,
    FileText,
    Users,
    Package,
    TrendingUp,
    Settings,
    LogOut,
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
    Briefcase,
    ShoppingCart,
    CreditCard,
    History,
    Phone,
    MapPin,
    Eye,
    Trash2,
    BarChart2,
    AlertTriangle
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
import translations from './translations';
import { generateInvoicePDF, generateReportPDF } from './utils/pdfUtils';
import { initialAccounts } from './data/initialAccounts';
import { formatCurrency } from './utils/formatCurrency';

// --- Reusable Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick, isRtl, index }) => (
    <motion.div
        initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ x: isRtl ? -4 : 4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${active
            ? 'sidebar-active shadow-lg'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
        style={{
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '12px'
        }}
    >
        <Icon size={20} />
        <span className="font-medium" style={{ fontSize: '13px' }}>{label}</span>
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

const FormInput = ({ label, value, onChange, placeholder, type = "text", isRtl, half, options }) => (
    <div style={{ marginBottom: '20px', flex: half ? '1' : 'none' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px' }}>{label}</label>
        {type === 'select' ? (
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="glass"
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', outline: 'none', appearance: 'none' }}
            >
                {options.map(opt => <option key={opt.value} value={opt.value} style={{ background: '#1e293b' }}>{opt.label}</option>)}
            </select>
        ) : (
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="glass"
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', outline: 'none', textAlign: isRtl ? 'right' : 'left', fontSize: '14px' }}
            />
        )}
    </div>
);

// --- Sections ---

const Sidebar = ({ activeTab, setActiveTab, t, isRtl }) => {
    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: t.dashboard },
        { id: 'sales', icon: FileText, label: t.sales },
        { id: 'purchases', icon: ShoppingCart, label: t.purchases },
        { id: 'inventory', icon: Package, label: t.inventory },
        { id: 'customers', icon: Users, label: t.customersSuppliers },
        { id: 'treasury', icon: Wallet, label: t.treasury },
        { id: 'chart', icon: Briefcase, label: t.chartOfAccounts },
        { id: 'reports', icon: TrendingUp, label: t.reports },
        { id: 'settings', icon: Settings, label: t.settings },
    ];

    return (
        <div className="glass" style={{ width: '260px', height: 'calc(100vh - 32px)', margin: '16px', display: 'flex', flexDirection: 'column', padding: '24px', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Briefcase color="white" size={20} />
                </div>
                <h1 style={{ fontSize: '18px', fontWeight: '800' }}>{t.appName}</h1>
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
                            if (item.id === 'sales') setSalesView('list');
                        }}
                        isRtl={isRtl}
                    />
                ))}
            </div>

            <div style={{ marginTop: '20px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <SidebarItem icon={LogOut} label={t.logout} onClick={() => window.location.reload()} isRtl={isRtl} index={10} />
            </div>
        </div>
    );
};

// --- View Implementation ---

const TableView = ({ title, subtitle, buttonLabel, onAdd, headers, data, t, isRtl, onExport, searchPlaceholder, onView, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');

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

            <div className="glass" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)' }}>
                <Search size={18} color="#94a3b8" />
                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={searchPlaceholder || t.searchBy}
                    style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontSize: '14px' }}
                />
            </div>

            <div className="glass" style={{ overflow: 'hidden', padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.02)', color: '#94a3b8', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <tr>
                            {headers.map((h, i) => <th key={i} style={{ padding: '16px 24px', fontWeight: '600' }}>{h}</th>)}
                            <th style={{ padding: '16px 24px', textAlign: 'center' }}>{t.actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i} className="glass-hover" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                {Object.keys(row).map((key, j) => {
                                    const val = row[key];
                                    if (key === 'status') {
                                        const isPaid = val === 'Paid' || val === 'مدفوع' || val === 'Payé';
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
                                        {onView && (
                                            <button onClick={() => onView(row)} style={{ color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer' }}><Eye size={18} /></button>
                                        )}
                                        {onDelete && (
                                            <button onClick={() => onDelete(row)} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}>
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
        </div>
    );
};

const InventoryView = ({ t, isRtl, inventory, onAdd }) => {
    const lowStockCount = inventory.filter(i => (i.stock || 0) <= 5).length;
    const stockValue = inventory.reduce((acc, i) => acc + (parseInt((i.buyPrice || '0').replace(/\D/g, '')) * (i.stock || 0)), 0);
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
                        <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{stockValue.toLocaleString()}</h3>
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
                    stock: <span style={{ padding: '4px 12px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '6px', fontWeight: '700', fontSize: '13px' }}>{item.stock}</span>
                }))}
                t={t}
                isRtl={isRtl}
                onDelete={(item) => onAdd({ type: 'delete', id: item.code })}
            />
        </div>
    );
};


const SalesInvoiceView = ({ t, isRtl, onSave, initialData }) => {
    const [items, setItems] = useState(initialData ? [
        { id: 1, name: 'Produit Exemple', qty: 1, price: parseInt(initialData.amount.replace(/\D/g, '')), total: parseInt(initialData.amount.replace(/\D/g, '')) }
    ] : [
        { id: 1, name: 'شاشة سامسونج 27 بوصة', qty: 2, price: 14500, total: 29000 },
    ]);
    const [date, setDate] = useState(initialData ? initialData.date.replace(/\//g, '-') : new Date().toISOString().split('T')[0]);
    const [discountType, setDiscountType] = useState('amount');
    const [discountValue, setDiscountValue] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cash');

    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const tax = subtotal * 0.15;
    const discount = discountType === 'percentage' ? (subtotal * discountValue / 100) : discountValue;
    const total = subtotal + tax - discount;

    const removeItem = (id) => setItems(items.filter(item => item.id !== id));

    const handleSave = () => {
        const newInvoice = {
            id: initialData ? initialData.id : `INV-${Date.now()}`,
            client: 'مؤسسة التقنية الحديثة',
            date: date,
            status: 'Payé',
            amount: total.toLocaleString()
        };
        onSave(newInvoice);
    };

    return (
        <div style={{ display: 'flex', gap: '24px', height: 'calc(100vh - 120px)' }}>
            {/* Left Controls */}
            <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="glass" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={18} color="#38bdf8" /> {t.clientData}
                    </h3>
                    <FormInput label={t.client} type="select" options={[{ label: 'مؤسسة التقنية الحديثة', value: '1' }]} isRtl={isRtl} />
                    <FormInput label={t.date} type="date" value={date} onChange={(val) => setDate(val)} isRtl={isRtl} />
                </div>

                <div className="glass" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CreditCard size={18} color="#38bdf8" /> {t.paymentMethod}
                    </h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {[
                            { id: 'cash', label: t.cashPayment },
                            { id: 'network', label: t.networkPayment },
                            { id: 'deferred', label: t.deferredPayment }
                        ].map(m => (
                            <button
                                key={m.id}
                                onClick={() => setPaymentMethod(m.id)}
                                style={{
                                    flex: 1, padding: '10px 4px', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                                    background: paymentMethod === m.id ? '#38bdf8' : 'rgba(255,255,255,0.05)',
                                    color: paymentMethod === m.id ? 'white' : '#94a3b8', transition: 'all 0.2s'
                                }}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="glass" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>{t.discount}</h3>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                        <button onClick={() => setDiscountType('amount')} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', fontSize: '12px', background: discountType === 'amount' ? 'rgba(56, 189, 248, 0.1)' : 'transparent', color: discountType === 'amount' ? '#38bdf8' : '#94a3b8' }}>{t.discountAmount}</button>
                        <button onClick={() => setDiscountType('percentage')} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', fontSize: '12px', background: discountType === 'percentage' ? 'rgba(56, 189, 248, 0.1)' : 'transparent', color: discountType === 'percentage' ? '#38bdf8' : '#94a3b8' }}>{t.discountPercentage}</button>
                    </div>
                    <input
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(Number(e.target.value))}
                        className="glass"
                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', textAlign: 'center', fontSize: '18px', fontWeight: '700' }}
                    />
                </div>

                <div style={{ marginTop: 'auto', background: '#0f172a', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#94a3b8', fontSize: '14px' }}>
                        <span>{t.subtotal}</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#94a3b8', fontSize: '14px' }}>
                        <span>{t.tax}</span>
                        <span>{formatCurrency(tax)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <span style={{ fontWeight: '700' }}>{t.totalFinal}</span>
                        <span style={{ fontSize: '24px', fontWeight: '800', color: '#22c55e' }}>{formatCurrency(total)}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handleSave} className="glass sidebar-active" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: 'none' }}>
                        <FileText size={18} /> {t.save} {t.newInvoiceShort}
                    </button>
                    <button onClick={() => window.print()} className="glass" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', cursor: 'pointer', border: 'none' }}>
                        <Printer size={18} /> {t.printing} (Native)
                    </button>
                    <button onClick={() => {
                        generateInvoicePDF({
                            id: initialData ? initialData.id : `INV-${Date.now()}`,
                            client: 'مؤسسة التقنية الحديثة', // From props or state
                            date: date,
                            status: 'Draft',
                            items: items,
                            subtotal: subtotal,
                            tax: tax,
                            discount: discount,
                            total: total
                        }, t);
                    }} className="glass" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', cursor: 'pointer', border: 'none' }}>
                        <Download size={18} /> PDF
                    </button>
                    <div style={{ flex: 1 }}></div>
                    <div style={{ color: '#94a3b8', fontSize: '12px', textAlign: 'right' }}>
                        INV-798676
                    </div>
                </div>

                <div className="glass" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', background: 'rgba(255,255,255,0.02)' }}>
                            <Search size={18} color="#94a3b8" />
                            <input
                                placeholder={t.searchProduct}
                                style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontSize: '14px' }}
                            />
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
                            <thead style={{ background: 'rgba(255,255,255,0.01)', color: '#94a3b8', fontSize: '13px' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px', width: '50px' }}>#</th>
                                    <th style={{ padding: '16px 24px' }}>{t.product}</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'center' }}>{t.quantity}</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'center' }}>{t.price}</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'center' }}>{t.amount}</th>
                                    <th style={{ padding: '16px 24px', width: '50px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={item.id} className="glass-hover" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '20px 24px', color: '#94a3b8' }}>{index + 1}</td>
                                        <td style={{ padding: '20px 24px', fontWeight: '600' }}>{item.name}</td>
                                        <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '6px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                                {item.qty}
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                                            <div style={{ display: 'inline-flex', padding: '6px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', color: '#94a3b8' }}>
                                                {formatCurrency(item.price)}
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px', textAlign: 'center', fontWeight: '700', color: '#38bdf8' }}>
                                            {formatCurrency(item.total)}
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <button onClick={() => removeItem(item.id)} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                                                <X size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PurchaseInvoiceView = ({ t, isRtl, onSave, initialData }) => {
    const [items, setItems] = useState(initialData ? [
        { id: 1, name: 'Produit Fournisseur', qty: 10, price: parseInt(initialData.amount.replace(/\D/g, '')) / 10, total: parseInt(initialData.amount.replace(/\D/g, '')) }
    ] : [
        { id: 1, name: 'Composants PC', qty: 5, price: 3000, total: 15000 },
    ]);
    const [date, setDate] = useState(initialData ? initialData.date.replace(/\//g, '-') : new Date().toISOString().split('T')[0]);
    const [paymentMethod, setPaymentMethod] = useState('deferred');

    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    const removeItem = (id) => setItems(items.filter(item => item.id !== id));

    const handleSave = () => {
        const newInvoice = {
            id: initialData ? initialData.id : `PUR-${Date.now()}`,
            supplier: 'Tech Supply Co',
            date: date,
            status: 'Payé',
            amount: total.toLocaleString()
        };
        onSave(newInvoice);
    };

    return (
        <div style={{ display: 'flex', gap: '24px', height: 'calc(100vh - 120px)' }}>
            <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="glass" style={{ padding: '24px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={18} color="#10b981" /> {t.supplier}
                    </h3>
                    <FormInput label={t.supplierName} type="select" options={[{ label: 'Tech Supply Co', value: '1' }]} isRtl={isRtl} />
                    <FormInput label={t.date} type="date" value={date} onChange={(val) => setDate(val)} isRtl={isRtl} />
                </div>

                <div className="glass" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>{t.paymentMethod}</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {[{ id: 'cash', label: t.cashPayment }, { id: 'deferred', label: t.deferredPayment }].map(m => (
                            <button key={m.id} onClick={() => setPaymentMethod(m.id)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: paymentMethod === m.id ? '#10b981' : 'rgba(255,255,255,0.05)', color: paymentMethod === m.id ? 'white' : '#94a3b8', cursor: 'pointer' }}>{m.label}</button>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: 'auto', background: '#064e3b', borderRadius: '16px', padding: '24px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '700' }}>{t.totalFinal}</span>
                        <span style={{ fontSize: '24px', fontWeight: '800', color: '#34d399' }}>{formatCurrency(total)}</span>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handleSave} className="glass sidebar-active" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: 'none', background: '#10b981' }}>
                        <FileText size={18} /> {t.save} {t.newPurchase}
                    </button>
                    <button onClick={() => window.print()} className="glass" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', cursor: 'pointer', border: 'none' }}>
                        <Printer size={18} /> {t.printing} (Native)
                    </button>
                    <button onClick={() => {
                        generateInvoicePDF({
                            id: initialData ? initialData.id : `PUR-${Date.now()}`,
                            client: 'Tech Supply Co', // Supplier name
                            date: date,
                            status: 'Paid',
                            items: items,
                            subtotal: subtotal,
                            tax: tax,
                            total: total
                        }, t);
                    }} className="glass" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', cursor: 'pointer', border: 'none' }}>
                        <Download size={18} /> PDF
                    </button>
                    <div style={{ flex: 1 }}></div>
                </div>

                <div className="glass" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', background: 'rgba(255,255,255,0.02)' }}>
                            <Search size={18} color="#94a3b8" />
                            <input placeholder={t.searchProduct} style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontSize: '14px' }} />
                        </div>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
                            <thead style={{ background: 'rgba(255,255,255,0.01)', color: '#94a3b8', fontSize: '13px' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px' }}>#</th>
                                    <th style={{ padding: '16px 24px' }}>{t.product}</th>
                                    <th style={{ padding: '16px 24px' }}>{t.quantity}</th>
                                    <th style={{ padding: '16px 24px' }}>{t.totalFinal}</th>
                                    <th style={{ padding: '16px 24px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, i) => (
                                    <tr key={i} className="glass-hover" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '20px 24px' }}>{i + 1}</td>
                                        <td style={{ padding: '20px 24px' }}>{item.name}</td>
                                        <td style={{ padding: '20px 24px' }}>{item.qty}</td>
                                        <td style={{ padding: '20px 24px', color: '#10b981', fontWeight: '700' }}>{item.total.toLocaleString()}</td>
                                        <td style={{ padding: '20px 24px' }}><button onClick={() => removeItem(item.id)} style={{ color: '#ef4444', background: 'transparent', border: 'none' }}><X size={18} /></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TreasuryView = ({ t, isRtl, transactions, onAdd, accounts, onDelete, onEdit }) => {
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
                    { label: t.cashIn, value: formatCurrency(1250000), color: '#22c55e' },
                    { label: t.cashOut, value: formatCurrency(450000), color: '#ef4444' },
                    { label: t.balance, value: formatCurrency(800000), color: '#38bdf8' }
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
                    amount: tr.anim
                }))}
                t={t}
                isRtl={isRtl}
                t={t}
                isRtl={isRtl}
                onDelete={onDelete}
                onView={onEdit}
            />
        </div>
    );
};

const ChartOfAccountsView = ({ t, isRtl, onAdd, accounts, onDelete }) => {
    return (
        <TableView
            title={t.chartOfAccounts}
            subtitle="Structure financière et plan comptable de l'entreprise"
            buttonLabel={t.addAccount}
            onAdd={onAdd}
            headers={[t.accountCode, t.accountName, t.accountType, t.balance]}
            data={accounts.map(acc => ({
                code: acc.code,
                name: acc.parent ? (isRtl ? `__ ${acc.name}` : `\u00A0\u00A0\u00A0\u00A0${acc.name}`) : acc.name, // Indent children
                type: acc.type,
                balance: `EGP ${parseInt(acc.balance).toLocaleString()}`
            }))}
            t={t}
            isRtl={isRtl}
            onDelete={onDelete}
        />
    );
};

const CustomersSuppliersView = ({ t, isRtl, contacts, onAdd, onEdit, onDelete, onViewStatement }) => {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredContacts = contacts.filter(c => {
        const matchesFilter = filter === 'all' || c.type === filter;
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.phone && c.phone.includes(searchTerm));
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
                            <span style={{ fontWeight: '800', fontSize: '16px', color: contact.balance.includes('-') ? '#ef4444' : '#22c55e' }}>{contact.balance}</span>
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

// --- App ---

const App = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [salesView, setSalesView] = useState('list');
    const [purchasesView, setPurchasesView] = useState('list');
    const [customersView, setCustomersView] = useState('list'); // 'list' or 'statement'
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const [lang, setLang] = useState('fr');
    const [modalType, setModalType] = useState(null);

    const t = translations[lang];
    const isRtl = lang === 'ar';

    const [sales, setSales] = useState([
        { id: 'INV-1769196812581', client: 'مؤسسة التقنية الحديثة', date: '2026/01/23', status: 'Payé', amount: '33,350' },
        { id: 'INV-1768905734828', client: 'مؤسسة التقنية الحديثة', date: '2026/01/20', status: 'Payé', amount: '59,800' }
    ]);
    const [purchases, setPurchases] = useState([
        { id: 'PUR-2024-101', supplier: 'Tech Supply Co', date: '2024/03/18', status: 'Payé', amount: '15,000' },
        { id: 'PUR-2024-102', supplier: 'Global Parts', date: '2024/03/22', status: 'En attente', amount: '8,400' }
    ]);
    const [treasury, setTreasury] = useState([{ id: 'TRE-INIT-1', date: '2024-03-22', desc: 'Office Rent', type: 'Cash Out', method: 'Cash', anim: 'EGP 500.00' }]);
    const [customers, setCustomers] = useState([
        { name: 'John Doe', type: 'client', email: 'john@alpha.com', balance: 'EGP 1,200.00', phone: '0501234567', location: 'Riyadh' },
        { name: 'Tech Supply Co', type: 'supplier', email: 'sales@techsupply.com', balance: '- EGP 15,000.00', phone: '0559876543', location: 'Jeddah' }
    ]);
    const [inventory, setInventory] = useState([
        { code: 'PRD-001', name: 'MacBook Pro M3', category: 'Laptops', stock: 12, buyPrice: '45,000', sellPrice: '52,000' },
        { code: 'PRD-002', name: 'iPhone 15 Pro', category: 'Phones', stock: 3, buyPrice: '35,000', sellPrice: '42,000' }
    ]);
    const [accounts, setAccounts] = useState(initialAccounts);

    const [invForm, setInvForm] = useState({ client: '', amount: '', date: new Date().toISOString().split('T')[0] });
    const [transForm, setTransForm] = useState({ id: null, desc: '', amount: '', type: 'In', method: 'Cash', accountId: '' });
    const [productForm, setProductForm] = useState({ name: '', code: `PRD-${Math.floor(Math.random() * 1000)}`, barcode: '', category: '', unit: 'Piece', buy: '', sell: '', stock: '', minLimit: 5 });
    const [contactForm, setContactForm] = useState({ name: '', type: 'client', email: '', balance: '', phone: '', address: '', taxNumber: '' });
    const [accountForm, setAccountForm] = useState({ code: '', name: '', type: 'Asset', parent: '', balance: '0' });

    useEffect(() => { document.body.dir = isRtl ? 'rtl' : 'ltr'; }, [isRtl]);

    const handleAddSale = () => {
        setSales([{ id: `INV-2024-${sales.length + 100}`, client: invForm.client, date: invForm.date, amount: `EGP ${invForm.amount}`, status: 'Pending' }, ...sales]);
        setModalType(null);
    };

    const handleAddPurchase = () => {
        setPurchases([{ id: `PUR-2024-${purchases.length + 100}`, supplier: invForm.client, date: invForm.date, amount: `EGP ${invForm.amount}`, status: 'Paid' }, ...purchases]);
        setModalType(null);
    };

    const handleAddTrans = () => {
        if (transForm.id) {
            setTreasury(treasury.map(tr => tr.id === transForm.id ? {
                ...tr,
                desc: transForm.desc,
                type: transForm.type === 'In' ? t.cashIn : t.cashOut,
                method: transForm.method,
                anim: `EGP ${transForm.amount}`,
                accountId: transForm.accountId
            } : tr));
        } else {
            setTreasury([{
                id: `TRE-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                desc: transForm.desc,
                type: transForm.type === 'In' ? t.cashIn : t.cashOut,
                method: transForm.method,
                anim: `EGP ${transForm.amount}`,
                accountId: transForm.accountId
            }, ...treasury]);
        }
        setModalType(null);
    };

    const handleAddProduct = () => {
        setInventory([{ name: productForm.name, category: productForm.category, stock: parseInt(productForm.stock || 0), buyPrice: productForm.buy, sellPrice: productForm.sell }, ...inventory]);
        setModalType(null);
    };

    const handleAddContact = () => {
        setCustomers([{
            name: contactForm.name,
            type: contactForm.type,
            email: contactForm.email,
            balance: `EGP ${contactForm.balance}`,
            phone: contactForm.phone,
            location: contactForm.address,
            taxNumber: contactForm.taxNumber
        }, ...customers]);
        setModalType(null);
    };

    const handleAddAccount = () => {
        setAccounts([...accounts, { ...accountForm }]);
        setModalType(null);
    };

    return (
        <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', direction: isRtl ? 'rtl' : 'ltr' }}>
            <div className="blob blob-1"></div><div className="blob blob-2"></div><div className="blob blob-3"></div>

            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} t={t} isRtl={isRtl} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Header lang={lang} setLang={setLang} t={t} isRtl={isRtl} />

                <main style={{ flex: 1, padding: '0 32px 32px 32px', overflowY: 'auto' }}>
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                            {activeTab === 'dashboard' && <DashboardView t={t} isRtl={isRtl} onAddInvoice={() => setModalType('sale')} invoices={sales} customers={customers} expenses={[]} activities={[]} />}

                            {activeTab === 'sales' && (
                                salesView === 'list' ? (
                                    <TableView
                                        title={t.sales}
                                        subtitle={t.salesSubtitle}
                                        buttonLabel={t.newInvoiceShort}
                                        onAdd={() => { setSelectedInvoice(null); setSalesView('create'); }}
                                        headers={[t.invoiceId, t.client, t.date, t.status, t.amount]}
                                        data={sales}
                                        t={t}
                                        isRtl={isRtl}
                                        onView={(invoice) => {
                                            setSelectedInvoice(invoice);
                                            setSalesView('create');
                                        }}
                                        onDelete={(invoice) => setSales(sales.filter(s => s.id !== invoice.id))}
                                    />
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <button onClick={() => setSalesView('list')} style={{ alignSelf: 'start', background: 'transparent', color: '#38bdf8', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>← {t.previous}</button>
                                        <SalesInvoiceView
                                            t={t}
                                            isRtl={isRtl}
                                            initialData={selectedInvoice}
                                            onSave={(newInvoice) => {
                                                if (selectedInvoice) {
                                                    setSales(sales.map(s => s.id === newInvoice.id ? newInvoice : s));
                                                } else {
                                                    setSales([newInvoice, ...sales]);
                                                }
                                                setSalesView('list');
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
                                        data={purchases}
                                        t={t}
                                        isRtl={isRtl}
                                        onView={(purchase) => {
                                            setSelectedPurchase(purchase);
                                            setPurchasesView('create');
                                        }}
                                        onDelete={(purchase) => setPurchases(purchases.filter(p => p.id !== purchase.id))}
                                    />
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <button onClick={() => setPurchasesView('list')} style={{ alignSelf: 'start', background: 'transparent', color: '#38bdf8', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>← {t.previous}</button>
                                        <PurchaseInvoiceView
                                            t={t}
                                            isRtl={isRtl}
                                            initialData={selectedPurchase}
                                            onSave={(newPurchase) => {
                                                if (selectedPurchase) {
                                                    setPurchases(purchases.map(p => p.id === newPurchase.id ? newPurchase : p));
                                                } else {
                                                    setPurchases([newPurchase, ...purchases]);
                                                }
                                                setPurchasesView('list');
                                            }}
                                        />
                                    </div>
                                )
                            )}

                            {activeTab === 'treasury' && (
                                <TreasuryView
                                    t={t}
                                    isRtl={isRtl}
                                    transactions={treasury}
                                    accounts={accounts}
                                    onAdd={() => {
                                        setTransForm({ id: null, desc: '', amount: '', type: 'In', method: 'Cash', accountId: '' });
                                        setModalType('transaction');
                                    }}
                                    onDelete={(tr) => setTreasury(treasury.filter(item => item.id !== tr.id))}
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

                            {activeTab === 'inventory' && <InventoryView t={t} isRtl={isRtl} inventory={inventory} onAdd={() => setModalType('addProduct')} />}
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
                                        onDelete={(contact) => setCustomers(customers.filter(c => c.name !== contact.name))}
                                        onViewStatement={(contact) => { setSelectedContact(contact); setCustomersView('statement'); }}
                                    />
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <button onClick={() => setCustomersView('list')} style={{ alignSelf: 'start', background: 'transparent', color: '#38bdf8', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>← {t.previous}</button>
                                        <AccountStatementView t={t} isRtl={isRtl} contact={selectedContact} />
                                    </div>
                                )
                            )}

                            {activeTab === 'reports' && <ReportsView t={t} isRtl={isRtl} />}
                            {activeTab === 'settings' && <SettingsView t={t} isRtl={isRtl} />}
                            {activeTab === 'chart' && (
                                <ChartOfAccountsView
                                    t={t}
                                    isRtl={isRtl}
                                    onAdd={() => { setAccountForm({ code: '', name: '', type: 'Asset', parent: '', balance: '0' }); setModalType('addAccount'); }}
                                    accounts={accounts}
                                    onDelete={(acc) => setAccounts(accounts.filter(a => a.code !== acc.code))}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            <Modal isOpen={!!modalType} onClose={() => setModalType(null)} title={t[modalType] || t.save} isRtl={isRtl}>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <FormInput half label={t.accountCode} placeholder="1101" value={accountForm.code} onChange={v => setAccountForm({ ...accountForm, code: v })} isRtl={isRtl} />
                            <FormInput half label={t.classification} type="select" options={[{ label: t.assets, value: 'Asset' }, { label: t.liabilities, value: 'Liability' }, { label: 'Equity', value: 'Equity' }, { label: 'Revenue', value: 'Revenue' }, { label: 'Expense', value: 'Expense' }]} value={accountForm.type} onChange={v => setAccountForm({ ...accountForm, type: v })} isRtl={isRtl} />
                        </div>
                        <FormInput label={t.accountName} value={accountForm.name} onChange={v => setAccountForm({ ...accountForm, name: v })} isRtl={isRtl} />
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <FormInput half label={t.accountFather} type="select" options={[{ label: '-- None --', value: '' }, ...accounts.map(a => ({ label: `${a.code} - ${a.name}`, value: a.code }))]} value={accountForm.parent} onChange={v => setAccountForm({ ...accountForm, parent: v })} isRtl={isRtl} />
                            <FormInput half label={t.openingBalance} placeholder="0" type="number" value={accountForm.balance} onChange={v => setAccountForm({ ...accountForm, balance: v })} isRtl={isRtl} />
                        </div>
                        <FormInput label={t.description} isRtl={isRtl} />
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
                            <input type="checkbox" id="activeAccount" checked style={{ width: '18px', height: '18px' }} />
                            <label htmlFor="activeAccount" style={{ fontSize: '14px' }}>{t.activeAccount}</label>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={handleAddAccount} style={{ flex: 1, background: '#38bdf8', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>{t.save}</button>
                            <button onClick={() => setModalType(null)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white', padding: '14px', borderRadius: '12px', border: 'none' }}>{t.cancel}</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

// Supporting Components (Header, StatCard, etc from previous version)
const Header = ({ lang, setLang, t, isRtl }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', marginBottom: '16px' }}>
        <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', width: '350px' }}>
            <Search size={18} color="#94a3b8" />
            <input placeholder={t.searchPlaceholder} style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => setLang(lang === 'en' ? 'ar' : lang === 'ar' ? 'fr' : 'en')} className="glass" style={{ padding: '8px 16px', color: '#38bdf8', fontWeight: '700' }}>{t.languageName}</button>
            <Bell className="text-gray-400" size={20} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ textAlign: isRtl ? 'left' : 'right' }}><p style={{ fontWeight: '700', fontSize: '13px' }}>Ilyas Accountant</p><p style={{ fontSize: '11px', color: '#94a3b8' }}>{t.admin}</p></div>
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

const DashboardView = ({ t, isRtl, onAddInvoice, invoices, customers }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
            <StatCard index={0} title={t.totalRevenue} value="EGP 1,240,000" change="+12%" trend="up" icon={TrendingUp} />
            <StatCard index={1} title={t.purchases} value="EGP 450,000" change="+5%" trend="down" icon={ShoppingCart} />
            <StatCard index={2} title={t.customersSuppliers} value={customers.length} change="+8%" trend="up" icon={Users} />
            <StatCard index={3} title={t.netProfit} value="EGP 790,000" change="+15%" trend="up" icon={ArrowUpRight} />
        </div>
        <div className="glass" style={{ padding: '24px', height: '350px' }}>
            <h3 style={{ marginBottom: '20px' }}>{t.revenueAnalytics}</h3>
            <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={[{ name: 'Jan', v: 4000 }, { name: 'Feb', v: 3000 }, { name: 'Mar', v: 5000 }, { name: 'Apr', v: 2780 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Area type="monotone" dataKey="v" stroke="#38bdf8" fill="rgba(56, 189, 248, 0.2)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
);

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
                    <p style={{ fontWeight: '800', fontSize: '20px', color: '#22c55e' }}>93,150 EGP</p>
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

const ReportsView = ({ t, isRtl }) => {
    const [activeSubTab, setActiveSubTab] = useState('balanceSheet');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '700' }}>{t.financialReports}</h2>
                    <p style={{ color: '#94a3b8', fontSize: '14px' }}>Analyze your financial health</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => {
                        const title = t[activeSubTab] || "Financial Report";
                        // Mock data matching the view
                        let headers = ["Item", "Example Value"];
                        let data = [
                            ["Example Row 1", "10,000"],
                            ["Example Row 2", "5,000"]
                        ];

                        // Customize based on tab (Simple implementation for now)
                        if (activeSubTab === 'balanceSheet') {
                            headers = [t.assets || "Assets", "Amount"];
                            data = [
                                [t.stock, "502,500"],
                                [t.cash, "15,000"],
                                ["Total Assets", "517,500"],
                                ["", ""],
                                [t.liabilities || "Liabilities", "Amount"],
                                [t.customersSuppliers, "250,000"],
                                [t.netProfit, "89,125"],
                                ["Total Liabilities", "339,125"]
                            ];
                        } else if (activeSubTab === 'incomeStatement') {
                            headers = ["Item", "Amount"];
                            data = [
                                [t.revenue, "93,150 EGP"],
                                [t.costOfSales, "4,025 EGP"],
                                [t.netProfit, "89,125 EGP"]
                            ];
                        }

                        generateReportPDF(title, headers, data, t);
                    }} className="glass" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: 'none', color: '#38bdf8' }}><Download size={18} /> {t.downloadPDF}</button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                {['trialBalance', 'incomeStatement', 'balanceSheet', 'salesReport', 'purchaseReport'].map(tab => (
                    <button key={tab} onClick={() => setActiveSubTab(tab)} style={{ padding: '8px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap', background: activeSubTab === tab ? '#38bdf8' : 'rgba(255,255,255,0.03)', color: activeSubTab === tab ? 'white' : '#94a3b8' }}>{t[tab]}</button>
                ))}
            </div>

            <div className="glass" style={{ padding: '24px' }}>
                {activeSubTab === 'balanceSheet' && (
                    <div style={{ display: 'flex', gap: '40px' }}>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ color: '#38bdf8', marginBottom: '16px' }}>{t.assets}</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}><span>{t.stock}</span><span style={{ fontWeight: '700' }}>502,500</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}><span>{t.cash}</span><span style={{ fontWeight: '700' }}>15,000</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px', marginTop: '16px' }}><strong>{t.totalAssets}</strong><strong>517,500</strong></div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ color: '#ef4444', marginBottom: '16px' }}>{t.liabilities}</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}><span>{t.customersSuppliers}</span><span style={{ fontWeight: '700' }}>250,000</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}><span>{t.netProfit}</span><span style={{ fontWeight: '700', color: '#22c55e' }}>89,125</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', marginTop: '16px' }}><strong>{t.totalLiabilities}</strong><strong>339,125</strong></div>
                        </div>
                    </div>
                )}
                {activeSubTab === 'incomeStatement' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px' }}><span>{t.revenue}</span><strong style={{ fontSize: '20px', color: '#22c55e' }}>93,150 EGP</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px' }}><span>{t.costOfSales}</span><strong style={{ fontSize: '20px', color: '#ef4444' }}>4,025 EGP</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px' }}><span>{t.netProfit}</span><strong style={{ fontSize: '20px', color: '#38bdf8' }}>89,125 EGP</strong></div>
                    </div>
                )}
            </div>
        </div>
    );
};

const SettingsView = ({ t, isRtl }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
                <h2 style={{ fontSize: '24px', fontWeight: '700' }}>{t.settings}</h2>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>Manage your application preferences</p>
            </div>

            <div className="glass" style={{ padding: '24px', maxWidth: '600px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>General Settings</h3>
                <FormInput label="Company Name" value="Ilyas Accountant" onChange={() => { }} isRtl={isRtl} />
                <FormInput label="Email" value="admin@ilyas.com" onChange={() => { }} isRtl={isRtl} />
                <div style={{ display: 'flex', gap: '20px' }}>
                    <FormInput half label="Currency" value="EGP" onChange={() => { }} isRtl={isRtl} />
                    <FormInput half label="Language" type="select" options={[{ label: 'English', value: 'en' }, { label: 'Français', value: 'fr' }, { label: 'العربية', value: 'ar' }]} isRtl={isRtl} />
                </div>
                <button className="glass sidebar-active" style={{ padding: '12px 24px', border: 'none', cursor: 'pointer', fontWeight: '700', marginTop: '12px' }}>{t.save}</button>
            </div>
        </div>
    );
};

// --- End of App ---

export default App;
