import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, BookOpen, ArrowLeft, Truck, MapPin, Minus, Plus, Sparkles, Check, ShieldCheck, Flame } from 'lucide-react';
import './ProductCatalog.css';

// Direct asset fallbacks
import saffronImg from '../../assets/saffron-pistachio.png';
import darkCocoaImg from '../../assets/dark-cocoa.png';
import roseAlmondImg from '../../assets/rose-almond.png';

const getImageFallback = (cookieName = '', slug = '') => {
  const str = `${cookieName} ${slug}`.toLowerCase();
  if (str.includes('cocoa') || str.includes('dark') || str.includes('chocolate') || str.includes('lava')) {
    return darkCocoaImg || '/images/dark-cocoa.png';
  }
  if (str.includes('rose') || str.includes('almond') || str.includes('peanut') || str.includes('hazelnut')) {
    return roseAlmondImg || '/images/rose-almond.png';
  }
  return saffronImg || '/images/saffron-pistachio.png';
};

export const ProductCatalog = () => {
  const {
    cookies,
    categories,
    activeFilterCategory,
    setActiveFilterCategory,
    addToCart,
    updateCartQty,
    cart,
    setActiveKahaniModalCookie,
    activeRoute,
    selectedProductSlug,
    navigateTo,
    serviceablePincodes
  } = useStore();

  const [activeThumbIndex, setActiveThumbIndex] = useState(0);
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);
  const [selectedPackSizes, setSelectedPackSizes] = useState({});
  const [pdpPackSize, setPdpPackSize] = useState(4);
  const [pdpQty, setPdpQty] = useState(1);
  const [pdpTab, setPdpTab] = useState('kahani');

  const PACK_VARIANTS = [
    { size: 4, label: 'Pack of 4', multiplier: 1 },
    { size: 8, label: 'Pack of 8', multiplier: 1.8 },
    { size: 12, label: 'Pack of 12', multiplier: 2.5 }
  ];

  const getPackSize = (id) => selectedPackSizes[id] || 4;

  const filteredCookies = cookies.filter(cookie => {
    if (cookie.isOnline === false) return false;
    if (activeFilterCategory === 'all') return true;
    const cat = categories.find(c => c.slug === activeFilterCategory || c.id === activeFilterCategory);
    if (cat) {
      return cookie.categoryId === cat.id || cookie.category === cat.slug || cookie.category === cat.id || cookie.categoryId === cat.slug;
    }
    return true;
  });

  const latestBakedCookieId = cookies.length > 0 ? cookies[0].id : null;

  if (activeRoute === '/product/:slug' && selectedProductSlug) {
    const product = cookies.find(c => c.slug === selectedProductSlug);
    if (!product) return <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>Product not found.</div>;

    const photos = product.photoUrls && product.photoUrls.length > 0
      ? product.photoUrls
      : ['/images/saffron-pistachio.png'];

    const packMultiplier = pdpPackSize === 8 ? 1.8 : pdpPackSize === 12 ? 2.5 : 1;
    const calculatedPdpPrice = Math.round(product.price * packMultiplier);
    const totalPrice = calculatedPdpPrice * pdpQty;

    const handlePincodeCheck = () => {
      if (serviceablePincodes.includes(pincodeInput.trim())) {
        setPincodeResult({ success: true, msg: '⚡ 1-Day Express Delivery Available in Mumbai!' });
      } else {
        setPincodeResult({ success: false, msg: 'Standard 2-3 Day Express Shipping to this pincode.' });
      }
    };

    const relatedCookies = cookies.filter(c => c.id !== product.id && c.isOnline).slice(0, 3);

    return (
      <div className="container pdp-section-container">
        {/* Main PDP Card Container */}
        <div className="pdp-main-card">
          <div className="pdp-grid">
            {/* Gallery Column */}
            <div className="pdp-gallery-column">
              <div className="pdp-gallery-main">
                <img src={photos[activeThumbIndex] || photos[0]} alt={product.name} />
                <span className="pdp-stock-badge">🔥 Fresh Bake</span>
              </div>
              {photos.length > 1 && (
                <div className="pdp-thumbnails-row">
                  {photos.map((url, idx) => (
                    <div
                      key={idx}
                      className={`pdp-thumb-box ${activeThumbIndex === idx ? 'active' : ''}`}
                      onClick={() => setActiveThumbIndex(idx)}
                    >
                      <img src={url} alt={`${product.name} thumb ${idx}`} />
                    </div>
                  ))}
                </div>
              )}

              {/* Nutritional Values Breakdown Bar (Right Below Photo) */}
              {(() => {
                const nut = product.nutrition || {
                  servingWeight: '35 g',
                  energy: '165.0 Kcal',
                  protein: '4.5 g',
                  fat: '11.0 g',
                  sugar: '4.0 g'
                };
                return (
                  <div className="pdp-nutrition-card">
                    <div className="nutrition-header">
                      <span className="nutrition-weight">{nut.servingWeight} (1 cookie)</span>
                      <small className="nutrition-disclaimer">*Approximate values, subject to natural variation.</small>
                    </div>

                    <div className="nutrition-metrics-grid">
                      <div className="nutrition-metric-box">
                        <span className="metric-value">{nut.energy}</span>
                        <span className="metric-label">Energy</span>
                      </div>
                      <div className="nutrition-metric-box">
                        <span className="metric-value">{nut.protein}</span>
                        <span className="metric-label">Protein</span>
                      </div>
                      <div className="nutrition-metric-box">
                        <span className="metric-value">{nut.fat}</span>
                        <span className="metric-label">Fat</span>
                      </div>
                      <div className="nutrition-metric-box">
                        <span className="metric-value">{nut.sugar}</span>
                        <span className="metric-label">Sugar</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Product Details Info Column */}
            <div className="pdp-info-column">
              <div className="pdp-header-block">
                <div className="pdp-tags-row">
                  <span className="pdp-tag-pill">🌱 100% Pure Eggless</span>
                </div>

                <h1 className="pdp-title">{product.name}</h1>
                <div className="pdp-price-row">
                  <span className="pdp-price">₹{totalPrice}</span>
                  <span className="pdp-pieces-sub">({pdpPackSize} Pcs Box)</span>
                </div>
              </div>

              {/* Pack Variant Selector */}
              <div className="pdp-variant-selector">
                <label className="pdp-selector-label">Select Box Size:</label>
                <div className="pdp-pack-buttons">
                  {[4, 8, 12].map(size => (
                    <button
                      key={size}
                      className={`pdp-pack-btn ${pdpPackSize === size ? 'active' : ''}`}
                      onClick={() => setPdpPackSize(size)}
                    >
                      <span>Pack of {size}</span>
                      <span className="pack-sub">({size} Pcs)</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pincode Checker Widget */}
              <div className="pdp-pincode-widget">
                <label className="pdp-selector-label">
                  <Truck size={14} /> Mumbai Express Delivery Pincode:
                </label>
                <div className="pdp-pincode-input-group">
                  <input
                    type="text"
                    placeholder="Enter 6-digit Pincode (e.g. 400050)"
                    maxLength={6}
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value)}
                  />
                  <button className="btn-outline" onClick={handlePincodeCheck}>Verify</button>
                </div>
                {pincodeResult && (
                  <div className={`pdp-pincode-msg ${pincodeResult.success ? 'success' : 'error'}`}>
                    {pincodeResult.msg}
                  </div>
                )}
              </div>

              {/* Add to Cart Actions */}
              <div className="pdp-actions-row">
                <div className="pdp-qty-stepper">
                  <button onClick={() => setPdpQty(Math.max(1, pdpQty - 1))}>
                    <Minus size={14} />
                  </button>
                  <span>{pdpQty}</span>
                  <button onClick={() => setPdpQty(pdpQty + 1)}>
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  className="btn-primary pdp-add-btn"
                  onClick={() => {
                    const selectedPackObj = { size: pdpPackSize, price: calculatedPdpPrice, label: `Pack of ${pdpPackSize}` };
                    addToCart(product, pdpQty, true, selectedPackObj);
                  }}
                  disabled={product.stockPieces <= 0}
                >
                  <ShoppingBag size={18} />
                  <span>{product.stockPieces > 0 ? `Add ${pdpQty} to Cart • ₹${totalPrice}` : 'Out of Stock'}</span>
                </button>
              </div>

              {/* Chef's Artisanal Recipe & Taste Spectrum Section */}
              <div className="pdp-recipe-card">
                {/* Header Quote Block */}
                <div className="pdp-recipe-quote-block">
                  <div className="recipe-quote-badge">
                    <BookOpen size={13} />
                    <span>The Artisan Kahani</span>
                  </div>
                  <blockquote className="recipe-quote-text">
                    "{product.kahaniText}"
                  </blockquote>
                </div>

                {/* Taste Spectrum Intensity Bars */}
                <div className="pdp-spectrum-block">
                  <h4 className="spectrum-title">
                    <Sparkles size={14} color="var(--crimson-red)" />
                    <span>Flavor Spectrum & Intensity</span>
                  </h4>

                  <div className="spectrum-bars-list">
                    <div className="spectrum-item">
                      <div className="spectrum-label-row">
                        <span>Molten Core Ooziness</span>
                        <span className="spectrum-val">95%</span>
                      </div>
                      <div className="spectrum-bar-track">
                        <div className="spectrum-bar-fill" style={{ width: '95%' }}></div>
                      </div>
                    </div>

                    <div className="spectrum-item">
                      <div className="spectrum-label-row">
                        <span>Butter Richness & Indulgence</span>
                        <span className="spectrum-val">90%</span>
                      </div>
                      <div className="spectrum-bar-track">
                        <div className="spectrum-bar-fill" style={{ width: '90%' }}></div>
                      </div>
                    </div>

                    <div className="spectrum-item">
                      <div className="spectrum-label-row">
                        <span>Sweetness Balance</span>
                        <span className="spectrum-val">75%</span>
                      </div>
                      <div className="spectrum-bar-track">
                        <div className="spectrum-bar-fill" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Taste Note Pills */}
                  {product.tasteNotes && product.tasteNotes.length > 0 && (
                    <div className="pdp-taste-pills-row">
                      {product.tasteNotes.map((note, idx) => (
                        <span key={idx} className="pdp-recipe-pill">
                          <Check size={12} color="var(--crimson-red)" />
                          {note}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Chef's Sourcing & Spec Grid */}
                <div className="pdp-sourcing-specs-grid">
                  <div className="sourcing-spec-box">
                    <ShieldCheck size={16} color="var(--crimson-red)" />
                    <div>
                      <strong>100% Pure Veg Guarantee:</strong>
                      <p>Pure dairy grass-fed butter dough with zero egg substitutes.</p>
                    </div>
                  </div>

                  <div className="sourcing-spec-box">
                    <Flame size={16} color="var(--crimson-red)" />
                    <div>
                      <strong>Chef's Serving Tip:</strong>
                      <p>Microwave 8–10 secs to awaken warm, flowing molten core.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  return (
    <section className="catalog-section" id="catalog-section">
      <div className="container">
        <div className="catalog-header">
          <div className="script-tagline" style={{ marginBottom: '6px' }}>
            Ooey-Gooey Melted Core Inside Every Cookie! 🔥
          </div>
          <h2 className="catalog-title">Molten-Core Signature SKUs</h2>
          <p className="catalog-description">
            100% Pure Eggless. Slow-baked fresh every hour in small batches in Mumbai. Every single cookie is stuffed with a warm, oozy molten lava center!
          </p>

          <div className="category-tabs">
            <button
              className={`tab-btn ${activeFilterCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilterCategory('all')}
            >
              All ({cookies.filter(c => c.isOnline).length})
            </button>

            {categories.filter(c => c.isOnline).map(cat => (
              <button
                key={cat.id}
                className={`tab-btn ${activeFilterCategory === cat.slug ? 'active' : ''}`}
                onClick={() => setActiveFilterCategory(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {filteredCookies.map(cookie => {
            const isLatestBaked = cookie.id === latestBakedCookieId;
            const isLowStock = cookie.stockPieces > 0 && cookie.stockPieces <= 10;
            const isOutOfStock = cookie.stockPieces <= 0;

            const packSize = getPackSize(cookie.id);
            const packObj = PACK_VARIANTS.find(p => p.size === packSize) || PACK_VARIANTS[0];
            const calculatedPrice = Math.round(cookie.price * packObj.multiplier);

            const cartKey = `${cookie.id}-${packSize}`;
            const cartItem = cart.find(i => (i.cartKey ? i.cartKey === cartKey : (i.id === cookie.id && i.packSize === packSize)));
            const currentQtyInCart = cartItem ? cartItem.qty : 0;

            return (
              <div key={cookie.id} className="product-card">
                <div
                  className="product-image-box"
                  onClick={() => navigateTo('/product/:slug', cookie.slug)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    className="product-image"
                    src={(cookie.photoUrls && cookie.photoUrls[0]) ? cookie.photoUrls[0] : getImageFallback(cookie.name, cookie.slug)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getImageFallback(cookie.name, cookie.slug);
                    }}
                    alt={cookie.name}
                  />

                  {isLatestBaked && !isOutOfStock ? (
                    <span className="stock-tag" style={{ background: 'var(--crimson-red)' }}>🔥 Freshly Baked</span>
                  ) : isOutOfStock ? (
                    <span className="stock-tag">Out of Stock</span>
                  ) : isLowStock ? (
                    <span className="stock-tag low">🔥 Only {cookie.stockPieces} Left</span>
                  ) : null}
                </div>

                <div className="product-content">
                  <h3
                    className="product-name"
                    onClick={() => navigateTo('/product/:slug', cookie.slug)}
                    style={{ cursor: 'pointer' }}
                  >
                    {cookie.name}
                  </h3>

                  <div className="product-price-row">
                    <span className="product-price">₹{calculatedPrice}</span>
                  </div>

                  {/* Variant Selection Pills */}
                  <div className="variant-pills-row">
                    {PACK_VARIANTS.map(v => (
                      <button
                        key={v.size}
                        className={`variant-pill-tag ${packSize === v.size ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPackSizes(prev => ({ ...prev, [cookie.id]: v.size }));
                        }}
                      >
                        {v.size} Pcs
                      </button>
                    ))}
                  </div>

                  {cookie.tasteNotes && cookie.tasteNotes.length > 0 && (
                    <div className="product-taste-tags">
                      {cookie.tasteNotes.slice(0, 2).map((note, idx) => (
                        <span key={idx} className="taste-tag-pill">{note}</span>
                      ))}
                    </div>
                  )}

                  {/* Action Area: Morphing Button */}
                  <div className="product-card-actions">
                    {currentQtyInCart > 0 ? (
                      <div className="in-card-qty-controller">
                        <button
                          className="in-cart-qty-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateCartQty(cartItem.cartKey || cartItem.id, -1);
                          }}
                          aria-label="Decrease Cart Quantity"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="in-cart-qty-text">
                          {currentQtyInCart} in Cart
                        </span>

                        <button
                          className="in-cart-qty-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateCartQty(cartItem.cartKey || cartItem.id, 1);
                          }}
                          aria-label="Increase Cart Quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn-primary"
                        style={{ width: '100%' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(cookie, 1, false, { size: packSize, label: packObj.label, price: calculatedPrice });
                        }}
                        disabled={isOutOfStock}
                      >
                        <ShoppingBag size={16} />
                        <span>{isOutOfStock ? 'Sold Out' : '+ Add to Cart'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
