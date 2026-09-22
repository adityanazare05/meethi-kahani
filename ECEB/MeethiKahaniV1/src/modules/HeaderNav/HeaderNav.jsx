import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, User, Menu, X, Sparkles, ArrowRight, Heart, Database } from 'lucide-react';
import './HeaderNav.css';

export const HeaderNav = () => {
  const {
    cartCount,
    setIsCartOpen,
    setIsAccountOpen,
    isDrawerOpen,
    setIsDrawerOpen,
    activeRoute,
    navigateTo,
    setActiveFilterCategory,
    setIsSupabaseModalOpen,
    supabaseStatus
  } = useStore();

  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const isSupabaseConnected = supabaseStatus === 'connected';

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroEl = document.querySelector('.hero-wrapper');
      const threshold = heroEl ? heroEl.getBoundingClientRect().height : 300;

      if (currentScrollY > threshold && currentScrollY > lastScrollY) {
        setIsHeaderHidden(true);
      } else {
        setIsHeaderHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header-wrapper ${isHeaderHidden ? 'hidden' : ''}`}>
      <div className="header-top-bar">
        100% PURE EGGLESS GUARANTEE | Fresh Batch Baked Daily in Mumbai | Free Shipping Over ₹499
      </div>

      <div className="container">
        <nav className="header-nav">
          <div className="header-left">
            <button
              className="icon-btn"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="header-logo-container" onClick={() => navigateTo('/')}>
            <img src="/logo-cream.png" alt="Meethi Kahani Logo" className="header-logo-img" />
          </div>

          <div className="header-right">
            <button className="icon-btn" onClick={() => setIsAccountOpen(true)} aria-label="Open Customer Account">
              <User size={20} />
            </button>

            <button
              className="icon-btn cart-btn-relative"
              onClick={() => setIsCartOpen(true)}
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </nav>
      </div>

      {isDrawerOpen && createPortal(
        <>
          <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="drawer-content">
            <div className="drawer-top-section">
              <div className="drawer-header">
                <button
                  className="drawer-close-btn"
                  onClick={() => setIsDrawerOpen(false)}
                  aria-label="Close Navigation Menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="drawer-section-title">Navigation</div>
              <div className="drawer-nav-list">
                <button
                  className={`drawer-nav-item ${activeRoute === '/' ? 'active' : ''}`}
                  onClick={() => {
                    setIsDrawerOpen(false);
                    navigateTo('/');
                  }}
                >
                  <span>Storefront</span>
                  <ArrowRight className="drawer-arrow-icon" />
                </button>

                <button
                  className={`drawer-nav-item ${activeRoute === '/gifting' ? 'active' : ''}`}
                  onClick={() => {
                    setIsDrawerOpen(false);
                    navigateTo('/gifting');
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Gifting Hub</span>
                    <Sparkles size={16} color="var(--crimson-red)" />
                  </div>
                  <ArrowRight className="drawer-arrow-icon" />
                </button>

                <button
                  className={`drawer-nav-item ${activeRoute === '/story' ? 'active' : ''}`}
                  onClick={() => {
                    setIsDrawerOpen(false);
                    navigateTo('/story');
                  }}
                >
                  <span>Our Kahani</span>
                  <ArrowRight className="drawer-arrow-icon" />
                </button>
              </div>

              <div className="drawer-categories-block">
                <div className="drawer-section-title">Quick Categories</div>
                <div className="drawer-pills-grid">
                  <button
                    className="drawer-pill-tag"
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setActiveFilterCategory('all');
                      navigateTo('/');
                    }}
                  >
                    🍪 All 9 Molten SKUs
                  </button>

                  <button
                    className="drawer-pill-tag"
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setActiveFilterCategory('regular-luxury');
                      navigateTo('/');
                    }}
                  >
                    ✨ Regular Luxury
                  </button>

                  <button
                    className="drawer-pill-tag"
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setActiveFilterCategory('protein-oats');
                      navigateTo('/');
                    }}
                  >
                    💪 High-Protein Oats
                  </button>

                  <button
                    className="drawer-pill-tag"
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setActiveFilterCategory('sugar-free');
                      navigateTo('/');
                    }}
                  >
                    🌱 Sugar-Free Series
                  </button>
                </div>
              </div>
            </div>

            <div className="drawer-bottom-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--crimson-red)', fontSize: '13px' }}>
                <Heart size={15} fill="var(--crimson-red)" />
                <span>100% Pure Eggless Guarantee</span>
              </div>
              <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Slow-baked daily in small batches in Mumbai. Free delivery on orders over ₹499.
              </p>
            </div>
          </div>
        </>,
        document.body
      )}
    </header>
  );
};
