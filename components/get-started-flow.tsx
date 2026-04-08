"use client";

import Image from "next/image";
import Link from "next/link";
import {
  startTransition,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  bundlePaths,
  customizeAddOns,
  customizeSteps,
  type AddOnOption,
  type BundlePath,
  type CustomizeOption,
} from "@/lib/site-content";

type PathMode = BundlePath["id"];
type StepSelection = string[] | "skip" | null;
type SelectionMap = Record<string, StepSelection>;
type AddOnSelectionMap = Record<string, boolean>;
type ScrollTarget = "flow" | "addons";
type FlowSnapshot = {
  draftSelections: SelectionMap;
  confirmedSelections: SelectionMap;
  addOnSelections: AddOnSelectionMap;
  currentStepIndex: number;
  showAddOns: boolean;
};

const FLOW_SCROLL_OFFSET = 112;
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const createInitialSelections = (): SelectionMap =>
  customizeSteps.reduce<SelectionMap>((accumulator, step) => {
    accumulator[step.id] = null;
    return accumulator;
  }, {});

const createInitialAddOnSelections = (): AddOnSelectionMap =>
  customizeAddOns.reduce<AddOnSelectionMap>((accumulator, option) => {
    accumulator[option.id] = false;
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

const getSelectionCount = (selection: StepSelection) =>
  Array.isArray(selection) ? selection.length : 0;

const getSelectionTotal = (pricePerDay: number, selection: StepSelection) =>
  getSelectionCount(selection) * pricePerDay;

const formatDailyPrice = (amount: number) =>
  `${currencyFormatter.format(amount)}/day`;

const cloneSelectionMap = (selectionMap: SelectionMap): SelectionMap =>
  Object.fromEntries(
    Object.entries(selectionMap).map(([stepId, selection]) => [
      stepId,
      Array.isArray(selection) ? [...selection] : selection,
    ]),
  );

const createStandardPresetSelections = (): SelectionMap =>
  customizeSteps.reduce<SelectionMap>((accumulator, step) => {
    const randomOption =
      step.options[Math.floor(Math.random() * step.options.length)];

    accumulator[step.id] = randomOption ? [randomOption.id] : null;

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

type GetStartedFlowProps = {
  initialMode?: BundlePath["id"];
};

export function GetStartedFlow({
  initialMode = "customize",
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
  const [addOnSelections, setAddOnSelections] = useState<AddOnSelectionMap>(() =>
    ({ ...initialSnapshot.addOnSelections }),
  );
  const [scrollKey, setScrollKey] = useState(0);
  const flowPanelRef = useRef<HTMLDivElement | null>(null);
  const addOnsRef = useRef<HTMLDivElement | null>(null);
  const pendingScrollTargetRef = useRef<ScrollTarget | null>(null);
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
  const allStepsCompleted = customizeSteps.every(
    (step) => confirmedSelections[step.id] !== null,
  );
  const selectedAddOns = customizeAddOns.filter((option) => addOnSelections[option.id]);
  const currentStep = customizeSteps[currentStepIndex];
  const currentSelectionState = draftSelections[currentStep.id];
  const currentSelectedIds = Array.isArray(currentSelectionState) ? currentSelectionState : [];
  const canAdvanceCurrentStep =
    currentSelectionState === "skip" || currentSelectedIds.length > 0;
  const lastStepIndex = customizeSteps.length - 1;
  const isLastStep = currentStepIndex === lastStepIndex;
  const getEffectiveSelection = (stepId: string) => draftSelections[stepId];
  const coreSubtotal = customizeSteps.reduce(
    (sum, step) => sum + getSelectionTotal(step.pricePerDay, getEffectiveSelection(step.id)),
    0,
  );
  const addOnsSubtotal = selectedAddOns.reduce(
    (sum, option) => sum + option.pricePerDay,
    0,
  );
  const subtotal = coreSubtotal + addOnsSubtotal;
  const addOnsStatus = selectedAddOns.length > 0 ? "Selected" : "Pending";
  const currentProgressIndex = showAddOns ? null : currentStepIndex;

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
    setCurrentStepIndex(snapshot.currentStepIndex);
    setShowAddOns(snapshot.showAddOns);
  };

  const getOptionImages = (option: CustomizeOption) =>
    option.gallery && option.gallery.length > 0 ? option.gallery : [option.image];

  const cycleOptionImage = (
    optionId: string,
    imageCount: number,
    direction: -1 | 1,
  ) => {
    if (imageCount <= 1) {
      return;
    }

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

  const selectionStateForStep = (stepId: string) => {
    const step = customizeSteps.find((item) => item.id === stepId);
    const selection = getEffectiveSelection(stepId);

    if (!step || selection === null) {
      return {
        status: "Pending",
        tone: "pending" as const,
        headline: null,
        priceLine: null,
      };
    }

    if (selection === "skip") {
      return {
        status: "Skipped",
        tone: "skipped" as const,
        headline: step.skippedSummary,
        priceLine: null,
      };
    }

    const selectedOptions = step.options.filter((option) => selection.includes(option.id));
    const total = getSelectionTotal(step.pricePerDay, selection);

    if (selectedOptions.length === 0) {
      return {
        status: "Pending",
        tone: "pending" as const,
        headline: null,
        priceLine: null,
      };
    }

    return {
      status: "Selected",
      tone: "selected" as const,
      headline: selectedOptions.map((option) => option.title).join(", "),
      priceLine: `${selectedOptions.length} selected • ${formatDailyPrice(total)}`,
    };
  };

  const jumpToStep = (stepIndex: number) => {
    startTransition(() => {
      setShowAddOns(false);
      setCurrentStepIndex(stepIndex);
    });

    queueScroll("flow");
  };

  const jumpToAddOns = () => {
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

    startTransition(() => {
      setMode(nextMode);
      applySnapshot(nextSnapshot);
    });
  };

  const handleSelect = (stepId: string, option: CustomizeOption) => {
    setDraftSelections((currentSelections) => {
      const existingSelection = currentSelections[stepId];
      const selectedIds = Array.isArray(existingSelection) ? existingSelection : [];
      const nextSelectedIds = selectedIds.includes(option.id)
        ? selectedIds.filter((id) => id !== option.id)
        : [...selectedIds, option.id];

      return {
        ...currentSelections,
        [stepId]: nextSelectedIds.length > 0 ? nextSelectedIds : null,
      };
    });
  };

  const handleSkip = () => {
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

  const toggleAddOn = (option: AddOnOption) => {
    setAddOnSelections((currentSelections) => ({
      ...currentSelections,
      [option.id]: !currentSelections[option.id],
    }));
  };

  const handleAddOnsCardClick = () => {
    jumpToAddOns();
  };

  const resetCustomizeFlow = () => {
    const nextSnapshot = createFlowSnapshot(mode);

    if (mode === "standard") {
      standardSnapshotRef.current = cloneFlowSnapshot(nextSnapshot);
    } else {
      customSnapshotRef.current = cloneFlowSnapshot(nextSnapshot);
    }

    startTransition(() => {
      applySnapshot(nextSnapshot);
    });

    queueScroll("flow");
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="flex flex-wrap items-center gap-3 xl:col-span-2">
          <div className="inline-flex items-center rounded-full border border-ink/10 bg-paper/70 p-1 shadow-[0_18px_42px_-36px_rgba(34,30,71,0.22)] backdrop-blur">
            <button
              aria-pressed={mode === "customize"}
              className={`pressable inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold tracking-[-0.01em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
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
                className={`pressable inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold tracking-[-0.01em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
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

        <aside className="xl:sticky xl:top-28 xl:self-start">
          <div className="overflow-hidden rounded-[2.2rem] border border-ink/8 bg-cream shadow-[0_30px_90px_-58px_rgba(34,30,71,0.36)]">
            <div className="pb-1.5 pl-1.5 pr-0.5 pt-1.5">
              <div className="tailored-scroll rounded-[1.9rem] xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto">
                <div className="p-5 xl:pr-4">
                  <div className="rounded-[1.7rem] border border-indigo/10 bg-paper px-4 py-4 shadow-[0_18px_45px_-38px_rgba(34,30,71,0.3)]">
                    <p className="text-[0.62rem] uppercase tracking-[0.24em] text-indigo/48">
                      Live total
                    </p>
                    <div className="mt-2">
                      <div>
                        <p className="font-display text-[3.45rem] leading-[0.9] tracking-[-0.06em] text-indigo">
                          {formatDailyPrice(subtotal)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <div className="w-full overflow-hidden rounded-full border border-indigo/10 bg-paper/94 px-5 py-3 shadow-[0_20px_40px_-34px_rgba(34,30,71,0.35)] backdrop-blur">
                      <div className="flex items-center">
                        {customizeSteps.map((step, index) => {
                          const dotClasses =
                            index < completedCount
                              ? "h-2.5 w-2.5 border-mehendi bg-mehendi shadow-[0_0_0_4px_rgba(11,123,76,0.08)] sm:h-3 sm:w-3"
                              : index === currentProgressIndex
                                ? "h-2.5 w-2.5 border-indigo/24 bg-paper shadow-[0_0_0_5px_rgba(34,30,71,0.07)] after:absolute after:left-1/2 after:top-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-indigo after:content-[''] sm:h-3 sm:w-3 sm:after:h-1.5 sm:after:w-1.5"
                                : "h-2 w-2 border-indigo/12 bg-paper sm:h-2.5 sm:w-2.5";

                          const segmentClasses =
                            index < completedCount - 1
                              ? "bg-[linear-gradient(90deg,rgba(11,123,76,0.88),rgba(11,123,76,0.54))]"
                              : "bg-indigo/8";

                          return (
                            <div
                              className={
                                index === customizeSteps.length - 1
                                  ? ""
                                  : "flex flex-1 items-center"
                              }
                              key={`sidebar-progress-${step.id}`}
                            >
                              <span
                                aria-hidden="true"
                                className={`relative block shrink-0 rounded-full border transition-all duration-300 ${dotClasses}`}
                              />
                              {index < customizeSteps.length - 1 ? (
                                <span
                                  aria-hidden="true"
                                  className={`mx-0.5 h-[0.14rem] flex-1 rounded-full transition-all duration-300 sm:mx-1 sm:h-[0.16rem] ${segmentClasses}`}
                                />
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {customizeSteps.map((step, index) => {
                      const summary = selectionStateForStep(step.id);
                      const active = !showAddOns && index === currentStepIndex;

                      const itemClasses = active
                        ? "border-indigo/16 bg-paper shadow-[0_18px_40px_-34px_rgba(34,30,71,0.3)]"
                        : summary.tone === "selected"
                          ? "border-mehendi/24 bg-[linear-gradient(180deg,rgba(11,123,76,0.08),rgba(249,248,244,0.98))] shadow-[0_18px_40px_-34px_rgba(11,123,76,0.28)]"
                          : summary.tone === "skipped"
                            ? "border-dashed border-ink/18 bg-paper/72 hover:border-ink/24"
                            : "border-ink/8 bg-paper/76 hover:border-indigo/16";

                      const badgeClasses = active
                        ? "border-indigo/10 bg-indigo text-paper"
                        : summary.tone === "selected"
                          ? "border-mehendi/12 bg-paper/88 text-mehendi"
                          : summary.tone === "skipped"
                            ? "border-ink/10 bg-paper text-ink/58"
                            : "border-ink/8 bg-paper text-ink/55";

                      const badgeLabel = active ? "Current" : summary.status;

                      return (
                        <button
                          className={`pressable w-full rounded-[1.6rem] border px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${itemClasses}`}
                          key={step.id}
                          onClick={() => jumpToStep(index)}
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
                            <p className="mt-3 text-sm leading-6 text-ink/68">
                              {summary.headline}
                            </p>
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
                        ? "border-indigo/16 bg-paper shadow-[0_18px_40px_-34px_rgba(34,30,71,0.3)]"
                        : selectedAddOns.length > 0
                          ? "border-mehendi/24 bg-[linear-gradient(180deg,rgba(11,123,76,0.08),rgba(249,248,244,0.98))] shadow-[0_18px_40px_-34px_rgba(11,123,76,0.28)]"
                          : "border-ink/8 bg-paper"
                    }`}
                    onClick={handleAddOnsCardClick}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[1.35rem] font-semibold leading-[1.02] tracking-[-0.03em] text-indigo">
                          Add-ons
                        </p>
                        <p className="mt-3 text-sm leading-6 text-ink/68">
                          {selectedAddOns.length > 0
                            ? selectedAddOns
                                .slice(0, 2)
                                .map((option) => option.title)
                                .join(", ")
                            : "Optional finishing extras."}
                        </p>
                        {selectedAddOns.length > 0 ? (
                          <p className="mt-3 text-[0.72rem] uppercase tracking-[0.18em] text-indigo/48">
                            {selectedAddOns.length} selected • {formatDailyPrice(addOnsSubtotal)}
                          </p>
                        ) : null}
                      </div>
                      <span
                        className={`rounded-full border px-2 py-1 text-[0.64rem] uppercase tracking-[0.18em] ${
                          showAddOns
                            ? "border-indigo/10 bg-indigo text-paper"
                            : selectedAddOns.length > 0
                              ? "border-mehendi/12 bg-paper/88 text-mehendi"
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
                      Add-ons
                    </h3>
                    {mode === "standard" ? (
                      <p className="mt-3 max-w-xl text-sm leading-7 text-ink/64">
                        Standard package picks are already loaded. Add finishing
                        pieces only if you want to expand beyond the preset.
                      </p>
                    ) : null}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-mehendi/12 bg-mehendi/7 px-4 py-3">
                      <p className="text-[0.72rem] uppercase tracking-[0.24em] text-mehendi">
                        Selected
                      </p>
                      <p className="mt-2 font-display text-3xl leading-none text-indigo">
                        {selectedAddOns.length}
                      </p>
                    </div>
                    <div className="rounded-[1.5rem] border border-indigo/10 bg-cream px-4 py-3">
                      <p className="text-[0.72rem] uppercase tracking-[0.24em] text-indigo/48">
                        Subtotal
                      </p>
                      <p className="mt-2 font-display text-3xl leading-none text-indigo">
                        {formatDailyPrice(addOnsSubtotal)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {customizeAddOns.map((option) => {
                    const selected = addOnSelections[option.id];

                    return (
                      <button
                        className={`pressable group rounded-[1.9rem] border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
                          selected
                            ? "border-mehendi/28 bg-[linear-gradient(180deg,rgba(11,123,76,0.08),rgba(249,248,244,0.96))] shadow-[0_22px_44px_-32px_rgba(11,123,76,0.45)]"
                            : "border-ink/8 bg-cream hover:-translate-y-1 hover:border-indigo/14 hover:shadow-[0_22px_44px_-34px_rgba(34,30,71,0.28)]"
                        }`}
                        key={option.id}
                        onClick={() => toggleAddOn(option)}
                        type="button"
                      >
                        <div className="relative overflow-hidden rounded-[1.5rem] border border-ink/8 bg-paper">
                          <div className="relative aspect-[5/4]">
                            <Image
                              alt={option.image.alt}
                              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.06]"
                              fill
                              sizes="(min-width: 1280px) 18vw, (min-width: 768px) 40vw, 100vw"
                              src={option.image.src}
                            />
                          </div>
                          {selected ? (
                            <span className="absolute left-4 top-4 rounded-full border border-mehendi/10 bg-paper/88 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-mehendi backdrop-blur">
                              Added
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
                          <div className="mt-4 flex items-center justify-between gap-3">
                            <p className="text-sm leading-6 text-ink/62">
                              {selected ? "Added to your package" : "Add separately"}
                            </p>
                            <span className="rounded-full border border-indigo/10 bg-paper px-3 py-1 text-[0.72rem] uppercase tracking-[0.18em] text-indigo/58">
                              {formatDailyPrice(option.pricePerDay)}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-[1.8rem] border border-ink/8 bg-cream p-5">
                  <p className="text-[0.72rem] uppercase tracking-[0.24em] text-indigo/48">
                    Add-on summary
                  </p>
                  <p className="mt-3 text-sm leading-7 text-ink/72">
                    {selectedAddOns.length > 0
                      ? selectedAddOns.map((option) => option.selectionSummary).join(" ")
                      : "No add-ons selected yet. Leave this section empty if you only want the core setup."}
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  {allStepsCompleted ? (
                    <Link
                      className="pressable inline-flex items-center justify-center rounded-full bg-marigold px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-18px_rgba(17,17,17,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                      href="/availability"
                    >
                      Continue to availability
                    </Link>
                  ) : (
                    <button
                      className="inline-flex items-center justify-center rounded-full border border-ink/10 bg-paper px-5 py-3 text-sm text-ink/42"
                      disabled
                      type="button"
                    >
                      Finish the core setup first
                    </button>
                  )}

                  <button
                    className="pressable inline-flex items-center justify-center rounded-full border border-ink/10 px-5 py-3 text-sm text-ink/78 transition hover:border-indigo/18 hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                    onClick={resetCustomizeFlow}
                    type="button"
                  >
                    {mode === "standard"
                      ? "Reload standard package"
                      : "Restart custom setup"}
                  </button>
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
                    {mode === "standard" ? (
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/64">
                        The standard package pre-filled this step. Edit it if
                        you want a different mix.
                      </p>
                    ) : null}
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
                      {isLastStep ? "Continue to add-ons" : "Next step"}
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {currentStep.options.map((option) => {
                    const selected = currentSelectedIds.includes(option.id);
                    const optionImages = getOptionImages(option);
                    const activeImageIndex = optionImageIndexes[option.id] ?? 0;
                    const activeImage = optionImages[activeImageIndex] ?? optionImages[0];
                    const hasGallery = optionImages.length > 1;
                    const isCutoutImage = activeImage.src.endsWith(".png");
                    const imageFrameClasses = hasGallery
                      ? "aspect-[4/3] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.99),rgba(244,241,235,0.94))]"
                      : "aspect-[5/4]";

                    return (
                      <div
                        aria-pressed={selected}
                        className={`group cursor-pointer rounded-[1.9rem] border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
                          selected
                            ? "border-mehendi/28 bg-[linear-gradient(180deg,rgba(11,123,76,0.08),rgba(249,248,244,0.96))] shadow-[0_22px_44px_-32px_rgba(11,123,76,0.45)]"
                            : "border-ink/8 bg-cream hover:-translate-y-1 hover:border-indigo/14 hover:shadow-[0_22px_44px_-34px_rgba(34,30,71,0.28)]"
                        }`}
                        key={option.id}
                        onClick={() => handleSelect(currentStep.id, option)}
                        onKeyDown={(event) =>
                          handleSelectableCardKeyDown(event, () =>
                            handleSelect(currentStep.id, option),
                          )
                        }
                        role="button"
                        tabIndex={0}
                      >
                        <div className="relative overflow-hidden rounded-[1.5rem] border border-ink/8 bg-paper">
                          <div className={`relative ${imageFrameClasses}`}>
                            <Image
                              alt={activeImage.alt}
                              className={
                                hasGallery
                                  ? isCutoutImage
                                    ? "object-contain scale-[1.22] drop-shadow-[0_18px_30px_rgba(34,30,71,0.16)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.3]"
                                    : "object-contain p-1 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.08]"
                                  : "object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.06]"
                              }
                              fill
                              sizes="(min-width: 1280px) 18vw, (min-width: 768px) 40vw, 100vw"
                              src={activeImage.src}
                            />
                          </div>
                          {selected ? (
                            <span className="absolute left-4 top-4 rounded-full border border-mehendi/10 bg-paper/88 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-mehendi backdrop-blur">
                              Selected
                            </span>
                          ) : null}
                          {hasGallery ? (
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
                          <p className="mt-4 text-[0.72rem] uppercase tracking-[0.18em] text-indigo/48">
                            {formatDailyPrice(currentStep.pricePerDay)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </section>
    </div>
  );
}
