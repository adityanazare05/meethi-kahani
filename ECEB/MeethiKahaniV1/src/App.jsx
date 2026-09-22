import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { HeaderNav } from './modules/HeaderNav/HeaderNav';
import { HeroBanner } from './modules/HeroBanner/HeroBanner';
import { CouponBar } from './modules/CouponBar/CouponBar';
import { UspBar } from './modules/UspBar/UspBar';
import { ProductCatalog } from './modules/ProductCatalog/ProductCatalog';
import { CartPayment } from './modules/CartPayment/CartPayment';
import { CustomerPortal } from './modules/CustomerPortal/CustomerPortal';
import { GiftingHub } from './modules/GiftingHub/GiftingHub';
import { BrandStory } from './modules/BrandStory/BrandStory';
import { AdminPortal } from './modules/AdminPortal/AdminPortal';
import { SellerPortal } from './modules/SellerPortal/SellerPortal';
import { SupabaseStatusModal } from './modules/SupabaseStatus/SupabaseStatusModal';
import { X, BookOpen } from 'lucide-react';

const MainLayout = () => {
  const {
    activeRoute,
    activeKahaniModalCookie,
    setActiveKahaniModalCookie,
    navigateTo,
    supabaseStatus,
    isSupabaseModalOpen,
    setIsSupabaseModalOpen
  } = useStore();

  // Hidden Keyboard Shortcuts for Internal Access:
  // Ctrl + Shift + A -> Admin Portal
  // Ctrl + Shift + K -> Kitchen / Seller Portal
  // Ctrl + Shift + D -> Database Hub
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        if (e.key.toLowerCase() === 'a') {
          e.preventDefault();
          navigateTo('/admin');
        } else if (e.key.toLowerCase() === 'k') {
          e.preventDefault();
          navigateTo('/seller');
        } else if (e.key.toLowerCase() === 'd') {
          e.preventDefault();
          setIsSupabaseModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateTo, setIsSupabaseModalOpen]);

  return (
    <div className="app-main-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <HeaderNav />

      {/* 100% Customer View Routes */}
      <main style={{ flexGrow: 1, backgroundColor: 'var(--bg-primary)' }}>
        {activeRoute === '/' && (
          <>
            <HeroBanner />
            <CouponBar />
            <UspBar />
            <ProductCatalog />
          </>
        )}

        {activeRoute === '/gifting' && <GiftingHub />}
        {activeRoute === '/product/:slug' && <ProductCatalog />}
        {activeRoute === '/story' && <BrandStory />}
        {activeRoute === '/admin' && <AdminPortal />}
        {activeRoute === '/seller' && <SellerPortal />}
      </main>

      <CustomerPortal />
      <CartPayment />

      {/* Supabase Connection Hub Modal */}
      <SupabaseStatusModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        supabaseStatus={supabaseStatus}
      />

      {/* Artisan Kahani Narrative Modal */}
      {activeKahaniModalCookie && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px', backgroundColor: 'var(--bg-card)' }}>
            <button className="close-btn" onClick={() => setActiveKahaniModalCookie(null)}>
              <X size={16} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
              <span className="badge-eggless" style={{ marginBottom: '6px' }}>
                <span className="badge-eggless-icon"></span> 100% Pure Eggless
              </span>
              <h3 style={{ fontSize: '20px', color: 'var(--text-primary)' }}>
                {activeKahaniModalCookie.name}
              </h3>
            </div>

            <img
              src={(activeKahaniModalCookie.photoUrls && activeKahaniModalCookie.photoUrls[0]) ? activeKahaniModalCookie.photoUrls[0] : '/images/saffron-pistachio.png'}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/saffron-pistachio.png';
              }}
              alt={activeKahaniModalCookie.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '14px' }}
            />

            <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--crimson-red)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <BookOpen size={14} />
                <span>Artisan Cookie Kahani</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.5 }}>
                "{activeKahaniModalCookie.kahaniText}"
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--crimson-red)' }}>₹{activeKahaniModalCookie.price}</span>
              <button
                className="btn-primary"
                onClick={() => {
                  setActiveKahaniModalCookie(null);
                  navigateTo('/product/:slug', activeKahaniModalCookie.slug);
                }}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Minimal Footer */}
      <footer style={{ background: 'var(--text-primary)', color: '#ffffff', padding: '36px 0 20px', borderTop: '2px solid var(--crimson-red)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '28px' }}>
            <div>
              <img src="/logo-transparent.png" alt="Meethi Kahani" style={{ height: '48px', width: 'auto', marginBottom: '8px', filter: 'brightness(0) invert(1)' }} />
              <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                Handcrafted eggless cookies baked daily in Mumbai. 100% Pure Vegetarian.
              </p>
            </div>

            <div>
              <h4 style={{ color: '#ffffff', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                Navigation
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px' }}>
                <li style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.8)' }} onClick={() => navigateTo('/')}>🍪 Storefront</li>
                <li style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.8)' }} onClick={() => navigateTo('/gifting')}>🎁 Gifting Hub</li>
                <li style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.8)' }} onClick={() => navigateTo('/story')}>📖 Our Kahani</li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#ffffff', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                Connect With Us
              </h4>
              <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                📍 Mumbai, Maharashtra<br />
                📞 +91 98200 98200<br />
                ✉️ hello@meethikahani.com
              </p>
            </div>

            <div>
              <h4 style={{ color: '#ffffff', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                Food Safety Policy
              </h4>
              <p style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                Strict No-Refund food safety policy. Replacement tin dispatched within 24 hours upon photo proof of transit damage.
              </p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', textAlign: 'center', fontSize: '11.5px', color: 'rgba(255,255,255,0.5)' }}>
            <span
              style={{ cursor: 'pointer', userSelect: 'none' }}
              onClick={() => navigateTo('/admin')}
              title="Staff Portal (Direct URL /admin or /seller)"
            >
              ©
            </span>{' '}
            2026 Meethi Kahani Foods Pvt Ltd — All Rights Reserved | 100% Pure Eggless Artisanal Cookies
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
