import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Tag, Copy, Check, Sparkles, Percent } from 'lucide-react';
import './CouponBar.css';

export const CouponBar = () => {
  const { coupons } = useStore();
  const [copiedCode, setCopiedCode] = useState(null);

  const activeCoupons = coupons ? coupons.filter(c => c.isActive) : [];

  const handleCopyCode = (code, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  if (activeCoupons.length === 0) return null;

  // Duplicate items 4x for continuous seamless infinite loop roller
  const rollerItems = [...activeCoupons, ...activeCoupons, ...activeCoupons, ...activeCoupons];

  return (
    <div className="coupon-roller-section">
      <div className="coupon-roller-container">
        <div className="coupon-roller-track">
          {rollerItems.map((coupon, idx) => (
            <div key={`${coupon.code}-${idx}`} className="coupon-roller-card">
              <div className="roller-discount-tag">
                {coupon.type === 'PERCENT' ? <Percent size={13} /> : <Tag size={13} />}
                <span>{coupon.type === 'PERCENT' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}</span>
              </div>

              <div className="roller-code-pill">
                <span className="roller-code">{coupon.code}</span>
                <button
                  className={`btn-roller-copy ${copiedCode === coupon.code ? 'copied' : ''}`}
                  onClick={(e) => handleCopyCode(coupon.code, e)}
                  title="Copy code to clipboard"
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check size={12} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <span className="roller-desc">
                {coupon.description || `Min Order ₹${coupon.minOrder}`}
              </span>

              <div className="roller-divider"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
