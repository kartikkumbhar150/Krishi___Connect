import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldAlt,
  faCloudRain,
  faIndianRupeeSign,
  faSeedling,
  faCalendarCheck,
  faCheckCircle,
  faTriangleExclamation,
  faMapMarkerAlt,
  faBolt,
  faWater,
  faWind,
  faSun,
  faSnowflake,
  faFire,
  faBug,
  faPhone,
  faGlobe,
  faMobileAlt,
  faComments,
  faChevronDown,
  faChevronUp,
  faInfoCircle,
  faLeaf,
  faMoneyBillWave,
  faStar
} from '@fortawesome/free-solid-svg-icons';

// ─── DATA ────────────────────────────────────────────────────────────────────

const insurancePlans = [
  {
    id: 'pmfby',
    name: 'PMFBY',
    fullName: 'Pradhan Mantri Fasal Bima Yojana',
    coverageType: 'Yield + Prevented Sowing + Post-harvest + Mid-season adversity',
    premiumKharif: '2% of Sum Insured (max)',
    premiumRabi: '1.5% of Sum Insured (max)',
    premiumHorti: '5% of Sum Insured (max)',
    examplePremium: '₹1,000 on ₹50,000 insured (Kharif)',
    claimWindow: 'Within 72 hours of damage event',
    claimSettlement: 'Within 2 months of harvest',
    sumInsured: 'Equal to Scale of Finance per hectare (avg. ₹40,700/ha)',
    govtSubsidy: '95–98% of actual premium',
    portalLink: 'pmfby.gov.in',
    helpline: '14447',
    idealFor: 'Small & marginal farmers growing food, oilseed, or horticultural crops',
    pros: [
      'Lowest farmer premium in India (as low as ₹1 in some states like Maharashtra)',
      'Covers pre-sowing to post-harvest losses',
      'Government-funded: ₹69,515 crore allocated for FY22–26',
      'Voluntary since 2020; KCC farmers auto-enrolled',
      'YES-TECH satellite-based claim verification since Kharif 2023'
    ],
    caution: 'Claim confirmation requires state-level survey. 72-hour reporting is mandatory — missing it can mean rejection.',
    tag: 'Most Popular',
    tagColor: 'bg-emerald-100 text-emerald-700'
  },
  {
    id: 'rwbcis',
    name: 'RWBCIS',
    fullName: 'Restructured Weather Based Crop Insurance Scheme',
    coverageType: 'Rainfall deficit/excess · Temperature extremes · Humidity · Wind speed',
    premiumKharif: '2% of Sum Insured (food & oilseeds)',
    premiumRabi: '1.5% of Sum Insured (food & oilseeds)',
    premiumHorti: '5% of Sum Insured (commercial/horticulture)',
    examplePremium: '₹1,500 on ₹75,000 insured (horticulture Kharif)',
    claimWindow: 'Auto-triggered — no intimation required',
    claimSettlement: '45 days after trigger event',
    sumInsured: 'Based on state govt. payout structure per crop/district',
    govtSubsidy: 'Centre + State share remaining after farmer premium',
    portalLink: 'pmfby.gov.in',
    helpline: '14447',
    idealFor: 'Rain-fed areas; horticulture farmers growing grapes, pomegranate, tomato, banana',
    pros: [
      'No field inspection needed — weather station data auto-settles',
      'Covers rainfall deficit, excess rain, high/low temperatures, humidity',
      'Add-on for hailstorm & cloudburst available',
      'Implemented across Maharashtra, Rajasthan, MP, Karnataka, AP and more',
      'Ideal for horticultural crops where PMFBY coverage is limited'
    ],
    caution: 'Payout linked to weather station readings, not actual field loss (basis risk). Choose only if weather station is within 10–15 km.',
    tag: 'Weather-Based',
    tagColor: 'bg-sky-100 text-sky-700'
  },
  {
    id: 'localized',
    name: 'Localized Peril',
    fullName: 'Localized Peril Insurance (Add-on under PMFBY)',
    coverageType: 'Hailstorm · Landslide · Inundation · Cloudburst · Flash floods',
    premiumKharif: '3%–7% of Sum Insured',
    premiumRabi: '3%–7% of Sum Insured',
    premiumHorti: '5%–8% of Sum Insured',
    examplePremium: '₹3,500–₹7,000 on ₹1 lakh insured',
    claimWindow: '48–72 hours after localized event',
    claimSettlement: '7–15 days post verification',
    sumInsured: 'Individual farm basis; linked to crop value',
    govtSubsidy: 'Partial; state-dependent',
    portalLink: 'pmfby.gov.in',
    helpline: '14447 / State Agriculture Dept.',
    idealFor: 'Hilly terrains, Western Ghats, Northeast India, flood-prone plains',
    pros: [
      'Individual farm-level coverage — not area-based',
      'Fast claim on identifiable local events',
      'Can be bundled on top of PMFBY base policy',
      'Covers events not captured by area-yield triggers'
    ],
    caution: 'Only covers the listed local perils. Does not compensate for widespread drought or market price loss.',
    tag: 'Add-On',
    tagColor: 'bg-purple-100 text-purple-700'
  },
  {
    id: 'comprehensive',
    name: 'Multi-Risk Policy',
    fullName: 'Comprehensive Multi-Risk Crop Insurance (Private/AIC)',
    coverageType: 'Flood + Drought + Pest + Fire + Storm + Disease + Post-harvest',
    premiumKharif: '6%–10% of Sum Insured',
    premiumRabi: '6%–10% of Sum Insured',
    premiumHorti: '8%–12% of Sum Insured',
    examplePremium: '₹6,000–₹10,000 on ₹1 lakh insured',
    claimWindow: '7–15 days after incident report',
    claimSettlement: '30–60 days with documentation',
    sumInsured: 'Higher sum insured available — up to full commercial crop value',
    govtSubsidy: 'Minimal / none (private policies)',
    portalLink: 'aic.co.in / private insurers',
    helpline: 'Insurer toll-free',
    idealFor: 'High-value commercial crops, contract farming, export-oriented farms',
    pros: [
      'Broadest risk coverage — flood, drought, pest, fire, storm combined',
      'Higher insured amount suitable for commercial cultivation',
      'Useful for farms with bank/agri-finance loan collateral',
      'Preferred by corporate agri ventures and FPOs'
    ],
    caution: 'Higher premium with stricter documentation. No government subsidy in most private plans.',
    tag: 'Commercial',
    tagColor: 'bg-amber-100 text-amber-700'
  },
  {
    id: 'livestock',
    name: 'Livestock Insurance',
    fullName: 'National Livestock Mission Insurance / State Schemes',
    coverageType: 'Death of cattle, buffalo, sheep, goat, pig due to disease or accident',
    premiumKharif: '3%–4.5% of animal market value',
    premiumRabi: '3%–4.5% of animal market value',
    premiumHorti: 'N/A',
    examplePremium: '₹1,500–₹2,250 on a ₹50,000 animal',
    claimWindow: 'Within 24 hours of death',
    claimSettlement: '15–30 days post veterinary certificate',
    sumInsured: 'Market value of animal at time of insuring',
    govtSubsidy: 'Up to 50% premium subsidy for BPL and small farmers',
    portalLink: 'nlm.udyamimitra.in',
    helpline: 'State Animal Husbandry Dept.',
    idealFor: 'Farmers with mixed crop-livestock systems; dairy, poultry farmers',
    pros: [
      'Covers cattle, buffalo, sheep, goat, pig, poultry',
      '50% subsidy for small/marginal and BPL farmers',
      'Protects income from dairy/meat during climate disruptions',
      'Veterinary certificate triggers fast claim'
    ],
    caution: 'Must tag animals with official ear tag. Claim rejected without vet certificate within 24 hrs of death.',
    tag: 'Livestock',
    tagColor: 'bg-orange-100 text-orange-700'
  },
  {
    id: 'unified',
    name: 'UPIS',
    fullName: 'Unified Package Insurance Scheme (Bhartiya Krishi Bima)',
    coverageType: 'Crop + Life + Accident + Student scholarship + Asset insurance — bundled',
    premiumKharif: 'Bundled: ₹1,999–₹2,500/year (all covers)',
    premiumRabi: 'Bundled: ₹1,999–₹2,500/year (all covers)',
    premiumHorti: 'Bundled: ₹1,999–₹2,500/year (all covers)',
    examplePremium: '₹2,000/year for crop + life + accident + asset bundle',
    claimWindow: 'As per individual cover rules',
    claimSettlement: 'Varies by sub-policy',
    sumInsured: 'Crop: as per PMFBY; Life: ₹2L; Accident: ₹2L; Asset: up to ₹50K',
    govtSubsidy: 'Heavily subsidised by central govt.',
    portalLink: 'pmfby.gov.in',
    helpline: '14447',
    idealFor: 'Farmers wanting holistic financial safety net in a single affordable package',
    pros: [
      'One policy covers crop, life, accident, student scholarship, farm assets',
      'Extremely affordable bundled premium',
      'Farmer household coverage — not just crop',
      'Reduces need to buy multiple separate policies'
    ],
    caution: 'Rolled out in select states/districts. Check local availability before enrolling.',
    tag: 'Bundle',
    tagColor: 'bg-teal-100 text-teal-700'
  }
];

// ─── REGIONAL DATA ────────────────────────────────────────────────────────────

const disasterIcons = {
  Flood: faWater,
  Drought: faSun,
  Cyclone: faWind,
  Hailstorm: faSnowflake,
  'Pest Attack': faBug,
  Fire: faFire,
  Landslide: faTriangleExclamation,
  'Cold Wave': faSnowflake,
  Cloudburst: faCloudRain,
  'Heat Wave': faSun
};

const regions = [
  {
    id: 'northwest',
    name: 'Northwest India',
    states: 'Punjab · Haryana · Western UP · Rajasthan',
    color: 'amber',
    emoji: '🌾',
    primaryCrops: 'Wheat, Rice, Mustard, Cotton, Bajra',
    disasters: ['Drought', 'Hailstorm', 'Heat Wave', 'Pest Attack'],
    topInsurance: ['pmfby', 'rwbcis'],
    note: 'Rajasthan faces severe drought; Punjab/Haryana face hail during Rabi. PMFBY covers wheat at 1.5% premium. RWBCIS preferred for horticulture.',
    riskLevel: 'High',
    avgPremiumPaid: '₹800–₹1,500/ha'
  },
  {
    id: 'northeast',
    name: 'Northeast India',
    states: 'Assam · Meghalaya · Manipur · Tripura · Nagaland',
    color: 'green',
    emoji: '🌿',
    primaryCrops: 'Rice, Tea, Jute, Maize, Vegetables',
    disasters: ['Flood', 'Landslide', 'Cloudburst', 'Pest Attack'],
    topInsurance: ['pmfby', 'localized'],
    note: 'Centre covers 90% premium subsidy for NE states under PMFBY. Frequent floods & landslides make localized peril add-on critical.',
    riskLevel: 'Very High',
    avgPremiumPaid: '₹200–₹500/ha (90% subsidy)'
  },
  {
    id: 'central',
    name: 'Central India',
    states: 'Madhya Pradesh · Chhattisgarh · Vidarbha (Maharashtra)',
    color: 'orange',
    emoji: '🫘',
    primaryCrops: 'Soybean, Pulses, Wheat, Cotton, Jowar',
    disasters: ['Drought', 'Hailstorm', 'Pest Attack', 'Flood'],
    topInsurance: ['pmfby', 'rwbcis'],
    note: 'MP adopted 100% technology-based yield estimation under PMFBY. Vidarbha cotton farmers heavily insured under PMFBY. RWBCIS used for horticulture districts.',
    riskLevel: 'Very High',
    avgPremiumPaid: '₹1,000–₹2,000/ha'
  },
  {
    id: 'coastal',
    name: 'Coastal & Eastern India',
    states: 'Odisha · Andhra Pradesh · Tamil Nadu · West Bengal',
    color: 'blue',
    emoji: '🌊',
    primaryCrops: 'Rice, Coconut, Banana, Groundnut, Aquaculture',
    disasters: ['Cyclone', 'Flood', 'Pest Attack', 'Hailstorm'],
    topInsurance: ['pmfby', 'localized', 'comprehensive'],
    note: 'Highly cyclone-prone. PMFBY post-harvest cover (14 days after cut & spread) is critical. Odisha offers Re. 1 premium for farmers. Comprehensive policy recommended for coconut/banana plantations.',
    riskLevel: 'Very High',
    avgPremiumPaid: '₹500–₹1,000/ha (heavily subsidised)'
  },
  {
    id: 'western',
    name: 'Western India',
    states: 'Gujarat · Maharashtra (non-Vidarbha) · Goa',
    color: 'purple',
    emoji: '🍇',
    primaryCrops: 'Cotton, Groundnut, Sugarcane, Grapes, Pomegranate, Onion',
    disasters: ['Drought', 'Hailstorm', 'Pest Attack', 'Flood'],
    topInsurance: ['rwbcis', 'pmfby', 'comprehensive'],
    note: 'Maharashtra is a major RWBCIS hub — grapes & pomegranate farmers in Nashik/Solapur extensively use it. Gujarat cotton farmers depend on PMFBY. Horticulture farmers prefer RWBCIS for fast auto-settlement.',
    riskLevel: 'High',
    avgPremiumPaid: '₹1,500–₹3,000/ha'
  },
  {
    id: 'southern',
    name: 'Southern Deccan & Hills',
    states: 'Karnataka · Kerala · Telangana',
    color: 'teal',
    emoji: '☕',
    primaryCrops: 'Coffee, Tea, Rubber, Ragi, Paddy, Spices',
    disasters: ['Drought', 'Flood', 'Landslide', 'Pest Attack'],
    topInsurance: ['rwbcis', 'localized', 'comprehensive'],
    note: 'Kerala & Karnataka hills face landslides. Coffee/spice farms need comprehensive or localized cover. Telangana faces drought cycles. Karnataka 2023 drought caused ₹35,162 cr losses.',
    riskLevel: 'High',
    avgPremiumPaid: '₹2,000–₹4,000/ha'
  },
  {
    id: 'hilly',
    name: 'Himalayan & Hilly States',
    states: 'Himachal Pradesh · Uttarakhand · J&K · Sikkim',
    color: 'indigo',
    emoji: '🏔️',
    primaryCrops: 'Apple, Cherry, Pea, Potato, Wheat, Herbs',
    disasters: ['Hailstorm', 'Landslide', 'Cold Wave', 'Cloudburst'],
    topInsurance: ['localized', 'pmfby', 'rwbcis'],
    note: 'Apple & cherry orchards extremely vulnerable to hail. Localized peril insurance critical. WINDS scheme deploying AWS stations at block level for hyper-local weather data.',
    riskLevel: 'High',
    avgPremiumPaid: '₹2,000–₹5,000/ha'
  }
];

// ─── RECOMMENDATION ENGINE DATA ───────────────────────────────────────────────

const recommendationQuestions = [
  {
    id: 'region',
    question: 'Which region is your farm in?',
    options: [
      { value: 'northwest', label: 'Northwest (Punjab/Haryana/Rajasthan/W.UP)' },
      { value: 'northeast', label: 'Northeast (Assam/Meghalaya/Manipur etc.)' },
      { value: 'central', label: 'Central (MP/Chhattisgarh/Vidarbha)' },
      { value: 'coastal', label: 'Coastal/East (Odisha/AP/TN/W.Bengal)' },
      { value: 'western', label: 'Western (Gujarat/Maharashtra/Goa)' },
      { value: 'southern', label: 'Southern (Karnataka/Kerala/Telangana)' },
      { value: 'hilly', label: 'Hilly (HP/Uttarakhand/J&K/Sikkim)' }
    ]
  },
  {
    id: 'cropType',
    question: 'What type of crop do you grow?',
    options: [
      { value: 'foodgrain', label: 'Food grains (Rice, Wheat, Maize, Bajra)' },
      { value: 'oilseed', label: 'Oilseeds (Mustard, Groundnut, Soybean)' },
      { value: 'horticulture', label: 'Horticulture (Fruits, Vegetables, Spices)' },
      { value: 'commercial', label: 'Commercial (Cotton, Sugarcane, Jute)' },
      { value: 'livestock', label: 'Livestock / Dairy' }
    ]
  },
  {
    id: 'farmerType',
    question: 'What best describes you?',
    options: [
      { value: 'small', label: 'Small / Marginal farmer (< 2 ha)' },
      { value: 'medium', label: 'Medium farmer (2–5 ha)' },
      { value: 'large', label: 'Large / Commercial farmer (> 5 ha)' },
      { value: 'tenant', label: 'Tenant / Sharecropper' }
    ]
  }
];

const getRecommendations = (answers) => {
  const { region, cropType, farmerType } = answers;
  const results = [];

  if (cropType === 'livestock') {
    results.push({
      plan: insurancePlans.find(p => p.id === 'livestock'),
      reason: 'Livestock insurance is the primary option for dairy/cattle farmers.',
      priority: 1
    });
    results.push({
      plan: insurancePlans.find(p => p.id === 'pmfby'),
      reason: 'If you also grow crops, pair with PMFBY for crop coverage.',
      priority: 2
    });
    return results;
  }

  // Always recommend PMFBY for small/marginal/tenant and foodgrains
  if (farmerType === 'small' || farmerType === 'tenant' || cropType === 'foodgrain' || cropType === 'oilseed') {
    results.push({
      plan: insurancePlans.find(p => p.id === 'pmfby'),
      reason: `PMFBY offers maximum 2% (Kharif) / 1.5% (Rabi) premium for food grains and oilseeds, with government covering 95–98% of actuarial premium. Best fit for ${farmerType} farmers.`,
      priority: 1
    });
  }

  // RWBCIS for horticulture or rain-fed western/central regions
  if (cropType === 'horticulture' || region === 'western' || region === 'central') {
    results.push({
      plan: insurancePlans.find(p => p.id === 'rwbcis'),
      reason: 'RWBCIS is ideal for horticultural crops like grapes, pomegranate, tomato, banana — auto-settlement via weather stations. No field inspection needed.',
      priority: cropType === 'horticulture' ? 1 : 2
    });
  }

  // Localized peril for NE, hilly, coastal
  if (region === 'northeast' || region === 'hilly' || region === 'coastal') {
    results.push({
      plan: insurancePlans.find(p => p.id === 'localized'),
      reason: `${region === 'hilly' ? 'Hailstorm and landslides' : region === 'coastal' ? 'Cyclone and inundation' : 'Floods and cloudbursts'} are frequent in your region. Localized peril add-on gives individual farm-level coverage for these events on top of PMFBY.`,
      priority: 2
    });
  }

  // Comprehensive for large/commercial farmers
  if (farmerType === 'large' || cropType === 'commercial') {
    results.push({
      plan: insurancePlans.find(p => p.id === 'comprehensive'),
      reason: 'Large/commercial farms benefit from multi-risk policies with higher sum insured and broader coverage including pest, fire, storm, and disease simultaneously.',
      priority: 2
    });
  }

  // UPIS for small all-round protection
  if (farmerType === 'small' || farmerType === 'tenant') {
    results.push({
      plan: insurancePlans.find(p => p.id === 'unified'),
      reason: 'UPIS bundles crop + life + accident + scholarship in one affordable ₹2,000/year policy — ideal for marginal farmers wanting holistic household protection.',
      priority: 3
    });
  }

  // Remove duplicates, sort by priority
  const seen = new Set();
  return results.filter(r => {
    if (seen.has(r.plan.id)) return false;
    seen.add(r.plan.id);
    return true;
  }).sort((a, b) => a.priority - b.priority);
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────

const colorMap = {
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
  green: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', dot: 'bg-green-400' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-400' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-400' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', dot: 'bg-purple-400' },
  teal: { bg: 'bg-teal-50', border: 'border-teal-200', badge: 'bg-teal-100 text-teal-700', dot: 'bg-teal-400' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-400' }
};

const riskColors = {
  'Very High': 'bg-red-100 text-red-700',
  'High': 'bg-orange-100 text-orange-700',
  'Moderate': 'bg-yellow-100 text-yellow-700'
};

const CropInsuranceSuggestions = () => {
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState('plans');

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setShowResults(false);
  };

  const allAnswered = recommendationQuestions.every(q => answers[q.id]);
  const recommendations = showResults ? getRecommendations(answers) : [];

  const getPlanById = (id) => insurancePlans.find(p => p.id === id);

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      {/* ── Hero ── */}
      <section className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white shadow-lg md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">Financial Protection</p>
            <h1 className="mt-2 text-2xl font-bold md:text-3xl">Crop Insurance Suggestions & Comparison</h1>
            <p className="mt-3 text-sm text-emerald-50 md:text-base">
              Compare all government and private insurance options with actual premium rates, region-specific disaster data,
              and a personalized recommendation engine — all based on official Indian government data.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <div className="space-y-1 text-sm font-medium">
                <div className="flex items-center gap-2"><FontAwesomeIcon icon={faShieldAlt} /><span>6 insurance schemes</span></div>
                <div className="flex items-center gap-2"><FontAwesomeIcon icon={faMapMarkerAlt} /><span>7 regional risk profiles</span></div>
                <div className="flex items-center gap-2"><FontAwesomeIcon icon={faStar} /><span>Personalized advisor</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Key Stats Bar ── */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: '₹1.83 Lakh Cr', sub: 'Claims paid since 2016' },
            { label: '4+ Crore', sub: 'Farmers enrolled FY24' },
            { label: '₹69,515 Cr', sub: 'Govt. outlay FY22–26' },
            { label: '70+ Crops', sub: 'Notified under PMFBY' }
          ].map(stat => (
            <div key={stat.label} className="rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-center backdrop-blur-sm">
              <p className="text-base font-bold">{stat.label}</p>
              <p className="text-xs text-emerald-100">{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tab Navigation ── */}
      <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
        {[
          { id: 'plans', label: 'Insurance Plans' },
          { id: 'regions', label: 'Regional Risk Map' },
          { id: 'compare', label: 'Premium Comparison' },
          { id: 'recommend', label: '🎯 Get Recommendation' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: INSURANCE PLANS ── */}
      {activeTab === 'plans' && (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {insurancePlans.map((plan) => (
              <article key={plan.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                        <FontAwesomeIcon icon={faSeedling} />
                      </span>
                      <div>
                        <p className="text-xs text-slate-500">{plan.name}</p>
                        <h2 className="text-sm font-semibold text-slate-900 leading-tight">{plan.fullName}</h2>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${plan.tagColor}`}>{plan.tag}</span>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <p><span className="font-medium text-slate-800">Coverage:</span> {plan.coverageType}</p>
                    <div className="rounded-lg bg-emerald-50 p-2.5 space-y-1">
                      <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Farmer Premium (after subsidy)</p>
                      <p className="flex items-center gap-1.5"><FontAwesomeIcon icon={faIndianRupeeSign} className="text-emerald-600 text-xs" /><span><span className="font-medium text-slate-800">Kharif:</span> {plan.premiumKharif}</span></p>
                      <p className="flex items-center gap-1.5"><FontAwesomeIcon icon={faIndianRupeeSign} className="text-emerald-600 text-xs" /><span><span className="font-medium text-slate-800">Rabi:</span> {plan.premiumRabi}</span></p>
                      <p className="flex items-center gap-1.5"><FontAwesomeIcon icon={faLeaf} className="text-emerald-600 text-xs" /><span><span className="font-medium text-slate-800">Horticulture:</span> {plan.premiumHorti}</span></p>
                      <p className="text-xs text-slate-500 italic">e.g. {plan.examplePremium}</p>
                    </div>
                    <p className="flex items-start gap-2">
                      <FontAwesomeIcon icon={faCalendarCheck} className="mt-0.5 text-emerald-600 shrink-0" />
                      <span><span className="font-medium text-slate-800">Report within:</span> {plan.claimWindow}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <FontAwesomeIcon icon={faMoneyBillWave} className="mt-0.5 text-emerald-600 shrink-0" />
                      <span><span className="font-medium text-slate-800">Settlement:</span> {plan.claimSettlement}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <FontAwesomeIcon icon={faCloudRain} className="mt-0.5 text-emerald-600 shrink-0" />
                      <span><span className="font-medium text-slate-800">Best for:</span> {plan.idealFor}</span>
                    </p>
                    {plan.govtSubsidy && (
                      <p className="flex items-start gap-2">
                        <FontAwesomeIcon icon={faShieldAlt} className="mt-0.5 text-emerald-600 shrink-0" />
                        <span><span className="font-medium text-slate-800">Govt. Subsidy:</span> {plan.govtSubsidy}</span>
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                    className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-800"
                  >
                    <FontAwesomeIcon icon={expandedPlan === plan.id ? faChevronUp : faChevronDown} />
                    {expandedPlan === plan.id ? 'Show less' : 'Show benefits & caution'}
                  </button>

                  {expandedPlan === plan.id && (
                    <div className="mt-3 space-y-3">
                      <ul className="space-y-1.5 text-sm text-slate-700">
                        {plan.pros.map((benefit) => (
                          <li key={benefit} className="flex items-start gap-2">
                            <FontAwesomeIcon icon={faCheckCircle} className="mt-0.5 text-emerald-600 shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800">
                        <FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" />
                        {plan.caution}
                      </p>
                    </div>
                  )}
                </div>

                {/* Contact bar */}
                <div className="border-t border-slate-100 px-5 py-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  {plan.helpline && (
                    <span className="flex items-center gap-1"><FontAwesomeIcon icon={faPhone} className="text-emerald-500" /> {plan.helpline}</span>
                  )}
                  {plan.portalLink && (
                    <span className="flex items-center gap-1"><FontAwesomeIcon icon={faGlobe} className="text-emerald-500" /> {plan.portalLink}</span>
                  )}
                </div>
              </article>
            ))}
          </section>
        </>
      )}

      {/* ── TAB: REGIONAL RISK MAP ── */}
      {activeTab === 'regions' && (
        <section className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
            <h3 className="font-semibold text-slate-900">Region-wise Risk & Insurance Mapping</h3>
            <p className="text-sm text-slate-500 mt-1">Based on NDMA disaster data, PMFBY enrollment patterns, and IMD climate hazard atlas. Select a region card to explore recommended plans.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {regions.map(region => {
              const colors = colorMap[region.color];
              return (
                <article key={region.id} className={`rounded-2xl border ${colors.border} ${colors.bg} p-5 shadow-sm`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{region.emoji}</span>
                      <div>
                        <h2 className="font-semibold text-slate-900">{region.name}</h2>
                        <p className="text-xs text-slate-500">{region.states}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 ${riskColors[region.riskLevel]}`}>
                      {region.riskLevel} Risk
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 mb-3">
                    <span className="font-medium text-slate-900">Key Crops: </span>{region.primaryCrops}
                  </p>

                  {/* Disasters */}
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Frequent Disasters</p>
                    <div className="flex flex-wrap gap-1.5">
                      {region.disasters.map(d => (
                        <span key={d} className="flex items-center gap-1 rounded-full bg-white border border-slate-200 px-2.5 py-0.5 text-xs text-slate-700">
                          <FontAwesomeIcon icon={disasterIcons[d] || faTriangleExclamation} className="text-red-400" />
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recommended insurance */}
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Recommended Insurance</p>
                    <div className="flex flex-wrap gap-1.5">
                      {region.topInsurance.map((id, i) => {
                        const plan = getPlanById(id);
                        return plan ? (
                          <span key={id} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${i === 0 ? 'bg-emerald-600 text-white' : 'bg-white border border-emerald-300 text-emerald-700'}`}>
                            {i === 0 ? '★ ' : ''}{plan.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <div className="rounded-lg bg-white/70 border border-slate-200 p-2.5 text-xs text-slate-600">
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-1 text-slate-400" />
                    {region.note}
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    <span className="font-medium">Avg. farmer premium:</span> {region.avgPremiumPaid}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* ── TAB: PREMIUM COMPARISON TABLE ── */}
      {activeTab === 'compare' && (
        <section className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-900">Premium & Coverage Comparison</h3>
              <p className="text-sm text-slate-500">Actual farmer-payable premium rates as per Government of India notification (2024–25). Government subsidises 95–98% of actuarial premium under PMFBY/RWBCIS.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Insurance Scheme</th>
                    <th className="px-4 py-3 text-left font-semibold">Kharif Premium</th>
                    <th className="px-4 py-3 text-left font-semibold">Rabi Premium</th>
                    <th className="px-4 py-3 text-left font-semibold">Horticulture</th>
                    <th className="px-4 py-3 text-left font-semibold">Sum Insured</th>
                    <th className="px-4 py-3 text-left font-semibold">Claim Speed</th>
                    <th className="px-4 py-3 text-left font-semibold">Govt. Subsidy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {insurancePlans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{plan.name}</p>
                        <p className="text-xs text-slate-400">{plan.fullName.split('(')[0].trim()}</p>
                      </td>
                      <td className="px-4 py-3 text-emerald-700 font-medium">{plan.premiumKharif}</td>
                      <td className="px-4 py-3 text-emerald-700 font-medium">{plan.premiumRabi}</td>
                      <td className="px-4 py-3 text-emerald-700 font-medium">{plan.premiumHorti}</td>
                      <td className="px-4 py-3 text-xs">{plan.sumInsured}</td>
                      <td className="px-4 py-3 text-xs">{plan.claimSettlement}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          plan.govtSubsidy.includes('95') || plan.govtSubsidy.includes('50') || plan.govtSubsidy.includes('90')
                            ? 'bg-emerald-100 text-emerald-700'
                            : plan.govtSubsidy.includes('Partial')
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {plan.govtSubsidy}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Crop-specific premium examples */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-900">Crop-wise Premium Examples (PMFBY 2024–25)</h3>
              <p className="text-sm text-slate-500">Indicative farmer-payable premium on ₹50,000 sum insured per hectare. Actual values notified by state governments.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Crop</th>
                    <th className="px-4 py-3 text-left font-semibold">Season</th>
                    <th className="px-4 py-3 text-left font-semibold">Max Farmer Premium %</th>
                    <th className="px-4 py-3 text-left font-semibold">Premium on ₹50,000 SI</th>
                    <th className="px-4 py-3 text-left font-semibold">Scheme</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {[
                    { crop: 'Rice (Paddy)', season: 'Kharif', pct: '2%', amount: '₹1,000', scheme: 'PMFBY' },
                    { crop: 'Wheat', season: 'Rabi', pct: '1.5%', amount: '₹750', scheme: 'PMFBY' },
                    { crop: 'Maize', season: 'Kharif', pct: '2%', amount: '₹1,000', scheme: 'PMFBY' },
                    { crop: 'Mustard', season: 'Rabi', pct: '1.5%', amount: '₹750', scheme: 'PMFBY' },
                    { crop: 'Soybean', season: 'Kharif', pct: '2%', amount: '₹1,000', scheme: 'PMFBY' },
                    { crop: 'Cotton', season: 'Kharif', pct: '5%', amount: '₹2,500', scheme: 'PMFBY' },
                    { crop: 'Sugarcane', season: 'Annual', pct: '5%', amount: '₹2,500', scheme: 'PMFBY' },
                    { crop: 'Grapes / Pomegranate', season: 'Annual', pct: '5%', amount: '₹2,500', scheme: 'RWBCIS' },
                    { crop: 'Tomato / Onion', season: 'Both', pct: '5%', amount: '₹2,500', scheme: 'RWBCIS' },
                    { crop: 'Banana', season: 'Annual', pct: '5%', amount: '₹2,500', scheme: 'RWBCIS' }
                  ].map((row) => (
                    <tr key={row.crop} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{row.crop}</td>
                      <td className="px-4 py-3">{row.season}</td>
                      <td className="px-4 py-3 text-emerald-700 font-semibold">{row.pct}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{row.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${row.scheme === 'PMFBY' ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'}`}>
                          {row.scheme}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
              Source: PIB Press Release, PMFBY Operational Guidelines, GoI (2024–25). Actual premium varies by state notification.
            </div>
          </div>
        </section>
      )}

      {/* ── TAB: RECOMMENDATION ENGINE ── */}
      {activeTab === 'recommend' && (
        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <span className="rounded-xl bg-emerald-100 p-3 text-emerald-700 text-xl">
                <FontAwesomeIcon icon={faComments} />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Personalized Insurance Advisor</h3>
                <p className="text-sm text-slate-500">Answer 3 questions to get the best-matched insurance plan for your farm.</p>
              </div>
            </div>

            <div className="space-y-5">
              {recommendationQuestions.map((q, qi) => (
                <div key={q.id}>
                  <p className="text-sm font-semibold text-slate-800 mb-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white text-xs mr-2">{qi + 1}</span>
                    {q.question}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {q.options.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(q.id, opt.value)}
                        className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                          answers[q.id] === opt.value
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowResults(true)}
              disabled={!allAnswered}
              className={`mt-6 w-full rounded-xl py-3 text-sm font-semibold transition ${
                allAnswered
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {allAnswered ? '🎯 Get My Insurance Recommendation' : 'Answer all questions above to continue'}
            </button>
          </div>

          {/* Results */}
          {showResults && recommendations.length > 0 && (
            <div className="space-y-3">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                <h3 className="font-semibold text-emerald-800">Your Recommended Plans</h3>
                <p className="text-sm text-emerald-600 mt-0.5">Based on your farm profile, here are the best-matched insurance options, ranked by priority.</p>
              </div>

              {recommendations.map((rec, i) => (
                <article key={rec.plan.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${i === 0 ? 'bg-emerald-600' : 'bg-slate-400'}`}>
                      {i + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-slate-900">{rec.plan.fullName}</h4>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${rec.plan.tagColor}`}>{rec.plan.tag}</span>
                        {i === 0 && <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white">Best Match</span>}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{rec.reason}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 text-xs">
                    <div className="rounded-lg bg-slate-50 p-2">
                      <p className="text-slate-500">Kharif Premium</p>
                      <p className="font-semibold text-emerald-700">{rec.plan.premiumKharif}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2">
                      <p className="text-slate-500">Rabi Premium</p>
                      <p className="font-semibold text-emerald-700">{rec.plan.premiumRabi}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2">
                      <p className="text-slate-500">Claim Report By</p>
                      <p className="font-semibold text-slate-800">{rec.plan.claimWindow}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2">
                      <p className="text-slate-500">Helpline</p>
                      <p className="font-semibold text-slate-800">{rec.plan.helpline}</p>
                    </div>
                  </div>
                </article>
              ))}

              {/* Channels to apply */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h4 className="font-semibold text-slate-900 mb-3">How to Apply & Contact</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: faGlobe, label: 'Online Portal', value: 'pmfby.gov.in', sub: 'Apply online, check status, download policy' },
                    { icon: faMobileAlt, label: 'Mobile App', value: 'Crop Insurance App', sub: 'Available on Google Play Store' },
                    { icon: faPhone, label: 'Kisan Rakshak Helpline', value: '14447', sub: '24/7 toll-free; also on WhatsApp: 7065514447' },
                    { icon: faPhone, label: 'Kisan Call Centre', value: '1800-180-1551', sub: 'All-India free helpline for farm queries' },
                    { icon: faMapMarkerAlt, label: 'Nearest CSC', value: 'Common Service Centre', sub: 'Visit CSC for offline enrollment & assistance' },
                    { icon: faMoneyBillWave, label: 'Bank / PACS', value: 'Your nearest Bank Branch', sub: 'KCC holders auto-enrolled; non-loanee can walk in' }
                  ].map(ch => (
                    <div key={ch.label} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <span className="rounded-lg bg-emerald-100 p-2 text-emerald-700 shrink-0">
                        <FontAwesomeIcon icon={ch.icon} />
                      </span>
                      <div>
                        <p className="text-xs text-slate-500">{ch.label}</p>
                        <p className="text-sm font-semibold text-slate-900">{ch.value}</p>
                        <p className="text-xs text-slate-500">{ch.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-center text-xs text-slate-400 pb-2">
                Data source: pmfby.gov.in · PIB Press Release (Jan 2025) · NDMA · IMD Climate Hazard Atlas
              </p>
            </div>
          )}
        </section>
      )}

    </div>
  );
};

export default CropInsuranceSuggestions;