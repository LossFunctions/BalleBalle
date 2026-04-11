export type AvailabilityDemoState = "idle" | "available" | "unavailable";

type NavItem = {
  label: string;
  href: string;
};

type ContactLink = {
  label: string;
  href: string;
  external?: boolean;
};

type MediaAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  kind?: "image" | "video";
  poster?: string;
  presentation?: {
    fit?: "contain" | "cover";
    frameTone?: "soft" | "light" | "dark";
    subjectStyle?: "default" | "cutout";
    objectPosition?: string;
    scale?: number;
    hoverScale?: number;
    previewScale?: number;
    translateX?: string;
    translateY?: string;
    previewTranslateX?: string;
    previewTranslateY?: string;
  };
};

type Metric = {
  label: string;
  value: string;
};

export type PackagePreviewSlide = {
  title: string;
  description: string;
  chips: string[];
  image: MediaAsset;
};

export type HowItWorksStep = {
  step: string;
  title: string;
  detail: string;
  note?: string;
};

export type BundlePath = {
  id: "standard" | "customize";
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
};

export type CustomizeOption = {
  id: string;
  title: string;
  subtitle: string;
  selectionSummary: string;
  pricePerDay?: number;
  image: MediaAsset;
  gallery?: MediaAsset[];
  variantLabel?: string;
  variantHint?: string;
  variants?: CustomizeOptionVariant[];
};

export type CustomizeOptionVariant = {
  id: string;
  label: string;
  swatch: string;
  imageIndex?: number;
};

export type CustomizeStep = {
  id: string;
  title: string;
  skippedSummary: string;
  pricePerDay: number;
  options: CustomizeOption[];
};

export type AddOnOption = {
  id: string;
  title: string;
  subtitle: string;
  selectionSummary: string;
  pricePerDay: number;
  image: MediaAsset;
};

export type FAQItem = {
  question: string;
  answer: string[];
  answerRowLinks?: Array<{
    answerIndex: number;
    link: ContactLink;
  }>;
  links?: ContactLink[];
};

export type SiteConfig = {
  businessName: string;
  serviceLabel: string;
  productName: string;
  pickupArea: string;
  navItems: NavItem[];
  contactLinks: ContactLink[];
  socialLinks: ContactLink[];
  serviceNotes: string[];
  highlights: Metric[];
  heroImage: MediaAsset;
  setupImage: MediaAsset;
  packagePreviewSlides: PackagePreviewSlide[];
  logisticsImage: MediaAsset;
  celebrationImage: MediaAsset;
  pricingPlaceholder: {
    amount: string;
    note: string;
  };
  includedItems: string[];
  fitNotes: string[];
};

export const siteConfig = {
  businessName: "Balle Balle",
  serviceLabel: "Dholki Rental Simplified",
  productName: "Signature Dholki Package",
  pickupArea: "60-34 60th Drive, Maspeth, NY 11378",
  navItems: [
    { label: "Get Started", href: "/get-started" },
    { label: "Rental", href: "/#rental" },
    { label: "Availability", href: "/availability" },
    { label: "How It Works", href: "/#process" },
    { label: "Gallery", href: "/#gallery" },
    { label: "FAQ", href: "/#faq" },
  ],
  contactLinks: [
    {
      label: "hello@balleballeplaceholder.com",
      href: "mailto:hello@balleballeplaceholder.com",
    },
    {
      label: "(201) 555-0118",
      href: "tel:+12015550118",
    },
    {
      label: "WhatsApp placeholder",
      href: "https://wa.me/12015550118",
      external: true,
    },
  ],
  socialLinks: [
    {
      label: "Instagram",
      href: "https://instagram.com/balleballeplaceholder",
      external: true,
    },
    {
      label: "Pinterest",
      href: "https://pinterest.com/balleballeplaceholder",
      external: true,
    },
  ],
  serviceNotes: [
    "Replace pickup radius, runner availability, and turnaround policies before launch.",
    "This phase is purely front-end; availability, payment, and locking logic are intentionally absent.",
  ],
  highlights: [
    {
      label: "Fully customizable",
      value: "Choose a pre-packed package or tailor the details to fit your celebration.",
    },
    {
      label: "Easy and quick",
      value: "No back-and-forth calls, no added hassle, and no unnecessary stress.",
    },
    {
      label: "Flexible handoff",
      value: "Pickup, drop-off, or delivery can be arranged based on what works best for you.",
    },
  ],
  heroImage: {
    src: "/placeholders/hero-crop.svg",
    alt: "Editorial placeholder crop showing the dholki setup in a portrait composition.",
    width: 960,
    height: 1280,
  },
  setupImage: {
    src: "/placeholders/setup-full.svg",
    alt: "Wide placeholder showing the full dholki setup with floor seating.",
    width: 1600,
    height: 1100,
  },
  packagePreviewSlides: [
    {
      title: "Cushions and layered textiles",
      description:
        "A close look at the soft goods that give the setup its warmth, color, and comfort around the dholki moment.",
      chips: ["Floor cushions", "Layered textiles", "Trim accents"],
      image: {
        src: "/placeholders/detail-embroidered.svg",
        alt: "Placeholder detail view of embroidered cushions and layered textiles.",
        width: 880,
        height: 1040,
      },
    },
    {
      title: "Tray styling and accent pieces",
      description:
        "Decorative finishing elements that help the package feel complete without pushing the look into clutter.",
      chips: ["Tray styling", "Accent decor", "Marigold details"],
      image: {
        src: "/placeholders/detail-tray.svg",
        alt: "Placeholder detail view of the tray styling and marigold-toned accents.",
        width: 880,
        height: 880,
      },
    },
  ],
  logisticsImage: {
    src: "/placeholders/logistics.svg",
    alt: "Placeholder showing packed rental pieces staged for pickup logistics.",
    width: 1320,
    height: 920,
  },
  celebrationImage: {
    src: "/placeholders/celebration.svg",
    alt: "Placeholder showing the dholki setup in use during a celebration.",
    width: 1100,
    height: 1400,
  },
  pricingPlaceholder: {
    amount: "$425",
    note: "Weekend rental placeholder. Replace with your live pricing, deposit, and extras rules.",
  },
  includedItems: [
    "Dholki focal table with layered ground textiles",
    "Floor cushions for the immediate seating pocket",
    "Tray styling and accent decor for the final finish",
    "Pickup, return, or delivery guidance for a clean handoff",
  ],
  fitNotes: [
    "Designed for a styled 8 ft x 10 ft nook, platform edge, or lounge corner.",
    "Comfortably frames 6 to 10 seated guests around the focal moment.",
    "Packed into lift-friendly bins and soft goods for straightforward pickup.",
  ],
} satisfies SiteConfig;

export const trustBadges = [
  {
    title: "Textile-led styling",
    detail: "Layered for warmth, not clutter.",
  },
  {
    title: "Pickup-ready packing",
    detail: "Organized for a clean handoff.",
  },
  {
    title: "Manual final confirmation",
    detail: "High-touch service remains visible.",
  },
  {
    title: "Reset between rentals",
    detail: "Steamed, checked, and staged again.",
  },
];

export const bundlePaths: BundlePath[] = [
  {
    id: "customize",
    eyebrow: "Tailored Setup",
    title: "Fully customize your setup.",
    description:
      "Only pay for the pieces you need, from the exact dhol to backdrop layers, rugs, garlands, props, and finishing touches.",
    bullets: [
      "Work through the setup one layer at a time",
      "Choose only what belongs in your package",
      "Optional extras stay available inside the same flow",
    ],
  },
  {
    id: "standard",
    eyebrow: "Standard Bundle",
    title: "Prefer the ready-made package?",
    description:
      "The signature package stays available if you want a faster starting point with the pricing and included pieces already laid out.",
    bullets: [
      "Review the signature package exactly as presented",
      "Use it if you want fewer decisions up front",
      "Continue to availability once the bundle feels right",
    ],
  },
];

export const customizeSteps: CustomizeStep[] = [
  {
    id: "dhol",
    title: "Dhol",
    skippedSummary: "You are not including a dhol in this setup.",
    pricePerDay: 30,
    options: [
      {
        id: "single-ivory",
        title: "Ivory embroidered",
        subtitle: "Large premium dhol",
        selectionSummary:
          "You are selecting an ivory embroidered dhol with larger premium proportions and a more heirloom feel.",
        pricePerDay: 30,
        image: {
          src: "/product-pictures/dhol-1/Dhol1A-Photoroom.png",
          alt: "Cutout view of the ivory embroidered dhol rental option.",
          width: 1140,
          height: 477,
          presentation: {
            fit: "contain",
            frameTone: "soft",
            subjectStyle: "cutout",
            scale: 1.24,
            hoverScale: 1.28,
            previewScale: 1.1,
            translateX: "3.5%",
            previewTranslateX: "3%",
          },
        },
        gallery: [
          {
            src: "/product-pictures/dhol-1/Dhol1A-Photoroom.png",
            alt: "Cutout view of the ivory embroidered dhol rental option.",
            width: 1140,
            height: 477,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
              scale: 1.24,
              hoverScale: 1.28,
              previewScale: 1.1,
              translateX: "3.5%",
              previewTranslateX: "3%",
            },
          },
          {
            src: "/product-pictures/dhol-1/Dhol1B-Photoroom.png",
            alt: "Alternate cutout view of the ivory embroidered dhol rental option.",
            width: 1140,
            height: 477,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
              scale: 1.22,
              hoverScale: 1.26,
              previewScale: 1.08,
              translateX: "1.5%",
              previewTranslateX: "1%",
            },
          },
          {
            src: "/product-pictures/dhol-1/Dhol1C-Photoroom.png",
            alt: "Detail cutout view of the ivory embroidered dhol rental option.",
            width: 1140,
            height: 477,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
              scale: 1.2,
              hoverScale: 1.24,
              previewScale: 1.08,
              translateX: "2.5%",
              previewTranslateX: "2%",
            },
          },
          {
            src: "/product-pictures/dhol-1/Dhol1Vid.mp4",
            alt: "Video view of the ivory embroidered dhol rental option.",
            width: 1280,
            height: 720,
            kind: "video",
            poster: "/product-pictures/dhol-1/Dhol1A-Photoroom.png",
            presentation: {
              frameTone: "light",
              fit: "cover",
              scale: 1.08,
              hoverScale: 1.12,
              previewScale: 1.08,
            },
          },
        ],
      },
      {
        id: "double-mixed",
        title: "Royal blue",
        subtitle: "Large velvet dhol",
        selectionSummary:
          "You are selecting a royal blue dhol with a larger velvet body for a richer focal layer.",
        pricePerDay: 20,
        image: {
          src: "/product-pictures/dhol-2/Dhol2A-Photoroom.png",
          alt: "Front view of the royal blue dhol rental option.",
          width: 1140,
          height: 760,
          presentation: {
            fit: "contain",
            frameTone: "soft",
            subjectStyle: "cutout",
            scale: 1.12,
            hoverScale: 1.16,
            previewScale: 1.04,
          },
        },
        gallery: [
          {
            src: "/product-pictures/dhol-2/Dhol2A-Photoroom.png",
            alt: "Front view of the royal blue dhol rental option.",
            width: 1140,
            height: 760,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
              scale: 1.12,
              hoverScale: 1.16,
              previewScale: 1.04,
            },
          },
          {
            src: "/product-pictures/dhol-2/Dhol2B-Photoroom.png",
            alt: "Alternate angle of the royal blue dhol rental option.",
            width: 1140,
            height: 760,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
              scale: 1.1,
              hoverScale: 1.14,
              previewScale: 1.03,
            },
          },
          {
            src: "/product-pictures/dhol-2/Dhol2C-Photoroom.png",
            alt: "Detail view of the royal blue dhol rental option.",
            width: 1140,
            height: 760,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
              scale: 1.1,
              hoverScale: 1.14,
              previewScale: 1.03,
            },
          },
        ],
      },
      {
        id: "mirror-festival",
        title: "Wooden multicolored",
        subtitle: "Small dhol (7.5 x 5 inches)",
        selectionSummary:
          "You are selecting a small wooden multicolored dhol for a more compact accent.",
        pricePerDay: 8,
        image: {
          src: "/product-pictures/dhol-3/Dhol3A-Photoroom.png",
          alt: "Cutout view of the wooden multicolored dhol rental option.",
          width: 1140,
          height: 1140,
          presentation: {
            fit: "contain",
            frameTone: "soft",
            subjectStyle: "cutout",
            scale: 0.88,
            hoverScale: 0.91,
            previewScale: 0.92,
          },
        },
        gallery: [
          {
            src: "/product-pictures/dhol-3/Dhol3A-Photoroom.png",
            alt: "Cutout view of the wooden multicolored dhol rental option.",
            width: 1140,
            height: 1140,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
              scale: 0.88,
              hoverScale: 0.91,
              previewScale: 0.92,
            },
          },
          {
            src: "/product-pictures/dhol-3/Dhol3B-Photoroom.png",
            alt: "Front view of the wooden multicolored dhol rental option.",
            width: 1140,
            height: 1140,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
              scale: 0.9,
              hoverScale: 0.93,
              previewScale: 0.94,
            },
          },
          {
            src: "/product-pictures/dhol-3/Dhol3C-Photoroom.png",
            alt: "Alternate angle of the wooden multicolored dhol rental option.",
            width: 1140,
            height: 1140,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
              scale: 0.86,
              hoverScale: 0.9,
              previewScale: 0.9,
            },
          },
        ],
      },
    ],
  },
  {
    id: "backdrop-stand",
    title: "Backdrop stand",
    skippedSummary: "You are leaving the setup open without a backdrop stand.",
    pricePerDay: 30,
    options: [
      {
        id: "arched-stand",
        title: "Black backdrop",
        subtitle: "10 feet by 10 feet backdrop",
        selectionSummary:
          "You are adding a black backdrop frame in a 10 feet by 10 feet size for a cleaner structural outline.",
        image: {
          src: "/product-pictures/customizer/backdrop-stand/straight-backdrop-frame/Backdrop1A-Photoroom.png",
          alt: "Cutout view of the straight backdrop frame option.",
          width: 1140,
          height: 1140,
          presentation: {
            fit: "contain",
            frameTone: "soft",
            subjectStyle: "cutout",
            scale: 0.98,
            hoverScale: 1.02,
          },
        },
        gallery: [
          {
            src: "/product-pictures/customizer/backdrop-stand/straight-backdrop-frame/Backdrop1A-Photoroom.png",
            alt: "Cutout view of the straight backdrop frame option.",
            width: 1140,
            height: 1140,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
              scale: 0.98,
              hoverScale: 1.02,
            },
          },
          {
            src: "/product-pictures/customizer/backdrop-stand/straight-backdrop-frame/Backdrop1B.png",
            alt: "Alternate view of the straight backdrop frame option.",
            width: 1140,
            height: 1140,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
              scale: 0.9,
              hoverScale: 0.94,
            },
          },
          {
            src: "/product-pictures/customizer/backdrop-stand/straight-backdrop-frame/Backdrop1C-Photoroom.png",
            alt: "Detail view of the straight backdrop frame base.",
            width: 1140,
            height: 1140,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
            },
          },
          {
            src: "/product-pictures/customizer/backdrop-stand/arched-stand/Backdrop1A.webp",
            alt: "Photo view of the black backdrop frame option.",
            width: 794,
            height: 794,
          },
          {
            src: "/product-pictures/customizer/backdrop-stand/arched-stand/Backdrop1B.avif",
            alt: "Alternate photo view of the black backdrop frame option.",
            width: 794,
            height: 794,
          },
          {
            src: "/product-pictures/customizer/backdrop-stand/arched-stand/Backdrop1C.avif",
            alt: "Backdrop frame detail photo for the black backdrop option.",
            width: 794,
            height: 794,
          },
          {
            src: "/product-pictures/customizer/backdrop-stand/arched-stand/Backdrop1D.avif",
            alt: "Backdrop frame setup photo for the black backdrop option.",
            width: 794,
            height: 794,
          },
        ],
      },
      {
        id: "straight-frame",
        title: "Silver backdrop",
        subtitle: "10 feet by 10 feet backdrop",
        selectionSummary:
          "You are adding a silver backdrop frame in a 10 feet by 10 feet size for a softer, more finished backdrop layer.",
        image: {
          src: "/product-pictures/customizer/backdrop-stand/draped-backdrop-frame/Backdrop2A-Photoroom.png",
          alt: "Cutout view of the draped backdrop frame option.",
          width: 1481,
          height: 1412,
          presentation: {
            fit: "contain",
            frameTone: "soft",
            subjectStyle: "cutout",
            scale: 1.02,
            hoverScale: 1.05,
          },
        },
        gallery: [
          {
            src: "/product-pictures/customizer/backdrop-stand/draped-backdrop-frame/Backdrop2A-Photoroom.png",
            alt: "Cutout view of the draped backdrop frame option.",
            width: 1481,
            height: 1412,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
              scale: 1.02,
              hoverScale: 1.05,
            },
          },
          {
            src: "/product-pictures/customizer/backdrop-stand/draped-backdrop-frame/Backdrop2C-Photoroom.png",
            alt: "Setup detail view of the draped backdrop frame option.",
            width: 1454,
            height: 1453,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
            },
          },
          {
            src: "/product-pictures/customizer/backdrop-stand/straight-frame/Backdrop2A.jpg",
            alt: "Photo view of the silver backdrop frame option.",
            width: 1481,
            height: 1412,
          },
          {
            src: "/product-pictures/customizer/backdrop-stand/straight-frame/Backdrop2B.jpg",
            alt: "Backdrop frame detail photo for the silver backdrop option.",
            width: 1500,
            height: 1412,
          },
          {
            src: "/product-pictures/customizer/backdrop-stand/straight-frame/Backdrop2C.jpg",
            alt: "Backdrop frame setup photo for the silver backdrop option.",
            width: 1454,
            height: 1453,
          },
        ],
      },
    ],
  },
  {
    id: "backdrop-garlands",
    title: "Garlands",
    skippedSummary: "You are leaving the backdrop without floral garlands.",
    pricePerDay: 10,
    options: [
      {
        id: "minimal-garlands",
        title: "Minimal garland set",
        subtitle: "Light floral touch",
        selectionSummary:
          "You are selecting a lighter garland count for a more restrained floral finish.",
        image: {
          src: "/placeholders/customizer/garlands.svg",
          alt: "Placeholder image showing backdrop garlands.",
          width: 880,
          height: 760,
        },
      },
      {
        id: "full-layered-garlands",
        title: "Full layered garlands",
        subtitle: "Richer floral finish",
        selectionSummary:
          "You are selecting a fuller garland count for a denser floral backdrop.",
        image: {
          src: "/placeholders/customizer/garlands.svg",
          alt: "Placeholder image showing backdrop garlands.",
          width: 880,
          height: 760,
        },
      },
    ],
  },
  {
    id: "colorful-curtains",
    title: "Curtains",
    skippedSummary: "You are leaving the backdrop without curtain layering.",
    pricePerDay: 10,
    options: [
      {
        id: "rose-drape",
        title: "Rose-toned drape",
        subtitle: "Soft and romantic",
        selectionSummary:
          "You are selecting rose-toned curtains for a softer backdrop layer.",
        image: {
          src: "/placeholders/customizer/curtains.svg",
          alt: "Placeholder image showing colorful curtain options.",
          width: 880,
          height: 760,
        },
      },
      {
        id: "marigold-mehendi-drape",
        title: "Marigold-mehendi drape",
        subtitle: "Festive and layered",
        selectionSummary:
          "You are selecting a brighter mixed drape to bring in more color across the backdrop.",
        image: {
          src: "/placeholders/customizer/curtains.svg",
          alt: "Placeholder image showing colorful curtain options.",
          width: 880,
          height: 760,
        },
      },
    ],
  },
  {
    id: "neon-sign",
    title: "Neon sign",
    skippedSummary: "You are keeping the setup free of neon signage for now.",
    pricePerDay: 20,
    options: [
      {
        id: "monogram-neon",
        title: "Monogram neon",
        subtitle: "Personal and polished",
        selectionSummary:
          "You are selecting a monogram-style neon sign for a more personal focal detail.",
        image: {
          src: "/placeholders/customizer/neon-sign.svg",
          alt: "Placeholder image showing a neon sign option.",
          width: 880,
          height: 760,
        },
      },
      {
        id: "phrase-neon",
        title: "Short phrase neon",
        subtitle: "Playful and bright",
        selectionSummary:
          "You are selecting a short phrase neon sign for a brighter celebratory note.",
        image: {
          src: "/placeholders/customizer/neon-sign.svg",
          alt: "Placeholder image showing a neon sign option.",
          width: 880,
          height: 760,
        },
      },
    ],
  },
  {
    id: "umbrella",
    title: "Umbrella",
    skippedSummary: "You are skipping the umbrella accent for a cleaner silhouette.",
    pricePerDay: 10,
    options: [
      {
        id: "mehendi-fringe",
        title: "Mehendi fringe umbrella",
        subtitle: "Grounded and rich",
        selectionSummary:
          "You are selecting a mehendi umbrella accent with fringe detail for a richer traditional note.",
        image: {
          src: "/placeholders/customizer/umbrella-mehendi.svg",
          alt: "Placeholder image showing a mehendi fringe umbrella option.",
          width: 880,
          height: 760,
        },
      },
      {
        id: "marigold-scallop",
        title: "Marigold scallop umbrella",
        subtitle: "Bright and festive",
        selectionSummary:
          "You are selecting a marigold umbrella accent for a brighter and more festive finish.",
        image: {
          src: "/placeholders/customizer/umbrella-marigold.svg",
          alt: "Placeholder image showing a marigold scallop umbrella option.",
          width: 880,
          height: 760,
        },
      },
      {
        id: "mirror-edge",
        title: "Mirror-edge umbrella",
        subtitle: "Detailed and reflective",
        selectionSummary:
          "You are selecting an umbrella with mirrored edge detail for a more embellished final layer.",
        image: {
          src: "/placeholders/customizer/umbrella-mirror.svg",
          alt: "Placeholder image showing a mirror-edge umbrella option.",
          width: 880,
          height: 760,
        },
      },
    ],
  },
  {
    id: "thaal",
    title: "Thaal",
    skippedSummary: "You are leaving the thaal styling out for a simpler package.",
    pricePerDay: 10,
    options: [
      {
        id: "brass-floral",
        title: "Brass floral thaal",
        subtitle: "Classic and warm",
        selectionSummary:
          "You are selecting a classic brass thaal with floral accents for a warmer traditional finish.",
        image: {
          src: "/placeholders/customizer/thaal-brass.svg",
          alt: "Placeholder image showing a brass floral thaal option.",
          width: 880,
          height: 760,
        },
      },
      {
        id: "rose-soft",
        title: "Rose petal thaal",
        subtitle: "Soft and romantic",
        selectionSummary:
          "You are selecting a softer rose-led thaal for a lighter and more romantic accent.",
        image: {
          src: "/placeholders/customizer/thaal-rose.svg",
          alt: "Placeholder image showing a rose petal thaal option.",
          width: 880,
          height: 760,
        },
      },
      {
        id: "mirror-candle",
        title: "Mirror and candle thaal",
        subtitle: "Reflective and polished",
        selectionSummary:
          "You are selecting a reflective thaal with mirrored accents and candle styling for added polish.",
        image: {
          src: "/placeholders/customizer/thaal-mirror.svg",
          alt: "Placeholder image showing a mirror and candle thaal option.",
          width: 880,
          height: 760,
        },
      },
    ],
  },
  {
    id: "bench",
    title: "Bench",
    skippedSummary: "You are keeping the setup floor-led without a bench.",
    pricePerDay: 20,
    options: [
      {
        id: "cane-bench",
        title: "Boucle bench",
        subtitle: "Rounded and plush",
        selectionSummary:
          "You are adding a boucle bench to anchor the seating pocket with a softer, more plush silhouette.",
        image: {
          src: "/product-pictures/customizer/bench/cane-bench/Bench1A-Photoroom.png",
          alt: "Cutout view of the boucle bench option.",
          width: 1500,
          height: 831,
          presentation: {
            fit: "contain",
            frameTone: "soft",
            subjectStyle: "cutout",
            scale: 1.04,
            hoverScale: 1.08,
            previewScale: 1,
          },
        },
        gallery: [
          {
            src: "/product-pictures/customizer/bench/cane-bench/Bench1A-Photoroom.png",
            alt: "Cutout view of the boucle bench option.",
            width: 1500,
            height: 831,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
              scale: 1.04,
              hoverScale: 1.08,
              previewScale: 1,
            },
          },
          {
            src: "/product-pictures/customizer/bench/cane-bench/Bench1A.jpg",
            alt: "Photo view of the boucle bench option.",
            width: 1500,
            height: 831,
          },
          {
            src: "/product-pictures/customizer/bench/cane-bench/Bench1B.jpg",
            alt: "Dimension view of the boucle bench option.",
            width: 1500,
            height: 1152,
          },
          {
            src: "/product-pictures/customizer/bench/cane-bench/Bench1C.jpg",
            alt: "Detail view of the boucle bench upholstery.",
            width: 1500,
            height: 1500,
          },
        ],
      },
      {
        id: "tufted-bench",
        title: "Cream bench",
        subtitle: "Tailored and polished",
        selectionSummary:
          "You are adding a cream bench with slimmer legs for a cleaner, more tailored front-facing seat.",
        image: {
          src: "/product-pictures/customizer/bench/tufted-bench/Bench2A-Photoroom.png",
          alt: "Cutout view of the cream bench option.",
          width: 1500,
          height: 653,
          presentation: {
            fit: "contain",
            frameTone: "soft",
            subjectStyle: "cutout",
            scale: 1.08,
            hoverScale: 1.12,
            previewScale: 1.02,
          },
        },
        gallery: [
          {
            src: "/product-pictures/customizer/bench/tufted-bench/Bench2A-Photoroom.png",
            alt: "Cutout view of the cream bench option.",
            width: 1500,
            height: 653,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
              scale: 1.08,
              hoverScale: 1.12,
              previewScale: 1.02,
            },
          },
          {
            src: "/product-pictures/customizer/bench/tufted-bench/Bench2A.jpg",
            alt: "Photo view of the cream bench option.",
            width: 1500,
            height: 842,
          },
          {
            src: "/product-pictures/customizer/bench/tufted-bench/Bench2B.jpg",
            alt: "Dimension view of the cream bench option.",
            width: 1500,
            height: 866,
          },
          {
            src: "/product-pictures/customizer/bench/tufted-bench/Bench2C-Photoroom.png",
            alt: "Alternate cutout view of the cream bench option.",
            width: 1500,
            height: 842,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
              scale: 1.04,
              hoverScale: 1.08,
              previewScale: 1,
            },
          },
          {
            src: "/product-pictures/customizer/bench/tufted-bench/Bench2C.jpg",
            alt: "Detail view of the cream bench upholstery.",
            width: 1500,
            height: 1500,
          },
        ],
      },
    ],
  },
  {
    id: "bench-cloth",
    title: "Bench cloth",
    skippedSummary: "You are leaving the bench uncovered without an added cloth layer.",
    pricePerDay: 15,
    options: [
      {
        id: "embroidered-bench-cloth",
        title: "Embroidered bench cloth",
        subtitle: "Colorful patterned drape",
        selectionSummary:
          "You are adding an embroidered bench cloth to bring in more pattern and color across the seating area.",
        image: {
          src: "/product-pictures/customizer/bench-cloth/embroidered-bench-cloth/BenchCloth1A.webp",
          alt: "Photo showing the embroidered bench cloth option draped over a bench.",
          width: 794,
          height: 529,
          presentation: {
            fit: "contain",
            frameTone: "light",
          },
        },
        gallery: [
          {
            src: "/product-pictures/customizer/bench-cloth/embroidered-bench-cloth/BenchCloth1A.webp",
            alt: "Photo showing the embroidered bench cloth option draped over a bench.",
            width: 794,
            height: 529,
            presentation: {
              fit: "contain",
              frameTone: "light",
            },
          },
          {
            src: "/product-pictures/customizer/bench-cloth/embroidered-bench-cloth/BenchCloth1B.webp",
            alt: "Full view of the embroidered bench cloth laid out flat.",
            width: 1140,
            height: 1710,
            presentation: {
              fit: "contain",
              frameTone: "light",
            },
          },
          {
            src: "/product-pictures/customizer/bench-cloth/embroidered-bench-cloth/BenchCloth1C.webp",
            alt: "Lengthwise detail view of the embroidered bench cloth.",
            width: 1140,
            height: 1710,
            presentation: {
              fit: "contain",
              frameTone: "light",
            },
          },
        ],
      },
      {
        id: "phulkari-bench-cloth",
        title: "Phulkari bench cloth",
        subtitle: "Bold embroidered drape",
        selectionSummary:
          "You are adding a phulkari-style bench cloth for brighter color and embroidered detail across the seating area.",
        image: {
          src: "/product-pictures/customizer/bench-cloth/phulkari-bench-cloth/BenchCloth2B.jpg",
          alt: "Photo showing the phulkari bench cloth option.",
          width: 1140,
          height: 855,
          presentation: {
            fit: "contain",
            frameTone: "light",
          },
        },
        gallery: [
          {
            src: "/product-pictures/customizer/bench-cloth/phulkari-bench-cloth/BenchCloth2A.webp",
            alt: "Photo showing multiple phulkari cloth color options.",
            width: 1140,
            height: 855,
            presentation: {
              fit: "contain",
              frameTone: "light",
            },
          },
          {
            src: "/product-pictures/customizer/bench-cloth/phulkari-bench-cloth/BenchCloth2B.jpg",
            alt: "Photo showing two phulkari cloth options.",
            width: 1140,
            height: 855,
            presentation: {
              fit: "contain",
              frameTone: "light",
            },
          },
          {
            src: "/product-pictures/customizer/bench-cloth/phulkari-bench-cloth/BenchCloth2C.webp",
            alt: "Photo showing additional phulkari cloth color options.",
            width: 1140,
            height: 855,
            presentation: {
              fit: "contain",
              frameTone: "light",
            },
          },
          {
            src: "/product-pictures/customizer/bench-cloth/phulkari-bench-cloth/BenchCloth2D.webp",
            alt: "Photo showing green and yellow phulkari cloth options.",
            width: 1140,
            height: 855,
            presentation: {
              fit: "contain",
              frameTone: "light",
            },
          },
        ],
      },
    ],
  },
  {
    id: "rug",
    title: "Rug",
    skippedSummary: "You are keeping the base layer minimal without an added rug.",
    pricePerDay: 20,
    options: [
      {
        id: "neutral-rug",
        title: "Neutral base rug",
        subtitle: "Quiet and grounding",
        selectionSummary:
          "You are selecting a neutral rug to ground the setup without adding visual weight.",
        image: {
          src: "/placeholders/customizer/rug.svg",
          alt: "Placeholder image showing a rug option.",
          width: 880,
          height: 760,
        },
      },
      {
        id: "patterned-rug",
        title: "Patterned heritage rug",
        subtitle: "Richer and layered",
        selectionSummary:
          "You are selecting a patterned rug for a fuller, more layered base.",
        image: {
          src: "/placeholders/customizer/rug.svg",
          alt: "Placeholder image showing a rug option.",
          width: 880,
          height: 760,
        },
      },
    ],
  },
  {
    id: "floor-cushions",
    title: "Floor cushions",
    skippedSummary: "You are leaving the cushion layer out of this draft setup.",
    pricePerDay: 20,
    options: [
      {
        id: "six-cushions",
        title: "Five vibrant cushions",
        subtitle: "Set of 5 cushions",
        selectionSummary:
          "You are selecting five vibrant cushions for a smaller seating pocket.",
        pricePerDay: 10,
        image: {
          src: "/product-pictures/customizer/floor-cushions/six-cushions/Cushion2A-Photoroom.png",
          alt: "Cutout view of the six cushion edit option.",
          width: 1140,
          height: 1140,
          presentation: {
            fit: "contain",
            frameTone: "soft",
            subjectStyle: "cutout",
            scale: 1.03,
            hoverScale: 1.07,
            previewScale: 1.02,
          },
        },
        gallery: [
          {
            src: "/product-pictures/customizer/floor-cushions/six-cushions/Cushion2A-Photoroom.png",
            alt: "Cutout view of the six cushion edit option.",
            width: 1140,
            height: 1140,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
              scale: 1.03,
              hoverScale: 1.07,
              previewScale: 1.02,
            },
          },
          {
            src: "/product-pictures/customizer/floor-cushions/six-cushions/Cushion2B-Photoroom.png",
            alt: "Cutout view of a patterned cushion in the six cushion edit.",
            width: 1140,
            height: 1140,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
              scale: 1.03,
              hoverScale: 1.07,
              previewScale: 1.02,
            },
          },
          {
            src: "/product-pictures/customizer/floor-cushions/six-cushions/Cushion2C-Photoroom.png",
            alt: "Cutout view of a yellow cushion in the six cushion edit.",
            width: 1140,
            height: 1140,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
              scale: 1.03,
              hoverScale: 1.07,
              previewScale: 1.02,
            },
          },
          {
            src: "/product-pictures/customizer/floor-cushions/six-cushions/Cushion2D-Photoroom.png",
            alt: "Cutout view of a pink cushion in the six cushion edit.",
            width: 1140,
            height: 1140,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
              scale: 1.03,
              hoverScale: 1.07,
              previewScale: 1.02,
            },
          },
          {
            src: "/product-pictures/customizer/floor-cushions/six-cushions/Cushion2E-Photoroom.png",
            alt: "Cutout view of a green cushion in the six cushion edit.",
            width: 1140,
            height: 1140,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
              scale: 1.03,
              hoverScale: 1.07,
              previewScale: 1.02,
            },
          },
          {
            src: "/product-pictures/customizer/floor-cushions/six-cushions/Cushion2F-Photoroom.png",
            alt: "Cutout view of a green cushion on a chair.",
            width: 1140,
            height: 1140,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
              scale: 1.03,
              hoverScale: 1.07,
              previewScale: 1.02,
            },
          },
        ],
      },
      {
        id: "full-cushion-set",
        title: "Decorative round cushion",
        subtitle: "22 inch, rate is for each individual cushion",
        selectionSummary:
          "You are selecting decorative round cushions to build a more layered lounge feel.",
        pricePerDay: 5,
        variantLabel: "Color mix",
        variantHint: "Add quantities by color. Rate is for each individual cushion.",
        variants: [
          {
            id: "pink",
            label: "Pink",
            swatch: "#da6aa4",
            imageIndex: 0,
          },
          {
            id: "yellow",
            label: "Yellow",
            swatch: "#e0b428",
            imageIndex: 1,
          },
          {
            id: "blue",
            label: "Blue",
            swatch: "#4662d9",
            imageIndex: 2,
          },
          {
            id: "orange",
            label: "Orange",
            swatch: "#e18b34",
            imageIndex: 3,
          },
        ],
        image: {
          src: "/product-pictures/customizer/floor-cushions/full-cushion-set/LargeCushion1A-Photoroom.png",
          alt: "Cutout view of the full lounge cushion set option.",
          width: 1140,
          height: 1140,
          presentation: {
            fit: "contain",
            frameTone: "soft",
            subjectStyle: "cutout",
            scale: 1.06,
            hoverScale: 1.1,
            previewScale: 1.04,
          },
        },
        gallery: [
          {
            src: "/product-pictures/customizer/floor-cushions/full-cushion-set/LargeCushion1A-Photoroom.png",
            alt: "Cutout view of a pink patchwork floor cushion.",
            width: 1140,
            height: 1140,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
              scale: 1.06,
              hoverScale: 1.1,
              previewScale: 1.04,
            },
          },
          {
            src: "/product-pictures/customizer/floor-cushions/full-cushion-set/LargeCushion1B-Photoroom.png",
            alt: "Cutout view of a yellow patchwork floor cushion.",
            width: 1140,
            height: 1163,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
              scale: 1.06,
              hoverScale: 1.1,
              previewScale: 1.04,
            },
          },
          {
            src: "/product-pictures/customizer/floor-cushions/full-cushion-set/LargeCushion1C-Photoroom.png",
            alt: "Cutout view of a blue patchwork floor cushion.",
            width: 1140,
            height: 1094,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
              scale: 1.06,
              hoverScale: 1.1,
              previewScale: 1.04,
            },
          },
          {
            src: "/product-pictures/customizer/floor-cushions/full-cushion-set/LargeCushion1D-Photoroom.png",
            alt: "Cutout view of an orange patchwork floor cushion.",
            width: 1140,
            height: 1140,
            presentation: {
              fit: "contain",
              frameTone: "soft",
              subjectStyle: "cutout",
              scale: 1.06,
              hoverScale: 1.1,
              previewScale: 1.04,
            },
          },
          {
            src: "/product-pictures/customizer/floor-cushions/full-cushion-set/LargeCushion1E.webp",
            alt: "Close-up detail of pink patchwork cushion embroidery.",
            width: 1140,
            height: 1140,
            presentation: {
              fit: "contain",
              frameTone: "light",
            },
          },
          {
            src: "/product-pictures/customizer/floor-cushions/full-cushion-set/LargeCushion1F.webp",
            alt: "Close-up detail of yellow patchwork cushion embroidery.",
            width: 1140,
            height: 1100,
            presentation: {
              fit: "contain",
              frameTone: "light",
            },
          },
          {
            src: "/product-pictures/customizer/floor-cushions/full-cushion-set/LargeCushion1G.webp",
            alt: "Close-up detail of blue patchwork cushion embroidery.",
            width: 1140,
            height: 1073,
            presentation: {
              fit: "contain",
              frameTone: "light",
            },
          },
        ],
      },
    ],
  },
  {
    id: "table-centerpieces",
    title: "Table centerpieces",
    skippedSummary: "You are leaving the tabletop without centerpieces for now.",
    pricePerDay: 10,
    options: [
      {
        id: "single-centerpiece",
        title: "Single floral centerpiece",
        subtitle: "Quiet and clean",
        selectionSummary:
          "You are selecting one restrained centerpiece for the tabletop edit.",
        image: {
          src: "/placeholders/customizer/centerpieces.svg",
          alt: "Placeholder image showing table centerpiece options.",
          width: 880,
          height: 760,
        },
      },
      {
        id: "mixed-centerpiece-edit",
        title: "Mixed centerpiece edit",
        subtitle: "Fuller and styled",
        selectionSummary:
          "You are selecting a fuller centerpiece edit with more styling on the table.",
        image: {
          src: "/placeholders/customizer/centerpieces.svg",
          alt: "Placeholder image showing table centerpiece options.",
          width: 880,
          height: 760,
        },
      },
    ],
  },
  {
    id: "large-props",
    title: "Large props",
    skippedSummary: "You are keeping the setup free of larger prop moments.",
    pricePerDay: 15,
    options: [
      {
        id: "lantern-pair",
        title: "Lantern pair",
        subtitle: "Warm and sculptural",
        selectionSummary:
          "You are selecting a lantern pair for a warmer sculptural layer around the setup.",
        image: {
          src: "/placeholders/customizer/large-props.svg",
          alt: "Placeholder image showing large prop options.",
          width: 880,
          height: 760,
        },
      },
      {
        id: "statement-props",
        title: "Statement prop grouping",
        subtitle: "Bigger visual impact",
        selectionSummary:
          "You are selecting a larger prop grouping for more visual weight at the edges of the setup.",
        image: {
          src: "/placeholders/customizer/large-props.svg",
          alt: "Placeholder image showing large prop options.",
          width: 880,
          height: 760,
        },
      },
    ],
  },
];

export const customizeAddOns: AddOnOption[] = [
  {
    id: "extra-garlands",
    title: "Extra garland bundle",
    subtitle: "Add more floral coverage",
    selectionSummary:
      "You are adding more floral coverage beyond the core backdrop selection.",
    pricePerDay: 15,
    image: {
      src: "/placeholders/customizer/garlands.svg",
      alt: "Placeholder image showing floral garland extras.",
      width: 880,
      height: 760,
    },
  },
  {
    id: "welcome-sign",
    title: "Welcome sign styling",
    subtitle: "Entry moment",
    selectionSummary:
      "You are adding a styled welcome sign to extend the look beyond the focal setup.",
    pricePerDay: 30,
    image: {
      src: "/placeholders/customizer/addon-signage.svg",
      alt: "Placeholder image showing a welcome sign styling extra.",
      width: 880,
      height: 760,
    },
  },
  {
    id: "lantern-cluster",
    title: "Lantern cluster",
    subtitle: "Extra ambient layer",
    selectionSummary:
      "You are adding a lantern cluster for more glow and depth around the setup.",
    pricePerDay: 20,
    image: {
      src: "/placeholders/customizer/addon-lanterns.svg",
      alt: "Placeholder image showing a lantern cluster extra.",
      width: 880,
      height: 760,
    },
  },
  {
    id: "rose-petals",
    title: "Rose petal accents",
    subtitle: "Soft finishing touch",
    selectionSummary:
      "You are adding rose petal accents as a softer finishing layer.",
    pricePerDay: 10,
    image: {
      src: "/placeholders/customizer/addon-petals.svg",
      alt: "Placeholder image showing rose petal accents.",
      width: 880,
      height: 760,
    },
  },
  {
    id: "extra-cushions",
    title: "Additional floor cushions",
    subtitle: "More guest seating",
    selectionSummary:
      "You are adding extra floor cushions to widen the immediate seating pocket.",
    pricePerDay: 20,
    image: {
      src: "/placeholders/customizer/floor-cushions.svg",
      alt: "Placeholder image showing extra floor cushions.",
      width: 880,
      height: 760,
    },
  },
  {
    id: "upholstered-folding-chair",
    title: "Upholstered folding chair",
    subtitle: "Padded guest seating",
    selectionSummary:
      "You are adding upholstered folding chairs to extend guest seating with a softer, more refined finish.",
    pricePerDay: 6,
    image: {
      src: "/product-pictures/customizer/chair/upholstered-folding-chair/Chair1A-Photoroom.png",
      alt: "Cutout view of the upholstered folding chair extra.",
      width: 1500,
      height: 1456,
      presentation: {
        fit: "contain",
        frameTone: "soft",
        subjectStyle: "cutout",
        scale: 0.98,
        hoverScale: 1.02,
      },
    },
  },
  {
    id: "white-folding-chair",
    title: "White folding chair",
    subtitle: "Classic event seating",
    selectionSummary:
      "You are adding white folding chairs to widen guest seating with a cleaner event-ready look.",
    pricePerDay: 4,
    image: {
      src: "/product-pictures/customizer/chair/white-folding-chair/Chair2A.png",
      alt: "Cutout view of the white folding chair extra.",
      width: 1481,
      height: 1500,
      presentation: {
        fit: "contain",
        frameTone: "soft",
        subjectStyle: "cutout",
        scale: 0.94,
        hoverScale: 0.98,
      },
    },
  },
  {
    id: "candle-styling",
    title: "Candle styling",
    subtitle: "Warm tabletop glow",
    selectionSummary:
      "You are adding candle styling for a warmer tabletop finish.",
    pricePerDay: 15,
    image: {
      src: "/placeholders/customizer/addon-candle.svg",
      alt: "Placeholder image showing candle styling extras.",
      width: 880,
      height: 760,
    },
  },
];

export const howItWorksSteps: HowItWorksStep[] = [
  {
    step: "01",
    title: "Tailor the setup",
    detail:
      "Fully customize your Dholki setup to fit your needs and only pay for the items you need, from the exact dhol to backdrop style, garland count, and more.",
  },
  {
    step: "02",
    title: "Start from your preferred path",
    detail:
      "Begin from a standard pre-packed package or customize the setup to fit your needs, then continue into availability once the details feel right.",
  },
];

export const galleryItems = [
  {
    title: "Celebration scale",
    caption:
      "Use this frame to show the setup in context, with people, lighting, and room depth.",
    image: siteConfig.celebrationImage,
  },
  {
    title: "Pickup clarity",
    caption:
      "A logistics image should quietly reassure customers that the rental arrives organized.",
    image: siteConfig.logisticsImage,
  },
  {
    title: "Hero crop",
    caption:
      "The portrait crop keeps the service premium and lets the styling breathe.",
    image: siteConfig.heroImage,
  },
  {
    title: "Close detail",
    caption:
      "Reserve one frame for fabric quality, trims, and the small objects that finish the scene.",
    image: siteConfig.packagePreviewSlides[0].image,
  },
];

export const faqItems: FAQItem[] = [
  {
    question: "How does pricing work?",
    answer: [
      "You can pick either the standard pre-packaged Dholki package, which includes a 20% discount, or customize your setup individually by item.",
      "Each item has its own cost by event. An event rate covers a 4-day rental window total: up to 3 days with the items, with return due by day 4. You can also choose the quantity of each item.",
    ],
  },
  {
    question: "Do you deliver or is it pickup only?",
    answer: [
      "We can accommodate both.",
      "Pickup is at 60-34 60th Drive, Maspeth, NY 11378.",
      "Within NYC and Long Island, delivery is available for a flat $200 fee.",
    ],
    answerRowLinks: [
      {
        answerIndex: 1,
        link: {
          label: "Google Maps Link",
          href: "https://maps.app.goo.gl/fmsfzFiFrusxjU8s6",
          external: true,
        },
      },
    ],
  },
  {
    question: "When do I need to return the items?",
    answer: [
      "We rent items out for 4 days at a time, including the pickup or delivery date, and items must be returned by the 4th day at the latest.",
      "If your event is on Saturday, October 3, you can pick up or receive the items on Friday, use them on Saturday, and return them by Monday. You can return them earlier if you want.",
      "Any items returned later than 4 days incur a $150 per day late fee.",
    ],
  },
  {
    question: "Can I customize the items I rent out?",
    answer: [
      "Yes. We allow full customization of your Dholki setup, for any additional questions or needs reach out to us below.",
    ],
    links: [
      {
        label: "umihuss@gmail.com",
        href: "mailto:umihuss@gmail.com",
      },
    ],
  },
];
