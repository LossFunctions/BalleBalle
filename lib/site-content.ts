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
  image: MediaAsset;
  gallery?: MediaAsset[];
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
  serviceLabel: "Editorial Dholki Rental",
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
    note: "Weekend rental placeholder. Replace with your live pricing, deposit, and add-on rules.",
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
      "Optional add-ons stay available inside the same flow",
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
        title: "Ivory embroidered dhol",
        subtitle: "Textural and ornate",
        selectionSummary:
          "You are selecting an ivory embroidered dhol with denser detail and a more heirloom feel.",
        image: {
          src: "/product-pictures/dhol-1/il_794xN.7804220742_8o4u-Photoroom.png",
          alt: "Cutout view of the ivory embroidered dhol rental option.",
          width: 794,
          height: 332,
        },
        gallery: [
          {
            src: "/product-pictures/dhol-1/il_794xN.7804220742_8o4u-Photoroom.png",
            alt: "Cutout view of the ivory embroidered dhol rental option.",
            width: 794,
            height: 332,
          },
          {
            src: "/product-pictures/dhol-1/il_794xN.7804220742_8o4u.jpg",
            alt: "Front angle of the ivory embroidered dhol rental option.",
            width: 794,
            height: 332,
          },
          {
            src: "/product-pictures/dhol-1/il_794xN.7804222120_ng5j.jpg",
            alt: "Alternate angle of the ivory embroidered dhol rental option.",
            width: 794,
            height: 332,
          },
          {
            src: "/product-pictures/dhol-1/il_794xN.7804220178_1c1c.avif",
            alt: "Detail view of the ivory embroidered dhol rental option.",
            width: 794,
            height: 332,
          },
        ],
      },
      {
        id: "double-mixed",
        title: "Mirror tassel dhol",
        subtitle: "Colorful and celebratory",
        selectionSummary:
          "You are selecting a brighter mirror-led dhol with tassel accents for a more celebratory focal layer.",
        image: {
          src: "/product-pictures/dhol-2/il_794xN.4031675348_rx8h.avif",
          alt: "Front view of the mirror tassel dhol rental option.",
          width: 794,
          height: 1059,
        },
        gallery: [
          {
            src: "/product-pictures/dhol-2/il_794xN.4031675348_rx8h.avif",
            alt: "Front view of the mirror tassel dhol rental option.",
            width: 794,
            height: 1059,
          },
          {
            src: "/product-pictures/dhol-2/il_794xN.4040727484_1pul.avif",
            alt: "Alternate angle of the mirror tassel dhol rental option.",
            width: 794,
            height: 1025,
          },
        ],
      },
      {
        id: "mirror-festival",
        title: "Royal blue dhol",
        subtitle: "Bold and polished",
        selectionSummary:
          "You are selecting a royal blue dhol with polished trim for a cleaner, richer contrast.",
        image: {
          src: "/product-pictures/dhol-3/il_794xN.7869430494_fkbg-Photoroom.png",
          alt: "Cutout view of the royal blue dhol rental option.",
          width: 794,
          height: 529,
        },
        gallery: [
          {
            src: "/product-pictures/dhol-3/il_794xN.7869430494_fkbg-Photoroom.png",
            alt: "Cutout view of the royal blue dhol rental option.",
            width: 794,
            height: 529,
          },
          {
            src: "/product-pictures/dhol-3/il_794xN.7869430524_cvk7.webp",
            alt: "Front view of the royal blue dhol rental option.",
            width: 794,
            height: 529,
          },
          {
            src: "/product-pictures/dhol-3/il_794xN.7869430494_fkbg.avif",
            alt: "Alternate angle of the royal blue dhol rental option.",
            width: 794,
            height: 529,
          },
          {
            src: "/product-pictures/dhol-3/il_794xN.7917383837_quy8.avif",
            alt: "Detail view of the royal blue dhol rental option.",
            width: 794,
            height: 529,
          },
        ],
      },
    ],
  },
  {
    id: "backdrop-stand",
    title: "Backdrop stand",
    skippedSummary: "You are leaving the setup open without a backdrop stand.",
    pricePerDay: 40,
    options: [
      {
        id: "arched-stand",
        title: "Arched backdrop stand",
        subtitle: "Soft and framing",
        selectionSummary:
          "You are adding an arched backdrop stand to frame the focal moment.",
        image: {
          src: "/placeholders/customizer/backdrop-stand.svg",
          alt: "Placeholder image showing a backdrop stand option.",
          width: 880,
          height: 760,
        },
      },
      {
        id: "straight-frame",
        title: "Straight backdrop frame",
        subtitle: "Clean and structured",
        selectionSummary:
          "You are adding a straight backdrop frame for a cleaner, more structured line.",
        image: {
          src: "/placeholders/customizer/backdrop-stand.svg",
          alt: "Placeholder image showing a backdrop stand option.",
          width: 880,
          height: 760,
        },
      },
    ],
  },
  {
    id: "backdrop-garlands",
    title: "Garlands",
    skippedSummary: "You are leaving the backdrop without floral garlands.",
    pricePerDay: 20,
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
    pricePerDay: 35,
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
    pricePerDay: 45,
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
    pricePerDay: 20,
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
    pricePerDay: 20,
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
    pricePerDay: 45,
    options: [
      {
        id: "cane-bench",
        title: "Cane bench",
        subtitle: "Airy and classic",
        selectionSummary:
          "You are adding a cane bench to anchor the seating pocket with a lighter frame.",
        image: {
          src: "/placeholders/customizer/bench.svg",
          alt: "Placeholder image showing a styled bench option.",
          width: 880,
          height: 760,
        },
      },
      {
        id: "tufted-bench",
        title: "Tufted bench",
        subtitle: "Soft and dressed-up",
        selectionSummary:
          "You are adding an upholstered bench for a softer front-facing seat.",
        image: {
          src: "/placeholders/customizer/bench.svg",
          alt: "Placeholder image showing a styled bench option.",
          width: 880,
          height: 760,
        },
      },
    ],
  },
  {
    id: "rug",
    title: "Rug",
    skippedSummary: "You are keeping the base layer minimal without an added rug.",
    pricePerDay: 25,
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
    pricePerDay: 30,
    options: [
      {
        id: "six-cushions",
        title: "Six cushion edit",
        subtitle: "Simple seating pocket",
        selectionSummary:
          "You are selecting a tighter cushion edit for a smaller seating pocket.",
        image: {
          src: "/placeholders/customizer/floor-cushions.svg",
          alt: "Placeholder image showing floor cushions.",
          width: 880,
          height: 760,
        },
      },
      {
        id: "full-cushion-set",
        title: "Full lounge cushion set",
        subtitle: "More filled-in seating",
        selectionSummary:
          "You are selecting a fuller cushion set for a more layered lounge feel.",
        image: {
          src: "/placeholders/customizer/floor-cushions.svg",
          alt: "Placeholder image showing floor cushions.",
          width: 880,
          height: 760,
        },
      },
    ],
  },
  {
    id: "table-centerpieces",
    title: "Table centerpieces",
    skippedSummary: "You are leaving the tabletop without centerpieces for now.",
    pricePerDay: 25,
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
    pricePerDay: 30,
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
      alt: "Placeholder image showing floral garland add-ons.",
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
      alt: "Placeholder image showing a welcome sign styling add-on.",
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
      alt: "Placeholder image showing a lantern cluster add-on.",
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
    id: "candle-styling",
    title: "Candle styling",
    subtitle: "Warm tabletop glow",
    selectionSummary:
      "You are adding candle styling for a warmer tabletop finish.",
    pricePerDay: 15,
    image: {
      src: "/placeholders/customizer/addon-candle.svg",
      alt: "Placeholder image showing candle styling add-ons.",
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

export const faqItems = [
  {
    question: "What exactly is being rented here?",
    answer:
      "This prototype presents a styled dholki setup with low seating, textiles, tray accents, and finishing details. Replace the list with your exact inventory before launch.",
  },
  {
    question: "Do you deliver or is it pickup only?",
    answer:
      "The current placeholder assumes pickup from Maspeth, Queens. Add your delivery zones, runner fees, or pickup-only policy once operations are finalized.",
  },
  {
    question: "Is the availability shown live?",
    answer:
      "No. The availability card is a front-end demo with mocked states for idle, available, and unavailable outcomes.",
  },
  {
    question: "How long is the rental window?",
    answer:
      "The layout implies a weekend-style handoff. Replace this answer with your actual pickup, return, late-fee, and grace-period policy.",
  },
  {
    question: "Can customers customize the palette?",
    answer:
      "The future flow should support styling notes and add-ons. In this phase, the page simply shows where those conversations belong.",
  },
];
