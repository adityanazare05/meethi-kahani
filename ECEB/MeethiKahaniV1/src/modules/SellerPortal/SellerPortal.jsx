import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Flame,
  Clock,
  ShieldCheck,
  CheckSquare,
  Square,
  ArrowLeft,
  RefreshCw,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  Volume2,
  Thermometer,
  Layers,
  ChefHat,
  Plus,
  Lock,
  LogOut,
  UserCheck,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import './SellerPortal.css';

export const SellerPortal = () => {
  const {
    cookies,
    restockCookie,
    orders,
    acceptOrder,
    rejectOrder,
    updateOrderStatus,
    packagingStock,
    updatePackagingStock,
    navigateTo,
    isSellerLoggedIn,
    sellerInfo,
    loginSeller,
    logoutSeller
  } = useStore();

  const [toastMsg, setToastMsg] = useState(null);
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Kitchen Login Form State
  const [kitchenLoginForm, setKitchenLoginForm] = useState({
    email: 'kitchen@meethikahani.com',
    password: 'kitchen2026'
  });
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Handle Kitchen Authentication
  const handleKitchenLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    const res = loginSeller({
      email: kitchenLoginForm.email,
      password: kitchenLoginForm.password
    });
    if (res.success) {
      showToast('👨‍🍳 Welcome to Master Kitchen Operations!');
    } else {
      setLoginError(res.error || 'Invalid credentials. Please verify passcode.');
    }
  };

  // QC Checklist checked states
  const [qcChecks, setQcChecks] = useState({
    eggless: true,
    waxSeal: true,
    saffronCocoa: true,
    ovenTemp: true
  });

  const toggleQc = (key) => {
    setQcChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Kitchen live orders (Placed, Baking, Shipped)
  const activeOrders = orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'REJECTED');
  const pastOrders = orders.filter(o => o.status === 'DELIVERED' || o.status === 'REJECTED');

  const handleBroadcastAlert = () => {
    showToast('📢 "Fresh Batch Out of Oven" broadcasted to Mumbai storefront!');
  };

  /* ====================================================================
     AUTH GATE: IF NOT LOGGED IN AS KITCHEN OPERATOR, RENDER LOGIN GATE
     ==================================================================== */
  if (!isSellerLoggedIn) {
    return (
      <div className="kitchen-gate-wrapper">
        <div className="kitchen-gate-card">
          <div className="kitchen-gate-icon-circle">
            <ChefHat size={36} />
          </div>

          <div className="kitchen-badge" style={{ margin: '0 auto 12px', display: 'inline-flex' }}>
            <Flame size={14} />
            <span>Kitchen Portal Security Enclave</span>
          </div>

          <h1 className="kitchen-gate-title">Master Kitchen Studio Login</h1>
          <p className="kitchen-subtitle" style={{ textAlign: 'center', margin: '0 auto 20px', fontSize: '13px' }}>
            Live orders queue, hourly oven baking cycles, tray restock, and eggless quality control.
          </p>

          {loginError && (
            <div className="kitchen-error-alert" style={{ marginBottom: '16px' }}>
              <AlertCircle size={15} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleKitchenLogin} className="kitchen-gate-form">
            <div className="kitchen-form-group">
              <label className="kitchen-form-label">Kitchen Station Email / ID</label>
              <input
                type="email"
                required
                className="kitchen-input-field"
                value={kitchenLoginForm.email}
                onChange={(e) => setKitchenLoginForm({ ...kitchenLoginForm, email: e.target.value })}
                placeholder="kitchen@meethikahani.com"
              />
            </div>

            <div className="kitchen-form-group">
              <label className="kitchen-form-label">Encrypted Kitchen Passcode</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="kitchen-input-field"
                  value={kitchenLoginForm.password}
                  onChange={(e) => setKitchenLoginForm({ ...kitchenLoginForm, password: e.target.value })}
                  placeholder="••••••••••••"
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="kitchen-btn-submit">
              <ChefHat size={17} />
              <span>Authenticate & Enter Kitchen Pipeline →</span>
            </button>
          </form>

          <div className="kitchen-demo-hint">
            👨‍🍳 Demo Access Credentials: <b>kitchen@meethikahani.com</b> / <b>kitchen2026</b>
          </div>

          <div>
            <button
              type="button"
              className="kitchen-return-btn"
              onClick={() => navigateTo('/')}
            >
              <ArrowLeft size={14} />
              <span>Return to Consumer Storefront</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kitchen-portal-wrapper">
      {/* Toast alert */}
      {toastMsg && (
        <div className="kitchen-toast-banner">
          <Sparkles size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="container">
        {/* Top Header */}
        <header className="kitchen-header">
          <div>
            <div className="kitchen-badge">
              <ChefHat size={15} />
              <span>Mumbai Master Kitchen Studio • Bandra West</span>
            </div>
            <h1 className="kitchen-title">Kitchen Operations & Baking Pipeline</h1>
            <p className="kitchen-subtitle">
              Live orders management, hourly oven batch cycles, cookie tray restock & eggless quality control.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', border: '1.5px solid var(--text-primary)', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 800 }}>
              <ChefHat size={15} color="var(--crimson-red)" />
              <span>{sellerInfo?.name || 'Master Kitchen Ops'}</span>
            </div>

            <button
              className="kitchen-logout-btn"
              onClick={() => {
                logoutSeller();
                showToast('Logged out of Kitchen Operations');
              }}
              title="Logout of Kitchen Portal"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Hero Oven Batch Controller Banner */}
        <div className="kitchen-oven-banner">
          <div className="oven-banner-left">
            <div className="oven-temp-pill">
              <Thermometer size={16} color="#d31820" />
              <span>Oven 01: <b>180°C Active</b></span>
            </div>
            <div className="oven-batch-tag">CURRENT BATCH #04 IN OVEN</div>
            <h2 className="oven-batch-title">Royal Saffron Pistachio & Belgian Dark Lava</h2>
            <p className="oven-batch-desc">
              Baking cycle active with pure grass-fed desi ghee. Batch yield: <b>240 cookies (60 boxes)</b>.
            </p>
          </div>

          <div className="oven-banner-right">
            <div className="oven-timer-box">
              <Clock size={20} color="#b45309" />
              <div>
                <div className="timer-label">TIME REMAINING</div>
                <div className="timer-val">14 Mins</div>
              </div>
            </div>
            <button className="btn-broadcast" onClick={handleBroadcastAlert}>
              <Volume2 size={16} />
              <span>Broadcast "Freshly Baked" Alert</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="kitchen-grid-layout">
          {/* Left Column: Live Customer Orders Queue */}
          <div className="kitchen-main-col">
            <div className="kitchen-card">
              <div className="kitchen-card-header">
                <div className="card-header-left">
                  <Flame size={20} color="var(--crimson-red)" />
                  <h3>Live Incoming Customer Orders ({activeOrders.length})</h3>
                </div>
                <span className="live-pulse-badge">● Live Sync</span>
              </div>

              {activeOrders.length === 0 ? (
                <div className="empty-orders-box">
                  <CheckCircle size={36} color="var(--success-green)" />
                  <h4>All Orders Baked & Dispatched!</h4>
                  <p>New orders placed on the storefront will automatically appear here instantly.</p>
                </div>
              ) : (
                <div className="kitchen-orders-list">
                  {activeOrders.map(order => {
                    const isNew = order.status === 'PLACED' || !order.status;
                    const isBaking = order.status === 'BAKING';
                    const isShipped = order.status === 'SHIPPED';

                    return (
                      <div key={order.id} className={`kitchen-order-item ${isNew ? 'new-order' : ''}`}>
                        <div className="k-order-top">
                          <div className="k-order-id-group">
                            <span className="k-order-id">#{order.id}</span>
                            <span className={`k-order-type ${order.orderType === 'GIFTING' ? 'gifting' : 'personal'}`}>
                              {order.orderType || 'PERSONAL'}
                            </span>
                          </div>
                          <div className="k-order-time">{order.date || 'Just Now'}</div>
                        </div>

                        <div className="k-order-customer">
                          <div className="k-cust-name">{order.customerName || 'Valued Customer'}</div>
                          <div className="k-cust-addr">{order.address || 'Mumbai, Maharashtra'}</div>
                        </div>

                        {/* Items ordered */}
                        <div className="k-order-items">
                          <div className="k-items-label">ITEMS TO BAKE & PACK:</div>
                          {Array.isArray(order.items) && order.items.length > 0 ? (
                            order.items.map((it, idx) => (
                              <div key={idx} className="k-item-row">
                                <span className="k-item-bullet">•</span>
                                <span className="k-item-name">{it.name || it.title}</span>
                                <span className="k-item-qty">x{it.qty} Boxes</span>
                              </div>
                            ))
                          ) : (
                            <div className="k-item-row">1x Curated Artisan Cookie Box</div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="k-order-actions">
                          {isNew && (
                            <>
                              <button
                                className="btn-kitchen-action accept"
                                onClick={() => {
                                  acceptOrder(order.id);
                                  showToast(`Order #${order.id} accepted & in oven!`);
                                }}
                              >
                                <Flame size={15} />
                                <span>Accept & Start Baking</span>
                              </button>
                              <button
                                className="btn-kitchen-action reject"
                                onClick={() => {
                                  rejectOrder(order.id);
                                  showToast(`Order #${order.id} rejected.`);
                                }}
                              >
                                <XCircle size={15} />
                                <span>Decline</span>
                              </button>
                            </>
                          )}

                          {isBaking && (
                            <button
                              className="btn-kitchen-action ship"
                              onClick={() => {
                                updateOrderStatus(order.id, 'SHIPPED');
                                showToast(`Order #${order.id} packed & marked for shipping!`);
                              }}
                            >
                              <Truck size={15} />
                              <span>Packed & Handover to Delivery</span>
                            </button>
                          )}

                          {isShipped && (
                            <div className="shipped-badge">
                              <Truck size={15} /> In Transit to Customer
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Hourly Schedule, QC Checklist, Packaging Stock & Cookie Trays */}
          <div className="kitchen-side-col">
            {/* Hourly Baking Schedule */}
            <div className="kitchen-card">
              <div className="kitchen-card-header">
                <div className="card-header-left">
                  <Clock size={18} color="var(--crimson-red)" />
                  <h3>Hourly Baking Schedule</h3>
                </div>
              </div>

              <div className="schedule-list">
                <div className="schedule-item completed">
                  <div className="schedule-time">04:00 AM</div>
                  <div className="schedule-info">
                    <div className="schedule-title">Morning Dispatch Batch</div>
                    <div className="schedule-meta">120 Boxes Baked • Quality Approved</div>
                  </div>
                  <span className="status-pill green">✓ Baked</span>
                </div>

                <div className="schedule-item active-bake">
                  <div className="schedule-time">10:00 AM</div>
                  <div className="schedule-info">
                    <div className="schedule-title">Midday Luxury Batch</div>
                    <div className="schedule-meta">Saffron Pistachio & Dark Lava</div>
                  </div>
                  <span className="status-pill orange">🔥 In Oven</span>
                </div>

                <div className="schedule-item upcoming">
                  <div className="schedule-time">02:00 PM</div>
                  <div className="schedule-info">
                    <div className="schedule-title">Afternoon Stevia Series</div>
                    <div className="schedule-meta">Sugar-Free Almond Prep</div>
                  </div>
                  <span className="status-pill grey">⏳ Scheduled</span>
                </div>

                <div className="schedule-item upcoming">
                  <div className="schedule-time">06:00 PM</div>
                  <div className="schedule-info">
                    <div className="schedule-title">Evening Express Batch</div>
                    <div className="schedule-meta">Bandra & Powai Evening Tins</div>
                  </div>
                  <span className="status-pill grey">⏳ Scheduled</span>
                </div>
              </div>
            </div>

            {/* Quality Audit Checklist */}
            <div className="kitchen-card" style={{ marginTop: '24px' }}>
              <div className="kitchen-card-header">
                <div className="card-header-left">
                  <ShieldCheck size={18} color="var(--crimson-red)" />
                  <h3>Food Safety & Eggless QC</h3>
                </div>
              </div>

              <div className="qc-checklist">
                <div className="qc-item" onClick={() => toggleQc('eggless')} style={{ cursor: 'pointer' }}>
                  {qcChecks.eggless ? (
                    <CheckSquare size={20} color="var(--crimson-red)" />
                  ) : (
                    <Square size={20} color="var(--muted-grey)" />
                  )}
                  <div>
                    <div className="qc-title">100% Pure Eggless Certification</div>
                    <div className="qc-desc">Zero egg substitutes or albumin ingredients used in current batch.</div>
                  </div>
                </div>

                <div className="qc-item" onClick={() => toggleQc('waxSeal')} style={{ cursor: 'pointer' }}>
                  {qcChecks.waxSeal ? (
                    <CheckSquare size={20} color="var(--crimson-red)" />
                  ) : (
                    <Square size={20} color="var(--muted-grey)" />
                  )}
                  <div>
                    <div className="qc-title">Airtight Tin Caddy Wax-Seal Test</div>
                    <div className="qc-desc">Airtight vacuum test verified for fresh crisp texture retention.</div>
                  </div>
                </div>

                <div className="qc-item" onClick={() => toggleQc('saffronCocoa')} style={{ cursor: 'pointer' }}>
                  {qcChecks.saffronCocoa ? (
                    <CheckSquare size={20} color="var(--crimson-red)" />
                  ) : (
                    <Square size={20} color="var(--muted-grey)" />
                  )}
                  <div>
                    <div className="qc-title">Single-Origin Saffron & Belgian Cocoa</div>
                    <div className="qc-desc">Authentic Kashmiri saffron & 70% dark Belgian cocoa verified.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Packaging Inventory */}
            <div className="kitchen-card" style={{ marginTop: '24px' }}>
              <div className="kitchen-card-header">
                <div className="card-header-left">
                  <Layers size={18} color="var(--crimson-red)" />
                  <h3>Packaging Stock</h3>
                </div>
              </div>

              <div className="k-pkg-list">
                {packagingStock.slice(0, 4).map(pkg => (
                  <div key={pkg.id} className="k-pkg-row">
                    <div>
                      <div className="k-pkg-name">{pkg.name}</div>
                      <div className="k-pkg-meta">{pkg.stock} {pkg.unit} available</div>
                    </div>
                    <button
                      className="btn-pkg-add"
                      onClick={() => {
                        updatePackagingStock(pkg.id, 25);
                        showToast(`Added +25 ${pkg.name}`);
                      }}
                    >
                      +25
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cookie SKU Tray Restocker (Shifted to Right Side after Packaging Stocks) */}
            <div className="kitchen-card" style={{ marginTop: '24px' }}>
              <div className="kitchen-card-header">
                <div className="card-header-left">
                  <Package size={18} color="var(--crimson-red)" />
                  <h3>Fresh Cookie Tray Stock</h3>
                </div>
              </div>

              <div className="kitchen-sku-grid">
                {cookies.map(cookie => (
                  <div key={cookie.id} className="k-sku-card">
                    <img src={cookie.photoUrls[0] || '/images/saffron-pistachio.png'} alt={cookie.name} className="k-sku-img" />
                    <div className="k-sku-body">
                      <div className="k-sku-name">{cookie.name}</div>
                      <div className="k-sku-stock-row">
                        <span className="k-stock-count"><b>{cookie.stockPieces}</b> Boxes Left</span>
                        <button
                          className="btn-restock-sm"
                          onClick={() => {
                            restockCookie(cookie.id, 20);
                            showToast(`Restocked +20 boxes of ${cookie.name}`);
                          }}
                        >
                          <Plus size={13} /> +20
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
