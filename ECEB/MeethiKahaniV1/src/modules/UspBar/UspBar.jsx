import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Flame, Crown, Gift, ArrowRight } from 'lucide-react';
import './UspBar.css';

export const UspBar = () => {
  const { navigateTo } = useStore();

  const kahaniList = [
    {
      id: 'eggless',
      icon: ShieldCheck,
      number: '01',
      badge: '100% Pure Eggless Guarantee',
      headline: 'No Eggs.\nZero Compromise.',
      scriptTagline: 'Pure vegetarian perfection baked with 100% dairy butter!',
      storyText: 'We believe true luxury never requires egg substitutes. Every batch of Meethi Kahani cookies is crafted with pure grass-fed butter, rich cream, and unbleached flour — guaranteed 100% vegetarian.',
      image: '/images/saffron-pistachio.png',
      watermark: 'PURE VEG',
      starburst: '100% EGGLESS',
      ctaText: 'Shop Pure Veg Collection',
      ctaRoute: '/',
      imagePosition: 'right'
    },
    {
      id: 'fresh-hourly',
      icon: Flame,
      number: '02',
      badge: 'Freshly Baked Every Hour',
      headline: 'Baked Fresh Every Hour.\nNever Stored.',
      scriptTagline: 'Smell the warm butter straight from our Mumbai ovens!',
      storyText: 'We bake fresh batches every single hour as orders roll in. We never store old stock or ship warehouse-stored cookies — you always get warm, crisp cookies baked on demand for maximum flavor and melt-in-mouth texture.',
      image: '/images/dark-cocoa.png',
      watermark: 'HOURLY BAKE',
      starburst: 'FRESH BATCH',
      ctaText: 'Order Freshly Baked Batch',
      ctaRoute: '/',
      imagePosition: 'left'
    },
    {
      id: 'royal',
      icon: Crown,
      number: '03',
      badge: 'Royal Saffron & Cocoa',
      headline: 'Kashmiri Saffron &\nBelgian Dark Cocoa.',
      scriptTagline: 'Only the world’s finest ingredients in every single bite!',
      storyText: 'Handpicked Kashmiri Lacha saffron threads, roasted California pistachios, and single-origin 70% Belgian chocolate chips create an unmistakable royal flavor profile.',
      image: '/images/rose-almond.png',
      watermark: 'ROYAL',
      starburst: 'LUXURY BITE',
      ctaText: 'Explore Royal Flavors',
      ctaRoute: '/',
      imagePosition: 'right'
    },
    {
      id: 'packaging',
      icon: Gift,
      number: '04',
      badge: 'Vintage Keepsake Tins',
      headline: 'Sealed in Vintage\nKeepsake Tins.',
      scriptTagline: 'Gift memories that last long after the last cookie is gone!',
      storyText: 'Packaged in royal airtight tin caddies sealed with love. Perfect for luxury corporate gifting, weddings, anniversaries, and festive family celebrations.',
      image: '/images/gift-box.png',
      watermark: 'KEEPSAKE',
      starburst: 'ROYAL GIFT',
      ctaText: 'Explore Gift Hampers',
      ctaRoute: '/gifting',
      imagePosition: 'left'
    }
  ];

  return (
    <section className="usp-kahani-section">
      <div className="container">
        {/* Section Title Header */}
        <div className="usp-kahani-header">
          <div className="script-tagline" style={{ marginBottom: '4px' }}>
            Har Cookie Ki Ek Meethi Kahani... ✨
          </div>
          <h2 className="usp-kahani-main-title">
            The 4 Promises Behind Our Artisanal Bake
          </h2>
          <p className="usp-kahani-sub-title">
            Scroll through our Kahani to see why every bite of Meethi Kahani is an unforgettable royal experience.
          </p>
        </div>

        {/* Scrolling Alternating Billboard Stack */}
        <div className="usp-scroller-stack">
          {kahaniList.map((item) => (
            <div
              key={item.id}
              className={`usp-billboard-card ${item.imagePosition === 'left' ? 'reverse-layout' : ''}`}
            >
              {/* Left Cream Story Content */}
              <div className="usp-billboard-left">
                <div className="badge-eggless" style={{ width: 'fit-content', marginBottom: '16px' }}>
                  <span className="badge-eggless-icon"></span> Meethi Kahani Promise #{item.number} — {item.badge}
                </div>

                <h3 className="usp-billboard-headline">
                  {item.headline.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </h3>

                <div className="usp-script-tagline">
                  "{item.scriptTagline}"
                </div>

                <p className="usp-story-text" style={{ marginBottom: 0 }}>
                  {item.storyText}
                </p>
              </div>

              {/* Right Vibrant Red Block Showcase */}
              <div className="usp-billboard-right">
                <div className="usp-watermark">{item.watermark}</div>

                <div className="usp-cookie-img-box">
                  <img
                    src={item.image || '/images/saffron-pistachio.png'}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/saffron-pistachio.png';
                    }}
                    alt={item.badge}
                    className="usp-cookie-img"
                  />
                </div>

                <div className="starburst-badge usp-starburst-pos">
                  {item.starburst}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
