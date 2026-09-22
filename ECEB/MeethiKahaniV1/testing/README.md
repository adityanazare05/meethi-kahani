# Testing & Collaboration Lab (Meethi Kahani)

Welcome to the **Testing & Collaboration Space**! 

This folder is designed to help you and your 4 team members test components, understand how team collaboration works, and integrate code without breaking the main application.

---

## 📁 Suggested Modular Structure for Your 4-Member Team

```
MeethiKahaniV1/
├── src/
│   ├── context/
│   │   └── StoreContext.jsx      <-- SHARED DATA & STATE (All devs import this)
│   ├── modules/
│   │   ├── HeaderNav/            <-- DEV 1 WORKSPACE (Header, Navigation, Logo)
│   │   ├── HeroBanner/           <-- DEV 1 WORKSPACE (Hero Carousel & Freshness Ticker)
│   │   ├── ProductCatalog/       <-- DEV 2 WORKSPACE (Cookie Cards, Categories, PDP)
│   │   ├── CartPayment/          <-- DEV 3 WORKSPACE (Cart Drawer, Pincode, Payment Modal)
│   │   ├── CustomerPortal/       <-- DEV 3 WORKSPACE (Reviews Carousel, Account Tracker)
│   │   ├── AdminPortal/          <-- DEV 4 WORKSPACE (Admin Dashboard, Banners, Analytics)
│   │   └── SellerPortal/         <-- DEV 4 WORKSPACE (Kitchen Orders, Stock Manager)
│   └── App.jsx                   <-- MASTER INTEGRATOR (Assembles all 4 modules)
└── testing/                      <-- YOUR SANDBOX FOR EXPERIMENTS
```

---

## 🤝 Simple 3-Step Collaborative Rules for Beginners

1. **Rule #1: Stay in Your Own Folder**
   - Each developer ONLY creates and edits files inside their assigned folder under `src/modules/`.
   - Never edit another developer's module folder directly.

2. **Rule #2: Shared Store Context**
   - All state (cart items, active page, product list) comes from `StoreContext.jsx`.

3. **Rule #3: Test Before Merging**
   - Create small test components in `testing/` or test your module individually before plugging it into `App.jsx`.
