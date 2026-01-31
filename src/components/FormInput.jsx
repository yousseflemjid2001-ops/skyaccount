import React from 'react';

const FormInput = ({ label, value, onChange, placeholder, type = "text", isRtl, half, options }) => (
    <div style={{ marginBottom: '20px', flex: half ? '1' : 'none' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#cbd5e1', marginBottom: '8px' }}>{label}</label>
        {type === 'select' ? (
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="glass"
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', outline: 'none', appearance: 'none' }}
            >
                {options && options.map(opt => <option key={opt.value} value={opt.value} style={{ background: '#1e293b' }}>{opt.label}</option>)}
            </select>
        ) : (
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="glass"
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', outline: 'none', textAlign: isRtl ? 'right' : 'left', fontSize: '15px', fontWeight: '500' }}
            />
        )}
    </div>
);

export default FormInput;
