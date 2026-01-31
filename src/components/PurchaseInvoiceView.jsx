import React, { useState } from 'react';
import { Users, CreditCard, Search, X, FileText, Printer, Download } from 'lucide-react';
import FormInput from './FormInput';
import { formatCurrency } from '../utils/formatCurrency';
import { generateInvoicePDF } from '../utils/pdfUtils';

const PurchaseInvoiceView = ({ t, isRtl, onSave, initialData, inventory, customers, settings }) => {
    const [items, setItems] = useState(initialData ? initialData.items || [] : []);
    const [date, setDate] = useState(initialData?.date ? initialData.date.replace(/\//g, '-') : new Date().toISOString().split('T')[0]);
    const [paymentMethod, setPaymentMethod] = useState('deferred');
    const suppliers = customers ? customers.filter(c => c && c.type === 'supplier') : [];
    const [selectedSupplier, setSelectedSupplier] = useState(initialData?.supplier || (suppliers.length > 0 ? suppliers[0].name : ''));

    // Product Search State
    const [itemSearch, setItemSearch] = useState('');
    const [showResults, setShowResults] = useState(false);

    // Filter inventory based on search
    const filteredProducts = inventory ? inventory.filter(p => {
        const name = p?.name?.toLowerCase() || '';
        const code = p?.code?.toLowerCase() || '';
        const search = itemSearch.toLowerCase();
        return name.includes(search) || code.includes(search);
    }) : [];

    const addItem = (product) => {
        const existingItem = items.find(i => i.code === product.code);
        if (existingItem) {
            setItems(items.map(i => i.code === product.code ? { ...i, qty: i.qty + 1, total: (i.qty + 1) * i.price } : i));
        } else {
            // Use buyPrice for purchases, sanitize input
            const price = typeof product.buyPrice === 'number' ? product.buyPrice : (parseFloat(String(product.buyPrice || '0').replace(/[^0-9.-]+/g, '')) || 0);
            setItems([...items, {
                id: Date.now(),
                code: product.code,
                name: product.name,
                qty: 1,
                price: price,
                total: price
            }]);
        }
        setItemSearch('');
        setShowResults(false);
    };

    const updateQty = (id, newQty) => {
        if (newQty < 1) return;
        setItems(items.map(item => item.id === id ? { ...item, qty: newQty, total: newQty * item.price } : item));
    };

    const removeItem = (id) => setItems(items.filter(item => item.id !== id));

    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    const handleSave = () => {
        try {
            if (items.length === 0) {
                alert(t.addProductsError || "Please add products to the invoice");
                return;
            }

            const newInvoice = {
                id: initialData ? initialData.id : `PUR-${Date.now()}`,
                supplier: selectedSupplier,
                date: date,
                status: 'Payé',
                amount: formatCurrency(total),
                items: items,
                paymentMethod: paymentMethod
            };
            onSave(newInvoice);
            alert(t.saveChanges || t.save || "Purchase saved!");
        } catch (err) {
            console.error("Save error:", err);
            alert("Error saving purchase.");
        }
    };

    if (!t) return null;

    return (
        <div className="invoice-container" style={{ display: 'flex', gap: '24px', height: 'calc(100vh - 120px)' }}>
            <div className="invoice-details" style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="glass" style={{ padding: '24px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={18} color="#38bdf8" /> {t.supplier}
                    </h3>
                    <FormInput
                        label={t.supplierName}
                        type="select"
                        options={suppliers.map(s => ({ label: s.name, value: s.name }))}
                        value={selectedSupplier}
                        onChange={setSelectedSupplier}
                        isRtl={isRtl}
                    />
                    <FormInput label={t.date} type="date" value={date} onChange={(val) => setDate(val)} isRtl={isRtl} />
                </div>

                <div className="glass no-print" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>{t.paymentMethod}</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {[{ id: 'cash', label: t.cashPayment }, { id: 'deferred', label: t.deferredPayment }].map(m => (
                            <button key={m.id} onClick={() => setPaymentMethod(m.id)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: paymentMethod === m.id ? '#38bdf8' : 'rgba(255,255,255,0.05)', color: paymentMethod === m.id ? 'white' : '#94a3b8', cursor: 'pointer' }}>{m.label}</button>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: 'auto', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '700' }}>{t.totalFinal}</span>
                        <span style={{ fontSize: '24px', fontWeight: '800', color: '#38bdf8' }}>{formatCurrency(total, settings.currency)}</span>
                    </div>
                </div>
            </div>

            <div className="invoice-items" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="no-print" style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handleSave} style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: 'none', background: 'var(--accent-primary)', color: 'white', borderRadius: '12px', fontWeight: '700' }}>
                        <FileText size={18} /> {t.save} {t.newPurchase}
                    </button>
                    <button onClick={() => window.print()} className="glass" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', cursor: 'pointer', border: '1px solid rgba(56, 189, 248, 0.3)', background: 'rgba(56, 189, 248, 0.1)' }}>
                        <Printer size={18} /> {t.printing} (Native)
                    </button>
                    <button onClick={() => {
                        generateInvoicePDF({
                            id: initialData ? initialData.id : `PUR-${Date.now()}`,
                            client: selectedSupplier, // Supplier name
                            date: date,
                            status: 'Paid',
                            items: items,
                            subtotal: subtotal,
                            tax: tax,
                            total: total
                        }, t, settings);
                    }} className="glass" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', cursor: 'pointer', border: 'none' }}>
                        <Download size={18} /> PDF
                    </button>
                    <div style={{ flex: 1 }}></div>
                </div>

                <div className="glass" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div className="no-print" style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                        <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', background: 'rgba(255,255,255,0.02)' }}>
                            <Search size={18} color="#94a3b8" />
                            <input
                                placeholder={t.searchProduct || "Search Product..."}
                                value={itemSearch}
                                onChange={(e) => {
                                    setItemSearch(e.target.value);
                                    setShowResults(true);
                                }}
                                onFocus={() => setShowResults(true)}
                                style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontSize: '14px' }}
                            />
                        </div>
                        {/* Search Results Dropdown */}
                        {showResults && itemSearch && (
                            <div className="glass" style={{
                                position: 'absolute', top: '100%', left: '20px', right: '20px',
                                background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
                                maxHeight: '300px', overflowY: 'auto', zIndex: 50, borderRadius: '12px', marginTop: '8px'
                            }}>
                                {filteredProducts.map(p => (
                                    <div
                                        key={p.code}
                                        onClick={() => addItem(p)}
                                        className="glass-hover"
                                        style={{ padding: '12px 20px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{p.name}</div>
                                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>{p.code} | Stock: {p.stock}</div>
                                        </div>
                                        <div style={{ color: '#38bdf8' }}>{formatCurrency(p.buyPrice, settings.currency)}</div>
                                    </div>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>No products found</div>
                                )}
                            </div>
                        )}
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
                            <thead style={{ background: 'rgba(255,255,255,0.01)', color: '#94a3b8', fontSize: '13px' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px' }}>#</th>
                                    <th style={{ padding: '16px 24px' }}>{t.product}</th>
                                    <th style={{ padding: '16px 24px' }}>{t.quantity}</th>
                                    <th style={{ padding: '16px 24px' }}>{t.totalFinal}</th>
                                    <th className="no-print" style={{ padding: '16px 24px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, i) => (
                                    <tr key={item.id} className="glass-hover" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '20px 24px' }}>{i + 1}</td>
                                        <td style={{ padding: '20px 24px' }}>
                                            {item.name}
                                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{item.code}</div>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '6px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                                <button className="no-print" onClick={() => updateQty(item.id, item.qty - 1)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>-</button>
                                                <span>{item.qty}</span>
                                                <button className="no-print" onClick={() => updateQty(item.id, item.qty + 1)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>+</button>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px', color: '#38bdf8', fontWeight: '700' }}>{formatCurrency(item.total, settings.currency)}</td>
                                        <td className="no-print" style={{ padding: '20px 24px' }}><button onClick={() => removeItem(item.id)} style={{ color: '#ef4444', background: 'transparent', border: 'none' }}><X size={18} /></button></td>
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

export default PurchaseInvoiceView;
