import {
  productPictureManifest,
  type ProductPictureFile,
} from "@/lib/generated/product-pictures-manifest";

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
    frameAspect?: "landscape" | "portrait";
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
  pickupMapUrl: string;
  navItems: NavItem[];
  contactLinks: ContactLink[];
  socialLinks: ContactLink[];
  serviceNotes: string[];
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
  serviceLabel: "South Asian Rental Simplified",
  productName: "Signature Dholki Package",
  pickupArea: "60-34 60th Drive, Maspeth, NY 11378",
  pickupMapUrl: "https://maps.app.goo.gl/fmsfzFiFrusxjU8s6",
  navItems: [
    { label: "Get Started", href: "/get-started" },
    { label: "Availability", href: "/availability" },
    { label: "Gallery", href: "/gallery" },
    { label: "FAQ", href: "/#faq" },
  ],
  contactLinks: [
    {
      label: "umihuss@gmail.com",
      href: "mailto:umihuss@gmail.com",
    },
    {
      label: "347-429-2996",
      href: "tel:+13474292996",
    },
  ],
  socialLinks: [],
  serviceNotes: ["We deliver within NYC and LI for a flat-fee of $200."],
  heroImage: {
    src: "/homepageimage.jpg",
    alt: "Portrait hero image showing the event setup styling.",
    width: 1080,
    height: 1350,
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
    title: "Fully customizable",
    detail: "Tailored packages",
  },
  {
    title: "Easy and quick",
    detail: "Simple checkout process",
  },
  {
    title: "Premium items",
    detail: "Curated high-end items",
  },
  {
    title: "Pickup-ready packaging",
    detail: "Organized for a clean handoff",
  },
  {
    title: "Flexible handoff",
    detail: "Pickup or delivery options available",
  },
];

export const occasionMarqueeItems = [
  "Mehndi",
  "Mayoun",
  "Dholki",
  "Nikkah",
  "Shaadi",
  "Walima",
  "Engagement",
  "Intimate Celebrations",
];

export const bundlePaths: BundlePath[] = [
  {
    id: "customize",
    eyebrow: "Tailored Setup",
    title: "Fully customize your setup.",
    description:
      "Only pay for the pieces you need, from the exact dhol to backdrops, garlands, curtains, benches, cloths, cushions, and seating extras.",
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

type ProductPictureOptionConfig = {
  id: string;
  folder: string;
  title: string;
  subtitle: string;
  selectionSummary: string;
  pricePerDay?: number;
  previewFileName?: string;
  presentation?: MediaAsset["presentation"];
  variantLabel?: string;
  variantHint?: string;
  variants?: CustomizeOptionVariant[];
};

type ProductPictureAddOnConfig = {
  id: string;
  folder: string;
  title: string;
  subtitle: string;
  selectionSummary: string;
  pricePerDay: number;
  previewFileName?: string;
  presentation?: MediaAsset["presentation"];
};

const PRODUCT_PICTURE_IMAGE_WIDTH = 1600;
const PRODUCT_PICTURE_IMAGE_HEIGHT = 1200;
const PRODUCT_PICTURE_VIDEO_WIDTH = 1280;
const PRODUCT_PICTURE_VIDEO_HEIGHT = 720;
const PRODUCT_PICTURE_EXTRA_CUTOUT_FILE_NAMES = new Set([
  "Chair2A.png",
  "Garland4A3ft.webp",
  "Garland5_4.5ft.avif",
  "Garland5_4.5ftB.avif",
  "Garlands2A5ft.png",
]);
const CURTAIN_COLOR_VARIANT_META: Record<
  string,
  Pick<CustomizeOptionVariant, "label" | "swatch">
> = {
  Beige: {
    label: "Beige",
    swatch: "linear-gradient(135deg, #d7c3aa 0%, #e8dccf 100%)",
  },
  Black: {
    label: "Black",
    swatch: "linear-gradient(135deg, #2e2b30 0%, #5d5960 100%)",
  },
  Champagne: {
    label: "Champagne",
    swatch: "linear-gradient(135deg, #d6b889 0%, #f0e1c0 100%)",
  },
  Darkblue: {
    label: "Dark blue",
    swatch: "linear-gradient(135deg, #203b74 0%, #4d6aa7 100%)",
  },
  Darkgreen: {
    label: "Dark green",
    swatch: "linear-gradient(135deg, #2c5a43 0%, #5d8466 100%)",
  },
  Darkred: {
    label: "Dark red",
    swatch: "linear-gradient(135deg, #7d2930 0%, #b6505c 100%)",
  },
  Green: {
    label: "Green",
    swatch: "linear-gradient(135deg, #4b8c57 0%, #84ba78 100%)",
  },
  Grey: {
    label: "Grey",
    swatch: "linear-gradient(135deg, #868388 0%, #c7c4c9 100%)",
  },
  Ivory: {
    label: "Ivory",
    swatch: "linear-gradient(135deg, #f1ead8 0%, #fff9ea 100%)",
  },
  Lightblue: {
    label: "Light blue",
    swatch: "linear-gradient(135deg, #89b9e4 0%, #d8edf8 100%)",
  },
  LightPink: {
    label: "Light pink",
    swatch: "linear-gradient(135deg, #d59ab8 0%, #f4d5e2 100%)",
  },
  LightYellow: {
    label: "Light yellow",
    swatch: "linear-gradient(135deg, #d9bf59 0%, #f6edba 100%)",
  },
  Pink: {
    label: "Pink",
    swatch: "linear-gradient(135deg, #c96593 0%, #efb4cf 100%)",
  },
  DarkPink: {
    label: "Dark pink",
    swatch: "linear-gradient(135deg, #9f3f72 0%, #cf6d9b 50%, #f0b7d0 100%)",
  },
  Orange: {
    label: "Orange",
    swatch: "linear-gradient(135deg, #db7a27 0%, #f1a94f 48%, #ffd08a 100%)",
  },
  Mango: {
    label: "Mango",
    swatch: "linear-gradient(135deg, #d9811f 0%, #f3b24e 48%, #ffd77a 100%)",
  },
  Teal: {
    label: "Teal",
    swatch: "linear-gradient(135deg, #1f7b78 0%, #47a8a0 52%, #8dd7cf 100%)",
  },
  Purple: {
    label: "Purple",
    swatch: "linear-gradient(135deg, #6f569c 0%, #b79dd5 100%)",
  },
  Red: {
    label: "Red",
    swatch: "linear-gradient(135deg, #b13b3b 0%, #ea8a79 100%)",
  },
  White: {
    label: "White",
    swatch: "linear-gradient(135deg, #f4f4f2 0%, #ffffff 100%)",
  },
  Yellow: {
    label: "Yellow",
    swatch: "linear-gradient(135deg, #d0a732 0%, #f6e27a 100%)",
  },
};

const getProductPictureFolderAssets = (folder: string) => {
  const assets = productPictureManifest[folder];

  if (!assets || assets.length === 0) {
    throw new Error(`Missing product picture assets for folder: ${folder}`);
  }

  return [...assets];
};

const getOrderedProductPictureFolderAssets = (
  folder: string,
  previewFileName?: string,
) => {
  const assets = getProductPictureFolderAssets(folder);

  if (!previewFileName) {
    return assets;
  }

  const previewIndex = assets.findIndex((asset) => asset.fileName === previewFileName);

  if (previewIndex <= 0) {
    return assets;
  }

  const [previewAsset] = assets.splice(previewIndex, 1);

  assets.unshift(previewAsset);

  return assets;
};

const isCutoutProductPictureFile = (fileName: string) =>
  /(photoroom|ezremove|_final)/i.test(fileName) ||
  PRODUCT_PICTURE_EXTRA_CUTOUT_FILE_NAMES.has(fileName);

const createProductPicturePresentation = (
  asset: ProductPictureFile,
): MediaAsset["presentation"] => {
  if (asset.kind === "video") {
    return {
      fit: "cover",
      frameTone: "light",
      scale: 1.04,
      hoverScale: 1.08,
      previewScale: 1.04,
    };
  }

  if (isCutoutProductPictureFile(asset.fileName)) {
    return {
      fit: "contain",
      frameTone: "soft",
      subjectStyle: "cutout",
      scale: 1.04,
      hoverScale: 1.08,
      previewScale: 1.02,
    };
  }

  return {
    fit: "contain",
    frameTone: /\.png$/i.test(asset.fileName) ? "soft" : "light",
  };
};

const createProductPictureAlt = (
  title: string,
  asset: ProductPictureFile,
  index: number,
  total: number,
) => {
  if (asset.kind === "video") {
    return `Video preview of the ${title} option.`;
  }

  if (total === 1) {
    return `${title} option image.`;
  }

  return `${title} image ${index + 1}.`;
};

const createProductPictureMediaAsset = (
  asset: ProductPictureFile,
  title: string,
  index: number,
  total: number,
  posterSrc?: string,
  presentationOverride?: MediaAsset["presentation"],
): MediaAsset => {
  const mergedPresentation = {
    ...createProductPicturePresentation(asset),
    ...presentationOverride,
  };
  const mediaAsset: MediaAsset = {
    src: asset.src,
    alt: createProductPictureAlt(title, asset, index, total),
    width:
      asset.kind === "video"
        ? PRODUCT_PICTURE_VIDEO_WIDTH
        : PRODUCT_PICTURE_IMAGE_WIDTH,
    height:
      asset.kind === "video"
        ? PRODUCT_PICTURE_VIDEO_HEIGHT
        : PRODUCT_PICTURE_IMAGE_HEIGHT,
    presentation: mergedPresentation,
  };

  if (asset.kind === "video") {
    mediaAsset.kind = "video";

    if (posterSrc) {
      mediaAsset.poster = posterSrc;
    }
  }

  return mediaAsset;
};

const createFolderGallery = (
  title: string,
  folder: string,
  previewFileName?: string,
  presentation?: MediaAsset["presentation"],
) => {
  const orderedAssets = getOrderedProductPictureFolderAssets(folder, previewFileName);
  const posterSrc = orderedAssets.find((asset) => asset.kind === "image")?.src;

  return orderedAssets.map((asset, index) =>
    createProductPictureMediaAsset(
      asset,
      title,
      index,
      orderedAssets.length,
      posterSrc,
      presentation,
    ),
  );
};

const createFolderOption = ({
  folder,
  previewFileName,
  presentation,
  ...config
}: ProductPictureOptionConfig): CustomizeOption => {
  const gallery = createFolderGallery(
    config.title,
    folder,
    previewFileName,
    presentation,
  );

  return {
    ...config,
    image: gallery[0],
    ...(gallery.length > 1 ? { gallery } : {}),
  };
};

const createFolderAddOn = ({
  folder,
  previewFileName,
  presentation,
  ...config
}: ProductPictureAddOnConfig): AddOnOption => ({
  ...config,
  image: createFolderGallery(config.title, folder, previewFileName, presentation)[0],
});

const extractGarlandLengthLabel = (folder: string) => {
  const lengthValue = getProductPictureFolderAssets(folder)
    .map((asset) => asset.fileName.match(/(\d+(?:\.\d+)?)ft/i)?.[1] ?? null)
    .find((value): value is string => Boolean(value));

  return lengthValue ? `Approx. ${lengthValue} ft` : "Floral garland";
};

const toKebabCase = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const getCurtainColorToken = (fileName: string) => {
  const match = fileName.match(/^Curtain\d+A(.+?)(?:_\d+x\d+ft)?\.[^.]+$/i);

  return match?.[1] ?? fileName.replace(/\.[^.]+$/, "");
};

const getCurtainVariantMeta = (fileName: string) => {
  const colorToken = getCurtainColorToken(fileName);

  return (
    CURTAIN_COLOR_VARIANT_META[colorToken] ?? {
      label: colorToken,
      swatch: "linear-gradient(135deg, #bca57f 0%, #efe5d7 100%)",
    }
  );
};

const getColorVariantMeta = (label: string) => {
  const normalizedLabel = label.replace(/[^a-z0-9]+/gi, "").toLowerCase();
  const matchingEntry = Object.entries(CURTAIN_COLOR_VARIANT_META).find(
    ([key, meta]) =>
      key.replace(/[^a-z0-9]+/gi, "").toLowerCase() === normalizedLabel ||
      meta.label.replace(/[^a-z0-9]+/gi, "").toLowerCase() === normalizedLabel,
  );

  return (
    matchingEntry?.[1] ?? {
      label,
      swatch: "linear-gradient(135deg, #bca57f 0%, #efe5d7 100%)",
    }
  );
};

const curtainVariants = getOrderedProductPictureFolderAssets(
  "Curtains/Curtains1",
  "Curtain1ABeige_5x10ft.avif",
).map((asset, imageIndex) => {
  const variantMeta = getCurtainVariantMeta(asset.fileName);

  return {
    id: toKebabCase(variantMeta.label),
    label: variantMeta.label,
    swatch: variantMeta.swatch,
    imageIndex,
  };
});

const createExplicitColorVariants = ({
  colorLabels,
  folder,
  previewFileName,
}: {
  colorLabels: readonly string[];
  folder: string;
  previewFileName?: string;
}) => {
  const imageIndexes = getOrderedProductPictureFolderAssets(folder, previewFileName)
    .flatMap((asset, imageIndex) => (asset.kind === "image" ? [imageIndex] : []));
  const fallbackImageIndexes = imageIndexes.length > 0 ? imageIndexes : [0];
  const seenVariantIds = new Set<string>();

  return colorLabels.flatMap((label, colorIndex) => {
    const variantMeta = getColorVariantMeta(label);
    const variantId = toKebabCase(variantMeta.label);

    if (seenVariantIds.has(variantId)) {
      return [];
    }

    seenVariantIds.add(variantId);

    return [
      {
        id: variantId,
        label: variantMeta.label,
        swatch: variantMeta.swatch,
        imageIndex:
          fallbackImageIndexes[colorIndex % fallbackImageIndexes.length],
      },
    ];
  });
};

type GarlandFolderConfig = {
  colors?: readonly string[];
  folder: string;
  id: string;
  presentation: {
    frameAspect: "portrait";
  };
  previewFileName: string;
  title: string;
};

const garlandFolders: readonly GarlandFolderConfig[] = [
  {
    folder: "Garlands/Garlands1",
    id: "garland-1",
    title: "Garland 1",
    previewFileName: "Garldands1A4ft_final.png",
    presentation: {
      frameAspect: "portrait",
    },
  },
  {
    folder: "Garlands/Garlands2",
    id: "garland-2",
    title: "Garland 2",
    previewFileName: "Garlands2A5ft.png",
    presentation: {
      frameAspect: "portrait",
    },
    colors: [
      "Light pink",
      "Red",
      "Green",
      "Dark pink",
      "Yellow",
      "Orange",
      "Yellow",
    ],
  },
  {
    folder: "Garlands/Garlands3",
    id: "garland-3",
    title: "Garland 3",
    previewFileName: "Garlands3A8ft-ezremove.png",
    presentation: {
      frameAspect: "portrait",
    },
    colors: [
      "Light blue",
      "Green",
      "Red",
      "Yellow",
      "Pink",
      "Orange",
      "Teal",
    ],
  },
  {
    folder: "Garlands/Garland4",
    id: "garland-4",
    title: "Garland 4",
    previewFileName: "Garland4A3ft.webp",
    presentation: {
      frameAspect: "portrait",
    },
    colors: ["Green", "Yellow", "Pink", "Orange", "Red"],
  },
  {
    folder: "Garlands/Garland5",
    id: "garland-5",
    title: "Garland 5",
    previewFileName: "Garland5_4.5ft.avif",
    presentation: {
      frameAspect: "portrait",
    },
    colors: ["Yellow", "Orange", "Mango"],
  },
];

export const customizeSteps: CustomizeStep[] = [
  {
    id: "dhol",
    title: "Dhol",
    skippedSummary: "You are not including a dhol in this setup.",
    pricePerDay: 30,
    options: [
      createFolderOption({
        id: "single-ivory",
        folder: "Dhol/Dhol1",
        title: "Ivory embroidered",
        subtitle: "Large premium dhol",
        selectionSummary:
          "You are selecting an ivory embroidered dhol with larger premium proportions and a more heirloom feel.",
        pricePerDay: 30,
        previewFileName: "Dhol1A-Photoroom.png",
      }),
      createFolderOption({
        id: "double-mixed",
        folder: "Dhol/Dhol2",
        title: "Royal blue",
        subtitle: "Large velvet dhol",
        selectionSummary:
          "You are selecting a royal blue dhol with a larger velvet body for a richer focal layer.",
        pricePerDay: 20,
        previewFileName: "Dhol2A-Photoroom.png",
      }),
      createFolderOption({
        id: "mirror-festival",
        folder: "Dhol/Dhol3",
        title: "Wooden multicolored",
        subtitle: "Small dhol (7.5 x 5 inches)",
        selectionSummary:
          "You are selecting a small wooden multicolored dhol for a more compact accent.",
        pricePerDay: 8,
        previewFileName: "Dhol3A-Photoroom.png",
      }),
    ],
  },
  {
    id: "backdrop",
    title: "Backdrop",
    skippedSummary: "You are leaving the setup open without a backdrop frame.",
    pricePerDay: 30,
    options: [
      createFolderOption({
        id: "backdrop-style-1",
        folder: "Backdrop/Backdrop1",
        title: "Black backdrop (10ft x 10ft)",
        subtitle: "Black easy assemble",
        selectionSummary:
          "You are selecting the black easy-assemble backdrop for a clean 10ft x 10ft framing layer.",
        previewFileName: "Backdrop1A-Photoroom.png",
      }),
      createFolderOption({
        id: "backdrop-style-2",
        folder: "Backdrop/Backdrop2",
        title: "Silver backdrop (10ft x 10ft)",
        subtitle: "Silver easy assemble",
        selectionSummary:
          "You are selecting the silver easy-assemble backdrop for a bright 10ft x 10ft framing layer.",
        previewFileName: "Backdrop2A-Photoroom.png",
      }),
    ],
  },
  {
    id: "garlands",
    title: "Garlands",
    skippedSummary: "You are leaving the backdrop without floral garlands.",
    pricePerDay: 2,
    options: garlandFolders.map(
      ({ colors, folder, id, title, previewFileName, presentation }) =>
      createFolderOption({
        id,
        folder,
        title,
        subtitle: extractGarlandLengthLabel(folder),
        selectionSummary: `You are selecting ${title.toLowerCase()} for the floral backdrop layer.`,
        previewFileName,
        presentation,
        ...(colors?.length
          ? {
              variantLabel: "Color",
              variantHint: "Choose a garland color, then add the quantity you need.",
              variants: createExplicitColorVariants({
                colorLabels: colors,
                folder,
                previewFileName,
              }),
            }
          : {}),
      }),
    ),
  },
  {
    id: "curtains",
    title: "Curtains",
    skippedSummary: "You are leaving the backdrop without curtain layering.",
    pricePerDay: 10,
    options: [
      createFolderOption({
        id: "curtain-set",
        folder: "Curtains/Curtains1",
        title: "Curtain set",
        subtitle: "Choose from available colorways",
        selectionSummary:
          "You are selecting the curtain layer and can choose from the real colorways available in the Curtains1 folder.",
        previewFileName: "Curtain1ABeige_5x10ft.avif",
        variantLabel: "Color",
        variantHint:
          "Preview the available curtain colors from the real Curtains1 folder, then add the quantities you need.",
        variants: curtainVariants,
      }),
    ],
  },
  {
    id: "bench",
    title: "Bench",
    skippedSummary: "You are keeping the setup floor-led without a bench.",
    pricePerDay: 20,
    options: [
      createFolderOption({
        id: "cane-bench",
        folder: "Bench/Bench1",
        title: "Boucle bench",
        subtitle: "Rounded and plush",
        selectionSummary:
          "You are adding a boucle bench to anchor the seating pocket with a softer, more plush silhouette.",
        previewFileName: "Bench1A-Photoroom.png",
      }),
      createFolderOption({
        id: "tufted-bench",
        folder: "Bench/Bench2",
        title: "Cream bench",
        subtitle: "Tailored and polished",
        selectionSummary:
          "You are adding a cream bench with slimmer legs for a cleaner, more tailored front-facing seat.",
        previewFileName: "Bench2A-Photoroom.png",
      }),
    ],
  },
  {
    id: "bench-cloth",
    title: "Bench cloth",
    skippedSummary: "You are leaving the bench uncovered without an added cloth layer.",
    pricePerDay: 15,
    options: [
      createFolderOption({
        id: "embroidered-bench-cloth",
        folder: "Bench Cloth/BenchCloth1",
        title: "Embroidered bench cloth",
        subtitle: "Colorful patterned drape",
        selectionSummary:
          "You are adding an embroidered bench cloth to bring in more pattern and color across the seating area.",
        previewFileName: "BenchCloth1A.webp",
      }),
      createFolderOption({
        id: "phulkari-bench-cloth",
        folder: "Bench Cloth/BenchCloth2",
        title: "Phulkari bench cloth",
        subtitle: "Bold embroidered drape",
        selectionSummary:
          "You are adding a phulkari-style bench cloth for brighter color and embroidered detail across the seating area.",
        previewFileName: "BenchCloth2A.webp",
        variantLabel: "Colorway",
        variantHint:
          "Each cloth has its own multicolor mix. Preview the colorway, then add the quantity you need.",
        variants: [
          {
            id: "green-mix",
            label: "Green mix",
            swatch:
              "linear-gradient(135deg, #639545 0%, #ac9445 52%, #9b573e 100%)",
            imageIndex: 0,
          },
          {
            id: "brick-mix",
            label: "Brick mix",
            swatch:
              "linear-gradient(135deg, #965038 0%, #b09a37 52%, #5f3c35 100%)",
            imageIndex: 1,
          },
          {
            id: "rose-mix",
            label: "Rose mix",
            swatch:
              "linear-gradient(135deg, #986c5a 0%, #a69371 52%, #b8ac9c 100%)",
            imageIndex: 2,
          },
          {
            id: "olive-mix",
            label: "Olive mix",
            swatch:
              "linear-gradient(135deg, #4f5444 0%, #937347 48%, #af9d48 100%)",
            imageIndex: 3,
          },
        ],
      }),
    ],
  },
  {
    id: "floor-cushions",
    title: "Floor cushions",
    skippedSummary: "You are leaving the cushion layer out of this draft setup.",
    pricePerDay: 20,
    options: [
      createFolderOption({
        id: "six-cushions",
        folder: "Floor Cushion/Cushion2",
        title: "Vibrant cushion set",
        subtitle: "Set of 5 cushions",
        selectionSummary:
          "You are selecting the vibrant cushion set for a smaller seating pocket.",
        pricePerDay: 10,
        previewFileName: "Cushion2A-Photoroom.png",
      }),
      createFolderOption({
        id: "full-cushion-set",
        folder: "Floor Cushion/Cushion1",
        title: "Decorative round cushion",
        subtitle: "22 inch, rate is for each individual cushion",
        selectionSummary:
          "You are selecting decorative round cushions to build a more layered lounge feel.",
        pricePerDay: 5,
        previewFileName: "LargeCushion1A-Photoroom.png",
        variantLabel: "Color mix",
        variantHint: "Add quantities by color. Rate is for each individual cushion.",
        variants: [
          {
            id: "pink",
            label: "Pink",
            swatch:
              "linear-gradient(135deg, #da6aa4 0%, #f0abc9 48%, #d8a045 100%)",
            imageIndex: 0,
          },
          {
            id: "yellow",
            label: "Yellow",
            swatch:
              "linear-gradient(135deg, #e0b428 0%, #f5d26a 44%, #c7833a 100%)",
            imageIndex: 1,
          },
          {
            id: "blue",
            label: "Blue",
            swatch:
              "linear-gradient(135deg, #4662d9 0%, #7f95eb 44%, #d7b24d 100%)",
            imageIndex: 2,
          },
          {
            id: "orange",
            label: "Orange",
            swatch:
              "linear-gradient(135deg, #e18b34 0%, #f0b35b 44%, #d8645b 100%)",
            imageIndex: 3,
          },
        ],
      }),
    ],
  },
];

export const customizeAddOns: AddOnOption[] = [
  createFolderAddOn({
    id: "upholstered-folding-chair",
    folder: "Extras/Chair/Chair1",
    title: "Upholstered folding chair",
    subtitle: "Padded guest seating",
    selectionSummary:
      "You are adding upholstered folding chairs to extend guest seating with a softer, more refined finish.",
    pricePerDay: 6,
    previewFileName: "Chair1A-Photoroom.png",
  }),
  createFolderAddOn({
    id: "white-folding-chair",
    folder: "Extras/Chair/Chair2",
    title: "White folding chair",
    subtitle: "Classic event seating",
    selectionSummary:
      "You are adding white folding chairs to widen guest seating with a cleaner event-ready look.",
    pricePerDay: 4,
    previewFileName: "Chair2A.png",
  }),
];

export const howItWorksSteps: HowItWorksStep[] = [
  {
    step: "01",
    title: "Tailor the setup",
    detail:
      "Fully customize your Dholki setup to fit your needs and only pay for the items you need, from the exact dhol to backdrop style, garland, and more.",
  },
  {
    step: "02",
    title: "Choose pickup or delivery",
    detail:
      "Select the best way to make your event a success - easy as that!",
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
      "You can pick the standard pre-packaged Dholki package or customize your setup individually by item.",
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
          href: siteConfig.pickupMapUrl,
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
