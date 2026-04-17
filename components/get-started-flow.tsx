"use client";

import Image from "next/image";
import Link from "next/link";
import {
  startTransition,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  bundlePaths,
  customizeAddOns,
  customizeSteps,
  type BundlePath,
  type CustomizeOption,
  type CustomizeStep,
} from "@/lib/site-content";
import {
  encodeDholCartItems,
  type DholCatalogItem,
  type DholCartItem,
} from "@/lib/dhol-checkout";
import dottedLineImage from "@/Dottedline.png";

type PathMode = BundlePath["id"];
type OptionVariantSelectionMap = Record<string, number>;
type OptionSelection = {
  quantity?: number;
  variants?: OptionVariantSelectionMap;
};
type StepSelectionRecord = Record<string, OptionSelection>;
type StepSelection = StepSelectionRecord | "skip" | null;
type SelectionMap = Record<string, StepSelection>;
type AddOnSelectionMap = Record<string, number>;
type ScrollTarget = "flow" | "addons";
type FlowSnapshot = {
  draftSelections: SelectionMap;
  confirmedSelections: SelectionMap;
  addOnSelections: AddOnSelectionMap;
  currentStepIndex: number;
  showAddOns: boolean;
};

const FLOW_SCROLL_OFFSET = 112;
const SIDEBAR_ADDED_STATUS = "Added";
const DECORATIVE_ROUND_CUSHION_OPTION_ID = "full-cushion-set";
const EVENT_PRICING_POLICY =
  "Each event rate covers a 4-day rental window total, including pickup or delivery and return by day 4.";
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const PRICE_PILL_CLASSES =
  "inline-flex rounded-full border border-indigo/10 bg-paper px-3 py-1 text-[0.72rem] uppercase tracking-[0.18em] text-indigo/58";
const OPTION_IMAGE_MOTION_CLASSES =
  "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";
const OPTION_IMAGE_FRAME_TONE_CLASSES = {
  soft: "aspect-[4/3] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(245,241,234,0.96)_62%,rgba(237,231,223,0.94))]",
  light:
    "aspect-[4/3] bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(247,244,239,0.96))]",
  dark: "aspect-[4/3] bg-[radial-gradient(circle_at_top,rgba(111,88,71,0.48),rgba(58,43,34,0.96)_60%,rgba(24,18,16,0.98))] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
} as const;
const OPTION_IMAGE_PREVIEW_STAGE_CLASSES = {
  soft: "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(245,241,234,0.96)_62%,rgba(237,231,223,0.94))]",
  light:
    "bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(247,244,239,0.96))]",
  dark: "bg-[radial-gradient(circle_at_top,rgba(111,88,71,0.48),rgba(58,43,34,0.96)_60%,rgba(24,18,16,0.98))]",
} as const;
const SELECTED_PREVIEW_ZOOM_SCALE = 1.72;

type OptionImageFrameTone = keyof typeof OPTION_IMAGE_FRAME_TONE_CLASSES;
type OptionImageSubjectStyle = "default" | "cutout";
type PreviewZoomState = {
  active: boolean;
  hovered: boolean;
  x: number;
  y: number;
};

type SidebarSummaryChip = {
  label: string;
  swatch?: string;
};

type SidebarSummaryGroup = {
  chips: SidebarSummaryChip[] | null;
  quantityLabel: string | null;
  title: string;
};

type SidebarSummaryState = {
  groups: SidebarSummaryGroup[] | null;
  headline: string | null;
  priceLine: string | null;
  status: string;
  tone: "pending" | "selected" | "skipped";
};

type OptionImagePresentation = {
  frameTone: OptionImageFrameTone;
  subjectStyle: OptionImageSubjectStyle;
  frameClassName: string;
  imageClassName: string;
  imageStyle?: CSSProperties;
  previewImageStyle?: CSSProperties;
  showBackdropImage: boolean;
  backdropClassName: string;
  backdropScrimClassName: string;
  previewStageClassName: string;
  previewImageClassName: string;
  previewBaseScale: number;
  previewTranslateX: string;
  previewTranslateY: string;
};

type OptionMediaProps = {
  asset: CustomizeOption["image"];
  className: string;
  sizes?: string;
  style?: CSSProperties;
  decorative?: boolean;
  withControls?: boolean;
};

type QuantityStepperProps = {
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
  decrementLabel: string;
  incrementLabel: string;
};

function QuantityStepper({
  quantity,
  onDecrement,
  onIncrement,
  decrementLabel,
  incrementLabel,
}: QuantityStepperProps) {
  const buttonClasses =
    "pressable inline-flex h-8 w-8 items-center justify-center rounded-full border border-indigo/10 bg-paper text-lg leading-none text-indigo shadow-[0_14px_30px_-20px_rgba(34,30,71,0.26)] transition hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="inline-flex items-center rounded-full border border-indigo/10 bg-paper p-1 shadow-[0_14px_30px_-22px_rgba(34,30,71,0.22)]">
      <button
        aria-label={decrementLabel}
        className={buttonClasses}
        disabled={quantity <= 0}
        onClick={(event) => {
          event.stopPropagation();
          onDecrement();
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
        type="button"
      >
        <span aria-hidden="true">−</span>
      </button>
      <span className="min-w-8 text-center text-xs font-semibold tabular-nums text-indigo/70">
        {quantity}
      </span>
      <button
        aria-label={incrementLabel}
        className={buttonClasses}
        onClick={(event) => {
          event.stopPropagation();
          onIncrement();
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
        type="button"
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}

const getVideoMimeType = (src: string) => {
  const extension = src.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "webm":
      return "video/webm";
    case "ogg":
    case "ogv":
      return "video/ogg";
    case "mov":
      return "video/quicktime";
    case "m4v":
      return "video/x-m4v";
    default:
      return "video/mp4";
  }
};

const isVideoAsset = (asset: CustomizeOption["image"]) => asset.kind === "video";

function OptionMedia({
  asset,
  className,
  sizes,
  style,
  decorative = false,
  withControls = false,
}: OptionMediaProps) {
  if (isVideoAsset(asset)) {
    return (
      <video
        aria-hidden={decorative || undefined}
        aria-label={decorative ? undefined : asset.alt}
        autoPlay
        className={`absolute inset-0 h-full w-full ${className}`}
        controls={withControls}
        loop
        muted
        playsInline
        poster={asset.poster}
        preload={withControls ? "metadata" : "auto"}
        style={style}
      >
        <source src={asset.src} type={getVideoMimeType(asset.src)} />
        {asset.alt}
      </video>
    );
  }

  return (
    <Image
      alt={decorative ? "" : asset.alt}
      aria-hidden={decorative || undefined}
      className={className}
      fill
      sizes={sizes}
      src={asset.src}
      style={style}
    />
  );
}

const createInitialSelections = (): SelectionMap =>
  customizeSteps.reduce<SelectionMap>((accumulator, step) => {
    accumulator[step.id] = null;
    return accumulator;
  }, {});

const createInitialAddOnSelections = (): AddOnSelectionMap =>
  customizeAddOns.reduce<AddOnSelectionMap>((accumulator, option) => {
    accumulator[option.id] = 0;
    return accumulator;
  }, {});

const scrollToPanel = (element: HTMLDivElement | null) => {
  if (!element) {
    return;
  }

  const top = element.getBoundingClientRect().top + window.scrollY - FLOW_SCROLL_OFFSET;

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: "smooth",
  });
};

const getVariantSelectionCount = (
  variants?: OptionVariantSelectionMap,
) => {
  if (!variants) {
    return 0;
  }

  return Object.values(variants).reduce((sum, quantity) => sum + quantity, 0);
};

const getOptionSelectionQuantity = (selection?: OptionSelection) => {
  const variantQuantity = getVariantSelectionCount(selection?.variants);

  if (variantQuantity > 0) {
    return variantQuantity;
  }

  return selection?.quantity ?? 0;
};

const hasOptionSelection = (selection?: OptionSelection) =>
  getOptionSelectionQuantity(selection) > 0;

const cloneOptionSelection = (selection: OptionSelection): OptionSelection => ({
  ...(typeof selection.quantity === "number"
    ? { quantity: selection.quantity }
    : {}),
  ...(selection.variants ? { variants: { ...selection.variants } } : {}),
});

const cloneStepSelectionRecord = (
  selection: StepSelectionRecord,
): StepSelectionRecord =>
  Object.fromEntries(
    Object.entries(selection).map(([optionId, optionSelection]) => [
      optionId,
      cloneOptionSelection(optionSelection),
    ]),
  );

const getOptionPrice = (step: CustomizeStep, option: CustomizeOption) =>
  option.pricePerDay ?? step.pricePerDay;

const formatEventPrice = (amount: number) =>
  `${currencyFormatter.format(amount)}/event`;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getDefaultOptionImageFit = (image: CustomizeOption["image"]) =>
  image.src.startsWith("/product-pictures/") ? "contain" : "cover";

const isProductPictureAsset = (asset: CustomizeOption["image"]) =>
  asset.src.startsWith("/product-pictures/");

const getDefaultOptionFrameTone = (image: CustomizeOption["image"]) => {
  if (image.src.endsWith(".png")) {
    return "soft";
  }

  return "light";
};

const getDefaultOptionSubjectStyle = (image: CustomizeOption["image"]) =>
  image.src.endsWith(".png") ? "cutout" : "default";

const getOptionImagePresentation = (
  image: CustomizeOption["image"],
): OptionImagePresentation => {
  const fit = image.presentation?.fit ?? getDefaultOptionImageFit(image);
  const frameTone =
    image.presentation?.frameTone ?? getDefaultOptionFrameTone(image);
  const subjectStyle =
    image.presentation?.subjectStyle ?? getDefaultOptionSubjectStyle(image);
  const usesContain = fit === "contain";
  const isCutout = subjectStyle === "cutout";
  const showBackdropImage = usesContain && !isCutout && !isVideoAsset(image);
  const baseScale =
    image.presentation?.scale ??
    (usesContain ? (isCutout ? 1.1 : 1.01) : 1);
  const hoverScale =
    image.presentation?.hoverScale ??
    (usesContain
      ? isCutout
        ? baseScale + 0.05
        : baseScale + 0.02
      : Math.max(baseScale, 1.05));
  const translateX = image.presentation?.translateX ?? "0px";
  const translateY = image.presentation?.translateY ?? "0px";
  const previewBaseScale = image.presentation?.previewScale ?? 1;
  const previewTranslateX = image.presentation?.previewTranslateX ?? translateX;
  const previewTranslateY = image.presentation?.previewTranslateY ?? translateY;
  const imageClassName = [
    usesContain ? "object-contain" : "object-cover",
    "translate-x-[var(--option-image-translate-x)] translate-y-[var(--option-image-translate-y)] scale-[var(--option-image-scale)] group-hover:scale-[var(--option-image-hover-scale)]",
    OPTION_IMAGE_MOTION_CLASSES,
    isCutout
      ? "drop-shadow-[0_22px_34px_rgba(34,30,71,0.18)]"
      : "",
  ]
    .filter(Boolean)
    .join(" ");
  const backdropClassName = [
    "object-cover scale-[1.22]",
    frameTone === "dark"
      ? "blur-2xl opacity-72 saturate-[0.88]"
      : "blur-[26px] opacity-42 saturate-[0.92]",
  ].join(" ");
  const backdropScrimClassName =
    frameTone === "dark"
      ? "absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,191,171,0.22),rgba(54,38,29,0.4)_54%,rgba(16,11,9,0.58))]"
      : "absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.44),rgba(249,246,241,0.74))]";
  const previewImageClassName = [
    `${usesContain ? "object-contain" : "object-cover"} transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform`,
    isCutout ? "drop-shadow-[0_40px_64px_rgba(34,30,71,0.24)]" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    frameTone,
    subjectStyle,
    frameClassName: OPTION_IMAGE_FRAME_TONE_CLASSES[frameTone],
    imageClassName,
    imageStyle: {
      ...(image.presentation?.objectPosition
        ? { objectPosition: image.presentation.objectPosition }
        : {}),
      "--option-image-scale": `${baseScale}`,
      "--option-image-hover-scale": `${hoverScale}`,
      "--option-image-translate-x": translateX,
      "--option-image-translate-y": translateY,
    } as CSSProperties,
    previewImageStyle: image.presentation?.objectPosition
      ? { objectPosition: image.presentation.objectPosition }
      : undefined,
    showBackdropImage,
    backdropClassName,
    backdropScrimClassName,
    previewStageClassName: OPTION_IMAGE_PREVIEW_STAGE_CLASSES[frameTone],
    previewImageClassName,
    previewBaseScale,
    previewTranslateX,
    previewTranslateY,
  };
};

const cloneSelectionMap = (selectionMap: SelectionMap): SelectionMap =>
  Object.fromEntries(
    Object.entries(selectionMap).map(([stepId, selection]) => [
      stepId,
      selection && selection !== "skip"
        ? cloneStepSelectionRecord(selection)
        : selection,
    ]),
  );

const createStandardPresetSelections = (): SelectionMap =>
  customizeSteps.reduce<SelectionMap>((accumulator, step) => {
    const randomOption =
      step.options[Math.floor(Math.random() * step.options.length)];

    accumulator[step.id] = randomOption
      ? {
          [randomOption.id]: randomOption.variants?.[0]
            ? { variants: { [randomOption.variants[0].id]: 1 } }
            : { quantity: 1 },
        }
      : null;

    return accumulator;
  }, {});

const createFlowSnapshot = (mode: PathMode): FlowSnapshot => {
  const draftSelections =
    mode === "standard" ? createStandardPresetSelections() : createInitialSelections();

  return {
    draftSelections,
    confirmedSelections: cloneSelectionMap(draftSelections),
    addOnSelections: createInitialAddOnSelections(),
    currentStepIndex: 0,
    showAddOns: false,
  };
};

const cloneFlowSnapshot = (snapshot: FlowSnapshot): FlowSnapshot => ({
  draftSelections: cloneSelectionMap(snapshot.draftSelections),
  confirmedSelections: cloneSelectionMap(snapshot.confirmedSelections),
  addOnSelections: { ...snapshot.addOnSelections },
  currentStepIndex: snapshot.currentStepIndex,
  showAddOns: snapshot.showAddOns,
});

const getPreferredOptionImageIndex = (
  option: CustomizeOption,
  selection: OptionSelection | undefined,
  explicitImageIndex?: number,
) => {
  if (typeof explicitImageIndex === "number") {
    return explicitImageIndex;
  }

  const selectedVariant = option.variants?.find(
    (variant) => (selection?.variants?.[variant.id] ?? 0) > 0,
  );

  return selectedVariant?.imageIndex ?? 0;
};

const getOptionImages = (option: CustomizeOption) => {
  const galleryImages =
    option.gallery?.filter((asset) => isProductPictureAsset(asset)) ?? [];

  if (galleryImages.length > 0) {
    return galleryImages;
  }

  return [option.image];
};

type GetStartedFlowProps = {
  initialMode?: BundlePath["id"];
  liveDholCatalog?: DholCatalogItem[];
};

export function GetStartedFlow({
  initialMode = "customize",
  liveDholCatalog = [],
}: GetStartedFlowProps) {
  const [initialSnapshot] = useState<FlowSnapshot>(() =>
    createFlowSnapshot(initialMode),
  );
  const [mode, setMode] = useState<PathMode>(initialMode);
  const [currentStepIndex, setCurrentStepIndex] = useState(
    initialSnapshot.currentStepIndex,
  );
  const [showAddOns, setShowAddOns] = useState(initialSnapshot.showAddOns);
  const [draftSelections, setDraftSelections] = useState<SelectionMap>(() =>
    cloneSelectionMap(initialSnapshot.draftSelections),
  );
  const [confirmedSelections, setConfirmedSelections] = useState<SelectionMap>(() =>
    cloneSelectionMap(initialSnapshot.confirmedSelections),
  );
  const [optionImageIndexes, setOptionImageIndexes] = useState<Record<string, number>>(
    {},
  );
  const [activeVariantIds, setActiveVariantIds] = useState<Record<string, string>>(
    {},
  );
  const [primedVariantOptionIds, setPrimedVariantOptionIds] = useState<
    Record<string, boolean>
  >({});
  const [variantSelectionErrors, setVariantSelectionErrors] = useState<
    Record<string, boolean>
  >({});
  const [addOnSelections, setAddOnSelections] = useState<AddOnSelectionMap>(() =>
    ({ ...initialSnapshot.addOnSelections }),
  );
  const [previewOptionIds, setPreviewOptionIds] = useState<Record<string, string>>(
    {},
  );
  const [previewMotionDirection, setPreviewMotionDirection] = useState<-1 | 1>(1);
  const [previewZoomState, setPreviewZoomState] = useState<PreviewZoomState>({
    active: false,
    hovered: false,
    x: 0.5,
    y: 0.5,
  });
  const [showEventPricingPolicy, setShowEventPricingPolicy] = useState(false);
  const [scrollKey, setScrollKey] = useState(0);
  const flowPanelRef = useRef<HTMLDivElement | null>(null);
  const addOnsRef = useRef<HTMLDivElement | null>(null);
  const sidebarScrollRef = useRef<HTMLDivElement | null>(null);
  const sidebarStickySummaryRef = useRef<HTMLDivElement | null>(null);
  const sidebarStepRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const sidebarAddOnsRef = useRef<HTMLButtonElement | null>(null);
  const pendingScrollTargetRef = useRef<ScrollTarget | null>(null);
  const dholCatalogById = new Map(
    liveDholCatalog.map((item) => [item.id, item] as const),
  );
  const getLiveDholItem = (optionId: string) => dholCatalogById.get(optionId) ?? null;
  const getResolvedOptionPrice = (step: CustomizeStep, option: CustomizeOption) =>
    step.id === "dhol"
      ? getLiveDholItem(option.id)?.unitAmount ?? getOptionPrice(step, option)
      : getOptionPrice(step, option);
  const getResolvedSelectionTotal = (
    step: CustomizeStep,
    selection: StepSelection,
  ) => {
    if (!selection || selection === "skip") {
      return 0;
    }

    return step.options.reduce((sum, option) => {
      const quantity = getOptionSelectionQuantity(selection[option.id]);

      if (quantity <= 0 || isDholOptionGloballyUnavailable(step, option)) {
        return sum;
      }

      return sum + getResolvedOptionPrice(step, option) * quantity;
    }, 0);
  };
  const getResolvedSelectionCount = (
    step: CustomizeStep,
    selection: StepSelection,
  ) => {
    if (!selection || selection === "skip") {
      return 0;
    }

    return step.options.reduce((sum, option) => {
      if (isDholOptionGloballyUnavailable(step, option)) {
        return sum;
      }

      return sum + getOptionSelectionQuantity(selection[option.id]);
    }, 0);
  };
  const isDholOptionGloballyUnavailable = (
    step: CustomizeStep,
    option: CustomizeOption,
  ) => {
    if (step.id !== "dhol") {
      return false;
    }

    const liveItem = getLiveDholItem(option.id);

    return Boolean(liveItem && (!liveItem.active || liveItem.inventoryCount <= 0));
  };
  const customSnapshotRef = useRef<FlowSnapshot | null>(
    initialMode === "customize" ? cloneFlowSnapshot(initialSnapshot) : null,
  );
  const standardSnapshotRef = useRef<FlowSnapshot | null>(
    initialMode === "standard" ? cloneFlowSnapshot(initialSnapshot) : null,
  );

  const hasStandardPath = bundlePaths.some((path) => path.id === "standard");

  useEffect(() => {
    if (!pendingScrollTargetRef.current) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const targetElement =
        pendingScrollTargetRef.current === "addons"
          ? addOnsRef.current
          : flowPanelRef.current;

      scrollToPanel(targetElement);
      pendingScrollTargetRef.current = null;
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [scrollKey]);

  const completedCount = customizeSteps.filter(
    (step) => confirmedSelections[step.id] !== null,
  ).length;
  const selectedAddOns = customizeAddOns.filter(
    (option) => (addOnSelections[option.id] ?? 0) > 0,
  );
  const selectedAddOnsCount = selectedAddOns.reduce(
    (sum, option) => sum + (addOnSelections[option.id] ?? 0),
    0,
  );
  const currentStep = customizeSteps[currentStepIndex];
  const currentSelectionState = draftSelections[currentStep.id];
  const currentSelectionMap =
    currentSelectionState && currentSelectionState !== "skip"
      ? currentSelectionState
      : null;
  const selectedCurrentOptions = currentStep.options.filter(
    (option) =>
      hasOptionSelection(currentSelectionMap?.[option.id]) &&
      !isDholOptionGloballyUnavailable(currentStep, option),
  );
  const canAdvanceCurrentStep =
    currentSelectionState === "skip" ||
    getResolvedSelectionCount(currentStep, currentSelectionState) > 0;
  const lastStepIndex = customizeSteps.length - 1;
  const isLastStep = currentStepIndex === lastStepIndex;
  const getEffectiveSelection = (stepId: string) => draftSelections[stepId];
  const coreSubtotal = customizeSteps.reduce(
    (sum, step) =>
      sum + getResolvedSelectionTotal(step, getEffectiveSelection(step.id)),
    0,
  );
  const addOnsSubtotal = selectedAddOns.reduce(
    (sum, option) => sum + option.pricePerDay * (addOnSelections[option.id] ?? 0),
    0,
  );
  const subtotal = coreSubtotal + addOnsSubtotal;
  const addOnsStatus =
    selectedAddOnsCount > 0 ? SIDEBAR_ADDED_STATUS : "Pending";
  const dholStep = customizeSteps.find((step) => step.id === "dhol") ?? null;
  const dholSelection = dholStep ? getEffectiveSelection(dholStep.id) : null;
  const dholCheckoutItems =
    dholStep && dholSelection && dholSelection !== "skip"
      ? dholStep.options.reduce<DholCartItem[]>((items, option) => {
          const quantity = getOptionSelectionQuantity(dholSelection[option.id]);

          if (
            quantity <= 0 ||
            isDholOptionGloballyUnavailable(dholStep, option)
          ) {
            return items;
          }

          items.push({
            id: option.id,
            quantity,
          });

          return items;
        }, [])
      : [];
  const dholCheckoutHref =
    dholCheckoutItems.length > 0
      ? `/checkout?${new URLSearchParams({
          items: encodeDholCartItems(dholCheckoutItems),
        }).toString()}`
      : null;
  const hasSelectionsOutsideDhol =
    selectedAddOnsCount > 0 ||
    customizeSteps.some(
      (step) =>
        step.id !== "dhol" &&
        getResolvedSelectionCount(step, getEffectiveSelection(step.id)) > 0,
    );
  const showDirectDholCheckoutCta = Boolean(
    dholCheckoutHref && !hasSelectionsOutsideDhol,
  );
  const availabilityCheckoutHref = subtotal > 0 ? "/availability" : null;
  const checkoutCtaHref = showDirectDholCheckoutCta
    ? dholCheckoutHref
    : availabilityCheckoutHref;
  const currentProgressIndex = showAddOns ? null : currentStepIndex;
  const progressStepCount = customizeSteps.length;
  const useCompactProgressTrack = progressStepCount >= 11;
  const modeHelperCopy =
    mode === "standard"
      ? "Items are pre-selected based on a recommended standard setup."
      : "Customize your setup by adding the items you need.";

  useEffect(() => {
    const scrollContainer = sidebarScrollRef.current;

    if (!scrollContainer) {
      return;
    }

    const activeStepId = customizeSteps[currentStepIndex]?.id;

    const activeSidebarItem = showAddOns
      ? sidebarAddOnsRef.current
      : activeStepId
        ? sidebarStepRefs.current[activeStepId]
        : null;

    if (!activeSidebarItem) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const stickySummaryHeight = sidebarStickySummaryRef.current?.offsetHeight ?? 0;
      const containerRect = scrollContainer.getBoundingClientRect();
      const targetRect = activeSidebarItem.getBoundingClientRect();
      const currentScrollTop = scrollContainer.scrollTop;
      const topOffset = 0;
      const nextScrollTop = Math.max(
        0,
        targetRect.top - containerRect.top + currentScrollTop - stickySummaryHeight - topOffset,
      );

      if (Math.abs(nextScrollTop - currentScrollTop) < 8) {
        return;
      }

      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth";

      scrollContainer.scrollTo({
        top: nextScrollTop,
        behavior,
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [currentStepIndex, showAddOns, checkoutCtaHref, showEventPricingPolicy]);

  const previewedCurrentOption =
    currentStep.options.find(
      (option) => option.id === previewOptionIds[currentStep.id],
    ) ?? null;
  const selectedPreviewOption =
    previewedCurrentOption ?? selectedCurrentOptions[0] ?? null;
  const selectedPreviewImages = selectedPreviewOption
    ? getOptionImages(selectedPreviewOption)
    : [];
  const selectedPreviewImageIndex = selectedPreviewOption
    ? getPreferredOptionImageIndex(
        selectedPreviewOption,
        currentSelectionMap?.[selectedPreviewOption.id],
        optionImageIndexes[selectedPreviewOption.id],
      )
    : 0;
  const selectedPreviewImage = selectedPreviewOption
    ? selectedPreviewImages[selectedPreviewImageIndex] ?? selectedPreviewImages[0]
    : null;
  const selectedPreviewHasGallery = selectedPreviewImages.length > 1;
  const selectedPreviewPresentation = selectedPreviewImage
    ? getOptionImagePresentation(selectedPreviewImage)
    : null;
  const selectedPreviewCanZoom = Boolean(
    selectedPreviewImage && !isVideoAsset(selectedPreviewImage),
  );
  const selectedPreviewMotionClassName =
    previewMotionDirection === 1
      ? "selected-preview-shift-next"
      : "selected-preview-shift-prev";
  const selectedPreviewImageStyle =
    selectedPreviewPresentation && selectedPreviewImage
      ? {
          ...(selectedPreviewPresentation.previewImageStyle ?? {}),
          transform: `translate(${selectedPreviewPresentation.previewTranslateX}, ${selectedPreviewPresentation.previewTranslateY}) scale(${
            selectedPreviewPresentation.previewBaseScale *
            (previewZoomState.active && selectedPreviewCanZoom
              ? SELECTED_PREVIEW_ZOOM_SCALE
              : 1)
          })`,
          transformOrigin: `${previewZoomState.x * 100}% ${previewZoomState.y * 100}%`,
        }
      : undefined;

  const queueScroll = (target: ScrollTarget) => {
    pendingScrollTargetRef.current = target;
    setScrollKey((currentKey) => currentKey + 1);
  };

  const captureCurrentSnapshot = (): FlowSnapshot => ({
    draftSelections: cloneSelectionMap(draftSelections),
    confirmedSelections: cloneSelectionMap(confirmedSelections),
    addOnSelections: { ...addOnSelections },
    currentStepIndex,
    showAddOns,
  });

  const applySnapshot = (snapshot: FlowSnapshot) => {
    setDraftSelections(cloneSelectionMap(snapshot.draftSelections));
    setConfirmedSelections(cloneSelectionMap(snapshot.confirmedSelections));
    setAddOnSelections({ ...snapshot.addOnSelections });
    setPrimedVariantOptionIds({});
    setVariantSelectionErrors({});
    setCurrentStepIndex(snapshot.currentStepIndex);
    setShowAddOns(snapshot.showAddOns);
  };

  const cycleOptionImage = (
    optionId: string,
    imageCount: number,
    direction: -1 | 1,
  ) => {
    if (imageCount <= 1) {
      return;
    }

    setPreviewMotionDirection(direction);
    setPreviewZoomState((currentZoomState) => ({
      ...currentZoomState,
      active: false,
    }));
    setPreviewOptionIds((currentPreviewOptionIds) => ({
      ...currentPreviewOptionIds,
      [currentStep.id]: optionId,
    }));
    setOptionImageIndexes((currentIndexes) => {
      const currentIndex = currentIndexes[optionId] ?? 0;
      const nextIndex = (currentIndex + direction + imageCount) % imageCount;

      return {
        ...currentIndexes,
        [optionId]: nextIndex,
      };
    });
  };

  const handleSelectableCardKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    onSelect: () => void,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  };

  const updateSelectedPreviewZoom = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (!selectedPreviewCanZoom || !previewZoomState.active) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();

    if (bounds.width <= 0 || bounds.height <= 0) {
      return;
    }

    const x = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
    const y = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);

    setPreviewZoomState({
      active: true,
      hovered: true,
      x,
      y,
    });
  };

  const resetSelectedPreviewZoom = () => {
    setPreviewZoomState((currentZoomState) => ({
      ...currentZoomState,
      active: false,
      hovered: false,
    }));
  };

  const handleSelectedPreviewPointerEnter = () => {
    if (!selectedPreviewCanZoom) {
      return;
    }

    setPreviewZoomState((currentZoomState) => ({
      ...currentZoomState,
      hovered: true,
    }));
  };

  const handleSelectedPreviewPointerLeave = () => {
    setPreviewZoomState((currentZoomState) => ({
      ...currentZoomState,
      active: false,
      hovered: false,
    }));
  };

  const toggleSelectedPreviewZoom = (
    event: ReactMouseEvent<HTMLDivElement> | ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (!selectedPreviewCanZoom) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();

    if (bounds.width <= 0 || bounds.height <= 0) {
      return;
    }

    const x = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
    const y = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);

    setPreviewZoomState((currentZoomState) => ({
      active: !currentZoomState.active,
      hovered: true,
      x,
      y,
    }));
  };

  const selectionStateForStep = (stepId: string): SidebarSummaryState => {
    const step = customizeSteps.find((item) => item.id === stepId);
    const selection = getEffectiveSelection(stepId);

    if (!step || selection === null) {
      return {
        status: "Pending",
        tone: "pending" as const,
        headline: null,
        groups: null,
        priceLine: null,
      };
    }

    if (selection === "skip") {
      return {
        status: "Skipped",
        tone: "skipped" as const,
        headline: step.skippedSummary,
        groups: null,
        priceLine: null,
      };
    }

    const selectedOptions = step.options.filter(
      (option) =>
        hasOptionSelection(selection[option.id]) &&
        !isDholOptionGloballyUnavailable(step, option),
    );
    const selectedCount = getResolvedSelectionCount(step, selection);
    const total = getResolvedSelectionTotal(step, selection);

    if (selectedOptions.length === 0 || selectedCount === 0) {
      return {
        status: "Pending",
        tone: "pending" as const,
        headline: null,
        groups: null,
        priceLine: null,
      };
    }

    const groups: SidebarSummaryGroup[] = selectedOptions.map((option) => {
      const optionSelection = selection[option.id];
      const quantity = getOptionSelectionQuantity(optionSelection);
      const chips =
        option.variants
          ?.filter((variant) => (optionSelection?.variants?.[variant.id] ?? 0) > 0)
          .map((variant) => {
            const variantQuantity = optionSelection?.variants?.[variant.id] ?? 0;

            return {
              label:
                variantQuantity > 1
                  ? `${variant.label} ×${variantQuantity}`
                  : variant.label,
              swatch: variant.swatch,
            };
          }) ?? [];

      return {
        chips: chips.length > 0 ? chips : null,
        quantityLabel:
          chips.length > 0
            ? `${quantity} selected`
            : quantity > 1
              ? `×${quantity}`
              : "Selected",
        title: option.title,
      };
    });

    return {
      status: SIDEBAR_ADDED_STATUS,
      tone: "selected" as const,
      groups,
      headline: null,
      priceLine: `${selectedCount} selected • ${formatEventPrice(total)}`,
    };
  };

  const jumpToStep = (stepIndex: number) => {
    resetSelectedPreviewZoom();
    startTransition(() => {
      setShowAddOns(false);
      setCurrentStepIndex(stepIndex);
    });

    queueScroll("flow");
  };

  const jumpToAddOns = () => {
    resetSelectedPreviewZoom();
    startTransition(() => {
      setShowAddOns(true);
    });

    queueScroll("addons");
  };

  const switchMode = (nextMode: PathMode) => {
    if (nextMode === mode) {
      return;
    }

    const currentSnapshot = captureCurrentSnapshot();

    if (mode === "standard") {
      standardSnapshotRef.current = currentSnapshot;
    } else {
      customSnapshotRef.current = currentSnapshot;
    }

    const savedSnapshot =
      nextMode === "standard"
        ? standardSnapshotRef.current
        : customSnapshotRef.current;
    const nextSnapshot = cloneFlowSnapshot(savedSnapshot ?? createFlowSnapshot(nextMode));

    if (nextMode === "standard") {
      standardSnapshotRef.current = cloneFlowSnapshot(nextSnapshot);
    } else {
      customSnapshotRef.current = cloneFlowSnapshot(nextSnapshot);
    }

    resetSelectedPreviewZoom();
    startTransition(() => {
      setMode(nextMode);
      applySnapshot(nextSnapshot);
    });
  };

  const focusOptionPreview = (
    stepId: string,
    optionId: string,
    imageIndex?: number,
  ) => {
    setPreviewMotionDirection(1);
    resetSelectedPreviewZoom();
    setPreviewOptionIds((currentPreviewOptionIds) => ({
      ...currentPreviewOptionIds,
      [stepId]: optionId,
    }));

    if (typeof imageIndex === "number") {
      setOptionImageIndexes((currentIndexes) => ({
        ...currentIndexes,
        [optionId]: imageIndex,
      }));
    }
  };

  const updateStepOptionQuantity = (
    stepId: string,
    optionId: string,
    adjustQuantity: (currentQuantity: number) => number,
  ) => {
    focusOptionPreview(stepId, optionId);
    setDraftSelections((currentSelections) => {
      const existingSelection = currentSelections[stepId];
      const selectionMap =
        existingSelection && existingSelection !== "skip"
          ? cloneStepSelectionRecord(existingSelection)
          : {};
      const optionSelection = selectionMap[optionId]
        ? cloneOptionSelection(selectionMap[optionId])
        : {};
      const currentQuantity = optionSelection.quantity ?? 0;
      const nextQuantity = Math.max(0, adjustQuantity(currentQuantity));

      if (nextQuantity <= 0) {
        delete optionSelection.quantity;
      } else {
        optionSelection.quantity = nextQuantity;
      }

      if (hasOptionSelection(optionSelection)) {
        selectionMap[optionId] = optionSelection;
      } else {
        delete selectionMap[optionId];
      }

      const hasSelections = Object.values(selectionMap).some(hasOptionSelection);

      return {
        ...currentSelections,
        [stepId]: hasSelections ? selectionMap : null,
      };
    });
  };

  const updateStepOptionVariantQuantity = (
    stepId: string,
    option: CustomizeOption,
    variantId: string,
    imageIndex: number | undefined,
    adjustQuantity: (currentQuantity: number) => number,
  ) => {
    focusOptionPreview(stepId, option.id, imageIndex);
    setActiveVariantIds((currentActiveVariantIds) => ({
      ...currentActiveVariantIds,
      [option.id]: variantId,
    }));
    setDraftSelections((currentSelections) => {
      const existingSelection = currentSelections[stepId];
      const selectionMap =
        existingSelection && existingSelection !== "skip"
          ? cloneStepSelectionRecord(existingSelection)
          : {};
      const optionSelection = selectionMap[option.id]
        ? cloneOptionSelection(selectionMap[option.id])
        : {};
      const variantSelections = { ...(optionSelection.variants ?? {}) };
      const currentQuantity = variantSelections[variantId] ?? 0;
      const nextQuantity = Math.max(0, adjustQuantity(currentQuantity));

      if (nextQuantity <= 0) {
        delete variantSelections[variantId];
      } else {
        variantSelections[variantId] = nextQuantity;
      }

      delete optionSelection.quantity;

      if (Object.keys(variantSelections).length > 0) {
        optionSelection.variants = variantSelections;
      } else {
        delete optionSelection.variants;
      }

      if (hasOptionSelection(optionSelection)) {
        selectionMap[option.id] = optionSelection;
      } else {
        delete selectionMap[option.id];
      }

      const hasSelections = Object.values(selectionMap).some(hasOptionSelection);

      return {
        ...currentSelections,
        [stepId]: hasSelections ? selectionMap : null,
      };
    });
  };

  const handleSelect = (stepId: string, option: CustomizeOption) => {
    updateStepOptionQuantity(stepId, option.id, (currentQuantity) =>
      currentQuantity > 0 ? 0 : 1,
    );
  };

  const handleSkip = () => {
    resetSelectedPreviewZoom();
    startTransition(() => {
      setDraftSelections((currentSelections) => ({
        ...currentSelections,
        [currentStep.id]: "skip",
      }));
      setConfirmedSelections((currentSelections) => ({
        ...currentSelections,
        [currentStep.id]: "skip",
      }));

      if (!isLastStep) {
        setCurrentStepIndex(currentStepIndex + 1);
        setShowAddOns(false);
      }
    });

    queueScroll(isLastStep ? "addons" : "flow");
  };

  const handleNextStep = () => {
    if (!canAdvanceCurrentStep) {
      return;
    }

    startTransition(() => {
      setConfirmedSelections((currentSelections) => ({
        ...currentSelections,
        [currentStep.id]: currentSelectionState,
      }));
    });

    if (isLastStep) {
      jumpToAddOns();
      return;
    }

    jumpToStep(currentStepIndex + 1);
  };

  const updateAddOnQuantity = (
    optionId: string,
    adjustQuantity: (currentQuantity: number) => number,
  ) => {
    setAddOnSelections((currentSelections) => {
      const currentQuantity = currentSelections[optionId] ?? 0;
      const nextQuantity = Math.max(0, adjustQuantity(currentQuantity));

      return {
        ...currentSelections,
        [optionId]: nextQuantity,
      };
    });
  };

  const toggleAddOn = (optionId: string) => {
    updateAddOnQuantity(optionId, (currentQuantity) =>
      currentQuantity > 0 ? 0 : 1,
    );
  };

  const handleAddOnsCardClick = () => {
    jumpToAddOns();
  };

  return (
    <div className="relative space-y-8">
      <section className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="flex items-center">
          <div className="flex w-full items-center rounded-full border border-ink/10 bg-paper/70 p-1 shadow-[0_18px_42px_-36px_rgba(34,30,71,0.22)] backdrop-blur">
            <button
              aria-pressed={mode === "customize"}
              className={`pressable inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold tracking-[-0.01em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
                mode === "customize"
                  ? "bg-indigo text-paper shadow-[0_14px_28px_-20px_rgba(34,30,71,0.5)]"
                  : "text-ink/68 hover:bg-cream"
              }`}
              onClick={() => switchMode("customize")}
              type="button"
            >
              Custom
            </button>
            {hasStandardPath ? (
              <button
                aria-pressed={mode === "standard"}
                className={`pressable inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold tracking-[-0.01em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
                  mode === "standard"
                    ? "bg-indigo text-paper shadow-[0_14px_28px_-20px_rgba(34,30,71,0.5)]"
                    : "text-ink/68 hover:bg-cream"
                }`}
                onClick={() => switchMode("standard")}
                type="button"
              >
                Standard Package
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex items-center xl:justify-end">
          <div className="w-full max-w-3xl rounded-[1.7rem] border border-ink/10 bg-paper/70 px-5 py-3 text-sm leading-7 text-ink/70 shadow-[0_18px_42px_-36px_rgba(34,30,71,0.18)] backdrop-blur">
            {modeHelperCopy}
          </div>
        </div>

        <aside className="xl:sticky xl:top-28 xl:self-start">
          <div className="overflow-hidden rounded-[2.2rem] border border-ink/8 bg-cream shadow-[0_30px_90px_-58px_rgba(34,30,71,0.36)]">
            <div className="pb-1.5 pl-1.5 pr-0.5 pt-1.5">
              <div
                className="tailored-scroll relative rounded-[1.9rem] xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto"
                ref={sidebarScrollRef}
              >
                <div className="p-5 xl:pb-[44vh] xl:pr-4">
                  <div
                    className="sticky top-0 z-20 -mx-5 bg-cream/96 px-5 pt-1 backdrop-blur-sm xl:pr-4"
                    ref={sidebarStickySummaryRef}
                  >
                    <div className="rounded-[1.7rem] border border-indigo/10 bg-paper px-4 py-4 shadow-[0_18px_45px_-38px_rgba(34,30,71,0.3)]">
                      <p className="text-[0.62rem] uppercase tracking-[0.24em] text-indigo/48">
                        Live total
                      </p>
                      <div className="mt-2">
                        <div>
                          <p className="flex items-end whitespace-nowrap font-display leading-[0.92] tracking-[-0.05em] text-indigo">
                            <span className="text-[2.56rem] sm:text-[2.84rem]">
                              {currencyFormatter.format(subtotal)}
                            </span>
                            <span className="relative mb-[0.04em] ml-[0.04em] inline-block pr-4 text-[2.18rem] tracking-[-0.04em] sm:text-[2.46rem]">
                              /event
                              <button
                                aria-controls="event-pricing-policy"
                                aria-expanded={showEventPricingPolicy}
                                aria-label="Show event pricing policy"
                                className="absolute right-0 top-[0.42rem] inline-flex h-3.5 w-3.5 items-center justify-center text-indigo/32 transition hover:text-indigo/52 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:top-[0.48rem] sm:h-4 sm:w-4"
                                onClick={() =>
                                  setShowEventPricingPolicy((currentValue) => !currentValue)
                                }
                                type="button"
                              >
                                <svg
                                  aria-hidden="true"
                                  className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                                  fill="none"
                                  viewBox="0 0 16 16"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <circle
                                    cx="8"
                                    cy="8"
                                    r="5.4"
                                    stroke="currentColor"
                                    strokeWidth="1.1"
                                  />
                                  <circle cx="8" cy="5.15" r="0.7" fill="currentColor" />
                                  <path
                                    d="M8 7.1V10.8"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeWidth="1.1"
                                  />
                                </svg>
                              </button>
                            </span>
                          </p>
                          {showEventPricingPolicy ? (
                            <div
                              className="mt-3 rounded-[1.15rem] border border-indigo/10 bg-cream px-3 py-3 text-sm leading-6 text-ink/66"
                              id="event-pricing-policy"
                            >
                              {EVENT_PRICING_POLICY}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    {checkoutCtaHref ? (
                      <Link
                        className="pressable mt-4 inline-flex w-full items-center justify-center rounded-full bg-marigold px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-18px_rgba(17,17,17,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                        href={checkoutCtaHref}
                      >
                        Proceed to Checkout
                      </Link>
                    ) : null}
                    <div
                      className={`mt-4 w-full overflow-hidden rounded-full border border-indigo/10 bg-paper/94 py-3 shadow-[0_20px_40px_-34px_rgba(34,30,71,0.35)] backdrop-blur ${
                        useCompactProgressTrack ? "px-3 sm:px-4" : "px-5"
                      }`}
                    >
                      <div
                        className={`flex items-center justify-between ${
                          useCompactProgressTrack ? "gap-1.5 sm:gap-2" : "gap-2 sm:gap-2.5"
                        }`}
                      >
                        {customizeSteps.map((step, index) => {
                          const dotClasses =
                            index < completedCount
                              ? useCompactProgressTrack
                                ? "h-2 w-2 border-mehendi bg-mehendi shadow-[0_0_0_3px_rgba(11,123,76,0.08)] sm:h-2.5 sm:w-2.5 sm:shadow-[0_0_0_4px_rgba(11,123,76,0.08)]"
                                : "h-2.5 w-2.5 border-mehendi bg-mehendi shadow-[0_0_0_4px_rgba(11,123,76,0.08)] sm:h-3 sm:w-3"
                              : index === currentProgressIndex
                                ? useCompactProgressTrack
                                  ? "h-2 w-2 border-indigo/24 bg-paper shadow-[0_0_0_4px_rgba(34,30,71,0.07)] after:absolute after:left-1/2 after:top-1/2 after:h-[0.3rem] after:w-[0.3rem] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-indigo after:content-[''] sm:h-2.5 sm:w-2.5 sm:shadow-[0_0_0_5px_rgba(34,30,71,0.07)] sm:after:h-[0.34rem] sm:after:w-[0.34rem]"
                                  : "h-2.5 w-2.5 border-indigo/24 bg-paper shadow-[0_0_0_5px_rgba(34,30,71,0.07)] after:absolute after:left-1/2 after:top-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-indigo after:content-[''] sm:h-3 sm:w-3 sm:after:h-1.5 sm:after:w-1.5"
                                : useCompactProgressTrack
                                  ? "h-1.5 w-1.5 border-indigo/12 bg-paper sm:h-2 sm:w-2"
                                  : "h-2 w-2 border-indigo/12 bg-paper sm:h-2.5 sm:w-2.5";

                          return (
                            <span
                              aria-hidden="true"
                              className={`relative block shrink-0 rounded-full border transition-all duration-300 ${dotClasses}`}
                              key={`sidebar-progress-${step.id}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                    <div
                      aria-hidden="true"
                      className="h-8 bg-[linear-gradient(180deg,rgba(249,248,244,0.98),rgba(249,248,244,0.94)_54%,rgba(249,248,244,0))]"
                    />
                  </div>

                  <div className="mt-8 space-y-3">
                    {customizeSteps.map((step, index) => {
                      const summary = selectionStateForStep(step.id);
                      const active = !showAddOns && index === currentStepIndex;

                      const itemClasses = active
                        ? "border-[rgba(34,30,71,0.34)] bg-[linear-gradient(180deg,rgba(11,123,76,0.08),rgba(249,248,244,0.98))] shadow-[0_18px_40px_-34px_rgba(34,30,71,0.3)]"
                        : summary.tone === "selected"
                          ? "border-mehendi/16 bg-paper shadow-[0_18px_40px_-34px_rgba(34,30,71,0.16)]"
                          : summary.tone === "skipped"
                            ? "border-dashed border-ink/18 bg-paper/72 hover:border-ink/24"
                            : "border-ink/8 bg-paper/76 hover:border-indigo/16";

                      const badgeClasses = active
                        ? "border-indigo/10 bg-indigo text-paper"
                        : summary.tone === "selected"
                          ? "border-mehendi bg-mehendi text-paper"
                          : summary.tone === "skipped"
                            ? "border-ink/10 bg-paper text-ink/58"
                            : "border-ink/8 bg-paper text-ink/55";

                      const badgeLabel = active ? "Current" : summary.status;

                      return (
                        <button
                          className={`pressable w-full rounded-[1.6rem] border px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${itemClasses}`}
                          key={step.id}
                          onClick={() => jumpToStep(index)}
                          ref={(element) => {
                            sidebarStepRefs.current[step.id] = element;
                          }}
                          type="button"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-[1.35rem] font-semibold leading-[1.02] tracking-[-0.03em] text-indigo">
                              {step.title}
                            </p>
                            <span
                              className={`rounded-full border px-2 py-1 text-[0.58rem] uppercase tracking-[0.2em] ${badgeClasses}`}
                            >
                              {badgeLabel}
                            </span>
                          </div>

                          {summary.headline && summary.tone !== "skipped" ? (
                            <p
                              className={`mt-3 ${
                                summary.tone === "selected"
                                  ? "text-[0.98rem] font-medium leading-6 text-indigo/86"
                                  : "text-sm leading-6 text-ink/68"
                              }`}
                            >
                              {summary.headline}
                            </p>
                          ) : null}

                          {summary.tone === "selected" && summary.groups?.length ? (
                            <div className="mt-3 space-y-2.5">
                              {summary.groups.map((group) => (
                                <div
                                  className="rounded-[1.1rem] border border-indigo/10 bg-cream/90 px-3 py-2.5"
                                  key={`${step.id}-${group.title}`}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <p className="text-[0.86rem] font-medium leading-5 text-indigo/84">
                                      {group.title}
                                    </p>
                                    {group.quantityLabel ? (
                                      <span className="shrink-0 rounded-full border border-indigo/10 bg-paper px-2 py-1 text-[0.58rem] font-medium uppercase tracking-[0.18em] text-indigo/52">
                                        {group.quantityLabel}
                                      </span>
                                    ) : null}
                                  </div>
                                  {group.chips?.length ? (
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                      {group.chips.map((chip) => (
                                        <span
                                          className="inline-flex items-center gap-2 rounded-full border border-indigo/10 bg-paper px-2.5 py-1 text-[0.64rem] font-medium uppercase tracking-[0.14em] text-indigo/62"
                                          key={`${step.id}-${group.title}-${chip.label}`}
                                        >
                                          {chip.swatch ? (
                                            <span
                                              className="h-2 w-2 rounded-full border border-paper/80 shadow-[0_0_0_1px_rgba(34,30,71,0.08)]"
                                              style={{ background: chip.swatch }}
                                            />
                                          ) : null}
                                          {chip.label}
                                        </span>
                                      ))}
                                    </div>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          ) : null}

                          {summary.priceLine ? (
                            <p className="mt-3 text-[0.72rem] uppercase tracking-[0.18em] text-indigo/48">
                              {summary.priceLine}
                            </p>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    className={`pressable mt-6 w-full rounded-[1.7rem] border p-4 text-left transition hover:border-indigo/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${
                      showAddOns
                        ? "border-[rgba(34,30,71,0.34)] bg-[linear-gradient(180deg,rgba(11,123,76,0.08),rgba(249,248,244,0.98))] shadow-[0_18px_40px_-34px_rgba(34,30,71,0.3)]"
                        : selectedAddOnsCount > 0
                          ? "border-mehendi/16 bg-paper shadow-[0_18px_40px_-34px_rgba(34,30,71,0.16)]"
                          : "border-ink/8 bg-paper"
                    }`}
                    onClick={handleAddOnsCardClick}
                    ref={sidebarAddOnsRef}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[1.35rem] font-semibold leading-[1.02] tracking-[-0.03em] text-indigo">
                          Extras
                        </p>
                        <p className="mt-3 text-sm leading-6 text-ink/68">
                          {selectedAddOnsCount > 0
                            ? selectedAddOns
                                .slice(0, 2)
                                .map((option) => option.title)
                                .join(", ")
                            : "Optional finishing extras."}
                        </p>
                        {selectedAddOnsCount > 0 ? (
                          <p className="mt-3 text-[0.72rem] uppercase tracking-[0.18em] text-indigo/48">
                            {selectedAddOnsCount} selected • {formatEventPrice(addOnsSubtotal)}
                          </p>
                        ) : null}
                      </div>
                      <span
                        className={`rounded-full border px-2 py-1 text-[0.64rem] uppercase tracking-[0.18em] ${
                          showAddOns
                            ? "border-indigo/10 bg-indigo text-paper"
                            : selectedAddOnsCount > 0
                              ? "border-mehendi bg-mehendi text-paper"
                              : "border-ink/8 bg-paper text-ink/55"
                        }`}
                      >
                        {showAddOns ? "Current" : addOnsStatus}
                      </span>
                    </div>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-5">
          {showAddOns ? (
            <section
              ref={addOnsRef}
              className="flow-enter rounded-[2.3rem] border border-ink/8 bg-paper px-5 py-6 shadow-[0_30px_90px_-58px_rgba(34,30,71,0.32)] sm:px-6 sm:py-7"
              key="addons"
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="max-w-2xl">
                    <h3 className="font-display text-5xl leading-none tracking-[-0.05em] text-indigo">
                      Extras
                    </h3>
                    {mode === "standard" ? (
                      <p className="mt-3 max-w-xl text-sm leading-7 text-ink/64">
                        Standard package picks are already loaded. Add finishing
                        pieces only if you want to expand beyond the preset.
                      </p>
                    ) : null}
                  </div>

                  {checkoutCtaHref ? (
                    <Link
                      className="pressable inline-flex items-center justify-center rounded-full bg-marigold px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-18px_rgba(17,17,17,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                      href={checkoutCtaHref}
                    >
                      Proceed to Checkout
                    </Link>
                  ) : (
                    <button
                      className="inline-flex items-center justify-center rounded-full border border-ink/10 bg-paper px-5 py-3 text-sm text-ink/42"
                      disabled
                      type="button"
                    >
                      Pick at least one item
                    </button>
                  )}
                </div>

	                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
	                  {customizeAddOns.map((option) => {
	                    const quantity = addOnSelections[option.id] ?? 0;
	                    const selected = quantity > 0;
	                    const addedBadgeLabel = quantity > 1 ? `Added ×${quantity}` : "Added";
	                    const addOnImagePresentation = getOptionImagePresentation(option.image);
	
	                    return (
                      <div
                        aria-pressed={selected}
                        className={`pressable group cursor-pointer rounded-[1.9rem] border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
                          selected
                            ? "border-mehendi/28 bg-[linear-gradient(180deg,rgba(11,123,76,0.08),rgba(249,248,244,0.96))] shadow-[0_22px_44px_-32px_rgba(11,123,76,0.45)]"
                            : "border-ink/8 bg-cream hover:-translate-y-1 hover:border-indigo/14 hover:shadow-[0_22px_44px_-34px_rgba(34,30,71,0.28)]"
                        }`}
                        key={option.id}
                        onClick={() => toggleAddOn(option.id)}
                        onKeyDown={(event) =>
                          handleSelectableCardKeyDown(event, () =>
                            toggleAddOn(option.id),
                          )
                        }
                        role="button"
                        tabIndex={0}
	                      >
	                        <div className="relative overflow-hidden rounded-[1.5rem] border border-ink/8 bg-white">
	                          <div
	                            className={`relative aspect-[5/4] ${addOnImagePresentation.previewStageClassName}`}
	                          >
	                            {addOnImagePresentation.showBackdropImage ? (
	                              <>
	                                <OptionMedia
	                                  asset={option.image}
	                                  className={addOnImagePresentation.backdropClassName}
	                                  decorative
	                                  sizes="(min-width: 1280px) 18vw, (min-width: 768px) 40vw, 100vw"
	                                />
	                                <div
	                                  aria-hidden="true"
	                                  className={addOnImagePresentation.backdropScrimClassName}
	                                />
	                              </>
	                            ) : null}
	                            <OptionMedia
	                              asset={option.image}
	                              className={addOnImagePresentation.imageClassName}
	                              decorative
	                              sizes="(min-width: 1280px) 18vw, (min-width: 768px) 40vw, 100vw"
	                              style={addOnImagePresentation.imageStyle}
	                            />
	                          </div>
	                          {selected ? (
	                            <span className="absolute left-4 top-4 rounded-full border border-mehendi/10 bg-paper/88 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-mehendi backdrop-blur">
                              {addedBadgeLabel}
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-4">
                          <p className="font-display text-3xl leading-none text-indigo">
                            {option.title}
                          </p>
                          <p className="mt-2 text-[0.72rem] uppercase tracking-[0.2em] text-indigo/48">
                            {option.subtitle}
                          </p>
                          <div
                            className={`mt-4 flex items-center ${
                              selected ? "justify-between gap-3" : "justify-end"
                            }`}
                          >
                            {selected ? (
                              <QuantityStepper
                                decrementLabel={`Decrease quantity for ${option.title}`}
                                incrementLabel={`Increase quantity for ${option.title}`}
                                onDecrement={() =>
                                  updateAddOnQuantity(option.id, (currentQuantity) =>
                                    currentQuantity - 1,
                                  )
                                }
                                onIncrement={() =>
                                  updateAddOnQuantity(option.id, (currentQuantity) =>
                                    currentQuantity + 1,
                                  )
                                }
                                quantity={quantity}
                              />
                            ) : null}
                            <span className={PRICE_PILL_CLASSES}>
                              {formatEventPrice(getResolvedOptionPrice(currentStep, option))}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-[1.8rem] border border-ink/8 bg-cream p-5">
                  <p className="text-[0.72rem] uppercase tracking-[0.24em] text-indigo/48">
                    Extras summary
                  </p>
                  <p className="mt-3 text-sm leading-7 text-ink/72">
                    {selectedAddOnsCount > 0
                      ? selectedAddOns
                          .map((option) => {
                            const quantity = addOnSelections[option.id] ?? 0;
                            const quantitySuffix =
                              quantity > 1 ? ` (×${quantity})` : "";

                            return `${option.selectionSummary}${quantitySuffix}`;
                          })
                          .join(" ")
                      : "No extras selected yet. Leave this section empty if you only want the core setup."}
                  </p>
                </div>
              </section>
            ) : (
              <section
                ref={flowPanelRef}
                className="flow-enter rounded-[2.3rem] border border-ink/8 bg-paper px-5 py-6 shadow-[0_30px_90px_-58px_rgba(34,30,71,0.38)] sm:px-6 sm:py-7"
                key={currentStep.id}
              >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="max-w-3xl">
                      <h3 className="font-display text-5xl leading-none tracking-[-0.05em] text-indigo">
                        {currentStep.title}
                      </h3>
                    </div>

                    <div className="inline-grid grid-cols-[max-content] justify-items-stretch gap-3">
                      <button
                        className="pressable inline-flex items-center justify-center rounded-full border border-ink/10 px-4 py-2.5 text-sm text-ink/72 transition hover:border-indigo/18 hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                        onClick={handleSkip}
                        type="button"
                      >
                        Skip for now
                      </button>
                      <button
                        className={`pressable inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
                          canAdvanceCurrentStep
                            ? "bg-indigo text-paper hover:-translate-y-0.5 hover:bg-indigo/95"
                            : "cursor-not-allowed border border-ink/10 bg-paper text-ink/42"
                        }`}
                        disabled={!canAdvanceCurrentStep}
                        onClick={handleNextStep}
                      type="button"
                    >
                      {isLastStep ? "Continue to extras" : "Next step"}
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {currentStep.options.map((option) => {
                    const optionSelection = currentSelectionMap?.[option.id];
                    const hasVariants = Boolean(option.variants?.length);
                    const quantity = getOptionSelectionQuantity(optionSelection);
                    const selected = quantity > 0;
                    const isDecorativeRoundCushion =
                      option.id === DECORATIVE_ROUND_CUSHION_OPTION_ID;
                    const useDropdownVariantPicker =
                      hasVariants && isDecorativeRoundCushion;
                    const variantCardPrimed = Boolean(primedVariantOptionIds[option.id]);
                    const optionIsSoldOut = isDholOptionGloballyUnavailable(
                      currentStep,
                      option,
                    );
                    const selectedBadgeLabel =
                      selected && (!hasVariants || useDropdownVariantPicker)
                        ? quantity > 1
                          ? `Selected ×${quantity}`
                          : "Selected"
                        : null;
                    const optionImages = getOptionImages(option);
                    const activeImageIndex = getPreferredOptionImageIndex(
                      option,
                      optionSelection,
                      optionImageIndexes[option.id],
                    );
                    const activeImage = optionImages[activeImageIndex] ?? optionImages[0];
                    const hasGallery = optionImages.length > 1;
                    const showInlineGallery = hasGallery;
                    const activeVariant = hasVariants
                      ? option.variants?.find(
                          (variant) => variant.id === activeVariantIds[option.id],
                        ) ??
                        option.variants?.find(
                          (variant) =>
                            (optionSelection?.variants?.[variant.id] ?? 0) > 0,
                        ) ??
                        null
                      : null;
                    const activeVariantQuantity = activeVariant
                      ? optionSelection?.variants?.[activeVariant.id] ?? 0
                      : 0;
                    const showVariantSelectionError =
                      useDropdownVariantPicker &&
                      Boolean(variantSelectionErrors[option.id]) &&
                      !activeVariant;
                    const optionImagePresentation =
                      getOptionImagePresentation(activeImage);
                    const cardIsHighlighted = selected || variantCardPrimed;
                    const cardClasses = optionIsSoldOut
                      ? "cursor-not-allowed border-rose-200/80 bg-rose-50/70 opacity-72"
                      : cardIsHighlighted
                        ? "border-mehendi/28 bg-[linear-gradient(180deg,rgba(11,123,76,0.08),rgba(249,248,244,0.96))] shadow-[0_22px_44px_-32px_rgba(11,123,76,0.45)]"
                      : hasVariants
                          ? "border-ink/8 bg-cream"
                          : "border-ink/8 bg-cream hover:-translate-y-1 hover:border-indigo/14 hover:shadow-[0_22px_44px_-34px_rgba(34,30,71,0.28)]";
                    const preferredImageIndex = getPreferredOptionImageIndex(
                      option,
                      optionSelection,
                      optionImageIndexes[option.id],
                    );
                    const handleDecorativeRoundCushionCardClick = () => {
                      focusOptionPreview(currentStep.id, option.id, preferredImageIndex);

                      if (!useDropdownVariantPicker) {
                        return;
                      }

                      if (selected) {
                        setPrimedVariantOptionIds((currentPrimedVariantOptionIds) => ({
                          ...currentPrimedVariantOptionIds,
                          [option.id]: true,
                        }));
                        return;
                      }

                      setPrimedVariantOptionIds((currentPrimedVariantOptionIds) => ({
                        ...currentPrimedVariantOptionIds,
                        [option.id]: !currentPrimedVariantOptionIds[option.id],
                      }));
                      setVariantSelectionErrors((currentVariantSelectionErrors) => ({
                        ...currentVariantSelectionErrors,
                        [option.id]: false,
                      }));
                    };

                    return (
                      <div
                        aria-disabled={optionIsSoldOut || undefined}
                        aria-pressed={
                          optionIsSoldOut
                            ? undefined
                            : useDropdownVariantPicker
                              ? cardIsHighlighted
                              : hasVariants
                                ? undefined
                                : selected
                        }
                        className={`group rounded-[1.9rem] border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
                          optionIsSoldOut ? "" : "cursor-pointer"
                        } ${cardClasses}`}
                        key={option.id}
                        onClick={
                          optionIsSoldOut
                            ? undefined
                            : useDropdownVariantPicker
                              ? handleDecorativeRoundCushionCardClick
                              : hasVariants
                                ? () =>
                                    focusOptionPreview(
                                      currentStep.id,
                                      option.id,
                                      preferredImageIndex,
                                    )
                                : () => handleSelect(currentStep.id, option)
                        }
                        onKeyDown={
                          optionIsSoldOut
                            ? undefined
                            : useDropdownVariantPicker
                              ? (event) =>
                                  handleSelectableCardKeyDown(
                                    event,
                                    handleDecorativeRoundCushionCardClick,
                                  )
                              : hasVariants
                                ? undefined
                            : (event) =>
                                handleSelectableCardKeyDown(event, () =>
                                  handleSelect(currentStep.id, option),
                                )
                        }
                        role={
                          optionIsSoldOut
                            ? undefined
                            : useDropdownVariantPicker || !hasVariants
                              ? "button"
                              : undefined
                        }
                        tabIndex={
                          optionIsSoldOut
                            ? undefined
                            : useDropdownVariantPicker || !hasVariants
                              ? 0
                              : undefined
                        }
                      >
                        <div className="relative overflow-hidden rounded-[1.5rem] border border-ink/8 bg-white">
                          <div className={`relative ${optionImagePresentation.frameClassName}`}>
                            {optionImagePresentation.showBackdropImage ? (
                              <>
                                <OptionMedia
                                  asset={activeImage}
                                  className={optionImagePresentation.backdropClassName}
                                  decorative
                                  sizes="(min-width: 1280px) 18vw, (min-width: 768px) 40vw, 100vw"
                                />
                                <div
                                  aria-hidden="true"
                                  className={
                                    optionImagePresentation.backdropScrimClassName
                                  }
                                />
                              </>
                            ) : null}
                            <OptionMedia
                              asset={activeImage}
                              className={optionImagePresentation.imageClassName}
                              decorative
                              sizes="(min-width: 1280px) 18vw, (min-width: 768px) 40vw, 100vw"
                              style={optionImagePresentation.imageStyle}
                            />
                          </div>
                          {selected && selectedBadgeLabel ? (
                            <span className="absolute left-4 top-4 rounded-full border border-mehendi/10 bg-paper/88 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-mehendi backdrop-blur">
                              {selectedBadgeLabel}
                            </span>
                          ) : null}
                          {optionIsSoldOut ? (
                            <span className="absolute left-4 top-4 rounded-full border border-rose-300/70 bg-paper/90 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-rose-700 backdrop-blur">
                              Sold out
                            </span>
                          ) : null}
                          {isVideoAsset(activeImage) ? (
                            <span className="absolute right-4 top-4 rounded-full border border-paper/48 bg-paper/84 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-indigo/56 backdrop-blur">
                              Video
                            </span>
                          ) : null}
                          {showInlineGallery ? (
                            <div className="border-t border-indigo/8 bg-[linear-gradient(180deg,rgba(249,248,244,0.9),rgba(255,255,255,0.96))] px-3 py-2">
                              <div className="flex items-center justify-between gap-3">
                                <button
                                  aria-label={`Show previous image for ${option.title}`}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-indigo/10 bg-paper text-lg leading-none text-indigo shadow-[0_14px_30px_-20px_rgba(34,30,71,0.32)] transition hover:bg-cream"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    cycleOptionImage(option.id, optionImages.length, -1);
                                  }}
                                  onPointerDown={(event) => {
                                    event.stopPropagation();
                                  }}
                                  type="button"
                                >
                                  <span aria-hidden="true">‹</span>
                                </button>
                                <div className="h-px flex-1 bg-indigo/8" />
                                <button
                                  aria-label={`Show next image for ${option.title}`}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-indigo/10 bg-paper text-lg leading-none text-indigo shadow-[0_14px_30px_-20px_rgba(34,30,71,0.32)] transition hover:bg-cream"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    cycleOptionImage(option.id, optionImages.length, 1);
                                  }}
                                  onPointerDown={(event) => {
                                    event.stopPropagation();
                                  }}
                                  type="button"
                                >
                                  <span aria-hidden="true">›</span>
                                </button>
                              </div>
                            </div>
                          ) : null}
                        </div>

                        <div className="mt-4">
                          <p className="font-display text-3xl leading-none text-indigo">
                            {option.title}
                          </p>
                          <p className="mt-2 text-[0.72rem] uppercase tracking-[0.2em] text-indigo/48">
                            {option.subtitle}
                          </p>
                          {hasVariants ? (
                            <>
                              {useDropdownVariantPicker ? (
                                <>
                                  <div className="mt-4">
                                    {option.variantLabel || option.variantHint ? (
                                      <div className="mb-3 space-y-1">
                                        {option.variantLabel ? (
                                          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-indigo/48">
                                            {option.variantLabel}
                                          </p>
                                        ) : null}
                                        {option.variantHint ? (
                                          <p className="text-sm leading-5 text-indigo/58">
                                            {option.variantHint}
                                          </p>
                                        ) : null}
                                      </div>
                                    ) : null}
                                    <div className="relative">
                                      <select
                                        aria-invalid={showVariantSelectionError || undefined}
                                        className={`w-full appearance-none rounded-[1rem] border bg-white px-4 py-2.5 pr-10 text-sm font-medium shadow-[0_12px_28px_-24px_rgba(34,30,71,0.18)] transition focus-visible:outline-none focus-visible:ring-2 ${
                                          showVariantSelectionError
                                            ? "border-rose-400 bg-rose-50/70 text-rose-700 focus-visible:ring-rose-200"
                                            : cardIsHighlighted
                                              ? "border-mehendi/28 text-indigo focus-visible:ring-mehendi/18"
                                              : "border-ink/10 text-indigo focus-visible:ring-indigo/18"
                                        }`}
                                        onChange={(event) => {
                                          event.stopPropagation();

                                          const nextVariantId = event.target.value;

                                          if (!nextVariantId) {
                                            if (selected) {
                                              return;
                                            }

                                            setActiveVariantIds((currentActiveVariantIds) => {
                                              const nextActiveVariantIds = {
                                                ...currentActiveVariantIds,
                                              };

                                              delete nextActiveVariantIds[option.id];

                                              return nextActiveVariantIds;
                                            });
                                            setVariantSelectionErrors(
                                              (currentVariantSelectionErrors) => ({
                                                ...currentVariantSelectionErrors,
                                                [option.id]: false,
                                              }),
                                            );

                                            return;
                                          }

                                          const nextVariant = option.variants?.find(
                                            (variant) => variant.id === nextVariantId,
                                          );

                                          if (!nextVariant) {
                                            return;
                                          }

                                          setActiveVariantIds((currentActiveVariantIds) => ({
                                            ...currentActiveVariantIds,
                                            [option.id]: nextVariant.id,
                                          }));
                                          setPrimedVariantOptionIds(
                                            (currentPrimedVariantOptionIds) => ({
                                              ...currentPrimedVariantOptionIds,
                                              [option.id]: true,
                                            }),
                                          );
                                          setVariantSelectionErrors(
                                            (currentVariantSelectionErrors) => ({
                                              ...currentVariantSelectionErrors,
                                              [option.id]: false,
                                            }),
                                          );
                                          focusOptionPreview(
                                            currentStep.id,
                                            option.id,
                                            nextVariant.imageIndex,
                                          );
                                        }}
                                        onClick={(event) => {
                                          event.stopPropagation();
                                        }}
                                        onKeyDown={(event) => {
                                          event.stopPropagation();
                                        }}
                                        onPointerDown={(event) => {
                                          event.stopPropagation();
                                        }}
                                        value={activeVariant?.id ?? ""}
                                      >
                                        <option value="">Select a color</option>
                                        {option.variants?.map((variant) => (
                                          <option key={variant.id} value={variant.id}>
                                            {variant.label}
                                          </option>
                                        ))}
                                      </select>
                                      <span className="pointer-events-none absolute inset-y-0 right-4 inline-flex items-center text-indigo/58">
                                        <svg
                                          aria-hidden="true"
                                          className="h-4 w-4"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            d="M7 10L12 15L17 10"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.9"
                                          />
                                        </svg>
                                      </span>
                                    </div>
                                    {showVariantSelectionError ? (
                                      <p className="mt-2 text-[0.72rem] font-medium text-rose-600">
                                        Choose a color before adjusting quantity.
                                      </p>
                                    ) : null}
                                  </div>

                                  <div className="mt-3 flex items-center justify-between gap-3">
                                    <QuantityStepper
                                      decrementLabel={`Decrease ${activeVariant?.label ?? "selected"} quantity for ${option.title}`}
                                      incrementLabel={`Increase ${activeVariant?.label ?? "selected"} quantity for ${option.title}`}
                                      onDecrement={() => {
                                        if (!activeVariant) {
                                          return;
                                        }

                                        setVariantSelectionErrors(
                                          (currentVariantSelectionErrors) => ({
                                            ...currentVariantSelectionErrors,
                                            [option.id]: false,
                                          }),
                                        );
                                        updateStepOptionVariantQuantity(
                                          currentStep.id,
                                          option,
                                          activeVariant.id,
                                          activeVariant.imageIndex,
                                          (currentQuantity) => currentQuantity - 1,
                                        );
                                      }}
                                      onIncrement={() => {
                                        if (!activeVariant) {
                                          setPrimedVariantOptionIds(
                                            (currentPrimedVariantOptionIds) => ({
                                              ...currentPrimedVariantOptionIds,
                                              [option.id]: true,
                                            }),
                                          );
                                          setVariantSelectionErrors(
                                            (currentVariantSelectionErrors) => ({
                                              ...currentVariantSelectionErrors,
                                              [option.id]: true,
                                            }),
                                          );
                                          return;
                                        }

                                        setVariantSelectionErrors(
                                          (currentVariantSelectionErrors) => ({
                                            ...currentVariantSelectionErrors,
                                            [option.id]: false,
                                          }),
                                        );
                                        updateStepOptionVariantQuantity(
                                          currentStep.id,
                                          option,
                                          activeVariant.id,
                                          activeVariant.imageIndex,
                                          (currentQuantity) => currentQuantity + 1,
                                        );
                                      }}
                                      quantity={activeVariantQuantity}
                                    />
                                    <span className={PRICE_PILL_CLASSES}>
                                      {formatEventPrice(
                                        getResolvedOptionPrice(currentStep, option),
                                      )}
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  {option.variantLabel || option.variantHint ? (
                                    <div className="mt-4 space-y-1">
                                      {option.variantLabel ? (
                                        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-indigo/48">
                                          {option.variantLabel}
                                        </p>
                                      ) : null}
                                      {option.variantHint ? (
                                        <p className="text-sm leading-5 text-indigo/58">
                                          {option.variantHint}
                                        </p>
                                      ) : null}
                                    </div>
                                  ) : null}
                                  <div className="mt-4 flex items-start justify-between gap-2">
                                    {option.variants?.map((variant) => {
                                      const variantQuantity =
                                        optionSelection?.variants?.[variant.id] ?? 0;
                                      const variantSelected = variantQuantity > 0;
                                      const variantActive = activeVariant?.id === variant.id;

                                      return (
                                        <button
                                          aria-label={`Select ${variant.label} for ${option.title}`}
                                          aria-pressed={variantActive}
                                          className="pressable flex shrink-0 flex-col items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                                          key={variant.id}
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            setActiveVariantIds(
                                              (currentActiveVariantIds) => ({
                                                ...currentActiveVariantIds,
                                                [option.id]: variant.id,
                                              }),
                                            );
                                            focusOptionPreview(
                                              currentStep.id,
                                              option.id,
                                              variant.imageIndex,
                                            );
                                          }}
                                          type="button"
                                        >
                                          <span
                                            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-[0_12px_22px_-18px_rgba(34,30,71,0.34)] transition ${
                                              variantSelected
                                                ? "border-mehendi bg-paper shadow-[0_0_0_3px_rgba(11,123,76,0.08)]"
                                                : variantActive
                                                  ? "border-indigo/22 bg-paper shadow-[0_0_0_3px_rgba(34,30,71,0.05)]"
                                                  : "border-ink/8 bg-paper"
                                            }`}
                                          >
                                            <span
                                              className="h-5 w-5 rounded-full border border-paper/80 shadow-[0_0_0_1px_rgba(34,30,71,0.08)]"
                                              style={{
                                                background: variant.swatch,
                                              }}
                                            />
                                          </span>
                                          <span className="mt-1 block min-h-[0.95rem] text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-mehendi">
                                            {variantSelected ? `x${variantQuantity}` : ""}
                                          </span>
                                        </button>
                                      );
                                    })}
                                  </div>

                                  <div className="mt-4 flex items-center justify-between gap-3">
                                    {activeVariant ? (
                                      <QuantityStepper
                                        decrementLabel={`Decrease ${activeVariant.label} quantity for ${option.title}`}
                                        incrementLabel={`Increase ${activeVariant.label} quantity for ${option.title}`}
                                        onDecrement={() =>
                                          updateStepOptionVariantQuantity(
                                            currentStep.id,
                                            option,
                                            activeVariant.id,
                                            activeVariant.imageIndex,
                                            (currentQuantity) =>
                                              currentQuantity - 1,
                                          )
                                        }
                                        onIncrement={() =>
                                          updateStepOptionVariantQuantity(
                                            currentStep.id,
                                            option,
                                            activeVariant.id,
                                            activeVariant.imageIndex,
                                            (currentQuantity) =>
                                              currentQuantity + 1,
                                          )
                                        }
                                        quantity={activeVariantQuantity}
                                      />
                                    ) : (
                                      <div className="min-w-0 flex-1">
                                        <span className="relative inline-block whitespace-nowrap text-[0.72rem] font-medium uppercase tracking-[0.24em] text-indigo/42">
                                          <Image
                                            alt=""
                                            aria-hidden="true"
                                            className="pointer-events-none absolute left-[calc(100%-0.2rem)] -top-9 h-auto w-11 select-none opacity-55 mix-blend-multiply"
                                            src={dottedLineImage}
                                          />
                                          Pick a color
                                        </span>
                                      </div>
                                    )}
                                    <span className={PRICE_PILL_CLASSES}>
                                      {formatEventPrice(
                                        getResolvedOptionPrice(currentStep, option),
                                      )}
                                    </span>
                                  </div>
                                </>
                              )}
                            </>
                          ) : (
                            <div
                              className={`mt-4 flex items-center ${
                                selected ? "justify-between gap-3" : "justify-end"
                              }`}
                              >
                                {selected && !optionIsSoldOut ? (
                                  <QuantityStepper
                                    decrementLabel={`Decrease quantity for ${option.title}`}
                                    incrementLabel={`Increase quantity for ${option.title}`}
                                  onDecrement={() =>
                                    updateStepOptionQuantity(
                                      currentStep.id,
                                      option.id,
                                      (currentQuantity) => currentQuantity - 1,
                                    )
                                  }
                                  onIncrement={() =>
                                    updateStepOptionQuantity(
                                      currentStep.id,
                                      option.id,
                                      (currentQuantity) => currentQuantity + 1,
                                    )
                                  }
                                  quantity={quantity}
                                />
                              ) : null}
                              <span className={PRICE_PILL_CLASSES}>
                                {formatEventPrice(
                                  getResolvedOptionPrice(currentStep, option),
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedPreviewOption && selectedPreviewImage && selectedPreviewPresentation ? (
                  <div className="mt-6 overflow-hidden rounded-[2.1rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(245,241,234,0.58),rgba(255,255,255,0.96))] shadow-[0_30px_90px_-58px_rgba(34,30,71,0.28)]">
                    <div className="p-4 sm:p-5">
                      <div
                        className={`group/selected-preview relative min-h-[18rem] overflow-hidden rounded-[1.7rem] border border-ink/8 sm:min-h-[22rem] xl:min-h-[32rem] ${selectedPreviewPresentation.previewStageClassName} ${
                          selectedPreviewCanZoom
                            ? previewZoomState.active
                              ? "cursor-zoom-out"
                              : "cursor-zoom-in"
                            : "cursor-default"
                        }`}
                        onClick={selectedPreviewCanZoom ? toggleSelectedPreviewZoom : undefined}
                        onPointerEnter={
                          selectedPreviewCanZoom
                            ? handleSelectedPreviewPointerEnter
                            : undefined
                        }
                        onPointerLeave={handleSelectedPreviewPointerLeave}
                        onPointerMove={
                          selectedPreviewCanZoom ? updateSelectedPreviewZoom : undefined
                        }
                      >
                        <div
                          className={`absolute inset-0 ${selectedPreviewMotionClassName}`}
                          key={`${selectedPreviewOption.id}-${selectedPreviewImageIndex}`}
                        >
                          {selectedPreviewPresentation.showBackdropImage ? (
                            <>
                              <OptionMedia
                                asset={selectedPreviewImage}
                                className="object-cover scale-[1.18] blur-3xl opacity-60"
                                decorative
                                sizes="(min-width: 1280px) 42vw, 100vw"
                              />
                              <div
                                aria-hidden="true"
                                className={selectedPreviewPresentation.backdropScrimClassName}
                              />
                            </>
                          ) : null}
                          <OptionMedia
                            asset={selectedPreviewImage}
                            className={selectedPreviewPresentation.previewImageClassName}
                            sizes="(min-width: 1280px) 42vw, 100vw"
                            style={selectedPreviewImageStyle}
                            withControls={isVideoAsset(selectedPreviewImage)}
                          />
                        </div>
                        {selectedPreviewCanZoom ? (
                          <div
                            aria-hidden="true"
                            className={`pointer-events-none absolute left-4 top-4 z-10 rounded-full border border-paper/48 bg-paper/82 px-3 py-2 text-indigo shadow-[0_18px_34px_-24px_rgba(34,30,71,0.36)] backdrop-blur transition-all duration-200 ${
                              previewZoomState.hovered ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                            }`}
                          >
                            <span className="inline-flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-indigo/52">
                              <svg
                                aria-hidden="true"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle
                                  cx="11"
                                  cy="11"
                                  r="5.5"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                />
                                <path
                                  d="M16 16L20 20"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeWidth="1.6"
                                />
                                <path
                                  d={previewZoomState.active ? "M8.5 11H13.5" : "M8.5 11H13.5M11 8.5V13.5"}
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeWidth="1.6"
                                />
                              </svg>
                              {previewZoomState.active ? "Click to close" : "Click to zoom"}
                            </span>
                          </div>
                        ) : null}
                        {selectedPreviewHasGallery ? (
                          <>
                            <div
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-[linear-gradient(90deg,rgba(247,246,243,0.34),rgba(247,246,243,0))]"
                            />
                            <div
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-[linear-gradient(270deg,rgba(247,246,243,0.34),rgba(247,246,243,0))]"
                            />
                            <button
                              aria-label={`Show previous image for ${selectedPreviewOption.title}`}
                              className="pressable absolute left-4 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-paper/54 bg-paper/82 text-xl leading-none text-indigo shadow-[0_20px_42px_-24px_rgba(34,30,71,0.42)] backdrop-blur transition hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:left-5 sm:h-14 sm:w-14"
                              onClick={(event) => {
                                event.stopPropagation();
                                resetSelectedPreviewZoom();
                                cycleOptionImage(
                                  selectedPreviewOption.id,
                                  selectedPreviewImages.length,
                                  -1,
                                );
                              }}
                              type="button"
                            >
                              <span aria-hidden="true">‹</span>
                            </button>
                            <div className="absolute right-4 top-4 z-10 rounded-full border border-paper/48 bg-paper/82 px-3 py-1.5 text-[0.66rem] uppercase tracking-[0.22em] text-indigo/46 shadow-[0_18px_34px_-24px_rgba(34,30,71,0.36)] backdrop-blur sm:right-5 sm:top-5">
                              {selectedPreviewImageIndex + 1} / {selectedPreviewImages.length}
                            </div>
                            <button
                              aria-label={`Show next image for ${selectedPreviewOption.title}`}
                              className="pressable absolute right-4 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-paper/54 bg-paper/82 text-xl leading-none text-indigo shadow-[0_20px_42px_-24px_rgba(34,30,71,0.42)] backdrop-blur transition hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:right-5 sm:h-14 sm:w-14"
                              onClick={(event) => {
                                event.stopPropagation();
                                resetSelectedPreviewZoom();
                                cycleOptionImage(
                                  selectedPreviewOption.id,
                                  selectedPreviewImages.length,
                                  1,
                                );
                              }}
                              type="button"
                            >
                              <span aria-hidden="true">›</span>
                            </button>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null}
              </section>
            )}
          </div>
        </section>
    </div>
  );
}
