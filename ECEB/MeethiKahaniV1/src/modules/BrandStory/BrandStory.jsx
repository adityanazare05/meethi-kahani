import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, Award, ShieldCheck } from 'lucide-react';

export const BrandStory = () => {
  const { navigateTo } = useStore();

  return (
    <div>
      <section className="gifting-hero">
        <div className="container">
          <span style={{ fontSize: '11px', letterSpacing: '2px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', fontWeight: 800 }}>
            Our Heritage Kahani
          </span>
          <h2 style={{ fontSize: '36px', color: '#ffffff', margin: '6px 0 12px' }}>
            Handcrafted Eggless Perfection
          </h2>
          <p style={{ maxWidth: '580px', margin: '0 auto', fontSize: '14.5px', opacity: 0.85 }}>
            Crafting the richest, most decadent cookies in Mumbai using 100% vegetarian ingredients.
          </p>
        </div>
      </section>

      <div className="container" style={{ padding: '48px 20px', maxWidth: '760px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '28px' }}>
          <h3 style={{ fontSize: '22px', color: 'var(--crimson-red)', marginBottom: '12px' }}>
            Baked Fresh Daily in Small Batches
          </h3>

          <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: '16px' }}>
            At <b>Meethi Kahani</b>, we believe every cookie tells a Kahani. In a world of mass-produced factory snacks, we set out to restore the sacred art of baking fresh daily.
          </p>

          <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: '24px' }}>
            Our kitchen in Mumbai operates on a <b>strict 100% Pure Eggless guarantee</b>. We source single-origin Belgian chocolate, hand-picked Kashmiri saffron, organic farm butter, and Iranian pistachios.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', textAlign: 'center', margin: '24px 0' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <ShieldCheck size={28} color="var(--crimson-red)" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontWeight: 700, fontSize: '13px' }}>100% Pure Veg</div>
              <div style={{ fontSize: '11px', color: 'var(--muted-grey)', marginTop: '2px' }}>Zero egg substitutes</div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <Sparkles size={28} color="var(--crimson-red)" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontWeight: 700, fontSize: '13px' }}>Artisanal Baking</div>
              <div style={{ fontSize: '11px', color: 'var(--muted-grey)', marginTop: '2px' }}>Small-batch baking</div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <Award size={28} color="var(--text-primary)" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontWeight: 700, fontSize: '13px' }}>Mumbai Express</div>
              <div style={{ fontSize: '11px', color: 'var(--muted-grey)', marginTop: '2px' }}>Same-day delivery</div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button className="btn-primary" onClick={() => navigateTo('/')} style={{ padding: '12px 24px' }}>
              Explore Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
