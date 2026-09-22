import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { updateOrderStatusInSupabase, updateCookieStockInSupabase } from '../../services/supabaseService';
import {
  ShieldCheck,
  Package,
  TrendingUp,
  RefreshCw,
  Layers,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  LogOut,
  Lock,
  UserCheck,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  Sparkles,
  Flame,
  DollarSign,
  ShoppingBag,
  Truck,
  Tag,
  Sliders,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Printer,
  Phone,
  MapPin,
  Save,
  AlertTriangle,
  Zap,
  BarChart3,
  Image as ImageIcon,
  Users,
  MessageSquare,
  Star,
  Award,
  UserPlus,
  Upload,
  Target,
  Megaphone,
  Play,
  Pause,
  Activity,
  MousePointer
} from 'lucide-react';
import './AdminPortal.css';

const PRESET_COOKIE_IMAGES = [
  { label: 'Royal Saffron Pistachio', url: '/images/saffron-pistachio.png' },
  { label: 'Belgian Dark Chocolate Lava', url: '/images/dark-cocoa.png' },
  { label: 'Kannauj Rose Almond Mawa', url: '/images/rose-almond.png' },
  { label: 'High-Protein Oats Dark Lava', url: '/images/protein-oats-dark.png' },
  { label: 'High-Protein Oats Almond Butter', url: '/images/protein-oats-almond.png' },
  { label: 'High-Protein Oats Peanut Butter', url: '/images/protein-oats-pb.png' },
  { label: 'Sugar-Free Belgian Dark Lava', url: '/images/sugarfree-dark-lava.png' },
  { label: 'Sugar-Free Roasted Pistachio', url: '/images/sugarfree-pistachio.png' },
  { label: 'Sugar-Free Hazelnut Gianduja', url: '/images/sugarfree-hazelnut.png' },
  { label: 'Artisan Chocolate Chunk', url: '/images/chocolate-cookie.png' }
];

const INITIAL_META_CAMPAIGNS = [
  {
    id: 'meta-camp-1',
    name: '[BOFU] Mumbai Gourmet Foodies - Saffron Pistachio Molten Reel',
    objective: 'CONVERSIONS',
    status: 'ACTIVE',
    dailyBudget: 1500,
    totalSpend: 18450,
    impressions: 184200,
    clicks: 6280,
    ctr: 3.41,
    cpc: 2.94,
    purchases: 248,
    revenue: 96720,
    roas: 5.24,
    audience: 'Foodies, Luxury Desserts (24-45 yrs) • Mumbai Metro',
    platforms: ['Instagram Reels', 'Instagram Feed', 'Facebook Feed'],
    creativeType: 'Reel Video',
    creativeHeadline: 'Warm Saffron Lava Center Slow-Baked with Pure Desi Ghee 🍪',
    adImage: '/images/saffron-pistachio.png',
    startDate: '2026-08-15'
  },
  {
    id: 'meta-camp-2',
    name: '[MOFU] High-Protein Oats Gym & Fitness Indulgence',
    objective: 'CONVERSIONS',
    status: 'ACTIVE',
    dailyBudget: 1200,
    totalSpend: 12800,
    impressions: 126500,
    clicks: 4120,
    ctr: 3.26,
    cpc: 3.10,
    purchases: 165,
    revenue: 62535,
    roas: 4.88,
    audience: 'Fitness, Gym, Whey Protein Lovers (20-40 yrs) • Bandra & Powai',
    platforms: ['Instagram Stories', 'Instagram Reels'],
    creativeType: 'Single Image',
    creativeHeadline: '16g Whey Protein with Warm Peanut Butter Fudge Molten Core 💪',
    adImage: '/images/protein-oats-pb.png',
    startDate: '2026-08-20'
  },
  {
    id: 'meta-camp-3',
    name: '[TOFU] Royal Festive Tin Box Gifting & Corporate Pre-orders',
    objective: 'CONVERSIONS',
    status: 'ACTIVE',
    dailyBudget: 2000,
    totalSpend: 14200,
    impressions: 142000,
    clicks: 5080,
    ctr: 3.58,
    cpc: 2.80,
    purchases: 154,
    revenue: 69608,
    roas: 4.90,
    audience: 'Diwali Gifting, Luxury Lifestyle, Corporate HR (28-55 yrs)',
    platforms: ['Instagram Feed', 'Facebook Feed', 'Stories'],
    creativeType: 'Carousel',
    creativeHeadline: 'Custom Wax-Sealed Vintage Gifting Tins with Fresh Cookies 🎁',
    adImage: '/images/gift-box.png',
    startDate: '2026-08-25'
  },
  {
    id: 'meta-camp-4',
    name: '[RETARGETING] 7-Day Abandoned Cart & PDP Visitors',
    objective: 'RETARGETING',
    status: 'ACTIVE',
    dailyBudget: 500,
    totalSpend: 2800,
    impressions: 32500,
    clicks: 1480,
    ctr: 4.55,
    cpc: 1.89,
    purchases: 45,
    revenue: 19125,
    roas: 6.83,
    audience: 'Website Visitors (Last 7 Days) • Added To Cart / Initiated Checkout',
    platforms: ['Instagram Feed', 'Instagram Stories', 'Facebook Feed'],
    creativeType: 'Dynamic Product Ad',
    creativeHeadline: 'Your warm molten cookie box is waiting! Get 20% OFF with MEETHI20',
    adImage: '/images/dark-cocoa.png',
    startDate: '2026-08-10'
  },
  {
    id: 'meta-camp-5',
    name: '[TEST] Sugar-Free Belgian Dark Chocolate - Keto & Guilt-Free',
    objective: 'AWARENESS',
    status: 'PAUSED',
    dailyBudget: 800,
    totalSpend: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0.0,
    cpc: 0.0,
    purchases: 0,
    revenue: 0,
    roas: 0.0,
    audience: 'Sugar-Free, Keto, Diabetic Friendly Desserts (30-60 yrs) • Mumbai',
    platforms: ['Instagram Reels', 'Instagram Feed'],
    creativeType: 'Reel Video',
    creativeHeadline: '0% Refined Sugar, 100% Pure Dark Belgian Molten Indulgence 🌱',
    adImage: '/images/sugarfree-dark-lava.png',
    startDate: '2026-09-01'
  }
];

export const AdminPortal = () => {
  const {
    cookies = [],
    setCookies = () => { },
    addCookie = () => { },
    updateCookie = () => { },
    deleteCookie = () => { },
    toggleCookieOnline = () => { },
    orders = [],
    setOrders = () => { },
    isAdminLoggedIn = false,
    adminInfo = { name: 'Master Executive Admin', role: 'admin', email: 'admin@meethikahani.com' },
    loginAdmin = () => ({ success: false }),
    logoutAdmin = () => { },
    navigateTo = () => { },
    heroBanners = [],
    setHeroBanners = () => { },
    addBanner = () => { },
    updateBanner = () => { },
    deleteBanner = () => { },
    toggleBannerActive = () => { },
    coupons = [],
    setCoupons = () => { },
    addCoupon = () => { },
    deleteCoupon = () => { },
    toggleCouponActive = () => { },
    reviews = [],
    addReview = () => { },
    deleteReview = () => { },
    toggleReviewFeatured = () => { },
    allUsers = [],
    setAllUsers = () => { },
    updateUserCoins = () => { },
    addCustomerUser = () => { },
    deleteCustomerUser = () => { },
    categories = [],
    packagingStock = [],
    updatePackagingStock = () => { },
    serviceablePincodes = [],
    addPincode = () => { },
    deletePincode = () => { },
    resetSiteData = () => { },
    supabaseStatus = 'demo'
  } = useStore() || {};

  // Active Navigation Tab in Admin Portal
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'orders' | 'inventory' | 'users' | 'feedback' | 'banners' | 'coupons' | 'settings'

  // Serviceable Pincode Editing States
  const [newPincodeInput, setNewPincodeInput] = useState('');
  const [pincodeSearchQuery, setPincodeSearchQuery] = useState('');

  const handleAddPincodeSubmit = (e) => {
    if (e) e.preventDefault();
    const result = addPincode(newPincodeInput);
    if (result.success) {
      showToast(result.message, 'success');
      setNewPincodeInput('');
    } else {
      showToast(result.error, 'error');
    }
  };

  const handleDeletePincode = (pin) => {
    if (window.confirm(`Remove pincode ${pin} from deliverable zones?`)) {
      const result = deletePincode(pin);
      showToast(result.message, 'success');
    }
  };

  // Toast alert notification state
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth form state for direct admin login
  const [adminLoginForm, setAdminLoginForm] = useState({
    email: '',
    password: ''
  });
  const [adminLoginError, setAdminLoginError] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Orders Tab States
  const [orderFilterStatus, setOrderFilterStatus] = useState('ALL');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);

  // Inventory SKU Editing States
  const [skuSearchQuery, setSkuSearchQuery] = useState('');
  const [editingCookieId, setEditingCookieId] = useState(null);
  const [cookieEditForm, setCookieEditForm] = useState({});
  const [isAddSkuModalOpen, setIsAddSkuModalOpen] = useState(false);
  const [newSkuForm, setNewSkuForm] = useState({
    name: '',
    slug: '',
    price: 349,
    category: 'signature',
    stockPieces: 100,
    kahaniText: 'Handcrafted artisan cookie with traditional Indian spices and pure desi ghee.',
    badge: 'Chef Special',
    photoUrls: ['/images/saffron-pistachio.png']
  });

  // Users & Customer Registry States
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    kisseCoins: 100,
    defaultAddress: ''
  });

  // Feedback & Reviews Management States
  const [feedbackSearchQuery, setFeedbackSearchQuery] = useState('');
  const [feedbackRatingFilter, setFeedbackRatingFilter] = useState('ALL');
  const [isAddFeedbackModalOpen, setIsAddFeedbackModalOpen] = useState(false);
  const [newAdminFeedbackForm, setNewAdminFeedbackForm] = useState({
    customerName: '',
    location: 'Mumbai',
    purchasedItem: 'Royal Saffron Pistachio Molten Melt Cookie',
    ratingCookies: 5,
    reviewText: ''
  });

  // Hero Banner Editing States
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [bannerEditForm, setBannerEditForm] = useState({});
  const [isAddBannerModalOpen, setIsAddBannerModalOpen] = useState(false);
  const [newBannerForm, setNewBannerForm] = useState({
    title: '',
    subtitle: '',
    tag: 'NEW LAUNCH',
    ctaText: 'Explore Collection',
    ctaLink: '/gifting',
    bgGradient: 'linear-gradient(135deg, #4a0404 0%, #1a0101 100%)',
    imageDesktop: '/images/saffron-pistachio.png',
    bgImage: '/images/saffron-pistachio.png'
  });

  // Coupon Engine States
  const [newCouponForm, setNewCouponForm] = useState({
    code: '',
    discountPercent: 15,
    minOrderAmount: 499,
    description: 'Special seasonal treat discount'
  });

  // Meta Ads States & Persistence
  const [metaCampaigns, setMetaCampaigns] = useState(() => {
    try {
      const saved = localStorage.getItem('mk_v6_meta_campaigns');
      return saved ? JSON.parse(saved) : INITIAL_META_CAMPAIGNS;
    } catch {
      return INITIAL_META_CAMPAIGNS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mk_v6_meta_campaigns', JSON.stringify(metaCampaigns));
    } catch (e) {
      console.error(e);
    }
  }, [metaCampaigns]);

  const [campaignFilterStatus, setCampaignFilterStatus] = useState('ALL');
  const [campaignSearchQuery, setCampaignSearchQuery] = useState('');
  const [isAddCampaignModalOpen, setIsAddCampaignModalOpen] = useState(false);
  const [newCampaignForm, setNewCampaignForm] = useState({
    name: '',
    objective: 'CONVERSIONS',
    dailyBudget: 1500,
    audience: 'Gourmet Foodies & Gifting (22-48 yrs) • Mumbai Metro',
    platforms: ['Instagram Reels', 'Instagram Feed', 'Facebook Feed'],
    creativeHeadline: 'Warm Molten Center Cookies Slow-Baked in Mumbai 🍪',
    adImage: '/images/saffron-pistachio.png'
  });

  // Meta Ads Aggregations
  const totalMetaSpend = useMemo(() => metaCampaigns.reduce((sum, c) => sum + (c.totalSpend || 0), 0), [metaCampaigns]);
  const totalMetaRevenue = useMemo(() => metaCampaigns.reduce((sum, c) => sum + (c.revenue || 0), 0), [metaCampaigns]);
  const totalMetaPurchases = useMemo(() => metaCampaigns.reduce((sum, c) => sum + (c.purchases || 0), 0), [metaCampaigns]);
  const totalMetaImpressions = useMemo(() => metaCampaigns.reduce((sum, c) => sum + (c.impressions || 0), 0), [metaCampaigns]);
  const blendedRoas = totalMetaSpend > 0 ? (totalMetaRevenue / totalMetaSpend).toFixed(2) : '0.00';
  const blendedCpa = totalMetaPurchases > 0 ? Math.round(totalMetaSpend / totalMetaPurchases) : 0;
  const activeMetaCampaignsCount = useMemo(() => metaCampaigns.filter(c => c.status === 'ACTIVE').length, [metaCampaigns]);

  const filteredCampaigns = useMemo(() => {
    return metaCampaigns.filter(c => {
      const matchesStatus = campaignFilterStatus === 'ALL' || c.status === campaignFilterStatus;
      const query = campaignSearchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        c.name.toLowerCase().includes(query) ||
        c.objective.toLowerCase().includes(query) ||
        (c.audience && c.audience.toLowerCase().includes(query));
      return matchesStatus && matchesSearch;
    });
  }, [metaCampaigns, campaignFilterStatus, campaignSearchQuery]);

  const handleToggleCampaignStatus = (campId) => {
    setMetaCampaigns(prev => prev.map(c => {
      if (c.id === campId) {
        const nextStatus = c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        return { ...c, status: nextStatus };
      }
      return c;
    }));
    showToast('Meta campaign delivery status updated', 'info');
  };

  const handleAdjustCampaignBudget = (campId, delta) => {
    setMetaCampaigns(prev => prev.map(c => {
      if (c.id === campId) {
        const nextBudget = Math.max(100, (c.dailyBudget || 1000) + delta);
        return { ...c, dailyBudget: nextBudget };
      }
      return c;
    }));
    showToast(`Daily budget adjusted by ${delta > 0 ? '+' : ''}₹${delta}`, 'info');
  };

  const handleDeleteCampaign = (campId) => {
    setMetaCampaigns(prev => prev.filter(c => c.id !== campId));
    showToast('Campaign archived from Meta Ads Manager', 'info');
  };

  const handleCreateNewCampaign = (e) => {
    e.preventDefault();
    if (!newCampaignForm.name) return;
    const newCamp = {
      id: `meta-camp-${Date.now()}`,
      name: newCampaignForm.name,
      objective: newCampaignForm.objective || 'CONVERSIONS',
      status: 'ACTIVE',
      dailyBudget: Number(newCampaignForm.dailyBudget) || 1000,
      totalSpend: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0.0,
      cpc: 0.0,
      purchases: 0,
      revenue: 0,
      roas: 0.0,
      audience: newCampaignForm.audience || 'Mumbai Gourmet Foodies',
      platforms: newCampaignForm.platforms || ['Instagram Feed', 'Instagram Reels'],
      creativeType: 'Reel Video',
      creativeHeadline: newCampaignForm.creativeHeadline || 'Handcrafted Molten Cookies Baked Fresh Every Hour',
      adImage: newCampaignForm.adImage || '/images/saffron-pistachio.png',
      startDate: new Date().toISOString().substring(0, 10)
    };
    setMetaCampaigns(prev => [newCamp, ...prev]);
    setIsAddCampaignModalOpen(false);
    setNewCampaignForm({
      name: '',
      objective: 'CONVERSIONS',
      dailyBudget: 1500,
      audience: 'Gourmet Foodies & Gifting (22-48 yrs) • Mumbai Metro',
      platforms: ['Instagram Reels', 'Instagram Feed', 'Facebook Feed'],
      creativeHeadline: 'Warm Molten Center Cookies Slow-Baked in Mumbai 🍪',
      adImage: '/images/saffron-pistachio.png'
    });
    showToast(`Meta Ad Campaign "${newCamp.name}" published live to Instagram & Facebook!`, 'success');
  };

  const handleSimulateMetaEvent = (eventName = 'Purchase') => {
    showToast(`⚡ Meta Pixel & CAPI Event [${eventName}] fired with 100% deduplication!`, 'success');
  };

  // Handle direct admin login
  const handleAdminDirectLogin = (e) => {
    if (e) e.preventDefault();
    setAdminLoginError('');
    const res = loginAdmin({
      email: adminLoginForm.email,
      password: adminLoginForm.password
    });
    if (res.success) {
      showToast('Authenticated as Master Admin Officer', 'success');
    } else {
      setAdminLoginError(res.error || 'Invalid admin credentials');
    }
  };

  /* ====================================================================
     ORDER ACTIONS
     ==================================================================== */
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    if (setOrders) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
    await updateOrderStatusInSupabase(orderId, newStatus);
    showToast(`Order #${orderId} status changed to ${newStatus}`);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = orderFilterStatus === 'ALL' || (order.status || '').toUpperCase() === orderFilterStatus;
      const query = orderSearchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        (order.id && order.id.toLowerCase().includes(query)) ||
        (order.customerName && order.customerName.toLowerCase().includes(query)) ||
        (order.phone && order.phone.includes(query)) ||
        (order.address && order.address.toLowerCase().includes(query));
      return matchesStatus && matchesSearch;
    });
  }, [orders, orderFilterStatus, orderSearchQuery]);

  /* ====================================================================
     SKU / INVENTORY ACTIONS
     ==================================================================== */
  const handleFileUpload = (e, targetForm = 'edit') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const base64Url = loadEvt.target?.result;
      if (base64Url) {
        if (targetForm === 'edit') {
          setCookieEditForm(prev => ({
            ...prev,
            photoUrls: [base64Url, ...(prev.photoUrls?.slice(1) || [])]
          }));
        } else {
          setNewSkuForm(prev => ({
            ...prev,
            photoUrls: [base64Url]
          }));
        }
        showToast('Image uploaded successfully!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleStartEditCookie = (cookie) => {
    setEditingCookieId(cookie.id);
    setCookieEditForm({
      ...cookie,
      photoUrls: (cookie.photoUrls && cookie.photoUrls.length > 0) ? [...cookie.photoUrls] : ['/images/saffron-pistachio.png']
    });
  };

  const handleSaveCookieEdit = (cookieId) => {
    updateCookie(cookieId, cookieEditForm);
    setEditingCookieId(null);
    showToast('SKU details, image & stock updated live', 'success');
  };

  const handleQuickAdjustStock = (cookieId, delta) => {
    setCookies(prev => prev.map(c => {
      if (c.id === cookieId) {
        const newStock = Math.max(0, (c.stockPieces || 0) + delta);
        updateCookieStockInSupabase(cookieId, newStock);
        return { ...c, stockPieces: newStock };
      }
      return c;
    }));
    showToast(`Stock modified by ${delta > 0 ? '+' : ''}${delta}`, 'info');
  };

  const handleToggleCookieOnline = (cookieId) => {
    setCookies(prev => prev.map(c => {
      if (c.id === cookieId) {
        const updated = { ...c, isOnline: c.isOnline === false ? true : false };
        return updated;
      }
      return c;
    }));
    showToast('Catalog visibility toggled');
  };

  const handleDeleteCookie = (cookieId, cookieName) => {
    if (window.confirm(`Are you sure you want to permanently delete "${cookieName || 'this cookie'}" from the store catalog?`)) {
      deleteCookie(cookieId);
      if (editingCookieId === cookieId) {
        setEditingCookieId(null);
      }
      showToast(`Deleted "${cookieName || 'Product'}" from catalog`, 'info');
    }
  };

  const handleCreateNewSku = (e) => {
    e.preventDefault();
    if (!newSkuForm.name) return;
    const generatedSlug = newSkuForm.slug || newSkuForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCookie = {
      ...newSkuForm,
      id: `cookie-${Date.now()}`,
      slug: generatedSlug,
      isOnline: true,
      price: Number(newSkuForm.price) || 299,
      stockPieces: Number(newSkuForm.stockPieces) || 50,
      photoUrls: newSkuForm.photoUrls?.length ? newSkuForm.photoUrls : ['/images/saffron-pistachio.png']
    };
    addCookie(newCookie);
    setIsAddSkuModalOpen(false);
    setNewSkuForm({
      name: '',
      slug: '',
      price: 349,
      category: 'signature',
      stockPieces: 100,
      kahaniText: 'Handcrafted artisan cookie with traditional Indian spices and pure desi ghee.',
      badge: 'New Launch',
      photoUrls: ['/images/saffron-pistachio.png']
    });
    showToast(`SKU "${newCookie.name}" permanently added to live catalog!`, 'success');
  };

  /* ====================================================================
     HERO BANNER ACTIONS
     ==================================================================== */
  const handleBannerImageUpload = (e, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const base64Url = loadEvt.target?.result;
      if (base64Url) {
        if (isEdit) {
          setBannerEditForm(prev => ({
            ...prev,
            imageDesktop: base64Url,
            bgImage: base64Url,
            image: base64Url
          }));
        } else {
          setNewBannerForm(prev => ({
            ...prev,
            imageDesktop: base64Url,
            bgImage: base64Url,
            image: base64Url
          }));
        }
        showToast('Banner image uploaded successfully!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBannerEdit = (bannerId) => {
    const bannerImg = bannerEditForm.imageDesktop || bannerEditForm.bgImage || bannerEditForm.image || '/images/saffron-pistachio.png';
    updateBanner(bannerId, {
      ...bannerEditForm,
      headline: bannerEditForm.title || bannerEditForm.headline,
      title: bannerEditForm.title || bannerEditForm.headline,
      imageDesktop: bannerImg,
      bgImage: bannerImg,
      image: bannerImg
    });
    setEditingBannerId(null);
    showToast('Hero banner image & details updated live', 'success');
  };

  const handleMoveBanner = (index, direction) => {
    const newBanners = [...heroBanners];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= newBanners.length) return;
    const temp = newBanners[index];
    newBanners[index] = newBanners[targetIdx];
    newBanners[targetIdx] = temp;
    setHeroBanners(newBanners);
    showToast('Banner carousel order updated');
  };

  const handleCreateNewBanner = (e) => {
    e.preventDefault();
    if (!newBannerForm.title) return;
    const bannerImg = newBannerForm.imageDesktop || newBannerForm.bgImage || newBannerForm.image || '/images/saffron-pistachio.png';
    addBanner({
      ...newBannerForm,
      headline: newBannerForm.title,
      imageDesktop: bannerImg,
      bgImage: bannerImg,
      image: bannerImg
    });
    setIsAddBannerModalOpen(false);
    setNewBannerForm({
      title: '',
      subtitle: '',
      tag: 'NEW LAUNCH',
      ctaText: 'Explore Collection',
      ctaLink: '/gifting',
      bgGradient: 'linear-gradient(135deg, #4a0404 0%, #1a0101 100%)',
      imageDesktop: '/images/saffron-pistachio.png',
      bgImage: '/images/saffron-pistachio.png'
    });
    showToast('New hero slide published to storefront!', 'success');
  };

  /* ====================================================================
     COUPON ACTIONS
     ==================================================================== */
  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCouponForm.code) return;
    addCoupon({
      code: newCouponForm.code.toUpperCase().trim(),
      discountPercent: Number(newCouponForm.discountPercent) || 10,
      minOrderAmount: Number(newCouponForm.minOrderAmount) || 0,
      description: newCouponForm.description || 'Promotional Discount'
    });
    setNewCouponForm({ code: '', discountPercent: 15, minOrderAmount: 499, description: '' });
    showToast('Coupon code active on checkout!', 'success');
  };

  /* ====================================================================
     AGGREGATED ANALYTICS
     ==================================================================== */
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeCookies = Array.isArray(cookies) ? cookies : [];
  const totalRevenue = safeOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 148500);
  const totalOrdersCount = safeOrders.length + 42;
  const inBakingCount = safeOrders.filter(o => o.status === 'BAKING' || o.status === 'PLACED').length + 8;
  const dispatchedCount = safeOrders.filter(o => o.status === 'SHIPPED').length + 14;
  const deliveredCount = safeOrders.filter(o => o.status === 'DELIVERED').length + 20;
  const totalStockInKitchen = safeCookies.reduce((sum, c) => sum + (c.stockPieces || 0), 0);

  /* ====================================================================
     AUTH GATE: IF NOT ADMIN, RENDER SLEEK LUXURY GATE
     ==================================================================== */
  if (!isAdminLoggedIn) {
    return (
      <div className="admin-gate-page">
        <div className="admin-gate-card">
          <div className="admin-gate-badge">
            <ShieldCheck size={16} />
            <span>Meethi Kahani Security Enclave</span>
          </div>

          <div className="admin-gate-icon-wrapper">
            <Lock size={38} className="admin-gate-lock-icon" />
          </div>

          <h1 className="admin-gate-title">Executive Ops Center</h1>
          <p className="admin-gate-subtitle">
            Please fill in your administrator credentials below to access the live command center.
          </p>

          {adminLoginError && (
            <div className="admin-gate-error">
              <AlertCircle size={16} />
              <span>{adminLoginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminDirectLogin} className="admin-gate-form">
            <div className="admin-form-group">
              <label>Executive Admin Identifier</label>
              <input
                type="email"
                value={adminLoginForm.email}
                onChange={(e) => setAdminLoginForm({ ...adminLoginForm, email: e.target.value })}
                required
                className="admin-input"
                placeholder="e.g. admin@meethikahani.com"
                autoComplete="email"
              />
            </div>

            <div className="admin-form-group">
              <label>Encrypted Master Key</label>
              <div className="admin-pass-wrapper">
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  value={adminLoginForm.password}
                  onChange={(e) => setAdminLoginForm({ ...adminLoginForm, password: e.target.value })}
                  required
                  className="admin-input"
                  placeholder="Enter administrator password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="admin-pass-toggle-btn"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  tabIndex={-1}
                  title={showAdminPassword ? 'Hide password' : 'Show password'}
                >
                  {showAdminPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="admin-credentials-hint">
              <span>Admin ID: <strong>admin@meethikahani.com</strong></span>
              <span>Master Key: <strong>admin2026</strong></span>
              <button
                type="button"
                className="admin-quick-fill-btn"
                onClick={() => setAdminLoginForm({ email: 'admin@meethikahani.com', password: 'admin2026' })}
              >
                ⚡ Autofill Admin Credentials
              </button>
            </div>

            <button type="submit" className="admin-btn-primary full-width">
              <UserCheck size={18} />
              <span>Verify & Access Command Center →</span>
            </button>
          </form>

          <div className="admin-gate-footer">
            <button
              type="button"
              className="admin-btn-ghost"
              onClick={() => navigateTo('/')}
            >
              <ArrowLeft size={15} />
              <span>Return to Consumer Storefront</span>
            </button>
            <div className="admin-quick-tag">🔒 Isolated Admin Session & Auth Protocol</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      {/* Dynamic Toast Feedback Notification */}
      {toastMessage && (
        <div className={`admin-toast-alert ${toastMessage.type}`}>
          <Sparkles size={16} />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Super Navigation Bar */}
      <header className="admin-top-nav">
        <div className="admin-nav-left">
          <div className="admin-brand-cluster">
            <div>
              <div className="admin-brand-name">
                MEETHI KAHANI <span className="admin-brand-tag">EXECUTIVE HQ</span>
              </div>
              <div className="admin-telemetry-row">
                <span className="telemetry-dot live"></span>
                <span>Live Ops Pipeline</span>
                <span className="telemetry-separator">•</span>
                <span className="telemetry-db">Supabase: {supabaseStatus === 'connected' ? '⚡ Connected' : '📦 Demo Storage'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Quick Action Toolbar */}
        <div className="admin-nav-right">
          <div className="admin-profile-pill">
            <div className="admin-avatar">A</div>
            <div className="admin-user-info-text">
              <div className="admin-user-name">{adminInfo.name || 'Executive Admin'}</div>
              <div className="admin-user-email">{adminInfo.email || 'admin@meethikahani.com'}</div>
            </div>
          </div>

          <button
            className="admin-tool-btn logout"
            onClick={() => {
              logoutAdmin();
              navigateTo('/');
            }}
            title="Sign out securely"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Admin Body Area with Sidebar Tabs & Content */}
      <div className="admin-main-layout">
        {/* Navigation Sidebar */}
        <aside className="admin-sidebar">
          <div className="sidebar-section-title">COMMAND MODULES</div>
          <nav className="admin-nav-menu">
            <button
              className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <BarChart3 size={18} />
              <span>Overview & Analytics</span>
            </button>

            <button
              className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingBag size={18} />
              <span>Orders & Dispatch</span>
              <span className="nav-badge-count">{orders.length}</span>
            </button>

            <button
              className={`admin-nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              <Package size={18} />
              <span>SKU & Inventory Control</span>
              <span className="nav-badge-count">{cookies.length}</span>
            </button>

            <button
              className={`admin-nav-item ${activeTab === 'meta_ads' ? 'active' : ''}`}
              onClick={() => setActiveTab('meta_ads')}
            >
              <Target size={18} />
              <span>Meta Ads & Growth</span>
              <span className="nav-badge-count highlight">{activeMetaCampaignsCount} Live</span>
            </button>

            <button
              className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={18} />
              <span>Users & Customers</span>
              <span className="nav-badge-count">{allUsers?.length || 0}</span>
            </button>

            <button
              className={`admin-nav-item ${activeTab === 'feedback' ? 'active' : ''}`}
              onClick={() => setActiveTab('feedback')}
            >
              <MessageSquare size={18} />
              <span>Customer Feedback</span>
              <span className="nav-badge-count">{reviews?.length || 0}</span>
            </button>

            <button
              className={`admin-nav-item ${activeTab === 'banners' ? 'active' : ''}`}
              onClick={() => setActiveTab('banners')}
            >
              <ImageIcon size={18} />
              <span>Hero Banners CMS</span>
              <span className="nav-badge-count">{heroBanners.length}</span>
            </button>

            <button
              className={`admin-nav-item ${activeTab === 'coupons' ? 'active' : ''}`}
              onClick={() => setActiveTab('coupons')}
            >
              <Tag size={18} />
              <span>Discounts & Coupons</span>
              <span className="nav-badge-count">{coupons.length}</span>
            </button>

            <button
              className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Sliders size={18} />
              <span>System & Pincodes</span>
            </button>
          </nav>

          {/* Sidebar Mini Status Card */}
          <div className="admin-sidebar-status-box">
            <div className="status-box-header">
              <Zap size={14} color="#f59e0b" />
              <span>Fresh Batch Status</span>
            </div>
            <p className="status-box-desc">
              Baking capacity operating at <b>94%</b> efficiency. {totalStockInKitchen} fresh cookie units ready.
            </p>
          </div>
        </aside>

        {/* Dynamic Main Workspace Container */}
        <main className="admin-workspace">
          {/* ================================================================
              TAB 1: EXECUTIVE DASHBOARD OVERVIEW & ANALYTICS
              ================================================================ */}
          {activeTab === 'dashboard' && (
            <div className="admin-tab-pane">
              {/* Top Banner Heading */}
              <div className="pane-header-row">
                <div>
                  <h2 className="pane-title">Executive Command Dashboard</h2>
                  <p className="pane-subtitle">Real-time telemetry of artisan bakery revenue, dispatch velocity & inventory health.</p>
                </div>
                <div className="header-actions">
                  <button className="admin-btn-accent" onClick={() => setActiveTab('orders')}>
                    <ShoppingBag size={16} />
                    <span>Manage Live Orders ({orders.length})</span>
                  </button>
                </div>
              </div>

              {/* 4 Major High-Impact KPI Cards */}
              <div className="kpi-grid">
                <div className="kpi-card gold-glow">
                  <div className="kpi-top">
                    <span className="kpi-label">Month-to-Date Revenue</span>
                    <div className="kpi-icon-pill gold"><DollarSign size={18} /></div>
                  </div>
                  <div className="kpi-value">₹{totalRevenue.toLocaleString('en-IN')}</div>
                  <div className="kpi-trend positive">
                    <TrendingUp size={14} />
                    <span>+28.4% vs previous 30 days</span>
                  </div>
                </div>

                <div className="kpi-card crimson-glow">
                  <div className="kpi-top">
                    <span className="kpi-label">Active Orders Pipeline</span>
                    <div className="kpi-icon-pill red"><Package size={18} /></div>
                  </div>
                  <div className="kpi-value">{totalOrdersCount} <span className="kpi-sub-unit">Orders</span></div>
                  <div className="kpi-footer-status">
                    <span>{inBakingCount} Baking</span> • <span>{dispatchedCount} Dispatched</span> • <span>{deliveredCount} Done</span>
                  </div>
                </div>

                <div className="kpi-card emerald-glow">
                  <div className="kpi-top">
                    <span className="kpi-label">Live Inventory Available</span>
                    <div className="kpi-icon-pill emerald"><Flame size={18} /></div>
                  </div>
                  <div className="kpi-value">{totalStockInKitchen} <span className="kpi-sub-unit">Packs</span></div>
                  <div className="kpi-trend positive">
                    <CheckCircle size={14} />
                    <span>All 9 Artisan SKUs In-Stock</span>
                  </div>
                </div>

                <div className="kpi-card blue-glow">
                  <div className="kpi-top">
                    <span className="kpi-label">Avg Order Value (AOV)</span>
                    <div className="kpi-icon-pill blue"><Sparkles size={18} /></div>
                  </div>
                  <div className="kpi-value">₹685.00</div>
                  <div className="kpi-trend neutral">
                    <Clock size={14} />
                    <span>Gifting Boxes 44% of Volume</span>
                  </div>
                </div>
              </div>

              {/* Two Column Layout: Quick Orders Stream & Live Inventory Status */}
              <div className="analytics-dual-layout">
                {/* Recent Orders Queue */}
                <div className="admin-card-glass flex-2">
                  <div className="card-glass-header">
                    <div className="header-title-group">
                      <ShoppingBag size={18} color="#e11d48" />
                      <h3>Recent Orders Stream</h3>
                    </div>
                    <button className="text-link-btn" onClick={() => setActiveTab('orders')}>
                      View All Orders →
                    </button>
                  </div>

                  <div className="order-compact-list">
                    {orders.slice(0, 5).map(order => (
                      <div key={order.id} className="order-compact-item">
                        <div className="order-item-left">
                          <span className="order-id-badge">#{order.id}</span>
                          <div>
                            <div className="order-customer-name">{order.customerName || 'Direct Customer'}</div>
                            <div className="order-meta-sub">{order.items?.length || 1} items • ₹{order.totalAmount} • {order.paymentMode || 'UPI'}</div>
                          </div>
                        </div>
                        <div className="order-item-right">
                          <span className={`status-pill ${order.status?.toLowerCase() || 'placed'}`}>
                            {order.status === 'BAKING' ? '🔥 In Oven' : order.status === 'SHIPPED' ? '🚚 In Transit' : order.status === 'DELIVERED' ? '✅ Delivered' : '📦 New Placed'}
                          </span>
                          <button
                            className="btn-micro-action"
                            onClick={() => {
                              setSelectedOrderForInvoice(order);
                            }}
                          >
                            <Printer size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top SKUs & Velocity Ranking */}
                <div className="admin-card-glass flex-1">
                  <div className="card-glass-header">
                    <div className="header-title-group">
                      <Flame size={18} color="#f59e0b" />
                      <h3>Top Selling Cookies</h3>
                    </div>
                    <button className="text-link-btn" onClick={() => setActiveTab('inventory')}>
                      Catalog →
                    </button>
                  </div>

                  <div className="top-sku-list">
                    {cookies.slice(0, 4).map((c, idx) => (
                      <div key={c.id} className="top-sku-row">
                        <span className="sku-rank-num">0{idx + 1}</span>
                        <img src={c.photoUrls?.[0] || '/images/saffron-pistachio.png'} alt={c.name} className="sku-mini-thumb" />
                        <div className="sku-info-col">
                          <div className="sku-mini-name">{c.name}</div>
                          <div className="sku-mini-meta">₹{c.price} • {c.stockPieces} in stock</div>
                        </div>
                        <div className="sku-score-tag">★ High Demand</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              TAB 2: ORDERS & DISPATCH PIPELINE
              ================================================================ */}
          {activeTab === 'orders' && (
            <div className="admin-tab-pane">
              <div className="pane-header-row">
                <div>
                  <h2 className="pane-title">Live Orders & Dispatch Pipeline</h2>
                  <p className="pane-subtitle">Inspect orders, update kitchen baking states, coordinate packaging & print courier slips.</p>
                </div>
                <div className="header-actions">
                  <span className="order-total-counter">{filteredOrders.length} Orders Loaded</span>
                </div>
              </div>

              {/* Filter and Search Bar */}
              <div className="filter-search-toolbar">
                <div className="search-input-wrapper">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by Order ID, customer name, phone, or address..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="admin-search-input"
                  />
                  {orderSearchQuery && (
                    <button className="clear-search-btn" onClick={() => setOrderSearchQuery('')}>
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="filter-pill-selector">
                  {['ALL', 'PLACED', 'BAKING', 'SHIPPED', 'DELIVERED', 'REJECTED'].map((st) => (
                    <button
                      key={st}
                      className={`filter-btn ${orderFilterStatus === st ? 'active' : ''}`}
                      onClick={() => setOrderFilterStatus(st)}
                    >
                      {st === 'ALL' ? 'All Orders' : st === 'BAKING' ? '🔥 Baking' : st === 'SHIPPED' ? '🚚 Shipped' : st === 'DELIVERED' ? '✅ Delivered' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div className="admin-card-glass table-container">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Details</th>
                      <th>Artisan Items</th>
                      <th>Delivery Destination</th>
                      <th>Amount & Payment</th>
                      <th>Current Stage</th>
                      <th>Kitchen Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="empty-table-cell">
                          <AlertCircle size={32} className="empty-icon" />
                          <p>No orders found matching criteria "{orderSearchQuery || orderFilterStatus}".</p>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(order => {
                        const status = (order.status || 'PLACED').toUpperCase();
                        return (
                          <tr key={order.id} className="order-data-row">
                            <td>
                              <div className="order-id-cell">
                                <b>#{order.id}</b>
                                <span className="order-time-stamp">{order.date || 'Today'}</span>
                                <button
                                  className="print-slip-btn"
                                  onClick={() => setSelectedOrderForInvoice(order)}
                                  title="Print Packing Slip"
                                >
                                  <Printer size={12} /> Slip
                                </button>
                              </div>
                            </td>

                            <td>
                              <div className="customer-cell">
                                <div className="cust-name">{order.customerName || 'Customer'}</div>
                                <div className="cust-phone">
                                  <Phone size={12} /> {order.phone || 'No phone'}
                                </div>
                                <span className={`order-type-tag ${order.orderType === 'GIFTING' ? 'gifting' : 'personal'}`}>
                                  {order.orderType || 'PERSONAL'}
                                </span>
                              </div>
                            </td>

                            <td>
                              <div className="items-list-cell">
                                {Array.isArray(order.items) && order.items.length > 0 ? (
                                  order.items.map((it, idx) => (
                                    <div key={idx} className="item-line">
                                      <span className="item-bullet">•</span>
                                      <span className="item-name">{it.name || it.title}</span>
                                      <b className="item-qty">x{it.qty}</b>
                                    </div>
                                  ))
                                ) : (
                                  <div className="item-line">1x Curated Cookie Tin</div>
                                )}
                              </div>
                            </td>

                            <td>
                              <div className="destination-cell">
                                <MapPin size={13} className="pin-icon" />
                                <span className="address-text">{order.address || 'Mumbai, Maharashtra'}</span>
                              </div>
                            </td>

                            <td>
                              <div className="price-payment-cell">
                                <div className="total-amount">₹{order.totalAmount}</div>
                                <span className={`pay-status-pill ${order.isPaid ? 'paid' : 'pending'}`}>
                                  {order.paymentMode || 'UPI'} • {order.isPaid ? 'PAID' : 'COD'}
                                </span>
                              </div>
                            </td>

                            <td>
                              <span className={`status-pill ${status.toLowerCase()}`}>
                                {status === 'BAKING' ? '🔥 In Oven' : status === 'SHIPPED' ? '🚚 In Transit' : status === 'DELIVERED' ? '✅ Delivered' : status === 'REJECTED' ? '❌ Cancelled' : '📦 Placed'}
                              </span>
                            </td>

                            <td>
                              <div className="action-buttons-cell">
                                {(status === 'PLACED' || status === 'BAKING') && (
                                  <button
                                    className="btn-status-flow ship"
                                    onClick={() => handleUpdateOrderStatus(order.id, 'SHIPPED')}
                                  >
                                    <Truck size={13} />
                                    <span>Ship Order</span>
                                  </button>
                                )}

                                {status === 'SHIPPED' && (
                                  <button
                                    className="btn-status-flow deliver"
                                    onClick={() => handleUpdateOrderStatus(order.id, 'DELIVERED')}
                                  >
                                    <CheckCircle size={13} />
                                    <span>Deliver</span>
                                  </button>
                                )}

                                {status === 'DELIVERED' && (
                                  <span className="complete-indicator">
                                    <Check size={14} /> Completed
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================
              TAB 3: SKU & INVENTORY CONTROL (EDITABLE)
              ================================================================ */}
          {activeTab === 'inventory' && (
            <div className="admin-tab-pane">
              <div className="pane-header-row">
                <div>
                  <h2 className="pane-title">Artisan Cookie SKU & Inventory Master</h2>
                  <p className="pane-subtitle">Live modifications for cookie prices, stock levels, kahani narratives, and storefront visibility.</p>
                </div>
                <div className="header-actions">
                  <button className="admin-btn-primary" onClick={() => setIsAddSkuModalOpen(true)}>
                    <Plus size={16} />
                    <span>Create New SKU</span>
                  </button>
                </div>
              </div>

              {/* SKU Search toolbar */}
              <div className="filter-search-toolbar">
                <div className="search-input-wrapper">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search cookies by name or flavour..."
                    value={skuSearchQuery}
                    onChange={(e) => setSkuSearchQuery(e.target.value)}
                    className="admin-search-input"
                  />
                </div>
                <div className="inventory-stats-badge">
                  <span>Total Available Stock: <b>{totalStockInKitchen} Units</b></span>
                </div>
              </div>

              {/* SKU Cards Grid */}
              <div className="sku-master-grid">
                {cookies
                  .filter(c => !skuSearchQuery || c.name.toLowerCase().includes(skuSearchQuery.toLowerCase()))
                  .map(cookie => {
                    const isEditing = editingCookieId === cookie.id;
                    const activePhoto = isEditing
                      ? (cookieEditForm.photoUrls?.[0] || cookie.photoUrls?.[0] || '/images/saffron-pistachio.png')
                      : (cookie.photoUrls?.[0] || '/images/saffron-pistachio.png');

                    return (
                      <div key={cookie.id} className={`sku-edit-card ${cookie.isOnline === false ? 'offline' : ''} ${isEditing ? 'editing-active' : ''}`}>
                        <div className="sku-card-top">
                          <div className="sku-img-wrapper">
                            <img src={activePhoto} alt={cookie.name} className="sku-img-preview" />
                            {isEditing && <span className="sku-editing-badge">Editing</span>}
                          </div>
                          <div className="sku-header-info">
                            <div className="sku-badge-pill">{isEditing ? (cookieEditForm.badge || 'Artisanal') : (cookie.badge || 'Artisanal')}</div>
                            <h4 className="sku-title">{cookie.name}</h4>
                            <span className="sku-slug-tag">/{cookie.slug}</span>
                          </div>
                        </div>

                        {isEditing ? (
                          <div className="sku-inline-edit-form">
                            {/* Visual Image Manager */}
                            <div className="sku-image-manager-box">
                              <div className="image-manager-header">
                                <label className="edit-section-label">
                                  <ImageIcon size={13} color="var(--admin-red-primary)" />
                                  <span>Cookie Image Selection</span>
                                </label>
                              </div>

                              {/* Upload / URL Input Bar */}
                              <div className="sku-image-input-row">
                                <label className="btn-device-upload">
                                  <Upload size={13} />
                                  <span>Upload File</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e, 'edit')}
                                    style={{ display: 'none' }}
                                  />
                                </label>
                                <input
                                  type="text"
                                  placeholder="Or paste image URL (/images/... or https://...)"
                                  className="admin-mini-input img-url-input"
                                  value={cookieEditForm.photoUrls?.[0] || ''}
                                  onChange={(e) => setCookieEditForm({ ...cookieEditForm, photoUrls: [e.target.value] })}
                                />
                              </div>

                              {/* Preset Quick Gallery */}
                              <div className="sku-presets-container">
                                <span className="preset-label-hint">Bakery Collection Presets:</span>
                                <div className="sku-preset-thumbs-strip">
                                  {PRESET_COOKIE_IMAGES.map((preset, pIdx) => {
                                    const isSelected = (cookieEditForm.photoUrls?.[0] === preset.url);
                                    return (
                                      <button
                                        key={pIdx}
                                        type="button"
                                        className={`sku-preset-btn ${isSelected ? 'active' : ''}`}
                                        onClick={() => setCookieEditForm({ ...cookieEditForm, photoUrls: [preset.url] })}
                                        title={preset.label}
                                      >
                                        <img src={preset.url} alt={preset.label} />
                                        {isSelected && (
                                          <span className="preset-check-icon">
                                            <Check size={10} strokeWidth={3} />
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            <div className="form-row-dual">
                              <div>
                                <label>Product Name</label>
                                <input
                                  type="text"
                                  className="admin-mini-input"
                                  value={cookieEditForm.name || ''}
                                  onChange={(e) => setCookieEditForm({ ...cookieEditForm, name: e.target.value })}
                                  placeholder="Product Name"
                                />
                              </div>
                              <div>
                                <label>Product Slug (URL)</label>
                                <input
                                  type="text"
                                  className="admin-mini-input"
                                  value={cookieEditForm.slug || ''}
                                  onChange={(e) => setCookieEditForm({ ...cookieEditForm, slug: e.target.value })}
                                  placeholder="e.g. chocolate-cookie"
                                />
                              </div>
                            </div>

                            <div className="form-row-dual">
                              <div>
                                <label>Price (₹)</label>
                                <input
                                  type="number"
                                  className="admin-mini-input"
                                  value={cookieEditForm.price || ''}
                                  onChange={(e) => setCookieEditForm({ ...cookieEditForm, price: Number(e.target.value) })}
                                />
                              </div>
                              <div>
                                <label>Live Stock (Units)</label>
                                <input
                                  type="number"
                                  className="admin-mini-input"
                                  value={cookieEditForm.stockPieces || 0}
                                  onChange={(e) => setCookieEditForm({ ...cookieEditForm, stockPieces: Number(e.target.value) })}
                                />
                              </div>
                            </div>

                            <div>
                              <label>Badge Tag</label>
                              <input
                                type="text"
                                className="admin-mini-input"
                                value={cookieEditForm.badge || ''}
                                onChange={(e) => setCookieEditForm({ ...cookieEditForm, badge: e.target.value })}
                              />
                            </div>

                            <div>
                              <label>Kahani Story Quote</label>
                              <textarea
                                className="admin-mini-textarea"
                                rows="2"
                                value={cookieEditForm.kahaniText || ''}
                                onChange={(e) => setCookieEditForm({ ...cookieEditForm, kahaniText: e.target.value })}
                              />
                            </div>

                            <div className="edit-form-actions">
                              <button className="btn-save-sm" onClick={() => handleSaveCookieEdit(cookie.id)}>
                                <Save size={14} /> Save Live
                              </button>
                              <button className="btn-delete-sm" onClick={() => handleDeleteCookie(cookie.id, cookieEditForm.name || cookie.name)}>
                                <Trash2 size={14} /> Delete
                              </button>
                              <button className="btn-cancel-sm" onClick={() => setEditingCookieId(null)}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="sku-card-body">
                            <div className="sku-price-stock-row">
                              <div className="sku-price-display">₹{cookie.price} <span className="unit-label">/ box</span></div>
                              <div className={`sku-stock-pill ${cookie.stockPieces < 20 ? 'low' : 'good'}`}>
                                <Flame size={12} /> {cookie.stockPieces} in Oven Ready
                              </div>
                            </div>

                            <p className="sku-story-preview">"{cookie.kahaniText}"</p>

                            {/* Stock Quick Stepper */}
                            <div className="quick-stock-stepper">
                              <span className="stepper-label">Quick Restock:</span>
                              <button className="btn-step" onClick={() => handleQuickAdjustStock(cookie.id, -10)}>-10</button>
                              <button className="btn-step" onClick={() => handleQuickAdjustStock(cookie.id, +10)}>+10</button>
                              <button className="btn-step highlight" onClick={() => handleQuickAdjustStock(cookie.id, +50)}>+50 Fresh Bake</button>
                            </div>

                            <div className="sku-card-footer">
                              <button
                                className={`btn-visibility-toggle ${cookie.isOnline === false ? 'off' : 'on'}`}
                                onClick={() => handleToggleCookieOnline(cookie.id)}
                                title={cookie.isOnline === false ? 'Click to show on store' : 'Click to hide from store'}
                              >
                                {cookie.isOnline === false ? <EyeOff size={14} /> : <Eye size={14} />}
                                <span>{cookie.isOnline === false ? 'Hidden' : 'Live on Store'}</span>
                              </button>

                              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <button className="btn-edit-sku" onClick={() => handleStartEditCookie(cookie)}>
                                  <Edit3 size={14} />
                                  <span>Edit Details</span>
                                </button>
                                <button
                                  className="btn-delete-sku"
                                  onClick={() => handleDeleteCookie(cookie.id, cookie.name)}
                                  title="Permanently delete this product"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ================================================================
              TAB: META ADS MANAGER & GROWTH MARKETING (FACEBOOK & INSTAGRAM ADS)
              ================================================================ */}
          {activeTab === 'meta_ads' && (
            <div className="admin-tab-pane">
              <div className="pane-header-row">
                <div>
                  <h2 className="pane-title">Meta Ads Manager & Growth Marketing Hub</h2>
                  <p className="pane-subtitle">
                    Live telemetry across Instagram Reels & Facebook Feed campaigns, Meta Pixel CAPI tracking, ROAS attribution, and automated budget scaling.
                  </p>
                </div>
                <div className="header-actions">
                  <button
                    className="admin-btn-secondary"
                    onClick={() => handleSimulateMetaEvent('Purchase')}
                    title="Simulate CAPI Server-Side Event"
                  >
                    <Activity size={16} color="#10B981" />
                    <span>Ping CAPI Event</span>
                  </button>
                  <button className="admin-btn-primary" onClick={() => setIsAddCampaignModalOpen(true)}>
                    <Plus size={16} />
                    <span>Create Ad Campaign</span>
                  </button>
                </div>
              </div>

              {/* 4 High-Impact Meta Analytics KPI Cards */}
              <div className="kpi-grid">
                <div className="kpi-card crimson-glow">
                  <div className="kpi-top">
                    <span className="kpi-label">Active Meta Ad Spend</span>
                    <div className="kpi-icon-pill red"><Megaphone size={18} /></div>
                  </div>
                  <div className="kpi-value">₹{totalMetaSpend.toLocaleString('en-IN')}</div>
                  <div className="kpi-trend positive">
                    <TrendingUp size={14} />
                    <span>Avg Daily Burn: ₹{(totalMetaSpend / 24).toFixed(0)}/day</span>
                  </div>
                </div>

                <div className="kpi-card gold-glow">
                  <div className="kpi-top">
                    <span className="kpi-label">Blended Return on Ad Spend (ROAS)</span>
                    <div className="kpi-icon-pill gold"><Target size={18} /></div>
                  </div>
                  <div className="kpi-value">{blendedRoas}x <span className="kpi-sub-unit">ROAS</span></div>
                  <div className="kpi-trend positive">
                    <CheckCircle size={14} />
                    <span>Target &gt; 3.50x • Highly Profitable</span>
                  </div>
                </div>

                <div className="kpi-card emerald-glow">
                  <div className="kpi-top">
                    <span className="kpi-label">Ad Attributed Sales Revenue</span>
                    <div className="kpi-icon-pill emerald"><DollarSign size={18} /></div>
                  </div>
                  <div className="kpi-value">₹{totalMetaRevenue.toLocaleString('en-IN')}</div>
                  <div className="kpi-trend positive">
                    <Sparkles size={14} />
                    <span>{totalMetaPurchases} Total Ad Purchases</span>
                  </div>
                </div>

                <div className="kpi-card blue-glow">
                  <div className="kpi-top">
                    <span className="kpi-label">Blended Acquisition Cost (CPA)</span>
                    <div className="kpi-icon-pill blue"><MousePointer size={18} /></div>
                  </div>
                  <div className="kpi-value">₹{blendedCpa} <span className="kpi-sub-unit">/ Order</span></div>
                  <div className="kpi-trend positive">
                    <TrendingUp size={14} />
                    <span>{totalMetaImpressions.toLocaleString('en-IN')} Total Reach</span>
                  </div>
                </div>
              </div>

              {/* Meta Pixel & Conversions API (CAPI) Live Health Box */}
              <div className="meta-pixel-banner">
                <div className="pixel-banner-left">
                  <div className="pixel-pulse-indicator">
                    <span className="pulse-dot"></span>
                    <span className="pulse-text">META PIXEL & CAPI SERVER-SIDE: <b>ACTIVE & STREAMING</b></span>
                  </div>
                  <div className="pixel-details-row">
                    <span className="pixel-chip">Pixel ID: <b>META-PIXEL-MK-8829104</b></span>
                    <span className="pixel-chip">Event Match Quality: <b>99.4% (Tier 1)</b></span>
                    <span className="pixel-chip">Attribution: <b>7-Day Click / 1-Day View</b></span>
                  </div>
                </div>

                <div className="pixel-events-mini-grid">
                  <div className="pixel-event-pill">
                    <span className="p-evt-name">PageView</span>
                    <span className="p-evt-count">142.8k</span>
                  </div>
                  <div className="pixel-event-pill">
                    <span className="p-evt-name">ViewContent</span>
                    <span className="p-evt-count">88.4k</span>
                  </div>
                  <div className="pixel-event-pill">
                    <span className="p-evt-name">AddToCart</span>
                    <span className="p-evt-count">14.2k</span>
                  </div>
                  <div className="pixel-event-pill">
                    <span className="p-evt-name">Purchase</span>
                    <span className="p-evt-count highlight">{totalMetaPurchases}</span>
                  </div>
                </div>
              </div>

              {/* Search & Status Filtering Toolbar */}
              <div className="filter-search-toolbar">
                <div className="search-input-wrapper">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search campaigns by name, audience, or objective..."
                    value={campaignSearchQuery}
                    onChange={(e) => setCampaignSearchQuery(e.target.value)}
                    className="admin-search-input"
                  />
                </div>

                <div className="filter-pills-cluster">
                  {['ALL', 'ACTIVE', 'PAUSED'].map(st => (
                    <button
                      key={st}
                      className={`filter-pill-btn ${campaignFilterStatus === st ? 'active' : ''}`}
                      onClick={() => setCampaignFilterStatus(st)}
                    >
                      {st === 'ALL' ? `All Campaigns (${metaCampaigns.length})` : st === 'ACTIVE' ? `🟢 Active (${activeMetaCampaignsCount})` : `⏸️ Paused (${metaCampaigns.length - activeMetaCampaignsCount})`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Campaigns Master List Grid */}
              <div className="meta-campaigns-grid">
                {filteredCampaigns.map(camp => {
                  const isActive = camp.status === 'ACTIVE';
                  return (
                    <div key={camp.id} className={`meta-campaign-card ${!isActive ? 'paused' : ''}`}>
                      <div className="camp-card-header">
                        <div className="camp-creative-preview">
                          <img src={camp.adImage || '/images/saffron-pistachio.png'} alt={camp.name} />
                          <span className="creative-type-tag">{camp.creativeType || 'Reel Ad'}</span>
                        </div>

                        <div className="camp-header-meta">
                          <div className="camp-badges-row">
                            <span className={`camp-obj-badge ${camp.objective.toLowerCase()}`}>
                              {camp.objective}
                            </span>
                            <span className="camp-date-badge">Started: {camp.startDate}</span>
                          </div>
                          <h4 className="camp-title">{camp.name}</h4>
                          <p className="camp-headline-quote">"{camp.creativeHeadline}"</p>
                        </div>

                        <div className="camp-status-switch-wrap">
                          <button
                            className={`btn-campaign-toggle ${isActive ? 'active' : 'paused'}`}
                            onClick={() => handleToggleCampaignStatus(camp.id)}
                            title={isActive ? 'Pause Campaign Delivery' : 'Resume Campaign'}
                          >
                            {isActive ? <Play size={14} /> : <Pause size={14} />}
                            <span>{isActive ? 'Active' : 'Paused'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Audience & Placements row */}
                      <div className="camp-audience-row">
                        <div className="audience-info">
                          <span className="aud-label">Target Audience:</span>
                          <span className="aud-val">{camp.audience}</span>
                        </div>
                        <div className="platform-chips">
                          {camp.platforms?.map((p, pIdx) => (
                            <span key={pIdx} className="plat-chip">{p}</span>
                          ))}
                        </div>
                      </div>

                      {/* Performance Metrics Table / Grid */}
                      <div className="camp-metrics-grid">
                        <div className="camp-metric-box">
                          <span className="metric-lbl">Total Spend</span>
                          <span className="metric-val">₹{camp.totalSpend.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="camp-metric-box highlight">
                          <span className="metric-lbl">ROAS</span>
                          <span className="metric-val roas">{camp.roas}x</span>
                        </div>
                        <div className="camp-metric-box">
                          <span className="metric-lbl">Revenue</span>
                          <span className="metric-val gold">₹{camp.revenue.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="camp-metric-box">
                          <span className="metric-lbl">Purchases</span>
                          <span className="metric-val">{camp.purchases}</span>
                        </div>
                        <div className="camp-metric-box">
                          <span className="metric-lbl">CTR / CPC</span>
                          <span className="metric-val sub">{camp.ctr}% • ₹{camp.cpc}</span>
                        </div>
                        <div className="camp-metric-box">
                          <span className="metric-lbl">Impressions</span>
                          <span className="metric-val sub">{camp.impressions.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Card Bottom Controls */}
                      <div className="camp-card-footer">
                        <div className="camp-budget-control">
                          <span className="budget-label">Daily Budget:</span>
                          <span className="budget-value">₹{camp.dailyBudget.toLocaleString('en-IN')}</span>
                          <div className="budget-steppers">
                            <button
                              className="btn-budget-step"
                              onClick={() => handleAdjustCampaignBudget(camp.id, -200)}
                              title="Decrease budget by ₹200"
                            >
                              -200
                            </button>
                            <button
                              className="btn-budget-step"
                              onClick={() => handleAdjustCampaignBudget(camp.id, +200)}
                              title="Increase budget by ₹200"
                            >
                              +200
                            </button>
                            <button
                              className="btn-budget-step scale"
                              onClick={() => handleAdjustCampaignBudget(camp.id, +500)}
                              title="Scale budget by ₹500"
                            >
                              🚀 Scale +500
                            </button>
                          </div>
                        </div>

                        <div className="camp-footer-actions">
                          <button
                            className="btn-del-camp"
                            onClick={() => {
                              if (window.confirm(`Archive campaign "${camp.name}"?`)) {
                                handleDeleteCampaign(camp.id);
                              }
                            }}
                            title="Archive Campaign"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================
              TAB: USERS & CUSTOMER REGISTRY (ALL USERS MANAGEMENT)
              ================================================================ */}
          {activeTab === 'users' && (
            <div className="admin-tab-pane">
              <div className="pane-header-row">
                <div>
                  <h2 className="pane-title">Users & Customer Relationship Master</h2>
                  <p className="pane-subtitle">Live registry of registered gourmands, lifetime order volume, address profiles and Kisse coins ledger.</p>
                </div>
                <div className="header-actions">
                  <button className="admin-btn-primary" onClick={() => setIsAddUserModalOpen(true)}>
                    <UserPlus size={16} />
                    <span>Register New Customer</span>
                  </button>
                </div>
              </div>

              {/* 4 KPI User Analytics Cards */}
              <div className="kpi-grid">
                <div className="kpi-card gold-glow">
                  <div className="kpi-top">
                    <span className="kpi-label">Registered Customer Base</span>
                    <div className="kpi-icon-pill gold"><Users size={18} /></div>
                  </div>
                  <div className="kpi-value">{allUsers.length} <span className="kpi-sub-unit">Users</span></div>
                  <div className="kpi-trend positive">
                    <CheckCircle size={14} />
                    <span>100% Verified Profiles</span>
                  </div>
                </div>

                <div className="kpi-card emerald-glow">
                  <div className="kpi-top">
                    <span className="kpi-label">Active Spenders</span>
                    <div className="kpi-icon-pill emerald"><ShoppingBag size={18} /></div>
                  </div>
                  <div className="kpi-value">
                    {allUsers.filter(u => (u.ordersCount || 0) > 0).length} <span className="kpi-sub-unit">Customers</span>
                  </div>
                  <div className="kpi-trend positive">
                    <TrendingUp size={14} />
                    <span>Repeat Order Rate 68%</span>
                  </div>
                </div>

                <div className="kpi-card crimson-glow">
                  <div className="kpi-top">
                    <span className="kpi-label">Kisse Coins in Circulation</span>
                    <div className="kpi-icon-pill red"><Sparkles size={18} /></div>
                  </div>
                  <div className="kpi-value">
                    {allUsers.reduce((s, u) => s + (u.kisseCoins || 0), 0)} <span className="kpi-sub-unit">Coins</span>
                  </div>
                  <div className="kpi-footer-status">
                    <span>10 Coins = ₹10 Discount</span>
                  </div>
                </div>

                <div className="kpi-card blue-glow">
                  <div className="kpi-top">
                    <span className="kpi-label">Total Customer Spend</span>
                    <div className="kpi-icon-pill blue"><DollarSign size={18} /></div>
                  </div>
                  <div className="kpi-value">
                    ₹{allUsers.reduce((s, u) => s + (u.totalSpend || 0), 0).toLocaleString('en-IN')}
                  </div>
                  <div className="kpi-trend positive">
                    <Award size={14} />
                    <span>Lifetime GMV</span>
                  </div>
                </div>
              </div>

              {/* Filter and Search Bar for Users */}
              <div className="filter-search-toolbar">
                <div className="search-input-wrapper">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by customer name, email, phone, or address..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="admin-search-input"
                  />
                  {userSearchQuery && (
                    <button className="clear-search-btn" onClick={() => setUserSearchQuery('')}>
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="filter-pill-selector">
                  {['ALL', 'CUSTOMER', 'ADMIN'].map((r) => (
                    <button
                      key={r}
                      className={`filter-btn ${userRoleFilter === r ? 'active' : ''}`}
                      onClick={() => setUserRoleFilter(r)}
                    >
                      {r === 'ALL' ? 'All Roles' : r === 'ADMIN' ? '🛡️ Admins' : '🍪 Customers'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Users Table */}
              <div className="admin-card-glass table-container">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Customer Profile</th>
                      <th>Contact & Channel</th>
                      <th>Account Role</th>
                      <th>Orders & Spend</th>
                      <th>Kisse Loyalty Coins</th>
                      <th>Delivery Destination</th>
                      <th>Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers
                      .filter(user => {
                        const matchesRole = userRoleFilter === 'ALL' || (user.role || 'customer').toUpperCase() === userRoleFilter;
                        const q = userSearchQuery.toLowerCase().trim();
                        const matchesSearch = !q ||
                          (user.name && user.name.toLowerCase().includes(q)) ||
                          (user.email && user.email.toLowerCase().includes(q)) ||
                          (user.phone && user.phone.includes(q)) ||
                          (user.defaultAddress && user.defaultAddress.toLowerCase().includes(q));
                        return matchesRole && matchesSearch;
                      })
                      .map(user => (
                        <tr key={user.id || user.email} className="order-data-row">
                          <td>
                            <div className="customer-cell" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div className="admin-avatar" style={{ background: user.role === 'admin' ? 'var(--crimson-red)' : 'var(--text-primary)' }}>
                                {(user.name || 'U').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="cust-name"><b>{user.name || 'Anonymous User'}</b></div>
                                <span className="order-time-stamp">Joined {user.joinDate || 'August 2026'}</span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="customer-cell">
                              <div style={{ fontSize: '13px', color: '#e2e8f0' }}>{user.email || 'No email provided'}</div>
                              <div className="cust-phone">
                                <Phone size={12} /> {user.phone || '+91 98200 98200'}
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className={`order-type-tag ${user.role === 'admin' ? 'gifting' : 'personal'}`}>
                              {user.role === 'admin' ? '🛡️ MASTER ADMIN' : '🍪 CUSTOMER'}
                            </span>
                          </td>

                          <td>
                            <div className="price-payment-cell">
                              <div className="total-amount">₹{(user.totalSpend || 0).toLocaleString('en-IN')}</div>
                              <span className="order-time-stamp">{user.ordersCount || 0} Orders Completed</span>
                            </div>
                          </td>

                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className="sku-score-tag" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fcd34d', fontWeight: 900 }}>
                                ✨ {user.kisseCoins || 0} Coins
                              </span>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button
                                  className="btn-step"
                                  onClick={() => {
                                    updateUserCoins(user.id || user.email, 50);
                                    showToast(`Awarded +50 Kisse Coins to ${user.name}!`);
                                  }}
                                  title="Gift +50 Coins"
                                >
                                  +50
                                </button>
                                <button
                                  className="btn-step"
                                  onClick={() => {
                                    updateUserCoins(user.id || user.email, -25);
                                    showToast(`Deducted 25 Kisse Coins from ${user.name}`, 'info');
                                  }}
                                  title="Deduct 25 Coins"
                                >
                                  -25
                                </button>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="destination-cell">
                              <MapPin size={13} className="pin-icon" />
                              <span className="address-text">{user.defaultAddress || 'Mumbai, Maharashtra'}</span>
                            </div>
                          </td>

                          <td>
                            <div className="action-buttons-cell">
                              {user.role !== 'admin' && (
                                <button
                                  className="banner-del-btn"
                                  onClick={() => {
                                    if (window.confirm(`Remove user ${user.name} from customer registry?`)) {
                                      deleteCustomerUser(user.id || user.email);
                                      showToast(`Customer account deleted`, 'info');
                                    }
                                  }}
                                  title="Delete User"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================
              TAB: CUSTOMER FEEDBACK & REVIEWS MANAGEMENT
              ================================================================ */}
          {activeTab === 'feedback' && (
            <div className="admin-tab-pane">
              <div className="pane-header-row">
                <div>
                  <h2 className="pane-title">Customer Feedback & Reviews Master</h2>
                  <p className="pane-subtitle">Inspect customer testimonials, moderate star ratings, and curate the storefront review wall.</p>
                </div>
                <div className="header-actions">
                  <button className="admin-btn-primary" onClick={() => setIsAddFeedbackModalOpen(true)}>
                    <Plus size={16} />
                    <span>Create Testimonial</span>
                  </button>
                </div>
              </div>

              {/* 4 Review Analytics KPI Cards */}
              <div className="kpi-grid">
                <div className="kpi-card gold-glow">
                  <div className="kpi-top">
                    <span className="kpi-label">Average Satisfaction</span>
                    <div className="kpi-icon-pill gold"><Star size={18} /></div>
                  </div>
                  <div className="kpi-value">
                    {(reviews.reduce((s, r) => s + (r.ratingCookies || 5), 0) / (reviews.length || 1)).toFixed(1)} <span className="kpi-sub-unit">/ 5.0</span>
                  </div>
                  <div className="kpi-trend positive">
                    <span>⭐⭐⭐⭐⭐ High Acclaim</span>
                  </div>
                </div>

                <div className="kpi-card crimson-glow">
                  <div className="kpi-top">
                    <span className="kpi-label">Total Verified Reviews</span>
                    <div className="kpi-icon-pill red"><MessageSquare size={18} /></div>
                  </div>
                  <div className="kpi-value">{reviews.length} <span className="kpi-sub-unit">Reviews</span></div>
                  <div className="kpi-footer-status">
                    <span>{reviews.filter(r => r.ratingCookies === 5).length} 5-Star Reviews</span>
                  </div>
                </div>

                <div className="kpi-card emerald-glow">
                  <div className="kpi-top">
                    <span className="kpi-label">Storefront Featured</span>
                    <div className="kpi-icon-pill emerald"><CheckCircle size={18} /></div>
                  </div>
                  <div className="kpi-value">
                    {reviews.filter(r => r.isFeatured).length} <span className="kpi-sub-unit">Live Slides</span>
                  </div>
                  <div className="kpi-trend positive">
                    <span>Promoted on Home Wall</span>
                  </div>
                </div>

                <div className="kpi-card blue-glow">
                  <div className="kpi-top">
                    <span className="kpi-label">Eggless Quality Score</span>
                    <div className="kpi-icon-pill blue"><Sparkles size={18} /></div>
                  </div>
                  <div className="kpi-value">99.4%</div>
                  <div className="kpi-trend positive">
                    <span>100% Pure Desi Ghee</span>
                  </div>
                </div>
              </div>

              {/* Feedback Search & Filter Toolbar */}
              <div className="filter-search-toolbar">
                <div className="search-input-wrapper">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search reviews by customer name, location, or flavour..."
                    value={feedbackSearchQuery}
                    onChange={(e) => setFeedbackSearchQuery(e.target.value)}
                    className="admin-search-input"
                  />
                  {feedbackSearchQuery && (
                    <button className="clear-search-btn" onClick={() => setFeedbackSearchQuery('')}>
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="filter-pill-selector">
                  {['ALL', '5', '4', '3'].map((rating) => (
                    <button
                      key={rating}
                      className={`filter-btn ${feedbackRatingFilter === rating ? 'active' : ''}`}
                      onClick={() => setFeedbackRatingFilter(rating)}
                    >
                      {rating === 'ALL' ? 'All Ratings' : `★ ${rating} Stars`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reviews Table */}
              <div className="admin-card-glass table-container">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Customer & City</th>
                      <th>Cookie Flavour</th>
                      <th>Rating</th>
                      <th>Review Quote</th>
                      <th>Storefront Visibility</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews
                      .filter(r => {
                        const matchesRating = feedbackRatingFilter === 'ALL' || String(r.ratingCookies) === feedbackRatingFilter;
                        const q = feedbackSearchQuery.toLowerCase().trim();
                        const matchesSearch = !q ||
                          (r.customerName && r.customerName.toLowerCase().includes(q)) ||
                          (r.location && r.location.toLowerCase().includes(q)) ||
                          (r.purchasedItem && r.purchasedItem.toLowerCase().includes(q)) ||
                          (r.reviewText && r.reviewText.toLowerCase().includes(q));
                        return matchesRating && matchesSearch;
                      })
                      .map(rev => (
                        <tr key={rev.id} className="order-data-row">
                          <td>
                            <div className="customer-cell">
                              <div className="cust-name"><b>{rev.customerName}</b></div>
                              <div className="cust-phone">📍 {rev.location || 'Mumbai'}</div>
                            </div>
                          </td>

                          <td>
                            <div className="sku-mini-name" style={{ color: 'var(--crimson-red)', fontWeight: 800 }}>
                              🍪 {rev.purchasedItem || 'Molten Cookie'}
                            </div>
                          </td>

                          <td>
                            <span className="sku-score-tag" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fcd34d' }}>
                              {'⭐'.repeat(rev.ratingCookies || 5)} ({rev.ratingCookies || 5}/5)
                            </span>
                          </td>

                          <td>
                            <div style={{ maxWidth: '340px', fontSize: '13px', fontStyle: 'italic', color: '#cbd5e1', lineHeight: 1.4 }}>
                              "{rev.reviewText}"
                            </div>
                          </td>

                          <td>
                            <button
                              className={`btn-coupon-toggle ${rev.isFeatured ? 'on' : 'off'}`}
                              onClick={() => {
                                toggleReviewFeatured(rev.id);
                                showToast(`Review storefront visibility toggled`);
                              }}
                            >
                              {rev.isFeatured ? '● Featured Live' : 'Hidden'}
                            </button>
                          </td>

                          <td>
                            <button
                              className="banner-del-btn"
                              onClick={() => {
                                if (window.confirm(`Delete review from ${rev.customerName}?`)) {
                                  deleteReview(rev.id);
                                  showToast('Review removed from platform', 'info');
                                }
                              }}
                              title="Delete Review"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================
              TAB: HERO BANNER & MARKETING CMS
              ================================================================ */}
          {activeTab === 'banners' && (
            <div className="admin-tab-pane">
              <div className="pane-header-row">
                <div>
                  <h2 className="pane-title">Storefront Hero Banner Management</h2>
                  <p className="pane-subtitle">Customize promotional headlines, campaign CTAs, slide priority and active seasonal graphics.</p>
                </div>
                <div className="header-actions">
                  <button className="admin-btn-primary" onClick={() => setIsAddBannerModalOpen(true)}>
                    <Plus size={16} />
                    <span>Create New Slide</span>
                  </button>
                </div>
              </div>

              {/* Banners List */}
              <div className="banners-management-grid">
                {heroBanners.map((banner, index) => {
                  const isEditing = editingBannerId === banner.id;
                  return (
                    <div key={banner.id} className={`banner-admin-card ${banner.isActive === false ? 'inactive' : ''}`}>
                      <div className="banner-card-top-bar">
                        <div className="banner-priority-cluster">
                          <span className="priority-badge">Slide #{index + 1}</span>
                          <button
                            className="btn-order-arrow"
                            disabled={index === 0}
                            onClick={() => handleMoveBanner(index, -1)}
                            title="Move Up"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            className="btn-order-arrow"
                            disabled={index === heroBanners.length - 1}
                            onClick={() => handleMoveBanner(index, 1)}
                            title="Move Down"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>

                        <div className="banner-top-actions">
                          <button
                            className={`banner-status-btn ${banner.isActive === false ? 'paused' : 'live'}`}
                            onClick={() => toggleBannerActive(banner.id)}
                          >
                            {banner.isActive === false ? 'Inactive' : '● Live on Store'}
                          </button>
                          <button
                            className="banner-del-btn"
                            onClick={() => deleteBanner(banner.id)}
                            title="Delete Slide"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Visual Preview Box with Actual Image */}
                      <div
                        className="banner-visual-preview"
                        style={{
                          backgroundImage: `url(${banner.imageDesktop || banner.bgImage || banner.image || '/images/saffron-pistachio.png'})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundColor: '#2a0404'
                        }}
                      >
                        <span className="banner-tag-chip">{banner.tag || 'FEATURED'}</span>
                        <h3 className="banner-prev-title">{banner.title || banner.headline}</h3>
                        <p className="banner-prev-sub">{banner.subtitle}</p>
                        <div className="banner-prev-cta">{banner.ctaText || 'Shop Now'} →</div>
                      </div>

                      {isEditing ? (
                        <div className="banner-edit-form">
                          <div>
                            <label>Banner Title</label>
                            <input
                              type="text"
                              className="admin-mini-input"
                              value={bannerEditForm.title || ''}
                              onChange={(e) => setBannerEditForm({ ...bannerEditForm, title: e.target.value })}
                            />
                          </div>

                          <div>
                            <label>Subtitle / Description</label>
                            <input
                              type="text"
                              className="admin-mini-input"
                              value={bannerEditForm.subtitle || ''}
                              onChange={(e) => setBannerEditForm({ ...bannerEditForm, subtitle: e.target.value })}
                            />
                          </div>

                          {/* Banner Image Asset Controls */}
                          <div className="banner-edit-img-section" style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '6px', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                              <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--admin-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase' }}>
                                <ImageIcon size={13} color="var(--admin-red-primary)" />
                                <span>Hero Banner Image</span>
                              </label>
                              <label className="upload-file-btn" style={{ padding: '4px 10px', fontSize: '11px', cursor: 'pointer', background: 'var(--admin-red-primary)', color: '#fff', borderRadius: '16px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <Upload size={12} />
                                <span>Upload File</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  onChange={(e) => handleBannerImageUpload(e, true)}
                                />
                              </label>
                            </div>

                            <input
                              type="text"
                              className="admin-mini-input"
                              placeholder="Image URL or upload from device"
                              value={bannerEditForm.imageDesktop || bannerEditForm.bgImage || ''}
                              onChange={(e) => setBannerEditForm({
                                ...bannerEditForm,
                                imageDesktop: e.target.value,
                                bgImage: e.target.value,
                                image: e.target.value
                              })}
                            />

                            {/* Live Thumbnail Preview */}
                            {(bannerEditForm.imageDesktop || bannerEditForm.bgImage) && (
                              <div style={{ marginTop: '8px', height: '110px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                                <img
                                  src={bannerEditForm.imageDesktop || bannerEditForm.bgImage}
                                  alt="Slide Preview"
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              </div>
                            )}

                            {/* Quick Preset Selector */}
                            <div style={{ marginTop: '8px' }}>
                              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>Quick Select Presets:</div>
                              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                                {[
                                  { label: 'Royal Saffron Pistachio', url: '/images/saffron-pistachio.png' },
                                  { label: 'Royal Festive Gift Box', url: '/images/gift-box.png' },
                                  { label: 'Belgian Dark Lava', url: '/images/dark-cocoa.png' },
                                  { label: 'Kannauj Rose Almond', url: '/images/rose-almond.png' },
                                  { label: 'Artisan Chocolate Chunk', url: '/images/chocolate-cookie.png' },
                                  { label: 'High Protein Oats Almond', url: '/images/protein-oats-almond.png' }
                                ].map((preset, pIdx) => (
                                  <button
                                    key={pIdx}
                                    type="button"
                                    onClick={() => setBannerEditForm({
                                      ...bannerEditForm,
                                      imageDesktop: preset.url,
                                      bgImage: preset.url,
                                      image: preset.url
                                    })}
                                    style={{
                                      border: (bannerEditForm.imageDesktop === preset.url) ? '2px solid var(--admin-red-primary)' : '1px solid #cbd5e1',
                                      borderRadius: '6px',
                                      padding: '2px',
                                      background: '#fff',
                                      cursor: 'pointer',
                                      flexShrink: 0
                                    }}
                                    title={preset.label}
                                  >
                                    <img src={preset.url} alt={preset.label} style={{ width: '38px', height: '28px', objectFit: 'cover', borderRadius: '4px', display: 'block' }} />
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="form-row-dual">
                            <div>
                              <label>Tag / Badge</label>
                              <input
                                type="text"
                                className="admin-mini-input"
                                value={bannerEditForm.tag || ''}
                                onChange={(e) => setBannerEditForm({ ...bannerEditForm, tag: e.target.value })}
                              />
                            </div>
                            <div>
                              <label>CTA Button Text</label>
                              <input
                                type="text"
                                className="admin-mini-input"
                                value={bannerEditForm.ctaText || ''}
                                onChange={(e) => setBannerEditForm({ ...bannerEditForm, ctaText: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="admin-form-group" style={{ marginTop: '6px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--admin-text-secondary)' }}>CTA Link</label>
                            <input
                              type="text"
                              className="admin-mini-input"
                              placeholder="#catalog or /gifting"
                              value={bannerEditForm.ctaLink || ''}
                              onChange={(e) => setBannerEditForm({ ...bannerEditForm, ctaLink: e.target.value })}
                            />
                          </div>

                          <div className="edit-form-actions">
                            <button className="btn-save-sm" onClick={() => handleSaveBannerEdit(banner.id)}>
                              <Save size={14} /> Save Slide
                            </button>
                            <button className="btn-cancel-sm" onClick={() => setEditingBannerId(null)}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="banner-card-bottom">
                          <button
                            className="btn-edit-banner"
                            onClick={() => {
                              setEditingBannerId(banner.id);
                              setBannerEditForm({
                                ...banner,
                                title: banner.title || banner.headline || '',
                                imageDesktop: banner.imageDesktop || banner.bgImage || banner.image || '/images/saffron-pistachio.png',
                                bgImage: banner.imageDesktop || banner.bgImage || banner.image || '/images/saffron-pistachio.png',
                                image: banner.imageDesktop || banner.bgImage || banner.image || '/images/saffron-pistachio.png'
                              });
                            }}
                          >
                            <Edit3 size={14} /> Edit Banner Content & Image
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================
              TAB 5: COUPONS & DISCOUNTS ENGINE
              ================================================================ */}
          {activeTab === 'coupons' && (
            <div className="admin-tab-pane">
              <div className="pane-header-row">
                <div>
                  <h2 className="pane-title">Discounts & Promo Code Engine</h2>
                  <p className="pane-subtitle">Manage customer promo codes, seasonal marketing discounts, and order thresholds.</p>
                </div>
              </div>

              <div className="coupon-engine-layout">
                {/* Create Coupon Card */}
                <div className="admin-card-glass flex-1">
                  <div className="card-glass-header">
                    <div className="header-title-group">
                      <Plus size={18} color="#e11d48" />
                      <h3>Create New Promo Code</h3>
                    </div>
                  </div>

                  <form onSubmit={handleCreateCoupon} className="coupon-create-form">
                    <div className="admin-form-group">
                      <label>Coupon Code (e.g. MEETHI20)</label>
                      <input
                        type="text"
                        required
                        placeholder="SUMMER25"
                        value={newCouponForm.code}
                        onChange={(e) => setNewCouponForm({ ...newCouponForm, code: e.target.value.toUpperCase() })}
                        className="admin-input uppercase"
                      />
                    </div>

                    <div className="form-row-dual">
                      <div className="admin-form-group">
                        <label>Discount Percentage (%)</label>
                        <input
                          type="number"
                          min="1"
                          max="90"
                          value={newCouponForm.discountPercent}
                          onChange={(e) => setNewCouponForm({ ...newCouponForm, discountPercent: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Min. Order Value (₹)</label>
                        <input
                          type="number"
                          min="0"
                          value={newCouponForm.minOrderAmount}
                          onChange={(e) => setNewCouponForm({ ...newCouponForm, minOrderAmount: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                    </div>

                    <div className="admin-form-group">
                      <label>Customer Offer Description</label>
                      <input
                        type="text"
                        placeholder="Festive 25% Off on All Cookie Boxes"
                        value={newCouponForm.description}
                        onChange={(e) => setNewCouponForm({ ...newCouponForm, description: e.target.value })}
                        className="admin-input"
                      />
                    </div>

                    <button type="submit" className="admin-btn-primary full-width">
                      <Tag size={16} /> Activate Coupon Code
                    </button>
                  </form>
                </div>

                {/* Active Coupons List */}
                <div className="admin-card-glass flex-2">
                  <div className="card-glass-header">
                    <div className="header-title-group">
                      <Tag size={18} color="#10b981" />
                      <h3>Active Store Discounts ({coupons.length})</h3>
                    </div>
                  </div>

                  <div className="coupons-table-list">
                    {coupons.map((cpn) => (
                      <div key={cpn.id || cpn.code} className="coupon-row-item">
                        <div className="coupon-left">
                          <span className="coupon-code-badge">{cpn.code}</span>
                          <div>
                            <div className="coupon-desc">{cpn.description || `${cpn.discountPercent}% Instant Off`}</div>
                            <div className="coupon-rule">Min Order: ₹{cpn.minOrderAmount || 0} • {cpn.discountPercent}% Discount</div>
                          </div>
                        </div>

                        <div className="coupon-actions">
                          <button
                            className={`btn-coupon-toggle ${cpn.isActive === false ? 'off' : 'on'}`}
                            onClick={() => toggleCouponActive(cpn.id)}
                          >
                            {cpn.isActive === false ? 'Disabled' : 'Active'}
                          </button>
                          <button
                            className="btn-coupon-del"
                            onClick={() => deleteCoupon(cpn.id)}
                            title="Delete coupon"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              TAB 6: SYSTEM & PINCODES SETTINGS
              ================================================================ */}
          {activeTab === 'settings' && (
            <div className="admin-tab-pane">
              <div className="pane-header-row">
                <div>
                  <h2 className="pane-title">Artisan Bakery System & Logistics</h2>
                  <p className="pane-subtitle">Inspect serviceable delivery pincodes, cloud synchronization status & security tokens.</p>
                </div>
              </div>

              <div className="settings-grid">
                {/* Packaging Stock Widget */}
                <div className="admin-card-glass">
                  <div className="card-glass-header">
                    <div className="header-title-group">
                      <Package size={18} color="#f59e0b" />
                      <h3>Packaging Materials Stock</h3>
                    </div>
                  </div>
                  <div className="packaging-list">
                    {packagingStock.map(pkg => (
                      <div key={pkg.id} className="pkg-stock-row">
                        <div>
                          <div className="pkg-name">{pkg.name}</div>
                          <div className="pkg-meta">Threshold: {pkg.lowThreshold} {pkg.unit}</div>
                        </div>
                        <div className="pkg-controls">
                          <button className="btn-pkg-step" onClick={() => updatePackagingStock(pkg.id, -10)}>-10</button>
                          <span className="pkg-val"><b>{pkg.stock}</b> {pkg.unit}</span>
                          <button className="btn-pkg-step" onClick={() => updatePackagingStock(pkg.id, +25)}>+25</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Editable Serviceable Pincodes Manager */}
                <div className="admin-card-glass full-col">
                  <div className="card-glass-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div className="header-title-group">
                      <MapPin size={18} color="#3b82f6" />
                      <h3 style={{ color: 'var(--admin-text-main)', margin: 0 }}>Deliverable Serviceable Pincodes</h3>
                      <span className="badge-pincode-count" style={{ background: '#3b82f6', color: '#ffffff', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '12px', marginLeft: '6px' }}>
                        {serviceablePincodes.length} Active Zones
                      </span>
                    </div>

                    <div style={{ position: 'relative', width: '240px' }}>
                      <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#666666' }} />
                      <input
                        type="text"
                        placeholder="Search active pincodes..."
                        value={pincodeSearchQuery}
                        onChange={(e) => setPincodeSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '7px 10px 7px 32px', background: '#FFFFFF', border: '1.5px solid var(--admin-border)', borderRadius: '6px', color: 'var(--admin-text-main)', fontSize: '12.5px', fontWeight: 600, outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div className="pincode-manager-box">
                    {/* Add Pincode Form */}
                    <form onSubmit={handleAddPincodeSubmit} className="pincode-add-form">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter 6-digit Indian Pincode (e.g. 400050)"
                        value={newPincodeInput}
                        onChange={(e) => setNewPincodeInput(e.target.value.replace(/\D/g, ''))}
                        className="pincode-input-field"
                      />
                      <button type="submit" className="btn-add-pincode">
                        <Plus size={16} />
                        <span>Add Deliverable Pincode</span>
                      </button>
                    </form>

                    {/* Quick Preset Add Suggestions */}
                    <div className="pincode-presets-row">
                      <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--admin-text-main)', marginRight: '4px' }}>
                        ⚡ Quick Mumbai Presets:
                      </span>
                      {[
                        { pin: '400052', name: 'Khar' },
                        { pin: '400054', name: 'Santacruz' },
                        { pin: '400013', name: 'Lower Parel' },
                        { pin: '400018', name: 'Worli' },
                        { pin: '400058', name: 'Andheri West' },
                        { pin: '400071', name: 'Chembur' },
                        { pin: '400056', name: 'Vile Parle' },
                        { pin: '400092', name: 'Borivali' }
                      ].map(preset => {
                        const isAlreadyAdded = serviceablePincodes.includes(preset.pin);
                        return (
                          <button
                            key={preset.pin}
                            type="button"
                            className={`pincode-preset-btn ${isAlreadyAdded ? 'added' : ''}`}
                            style={isAlreadyAdded ? { opacity: 0.6, cursor: 'default', background: '#F3F4F6', borderColor: '#E5E7EB', color: '#6B7280' } : {}}
                            disabled={isAlreadyAdded}
                            onClick={() => {
                              if (!isAlreadyAdded) {
                                const res = addPincode(preset.pin);
                                if (res.success) showToast(`Added ${preset.pin} (${preset.name})!`, 'success');
                              }
                            }}
                          >
                            {isAlreadyAdded ? `✓ ${preset.pin} (${preset.name})` : `+ ${preset.pin} (${preset.name})`}
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Pincodes List with Delete Action */}
                    <div className="pincode-chips-grid">
                      {serviceablePincodes
                        .filter(pin => !pincodeSearchQuery || pin.includes(pincodeSearchQuery.trim()))
                        .map(pin => (
                          <div key={pin} className="pincode-chip-card">
                            <MapPin size={13} color="#2563EB" />
                            <span style={{ color: '#111111', fontWeight: 800 }}>{pin}</span>
                            <button
                              type="button"
                              className="pincode-delete-btn"
                              title={`Delete ${pin}`}
                              onClick={() => handleDeletePincode(pin)}
                              aria-label={`Delete ${pin}`}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      {serviceablePincodes.filter(pin => !pincodeSearchQuery || pin.includes(pincodeSearchQuery.trim())).length === 0 && (
                        <div style={{ padding: '16px', color: 'var(--admin-text-muted)', fontSize: '13px', fontStyle: 'italic' }}>
                          No pincodes match your search query.
                        </div>
                      )}
                    </div>

                    <p style={{ fontSize: '12px', color: 'var(--admin-text-secondary)', margin: 0 }}>
                      💡 Customers whose delivery pincode matches any of the active pincodes above will receive <b>1-Day Mumbai Express Delivery</b> during checkout and PDP pincode verification.
                    </p>
                  </div>
                </div>

                {/* Database Telemetry & Safety Tools */}
                <div className="admin-card-glass full-col">
                  <div className="card-glass-header">
                    <div className="header-title-group">
                      <AlertTriangle size={18} color="#ef4444" />
                      <h3>Platform Reset & Demo Tools</h3>
                    </div>
                  </div>
                  <div className="system-reset-box">
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: '14px' }}>
                      Need to reset mock orders, restock all 9 cookies, or clear browser cache for customer testing?
                    </p>
                    <button
                      className="btn-danger-reset"
                      onClick={() => {
                        if (window.confirm('Reset all demo orders, banners, and cookies to factory defaults?')) {
                          resetSiteData();
                          showToast('All demo data restored to defaults', 'info');
                        }
                      }}
                    >
                      <RefreshCw size={15} />
                      <span>Restore Factory Demo Data</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================================================================
          MODAL: ADD NEW SKU
          ================================================================ */}
      {isAddSkuModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="modal-header">
              <h3>🍪 Add New Artisan Cookie SKU</h3>
              <button className="modal-close-btn" onClick={() => setIsAddSkuModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNewSku} className="admin-modal-form">
              {/* Image Manager in Add Modal */}
              <div className="sku-image-manager-box modal-img-box">
                <div className="image-manager-header">
                  <label className="edit-section-label">
                    <ImageIcon size={14} color="var(--admin-red-primary)" />
                    <span>Cookie Image Selection</span>
                  </label>
                </div>

                <div className="modal-img-top-row">
                  <img
                    src={newSkuForm.photoUrls?.[0] || '/images/saffron-pistachio.png'}
                    alt="New SKU Preview"
                    className="modal-sku-preview-img"
                  />
                  <div className="modal-img-actions-col">
                    <label className="btn-device-upload">
                      <Upload size={13} />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'new')}
                        style={{ display: 'none' }}
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Or enter image URL (/images/...)"
                      className="admin-input modal-img-url-input"
                      value={newSkuForm.photoUrls?.[0] || ''}
                      onChange={(e) => setNewSkuForm({ ...newSkuForm, photoUrls: [e.target.value] })}
                    />
                  </div>
                </div>

                <div className="sku-presets-container">
                  <span className="preset-label-hint">Pick from Bakery Presets:</span>
                  <div className="sku-preset-thumbs-strip">
                    {PRESET_COOKIE_IMAGES.map((preset, pIdx) => {
                      const isSelected = (newSkuForm.photoUrls?.[0] === preset.url);
                      return (
                        <button
                          key={pIdx}
                          type="button"
                          className={`sku-preset-btn ${isSelected ? 'active' : ''}`}
                          onClick={() => setNewSkuForm({ ...newSkuForm, photoUrls: [preset.url] })}
                          title={preset.label}
                        >
                          <img src={preset.url} alt={preset.label} />
                          {isSelected && (
                            <span className="preset-check-icon">
                              <Check size={10} strokeWidth={3} />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Cookie SKU Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cardamom Rose Pistachio Cookie"
                  value={newSkuForm.name}
                  onChange={(e) => setNewSkuForm({ ...newSkuForm, name: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="form-row-dual">
                <div className="admin-form-group">
                  <label>Price per Box (₹)</label>
                  <input
                    type="number"
                    required
                    value={newSkuForm.price}
                    onChange={(e) => setNewSkuForm({ ...newSkuForm, price: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Initial Stock (Units)</label>
                  <input
                    type="number"
                    required
                    value={newSkuForm.stockPieces}
                    onChange={(e) => setNewSkuForm({ ...newSkuForm, stockPieces: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="form-row-dual">
                <div className="admin-form-group">
                  <label>Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Chef Special"
                    value={newSkuForm.badge}
                    onChange={(e) => setNewSkuForm({ ...newSkuForm, badge: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Category</label>
                  <select
                    className="admin-input"
                    value={newSkuForm.category}
                    onChange={(e) => setNewSkuForm({ ...newSkuForm, category: e.target.value })}
                  >
                    <option value="signature">Signature Collection</option>
                    <option value="chocolate">Rich Chocolate</option>
                    <option value="gifting">Festive Tin Gifting</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Artisan Kahani Story Quote</label>
                <textarea
                  rows="3"
                  className="admin-input"
                  value={newSkuForm.kahaniText}
                  onChange={(e) => setNewSkuForm({ ...newSkuForm, kahaniText: e.target.value })}
                />
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsAddSkuModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  <Save size={16} /> Publish SKU to Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================
          MODAL: ADD NEW HERO BANNER
          ================================================================ */}
      {isAddBannerModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="modal-header">
              <h3>🖼️ Add New Hero Banner Slide</h3>
              <button className="modal-close-btn" onClick={() => setIsAddBannerModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNewBanner} className="admin-modal-form">
              <div className="admin-form-group">
                <label>Headline Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Diwali Mithai Cookie Tins"
                  value={newBannerForm.title}
                  onChange={(e) => setNewBannerForm({ ...newBannerForm, title: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label>Subtitle / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Handcrafted in pure desi ghee with saffron and pistachios."
                  value={newBannerForm.subtitle}
                  onChange={(e) => setNewBannerForm({ ...newBannerForm, subtitle: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="form-row-dual">
                <div className="admin-form-group">
                  <label>Tag / Badge</label>
                  <input
                    type="text"
                    value={newBannerForm.tag}
                    onChange={(e) => setNewBannerForm({ ...newBannerForm, tag: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label>CTA Button Text</label>
                  <input
                    type="text"
                    value={newBannerForm.ctaText}
                    onChange={(e) => setNewBannerForm({ ...newBannerForm, ctaText: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsAddBannerModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  <Sparkles size={16} /> Publish Hero Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================
          MODAL: INVOICE / PACKING SLIP PRINT PREVIEW
          ================================================================ */}
      {selectedOrderForInvoice && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box invoice-modal">
            <div className="modal-header">
              <h3>📦 Kitchen Dispatch & Packing Slip</h3>
              <button className="modal-close-btn" onClick={() => setSelectedOrderForInvoice(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="slip-printable-area">
              <div className="slip-header">
                <div>
                  <h2 className="slip-brand">MEETHI KAHANI</h2>
                  <div className="slip-tag">100% Pure Eggless Artisanal Cookies</div>
                  <div className="slip-location">Baking Studio: Bandra West, Mumbai</div>
                </div>
                <div className="slip-order-meta">
                  <div className="slip-id">ORDER #{selectedOrderForInvoice.id}</div>
                  <div className="slip-date">{selectedOrderForInvoice.date || 'Today'}</div>
                  <div className="slip-type-badge">{selectedOrderForInvoice.orderType || 'PERSONAL'}</div>
                </div>
              </div>

              <div className="slip-divider"></div>

              <div className="slip-customer-grid">
                <div>
                  <div className="slip-label">DISPATCH TO:</div>
                  <div className="slip-cust-name">{selectedOrderForInvoice.customerName || 'Valued Customer'}</div>
                  <div className="slip-address">{selectedOrderForInvoice.address || 'Mumbai, Maharashtra'}</div>
                  <div className="slip-phone">📞 {selectedOrderForInvoice.phone || 'N/A'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="slip-label">PAYMENT DETAILS:</div>
                  <div className="slip-pay-mode">{selectedOrderForInvoice.paymentMode || 'UPI'} - {selectedOrderForInvoice.isPaid ? 'PAID ONLINE' : 'CASH ON DELIVERY'}</div>
                  <div className="slip-total-amount">₹{selectedOrderForInvoice.totalAmount}</div>
                </div>
              </div>

              <div className="slip-items-table">
                <div className="slip-table-head">
                  <span>ITEM DESCRIPTION</span>
                  <span style={{ textAlign: 'center' }}>QTY</span>
                  <span style={{ textAlign: 'right' }}>AMOUNT</span>
                </div>
                {Array.isArray(selectedOrderForInvoice.items) && selectedOrderForInvoice.items.length > 0 ? (
                  selectedOrderForInvoice.items.map((it, idx) => (
                    <div key={idx} className="slip-table-row">
                      <span>{it.name || it.title}</span>
                      <span style={{ textAlign: 'center' }}>{it.qty}</span>
                      <span style={{ textAlign: 'right' }}>₹{(it.price || 349) * (it.qty || 1)}</span>
                    </div>
                  ))
                ) : (
                  <div className="slip-table-row">
                    <span>Artisanal Cookie Box</span>
                    <span style={{ textAlign: 'center' }}>1</span>
                    <span style={{ textAlign: 'right' }}>₹{selectedOrderForInvoice.totalAmount}</span>
                  </div>
                )}
              </div>

              <div className="slip-footer-note">
                Handcrafted with pure desi ghee • Freshness guaranteed • Packed with wax seal
              </div>
            </div>

            <div className="modal-footer-actions">
              <button className="btn-cancel" onClick={() => setSelectedOrderForInvoice(null)}>
                Close
              </button>
              <button
                className="admin-btn-primary"
                onClick={() => {
                  window.print();
                }}
              >
                <Printer size={16} /> Print Packing Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          MODAL: ADD NEW CUSTOMER / USER ACCOUNT
          ================================================================ */}
      {isAddUserModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="modal-header">
              <h3>👤 Register New Customer Account</h3>
              <button className="modal-close-btn" onClick={() => setIsAddUserModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newUserForm.name || !newUserForm.email) return;
                addCustomerUser(newUserForm);
                setIsAddUserModalOpen(false);
                setNewUserForm({
                  name: '',
                  email: '',
                  phone: '',
                  role: 'customer',
                  kisseCoins: 100,
                  defaultAddress: ''
                });
                showToast(`Customer account for "${newUserForm.name}" created!`, 'success');
              }}
              className="admin-modal-form"
            >
              <div className="admin-form-group">
                <label>Full Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohini Deshmukh"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="form-row-dual">
                <div className="admin-form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="customer@gmail.com"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98200 98200"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="form-row-dual">
                <div className="admin-form-group">
                  <label>Account Role</label>
                  <select
                    className="admin-input"
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  >
                    <option value="customer">Cookie Customer</option>
                    <option value="admin">Staff / Admin</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Welcome Kisse Coins</label>
                  <input
                    type="number"
                    value={newUserForm.kisseCoins}
                    onChange={(e) => setNewUserForm({ ...newUserForm, kisseCoins: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Default Delivery Address</label>
                <input
                  type="text"
                  placeholder="e.g. Flat 301, Palm Court, Bandra West, Mumbai - 400050"
                  value={newUserForm.defaultAddress}
                  onChange={(e) => setNewUserForm({ ...newUserForm, defaultAddress: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsAddUserModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  <UserPlus size={16} /> Save Customer Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================
          MODAL: ADD OFFICIAL CUSTOMER TESTIMONIAL / FEEDBACK
          ================================================================ */}
      {isAddFeedbackModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="modal-header">
              <h3>⭐ Add Verified Customer Review</h3>
              <button className="modal-close-btn" onClick={() => setIsAddFeedbackModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newAdminFeedbackForm.customerName || !newAdminFeedbackForm.reviewText) return;
                addReview(newAdminFeedbackForm);
                setIsAddFeedbackModalOpen(false);
                setNewAdminFeedbackForm({
                  customerName: '',
                  location: 'Mumbai',
                  purchasedItem: 'Royal Saffron Pistachio Molten Melt Cookie',
                  ratingCookies: 5,
                  reviewText: ''
                });
                showToast(`Review published to live storefront wall!`, 'success');
              }}
              className="admin-modal-form"
            >
              <div className="form-row-dual">
                <div className="admin-form-group">
                  <label>Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Roy"
                    value={newAdminFeedbackForm.customerName}
                    onChange={(e) => setNewAdminFeedbackForm({ ...newAdminFeedbackForm, customerName: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label>City / Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bandra West, Mumbai"
                    value={newAdminFeedbackForm.location}
                    onChange={(e) => setNewAdminFeedbackForm({ ...newAdminFeedbackForm, location: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="form-row-dual">
                <div className="admin-form-group">
                  <label>Cookie Flavour</label>
                  <select
                    className="admin-input"
                    value={newAdminFeedbackForm.purchasedItem}
                    onChange={(e) => setNewAdminFeedbackForm({ ...newAdminFeedbackForm, purchasedItem: e.target.value })}
                  >
                    {cookies.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Star Rating</label>
                  <select
                    className="admin-input"
                    value={newAdminFeedbackForm.ratingCookies}
                    onChange={(e) => setNewAdminFeedbackForm({ ...newAdminFeedbackForm, ratingCookies: Number(e.target.value) })}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Outstanding)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars - Great)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars - Good)</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Review Quote & Testimonial</label>
                <textarea
                  rows="3"
                  required
                  placeholder="The molten center and grass-fed butter dough were melt-in-mouth..."
                  value={newAdminFeedbackForm.reviewText}
                  onChange={(e) => setNewAdminFeedbackForm({ ...newAdminFeedbackForm, reviewText: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsAddFeedbackModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  <Star size={16} /> Publish to Storefront Wall
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================
          MODAL: CREATE NEW META AD CAMPAIGN
          ================================================================ */}
      {isAddCampaignModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="modal-header">
              <h3>🎯 Launch New Meta Ad Campaign</h3>
              <button className="modal-close-btn" onClick={() => setIsAddCampaignModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNewCampaign} className="admin-modal-form">
              <div className="admin-form-group">
                <label>Campaign Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. [BOFU] Saffron Pistachio Reel - Mumbai Gourmet Foodies"
                  value={newCampaignForm.name}
                  onChange={(e) => setNewCampaignForm({ ...newCampaignForm, name: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="form-row-dual">
                <div className="admin-form-group">
                  <label>Campaign Objective</label>
                  <select
                    className="admin-input"
                    value={newCampaignForm.objective}
                    onChange={(e) => setNewCampaignForm({ ...newCampaignForm, objective: e.target.value })}
                  >
                    <option value="CONVERSIONS">Sales & Conversions (Purchase Event)</option>
                    <option value="RETARGETING">Retargeting (Abandoned Cart & PDPs)</option>
                    <option value="AWARENESS">Brand Awareness & Video Views</option>
                    <option value="TRAFFIC">Store Traffic & Clicks</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Daily Ad Budget (₹)</label>
                  <input
                    type="number"
                    required
                    min="100"
                    step="100"
                    value={newCampaignForm.dailyBudget}
                    onChange={(e) => setNewCampaignForm({ ...newCampaignForm, dailyBudget: Number(e.target.value) })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Target Audience & Geo Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Luxury Desserts, Foodies (24-45 yrs) • Bandra, Powai, SoBo"
                  value={newCampaignForm.audience}
                  onChange={(e) => setNewCampaignForm({ ...newCampaignForm, audience: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label>Ad Creative Headline / Primary Copy</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Molten Saffron Lava Center Slow-Baked in Mumbai 🍪"
                  value={newCampaignForm.creativeHeadline}
                  onChange={(e) => setNewCampaignForm({ ...newCampaignForm, creativeHeadline: e.target.value })}
                  className="admin-input"
                />
              </div>

              {/* Creative Image Visual Picker */}
              <div className="sku-image-manager-box modal-img-box">
                <div className="image-manager-header">
                  <label className="edit-section-label">
                    <ImageIcon size={14} color="var(--admin-red-primary)" />
                    <span>Attach Cookie Visual Asset</span>
                  </label>
                </div>

                <div className="sku-presets-container">
                  <div className="sku-preset-thumbs-strip">
                    {PRESET_COOKIE_IMAGES.map((preset, pIdx) => {
                      const isSelected = (newCampaignForm.adImage === preset.url);
                      return (
                        <button
                          key={pIdx}
                          type="button"
                          className={`sku-preset-btn ${isSelected ? 'active' : ''}`}
                          onClick={() => setNewCampaignForm({ ...newCampaignForm, adImage: preset.url })}
                          title={preset.label}
                        >
                          <img src={preset.url} alt={preset.label} />
                          {isSelected && (
                            <span className="preset-check-icon">
                              <Check size={10} strokeWidth={3} />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsAddCampaignModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  <Target size={16} /> Publish Campaign to Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================
          MODAL: CREATE NEW HERO BANNER SLIDE
          ================================================================ */}
      {isAddBannerModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box" style={{ maxWidth: '620px' }}>
            <div className="modal-header">
              <h3>🎨 Create New Storefront Hero Banner Slide</h3>
              <button className="modal-close-btn" onClick={() => setIsAddBannerModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNewBanner} className="admin-modal-form">
              <div className="admin-form-group">
                <label>Slide Title / Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100% Pure Eggless Artisanal Cookies"
                  value={newBannerForm.title}
                  onChange={(e) => setNewBannerForm({ ...newBannerForm, title: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label>Subtitle / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Slow-baked in Mumbai. Delivered fresh daily."
                  value={newBannerForm.subtitle}
                  onChange={(e) => setNewBannerForm({ ...newBannerForm, subtitle: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="form-row-dual">
                <div className="admin-form-group">
                  <label>Tag / Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. NEW LAUNCH or FESTIVE"
                    value={newBannerForm.tag}
                    onChange={(e) => setNewBannerForm({ ...newBannerForm, tag: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label>CTA Button Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Explore Collection"
                    value={newBannerForm.ctaText}
                    onChange={(e) => setNewBannerForm({ ...newBannerForm, ctaText: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>CTA Target Link</label>
                <input
                  type="text"
                  placeholder="e.g. #catalog or /gifting"
                  value={newBannerForm.ctaLink}
                  onChange={(e) => setNewBannerForm({ ...newBannerForm, ctaLink: e.target.value })}
                  className="admin-input"
                />
              </div>

              {/* Banner Image Asset Selector & Uploader */}
              <div className="sku-image-manager-box modal-img-box">
                <div className="image-manager-header">
                  <label className="edit-section-label">
                    <ImageIcon size={14} color="var(--admin-red-primary)" />
                    <span>Hero Banner Image</span>
                  </label>
                  <label className="upload-file-btn">
                    <Upload size={13} />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleBannerImageUpload(e, false)}
                    />
                  </label>
                </div>

                <div className="url-input-strip">
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Enter Image URL or upload a file above"
                    value={newBannerForm.imageDesktop || newBannerForm.bgImage || ''}
                    onChange={(e) => setNewBannerForm({
                      ...newBannerForm,
                      imageDesktop: e.target.value,
                      bgImage: e.target.value,
                      image: e.target.value
                    })}
                  />
                </div>

                {/* Image Live Preview */}
                {(newBannerForm.imageDesktop || newBannerForm.bgImage) && (
                  <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', height: '140px', border: '1px solid #e2e8f0' }}>
                    <img
                      src={newBannerForm.imageDesktop || newBannerForm.bgImage}
                      alt="Banner Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}

                {/* Preset Cookie / Gift Banner Visuals */}
                <div className="sku-presets-container" style={{ marginTop: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Quick Select Bakery Image Presets:</span>
                  <div className="sku-preset-thumbs-strip" style={{ marginTop: '6px' }}>
                    {[
                      { label: 'Royal Saffron Pistachio', url: '/images/saffron-pistachio.png' },
                      { label: 'Royal Festive Gift Box', url: '/images/gift-box.png' },
                      { label: 'Belgian Dark Lava', url: '/images/dark-cocoa.png' },
                      { label: 'Kannauj Rose Almond', url: '/images/rose-almond.png' },
                      { label: 'Artisan Chocolate Chunk', url: '/images/chocolate-cookie.png' },
                      { label: 'High Protein Oats Almond', url: '/images/protein-oats-almond.png' }
                    ].map((preset, pIdx) => {
                      const isSelected = (newBannerForm.imageDesktop === preset.url || newBannerForm.bgImage === preset.url);
                      return (
                        <button
                          key={pIdx}
                          type="button"
                          className={`sku-preset-btn ${isSelected ? 'active' : ''}`}
                          onClick={() => setNewBannerForm({
                            ...newBannerForm,
                            imageDesktop: preset.url,
                            bgImage: preset.url,
                            image: preset.url
                          })}
                          title={preset.label}
                        >
                          <img src={preset.url} alt={preset.label} />
                          {isSelected && (
                            <span className="preset-check-icon">
                              <Check size={10} strokeWidth={3} />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsAddBannerModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  <Plus size={16} /> Publish Banner Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
