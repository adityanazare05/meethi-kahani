import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Sparkles, Gift, Check, Heart, Plus, Minus, Trash2, ShieldCheck, 
  Truck, ArrowRight, Award, Star, Feather, Send, Building2, Edit3
} from 'lucide-react';
import './GiftingHub.css';

export const GiftingHub = ({ initialTab = 'builder' }) => {
  const { cookies, addToCart } = useStore();

  // Active Tab: 'builder' (Custom Studio) or 'precurated' (Ready Gift Sets)
  const [activeGiftingTab, setActiveGiftingTab] = useState(initialTab);

  // Modal State for Pre-curated Gift Set Quick Details
  const [activePrecuratedModal, setActivePrecuratedModal] = useState(null);

  // Builder States
  const [selectedBoxSize, setSelectedBoxSize] = useState(8);
  const [cookieQuantities, setCookieQuantities] = useState({}); // { 'cookie-1': 3, 'cookie-2': 5 }
  const [selectedRibbon, setSelectedRibbon] = useState('crimson'); // 'crimson', 'gold', 'vintage'

  // Gift Card Personalization (Directly editable on the Postcard card!)
  const [recipientName, setRecipientName] = useState('Priya Sharma');
  const [senderName, setSenderName] = useState('Aarav');
  const [giftNoteMessage, setGiftNoteMessage] = useState('Wishing you sweet moments filled with joy, warmth, and delicious handcrafted cookies!');

  // Corporate Inquiry Modal State
  const [isCorporateModalOpen, setIsCorporateModalOpen] = useState(false);
  const [corpForm, setCorpForm] = useState({ company: '', contactName: '', phone: '', email: '', count: '50' });

  // Pre-Curated Gift Bestsellers
  const precuratedSets = [
    {
      id: 'pre-curated-1',
      title: 'The Bandra Royal Festive Tin',
      price: 899,
      mrp: 1199,
      rating: 5.0,
      reviewCount: 142,
      pieces: '8 Artisan Pieces',
      image: '/images/saffron-pistachio.png',
      badge: '👑 BESTSELLER',
      description: 'Includes 4 Royal Saffron Pistachio + 4 Belgian Dark Chocolate Lava Melt in an embossed gold tin with crimson ribbon.',
      contents: [
        '4x Royal Saffron Pistachio Molten Cookies',
        '4x Belgian Dark Chocolate Lava Melt Cookies',
        '1x Embossed Royal Gold Airtight Caddy',
        '1x Satin Crimson Ribbon & Custom Wax-Sealed Gift Card'
      ]
    },
    {
      id: 'pre-curated-2',
      title: 'Imperial Celebration Cookie Trunk',
      price: 1499,
      mrp: 1999,
      rating: 4.9,
      reviewCount: 98,
      pieces: '12 Luxury Pieces',
      image: '/images/gift-box.png',
      badge: '✨ LUXURY TRUNK',
      description: 'Grand assortment of 12 artisan eggless cookies with complimentary wax-sealed gift note & velvet trunk.',
      contents: [
        '4x Royal Saffron Pistachio Molten',
        '4x Belgian Dark Chocolate Lava',
        '4x Kannauj Rose Almond Mawa Molten',
        '1x Imperial Wooden Velvet Gift Trunk',
        '1x Custom Wax-Sealed Postcard'
      ]
    },
    {
      id: 'pre-curated-3',
      title: 'Artisan Rose & Hazelnut Set',
      price: 1099,
      mrp: 1399,
      rating: 4.9,
      reviewCount: 86,
      pieces: '8 Gourmet Pieces',
      image: '/images/rose-almond.png',
      badge: '☕ GOURMET CHOICE',
      description: 'Hand-crafted rose almond & roasted hazelnut delights packed in a velvet crimson tin.',
      contents: [
        '4x Kannauj Rose Almond Mawa Molten',
        '4x Sugar-Free Hazelnut Cocoa Molten',
        '1x Crimson Red Velvet Tin Caddy',
        '1x Gold Foil Gift Tag & Satin Ribbon'
      ]
    },
    {
      id: 'pre-curated-4',
      title: 'Royal Heritage Double Gold Box',
      price: 1899,
      mrp: 2399,
      rating: 5.0,
      reviewCount: 210,
      pieces: '16 Grand Pieces',
      image: '/images/dark-cocoa.png',
      badge: '🌟 GRAND FESTIVE',
      description: 'Ultimate 16-cookie double gold hamper containing all signature molten lava flavors with luxury silk wrap.',
      contents: [
        '4x Royal Saffron Pistachio Molten',
        '4x Belgian Dark Chocolate Lava',
        '4x Kannauj Rose Almond Mawa Molten',
        '4x High-Protein Oats PB Lava',
        '2x Airtight Gold Caddies in Double Trunk'
      ]
    }
  ];

  // Total chosen pieces calculation
  const totalChosenCount = Object.values(cookieQuantities).reduce((sum, qty) => sum + qty, 0);

  // Helper to adjust cookie quantity
  const updateCookieQuantity = (cookieId, delta, e) => {
    if (e) e.stopPropagation();
    const currentQty = cookieQuantities[cookieId] || 0;
    const newQty = currentQty + delta;
    if (newQty < 0) return;

    if (delta > 0 && totalChosenCount >= selectedBoxSize) {
      alert(`Your ${selectedBoxSize}-cookie tin box is full! Reduce a cookie count to add more.`);
      return;
    }

    setCookieQuantities(prev => {
      const updated = { ...prev };
      if (newQty === 0) {
        delete updated[cookieId];
      } else {
        updated[cookieId] = newQty;
      }
      return updated;
    });
  };

  const handleBoxSizeChange = (newSize) => {
    setSelectedBoxSize(newSize);
    setCookieQuantities({}); // Reset quantities on capacity change for clean experience
  };

  const handleAddCustomHamperToCart = () => {
    if (totalChosenCount < selectedBoxSize) {
      alert(`Please select ${selectedBoxSize - totalChosenCount} more cookies to complete your ${selectedBoxSize}-piece gift tin.`);
      return;
    }

    // Calculate raw subtotal from selected cookies & quantities
    let rawSubtotal = 0;
    const itemsSummaryList = [];

    Object.entries(cookieQuantities).forEach(([cookieId, qty]) => {
      const cookieObj = cookies.find(c => c.id === cookieId);
      if (cookieObj) {
        rawSubtotal += cookieObj.price * qty;
        itemsSummaryList.push(`${cookieObj.name} (x${qty})`);
      }
    });

    const discountedPrice = Math.round(rawSubtotal * 0.75); // 25% Off Bundle Savings

    const customHamperBundle = {
      id: `custom-hamper-${Date.now()}`,
      categoryId: 'cat-2',
      name: `Custom Royal Gift Tin (${selectedBoxSize} Pcs)`,
      slug: `custom-gift-tin-${selectedBoxSize}`,
      price: discountedPrice,
      stockPieces: 100,
      isOnline: true,
      photoUrls: ['/images/saffron-pistachio.png'],
      kahaniText: `Custom Gift Tin (${selectedBoxSize} Pcs: ${itemsSummaryList.join(', ')}) for ${recipientName} from ${senderName}. Note: "${giftNoteMessage}"`,
      orderType: 'GIFTING'
    };

    addToCart(customHamperBundle, 1, true, null);
  };

  const handleAddPrecuratedToCart = (item) => {
    const giftItem = {
      id: item.id,
      categoryId: 'cat-2',
      name: item.title,
      slug: `precurated-${item.id}`,
      price: item.price,
      stockPieces: 50,
      isOnline: true,
      photoUrls: [item.image],
      kahaniText: item.description,
      orderType: 'GIFTING'
    };
    addToCart(giftItem, 1, true, null);
  };

  const handleCorporateSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you ${corpForm.contactName}! Our Mumbai Corporate Concierge team will call you at ${corpForm.phone} within 2 hours with customized wholesale pricing.`);
    setIsCorporateModalOpen(false);
  };

  // Expand picked cookies into individual slot items for visual slots bar
  const expandedSlotItems = [];
  Object.entries(cookieQuantities).forEach(([cookieId, qty]) => {
    const cookieObj = cookies.find(c => c.id === cookieId);
    if (cookieObj) {
      for (let i = 0; i < qty; i++) {
        expandedSlotItems.push(cookieObj);
      }
    }
  });

  return (
    <div className="gifting-page-wrapper">
      {/* 1. LUXURY HERO BANNER */}
      <section className="gifting-hero-header">
        <div className="gifting-hero-content">
          <div className="gifting-tag-badge">
            <Sparkles size={14} color="#f59e0b" />
            <span>100% Pure Eggless Artisan Gifting Studio</span>
          </div>
          <h1 className="gifting-hero-title">
            Craft Extraordinary Sweet Memories
          </h1>
          <p className="gifting-hero-subtitle">
            Hand-select your favorite artisan cookie quantities into a tin box, personalized with wax-sealed gift notes & satin ribbons.
          </p>

          <div className="gifting-tab-switcher">
            <button
              className={`gifting-tab-btn ${activeGiftingTab === 'builder' ? 'active' : ''}`}
              onClick={() => setActiveGiftingTab('builder')}
            >
              <Gift size={16} />
              <span>Custom Cookie Tin Builder</span>
            </button>

            <button
              className={`gifting-tab-btn ${activeGiftingTab === 'precurated' ? 'active' : ''}`}
              onClick={() => setActiveGiftingTab('precurated')}
            >
              <Award size={16} />
              <span>Ready Festive Gift Sets</span>
            </button>
          </div>
        </div>
      </section>

      <div className="gifting-main-container">
        {/* ==================== VIEW 1: CUSTOM HAMPER BUILDER ==================== */}
        {activeGiftingTab === 'builder' && (
          <div className="gifting-builder-layout">
            {/* Left Column: Interactive Builder Steps 1 & 2 */}
            <div className="builder-steps-column">
              {/* STEP 1: CHOOSE TIN CAPACITY */}
              <div className="builder-step-card">
                <div className="step-header">
                  <span className="step-num">1</span>
                  <div>
                    <h2 className="step-title">Choose Gift Box Capacity</h2>
                    <p className="step-sub">Includes Complimentary Wax-Sealed Gift Card & 25% Savings!</p>
                  </div>
                </div>

                <div className="box-options-grid">
                  {[
                    { count: 8, label: 'Luxe Box of 8', desc: 'Min. Box Size • Intimate', discount: '25% OFF' },
                    { count: 16, label: 'Royal Box of 16', desc: 'Festive Favorite Tin', discount: '25% OFF • POPULAR' },
                    { count: 24, label: 'Imperial Box of 24', desc: 'Gourmet Grand Trunk', discount: '25% OFF • CELEBRATION' },
                    { count: 32, label: 'Grand Trunk of 32', desc: 'Ultimate Royal Assortment', discount: '25% OFF • LUXURY TRUNK' }
                  ].map(box => (
                    <div
                      key={box.count}
                      className={`box-card-item ${selectedBoxSize === box.count ? 'active' : ''}`}
                      onClick={() => handleBoxSizeChange(box.count)}
                    >
                      <div className="box-badge">{box.discount}</div>
                      <Gift size={28} className="box-icon" />
                      <div className="box-card-name">{box.label}</div>
                      <div className="box-card-sub">{box.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 2: SELECT COOKIE QUANTITIES */}
              <div className="builder-step-card">
                <div className="step-header">
                  <span className="step-num">2</span>
                  <div>
                    <h2 className="step-title">
                      Select Cookies ({totalChosenCount} of {selectedBoxSize} Pcs Added)
                    </h2>
                    <p className="step-sub">Use <b>+</b> and <b>-</b> to choose exact quantities of your favorite cookies.</p>
                  </div>
                </div>

                {/* Slot Filling Bar */}
                <div className="tin-slots-bar">
                  <span className="slots-label">Tin Contents ({totalChosenCount}/{selectedBoxSize}):</span>
                  <div className="slots-pills-list">
                    {Array.from({ length: selectedBoxSize }).map((_, idx) => {
                      const item = expandedSlotItems[idx];
                      return (
                        <div key={idx} className={`slot-pill ${item ? 'filled' : 'empty'}`}>
                          {item ? (
                            <>
                              <span>🍪 {item.name.split(' ')[0]}</span>
                              <button 
                                className="remove-slot-btn" 
                                onClick={(e) => updateCookieQuantity(item.id, -1, e)}
                                title="Remove piece"
                              >
                                ×
                              </button>
                            </>
                          ) : (
                            <span>+ Slot {idx + 1}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cookie Grid with + / - Qty Controls */}
                <div className="cookie-picker-grid">
                  {cookies.filter(c => c.isOnline).map(cookie => {
                    const qty = cookieQuantities[cookie.id] || 0;
                    return (
                      <div
                        key={cookie.id}
                        className={`cookie-pick-card ${qty > 0 ? 'selected' : ''}`}
                        onClick={(e) => updateCookieQuantity(cookie.id, 1, e)}
                      >
                        {qty > 0 && (
                          <div className="pick-count-badge">
                            {qty}
                          </div>
                        )}
                        <img 
                          src={(cookie.photoUrls && cookie.photoUrls[0]) ? cookie.photoUrls[0] : '/images/saffron-pistachio.png'} 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/saffron-pistachio.png';
                          }}
                          alt={cookie.name} 
                          className="cookie-pick-img" 
                        />
                        <div className="cookie-pick-info">
                          <h4 className="cookie-pick-title">{cookie.name}</h4>
                          <span className="cookie-pick-price">₹{cookie.price}</span>
                        </div>

                        {/* Interactive + / - Quantity Controls */}
                        <div className="cookie-qty-bar">
                          {qty > 0 ? (
                            <div className="qty-control-pill">
                              <button 
                                className="qty-picker-btn"
                                onClick={(e) => updateCookieQuantity(cookie.id, -1, e)}
                              >
                                <Minus size={12} />
                              </button>
                              <span className="qty-picker-val">{qty}</span>
                              <button 
                                className="qty-picker-btn"
                                onClick={(e) => updateCookieQuantity(cookie.id, 1, e)}
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          ) : (
                            <button
                              className="btn-add-cookie-item"
                              onClick={(e) => updateCookieQuantity(cookie.id, 1, e)}
                            >
                              <Plus size={13} /> Add
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: DIRECTLY EDITABLE ARTISAN GIFT CARD & BOX SUMMARY */}
            <div className="builder-preview-column">
              <div className="sticky-preview-box">
                <h3 className="preview-heading">
                  <Edit3 size={16} color="var(--crimson-red)" />
                  <span>Personalize Your Gift Card (Type Directly Below)</span>
                </h3>

                {/* DIRECTLY EDITABLE POSTCARD MOCKUP */}
                <div className="live-postcard-mockup interactive-card">
                  <div className="postcard-header">
                    <img src="/logo-transparent.png" alt="Meethi Kahani" style={{ height: '24px' }} />
                    <span className="postcard-seal">🕯️ Wax Sealed</span>
                  </div>

                  <div className="postcard-body">
                    <div className="postcard-field-row">
                      <span className="postcard-salutation">Dearest</span>
                      <input
                        type="text"
                        className="inline-postcard-input recipient"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Friend's Name"
                      />
                    </div>

                    <textarea
                      className="inline-postcard-textarea"
                      rows={3}
                      value={giftNoteMessage}
                      onChange={(e) => setGiftNoteMessage(e.target.value)}
                      placeholder="Write your custom gift message here..."
                    />

                    <div className="postcard-field-row sender-row">
                      <span className="postcard-salutation">With Love,</span>
                      <input
                        type="text"
                        className="inline-postcard-input sender"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="Your Name"
                      />
                    </div>
                  </div>

                  <div className="postcard-footer">
                    <span>📍 Freshly Baked in Mumbai</span>
                    <span>100% Eggless</span>
                  </div>
                </div>

                {/* Satin Packaging Ribbon Selector */}
                <div className="ribbon-picker-wrapper">
                  <label className="field-block-label">Select Satin Packaging Ribbon:</label>
                  <div className="ribbon-selector-row">
                    {[
                      { id: 'crimson', label: '🎀 Crimson Red', color: '#D31820' },
                      { id: 'gold', label: '🎗️ Royal Gold', color: '#d97706' },
                      { id: 'vintage', label: '🧵 Eco Jute', color: '#78350f' }
                    ].map(r => (
                      <button
                        key={r.id}
                        type="button"
                        className={`ribbon-chip ${selectedRibbon === r.id ? 'active' : ''}`}
                        onClick={() => setSelectedRibbon(r.id)}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Order Summary & Pricing */}
                <div className="hamper-summary-card" style={{ marginTop: '16px' }}>
                  <div className="hamper-summary-row">
                    <span>Selected Gift Box:</span>
                    <strong>Box of {selectedBoxSize} Pcs</strong>
                  </div>
                  <div className="hamper-summary-row">
                    <span>Items Picked:</span>
                    <strong>{totalChosenCount} / {selectedBoxSize} Pcs</strong>
                  </div>
                  <div className="hamper-summary-row">
                    <span>Satin Packaging:</span>
                    <strong style={{ textTransform: 'capitalize' }}>{selectedRibbon} Ribbon</strong>
                  </div>
                  <div className="hamper-summary-row discount">
                    <span>Artisan Bundle Offer:</span>
                    <strong>25% OFF MRP</strong>
                  </div>

                  <button
                    className="btn-primary main-hamper-cart-btn"
                    onClick={handleAddCustomHamperToCart}
                  >
                    <Sparkles size={18} />
                    <span>Add Custom Gift Box to Cart</span>
                  </button>
                </div>

                {/* Corporate Inquiry Teaser */}
                <div className="corporate-banner-teaser">
                  <Building2 size={24} color="var(--crimson-red)" />
                  <div>
                    <strong>Corporate & Festive Gifting (Over 25 Boxes)?</strong>
                    <p>Get custom logo tin branding & wholesale rates.</p>
                    <button 
                      className="btn-link-corp" 
                      onClick={() => setIsCorporateModalOpen(true)}
                    >
                      Inquire Corporate Rates →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== VIEW 2: PRE-CURATED GIFT SETS ==================== */}
        {activeGiftingTab === 'precurated' && (
          <div className="precurated-sets-section">
            <div className="section-title-wrapper">
              <h2 className="section-title">Ready Festive Gift Collections</h2>
              <p className="section-sub">Pre-packaged in luxury airtight tins with wax-sealed gift cards for instant gifting across India.</p>
            </div>

            <div className="precurated-grid">
              {precuratedSets.map(set => (
                <div key={set.id} className="precurated-card">
                  <div className="precurated-badge">{set.badge}</div>
                  <img 
                    src={set.image} 
                    alt={set.title} 
                    className="precurated-img"
                    onClick={() => setActivePrecuratedModal(set)}
                    style={{ cursor: 'pointer' }}
                  />

                  <div className="precurated-content">
                    <div className="precurated-rating">
                      <Star size={13} fill="#f59e0b" color="#f59e0b" />
                      <span>{set.rating} ({set.reviewCount} reviews) • {set.pieces}</span>
                    </div>

                    <h3 
                      className="precurated-title" 
                      onClick={() => setActivePrecuratedModal(set)}
                      style={{ cursor: 'pointer' }}
                    >
                      {set.title}
                    </h3>
                    <p className="precurated-desc">{set.description}</p>

                    <div className="precurated-price-row">
                      <div>
                        <span className="price-current">₹{set.price}</span>
                        <span className="price-mrp">₹{set.mrp}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn-outline"
                          style={{ padding: '8px 12px', fontSize: '12px' }}
                          onClick={() => setActivePrecuratedModal(set)}
                        >
                          Details
                        </button>
                        <button
                          className="btn-primary"
                          style={{ padding: '8px 16px', fontSize: '13px' }}
                          onClick={() => handleAddPrecuratedToCart(set)}
                        >
                          <Gift size={15} />
                          <span>Add Gift Set</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PRE-CURATED GIFT SET DETAILS MODAL */}
      {activePrecuratedModal && (
        <div className="modal-overlay" onClick={() => setActivePrecuratedModal(null)}>
          <div className="modal-content corporate-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <img 
                src={activePrecuratedModal.image} 
                alt={activePrecuratedModal.title} 
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} 
              />
              <div className="precurated-badge" style={{ top: '10px', left: '10px' }}>
                {activePrecuratedModal.badge}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                {activePrecuratedModal.title}
              </h3>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--crimson-red)', background: '#fff5f5', padding: '3px 8px', borderRadius: '12px', border: '1px solid #fecdd3' }}>
                {activePrecuratedModal.pieces}
              </div>
            </div>

            <div className="precurated-rating" style={{ marginBottom: '12px' }}>
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <span>{activePrecuratedModal.rating} rating from {activePrecuratedModal.reviewCount} happy gift receivers</span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.4 }}>
              {activePrecuratedModal.description}
            </p>

            <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
              <strong style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                🎁 Box Includes:
              </strong>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {activePrecuratedModal.contents.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span className="price-current" style={{ fontSize: '22px' }}>₹{activePrecuratedModal.price}</span>
                <span className="price-mrp">₹{activePrecuratedModal.mrp}</span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn-outline" 
                  onClick={() => setActivePrecuratedModal(null)}
                  style={{ padding: '10px 16px', fontSize: '13px' }}
                >
                  Close
                </button>
                <button
                  className="btn-primary"
                  style={{ padding: '10px 20px', fontSize: '14px' }}
                  onClick={() => {
                    handleAddPrecuratedToCart(activePrecuratedModal);
                    setActivePrecuratedModal(null);
                  }}
                >
                  <Gift size={16} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CORPORATE BULK INQUIRY MODAL */}
      {isCorporateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCorporateModalOpen(false)}>
          <div className="modal-content corporate-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="corp-modal-header">
              <Building2 size={24} color="var(--crimson-red)" />
              <div>
                <h3>Corporate & Wholesale Gifting Concierge</h3>
                <p>Custom logo tin branding, GST invoice & bulk discounts.</p>
              </div>
            </div>

            <form onSubmit={handleCorporateSubmit} className="corp-form">
              <div className="form-field">
                <label>Company / Organization Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Consultancy Services"
                  value={corpForm.company}
                  onChange={(e) => setCorpForm({ ...corpForm, company: e.target.value })}
                  className="builder-input"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label>Contact Person Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anish Kapoor"
                    value={corpForm.contactName}
                    onChange={(e) => setCorpForm({ ...corpForm, contactName: e.target.value })}
                    className="builder-input"
                  />
                </div>

                <div className="form-field">
                  <label>Mobile Number:</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 98200"
                    value={corpForm.phone}
                    onChange={(e) => setCorpForm({ ...corpForm, phone: e.target.value })}
                    className="builder-input"
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Estimated Quantity of Boxes:</label>
                <select
                  value={corpForm.count}
                  onChange={(e) => setCorpForm({ ...corpForm, count: e.target.value })}
                  className="builder-input"
                >
                  <option value="25">25 - 50 Boxes</option>
                  <option value="100">50 - 200 Boxes</option>
                  <option value="500">200+ Corporate Hamper Trunks</option>
                </select>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', marginTop: '12px' }}>
                <Send size={16} />
                <span>Submit Corporate Inquiry</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
