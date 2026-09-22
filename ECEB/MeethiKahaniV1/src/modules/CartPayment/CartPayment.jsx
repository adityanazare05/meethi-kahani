import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ShoppingBag, X, Trash2, Check, ArrowRight, Lock, 
  CreditCard, QrCode, Gift, Tag, Sparkles, Plus, Truck, AlertCircle,
  User, Phone, Mail, MapPin, CheckCircle2, ShieldCheck, ArrowLeft, Loader2,
  TrendingUp, Award, Zap
} from 'lucide-react';
import './CartPayment.css';

export const CartPayment = () => {
  const {
    cookies,
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQty,
    removeFromCart,
    addToCart,
    cartSubtotal,
    coupons,
    placeOrder,
    userInfo,
    navigateTo
  } = useStore();

  // Promo Code State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Gift Card Note State
  const [isGiftOptionEnabled, setIsGiftOptionEnabled] = useState(false);
  const [giftRecipient, setGiftRecipient] = useState('');
  const [giftMessage, setGiftMessage] = useState('');

  // Dedicated Checkout Overlay State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // Customer & Shipping Form State
  const [customerName, setCustomerName] = useState(userInfo?.name || '');
  const [customerPhone, setCustomerPhone] = useState(userInfo?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(userInfo?.email || '');
  const [shippingAddress, setShippingAddress] = useState(userInfo?.defaultAddress || '');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('UPI');

  // Keep form fields synced directly with signed-in user profile
  useEffect(() => {
    if (userInfo?.name) setCustomerName(userInfo.name);
    if (userInfo?.email) {
      setCustomerEmail(userInfo.email);
      setUpiIdInput(`${userInfo.email.split('@')[0]}@okaxis`);
    }
    if (userInfo?.phone) setCustomerPhone(userInfo.phone);
    if (userInfo?.defaultAddress) setShippingAddress(userInfo.defaultAddress);
  }, [userInfo]);

  // Razorpay Gateway Simulation State
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [upiIdInput, setUpiIdInput] = useState(userInfo?.email ? `${userInfo.email.split('@')[0]}@okaxis` : 'customer@okhdfcbank');
  const [cardNumberInput, setCardNumberInput] = useState('4532 •••• •••• 8829');

  // Completed Order Receipt State
  const [completedOrder, setCompletedOrder] = useState(null);

  // Free Shipping Calculations
  const freeShippingThreshold = 499;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  // ==================== SMART AUTO-COUPON RECOMMENDATION ENGINE ====================
  const activeCouponsList = coupons ? coupons.filter(c => c.isActive) : [];

  // Find eligible coupons for current cart subtotal and compute savings
  const eligibleCouponsWithSavings = activeCouponsList
    .filter(c => cartSubtotal >= c.minOrder)
    .map(c => {
      let savings = 0;
      if (c.type === 'PERCENT') {
        savings = (cartSubtotal * c.value) / 100;
      } else if (c.type === 'FLAT') {
        savings = c.value;
      }
      return { coupon: c, savings };
    })
    .sort((a, b) => b.savings - a.savings); // Sort highest savings first

  const bestEligibleCouponObj = eligibleCouponsWithSavings.length > 0 ? eligibleCouponsWithSavings[0] : null;

  // Find upcoming coupon requiring smallest additional spend
  const upcomingCoupons = activeCouponsList
    .filter(c => cartSubtotal < c.minOrder)
    .map(c => ({ coupon: c, amountNeeded: c.minOrder - cartSubtotal }))
    .sort((a, b) => a.amountNeeded - b.amountNeeded);

  const bestUpcomingCouponObj = upcomingCoupons.length > 0 ? upcomingCoupons[0] : null;

  // Manual & Auto Coupon Apply Handlers
  const handleApplyCoupon = (codeToApply = null) => {
    setCouponError('');
    const targetCode = (codeToApply || couponCode).trim().toUpperCase();
    if (!targetCode) {
      setCouponError('Please enter a valid promo code.');
      return;
    }
    const found = coupons.find(c => c.code.toUpperCase() === targetCode && c.isActive);
    if (!found) {
      setCouponError('Invalid promo code.');
      return;
    }
    if (cartSubtotal < found.minOrder) {
      setCouponError(`Min order value for ${found.code} is ₹${found.minOrder}.`);
      return;
    }
    setCouponCode(found.code);
    setAppliedCoupon(found);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'PERCENT') {
      discountAmount = (cartSubtotal * appliedCoupon.value) / 100;
    } else if (appliedCoupon.type === 'FLAT') {
      discountAmount = appliedCoupon.value;
    }
  }

  const giftingItemsCount = cart.filter(i => i.orderType === 'GIFTING').length;
  if (giftingItemsCount > 0 && !appliedCoupon) {
    discountAmount += cartSubtotal * 0.25;
  }

  const deliveryFee = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : 60;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + deliveryFee);

  // Quick cross-sell add-ons
  const cartItemIds = new Set(cart.map(item => item.id));
  const crossSellItems = cookies.filter(c => !cartItemIds.has(c.id)).slice(0, 2);

  // Action: Open Dedicated Checkout Page and Close Cart Drawer
  const handleProceedToCheckoutPage = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false); // Close Cart Drawer completely
    setIsCheckoutOpen(true); // Open Dedicated Checkout View
  };

  // Action: Launch Real Razorpay Standard Checkout or Built-in Gateway Simulator
  const handleLaunchRazorpayGateway = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const cleanEmail = (customerEmail || '').trim().toLowerCase();
    if (!customerName.trim() || !customerPhone.trim() || !cleanEmail || !shippingAddress.trim()) {
      alert('Please fill in your full name, mobile number, email address, and delivery address.');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      alert('Please enter a valid email address to receive your order confirmation receipt and Kisse Coins.');
      return;
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
    const isRealRazorpay = razorpayKey && razorpayKey.startsWith('rzp_') && !razorpayKey.includes('your_key_id');

    // If real Razorpay key is present and Razorpay JS SDK is loaded
    if (isRealRazorpay && window.Razorpay) {
      const options = {
        key: razorpayKey,
        amount: Math.round(finalTotal * 100), // Amount in paise
        currency: 'INR',
        name: 'Meethi Kahani',
        description: '100% Pure Eggless Artisanal Cookies',
        image: '/logo-cream.png',
        handler: function (response) {
          // Payment Success Callback
          const newOrder = placeOrder({
            customerName: customerName.trim(),
            phone: customerPhone.trim(),
            email: cleanEmail,
            customerEmail: cleanEmail,
            address: shippingAddress.trim(),
            subtotal: cartSubtotal,
            discount: discountAmount,
            totalAmount: finalTotal,
            paymentMode: selectedPaymentMode,
            paymentId: response.razorpay_payment_id,
            orderType: (giftingItemsCount > 0 || isGiftOptionEnabled) ? 'GIFTING' : 'PERSONAL',
            giftDetails: isGiftOptionEnabled ? { recipient: giftRecipient, message: giftMessage } : null
          });

          setIsCheckoutOpen(false);
          setCompletedOrder(newOrder);
        },
        prefill: {
          name: customerName.trim(),
          email: cleanEmail,
          contact: customerPhone.replace(/\D/g, '')
        },
        theme: {
          color: '#97201F' // Crimson Red
        }
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on('payment.failed', function (response) {
        alert(`Payment failed: ${response.error.description || 'Please try again'}`);
      });
      rzpInstance.open();
    } else {
      // Open built-in interactive Razorpay simulation modal
      setIsRazorpayModalOpen(true);
    }
  };

  // Action: Simulate Final Payment in Razorpay Gateway
  const handleConfirmRazorpayPayment = () => {
    setIsProcessingPayment(true);
    const cleanEmail = (customerEmail || '').trim().toLowerCase();
    setTimeout(() => {
      const newOrder = placeOrder({
        customerName: customerName.trim(),
        phone: customerPhone.trim(),
        email: cleanEmail,
        customerEmail: cleanEmail,
        address: shippingAddress.trim(),
        subtotal: cartSubtotal,
        discount: discountAmount,
        totalAmount: finalTotal,
        paymentMode: selectedPaymentMode,
        orderType: (giftingItemsCount > 0 || isGiftOptionEnabled) ? 'GIFTING' : 'PERSONAL',
        giftDetails: isGiftOptionEnabled ? { recipient: giftRecipient, message: giftMessage } : null
      });

      setIsProcessingPayment(false);
      setIsRazorpayModalOpen(false);
      setIsCheckoutOpen(false);
      setCompletedOrder(newOrder);
    }, 1800);
  };

  return (
    <>
      {/* ==================== 1. RIGHT-SIDE CART DRAWER ==================== */}
      {isCartOpen && (
        <>
          <div className="cart-drawer-overlay" onClick={() => setIsCartOpen(false)}></div>
          <div className="cart-drawer-content">
            {/* Header */}
            <div className="cart-header">
              <div className="cart-title">
                <ShoppingBag size={20} color="var(--crimson-red)" />
                <span>Your Cookie Basket</span>
                {cart.length > 0 && <span className="cart-badge-count">{cart.reduce((a, b) => a + b.qty, 0)}</span>}
              </div>
              <button className="icon-btn" onClick={() => setIsCartOpen(false)} aria-label="Close Cart">
                <X size={18} />
              </button>
            </div>

            {/* Free Shipping Progress Bar */}
            <div className="cookie-crumb-progress-bar">
              <div className="progress-label">
                {amountNeededForFreeShipping > 0 ? (
                  <span>Add <b style={{ color: 'var(--crimson-red)' }}>₹{amountNeededForFreeShipping.toFixed(0)}</b> more to unlock <b>FREE Mumbai Delivery</b>!</span>
                ) : (
                  <span className="free-shipping-unlocked">
                    <Truck size={14} /> You've unlocked <b>FREE Express Delivery</b>!
                  </span>
                )}
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>

            {/* Body */}
            <div className="cart-body">
              {cart.length === 0 ? (
                <div className="empty-cart-state">
                  <div className="empty-cart-icon">🍪</div>
                  <p className="empty-cart-title">Your basket is feeling empty!</p>
                  <p className="empty-cart-subtitle">Explore our freshly baked eggless cookies & gifting sets.</p>
                  <button 
                    className="btn-primary" 
                    onClick={() => setIsCartOpen(false)}
                    style={{ marginTop: '16px', padding: '10px 20px', fontSize: '13.5px' }}
                  >
                    Browse Collection
                  </button>
                </div>
              ) : (
                <>
                  {/* SMART AUTO-OFFER RECOMMENDATION BANNER */}
                  {!appliedCoupon && bestEligibleCouponObj && (
                    <div className="smart-offer-recommendation-box">
                      <div className="smart-offer-header">
                        <Zap size={15} color="#f59e0b" />
                        <span>Best Offer Recommended for Your Basket!</span>
                      </div>
                      <div className="smart-offer-content">
                        <div className="smart-offer-details">
                          <strong>Save ₹{bestEligibleCouponObj.savings.toFixed(0)}</strong> with code <b>{bestEligibleCouponObj.coupon.code}</b>
                          <span className="smart-offer-sub">{bestEligibleCouponObj.coupon.description}</span>
                        </div>
                        <button
                          className="btn-auto-apply-offer"
                          onClick={() => handleApplyCoupon(bestEligibleCouponObj.coupon.code)}
                        >
                          Apply Best Offer
                        </button>
                      </div>
                    </div>
                  )}

                  {!appliedCoupon && !bestEligibleCouponObj && bestUpcomingCouponObj && (
                    <div className="smart-offer-upsell-box">
                      <TrendingUp size={15} color="var(--crimson-red)" />
                      <div>
                        <span>Add <b>₹{bestUpcomingCouponObj.amountNeeded.toFixed(0)}</b> more to unlock <b>{bestUpcomingCouponObj.coupon.description}</b> with code <b>{bestUpcomingCouponObj.coupon.code}</b>!</span>
                      </div>
                    </div>
                  )}

                  {/* Item List */}
                  <div className="cart-item-list">
                    {cart.map(item => (
                      <div key={item.cartKey || item.id} className="cart-item">
                        <img
                          src={item.photoUrls ? item.photoUrls[0] : '/images/saffron-pistachio.png'}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/saffron-pistachio.png';
                          }}
                          alt={item.name}
                          className="cart-item-img"
                        />

                        <div className="cart-item-info">
                          <div className="cart-item-name">{item.name}</div>
                          <div className="cart-item-meta">
                            <span className="cart-item-price">₹{item.price}</span>
                            {item.packSize && <span className="cart-pack-tag">{item.packSize} pcs</span>}
                          </div>

                          <div className="cart-qty-controls">
                            <button className="qty-btn" onClick={() => updateCartQty(item.cartKey || item.id, -1)}>-</button>
                            <span className="qty-val">{item.qty}</span>
                            <button className="qty-btn" onClick={() => updateCartQty(item.cartKey || item.id, 1)}>+</button>
                          </div>
                        </div>

                        <button
                          className="cart-remove-btn"
                          onClick={() => removeFromCart(item.cartKey || item.id)}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Gift Packaging Option */}
                  <div className="cart-gift-card-box">
                    <label className="gift-toggle-label">
                      <input
                        type="checkbox"
                        checked={isGiftOptionEnabled}
                        onChange={(e) => setIsGiftOptionEnabled(e.target.checked)}
                      />
                      <Gift size={16} color="var(--crimson-red)" />
                      <span>Add Complimentary Artisan Gift Card & Note</span>
                    </label>

                    {isGiftOptionEnabled && (
                      <div className="gift-inputs-wrapper">
                        <input
                          type="text"
                          placeholder="Recipient's Name (e.g. Priya)"
                          className="gift-input"
                          value={giftRecipient}
                          onChange={(e) => setGiftRecipient(e.target.value)}
                        />
                        <textarea
                          placeholder="Your Personal Kahani Note (e.g., Happy Birthday! Warmest wishes & sweet cookies.)"
                          className="gift-textarea"
                          rows={2}
                          value={giftMessage}
                          onChange={(e) => setGiftMessage(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  {/* Cross-Sell Recommendations */}
                  {crossSellItems.length > 0 && (
                    <div className="cart-cross-sell-section">
                      <div className="cross-sell-title">
                        <Sparkles size={14} color="#f59e0b" />
                        <span>Frequently Baked Together</span>
                      </div>
                      <div className="cross-sell-grid">
                        {crossSellItems.map(item => (
                          <div key={item.id} className="cross-sell-card">
                            <img 
                              src={item.photoUrls ? item.photoUrls[0] : '/images/saffron-pistachio.png'} 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/saffron-pistachio.png';
                              }}
                              alt={item.name} 
                            />
                            <div className="cross-sell-details">
                              <span className="cross-sell-name">{item.name}</span>
                              <span className="cross-sell-price">₹{item.price}</span>
                            </div>
                            <button 
                              className="cross-sell-add-btn" 
                              onClick={() => addToCart(item, 1)}
                            >
                              <Plus size={14} /> Add
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer Summary & Proceed to Checkout */}
            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="coupon-section-wrapper">
                  <div className="coupon-input-group">
                    <Tag size={15} color="var(--muted-grey)" style={{ marginLeft: '10px' }} />
                    <input
                      type="text"
                      placeholder="Enter Promo Code"
                      className="coupon-input"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    {appliedCoupon ? (
                      <button className="btn-remove-coupon" onClick={handleRemoveCoupon}>
                        Remove
                      </button>
                    ) : (
                      <button className="btn-apply-coupon" onClick={() => handleApplyCoupon()}>
                        Apply
                      </button>
                    )}
                  </div>

                  {coupons && coupons.length > 0 && !appliedCoupon && (
                    <div className="coupon-chips-list">
                      <span style={{ fontSize: '11px', color: 'var(--muted-grey)', fontWeight: 600 }}>Quick Offers:</span>
                      {coupons.filter(c => c.isActive).map(c => (
                        <button
                          key={c.code}
                          className="coupon-chip"
                          onClick={() => handleApplyCoupon(c.code)}
                        >
                          🏷️ {c.code} ({c.type === 'PERCENT' ? `${c.value}% OFF` : `₹${c.value} OFF`})
                        </button>
                      ))}
                    </div>
                  )}

                  {couponError && (
                    <p className="coupon-msg error">
                      <AlertCircle size={12} /> {couponError}
                    </p>
                  )}
                  {appliedCoupon && (
                    <p className="coupon-msg success">
                      <Check size={12} /> Code <b>{appliedCoupon.code}</b> applied! ({appliedCoupon.description})
                    </p>
                  )}
                </div>

                <div className="summary-breakdown">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{cartSubtotal.toFixed(0)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="summary-row discount">
                      <span>Promo Discount</span>
                      <span>-₹{discountAmount.toFixed(0)}</span>
                    </div>
                  )}

                  <div className="summary-row">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? <strong style={{ color: 'var(--success-green)' }}>FREE</strong> : `₹${deliveryFee}`}</span>
                  </div>

                  <div className="summary-row total">
                    <span>Total Payable</span>
                    <span>₹{finalTotal.toFixed(0)}</span>
                  </div>
                </div>

                {/* CLICKING THIS CLOSES CART DRAWER & OPENS DEDICATED CHECKOUT PAGE */}
                <button
                  className="btn-primary checkout-btn"
                  onClick={handleProceedToCheckoutPage}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ==================== 2. DEDICATED CHECKOUT OVERLAY PAGE ==================== */}
      {isCheckoutOpen && (
        <div className="checkout-full-overlay">
          <div className="checkout-page-container">
            {/* Header Navbar */}
            <div className="checkout-nav-bar">
              <button 
                className="btn-back-to-cart"
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setIsCartOpen(true); // Re-open cart drawer if user clicks back
                }}
              >
                <ArrowLeft size={18} />
                <span>Return to Cart</span>
              </button>

              <div className="checkout-brand-title">
                <img src="/logo-transparent.png" alt="Meethi Kahani" style={{ height: '32px' }} />
                <span>Meethi Kahani Bakery Checkout</span>
              </div>

              <div className="checkout-ssl-badge">
                <ShieldCheck size={16} color="var(--success-green)" />
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>

            {/* Main Content Layout (Form Left + Summary Right) */}
            <div className="checkout-content-grid">
              {/* Left Column: Customer & Delivery Details Form */}
              <div className="checkout-form-column">
                <h2 className="checkout-section-heading">1. Delivery & Contact Details</h2>

                <form onSubmit={handleLaunchRazorpayGateway}>
                  <div className="form-grid-2">
                    <div className="form-field">
                      <label className="field-label">
                        <User size={14} /> Full Name
                      </label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. Aarav Sharma"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </div>

                    <div className="form-field">
                      <label className="field-label">
                        <Phone size={14} /> Mobile Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        className="form-input"
                        placeholder="+91 98200 98200"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="field-label">
                      <Mail size={14} /> Email Address (For Order Tracking Receipt)
                    </label>
                    <input
                      type="email"
                      required
                      className="form-input"
                      placeholder="aarav.sharma@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">
                      <MapPin size={14} /> Full Shipping Address
                    </label>
                    <textarea
                      required
                      rows={3}
                      className="form-textarea"
                      placeholder="House/Flat No., Building Name, Street, Landmark, Pincode"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                    />
                    <div className="address-pincode-note">
                      <Truck size={13} color="var(--success-green)" />
                      <span>Mumbai Express Serviceable: Same-day dispatch from local bakery.</span>
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <h2 className="checkout-section-heading" style={{ marginTop: '28px' }}>
                    2. Select Payment Option
                  </h2>

                  <div className="payment-options-grid">
                    <div
                      className={`payment-option-box ${selectedPaymentMode === 'UPI' ? 'active' : ''}`}
                      onClick={() => setSelectedPaymentMode('UPI')}
                    >
                      <div className="payment-box-header">
                        <QrCode size={20} color="var(--crimson-red)" />
                        <div>
                          <div className="payment-box-title">UPI / GPay / PhonePe / Paytm</div>
                          <div className="payment-box-sub">Instant zero-fee payment via Razorpay</div>
                        </div>
                      </div>
                      {selectedPaymentMode === 'UPI' && <CheckCircle2 size={18} color="var(--crimson-red)" />}
                    </div>

                    <div
                      className={`payment-option-box ${selectedPaymentMode === 'CARD' ? 'active' : ''}`}
                      onClick={() => setSelectedPaymentMode('CARD')}
                    >
                      <div className="payment-box-header">
                        <CreditCard size={20} color="var(--crimson-red)" />
                        <div>
                          <div className="payment-box-title">Credit / Debit Card / NetBanking</div>
                          <div className="payment-box-sub">Visa, Mastercard, RuPay, ICICI, HDFC</div>
                        </div>
                      </div>
                      {selectedPaymentMode === 'CARD' && <CheckCircle2 size={18} color="var(--crimson-red)" />}
                    </div>
                  </div>

                  {/* Explicit OnClick button for guaranteed Razorpay launch */}
                  <button 
                    type="button" 
                    className="btn-primary main-pay-btn"
                    onClick={handleLaunchRazorpayGateway}
                  >
                    <span>Pay ₹{finalTotal.toFixed(0)} via Razorpay Gateway</span>
                    <ArrowRight size={18} />
                  </button>
                </form>
              </div>

              {/* Right Column: Order Basket Summary Review */}
              <div className="checkout-summary-column">
                <h3 className="summary-title">Order Basket Review ({cart.reduce((a, b) => a + b.qty, 0)} Items)</h3>

                <div className="summary-item-list">
                  {cart.map(item => (
                    <div key={item.cartKey || item.id} className="summary-item-row">
                      <img src={item.photoUrls ? item.photoUrls[0] : ''} alt={item.name} />
                      <div className="summary-item-details">
                        <div className="summary-item-name">{item.name}</div>
                        <div className="summary-item-qty">Qty: {item.qty}</div>
                      </div>
                      <div className="summary-item-price">₹{item.price * item.qty}</div>
                    </div>
                  ))}
                </div>

                {isGiftOptionEnabled && (
                  <div className="summary-gift-box">
                    <Gift size={15} color="var(--crimson-red)" />
                    <div>
                      <strong>Artisan Gift Note Included:</strong>
                      <p>"{giftMessage || `Best wishes for ${giftRecipient}!`}"</p>
                    </div>
                  </div>
                )}

                <div className="summary-calculation-box">
                  <div className="calc-row">
                    <span>Subtotal</span>
                    <span>₹{cartSubtotal.toFixed(0)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="calc-row discount">
                      <span>Applied Promo Discount</span>
                      <span>-₹{discountAmount.toFixed(0)}</span>
                    </div>
                  )}

                  <div className="calc-row">
                    <span>Shipping Charge</span>
                    <span>{deliveryFee === 0 ? <strong style={{ color: 'var(--success-green)' }}>FREE</strong> : `₹${deliveryFee}`}</span>
                  </div>

                  <div className="calc-row total">
                    <span>Amount Payable</span>
                    <span>₹{finalTotal.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 3. RAZORPAY PAYMENT GATEWAY POPUP ==================== */}
      {isRazorpayModalOpen && (
        <div className="modal-overlay razorpay-gateway-overlay">
          <div className="modal-content razorpay-gateway-box">
            {/* Razorpay Top Header */}
            <div className="razorpay-top-header">
              <div className="razorpay-logo-brand">
                <Lock size={16} color="#38bdf8" />
                <span>Razorpay Trusted Gateway</span>
              </div>
              <button 
                className="razorpay-close-btn"
                onClick={() => setIsRazorpayModalOpen(false)}
                disabled={isProcessingPayment}
              >
                <X size={16} />
              </button>
            </div>

            {/* Merchant Details Bar */}
            <div className="razorpay-merchant-bar">
              <img src="/logo-transparent.png" alt="Meethi Kahani" style={{ height: '26px', filter: 'brightness(0) invert(1)' }} />
              <div style={{ flex: 1, paddingLeft: '8px' }}>
                <div className="merchant-name">Meethi Kahani Foods Pvt Ltd</div>
                <div className="merchant-sub">Paying as: <strong style={{ color: '#fef08a' }}>{customerName || 'Customer'}</strong> {customerEmail ? `(${customerEmail})` : ''}</div>
              </div>
              <div className="merchant-price-tag">₹{finalTotal.toFixed(0)}</div>
            </div>

            {/* Payment Method Specific View */}
            <div className="razorpay-gateway-body">
              {isProcessingPayment ? (
                <div className="razorpay-processing-view">
                  <Loader2 size={40} className="spin-icon" color="#3399CC" />
                  <p className="processing-text">Connecting securely to bank gateway...</p>
                  <p className="processing-sub">Authenticating transaction. Please do not close.</p>
                </div>
              ) : (
                <>
                  {selectedPaymentMode === 'UPI' && (
                    <div className="razorpay-upi-view">
                      <div className="gateway-step-label">Pay via UPI App / QR Scan</div>

                      <div className="upi-qr-placeholder">
                        <QrCode size={96} color="#0f172a" />
                        <span>Scan with GPay / PhonePe / Paytm</span>
                      </div>

                      <div className="upi-input-group">
                        <label>Enter VPA / UPI ID:</label>
                        <input
                          type="text"
                          value={upiIdInput}
                          onChange={(e) => setUpiIdInput(e.target.value)}
                          className="gateway-input"
                          placeholder="yourname@upi"
                        />
                      </div>
                    </div>
                  )}

                  {selectedPaymentMode === 'CARD' && (
                    <div className="razorpay-card-view">
                      <div className="gateway-step-label">Credit / Debit Card</div>

                      <div className="card-form-grid">
                        <div>
                          <label>Card Number</label>
                          <input
                            type="text"
                            value={cardNumberInput}
                            onChange={(e) => setCardNumberInput(e.target.value)}
                            className="gateway-input"
                          />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <div>
                            <label>Expiry (MM/YY)</label>
                            <input type="text" defaultValue="08/29" className="gateway-input" />
                          </div>
                          <div>
                            <label>CVV / CVC</label>
                            <input type="password" defaultValue="882" className="gateway-input" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    className="razorpay-pay-now-btn"
                    onClick={handleConfirmRazorpayPayment}
                  >
                    <Lock size={15} />
                    <span>Pay ₹{finalTotal.toFixed(0)} Now</span>
                  </button>

                  <div className="razorpay-footer-note">
                    <ShieldCheck size={13} color="var(--success-green)" />
                    <span>Secured by 256-Bit SSL Encryption • Razorpay Certified</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== 4. CELEBRATION ORDER CONFIRMATION MODAL & SHIPPING PROCEDURES ==================== */}
      {completedOrder && (
        <div className="modal-overlay" style={{ zIndex: 3000 }}>
          <div className="modal-content order-success-modal" style={{ maxWidth: '560px', padding: '32px 28px', textAlign: 'center', background: '#ffffff', borderRadius: '16px', border: '3px solid var(--text-primary)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            
            {/* Celebration Badge & Animated Confetti Header */}
            <div style={{ fontSize: '48px', marginBottom: '8px', animation: 'bounce 1s infinite alternate' }}>
              🎉 🍪 ✨
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#dcfce7', border: '1.5px solid #22c55e', color: '#15803d', padding: '6px 14px', borderRadius: 'var(--radius-pill)', fontSize: '13px', fontWeight: 800, marginBottom: '12px' }}>
              <CheckCircle2 size={16} />
              <span>PAYMENT CONFIRMED VIA RAZORPAY</span>
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 6px', fontFamily: 'var(--font-display)' }}>
              Order Confirmed & Placed! 🎊
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0 0 20px' }}>
              Order Reference ID: <strong style={{ color: 'var(--crimson-red)', fontSize: '15px' }}>#{completedOrder.id}</strong>
            </p>

            {/* Live Order & Shipping Procedures Timeline */}
            <div style={{ background: 'var(--bg-secondary)', border: '1.5px solid var(--text-primary)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '20px', textAlign: 'left' }}>
              <div style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--crimson-red)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={15} />
                <span>Next Procedures & Delivery Timeline</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
                <div style={{ background: '#ffffff', border: '1.5px solid #22c55e', borderRadius: '8px', padding: '10px 4px' }}>
                  <div style={{ fontSize: '20px' }}>📝</div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#15803d', marginTop: '4px' }}>1. Placed</div>
                  <div style={{ fontSize: '9.5px', color: 'var(--muted-grey)' }}>Verified</div>
                </div>

                <div style={{ background: '#ffffff', border: '1.5px solid #f59e0b', borderRadius: '8px', padding: '10px 4px' }}>
                  <div style={{ fontSize: '20px' }}>🔥</div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#b45309', marginTop: '4px' }}>2. Baking</div>
                  <div style={{ fontSize: '9.5px', color: 'var(--muted-grey)' }}>Fresh in Oven</div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px 4px', opacity: 0.8 }}>
                  <div style={{ fontSize: '20px' }}>📦</div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>3. Tin Packed</div>
                  <div style={{ fontSize: '9.5px', color: 'var(--muted-grey)' }}>Sealed Box</div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px 4px', opacity: 0.8 }}>
                  <div style={{ fontSize: '20px' }}>🚚</div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>4. Express Hub</div>
                  <div style={{ fontSize: '9.5px', color: 'var(--muted-grey)' }}>Same-Day Out</div>
                </div>
              </div>
            </div>

            {/* Order Details Breakdown Card */}
            <div className="success-details-card" style={{ margin: '0 0 20px', textAlign: 'left', background: '#ffffff', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
              <div className="success-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Recipient Name:</span>
                <strong>{completedOrder.customerName}</strong>
              </div>
              <div className="success-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Delivery Destination:</span>
                <strong style={{ maxWidth: '280px', textAlign: 'right', fontSize: '12px' }}>{completedOrder.address}</strong>
              </div>
              <div className="success-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Destination Email:</span>
                <strong style={{ color: 'var(--crimson-red)' }}>{completedOrder.customerEmail || completedOrder.email}</strong>
              </div>
              <div className="success-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Payment Mode:</span>
                <strong style={{ color: '#059669' }}>Razorpay Online ({completedOrder.paymentMode || 'UPI'}) — ₹{completedOrder.totalAmount}</strong>
              </div>
              <div className="success-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Kisse Coins Earned:</span>
                <strong style={{ color: '#b45309' }}>🪙 +{Math.floor(completedOrder.totalAmount * 0.1)} Coins (Credited to {completedOrder.customerEmail || completedOrder.email})</strong>
              </div>
              <div className="success-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderTop: '1px dashed var(--border-color)', paddingTop: '8px', marginTop: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Order Notification:</span>
                <span style={{ color: '#059669', fontWeight: 800, fontSize: '12px' }}>📧 Confirmation & Coins Email Sent</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                className="btn-primary"
                style={{ width: '100%', padding: '13px', fontSize: '14.5px', fontWeight: 800 }}
                onClick={() => {
                  setCompletedOrder(null);
                  navigateTo('/');
                }}
              >
                Continue Shopping 🍪
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
