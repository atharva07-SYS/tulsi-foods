import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ShoppingBag,
  Phone,
  MapPin,
  Clock,
  Check,
  Plus,
  Minus,
  X,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Accessibility,
  FileText,
  Copy,
  Upload,
  Eye,
  EyeOff,
  ChevronRight,
  Star,
  MessageCircle,
} from 'lucide-react';

/**
 * ============================================================================
 * 1. CENTRALIZED TYPED CONTENT & CONFIGURATION MODULE (`siteData`)
 * ============================================================================
 * Everything the owner needs to update (WhatsApp number, menu items, prices,
 * photos, or [CONFIRM] placeholders) lives in this single structured object.
 */

export const WHATSAPP_NUMBER = "919112997450"; // Swap here in 10 seconds (Country code + 10 digits, no '+')
export const DISPLAY_PHONE = "+91 91129 97450";

export const SITE_CONFIG = {
  brand: {
    name: "Tulsi Foods",
    tagline: "Fresh, light, and made to taste good.",
    subline:
      "Clean sandwiches on brown bread, crisp salads, fresh-cut fruits, and hygienic quick bites in Kagwade Mala, Ichalkaranji.",
    logoUrl: null, // Set to "/tulsi-logo.png" or upload live via the Owner Setup drawer
    orderCtaLocal: "Ordar kara",
  },
  palette: {
    leafGreen: "#2E6B3B",
    lime: "#A5CC3D",
    mintBg: "#F5F9F0",
    ink: "#12301B",
  },
  location: {
    venueName: "Royal Eats",
    street: "old municipal building, fire brigade lane, Main Rd, Kagwade Mala",
    city: "Ichalkaranji",
    state: "Maharashtra",
    postalCode: "416115",
    fullAddress:
      "Royal Eats, old municipal building, fire brigade lane, Main Rd, Kagwade Mala, Ichalkaranji, Maharashtra 416115",
    googleMapsEmbedUrl:
      "https://maps.google.com/maps?q=Royal%20Eats%2C%20old%20municipal%20building%2C%20fire%20brigade%20lane%2C%20Main%20Rd%2C%20Kagwade%20Mala%2C%20Ichalkaranji%2C%20Maharashtra%20416115&t=&z=16&ie=UTF8&iwloc=&output=embed",
    googleMapsDirectionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Royal+Eats+old+municipal+building+fire+brigade+lane+Main+Rd+Kagwade+Mala+Ichalkaranji+Maharashtra+416115",
    deliveryAreaNote:
      "Kagwade Mala, Main Rd, and nearby Ichalkaranji sectors [CONFIRM]",
  },
  hours: {
    openHour24: 11, // 11:00 AM IST
    closeHour24: 23, // 11:00 PM IST
    display: "11:00 AM to 11:00 PM, every day",
  },
  rating: {
    score: "4.5",
    platform: "Google",
    summary: "Rated 4.5 on Google by regular visitors in Ichalkaranji",
  },
  attributes: [
    "Wheelchair accessible",
    "Quick bites",
    "Good packing",
    "Pure vegetarian kitchen [CONFIRM]",
  ],
};

/**
 * PART 1, SCREEN 3: "WHAT WE MAKE" — THE 6 REAL SIGNATURE ITEMS
 * Shown as a slow horizontal story strip with one large edge-to-edge photo at a time.
 */
export const SIGNATURE_STORY_ITEMS = [
  {
    id: "sig-brown-bread",
    indexLabel: "01",
    title: "Veg sandwich on brown bread",
    note: "Crisp cucumber, ripe tomato, and fresh coriander-mint chutney layered on soft brown bread.",
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1600&q=85",
    menuItemId: "sand-1",
  },
  {
    id: "sig-panipuri",
    indexLabel: "02",
    title: "Pani puri",
    note: "Crisp puris served with chilled filtered-water mint pani, sweet tamarind chutney, and warm spiced filling.",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1600&q=85",
    menuItemId: "chaat-1",
  },
  {
    id: "sig-aloo-masala",
    indexLabel: "03",
    title: "Aloo masala sandwich",
    note: "Warm tempered potato mash with curry leaves, mustard seeds, and crisp onion toasted on hearty bread.",
    image:
      "https://images.unsplash.com/photo-1554433607-66b5efe9d304?auto=format&fit=crop&w=1600&q=85",
    menuItemId: "sand-2",
  },
  {
    id: "sig-caprese",
    indexLabel: "04",
    title: "Caprese salad",
    note: "Sliced vine tomatoes, fresh mozzarella, whole sweet basil leaves, and a light olive dressing.",
    image:
      "https://images.unsplash.com/photo-1592417817098-8f3d691a4bf5?auto=format&fit=crop&w=1600&q=85",
    menuItemId: "sal-1",
  },
  {
    id: "sig-mantu",
    indexLabel: "05",
    title: "Mantu",
    note: "Delicate steamed vegetable dumplings folded by hand and served warm with house dipping sauce.",
    image:
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1600&q=85",
    menuItemId: "momo-1",
  },
  {
    id: "sig-fresh-fruits",
    indexLabel: "06",
    title: "Fresh fruits",
    note: "Chilled seasonal pomegranate, papaya, melon, and apple cut cleanly through the day.",
    image:
      "https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=1600&q=85",
    menuItemId: "fruit-1",
  },
];

/**
 * PART 1, SCREEN 4: "HOW WE KEEP IT" — ONE STATEMENT PER SCREEN
 */
export const HOW_WE_KEEP_IT_SCREENS = [
  {
    id: "keep-freshness",
    step: "How we keep it · 01 / 03",
    pillar: "Freshness",
    headline: "Cut and prepared fresh when you order.",
    body: "Vegetables, seasonal fruits, and brown bread sandwiches are assembled cleanly in small batches so every bite stays crisp and light.",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Freshly washed greens and vegetables on a clean prep counter",
  },
  {
    id: "keep-hygiene",
    step: "How we keep it · 02 / 03",
    pillar: "Hygiene",
    headline: "A clean counter you can trust.",
    body: "From filtered water for our pani puri to tidy preparation surfaces at Royal Eats, hygiene comes first in everything we serve.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Clean bowls of fresh ingredients prepared hygienically",
  },
  {
    id: "keep-packing",
    step: "How we keep it · 03 / 03",
    pillar: "Good packing",
    headline: "Packed neatly so it travels well.",
    body: "Chutneys, pani, and dressings stay separate. Whether you pick up on Main Road or order home, your food arrives fresh, intact, and easy to eat.",
    image:
      "https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Neatly portioned fresh fruit bowl ready for takeaway",
  },
];

/**
 * MENU CATEGORIES & ITEMS
 * Real customer-loved items + clearly marked [CONFIRM] placeholders for prices & extended items.
 */
export const MENU_CATEGORIES = [
  { id: "Sandwiches", label: "Sandwiches", hasConfirm: false },
  { id: "Pani puri and chaat", label: "Pani puri and chaat", hasConfirm: false },
  { id: "Salads and bowls", label: "Salads and bowls", hasConfirm: false },
  { id: "Fresh fruits", label: "Fresh fruits", hasConfirm: false },
  { id: "Momos [CONFIRM]", label: "Momos [CONFIRM]", hasConfirm: true },
];

export const MENU_ITEMS = [
  // Sandwiches
  {
    id: "sand-1",
    category: "Sandwiches",
    name: "Veg sandwich on brown bread",
    description:
      "Fresh cucumber, ripe tomato, boiled potato, and house coriander-mint chutney on toasted or plain brown bread.",
    price: 90,
    priceConfirmed: false, // Marked [CONFIRM]
    isSignature: true,
    isConfirmedItem: true,
    aspect: "aspect-[4/3]",
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "sand-2",
    category: "Sandwiches",
    name: "Aloo masala sandwich",
    description:
      "Warm tempered potato mash with mustard seeds, curry leaves, green chili, and crisp onions pressed golden.",
    price: 100,
    priceConfirmed: false,
    isSignature: true,
    isConfirmedItem: true,
    aspect: "aspect-[4/3]",
    image:
      "https://images.unsplash.com/photo-1554433607-66b5efe9d304?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "sand-3",
    category: "Sandwiches",
    name: "Corn and spinach brown bread grill [CONFIRM]",
    description:
      "Sweet corn kernels and wilted spinach folded in a light herb spread on hearty brown bread [CONFIRM].",
    price: 120,
    priceConfirmed: false,
    isSignature: false,
    isConfirmedItem: false,
    aspect: "aspect-[4/3]",
    image:
      "https://images.unsplash.com/photo-1481070414801-51fd732d7184?auto=format&fit=crop&w=900&q=80",
  },

  // Pani puri and chaat
  {
    id: "chaat-1",
    category: "Pani puri and chaat",
    name: "Pani puri (hygienic pack)",
    description:
      "Crisp puris packed separately with chilled filtered-water mint pani, khajur chutney, and warm masala stuffing.",
    price: 60,
    priceConfirmed: false,
    isSignature: true,
    isConfirmedItem: true,
    aspect: "aspect-[4/3]",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "chaat-2",
    category: "Pani puri and chaat",
    name: "Dahi puri with pomegranate [CONFIRM]",
    description:
      "Crisp shells topped with chilled whisked curd, house chutneys, fine sev, and fresh pomegranate pearls [CONFIRM].",
    price: 80,
    priceConfirmed: false,
    isSignature: false,
    isConfirmedItem: false,
    aspect: "aspect-[4/3]",
    image:
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "chaat-3",
    category: "Pani puri and chaat",
    name: "Sprouted moong bhel [CONFIRM]",
    description:
      "Steamed green moong sprouts tossed with raw mango, cucumber, tomato, lemon juice, and roasted peanuts [CONFIRM].",
    price: 85,
    priceConfirmed: false,
    isSignature: false,
    isConfirmedItem: false,
    aspect: "aspect-[4/3]",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
  },

  // Salads and bowls
  {
    id: "sal-1",
    category: "Salads and bowls",
    name: "Caprese salad",
    description:
      "Sliced farm tomatoes, fresh mozzarella, whole basil leaves, cracked black pepper, and extra-virgin olive oil.",
    price: 160,
    priceConfirmed: false,
    isSignature: true,
    isConfirmedItem: true,
    aspect: "aspect-[4/3]",
    image:
      "https://images.unsplash.com/photo-1592417817098-8f3d691a4bf5?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "sal-2",
    category: "Salads and bowls",
    name: "Crunch garden greens & chickpea bowl [CONFIRM]",
    description:
      "Lettuce, English cucumber, bell peppers, boiled kabuli chana, and lemon-herb dressing packed on the side [CONFIRM].",
    price: 150,
    priceConfirmed: false,
    isSignature: false,
    isConfirmedItem: false,
    aspect: "aspect-[4/3]",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80",
  },

  // Fresh fruits
  {
    id: "fruit-1",
    category: "Fresh fruits",
    name: "Fresh fruits seasonal bowl",
    description:
      "Cleanly cut seasonal fruits — papaya, watermelon, apple, pomegranate, and banana — packed chilled with wooden fork.",
    price: 110,
    priceConfirmed: false,
    isSignature: true,
    isConfirmedItem: true,
    aspect: "aspect-[4/3]",
    image:
      "https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "fruit-2",
    category: "Fresh fruits",
    name: "Chilled pomegranate & kiwi cup [CONFIRM]",
    description:
      "Freshly peeled ruby pomegranate arils and sliced green kiwi, with optional rock salt packet on the side [CONFIRM].",
    price: 130,
    priceConfirmed: false,
    isSignature: false,
    isConfirmedItem: false,
    aspect: "aspect-[4/3]",
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=900&q=80",
  },

  // Momos [CONFIRM]
  {
    id: "momo-1",
    category: "Momos [CONFIRM]",
    name: "Mantu (steamed vegetable dumplings)",
    description:
      "Soft, thin-skinned steamed mantu stuffed with finely minced cabbage, carrots, herbs, and house dipping sauce.",
    price: 110,
    priceConfirmed: false,
    isSignature: true,
    isConfirmedItem: true,
    aspect: "aspect-[4/3]",
    image:
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "momo-2",
    category: "Momos [CONFIRM]",
    name: "Paneer & herb steamed momos [CONFIRM]",
    description:
      "Crumbled fresh paneer, spring onion, and ginger steamed to order in clean batches [CONFIRM].",
    price: 130,
    priceConfirmed: false,
    isSignature: false,
    isConfirmedItem: false,
    aspect: "aspect-[4/3]",
    image:
      "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=900&q=80",
  },
];

export const WHY_TULSI_PILLARS = [
  {
    number: "01",
    title: "Fresh ingredients, clean preparation",
    body: "From whole-wheat brown bread sandwiches and caprese salad to chilled pani puri and cut fruits, every portion is prepared in a clean kitchen only when you order.",
  },
  {
    number: "02",
    title: "Good packing that travels well",
    body: "Sauces, pani, and dressings stay separate so your sandwich stays crisp and your fruit bowl arrives neat at your desk or home.",
  },
  {
    number: "03",
    title: "Easy access for everyone",
    body: "Located at Royal Eats on Main Rd, Kagwade Mala with step-free, wheelchair-accessible entry and quick takeaway service from 11:00 AM to 11:00 PM.",
  },
];

export const CUSTOMER_REVIEWS = [
  {
    id: "rev-1",
    quote:
      "The veg sandwich on brown bread and the aloo masala sandwich both taste clean and fresh. Nothing feels oily or heavy.",
    highlight: "Brown bread & aloo masala sandwiches",
    context: "Regular takeaway customer",
  },
  {
    id: "rev-2",
    quote:
      "Hard to find a place in Ichalkaranji that serves both hygienic pani puri and a proper caprese salad under one roof.",
    highlight: "Pani puri & caprese salad",
    context: "Evening visitor at Kagwade Mala",
  },
  {
    id: "rev-3",
    quote:
      "Packing is genuinely thoughtful. The fresh fruits and steamed mantu always reach home intact and neatly labeled.",
    highlight: "Fresh fruits, mantu & good packing",
    context: "Family order review",
  },
];

export const CONFIRM_CHECKLIST = [
  {
    item: "Menu prices (`price` in `MENU_ITEMS`)",
    status: "[CONFIRM]",
    instructions:
      "Update each item's `price` number in `MENU_ITEMS` and set `priceConfirmed: true` to hide the [CONFIRM] badge.",
  },
  {
    item: "Extended category: `Momos [CONFIRM]` & secondary items",
    status: "[CONFIRM]",
    instructions:
      "Mantu is confirmed as a customer favorite. Confirm whether additional momo varieties, corn-spinach sandwich, and sprout bowls are on the daily board.",
  },
  {
    item: "Delivery radius & minimum order (`SITE_CONFIG.location.deliveryAreaNote`)",
    status: "[CONFIRM]",
    instructions:
      "Verify whether Tulsi Foods delivers directly in Kagwade Mala / Ichalkaranji or pickup-only via Royal Eats.",
  },
  {
    item: "Catering & bulk orders (`CateringSection` scope)",
    status: "[CONFIRM scope with the owner]",
    instructions:
      "Confirm minimum guest count, advance notice hours, and whether fruit platters / sandwich boxes are offered for office meetings and family events.",
  },
  {
    item: "Uploaded Logo File (`SITE_CONFIG.brand.logoUrl`)",
    status: "Ready for file swap",
    instructions:
      "Place your exact logo file in `/public/tulsi-logo.png` and set `logoUrl: '/tulsi-logo.png'`, or use the live Upload Logo button in the Owner Guide modal to preview immediately.",
  },
];

/**
 * ============================================================================
 * 2. BRAND ASSETS: EXACT RECREATION OF UPLOADED LOGO (image_a2f13d.png)
 * ============================================================================
 * Matches the uploaded reference:
 * - Outer thin dark leaf-green ring (#2E6B3B) broken at top for leaf & middle for wordmark
 * - Inner thick lime-green ring (#A5CC3D) broken at top for leaf & middle for wordmark
 * - Top center lime-green leaf (#A5CC3D) with central vertical gap & two pairs of angled vein cutouts
 * - Bold condensed "TULSI FOODS" wordmark (#2E6B3B) spanning horizontally across the middle
 */

function TulsiEmblemSvg({ className = "w-14 h-14", animated = false }) {
  return (
    <svg
      viewBox="0 0 260 220"
      className={className}
      role="img"
      aria-label="Tulsi Foods emblem"
    >
      {/* Top Upper-Left & Upper-Right Concentric Arcs (Center 130, 122) */}
      <g className={animated ? "animate-draw-ring" : ""}>
        {/* Outer Dark Green Ring (#2E6B3B) - Top Left Arc (196° to 245°) */}
        <path
          d="M 55.0 100.5 A 78 78 0 0 1 97.0 51.3"
          fill="none"
          stroke="#2E6B3B"
          strokeWidth="6.5"
          strokeLinecap="butt"
        />
        {/* Outer Dark Green Ring (#2E6B3B) - Top Right Arc (295° to 344°) */}
        <path
          d="M 163.0 51.3 A 78 78 0 0 1 205.0 100.5"
          fill="none"
          stroke="#2E6B3B"
          strokeWidth="6.5"
          strokeLinecap="butt"
        />
        {/* Outer Dark Green Ring (#2E6B3B) - Bottom Arc (16° to 164°) */}
        <path
          d="M 205.0 143.5 A 78 78 0 0 1 55.0 143.5"
          fill="none"
          stroke="#2E6B3B"
          strokeWidth="6.5"
          strokeLinecap="butt"
        />

        {/* Inner Thicker Lime Ring (#A5CC3D) - Top Left Arc */}
        <path
          d="M 65.6 103.5 A 67 67 0 0 1 101.7 61.3"
          fill="none"
          stroke="#A5CC3D"
          strokeWidth="10.5"
          strokeLinecap="butt"
        />
        {/* Inner Thicker Lime Ring (#A5CC3D) - Top Right Arc */}
        <path
          d="M 158.3 61.3 A 67 67 0 0 1 194.4 103.5"
          fill="none"
          stroke="#A5CC3D"
          strokeWidth="10.5"
          strokeLinecap="butt"
        />
        {/* Inner Thicker Lime Ring (#A5CC3D) - Bottom Arc */}
        <path
          d="M 194.4 140.5 A 67 67 0 0 1 65.6 140.5"
          fill="none"
          stroke="#A5CC3D"
          strokeWidth="10.5"
          strokeLinecap="butt"
        />
      </g>

      {/* Top Center Lime Leaf (#A5CC3D) with vertical center split & 2 pairs of angled vein cutouts */}
      <g className={animated ? "animate-unfurl-leaf" : ""}>
        {/* Left Leaf Half */}
        <path
          d="M 127.5 14 C 102 30, 96 68, 114 88 C 119 92, 124 93, 127.5 93 L 127.5 76 L 112 63 L 116 58 L 127.5 68 L 127.5 51 L 115 40 L 119 35 L 127.5 43 Z"
          fill="#A5CC3D"
        />
        {/* Right Leaf Half */}
        <path
          d="M 132.5 14 C 158 30, 164 68, 146 88 C 141 92, 136 93, 132.5 93 L 132.5 76 L 148 63 L 144 58 L 132.5 68 L 132.5 51 L 145 40 L 141 35 L 132.5 43 Z"
          fill="#A5CC3D"
        />
      </g>

      {/* Center Bold Condensed Wordmark: TULSI FOODS */}
      <g className={animated ? "animate-wordmark-fade" : ""}>
        <text
          x="130"
          y="133"
          textAnchor="middle"
          fill="#2E6B3B"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: "44px",
            letterSpacing: "0.02em",
          }}
        >
          TULSI FOODS
        </text>
      </g>
    </svg>
  );
}

function TulsiLogo({ customLogoUrl, size = "md", showTagline = false }) {
  const badgeDimensions =
    size === "lg"
      ? "w-20 h-16"
      : size === "sm"
      ? "w-13 h-11"
      : "w-16 h-14";

  if (customLogoUrl) {
    return (
      <div className="inline-flex items-center gap-3">
        <img
          src={customLogoUrl}
          alt="Tulsi Foods"
          className={`${
            size === "lg" ? "h-14" : size === "sm" ? "h-9" : "h-12"
          } w-auto object-contain`}
        />
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      <TulsiEmblemSvg className={`${badgeDimensions} flex-shrink-0`} />
      {showTagline && (
        <div className="hidden sm:flex flex-col text-left border-l border-[#2E6B3B]/20 pl-2.5">
          <span className="text-xs font-semibold text-[#12301B] leading-tight">
            Tulsi Foods
          </span>
          <span className="text-[11px] text-[#12301B]/70 leading-tight">
            Ichalkaranji
          </span>
        </div>
      )}
    </div>
  );
}

function VegSymbol() {
  return (
    <span
      className="inline-flex items-center justify-center w-4 h-4 border border-[#2E6B3B] rounded-[2px] bg-[#F5F9F0] flex-shrink-0"
      title="Vegetarian"
      aria-label="Vegetarian item"
    >
      <span className="w-2 h-2 rounded-full bg-[#2E6B3B]" />
    </span>
  );
}

/**
 * ============================================================================
 * 3. TIME & OPEN/CLOSED STATUS HELPER (IST: UTC+5:30)
 * ============================================================================
 */
function useOpenStatus(overrideMode) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return useMemo(() => {
    if (overrideMode === "open") {
      return {
        isOpen: true,
        label: "Open now · Closes at 11:00 PM",
        istTimeFormatted: "Simulated open hours",
      };
    }
    if (overrideMode === "closed") {
      return {
        isOpen: false,
        label: "Closed now · Opens at 11:00 AM",
        istTimeFormatted: "Simulated after-hours",
      };
    }

    // Calculate current IST hour & minute
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const istDate = new Date(utcMs + 5.5 * 3600000);
    const hours = istDate.getHours();
    const minutes = istDate.getMinutes();
    const decimalHour = hours + minutes / 60;

    const isOpen =
      decimalHour >= SITE_CONFIG.hours.openHour24 &&
      decimalHour < SITE_CONFIG.hours.closeHour24;

    const formattedTime = istDate.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return {
      isOpen,
      label: isOpen
        ? "Open now · Closes at 11:00 PM"
        : "Closed now · Opens at 11:00 AM",
      istTimeFormatted: `${formattedTime} IST`,
    };
  }, [now, overrideMode]);
}

/**
 * ============================================================================
 * 4. MAIN APPLICATION COMPONENT
 * ============================================================================
 */
export default function App() {
  // Navigation state: 'story' (PART 1: Landing Story) | 'menu' (PART 2: Full Menu & Catering)
  const [currentView, setCurrentView] = useState("story");

  // Intro signature animation state (under 1.8s, plays once, skippable, respects reduced motion)
  const [showIntro, setShowIntro] = useState(true);
  const [introSettled, setIntroSettled] = useState(false);

  // Part 1 Screen 3 ("What we make") slow horizontal story strip index (0..5)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const storyStripRef = useRef(null);

  // Menu & Cart state
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0].id);
  const [cart, setCart] = useState({
    "sand-1": 1, // Pre-seeded with 1 signature brown bread sandwich so the visitor can test immediately
  });
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Owner setup / [CONFIRM] inspector state
  const [showConfirmBadges, setShowConfirmBadges] = useState(true);
  const [isReadmeOpen, setIsReadmeOpen] = useState(false);
  const [statusOverride, setStatusOverride] = useState("live"); // 'live' | 'open' | 'closed'
  const [customLogoUrl, setCustomLogoUrl] = useState(SITE_CONFIG.brand.logoUrl);

  // Cart checkout form state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderType, setOrderType] = useState("pickup"); // 'pickup' | 'delivery'
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [timeSlot, setTimeSlot] = useState("As soon as ready (20–25 mins)");
  const [orderNotes, setOrderNotes] = useState("");
  const [copiedCartMsg, setCopiedCartMsg] = useState(false);
  const [showWhatsAppPreview, setShowWhatsAppPreview] = useState(false);

  // Catering enquiry state
  const [cateringEvent, setCateringEvent] = useState("Office meeting");
  const [cateringGuests, setCateringGuests] = useState("25");
  const [cateringDate, setCateringDate] = useState("");
  const [cateringContact, setCateringContact] = useState("");
  const [cateringNotes, setCateringNotes] = useState(
    "Brown bread sandwiches and fresh cut fruit bowls"
  );

  const openStatus = useOpenStatus(statusOverride);

  // Smooth view transition helper
  const navigateToView = (view, targetAnchor = null) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (targetAnchor) {
      setTimeout(() => {
        const el = document.getElementById(targetAnchor);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 120);
    }
  };

  // Respect prefers-reduced-motion and auto-complete intro in 1.65s
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setShowIntro(false);
      setIntroSettled(true);
      return;
    }

    const settleTimer = setTimeout(() => {
      setIntroSettled(true);
    }, 1350);

    const hideTimer = setTimeout(() => {
      setShowIntro(false);
    }, 1750);

    return () => {
      clearTimeout(settleTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const skipIntro = () => {
    setIntroSettled(true);
    setShowIntro(false);
  };

  // Horizontal story strip slide navigation ("What we make" — one large photo at a time)
  const scrollToStorySlide = (nextIdx) => {
    const clamped =
      (nextIdx + SIGNATURE_STORY_ITEMS.length) % SIGNATURE_STORY_ITEMS.length;
    setActiveSlideIndex(clamped);
    if (storyStripRef.current) {
      const slideWidth = storyStripRef.current.clientWidth;
      storyStripRef.current.scrollTo({
        left: slideWidth * clamped,
        behavior: "smooth",
      });
    }
  };

  const handleStoryStripScroll = () => {
    if (!storyStripRef.current) return;
    const { scrollLeft, clientWidth } = storyStripRef.current;
    if (clientWidth > 0) {
      const idx = Math.round(scrollLeft / clientWidth);
      if (
        idx !== activeSlideIndex &&
        idx >= 0 &&
        idx < SIGNATURE_STORY_ITEMS.length
      ) {
        setActiveSlideIndex(idx);
      }
    }
  };

  // Cart manipulation helpers
  const handleAddToCart = (itemId) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
    setRecentlyAddedId(itemId);
    setTimeout(() => {
      setRecentlyAddedId((curr) => (curr === itemId ? null : curr));
    }, 900);
  };

  const handleUpdateQty = (itemId, delta) => {
    setCart((prev) => {
      const current = prev[itemId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const cartLines = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const item = MENU_ITEMS.find((m) => m.id === id);
        if (!item || qty <= 0) return null;
        return {
          ...item,
          qty,
          lineTotal: item.price * qty,
        };
      })
      .filter(Boolean);
  }, [cart]);

  const totalItems = useMemo(
    () => cartLines.reduce((acc, item) => acc + item.qty, 0),
    [cartLines]
  );

  const subtotalAmount = useMemo(
    () => cartLines.reduce((acc, item) => acc + item.lineTotal, 0),
    [cartLines]
  );

  // Format structured WhatsApp Order message
  const whatsAppOrderMessage = useMemo(() => {
    const lines = [
      `Namaskar Tulsi Foods, I would like to place an order:`,
      ``,
      ...cartLines.map(
        (item) =>
          `• ${item.qty}x ${item.name.replace(" [CONFIRM]", "")} — ₹${
            item.lineTotal
          }${!item.priceConfirmed ? " [CONFIRM price]" : ""}`
      ),
      ``,
      `Estimated total: ₹${subtotalAmount} [CONFIRM final bill]`,
      `Order type: ${
        orderType === "pickup"
          ? "Pickup at Royal Eats, Kagwade Mala"
          : "Delivery [CONFIRM delivery area]"
      }`,
      `Preferred time: ${timeSlot}`,
    ];

    if (customerName.trim()) {
      lines.push(`Name: ${customerName.trim()}`);
    }
    if (customerPhone.trim()) {
      lines.push(`Phone: ${customerPhone.trim()}`);
    }
    if (orderType === "delivery" && deliveryAddress.trim()) {
      lines.push(`Address: ${deliveryAddress.trim()}`);
    }
    if (orderNotes.trim()) {
      lines.push(`Notes: ${orderNotes.trim()}`);
    }

    return lines.join("\n");
  }, [
    cartLines,
    subtotalAmount,
    orderType,
    timeSlot,
    customerName,
    customerPhone,
    deliveryAddress,
    orderNotes,
  ]);

  const whatsAppOrderUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    whatsAppOrderMessage
  )}`;

  // Format WhatsApp Catering enquiry
  const whatsAppCateringUrl = useMemo(() => {
    const msg = [
      `Namaskar Tulsi Foods, enquiry for catering / bulk order:`,
      `• Event type: ${cateringEvent}`,
      `• Estimated guests: ${cateringGuests}`,
      `• Preferred date: ${cateringDate || "To be decided"}`,
      `• Contact: ${cateringContact || "Not specified"}`,
      `• Items of interest: ${cateringNotes}`,
    ].join("\n");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }, [
    cateringEvent,
    cateringGuests,
    cateringDate,
    cateringContact,
    cateringNotes,
  ]);

  // Logo file upload handler for live preview
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCustomLogoUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // JSON-LD Structured Data for SEO
  const jsonLdData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: SITE_CONFIG.brand.name,
      description: SITE_CONFIG.brand.subline,
      telephone: DISPLAY_PHONE,
      servesCuisine: [
        "Sandwiches",
        "Healthy Food",
        "Salads",
        "Fresh Fruits",
        "Chaat",
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "Royal Eats, old municipal building, fire brigade lane, Main Rd, Kagwade Mala",
        addressLocality: "Ichalkaranji",
        addressRegion: "Maharashtra",
        postalCode: "416115",
        addressCountry: "IN",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "11:00",
          closes: "23:00",
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.5",
        bestRating: "5",
        ratingCount: "120",
      },
      hasMap: SITE_CONFIG.location.googleMapsDirectionsUrl,
      isAccessibleForFree: true,
      publicAccess: true,
    }),
    []
  );

  return (
    <div className="min-h-screen bg-[#F5F9F0] text-[#12301B] font-body antialiased selection:bg-[#A5CC3D]/35 selection:text-[#12301B]">
      {/* Load Barlow Condensed (700) + Figtree (400, 500, 600) + custom animation keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700&family=Figtree:wght@400;500;600;700&display=swap');

        :root {
          --leaf-green: #2E6B3B;
          --lime: #A5CC3D;
          --mint-bg: #F5F9F0;
          --ink: #12301B;
        }

        .font-heading {
          font-family: 'Barlow Condensed', -apple-system, BlinkMacSystemFont, sans-serif;
          letter-spacing: -0.01em;
        }

        .font-body {
          font-family: 'Figtree', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        @keyframes drawRing {
          0% {
            stroke-dashoffset: 320;
            opacity: 0.2;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        @keyframes unfurlLeaf {
          0% {
            transform: translateY(16px) scale(0.4);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes wordmarkFade {
          0% {
            transform: translateY(6px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-draw-ring path {
          stroke-dasharray: 320;
          stroke-dashoffset: 320;
          animation: drawRing 0.95s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .animate-unfurl-leaf {
          transform-origin: 130px 90px;
          animation: unfurlLeaf 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both;
        }

        .animate-wordmark-fade {
          animation: wordmarkFade 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.65s both;
        }

        /* Clean horizontal scrollbar for story strip */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* SEO LocalBusiness JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* =====================================================================
          THE ONE SIGNATURE MOMENT: INITIAL SVG RING, LEAF & WORDMARK INTRO
         ===================================================================== */}
      {showIntro && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F5F9F0] transition-opacity duration-500 ${
            introSettled ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          role="dialog"
          aria-label="Tulsi Foods welcome animation"
        >
          <div className="relative flex flex-col items-center px-6">
            <TulsiEmblemSvg
              className="w-52 h-44 sm:w-64 sm:h-52"
              animated={true}
            />
            <p className="mt-2 text-sm sm:text-base text-[#12301B]/80 font-medium">
              Fresh, light, and made to taste good.
            </p>
          </div>

          <button
            type="button"
            onClick={skipIntro}
            className="mt-10 px-4 py-2 min-h-[44px] text-xs font-medium text-[#12301B]/70 hover:text-[#12301B] underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E6B3B] rounded"
          >
            Skip intro
          </button>
        </div>
      )}

      {/* =====================================================================
          STICKY HEADER WITH STORY / FULL MENU SWITCHER
         ===================================================================== */}
      <header className="sticky top-0 z-30 bg-[#F5F9F0]/95 backdrop-blur-md border-b border-[#2E6B3B]/12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigateToView("story")}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E6B3B] rounded-md py-1 text-left"
            aria-label="Tulsi Foods story home"
          >
            <TulsiLogo customLogoUrl={customLogoUrl} showTagline />
          </button>

          {/* Primary Navigation — Switch between Story Intro (Part 1) and Full Menu (Part 2) */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-2 bg-white/80 p-1 rounded-full border border-[#2E6B3B]/15"
          >
            <button
              type="button"
              onClick={() => navigateToView("story")}
              className={`px-4 py-1.5 min-h-[38px] rounded-full text-sm font-medium transition-colors ${
                currentView === "story"
                  ? "bg-[#2E6B3B] text-[#F5F9F0]"
                  : "text-[#12301B] hover:text-[#2E6B3B]"
              }`}
            >
              Our story
            </button>
            <button
              type="button"
              onClick={() => navigateToView("menu")}
              className={`px-4 py-1.5 min-h-[38px] rounded-full text-sm font-medium transition-colors ${
                currentView === "menu"
                  ? "bg-[#2E6B3B] text-[#F5F9F0]"
                  : "text-[#12301B] hover:text-[#2E6B3B]"
              }`}
            >
              Full menu
            </button>
            <button
              type="button"
              onClick={() => navigateToView("menu", "catering")}
              className="px-4 py-1.5 min-h-[38px] rounded-full text-sm font-medium text-[#12301B] hover:text-[#2E6B3B] transition-colors"
            >
              Catering
            </button>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("visit-us");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-4 py-1.5 min-h-[38px] rounded-full text-sm font-medium text-[#12301B] hover:text-[#2E6B3B] transition-colors"
            >
              Visit us
            </button>
          </nav>

          {/* Actions: Mobile Menu Page toggle, Owner [CONFIRM] guide & Cart trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() =>
                navigateToView(currentView === "story" ? "menu" : "story")
              }
              className="md:hidden inline-flex items-center px-3 py-2 min-h-[44px] rounded-full border border-[#2E6B3B]/30 text-xs font-semibold text-[#2E6B3B] bg-white/80"
            >
              {currentView === "story" ? "Full menu" : "← Story"}
            </button>

            <button
              type="button"
              onClick={() => setIsReadmeOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-full border border-[#2E6B3B]/25 text-xs sm:text-sm font-medium text-[#12301B] hover:bg-[#2E6B3B]/8 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E6B3B]"
              title="Open Owner Setup & [CONFIRM] Checklist"
            >
              <FileText className="w-4 h-4 text-[#2E6B3B]" />
              <span className="hidden sm:inline">Owner guide</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full bg-[#2E6B3B] text-[#F5F9F0] text-sm font-medium hover:bg-[#24562F] active:scale-[0.99] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2E6B3B]"
              aria-label={`Open order bag with ${totalItems} items`}
            >
              <ShoppingBag className="w-4 h-4 text-[#A5CC3D]" />
              <span>{SITE_CONFIG.brand.orderCtaLocal}</span>
              <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-[#A5CC3D] text-[#12301B] text-xs font-semibold">
                {totalItems}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        {currentView === "story" ? (
          /* ===================================================================
             PART 1: TULSI STORY INTRO (THE LANDING PAGE)
             One idea per screen, left-aligned, edge-to-edge photos, big Barlow
             Condensed headings, short plain sentences.
             =================================================================== */
          <>
            {/* ---------------------------------------------------------------
                SCREEN 1: HERO (Kept intact; "See the menu" switches to menu page)
               --------------------------------------------------------------- */}
            <section className="relative overflow-hidden border-b border-[#2E6B3B]/12 min-h-[calc(100vh-5rem)] flex items-center">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                  {/* Left editorial column */}
                  <div className="lg:col-span-6 flex flex-col items-start text-left">
                    {/* Live computed Open/Closed badge */}
                    <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#2E6B3B]/20 text-xs sm:text-sm text-[#12301B] mb-6">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          openStatus.isOpen
                            ? "bg-[#A5CC3D] ring-4 ring-[#A5CC3D]/30"
                            : "bg-[#12301B]/40"
                        }`}
                      />
                      <span className="font-medium">{openStatus.label}</span>
                    </div>

                    {/* Main sentence-case headline */}
                    <h1 className="font-heading font-bold text-[46px] sm:text-[62px] lg:text-[72px] leading-[0.96] text-[#12301B] max-w-[14ch]">
                      {SITE_CONFIG.brand.tagline}
                    </h1>

                    <p className="mt-5 text-base sm:text-lg text-[#12301B]/85 max-w-[54ch] leading-relaxed">
                      {SITE_CONFIG.brand.subline}
                    </p>

                    {/* Primary & Secondary CTAs */}
                    <div className="mt-8 flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setIsCartOpen(true)}
                        className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 min-h-[48px] rounded-full bg-[#2E6B3B] text-[#F5F9F0] text-base font-semibold hover:bg-[#24562F] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2E6B3B]"
                      >
                        <MessageCircle className="w-5 h-5 text-[#A5CC3D]" />
                        <span>Order on WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateToView("menu")}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] rounded-full border border-[#2E6B3B] text-[#12301B] text-base font-medium hover:bg-[#2E6B3B]/8 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E6B3B]"
                      >
                        <span>See the menu</span>
                      </button>
                    </div>

                    {/* Grounded real facts strip */}
                    <div className="mt-10 pt-6 border-t border-[#2E6B3B]/15 w-full grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
                      <div>
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-[#12301B]">
                          <Star className="w-4 h-4 fill-[#2E6B3B] text-[#2E6B3B]" />
                          <span>{SITE_CONFIG.rating.score} on Google</span>
                        </div>
                        <p className="text-xs text-[#12301B]/70 mt-0.5">
                          Consistent local rating
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#12301B]">
                          11:00 AM – 11:00 PM
                        </p>
                        <p className="text-xs text-[#12301B]/70 mt-0.5">
                          Open every day
                        </p>
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <p className="text-sm font-semibold text-[#12301B]">
                          Kagwade Mala, Main Rd
                        </p>
                        <p className="text-xs text-[#12301B]/70 mt-0.5">
                          Royal Eats, Ichalkaranji
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right full-bleed / editorial composition: brown bread sandwich + fresh cut fruit */}
                  <div className="lg:col-span-6">
                    <div className="relative">
                      <div className="overflow-hidden rounded-2xl border border-[#2E6B3B]/15 bg-[#E6EFE0] aspect-[4/3] sm:aspect-[16/11]">
                        <img
                          src="https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1400&q=85"
                          alt="Fresh vegetable sandwich on brown bread with crisp greens"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-6 sm:left-5 sm:max-w-[290px] bg-[#F5F9F0] border border-[#2E6B3B]/20 rounded-xl p-3.5 shadow-sm flex items-center gap-3.5">
                        <img
                          src="https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=400&q=80"
                          alt="Chilled seasonal cut fruits"
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="text-left">
                          <div className="flex items-center gap-1.5">
                            <VegSymbol />
                            <span className="text-xs font-medium text-[#2E6B3B]">
                              Cut fresh all day
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-[#12301B] mt-0.5">
                            Brown bread sandwiches & fruit bowls
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ---------------------------------------------------------------
                SCREEN 2: "WHO WE ARE" — One screen, left-aligned, edge-to-edge photo
               --------------------------------------------------------------- */}
            <section
              id="who-we-are"
              className="min-h-[88vh] flex flex-col justify-between border-b border-[#2E6B3B]/12 py-14 sm:py-24"
            >
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left">
                <p className="text-sm font-semibold text-[#2E6B3B]">
                  Who we are
                </p>
                <h2 className="mt-3 font-heading font-bold text-[42px] sm:text-[64px] lg:text-[76px] leading-[0.98] text-[#12301B] max-w-[18ch]">
                  Tulsi Foods makes fresh, hygienic food that does not
                  compromise on taste.
                </h2>
                <p className="mt-6 text-lg sm:text-xl text-[#12301B]/85 max-w-[56ch] leading-relaxed">
                  We are a local quick-bites counter at Royal Eats on Main Road,
                  Kagwade Mala in Ichalkaranji. People stop by when they want
                  something clean and light that still feels satisfying.
                </p>
              </div>

              {/* Full-bleed edge-to-edge visual */}
              <div className="mt-10 sm:mt-14 w-full overflow-hidden border-y border-[#2E6B3B]/15 bg-[#E6EFE0]">
                <div className="aspect-[16/9] sm:aspect-[21/8] w-full">
                  <img
                    src="https://images.unsplash.com/photo-1592417817098-8f3d691a4bf5?auto=format&fit=crop&w=1800&q=85"
                    alt="Fresh tomatoes, mozzarella, and basil prepared cleanly at Tulsi Foods"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </section>

            {/* ---------------------------------------------------------------
                SCREEN 3: "WHAT WE MAKE" — Slow horizontal story strip, ONE large photo at a time
               --------------------------------------------------------------- */}
            <section
              id="what-we-make"
              className="min-h-[92vh] flex flex-col justify-center border-b border-[#2E6B3B]/12 py-14 sm:py-24"
            >
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 text-left">
                  <div>
                    <p className="text-sm font-semibold text-[#2E6B3B]">
                      What we make
                    </p>
                    <h2 className="mt-2 font-heading font-bold text-[40px] sm:text-[58px] leading-[0.98] text-[#12301B] max-w-[18ch]">
                      Six everyday favorites, made fresh to order.
                    </h2>
                  </div>

                  {/* Calm step controls + counter */}
                  <div className="flex items-center gap-3 self-start sm:self-end">
                    <span className="font-heading font-bold text-2xl text-[#2E6B3B] mr-2">
                      0{activeSlideIndex + 1} / 0{SIGNATURE_STORY_ITEMS.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => scrollToStorySlide(activeSlideIndex - 1)}
                      className="w-12 h-12 rounded-full border border-[#2E6B3B]/30 flex items-center justify-center text-[#12301B] hover:bg-[#2E6B3B] hover:text-[#F5F9F0] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E6B3B]"
                      aria-label="Previous dish"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToStorySlide(activeSlideIndex + 1)}
                      className="w-12 h-12 rounded-full bg-[#2E6B3B] text-[#F5F9F0] flex items-center justify-center hover:bg-[#24562F] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E6B3B]"
                      aria-label="Next dish"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Full-bleed horizontal snap strip — one large photo at a time */}
              <div
                ref={storyStripRef}
                onScroll={handleStoryStripScroll}
                className="w-full overflow-x-auto snap-x snap-mandatory flex no-scrollbar"
              >
                {SIGNATURE_STORY_ITEMS.map((slide) => {
                  const qtyInCart = cart[slide.menuItemId] || 0;
                  return (
                    <article
                      key={slide.id}
                      className="w-full flex-shrink-0 snap-center"
                    >
                      {/* Edge-to-edge single large photograph */}
                      <div className="w-full aspect-[16/10] sm:aspect-[21/9] bg-[#E6EFE0] border-y border-[#2E6B3B]/15 overflow-hidden">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Left-aligned caption & quick add */}
                      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 sm:pt-9 flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-left">
                        <div className="max-w-[58ch]">
                          <div className="flex items-center gap-2.5">
                            <span className="font-heading font-bold text-xl text-[#2E6B3B]">
                              {slide.indexLabel}
                            </span>
                            <VegSymbol />
                          </div>
                          <h3 className="mt-1 font-heading font-bold text-[34px] sm:text-[48px] text-[#12301B] leading-none">
                            {slide.title}
                          </h3>
                          <p className="mt-3 text-base sm:text-lg text-[#12301B]/80 leading-relaxed">
                            {slide.note}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 self-start sm:self-end">
                          <button
                            type="button"
                            onClick={() => handleAddToCart(slide.menuItemId)}
                            className="inline-flex items-center gap-2 px-5 py-3 min-h-[48px] rounded-full bg-[#2E6B3B] text-[#F5F9F0] text-sm font-semibold hover:bg-[#24562F] transition-colors"
                          >
                            <Plus className="w-4 h-4 text-[#A5CC3D]" />
                            <span>
                              {qtyInCart > 0
                                ? `In bag (${qtyInCart}) · Add another`
                                : "Add to bag"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Pill indicators for the 6 signature dishes */}
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 w-full flex flex-wrap items-center gap-2">
                {SIGNATURE_STORY_ITEMS.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToStorySlide(idx)}
                    className={`px-3.5 py-2 min-h-[40px] rounded-full text-xs sm:text-sm font-medium transition-colors ${
                      activeSlideIndex === idx
                        ? "bg-[#2E6B3B] text-[#F5F9F0]"
                        : "bg-white/80 text-[#12301B] border border-[#2E6B3B]/20 hover:border-[#2E6B3B]"
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </section>

            {/* ---------------------------------------------------------------
                SCREEN 4: "HOW WE KEEP IT" — Freshness, Hygiene, Good Packing.
                One statement per screen, large type, edge-to-edge photo.
               --------------------------------------------------------------- */}
            {HOW_WE_KEEP_IT_SCREENS.map((screen) => (
              <section
                key={screen.id}
                className="min-h-[85vh] flex flex-col justify-between border-b border-[#2E6B3B]/12 py-14 sm:py-24"
              >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left">
                  <p className="text-sm font-semibold text-[#2E6B3B]">
                    {screen.step} — {screen.pillar}
                  </p>
                  <h2 className="mt-3 font-heading font-bold text-[42px] sm:text-[64px] lg:text-[74px] leading-[0.98] text-[#12301B] max-w-[17ch]">
                    {screen.headline}
                  </h2>
                  <p className="mt-5 text-lg sm:text-xl text-[#12301B]/80 max-w-[56ch] leading-relaxed">
                    {screen.body}
                  </p>
                </div>

                <div className="mt-10 sm:mt-14 w-full overflow-hidden border-y border-[#2E6B3B]/15 bg-[#E6EFE0]">
                  <div className="aspect-[16/9] sm:aspect-[21/7] w-full">
                    <img
                      src={screen.image}
                      alt={screen.imageAlt}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </section>
            ))}

            {/* ---------------------------------------------------------------
                SCREEN 5: SINGLE STRONG BUTTON — "See the full menu"
               --------------------------------------------------------------- */}
            <section className="min-h-[65vh] flex items-center border-b border-[#2E6B3B]/12 py-16 sm:py-28 bg-white/55">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left">
                <p className="text-sm font-semibold text-[#2E6B3B]">
                  Ready when you are
                </p>
                <h2 className="mt-3 font-heading font-bold text-[44px] sm:text-[68px] leading-[0.98] text-[#12301B] max-w-[16ch]">
                  Explore every sandwich, salad, chaat, and fruit bowl.
                </h2>
                <p className="mt-4 text-base sm:text-lg text-[#12301B]/80 max-w-[52ch] leading-relaxed">
                  Open every day from 11:00 AM to 11:00 PM for quick pickup at
                  Royal Eats or WhatsApp ordering.
                </p>

                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => navigateToView("menu")}
                    className="inline-flex items-center gap-3 px-8 py-4 min-h-[54px] rounded-full bg-[#2E6B3B] text-[#F5F9F0] text-lg font-semibold hover:bg-[#24562F] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2E6B3B]"
                  >
                    <span>See the full menu</span>
                    <ArrowRight className="w-5 h-5 text-[#A5CC3D]" />
                  </button>
                </div>
              </div>
            </section>

            {/* ---------------------------------------------------------------
                SCREEN 6: SHORT REVIEWS WITH THE 4.5 RATING
               --------------------------------------------------------------- */}
            <section className="py-16 sm:py-24 border-b border-[#2E6B3B]/12">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                  <div className="text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#2E6B3B]/20 text-sm font-semibold text-[#12301B] mb-3">
                      <Star className="w-4 h-4 fill-[#2E6B3B] text-[#2E6B3B]" />
                      <span>{SITE_CONFIG.rating.score} / 5 on Google</span>
                    </div>
                    <h2 className="font-heading font-bold text-3xl sm:text-5xl text-[#12301B]">
                      What regulars appreciate most
                    </h2>
                  </div>
                  <p className="text-sm text-[#12301B]/75 max-w-[42ch] text-left">
                    Paraphrased from real customer feedback at Royal Eats,
                    Kagwade Mala.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {CUSTOMER_REVIEWS.map((rev) => (
                    <blockquote
                      key={rev.id}
                      className="rounded-2xl bg-white/75 border border-[#2E6B3B]/15 p-6 flex flex-col justify-between text-left"
                    >
                      <div>
                        <span className="inline-block px-2.5 py-1 rounded-md bg-[#F5F9F0] text-[#2E6B3B] text-xs font-medium border border-[#2E6B3B]/15 mb-4">
                          {rev.highlight}
                        </span>
                        <p className="text-base sm:text-lg text-[#12301B] leading-relaxed">
                          “{rev.quote}”
                        </p>
                      </div>
                      <footer className="mt-6 pt-3 border-t border-[#2E6B3B]/10 text-xs text-[#12301B]/70 font-medium">
                        — {rev.context}
                      </footer>
                    </blockquote>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          /* ===================================================================
             PART 2: DEDICATED FULL MENU & CATERING PAGE
             =================================================================== */
          <>
            <section
              id="menu"
              className="py-10 sm:py-16 border-b border-[#2E6B3B]/12"
            >
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back to story breadcrumb */}
                <div className="mb-6 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => navigateToView("story")}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#2E6B3B] hover:underline py-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Tulsi story</span>
                  </button>

                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#2E6B3B]/20 text-xs font-medium text-[#12301B]">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        openStatus.isOpen ? "bg-[#A5CC3D]" : "bg-[#12301B]/40"
                      }`}
                    />
                    <span>{openStatus.label}</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                  <div className="text-left max-w-[62ch]">
                    <h1 className="font-heading font-bold text-4xl sm:text-6xl text-[#12301B] leading-none">
                      Full menu for pickup and local delivery
                    </h1>
                    <p className="mt-3 text-base text-[#12301B]/80">
                      Add what you like and send your order directly to our
                      kitchen WhatsApp. No app downloads or login required.
                    </p>
                  </div>

                  {/* Owner [CONFIRM] visibility toggle */}
                  <div className="flex items-center gap-2 self-start md:self-end">
                    <button
                      type="button"
                      onClick={() => setShowConfirmBadges((prev) => !prev)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-full bg-white/80 border border-[#2E6B3B]/20 text-xs font-medium text-[#12301B] hover:border-[#2E6B3B] transition-colors"
                    >
                      {showConfirmBadges ? (
                        <Eye className="w-3.5 h-3.5 text-[#2E6B3B]" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-[#12301B]/60" />
                      )}
                      <span>
                        {showConfirmBadges
                          ? "Showing [CONFIRM] placeholders"
                          : "[CONFIRM] badges hidden"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Category Tabs */}
                <div
                  role="tablist"
                  aria-label="Menu categories"
                  className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8 border-b border-[#2E6B3B]/15"
                >
                  {MENU_CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    const displayLabel = showConfirmBadges
                      ? cat.label
                      : cat.label.replace(" [CONFIRM]", "");
                    return (
                      <button
                        key={cat.id}
                        role="tab"
                        aria-selected={isActive}
                        type="button"
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-4 py-2.5 min-h-[44px] rounded-full text-sm font-medium whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E6B3B] ${
                          isActive
                            ? "bg-[#2E6B3B] text-[#F5F9F0]"
                            : "bg-white/70 text-[#12301B] hover:bg-[#2E6B3B]/10 border border-[#2E6B3B]/15"
                        }`}
                      >
                        {displayLabel}
                      </button>
                    );
                  })}
                </div>

                {/* Active Category Items — Editorial asymmetric 2-column list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {MENU_ITEMS.filter(
                    (item) => item.category === activeCategory
                  ).map((item, idx) => {
                    const qty = cart[item.id] || 0;
                    const justAdded = recentlyAddedId === item.id;
                    const displayName = showConfirmBadges
                      ? item.name
                      : item.name.replace(" [CONFIRM]", "");
                    const displayDesc = showConfirmBadges
                      ? item.description
                      : item.description.replace(" [CONFIRM]", "");

                    const isFeatured = idx === 0;

                    return (
                      <article
                        key={item.id}
                        className={`group rounded-2xl bg-white/75 border border-[#2E6B3B]/15 overflow-hidden flex flex-col justify-between transition-colors hover:border-[#2E6B3B]/40 ${
                          isFeatured ? "md:col-span-2 md:flex-row" : ""
                        }`}
                      >
                        <div
                          className={`relative bg-[#E6EFE0] overflow-hidden ${
                            isFeatured
                              ? "md:w-5/12 aspect-[16/10] md:aspect-auto"
                              : "aspect-[16/10]"
                          }`}
                        >
                          <img
                            src={item.image}
                            alt={displayName}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          />
                          {item.isSignature && (
                            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#F5F9F0] text-[#2E6B3B] text-xs font-semibold border border-[#2E6B3B]/20">
                              Customer favorite
                            </span>
                          )}
                        </div>

                        <div
                          className={`p-5 sm:p-6 flex flex-col justify-between text-left ${
                            isFeatured ? "md:w-7/12" : "flex-1"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <VegSymbol />
                              <span className="text-xs font-medium text-[#2E6B3B]">
                                Freshly prepared
                              </span>
                              {showConfirmBadges && !item.isConfirmedItem && (
                                <span className="px-2 py-0.5 rounded bg-[#A5CC3D]/30 text-[#12301B] text-[11px] font-semibold">
                                  [CONFIRM item]
                                </span>
                              )}
                            </div>

                            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#12301B] leading-tight">
                              {displayName}
                            </h2>

                            <p className="mt-2 text-sm sm:text-base text-[#12301B]/80 leading-relaxed max-w-[58ch]">
                              {displayDesc}
                            </p>
                          </div>

                          <div className="mt-6 pt-4 border-t border-[#2E6B3B]/10 flex items-center justify-between gap-4">
                            <div>
                              <span className="text-lg sm:text-xl font-bold text-[#12301B]">
                                ₹{item.price}
                              </span>
                              {showConfirmBadges && !item.priceConfirmed && (
                                <span className="ml-2 px-2 py-0.5 rounded bg-[#A5CC3D]/25 text-[#12301B] text-xs font-medium">
                                  [CONFIRM]
                                </span>
                              )}
                            </div>

                            {qty === 0 ? (
                              <button
                                type="button"
                                onClick={() => handleAddToCart(item.id)}
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-full bg-[#2E6B3B] text-[#F5F9F0] text-sm font-semibold hover:bg-[#24562F] active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E6B3B]"
                              >
                                <Plus className="w-4 h-4 text-[#A5CC3D]" />
                                <span>Add</span>
                              </button>
                            ) : (
                              <div className="inline-flex items-center gap-1 bg-[#F5F9F0] border border-[#2E6B3B] rounded-full p-1">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQty(item.id, -1)}
                                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#12301B] hover:bg-[#2E6B3B]/10 transition-colors focus:outline-none"
                                  aria-label={`Decrease quantity of ${displayName}`}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="min-w-[36px] text-center text-sm font-semibold text-[#12301B] inline-flex items-center justify-center gap-1">
                                  {justAdded ? (
                                    <Check className="w-4 h-4 text-[#2E6B3B]" />
                                  ) : null}
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQty(item.id, 1)}
                                  className="w-9 h-9 rounded-full flex items-center justify-center bg-[#2E6B3B] text-[#F5F9F0] hover:bg-[#24562F] transition-colors focus:outline-none"
                                  aria-label={`Increase quantity of ${displayName}`}
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Catering and Bulk Orders section inside Menu View */}
            <section
              id="catering"
              className="py-14 sm:py-20 border-b border-[#2E6B3B]/12 bg-white/50"
            >
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  <div className="lg:col-span-5 text-left">
                    {showConfirmBadges && (
                      <span className="inline-block mb-3 px-3 py-1 rounded-full bg-[#A5CC3D]/30 text-[#12301B] text-xs font-semibold">
                        [CONFIRM scope with the owner]
                      </span>
                    )}
                    <h2 className="font-heading font-bold text-3xl sm:text-5xl text-[#12301B]">
                      Small gatherings, office boxes, and fruit trays
                    </h2>
                    <p className="mt-3 text-base text-[#12301B]/80 leading-relaxed max-w-[52ch]">
                      Need neatly packed brown bread sandwiches, fresh-cut fruit
                      cups, or hygienic chaat boxes for an office meeting or
                      family get-together in Ichalkaranji? Send us your details
                      on WhatsApp and we will confirm availability and pricing.
                    </p>

                    <div className="mt-6 space-y-2.5 text-sm text-[#12301B]/85">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#2E6B3B]" />
                        <span>Individual hygienic boxes with neat labeling</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#2E6B3B]" />
                        <span>
                          Fresh cut fruits and brown bread sandwiches made to
                          order
                        </span>
                      </div>
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      window.open(
                        whatsAppCateringUrl,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                    className="lg:col-span-7 bg-[#F5F9F0] border border-[#2E6B3B]/20 rounded-2xl p-6 sm:p-8 text-left"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="cat-event"
                          className="block text-sm font-medium text-[#12301B] mb-1.5"
                        >
                          Event or occasion
                        </label>
                        <input
                          id="cat-event"
                          type="text"
                          value={cateringEvent}
                          onChange={(e) => setCateringEvent(e.target.value)}
                          placeholder="e.g. Office meeting, birthday, clinic"
                          className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#2E6B3B]/25 text-sm text-[#12301B] focus:outline-none focus:border-[#2E6B3B]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="cat-guests"
                          className="block text-sm font-medium text-[#12301B] mb-1.5"
                        >
                          Approximate guests
                        </label>
                        <input
                          id="cat-guests"
                          type="text"
                          value={cateringGuests}
                          onChange={(e) => setCateringGuests(e.target.value)}
                          placeholder="e.g. 20 people"
                          className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#2E6B3B]/25 text-sm text-[#12301B] focus:outline-none focus:border-[#2E6B3B]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="cat-date"
                          className="block text-sm font-medium text-[#12301B] mb-1.5"
                        >
                          Date and preferred time
                        </label>
                        <input
                          id="cat-date"
                          type="text"
                          value={cateringDate}
                          onChange={(e) => setCateringDate(e.target.value)}
                          placeholder="e.g. This Saturday, 5:00 PM"
                          className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#2E6B3B]/25 text-sm text-[#12301B] focus:outline-none focus:border-[#2E6B3B]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="cat-contact"
                          className="block text-sm font-medium text-[#12301B] mb-1.5"
                        >
                          Your name and phone
                        </label>
                        <input
                          id="cat-contact"
                          type="text"
                          value={cateringContact}
                          onChange={(e) => setCateringContact(e.target.value)}
                          placeholder="Name & 10-digit mobile"
                          className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#2E6B3B]/25 text-sm text-[#12301B] focus:outline-none focus:border-[#2E6B3B]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="cat-notes"
                          className="block text-sm font-medium text-[#12301B] mb-1.5"
                        >
                          What would you like us to pack?
                        </label>
                        <textarea
                          id="cat-notes"
                          rows={2}
                          value={cateringNotes}
                          onChange={(e) => setCateringNotes(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#2E6B3B]/25 text-sm text-[#12301B] focus:outline-none focus:border-[#2E6B3B]"
                        />
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                      <p className="text-xs text-[#12301B]/70">
                        Opens a pre-filled WhatsApp message to {DISPLAY_PHONE}
                      </p>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-6 py-3 min-h-[48px] rounded-full bg-[#2E6B3B] text-[#F5F9F0] text-sm font-semibold hover:bg-[#24562F] transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 text-[#A5CC3D]" />
                        <span>Enquire on WhatsApp</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ===================================================================
            VISIT US SECTION (Shared at the bottom of Story & Menu pages)
           =================================================================== */}
        <section id="visit-us" className="py-14 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              <div className="lg:col-span-5 text-left">
                <h2 className="font-heading font-bold text-3xl sm:text-5xl text-[#12301B]">
                  Visit us at Kagwade Mala
                </h2>
                <p className="mt-3 text-base text-[#12301B]/80">
                  Drop in for a quick bite or pick up your WhatsApp order fresh
                  from the counter.
                </p>

                <div className="mt-7 space-y-5 text-sm sm:text-base text-[#12301B]">
                  <div className="flex items-start gap-3.5">
                    <MapPin className="w-5 h-5 text-[#2E6B3B] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">Address</p>
                      <p className="text-[#12301B]/80 mt-0.5 leading-relaxed">
                        {SITE_CONFIG.location.fullAddress}
                      </p>
                      <a
                        href={SITE_CONFIG.location.googleMapsDirectionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-[#2E6B3B] hover:underline mt-1.5"
                      >
                        <span>Open in Google Maps</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Clock className="w-5 h-5 text-[#2E6B3B] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">Hours</p>
                      <p className="text-[#12301B]/80 mt-0.5">
                        {SITE_CONFIG.hours.display}
                      </p>
                      <p className="text-xs text-[#2E6B3B] font-medium mt-0.5">
                        {openStatus.label}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Accessibility className="w-5 h-5 text-[#2E6B3B] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">Accessibility & service</p>
                      <p className="text-[#12301B]/80 mt-0.5">
                        Wheelchair accessible entrance · Quick bites · Clean
                        takeaway packing
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direct Tap-to-Call & Tap-to-WhatsApp buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href={`tel:+${WHATSAPP_NUMBER}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[48px] rounded-full border border-[#2E6B3B] text-[#12301B] text-sm font-semibold hover:bg-[#2E6B3B]/10 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#2E6B3B]" />
                    <span>Call {DISPLAY_PHONE}</span>
                  </a>

                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      "Namaskar Tulsi Foods, I have a quick question:"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[48px] rounded-full bg-[#2E6B3B] text-[#F5F9F0] text-sm font-semibold hover:bg-[#24562F] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#A5CC3D]" />
                    <span>WhatsApp us</span>
                  </a>
                </div>
              </div>

              {/* Embedded Map */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl overflow-hidden border border-[#2E6B3B]/20 bg-[#E6EFE0] h-[340px] sm:h-[420px]">
                  <iframe
                    title="Tulsi Foods location at Royal Eats, Kagwade Mala, Ichalkaranji"
                    src={SITE_CONFIG.location.googleMapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          FOOTER
         ===================================================================== */}
      <footer className="bg-[#12301B] text-[#F5F9F0] py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#F5F9F0]/15 text-left">
            <div className="md:col-span-5">
              <div className="inline-block bg-[#F5F9F0] px-3.5 py-2 rounded-xl">
                <TulsiLogo customLogoUrl={customLogoUrl} size="sm" />
              </div>
              <p className="mt-4 text-sm text-[#F5F9F0]/80 max-w-[42ch] leading-relaxed">
                Fresh, hygienic quick bites in Ichalkaranji. Veg sandwiches on
                brown bread, pani puri, caprese salad, steamed mantu, and
                seasonal cut fruits.
              </p>
            </div>

            <div className="md:col-span-4 text-sm space-y-2">
              <p className="font-semibold text-[#A5CC3D]">
                Hours and location
              </p>
              <p className="text-[#F5F9F0]/85">{SITE_CONFIG.hours.display}</p>
              <p className="text-[#F5F9F0]/75 leading-relaxed">
                {SITE_CONFIG.location.fullAddress}
              </p>
              <p className="pt-1 text-[#F5F9F0]/90 font-medium">
                Phone / WhatsApp: {DISPLAY_PHONE}
              </p>
            </div>

            <div className="md:col-span-3 text-sm space-y-2.5 flex flex-col items-start">
              <p className="font-semibold text-[#A5CC3D]">Quick links</p>
              <button
                type="button"
                onClick={() => navigateToView("story")}
                className="hover:underline text-left"
              >
                Our story (Landing page)
              </button>
              <button
                type="button"
                onClick={() => navigateToView("menu")}
                className="hover:underline text-left"
              >
                See the full menu
              </button>
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="hover:underline text-left"
              >
                Order on WhatsApp ({totalItems} in bag)
              </button>
              <button
                type="button"
                onClick={() => navigateToView("menu", "catering")}
                className="hover:underline text-left"
              >
                Catering and bulk orders
              </button>
              <button
                type="button"
                onClick={() => setIsReadmeOpen(true)}
                className="inline-flex items-center gap-1.5 text-[#A5CC3D] hover:underline pt-1 font-medium"
              >
                <FileText className="w-4 h-4" />
                <span>Owner README & [CONFIRM] guide</span>
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#F5F9F0]/65">
            <p>© {new Date().getFullYear()} Tulsi Foods, Ichalkaranji.</p>
            <p>
              Built for fast mobile ordering · WhatsApp direct checkout
            </p>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          STICKY MOBILE BOTTOM ORDER BAR (When cart has items and drawer is closed)
         ===================================================================== */}
      {totalItems > 0 && !isCartOpen && (
        <div className="fixed bottom-4 inset-x-4 z-20 sm:hidden">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3.5 px-5 min-h-[52px] rounded-full bg-[#2E6B3B] text-[#F5F9F0] shadow-lg flex items-center justify-between text-sm font-semibold border border-[#A5CC3D]/40"
          >
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded-full bg-[#A5CC3D] text-[#12301B] text-xs font-bold">
                {totalItems}
              </span>
              <span>
                View bag · ₹{subtotalAmount}
                {showConfirmBadges ? " [CONFIRM]" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#A5CC3D]">
              <span>{SITE_CONFIG.brand.orderCtaLocal}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* =====================================================================
          4. CART DRAWER (Slide-over WhatsApp Order Checkout)
         ===================================================================== */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-40 flex justify-end bg-[#12301B]/45 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-label="Your order bag"
        >
          <div className="relative w-full max-w-lg bg-[#F5F9F0] h-full flex flex-col justify-between overflow-hidden shadow-2xl border-l border-[#2E6B3B]/20">
            {/* Drawer Header */}
            <div className="px-5 py-4 bg-white/80 border-b border-[#2E6B3B]/15 flex items-center justify-between">
              <div className="text-left">
                <h2 className="font-heading font-bold text-2xl text-[#12301B]">
                  Your order ({totalItems} {totalItems === 1 ? "item" : "items"})
                </h2>
                <p className="text-xs text-[#12301B]/70">
                  Sends directly to Tulsi Foods WhatsApp ({DISPLAY_PHONE})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="w-11 h-11 rounded-full flex items-center justify-center text-[#12301B] hover:bg-[#2E6B3B]/10 transition-colors"
                aria-label="Close order drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-left">
              {cartLines.length === 0 ? (
                <div className="py-12 text-center">
                  <ShoppingBag className="w-10 h-10 text-[#2E6B3B]/50 mx-auto mb-3" />
                  <p className="font-heading font-bold text-2xl text-[#12301B]">
                    Your order bag is empty
                  </p>
                  <p className="mt-1 text-sm text-[#12301B]/75 max-w-xs mx-auto">
                    Add a brown bread sandwich, fresh fruit bowl, or pani puri
                    from the menu to start your WhatsApp order.
                  </p>
                </div>
              ) : (
                <>
                  {/* Line Items */}
                  <div className="space-y-3">
                    {cartLines.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl bg-white border border-[#2E6B3B]/15 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <VegSymbol />
                            <p className="text-sm font-semibold text-[#12301B] truncate">
                              {showConfirmBadges
                                ? item.name
                                : item.name.replace(" [CONFIRM]", "")}
                            </p>
                          </div>
                          <p className="text-xs text-[#12301B]/70 mt-1">
                            ₹{item.price} each{" "}
                            {showConfirmBadges && !item.priceConfirmed
                              ? "[CONFIRM]"
                              : ""}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="inline-flex items-center bg-[#F5F9F0] border border-[#2E6B3B]/30 rounded-full p-0.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.id, -1)}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-[#12301B] hover:bg-[#2E6B3B]/10"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="min-w-[26px] text-center text-xs font-bold">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.id, 1)}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-[#12301B] hover:bg-[#2E6B3B]/10"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="text-sm font-bold text-[#12301B] min-w-[48px] text-right">
                            ₹{item.lineTotal}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Subtotal Summary */}
                  <div className="p-4 rounded-xl bg-[#2E6B3B]/8 border border-[#2E6B3B]/20 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#12301B]">
                        Estimated total
                      </p>
                      <p className="text-xs text-[#12301B]/70">
                        Pay via UPI or cash on pickup / delivery{" "}
                        {showConfirmBadges ? "[CONFIRM]" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-heading font-bold text-2xl text-[#12301B]">
                        ₹{subtotalAmount}
                      </span>
                      {showConfirmBadges && (
                        <span className="block text-[11px] font-medium text-[#2E6B3B]">
                          [CONFIRM rates]
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Customer & Delivery / Pickup Details */}
                  <div className="space-y-4 pt-2">
                    <h3 className="font-heading font-bold text-xl text-[#12301B]">
                      Pickup or delivery details
                    </h3>

                    {/* Pickup vs Delivery Toggle */}
                    <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-white border border-[#2E6B3B]/20">
                      <button
                        type="button"
                        onClick={() => setOrderType("pickup")}
                        className={`py-2.5 px-3 min-h-[44px] rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                          orderType === "pickup"
                            ? "bg-[#2E6B3B] text-[#F5F9F0]"
                            : "text-[#12301B] hover:bg-[#2E6B3B]/8"
                        }`}
                      >
                        Pickup at Royal Eats
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderType("delivery")}
                        className={`py-2.5 px-3 min-h-[44px] rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                          orderType === "delivery"
                            ? "bg-[#2E6B3B] text-[#F5F9F0]"
                            : "text-[#12301B] hover:bg-[#2E6B3B]/8"
                        }`}
                      >
                        Local delivery {showConfirmBadges ? "[CONFIRM]" : ""}
                      </button>
                    </div>

                    {orderType === "delivery" && (
                      <div className="text-xs text-[#12301B]/80 bg-white/80 p-3 rounded-lg border border-[#2E6B3B]/15">
                        Delivery area: {SITE_CONFIG.location.deliveryAreaNote}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="cart-name"
                          className="block text-xs font-semibold text-[#12301B] mb-1"
                        >
                          Your name
                        </label>
                        <input
                          id="cart-name"
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Rohan Patil"
                          className="w-full px-3 py-2.5 min-h-[44px] rounded-lg bg-white border border-[#2E6B3B]/25 text-sm text-[#12301B] focus:outline-none focus:border-[#2E6B3B]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="cart-phone"
                          className="block text-xs font-semibold text-[#12301B] mb-1"
                        >
                          Phone number
                        </label>
                        <input
                          id="cart-phone"
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="10-digit mobile number"
                          className="w-full px-3 py-2.5 min-h-[44px] rounded-lg bg-white border border-[#2E6B3B]/25 text-sm text-[#12301B] focus:outline-none focus:border-[#2E6B3B]"
                        />
                      </div>
                    </div>

                    {orderType === "delivery" && (
                      <div>
                        <label
                          htmlFor="cart-address"
                          className="block text-xs font-semibold text-[#12301B] mb-1"
                        >
                          Delivery address in Ichalkaranji
                        </label>
                        <textarea
                          id="cart-address"
                          rows={2}
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="House/shop name, lane, landmark near Kagwade Mala / Main Rd"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#2E6B3B]/25 text-sm text-[#12301B] focus:outline-none focus:border-[#2E6B3B]"
                        />
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="cart-slot"
                        className="block text-xs font-semibold text-[#12301B] mb-1"
                      >
                        Preferred time slot (11:00 AM – 11:00 PM)
                      </label>
                      <select
                        id="cart-slot"
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full px-3 py-2.5 min-h-[44px] rounded-lg bg-white border border-[#2E6B3B]/25 text-sm text-[#12301B] focus:outline-none focus:border-[#2E6B3B]"
                      >
                        <option value="As soon as ready (20–25 mins)">
                          As soon as ready (20–25 mins)
                        </option>
                        <option value="12:30 PM – 1:30 PM (Lunch)">
                          12:30 PM – 1:30 PM (Lunch)
                        </option>
                        <option value="4:30 PM – 6:00 PM (Evening snack)">
                          4:30 PM – 6:00 PM (Evening snack)
                        </option>
                        <option value="7:30 PM – 9:00 PM (Dinner)">
                          7:30 PM – 9:00 PM (Dinner)
                        </option>
                        <option value="9:00 PM – 10:30 PM (Late evening)">
                          9:00 PM – 10:30 PM (Late evening)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="cart-notes"
                        className="block text-xs font-semibold text-[#12301B] mb-1"
                      >
                        Preparation note (optional)
                      </label>
                      <input
                        id="cart-notes"
                        type="text"
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="e.g. Less spicy, pack chutney separately"
                        className="w-full px-3 py-2.5 min-h-[44px] rounded-lg bg-white border border-[#2E6B3B]/25 text-sm text-[#12301B] focus:outline-none focus:border-[#2E6B3B]"
                      />
                    </div>

                    {/* Preview exact WhatsApp message toggle */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setShowWhatsAppPreview((p) => !p)}
                        className="text-xs font-medium text-[#2E6B3B] underline underline-offset-4"
                      >
                        {showWhatsAppPreview
                          ? "Hide pre-filled WhatsApp message preview"
                          : "Preview exact WhatsApp message"}
                      </button>

                      {showWhatsAppPreview && (
                        <div className="mt-2 p-3 rounded-xl bg-white border border-[#2E6B3B]/20">
                          <pre className="text-xs text-[#12301B]/85 whitespace-pre-wrap font-body leading-relaxed">
                            {whatsAppOrderMessage}
                          </pre>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(
                                whatsAppOrderMessage
                              );
                              setCopiedCartMsg(true);
                              setTimeout(() => setCopiedCartMsg(false), 2000);
                            }}
                            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#2E6B3B]"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>
                              {copiedCartMsg
                                ? "Copied to clipboard"
                                : "Copy message text"}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Drawer Footer CTA */}
            {cartLines.length > 0 && (
              <div className="p-4 sm:p-5 bg-white border-t border-[#2E6B3B]/15">
                <a
                  href={whatsAppOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 min-h-[50px] rounded-full bg-[#2E6B3B] text-[#F5F9F0] font-semibold text-base flex items-center justify-center gap-2.5 hover:bg-[#24562F] transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-[#A5CC3D]" />
                  <span>Place order on WhatsApp · ₹{subtotalAmount}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          10. OWNER README & [CONFIRM] CHECKLIST MODAL
         ===================================================================== */}
      {isReadmeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#12301B]/50 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-label="Owner Setup & [CONFIRM] Checklist"
        >
          <div className="bg-[#F5F9F0] border border-[#2E6B3B]/25 rounded-2xl max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-2xl text-left">
            <div className="px-6 py-4 bg-white border-b border-[#2E6B3B]/15 flex items-center justify-between">
              <div>
                <h2 className="font-heading font-bold text-2xl text-[#12301B]">
                  Owner README & [CONFIRM] setup checklist
                </h2>
                <p className="text-xs text-[#12301B]/70">
                  How to swap the WhatsApp number, logo file, menu items, and
                  confirm placeholders in 10 minutes
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsReadmeOpen(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#12301B] hover:bg-[#2E6B3B]/10"
                aria-label="Close README modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#12301B]">
              {/* Interactive testing controls */}
              <div className="p-4 rounded-xl bg-white border border-[#2E6B3B]/20 space-y-4">
                <h3 className="font-heading font-bold text-xl text-[#2E6B3B]">
                  Live preview controls
                </h3>

                {/* Upload exact logo image */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div>
                    <p className="font-semibold">
                      1. Test with your uploaded logo file
                    </p>
                    <p className="text-xs text-[#12301B]/70">
                      Upload your PNG/SVG logo to replace the header & footer
                      logo immediately
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-full bg-[#2E6B3B] text-[#F5F9F0] text-xs font-semibold cursor-pointer hover:bg-[#24562F]">
                      <Upload className="w-3.5 h-3.5 text-[#A5CC3D]" />
                      <span>Upload logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    {customLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setCustomLogoUrl(null)}
                        className="text-xs underline text-[#12301B]/70"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Simulate Open / Closed badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#2E6B3B]/10">
                  <div>
                    <p className="font-semibold">
                      2. Test Hero Open / Closed status badge
                    </p>
                    <p className="text-xs text-[#12301B]/70">
                      Computed from 11:00 AM – 11:00 PM IST ({openStatus.istTimeFormatted})
                    </p>
                  </div>
                  <div className="inline-flex rounded-full bg-[#F5F9F0] p-1 border border-[#2E6B3B]/20">
                    {["live", "open", "closed"].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setStatusOverride(mode)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          statusOverride === mode
                            ? "bg-[#2E6B3B] text-[#F5F9F0]"
                            : "text-[#12301B]"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Replay signature hero animation */}
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#2E6B3B]/10">
                  <div>
                    <p className="font-semibold">
                      3. Replay signature ring-and-leaf intro
                    </p>
                    <p className="text-xs text-[#12301B]/70">
                      Under 1.8s SVG stroke + leaf unfurl animation
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsReadmeOpen(false);
                      setIntroSettled(false);
                      setShowIntro(true);
                      setTimeout(() => setIntroSettled(true), 1350);
                      setTimeout(() => setShowIntro(false), 1750);
                    }}
                    className="px-3.5 py-2 rounded-full border border-[#2E6B3B] text-xs font-semibold text-[#2E6B3B] hover:bg-[#2E6B3B]/10"
                  >
                    Replay intro
                  </button>
                </div>
              </div>

              {/* Quick code swap instructions */}
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-xl text-[#12301B]">
                  How to swap the WhatsApp number & menu
                </h3>
                <p className="text-xs sm:text-sm text-[#12301B]/80 leading-relaxed">
                  All constants live at the top of the centralized content
                  module:
                </p>
                <div className="p-3.5 rounded-xl bg-white border border-[#2E6B3B]/20 font-mono text-xs space-y-1 text-[#12301B]">
                  <p>export const WHATSAPP_NUMBER = "919112997450";</p>
                  <p>export const DISPLAY_PHONE = "+91 91129 97450";</p>
                  <p>export const MENU_ITEMS = [ ... ];</p>
                </div>
              </div>

              {/* Complete list of [CONFIRM] items */}
              <div className="space-y-3">
                <h3 className="font-heading font-bold text-xl text-[#12301B]">
                  Checklist of every [CONFIRM] item
                </h3>
                <div className="space-y-2.5">
                  {CONFIRM_CHECKLIST.map((entry, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-white border border-[#2E6B3B]/15"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-[#12301B]">
                          {entry.item}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#A5CC3D]/30 text-[#12301B] text-xs font-semibold">
                          {entry.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#12301B]/75 leading-relaxed">
                        {entry.instructions}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-white border-t border-[#2E6B3B]/15 flex justify-end">
              <button
                type="button"
                onClick={() => setIsReadmeOpen(false)}
                className="px-5 py-2.5 min-h-[44px] rounded-full bg-[#2E6B3B] text-[#F5F9F0] text-sm font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}