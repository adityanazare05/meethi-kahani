import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './HeroBanner.css';

export const HeroBanner = () => {
  const { heroBanners, navigateTo } = useStore();
  const activeBanners = heroBanners ? heroBanners.filter(b => b && b.isActive) : [];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play timer for active admin banners (strictly 1 image at a time)
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const handleNextSlide = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % activeBanners.length);
  };

  const handlePrevSlide = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleBannerClick = (ctaLink) => {
    if (!ctaLink) return;
    if (ctaLink.startsWith('/')) {
      navigateTo(ctaLink);
    } else if (ctaLink.startsWith('#')) {
      const targetEl = document.querySelector(ctaLink);
      if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.open(ctaLink, '_blank');
    }
  };

  return (
    <section className="hero-section-wrapper">
      <div className="container">
        {/* Framed Tile-like Single Image Scroller */}
        <div className="hero-tile-container">
          <div
            className="hero-slider-track"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {activeBanners.map((banner, idx) => (
              <div key={banner.id || idx} className="hero-slide-item">
                <div
                  className="hero-banner-link"
                  onClick={() => handleBannerClick(banner.ctaLink)}
                >
                  <img
                    src={banner.imageDesktop || banner.image || banner.bgImage || '/images/saffron-pistachio.png'}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/saffron-pistachio.png';
                    }}
                    alt={banner.headline || banner.title || `Meethi Kahani Banner ${idx + 1}`}
                    className="hero-banner-img"
                  />

                  {(banner.headline || banner.title) && (
                    <div className="hero-banner-content-overlay">
                      {banner.tag && <span className="hero-banner-tag-badge">{banner.tag}</span>}
                      <h2 className="hero-banner-title-text">{banner.headline || banner.title}</h2>
                      {(banner.subtitle || banner.description) && (
                        <p className="hero-banner-subtitle-text">{banner.subtitle || banner.description}</p>
                      )}
                      {banner.ctaText && (
                        <span className="hero-banner-cta-chip">
                          {banner.ctaText} →
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls (If multiple admin banners exist) */}
          {activeBanners.length > 1 && (
            <>
              <button
                className="hero-arrow-btn left"
                onClick={handlePrevSlide}
                aria-label="Previous Banner"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                className="hero-arrow-btn right"
                onClick={handleNextSlide}
                aria-label="Next Banner"
              >
                <ChevronRight size={22} />
              </button>

              <div className="hero-indicators">
                {activeBanners.map((_, idx) => (
                  <div
                    key={idx}
                    className={`indicator-dot ${idx === currentIndex ? 'active' : ''}`}
                    onClick={(e) => {
                      if (e) e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
