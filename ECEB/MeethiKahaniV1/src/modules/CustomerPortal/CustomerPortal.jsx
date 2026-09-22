import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Sparkles, FileText, MapPin, Package, Gift, User, Plus, Check, Edit3, LogOut, Copy, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, RefreshCw, Loader2, KeyRound, Star, MessageSquare } from 'lucide-react';
import { sendEmailOtp, verifyEmailOtp, signInWithPassword, signUpWithPassword, isSupabaseConfigured } from '../../lib/supabaseClient';
import { sendWelcomeEmail } from '../../services/emailService';
import './CustomerPortal.css';

export const CustomerPortal = () => {
  const {
    isAccountOpen,
    setIsAccountOpen,
    userInfo,
    isLoggedIn,
    loginUser,
    logoutUser,
    completeUserProfile,
    resetSiteData,
    orders,
    reviews,
    addReview,
    cookies,
    cancelOrder,
    removeLatestOrder,
    activeRoute,
    navigateTo,
    savedAddresses,
    addSavedAddress,
    deleteSavedAddress,
    setDefaultSavedAddress
  } = useStore();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'addresses', 'rewards', 'profile'
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedOrderModal, setSelectedOrderModal] = useState(null);

  // ---- FEEDBACK MODAL & REVIEW FILTER STATES ----
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('ALL'); // 'ALL' | '5-STAR' | 'SIGNATURE' | 'SUGAR-FREE'
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackHoverRating, setFeedbackHoverRating] = useState(0);
  const [feedbackForm, setFeedbackForm] = useState({
    customerName: '',
    location: 'Mumbai',
    purchasedItem: 'Royal Saffron Pistachio Molten Melt Cookie',
    reviewText: ''
  });

  // ---- TOAST POPUP STATE ----
  const [successToast, setSuccessToast] = useState(null); // { title: '', msg: '', isAdmin: false }

  // ---- AUTH MODE STATES ----
  // authMode: 'password' (Email & Password) | 'otp' (Passwordless OTP)
  const [authMode, setAuthMode] = useState('password');
  const [isSignUp, setIsSignUp] = useState(false); // toggle between Sign In vs Sign Up in password mode
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [fullNameInput, setFullNameInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // ---- EMAIL OTP AUTH STATES ----
  const [authStep, setAuthStep] = useState('email'); // 'email' | 'otp' | 'profile'
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']); // 6-digit email OTP
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authErrorMsg, setAuthErrorMsg] = useState('');
  const [demoOtpCode, setDemoOtpCode] = useState(''); // Generated code for demo/offline mode

  // Profile completion form (for new users only)
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // 60-second resend countdown
  useEffect(() => {
    let timer = null;
    if (isTimerActive && timerSeconds > 0) {
      timer = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerActive(false);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [isTimerActive, timerSeconds]);

  // Ensure customer sign-in fields are always strictly BLANK by default and prevent browser autofilling admin credentials
  useEffect(() => {
    if (isAccountOpen && !isLoggedIn) {
      setEmailInput('');
      setPasswordInput('');
      setFullNameInput('');
      setAuthErrorMsg('');
    }
  }, [isAccountOpen, isLoggedIn]);

  // Proactively clear if the browser ever autofills admin credentials into customer sign-in
  useEffect(() => {
    if (emailInput === 'admin@meethikahani.com') {
      setEmailInput('');
      setPasswordInput('');
    }
  }, [emailInput]);

  // Handle successful customer login with popup
  const handleAuthSuccess = (email, customName = '', isNewAccount = false) => {
    setIsAccountOpen(false);
    setEmailInput('');
    setPasswordInput('');
    setFullNameInput('');
    setAuthErrorMsg('');

    // Trigger Popup Notification Message for Customer
    setSuccessToast({
      title: isNewAccount ? '🎉 Account Created Successfully!' : '🍪 Welcome Back!',
      msg: isNewAccount
        ? `Welcome to Meethi Kahani, ${customName || email}! Start exploring delicious cookies.`
        : `Signed in as ${email}. Happy Cookie Shopping! 🍪`
    });

    setTimeout(() => {
      setSuccessToast(null);
    }, 4500);
  };

  // Step 1A: Password-based Customer Sign In or Sign Up
  const handlePasswordAuth = async (e) => {
    if (e) e.preventDefault();
    const cleanEmail = (emailInput || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setAuthErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!passwordInput || passwordInput.length < 6) {
      setAuthErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsSending(true);
    setAuthErrorMsg('');

    try {
      if (isSignUp) {
        // Sign Up: creates clean customer account with 0 orders, 0 address, 0 coins
        const customerName = fullNameInput.trim() || 'Valued Customer';
        if (isSupabaseConfigured()) {
          try {
            await signUpWithPassword(cleanEmail, passwordInput, { name: customerName });
          } catch (supabaseErr) {
            console.warn('Supabase signup notice:', supabaseErr);
          }
        }

        loginUser({
          name: customerName,
          email: cleanEmail,
          phone: '',
          role: 'customer',
          isSignUp: true
        });

        // Send Welcome Email to new customer
        sendWelcomeEmail({ name: customerName, email: cleanEmail }).catch(err => {
          console.warn('[CustomerPortal] Welcome email dispatch note:', err);
        });

        handleAuthSuccess(cleanEmail, customerName, true);
      } else {
        // Sign In: retrieves saved profile (e.g. 350 coins for Aditya, saved addresses and placed orders)
        if (isSupabaseConfigured()) {
          try {
            await signInWithPassword(cleanEmail, passwordInput);
          } catch (supabaseErr) {
            console.warn('Supabase signin notice:', supabaseErr);
          }
        }

        const signedIn = loginUser({
          email: cleanEmail,
          name: fullNameInput || '',
          role: 'customer',
          isSignUp: false
        });

        handleAuthSuccess(cleanEmail, signedIn.name, false);
      }
    } catch (err) {
      const fallback = loginUser({ name: fullNameInput || 'Valued Customer', email: cleanEmail, role: 'customer', isSignUp });
      handleAuthSuccess(cleanEmail, fallback.name, isSignUp);
    } finally {
      setIsSending(false);
    }
  };

  // Step 1B: Send OTP to email via Supabase Auth
  const handleSendEmailOtp = async (e) => {
    if (e) e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      setAuthErrorMsg('Please enter a valid email address.');
      return;
    }
    setIsSending(true);
    setAuthErrorMsg('');
    try {
      if (isSupabaseConfigured()) {
        await sendEmailOtp(emailInput);
      } else {
        // Demo mode: generate a real 6-digit code for local validation
        const code = String(Math.floor(100000 + Math.random() * 900000));
        setDemoOtpCode(code);
        console.log('[Demo Mode] OTP code generated:', code);
      }
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError('');
      setTimerSeconds(60);
      setIsTimerActive(true);
      setAuthStep('otp');
    } catch (err) {
      setAuthErrorMsg(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError('');
    setAuthErrorMsg('');
    setTimerSeconds(60);
    setIsTimerActive(true);
    try {
      if (isSupabaseConfigured()) {
        await sendEmailOtp(emailInput);
      } else {
        const code = String(Math.floor(100000 + Math.random() * 900000));
        setDemoOtpCode(code);
        console.log('[Demo Mode] New OTP code generated:', code);
      }
    } catch (err) {
      setAuthErrorMsg('Failed to resend OTP.');
    }
  };

  const handleOtpDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setOtpError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Auto-verify when all 6 digits entered
    const fullOtp = newDigits.join('');
    if (fullOtp.length === 6) {
      verifyOtpCode(fullOtp);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Step 2: Verify 6-digit OTP token via Supabase Auth
  const verifyOtpCode = async (codeToVerify) => {
    setIsVerifying(true);
    setOtpError('');
    try {
      if (isSupabaseConfigured()) {
        const { user } = await verifyEmailOtp(emailInput, codeToVerify);
        if (!user.user_metadata?.name && !userInfo.name) {
          setAuthStep('profile');
        } else {
          handleAuthSuccess(emailInput);
        }
      } else {
        // Demo mode: validate against locally generated code
        if (codeToVerify === demoOtpCode) {
          loginUser({ name: profileForm.name || 'Demo User', phone: profileForm.phone || '', email: emailInput });
          setAuthStep('email');
          setDemoOtpCode('');
          handleAuthSuccess(emailInput);
        } else {
          throw new Error('Incorrect OTP');
        }
      }
    } catch (err) {
      setOtpError('❌ Invalid or expired OTP. Please check and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Step 3 (new users only): Save profile name + phone
  const handleCompleteProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return;
    setIsSavingProfile(true);
    await completeUserProfile({ name: profileForm.name, phone: profileForm.phone });
    setIsSavingProfile(false);
    setAuthStep('email');
    handleAuthSuccess(emailInput, profileForm.name);
  };

  // Address Management State Form
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddr, setNewAddr] = useState({ tag: 'HOME', flat: '', area: '', town: 'Bandra West', city: 'Mumbai', pincode: '400050' });

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddr.flat) return;
    addSavedAddress({
      ...newAddr,
      isDefault: !savedAddresses || savedAddresses.length === 0
    });
    setShowAddAddressForm(false);
    setNewAddr({ tag: 'HOME', flat: '', area: '', town: 'Bandra West', city: 'Mumbai', pincode: '400050' });
  };

  // Isolate orders specifically for current signed-in customer by email
  const myOrders = orders.filter(order => {
    if (!userInfo || !userInfo.email) return false;
    const userEmail = (userInfo.email || '').toLowerCase().trim();
    const orderEmail = (order.email || order.customerEmail || '').toLowerCase().trim();
    return Boolean(userEmail && orderEmail && userEmail === orderEmail);
  });

  const latestOrder = myOrders.length > 0 ? myOrders[0] : null;

  const getStageActiveIndex = (status) => {
    switch (status) {
      case 'PLACED': return 0;
      case 'BAKING': return 1;
      case 'SHIPPED': return 2;
      case 'DELIVERED': return 3;
      default: return 0;
    }
  };

  return (
    <>
      {/* AUTH SUCCESS TOAST NOTIFICATION POPUP */}
      {successToast && (
        <div className="auth-success-toast">
          <div className="auth-toast-icon-wrapper">
            <Check size={18} color="#FFFFFF" strokeWidth={3} />
          </div>
          <div className="auth-toast-body">
            <div className="auth-toast-title">
              {successToast.title}
            </div>
            <div className="auth-toast-msg">
              {successToast.msg}
            </div>
          </div>
          <button
            className="auth-toast-close-btn"
            onClick={() => setSuccessToast(null)}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      )}


      {activeRoute === '/' && (
        <section className="review-carousel-section">
          <div className="container">
            <div className="review-wall-header">
              <div className="script-tagline" style={{ marginBottom: '4px' }}>
                Over 10,000+ Happy Cookie Monster Moments! 🍪
              </div>
              <h2 className="review-wall-title">Loved Across Mumbai</h2>
              <div className="review-rating-summary">
                <span className="stars-gold">⭐⭐⭐⭐⭐</span>
                <span className="rating-num">4.9 / 5.0 Rating</span>
                <span className="rating-divider">•</span>
                <span className="verified-count">Based on {reviews.length * 75}+ Verified Customer Reviews</span>
              </div>

              {/* Review Filter Pills & Write Feedback CTA */}
              <div className="review-controls-row">
                <div className="review-filter-pills">
                  {[
                    { id: 'ALL', label: 'All Reviews' },
                    { id: '5-STAR', label: '★ 5-Star Only' },
                    { id: 'PROTEIN', label: '💪 High-Protein' },
                    { id: 'SUGAR-FREE', label: '🌱 Sugar-Free' }
                  ].map(f => (
                    <button
                      key={f.id}
                      className={`review-filter-btn ${reviewFilter === f.id ? 'active' : ''}`}
                      onClick={() => setReviewFilter(f.id)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <button
                  className="btn-feedback-cta"
                  onClick={() => setIsFeedbackModalOpen(true)}
                >
                  <MessageSquare size={15} />
                  <span>Share Your Feedback</span>
                </button>
              </div>
            </div>

            {/* Billboard Slider */}
            <div className="review-slider-overflow">
              <div className="review-slider-track">
                {(() => {
                  const filtered = reviews.filter(rev => {
                    if (reviewFilter === '5-STAR') return rev.ratingCookies === 5;
                    if (reviewFilter === 'SUGAR-FREE') return (rev.purchasedItem || '').toLowerCase().includes('sugar-free');
                    if (reviewFilter === 'PROTEIN') return (rev.purchasedItem || '').toLowerCase().includes('protein');
                    return true;
                  });
                  const displayList = filtered.length > 0 ? [...filtered, ...filtered] : reviews;
                  return displayList.map((rev, index) => (
                    <div key={`${rev.id}-${index}`} className="review-billboard-card">
                      <div className="review-card-top">
                        <span className="verified-badge">
                          ✅ Verified Buyer
                        </span>
                        <div className="review-stars">
                          {'⭐'.repeat(rev.ratingCookies || 5)}
                        </div>
                      </div>

                      <p className="review-quote-text">
                        "{rev.reviewText}"
                      </p>

                      <div className="review-card-footer">
                        <div className="reviewer-name">{rev.customerName}</div>
                        <div className="reviewer-loc">📍 {rev.location || 'Mumbai'}</div>
                        {rev.purchasedItem && (
                          <div className="reviewer-item-tag">
                            🍪 {rev.purchasedItem}
                          </div>
                        )}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </section>
      )}

      {isAccountOpen && (
        <div className="account-drawer-backdrop" onClick={() => setIsAccountOpen(false)}>
          {!isLoggedIn ? (
            <div className="account-drawer-panel" onClick={(e) => e.stopPropagation()}>
              <div className="account-drawer-header">
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                  {isSignUp ? 'Create Customer Account' : 'Customer Sign In'}
                </h3>
                <button className="drawer-close-icon-btn" onClick={() => setIsAccountOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="account-drawer-body">
                <div className="login-hero-card">
                  <Sparkles size={32} color="var(--crimson-red)" />
                  <h2 style={{ fontSize: '20px', fontWeight: 900, margin: '8px 0 4px', color: 'var(--text-primary)' }}>
                    {isSignUp ? 'Join Meethi Kahani ✨' : 'Welcome to Meethi Kahani 🍪'}
                  </h2>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0 }}>
                    {isSignUp ? 'Sign up to start your artisan cookie kahani' : 'Sign in with your email & password'}
                  </p>
                </div>

                {/* ===== EMAIL & PASSWORD AUTH FORM ===== */}
                <form className="add-address-form-box" onSubmit={handlePasswordAuth} autoComplete="off">
                  {/* Hidden decoy fields to absorb browser password manager auto-fill */}
                  <input type="text" name="mk_prevent_autofill_user" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
                  <input type="password" name="mk_prevent_autofill_pass" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                  {isSignUp && (
                    <>
                      <label className="profile-label">
                        <User size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="mk_customer_fullname"
                        placeholder="e.g. Aditya Nazare"
                        className="form-input-field"
                        value={fullNameInput}
                        onChange={(e) => { setFullNameInput(e.target.value); setAuthErrorMsg(''); }}
                        required={isSignUp}
                        autoComplete="off"
                      />
                    </>
                  )}

                  <label className="profile-label">
                    <Mail size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="mk_customer_login_email_clean"
                    id="mk_customer_login_email_clean"
                    placeholder="your.email@gmail.com"
                    className="form-input-field"
                    value={emailInput}
                    onChange={(e) => { setEmailInput(e.target.value); setAuthErrorMsg(''); }}
                    required
                    autoComplete="new-password"
                    autoFocus
                  />

                  <label className="profile-label">
                    <Lock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Password
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="mk_customer_login_password_clean"
                      id="mk_customer_login_password_clean"
                      placeholder="••••••••"
                      className="form-input-field"
                      style={{ width: '100%', paddingRight: '40px' }}
                      value={passwordInput}
                      onChange={(e) => { setPasswordInput(e.target.value); setAuthErrorMsg(''); }}
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {authErrorMsg && (
                    <div style={{ color: 'var(--crimson-red)', fontSize: '12px', fontWeight: 700, margin: '6px 0' }}>
                      {authErrorMsg}
                    </div>
                  )}

                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '14px', padding: '12px' }} disabled={isSending}>
                    {isSending ? <Loader2 size={16} className="spin-icon" /> : (isSignUp ? <Check size={16} /> : <KeyRound size={16} />)}
                    <span>
                      {isSending ? 'Authenticating...' : (isSignUp ? 'Create Account & Sign In →' : 'Sign In with Password →')}
                    </span>
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px' }}>
                    {isSignUp ? (
                      <span>
                        Already have an account?{' '}
                        <button
                          type="button"
                          style={{ background: 'none', border: 'none', color: 'var(--crimson-red)', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
                          onClick={() => { setIsSignUp(false); setAuthErrorMsg(''); }}
                        >
                          Sign In
                        </button>
                      </span>
                    ) : (
                      <span>
                        Don't have an account?{' '}
                        <button
                          type="button"
                          style={{ background: 'none', border: 'none', color: 'var(--crimson-red)', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
                          onClick={() => { setIsSignUp(true); setAuthErrorMsg(''); }}
                        >
                          Sign Up
                        </button>
                      </span>
                    )}
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="account-drawer-panel" onClick={(e) => e.stopPropagation()}>
              <div className="account-drawer-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="user-avatar-circle">
                    {userInfo.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                      {userInfo.name}
                    </h3>
                    <p style={{ fontSize: '11.5px', color: 'var(--muted-grey)', margin: 0 }}>
                      {userInfo.phone}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    className="header-logout-btn"
                    title="Log Out"
                    onClick={() => logoutUser()}
                  >
                    <LogOut size={14} />
                    <span>Logout</span>
                  </button>

                  <button className="drawer-close-icon-btn" onClick={() => setIsAccountOpen(false)}>
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="account-drawer-body">
              {/* Tab Navigation Pill Bar */}
              <div className="account-tabs-bar">
                <button
                  className={`account-tab-pill ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                >
                  <Package size={14} />
                  <span>Orders</span>
                </button>

                <button
                  className={`account-tab-pill ${activeTab === 'addresses' ? 'active' : ''}`}
                  onClick={() => setActiveTab('addresses')}
                >
                  <MapPin size={14} />
                  <span>Addresses</span>
                </button>

                <button
                  className={`account-tab-pill ${activeTab === 'rewards' ? 'active' : ''}`}
                  onClick={() => setActiveTab('rewards')}
                >
                  <Gift size={14} />
                  <span>Rewards</span>
                </button>

                <button
                  className={`account-tab-pill ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <User size={14} />
                  <span>Profile</span>
                </button>
              </div>

              {/* TAB 1: ORDERS & TRACKER */}
              {activeTab === 'orders' && (
                <div>
                  <div className="loyalty-coins-banner">
                    <Sparkles size={20} color="var(--crimson-red)" />
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--muted-grey)', textTransform: 'uppercase' }}>
                        Kisse Loyalty Rewards
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: 'var(--crimson-red)' }}>
                        {userInfo.kisseCoins} Coins Available
                      </div>
                    </div>
                  </div>

                  {latestOrder && (
                    <div className="order-tracker-box">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div>
                          <span className="live-tracker-tag">LIVE ORDER TRACKER</span>
                          <h4 style={{ fontSize: '16px', fontWeight: 900, margin: '2px 0 0' }}>Order #{latestOrder.id}</h4>
                        </div>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--muted-grey)' }}>{latestOrder.date}</span>
                      </div>

                      <div className="tracker-stages">
                        {[
                          { label: 'Placed', icon: '📝' },
                          { label: 'Baking', icon: '🍪' },
                          { label: 'Shipped', icon: '📦' },
                          { label: 'Delivered', icon: '🎉' }
                        ].map((stage, idx) => {
                          const activeIdx = getStageActiveIndex(latestOrder.status);
                          const isActive = idx <= activeIdx;
                          return (
                            <div key={idx} className={`tracker-stage-item ${isActive ? 'active' : ''}`}>
                              <div className="stage-icon-circle">{stage.icon}</div>
                              <span>{stage.label}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed var(--border-color)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <b>Delivering to:</b> {latestOrder.address || userInfo.defaultAddress || 'Address on file'}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>
                      Past Order History ({myOrders.length})
                    </h4>
                    {myOrders.length > 0 && (
                      <span style={{ fontSize: '11px', color: 'var(--muted-grey)', fontWeight: 600 }}>Click order for breakdown</span>
                    )}
                  </div>

                  {myOrders.length === 0 ? (
                    <div className="empty-orders-state" style={{ textAlign: 'center', padding: '36px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1.5px dashed var(--border-color)', margin: '10px 0' }}>
                      <div style={{ fontSize: '40px', marginBottom: '10px' }}>🍪</div>
                      <h4 style={{ fontSize: '15.5px', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 6px' }}>No Orders Placed Yet</h4>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 0 16px', lineHeight: 1.4 }}>
                        You haven't ordered any freshly baked cookies yet. Treat yourself or send a luxury gift box!
                      </p>
                      <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }} onClick={() => { setIsAccountOpen(false); navigateTo('/'); }}>
                        Browse Fresh Bakes 🍪
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {myOrders.map(order => (
                        <div
                          key={order.id}
                          className="order-history-card"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedOrderModal(order)}
                        >
                          <div style={{ flexGrow: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 900, fontSize: '14px', color: 'var(--text-primary)' }}>
                                Order #{order.id}
                              </span>
                              <span style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>• {order.date}</span>
                            </div>
                            
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.35 }}>
                              🍪 <b>Cookies:</b> {order.items ? order.items.map(i => `${i.name} (x${i.qty})`).join(', ') : 'Assorted Cookies'}
                            </div>

                            <div style={{ fontSize: '11.5px', color: 'var(--muted-grey)', marginTop: '4px' }}>
                              📍 <b>Address:</b> {order.address || userInfo.defaultAddress || 'Mumbai'}
                            </div>

                            <div className="history-status-tag" style={{ marginTop: '6px' }}>
                              Status: <b>{order.status}</b>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div style={{ fontWeight: 900, fontSize: '15px', color: 'var(--crimson-red)' }}>
                              ₹{order.totalAmount}
                            </div>
                            <button
                              className="btn-outline"
                              style={{ padding: '4px 10px', fontSize: '11px', marginTop: '6px' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrderModal(order);
                              }}
                            >
                              View Details 🔍
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: SAVED ADDRESSES */}
              {activeTab === 'addresses' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 900, margin: 0 }}>Saved Delivery Addresses</h4>
                    <button
                      className="btn-primary"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                    >
                      <Plus size={14} />
                      <span>{showAddAddressForm ? 'Cancel' : 'Add New'}</span>
                    </button>
                  </div>

                  {showAddAddressForm && (
                    <form className="add-address-form-box" onSubmit={handleAddAddress}>
                      <div className="form-tag-row">
                        {['HOME', 'OFFICE', 'OTHER'].map(tag => (
                          <button
                            key={tag}
                            type="button"
                            className={`tag-choice-btn ${newAddr.tag === tag ? 'active' : ''}`}
                            onClick={() => setNewAddr({ ...newAddr, tag })}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>

                      <input
                        type="text"
                        placeholder="Flat / Building / House No."
                        className="form-input-field"
                        value={newAddr.flat}
                        onChange={(e) => setNewAddr({ ...newAddr, flat: e.target.value })}
                        required
                      />

                      <input
                        type="text"
                        placeholder="Street / Area / Landmark"
                        className="form-input-field"
                        value={newAddr.area}
                        onChange={(e) => setNewAddr({ ...newAddr, area: e.target.value })}
                        required
                      />

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder="Town / Suburb (e.g. Bandra West, Powai)"
                          className="form-input-field"
                          value={newAddr.town}
                          onChange={(e) => setNewAddr({ ...newAddr, town: e.target.value })}
                          required
                        />
                        <input
                          type="text"
                          placeholder="City (e.g. Mumbai)"
                          className="form-input-field"
                          value={newAddr.city}
                          onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                          required
                        />
                      </div>

                      <input
                        type="text"
                        placeholder="Pincode (e.g. 400050)"
                        className="form-input-field"
                        value={newAddr.pincode}
                        onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                        required
                      />

                      <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                        Save Address
                      </button>
                    </form>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {savedAddresses && savedAddresses.length > 0 ? (
                      savedAddresses.map(addr => (
                        <div key={addr.id} className={`address-card ${addr.isDefault ? 'default' : ''}`}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div className="address-tag-badge">
                              📍 {addr.tag || 'HOME'} {addr.isDefault && '• PRIMARY'}
                            </div>
                            {addr.isDefault ? (
                              <span className="default-check-icon"><Check size={14} /> Default</span>
                            ) : (
                              <button className="set-default-btn" onClick={() => setDefaultSavedAddress(addr.id)}>
                                Set as Default
                              </button>
                            )}
                          </div>

                          <div className="address-text-body">
                            {addr.flat}{addr.area ? `, ${addr.area}` : ''}{addr.town ? `, Town: ${addr.town}` : ''}{addr.city ? `, City: ${addr.city}` : ''} {addr.pincode ? `— ${addr.pincode}` : ''}
                          </div>

                          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                            <button className="text-link-btn" onClick={() => deleteSavedAddress(addr.id)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: 'center', padding: '24px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
                        <MapPin size={24} color="var(--muted-grey)" style={{ marginBottom: '6px' }} />
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>No saved addresses yet.</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--muted-grey)', marginTop: '2px' }}>Click "Add New" above to save your delivery location.</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: REWARDS & VOUCHERS */}
              {activeTab === 'rewards' && (
                <div>
                  <div className="reward-coins-hero-box">
                    <Sparkles size={28} color="#ffffff" />
                    <div>
                      <div style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.9 }}>Your Rewards Balance</div>
                      <div style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff' }}>{userInfo.kisseCoins || 0} Kisse Coins</div>
                      <div style={{ fontSize: '11.5px', opacity: 0.85, marginTop: '2px' }}>Earn 10 coins on every ₹100 spent (10% back on every order)</div>
                    </div>
                  </div>

                  {/* Coins Earnings History Breakdown */}
                  <h4 style={{ fontSize: '14.5px', fontWeight: 900, margin: '16px 0 10px' }}>Recent Coin Earnings</h4>
                  {myOrders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1.5px dashed var(--border-color)', marginBottom: '16px' }}>
                      <Gift size={24} color="var(--muted-grey)" style={{ marginBottom: '6px' }} />
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 700 }}>No Kisse Coins earned yet</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--muted-grey)', marginTop: '2px' }}>
                        Place an order to earn 10% instant coin cashback on every delicious bake!
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                      {myOrders.map(order => (
                        <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '12.5px' }}>
                          <div>
                            <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>🍪 Order #{order.id} Earned</div>
                            <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>{order.date} • ₹{order.totalAmount} spent</div>
                          </div>
                          <span style={{ fontWeight: 900, color: '#059669', fontSize: '13px' }}>
                            +{Math.floor(order.totalAmount * 0.1)} Coins
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <h4 style={{ fontSize: '14.5px', fontWeight: 900, margin: '16px 0 10px' }}>Available Reward Vouchers</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div className="voucher-card">
                      <div>
                        <div style={{ fontWeight: 900, fontSize: '14px', color: 'var(--crimson-red)' }}>FLAT ₹100 OFF</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>On min. order of ₹599</div>
                      </div>
                      <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '11.5px' }} onClick={() => alert('Voucher Redeemed! Coupon Code MEETHI100 applied to cart.')}>
                        Redeem 100 Coins
                      </button>
                    </div>

                    <div className="voucher-card">
                      <div>
                        <div style={{ fontWeight: 900, fontSize: '14px', color: 'var(--crimson-red)' }}>FREE EXPRESS SHIPPING</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Free same-day delivery in Mumbai</div>
                      </div>
                      <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '11.5px' }} onClick={() => alert('Free Shipping Voucher Claimed!')}>
                        Redeem 50 Coins
                      </button>
                    </div>
                  </div>

                  <div className="referral-box">
                    <div style={{ fontWeight: 900, fontSize: '13.5px' }}>🎁 Refer Friends, Earn 50 Coins</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: '4px 0 10px' }}>
                      Share your code with friends. They get ₹50 off & you get 50 bonus coins!
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        readOnly
                        value={`MK-${userInfo.name ? userInfo.name.split(' ')[0].toUpperCase() : 'COOKIE'}50`}
                        className="referral-code-input"
                      />
                      <button
                        className="btn-outline"
                        style={{ padding: '8px 12px', fontSize: '12px' }}
                        onClick={() => {
                          setCopiedCode(true);
                          setTimeout(() => setCopiedCode(false), 2000);
                        }}
                      >
                        {copiedCode ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                        <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PROFILE & PREFERENCES */}
              {activeTab === 'profile' && (
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 900, marginBottom: '14px' }}>Personal Profile Info</h4>
                  <form
                    className="profile-form-box"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target;
                      completeUserProfile({
                        name: form.elements.namedItem('profName').value,
                        phone: form.elements.namedItem('profPhone').value,
                        defaultAddress: form.elements.namedItem('profAddress').value
                      });
                      alert('Profile saved successfully!');
                    }}
                  >
                    <label className="profile-label">Full Name</label>
                    <input type="text" name="profName" className="form-input-field" defaultValue={userInfo.name} required />

                    <label className="profile-label">Mobile Number</label>
                    <input type="text" name="profPhone" className="form-input-field" defaultValue={userInfo.phone} required />

                    <label className="profile-label">Email Address</label>
                    <input type="email" name="profEmail" className="form-input-field" value={userInfo.email} readOnly style={{ background: 'var(--bg-secondary)', opacity: 0.85 }} />

                    <label className="profile-label">Primary Delivery Address</label>
                    <input type="text" name="profAddress" className="form-input-field" defaultValue={userInfo.defaultAddress} placeholder="Enter your default delivery address" />

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                      Save Changes
                    </button>
                  </form>

                  <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                      className="btn-outline"
                      style={{ width: '100%', color: 'var(--crimson-red)', borderColor: 'var(--crimson-red)' }}
                      onClick={() => {
                        setIsAccountOpen(false);
                        logoutUser();
                      }}
                    >
                      <LogOut size={16} />
                      <span>Log Out of Account</span>
                    </button>

                    <button
                      className="btn-outline"
                      style={{ width: '100%', fontSize: '12px' }}
                      onClick={() => resetSiteData()}
                    >
                      <span>🔄 Reset All Site Data for New Customer</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )}

      {/* Full Order Breakdown Modal Popup */}
      {selectedOrderModal && (
        <div className="modal-overlay" style={{ zIndex: 1200 }} onClick={() => setSelectedOrderModal(null)}>
          <div className="modal-content" style={{ maxWidth: '520px', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedOrderModal(null)}>
              <X size={18} />
            </button>

            <div style={{ borderBottom: '2px solid var(--text-primary)', paddingBottom: '12px', marginBottom: '16px' }}>
              <span className="live-tracker-tag">ORDER DETAILS & ITEM BREAKDOWN</span>
              <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '4px 0 2px', color: 'var(--text-primary)' }}>
                Order #{selectedOrderModal.id}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--muted-grey)', margin: 0 }}>
                Placed on {selectedOrderModal.date} • Mode: {selectedOrderModal.paymentMode || 'UPI'}
              </p>
            </div>

            {/* Items Breakdown */}
            <h4 style={{ fontSize: '14px', fontWeight: 900, marginBottom: '10px' }}>
              🍪 Items Purchased ({selectedOrderModal.items ? selectedOrderModal.items.reduce((acc, i) => acc + i.qty, 0) : 0})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', background: 'var(--bg-primary)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--text-primary)' }}>
              {selectedOrderModal.items && selectedOrderModal.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{item.name}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--muted-grey)', marginTop: '2px' }}>
                      Quantity: <b>x{item.qty}</b> (₹{item.price} each)
                    </div>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: '14px', color: 'var(--crimson-red)' }}>
                    ₹{item.price * item.qty}
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Address */}
            <div style={{ marginBottom: '16px', fontSize: '12.5px', background: 'var(--bg-primary)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--text-primary)' }}>
              <div style={{ fontWeight: 900, color: 'var(--crimson-red)', fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                📍 Delivery Address
              </div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                {selectedOrderModal.address || userInfo.defaultAddress}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--muted-grey)', marginTop: '6px' }}>
                Contact: {selectedOrderModal.phone || userInfo.phone}
              </div>
            </div>

            {/* Price Breakdown */}
            <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '12px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Items Subtotal</span>
                <span style={{ fontWeight: 700 }}>₹{selectedOrderModal.subtotal || selectedOrderModal.totalAmount}</span>
              </div>

              {selectedOrderModal.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 800 }}>
                  <span>Coupon Discount</span>
                  <span>-₹{selectedOrderModal.discount}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Delivery Fee</span>
                <span style={{ fontWeight: 800, color: '#059669' }}>FREE</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '16px', color: 'var(--crimson-red)', paddingTop: '8px', borderTop: '1.5px solid var(--text-primary)', marginTop: '4px' }}>
                <span>Total Paid</span>
                <span>₹{selectedOrderModal.totalAmount}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                className="btn-primary"
                style={{ flexGrow: 1 }}
                onClick={() => alert(`GST Tax Invoice Generated for Order #${selectedOrderModal.id}\nCustomer: ${selectedOrderModal.customerName}\nAmount Paid: ₹${selectedOrderModal.totalAmount}`)}
              >
                <FileText size={16} />
                <span>Download Tax Invoice</span>
              </button>
              {selectedOrderModal.status === 'PLACED' ? (
                <button
                  className="btn-outline"
                  style={{ color: 'var(--crimson-red)', borderColor: 'var(--crimson-red)' }}
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to cancel order #${selectedOrderModal.id}?`)) {
                      cancelOrder(selectedOrderModal.id);
                      setSelectedOrderModal(null);
                    }
                  }}
                >
                  <span>Cancel Order</span>
                </button>
              ) : (
                <div style={{ fontSize: '11.5px', color: 'var(--muted-grey)', fontStyle: 'italic', background: 'var(--bg-secondary)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  🔒 Status: <b>{selectedOrderModal.status}</b> (Cannot cancel once baking starts)
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          INTERACTIVE CUSTOMER FEEDBACK / REVIEW MODAL
          ================================================================ */}
      {isFeedbackModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 2000 }} onClick={() => setIsFeedbackModalOpen(false)}>
          <div className="modal-content feedback-modal" style={{ maxWidth: '520px', padding: '28px' }} onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setIsFeedbackModalOpen(false)}>
              <X size={18} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <span className="badge-eggless" style={{ marginBottom: '8px' }}>
                <Sparkles size={13} />
                <span>Verified Customer Experience</span>
              </span>
              <h3 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-primary)', margin: '4px 0 6px' }}>
                Share Your Cookie Kahani 🍪
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                How did your molten cookies taste? Your feedback helps our master bakers in Mumbai!
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!feedbackForm.reviewText.trim()) return;
                const authorName = feedbackForm.customerName.trim() || userInfo.name || 'Cookie Connoisseur';
                addReview({
                  customerName: authorName,
                  location: feedbackForm.location || 'Mumbai',
                  purchasedItem: feedbackForm.purchasedItem || 'Artisanal Molten Cookie',
                  ratingCookies: feedbackRating,
                  reviewText: feedbackForm.reviewText.trim(),
                  isFeatured: true
                });
                setIsFeedbackModalOpen(false);
                setFeedbackForm({
                  customerName: '',
                  location: 'Mumbai',
                  purchasedItem: 'Royal Saffron Pistachio Molten Melt Cookie',
                  reviewText: ''
                });
                setFeedbackRating(5);
                setSuccessToast({
                  title: '🌟 Feedback Published!',
                  msg: 'Thank you! Your verified review is now live on our storefront review billboard.',
                  isAdmin: false
                });
                setTimeout(() => setSuccessToast(null), 4500);
              }}
              className="feedback-submission-form"
            >
              {/* Star Rating Selector */}
              <div style={{ textAlign: 'center', margin: '12px 0 16px', background: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-color)' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Your Overall Cookie Rating:
                </label>
                <div style={{ display: 'inline-flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '28px',
                        cursor: 'pointer',
                        transform: (feedbackHoverRating || feedbackRating) >= star ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.15s ease'
                      }}
                      onMouseEnter={() => setFeedbackHoverRating(star)}
                      onMouseLeave={() => setFeedbackHoverRating(0)}
                      onClick={() => setFeedbackRating(star)}
                    >
                      {(feedbackHoverRating || feedbackRating) >= star ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--crimson-red)', marginTop: '4px' }}>
                  {feedbackRating === 5 ? '5/5 — Absolute Royal Perfection! 🔥' : feedbackRating === 4 ? '4/5 — Very Delicious & Fresh! 🍪' : `${feedbackRating}/5 Stars`}
                </div>
              </div>

              {/* Cookie Product Selection */}
              <div style={{ marginBottom: '12px' }}>
                <label className="profile-label">Which Flavour Did You Taste?</label>
                <select
                  className="form-input-field"
                  value={feedbackForm.purchasedItem}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, purchasedItem: e.target.value })}
                >
                  {cookies.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label className="profile-label">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Aarav Sharma"
                    className="form-input-field"
                    value={feedbackForm.customerName}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, customerName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="profile-label">Location / City</label>
                  <input
                    type="text"
                    placeholder="e.g. Bandra West, Mumbai"
                    className="form-input-field"
                    value={feedbackForm.location}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, location: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label className="profile-label">Your Review & Feedback *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Tell us about the molten center, taste, butter dough, or packaging experience..."
                  className="form-input-field"
                  style={{ resize: 'vertical' }}
                  value={feedbackForm.reviewText}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, reviewText: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }}>
                <Sparkles size={16} />
                <span>Submit Verified Feedback →</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
