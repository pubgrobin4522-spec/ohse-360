import { r as reactExports, au as useControllableState, j as jsxRuntimeExports, aw as composeEventHandlers, at as Primitive, av as useComposedRefs, az as useDirection, aA as clamp, ax as useSize, ay as createContextScope, J as cn, aB as useBackendCall, d as useAuth, h as useQueryClient, f as useQuery, B as Button, aC as Building2, T as TriangleAlert, I as Input, aD as ContractorDocStatus, aE as InductionStatus, e as Role, aF as ContractorStatus, aG as PerformanceRating, m as Label, U as Users, n as ue } from "./index-o5KNRZJC.js";
import { B as Badge } from "./badge-drMlJ0Eb.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-BC0tVdjJ.js";
import { u as usePrevious, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DLpeTQN2.js";
import { c as createCollection } from "./index-BgKcp2pS.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-B-XpMixB.js";
import { R as RefreshCw } from "./refresh-cw-C2ML6aao.js";
import { P as Plus } from "./x-CXE19MnU.js";
import { C as CircleCheck } from "./circle-check-BdjlexTo.js";
import { S as ShieldAlert } from "./shield-alert-C2RCAJyr.js";
import { C as ChevronRight } from "./chevron-right-CrBkjx2r.js";
import { F as FileText } from "./file-text-Hl0Hn0dp.js";
import { A as Award } from "./award-zEdQuhfk.js";
import { L as Link2 } from "./link-2-B36HxCUU.js";
var PAGE_KEYS = ["PageUp", "PageDown"];
var ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
var BACK_KEYS = {
  "from-left": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
  "from-right": ["Home", "PageDown", "ArrowDown", "ArrowRight"],
  "from-bottom": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
  "from-top": ["Home", "PageDown", "ArrowUp", "ArrowLeft"]
};
var SLIDER_NAME = "Slider";
var [Collection, useCollection, createCollectionScope] = createCollection(SLIDER_NAME);
var [createSliderContext] = createContextScope(SLIDER_NAME, [
  createCollectionScope
]);
var [SliderProvider, useSliderContext] = createSliderContext(SLIDER_NAME);
var Slider$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      name,
      min = 0,
      max = 100,
      step = 1,
      orientation = "horizontal",
      disabled = false,
      minStepsBetweenThumbs = 0,
      defaultValue = [min],
      value,
      onValueChange = () => {
      },
      onValueCommit = () => {
      },
      inverted = false,
      form,
      ...sliderProps
    } = props;
    const thumbRefs = reactExports.useRef(/* @__PURE__ */ new Set());
    const valueIndexToChangeRef = reactExports.useRef(0);
    const isHorizontal = orientation === "horizontal";
    const SliderOrientation = isHorizontal ? SliderHorizontal : SliderVertical;
    const [values = [], setValues] = useControllableState({
      prop: value,
      defaultProp: defaultValue,
      onChange: (value2) => {
        var _a;
        const thumbs = [...thumbRefs.current];
        (_a = thumbs[valueIndexToChangeRef.current]) == null ? void 0 : _a.focus();
        onValueChange(value2);
      }
    });
    const valuesBeforeSlideStartRef = reactExports.useRef(values);
    function handleSlideStart(value2) {
      const closestIndex = getClosestValueIndex(values, value2);
      updateValues(value2, closestIndex);
    }
    function handleSlideMove(value2) {
      updateValues(value2, valueIndexToChangeRef.current);
    }
    function handleSlideEnd() {
      const prevValue = valuesBeforeSlideStartRef.current[valueIndexToChangeRef.current];
      const nextValue = values[valueIndexToChangeRef.current];
      const hasChanged = nextValue !== prevValue;
      if (hasChanged) onValueCommit(values);
    }
    function updateValues(value2, atIndex, { commit } = { commit: false }) {
      const decimalCount = getDecimalCount(step);
      const snapToStep = roundValue(Math.round((value2 - min) / step) * step + min, decimalCount);
      const nextValue = clamp(snapToStep, [min, max]);
      setValues((prevValues = []) => {
        const nextValues = getNextSortedValues(prevValues, nextValue, atIndex);
        if (hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs * step)) {
          valueIndexToChangeRef.current = nextValues.indexOf(nextValue);
          const hasChanged = String(nextValues) !== String(prevValues);
          if (hasChanged && commit) onValueCommit(nextValues);
          return hasChanged ? nextValues : prevValues;
        } else {
          return prevValues;
        }
      });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SliderProvider,
      {
        scope: props.__scopeSlider,
        name,
        disabled,
        min,
        max,
        valueIndexToChangeRef,
        thumbs: thumbRefs.current,
        values,
        orientation,
        form,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeSlider, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeSlider, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SliderOrientation,
          {
            "aria-disabled": disabled,
            "data-disabled": disabled ? "" : void 0,
            ...sliderProps,
            ref: forwardedRef,
            onPointerDown: composeEventHandlers(sliderProps.onPointerDown, () => {
              if (!disabled) valuesBeforeSlideStartRef.current = values;
            }),
            min,
            max,
            inverted,
            onSlideStart: disabled ? void 0 : handleSlideStart,
            onSlideMove: disabled ? void 0 : handleSlideMove,
            onSlideEnd: disabled ? void 0 : handleSlideEnd,
            onHomeKeyDown: () => !disabled && updateValues(min, 0, { commit: true }),
            onEndKeyDown: () => !disabled && updateValues(max, values.length - 1, { commit: true }),
            onStepKeyDown: ({ event, direction: stepDirection }) => {
              if (!disabled) {
                const isPageKey = PAGE_KEYS.includes(event.key);
                const isSkipKey = isPageKey || event.shiftKey && ARROW_KEYS.includes(event.key);
                const multiplier = isSkipKey ? 10 : 1;
                const atIndex = valueIndexToChangeRef.current;
                const value2 = values[atIndex];
                const stepInDirection = step * multiplier * stepDirection;
                updateValues(value2 + stepInDirection, atIndex, { commit: true });
              }
            }
          }
        ) }) })
      }
    );
  }
);
Slider$1.displayName = SLIDER_NAME;
var [SliderOrientationProvider, useSliderOrientationContext] = createSliderContext(SLIDER_NAME, {
  startEdge: "left",
  endEdge: "right",
  size: "width",
  direction: 1
});
var SliderHorizontal = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      min,
      max,
      dir,
      inverted,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onStepKeyDown,
      ...sliderProps
    } = props;
    const [slider, setSlider] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setSlider(node));
    const rectRef = reactExports.useRef(void 0);
    const direction = useDirection(dir);
    const isDirectionLTR = direction === "ltr";
    const isSlidingFromLeft = isDirectionLTR && !inverted || !isDirectionLTR && inverted;
    function getValueFromPointer(pointerPosition) {
      const rect = rectRef.current || slider.getBoundingClientRect();
      const input = [0, rect.width];
      const output = isSlidingFromLeft ? [min, max] : [max, min];
      const value = linearScale(input, output);
      rectRef.current = rect;
      return value(pointerPosition - rect.left);
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SliderOrientationProvider,
      {
        scope: props.__scopeSlider,
        startEdge: isSlidingFromLeft ? "left" : "right",
        endEdge: isSlidingFromLeft ? "right" : "left",
        direction: isSlidingFromLeft ? 1 : -1,
        size: "width",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SliderImpl,
          {
            dir: direction,
            "data-orientation": "horizontal",
            ...sliderProps,
            ref: composedRefs,
            style: {
              ...sliderProps.style,
              ["--radix-slider-thumb-transform"]: "translateX(-50%)"
            },
            onSlideStart: (event) => {
              const value = getValueFromPointer(event.clientX);
              onSlideStart == null ? void 0 : onSlideStart(value);
            },
            onSlideMove: (event) => {
              const value = getValueFromPointer(event.clientX);
              onSlideMove == null ? void 0 : onSlideMove(value);
            },
            onSlideEnd: () => {
              rectRef.current = void 0;
              onSlideEnd == null ? void 0 : onSlideEnd();
            },
            onStepKeyDown: (event) => {
              const slideDirection = isSlidingFromLeft ? "from-left" : "from-right";
              const isBackKey = BACK_KEYS[slideDirection].includes(event.key);
              onStepKeyDown == null ? void 0 : onStepKeyDown({ event, direction: isBackKey ? -1 : 1 });
            }
          }
        )
      }
    );
  }
);
var SliderVertical = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      min,
      max,
      inverted,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onStepKeyDown,
      ...sliderProps
    } = props;
    const sliderRef = reactExports.useRef(null);
    const ref = useComposedRefs(forwardedRef, sliderRef);
    const rectRef = reactExports.useRef(void 0);
    const isSlidingFromBottom = !inverted;
    function getValueFromPointer(pointerPosition) {
      const rect = rectRef.current || sliderRef.current.getBoundingClientRect();
      const input = [0, rect.height];
      const output = isSlidingFromBottom ? [max, min] : [min, max];
      const value = linearScale(input, output);
      rectRef.current = rect;
      return value(pointerPosition - rect.top);
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SliderOrientationProvider,
      {
        scope: props.__scopeSlider,
        startEdge: isSlidingFromBottom ? "bottom" : "top",
        endEdge: isSlidingFromBottom ? "top" : "bottom",
        size: "height",
        direction: isSlidingFromBottom ? 1 : -1,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SliderImpl,
          {
            "data-orientation": "vertical",
            ...sliderProps,
            ref,
            style: {
              ...sliderProps.style,
              ["--radix-slider-thumb-transform"]: "translateY(50%)"
            },
            onSlideStart: (event) => {
              const value = getValueFromPointer(event.clientY);
              onSlideStart == null ? void 0 : onSlideStart(value);
            },
            onSlideMove: (event) => {
              const value = getValueFromPointer(event.clientY);
              onSlideMove == null ? void 0 : onSlideMove(value);
            },
            onSlideEnd: () => {
              rectRef.current = void 0;
              onSlideEnd == null ? void 0 : onSlideEnd();
            },
            onStepKeyDown: (event) => {
              const slideDirection = isSlidingFromBottom ? "from-bottom" : "from-top";
              const isBackKey = BACK_KEYS[slideDirection].includes(event.key);
              onStepKeyDown == null ? void 0 : onStepKeyDown({ event, direction: isBackKey ? -1 : 1 });
            }
          }
        )
      }
    );
  }
);
var SliderImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSlider,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onHomeKeyDown,
      onEndKeyDown,
      onStepKeyDown,
      ...sliderProps
    } = props;
    const context = useSliderContext(SLIDER_NAME, __scopeSlider);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        ...sliderProps,
        ref: forwardedRef,
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          if (event.key === "Home") {
            onHomeKeyDown(event);
            event.preventDefault();
          } else if (event.key === "End") {
            onEndKeyDown(event);
            event.preventDefault();
          } else if (PAGE_KEYS.concat(ARROW_KEYS).includes(event.key)) {
            onStepKeyDown(event);
            event.preventDefault();
          }
        }),
        onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
          const target = event.target;
          target.setPointerCapture(event.pointerId);
          event.preventDefault();
          if (context.thumbs.has(target)) {
            target.focus();
          } else {
            onSlideStart(event);
          }
        }),
        onPointerMove: composeEventHandlers(props.onPointerMove, (event) => {
          const target = event.target;
          if (target.hasPointerCapture(event.pointerId)) onSlideMove(event);
        }),
        onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
          const target = event.target;
          if (target.hasPointerCapture(event.pointerId)) {
            target.releasePointerCapture(event.pointerId);
            onSlideEnd(event);
          }
        })
      }
    );
  }
);
var TRACK_NAME = "SliderTrack";
var SliderTrack = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSlider, ...trackProps } = props;
    const context = useSliderContext(TRACK_NAME, __scopeSlider);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-disabled": context.disabled ? "" : void 0,
        "data-orientation": context.orientation,
        ...trackProps,
        ref: forwardedRef
      }
    );
  }
);
SliderTrack.displayName = TRACK_NAME;
var RANGE_NAME = "SliderRange";
var SliderRange = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSlider, ...rangeProps } = props;
    const context = useSliderContext(RANGE_NAME, __scopeSlider);
    const orientation = useSliderOrientationContext(RANGE_NAME, __scopeSlider);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const valuesCount = context.values.length;
    const percentages = context.values.map(
      (value) => convertValueToPercentage(value, context.min, context.max)
    );
    const offsetStart = valuesCount > 1 ? Math.min(...percentages) : 0;
    const offsetEnd = 100 - Math.max(...percentages);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-orientation": context.orientation,
        "data-disabled": context.disabled ? "" : void 0,
        ...rangeProps,
        ref: composedRefs,
        style: {
          ...props.style,
          [orientation.startEdge]: offsetStart + "%",
          [orientation.endEdge]: offsetEnd + "%"
        }
      }
    );
  }
);
SliderRange.displayName = RANGE_NAME;
var THUMB_NAME = "SliderThumb";
var SliderThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const getItems = useCollection(props.__scopeSlider);
    const [thumb, setThumb] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setThumb(node));
    const index = reactExports.useMemo(
      () => thumb ? getItems().findIndex((item) => item.ref.current === thumb) : -1,
      [getItems, thumb]
    );
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SliderThumbImpl, { ...props, ref: composedRefs, index });
  }
);
var SliderThumbImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSlider, index, name, ...thumbProps } = props;
    const context = useSliderContext(THUMB_NAME, __scopeSlider);
    const orientation = useSliderOrientationContext(THUMB_NAME, __scopeSlider);
    const [thumb, setThumb] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setThumb(node));
    const isFormControl = thumb ? context.form || !!thumb.closest("form") : true;
    const size = useSize(thumb);
    const value = context.values[index];
    const percent = value === void 0 ? 0 : convertValueToPercentage(value, context.min, context.max);
    const label = getLabel(index, context.values.length);
    const orientationSize = size == null ? void 0 : size[orientation.size];
    const thumbInBoundsOffset = orientationSize ? getThumbInBoundsOffset(orientationSize, percent, orientation.direction) : 0;
    reactExports.useEffect(() => {
      if (thumb) {
        context.thumbs.add(thumb);
        return () => {
          context.thumbs.delete(thumb);
        };
      }
    }, [thumb, context.thumbs]);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        style: {
          transform: "var(--radix-slider-thumb-transform)",
          position: "absolute",
          [orientation.startEdge]: `calc(${percent}% + ${thumbInBoundsOffset}px)`
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.ItemSlot, { scope: props.__scopeSlider, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Primitive.span,
            {
              role: "slider",
              "aria-label": props["aria-label"] || label,
              "aria-valuemin": context.min,
              "aria-valuenow": value,
              "aria-valuemax": context.max,
              "aria-orientation": context.orientation,
              "data-orientation": context.orientation,
              "data-disabled": context.disabled ? "" : void 0,
              tabIndex: context.disabled ? void 0 : 0,
              ...thumbProps,
              ref: composedRefs,
              style: value === void 0 ? { display: "none" } : props.style,
              onFocus: composeEventHandlers(props.onFocus, () => {
                context.valueIndexToChangeRef.current = index;
              })
            }
          ) }),
          isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            SliderBubbleInput,
            {
              name: name ?? (context.name ? context.name + (context.values.length > 1 ? "[]" : "") : void 0),
              form: context.form,
              value
            },
            index
          )
        ]
      }
    );
  }
);
SliderThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "RadioBubbleInput";
var SliderBubbleInput = reactExports.forwardRef(
  ({ __scopeSlider, value, ...props }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevValue = usePrevious(value);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(inputProto, "value");
      const setValue = descriptor.set;
      if (prevValue !== value && setValue) {
        const event = new Event("input", { bubbles: true });
        setValue.call(input, value);
        input.dispatchEvent(event);
      }
    }, [prevValue, value]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.input,
      {
        style: { display: "none" },
        ...props,
        ref: composedRefs,
        defaultValue: value
      }
    );
  }
);
SliderBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getNextSortedValues(prevValues = [], nextValue, atIndex) {
  const nextValues = [...prevValues];
  nextValues[atIndex] = nextValue;
  return nextValues.sort((a, b) => a - b);
}
function convertValueToPercentage(value, min, max) {
  const maxSteps = max - min;
  const percentPerStep = 100 / maxSteps;
  const percentage = percentPerStep * (value - min);
  return clamp(percentage, [0, 100]);
}
function getLabel(index, totalValues) {
  if (totalValues > 2) {
    return `Value ${index + 1} of ${totalValues}`;
  } else if (totalValues === 2) {
    return ["Minimum", "Maximum"][index];
  } else {
    return void 0;
  }
}
function getClosestValueIndex(values, nextValue) {
  if (values.length === 1) return 0;
  const distances = values.map((value) => Math.abs(value - nextValue));
  const closestDistance = Math.min(...distances);
  return distances.indexOf(closestDistance);
}
function getThumbInBoundsOffset(width, left, direction) {
  const halfWidth = width / 2;
  const halfPercent = 50;
  const offset = linearScale([0, halfPercent], [0, halfWidth]);
  return (halfWidth - offset(left) * direction) * direction;
}
function getStepsBetweenValues(values) {
  return values.slice(0, -1).map((value, index) => values[index + 1] - value);
}
function hasMinStepsBetweenValues(values, minStepsBetweenValues) {
  if (minStepsBetweenValues > 0) {
    const stepsBetweenValues = getStepsBetweenValues(values);
    const actualMinStepsBetweenValues = Math.min(...stepsBetweenValues);
    return actualMinStepsBetweenValues >= minStepsBetweenValues;
  }
  return true;
}
function linearScale(input, output) {
  return (value) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}
function getDecimalCount(value) {
  return (String(value).split(".")[1] || "").length;
}
function roundValue(value, decimalCount) {
  const rounder = Math.pow(10, decimalCount);
  return Math.round(value * rounder) / rounder;
}
var Root = Slider$1;
var Track = SliderTrack;
var Range = SliderRange;
var Thumb = SliderThumb;
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}) {
  const _values = reactExports.useMemo(
    () => Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max],
    [value, defaultValue, min, max]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Root,
    {
      "data-slot": "slider",
      defaultValue,
      value,
      min,
      max,
      className: cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Track,
          {
            "data-slot": "slider-track",
            className: cn(
              "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
            ),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Range,
              {
                "data-slot": "slider-range",
                className: cn(
                  "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
                )
              }
            )
          }
        ),
        Array.from({ length: _values.length }, (value2, _) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Thumb,
          {
            "data-slot": "slider-thumb",
            className: "border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          },
          `${value2}`
        ))
      ]
    }
  );
}
function canManage(role) {
  return [Role.SafetyOfficer, Role.SystemAdmin, Role.ContractorAdmin].includes(
    role
  );
}
function fmtDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString();
}
function docStatusColor(s) {
  if (s === ContractorDocStatus.Valid) return "text-emerald-400";
  if (s === ContractorDocStatus.Expiring) return "text-amber-400";
  return "text-red-400";
}
function contractorStatusBadge(s) {
  if (s === ContractorStatus.Active)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", children: "Active" });
  if (s === ContractorStatus.Expired)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-amber-500/20 text-amber-400 border-amber-500/30", children: "Expired" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-red-500/20 text-red-400 border-red-500/30", children: "Blacklisted" });
}
function inductionBadge(s) {
  if (s === InductionStatus.Pass)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", children: "Pass" });
  if (s === InductionStatus.Fail)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-red-500/20 text-red-400 border-red-500/30", children: "Fail" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-slate-500/20 text-slate-400 border-slate-500/30", children: "Pending" });
}
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = "cyan"
}) {
  const colors = {
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    red: "text-red-400 bg-red-500/10 border-red-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex gap-4 items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `rounded-lg border p-3 ${colors[accent]}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground", children: value }),
      sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: sub })
    ] })
  ] });
}
function RegisterContractorDialog({
  open,
  onClose,
  onSuccess
}) {
  const { call } = useBackendCall();
  const [form, setForm] = reactExports.useState({
    companyName: "",
    registrationNumber: "",
    contactPerson: "",
    email: "",
    phone: "",
    typeOfWork: "",
    contractStartDate: "",
    contractEndDate: ""
  });
  const [saving, setSaving] = reactExports.useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await call((a, t) => a.createContractor(t, form));
      if ("err" in r) throw new Error(r.err);
      ue.success(`Contractor registered: ${r.ok}`);
      onSuccess();
      onClose();
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Failed to register");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-slate-900 border-white/10 max-w-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-foreground", children: "Register New Contractor" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [
        ["companyName", "Company Name"],
        ["registrationNumber", "Registration Number"],
        ["contactPerson", "Contact Person"],
        ["email", "Email"],
        ["phone", "Phone"],
        ["typeOfWork", "Type of Work"],
        ["contractStartDate", "Contract Start Date"],
        ["contractEndDate", "Contract End Date"]
      ].map(([k, lbl]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1 block", children: lbl }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: k.includes("Date") ? "date" : "text",
            value: form[k],
            onChange: set(k),
            required: true,
            className: "bg-white/5 border-white/10 text-foreground h-8 text-sm"
          }
        )
      ] }, k)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            className: "border-white/10",
            onClick: onClose,
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: saving,
            className: "bg-cyan-600 hover:bg-cyan-500 text-white",
            children: saving ? "Registering…" : "Register"
          }
        )
      ] })
    ] })
  ] }) });
}
const DOC_TYPES = [
  "Trade License",
  "Insurance Certificate",
  "DOSH Registration",
  "Safety Plan"
];
function AddDocumentDialog({
  open,
  contractorId,
  onClose,
  onSuccess
}) {
  const { call } = useBackendCall();
  const [docType, setDocType] = reactExports.useState(DOC_TYPES[0]);
  const [expiryDate, setExpiryDate] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await call(
        (a, t) => a.addContractorDocument(t, contractorId, docType, expiryDate)
      );
      if ("err" in r) throw new Error(r.err);
      ue.success("Document added");
      onSuccess();
      onClose();
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-slate-900 border-white/10 max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-foreground", children: "Add Document" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1 block", children: "Document Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: docType, onValueChange: setDocType, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-white/5 border-white/10 text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-slate-900 border-white/10", children: DOC_TYPES.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d, children: d }, d)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1 block", children: "Expiry Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "date",
            value: expiryDate,
            onChange: (e) => setExpiryDate(e.target.value),
            required: true,
            className: "bg-white/5 border-white/10 text-foreground"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            className: "border-white/10",
            onClick: onClose,
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: saving,
            className: "bg-cyan-600 hover:bg-cyan-500 text-white",
            children: saving ? "Adding…" : "Add"
          }
        )
      ] })
    ] })
  ] }) });
}
function AddEmployeeDialog({
  open,
  contractorId,
  onClose,
  onSuccess
}) {
  const { call } = useBackendCall();
  const [form, setForm] = reactExports.useState({ empName: "", idNumber: "", trade: "" });
  const [saving, setSaving] = reactExports.useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await call(
        (a, t) => a.addContractorEmployee(t, contractorId, {
          ...form,
          inductionStatus: InductionStatus.Pending,
          inductionDate: void 0,
          certificateNumber: void 0
        })
      );
      if ("err" in r) throw new Error(r.err);
      ue.success("Employee added");
      onSuccess();
      onClose();
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-slate-900 border-white/10 max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-foreground", children: "Add Contractor Employee" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3 mt-2", children: [
      ["empName", "idNumber", "trade"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1 block capitalize", children: k === "empName" ? "Employee Name" : k === "idNumber" ? "ID Number" : "Trade / Skill" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: form[k],
            onChange: set(k),
            required: true,
            className: "bg-white/5 border-white/10 text-foreground"
          }
        )
      ] }, k)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            className: "border-white/10",
            onClick: onClose,
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: saving,
            className: "bg-cyan-600 hover:bg-cyan-500 text-white",
            children: saving ? "Adding…" : "Add"
          }
        )
      ] })
    ] })
  ] }) });
}
function ContractorDetail({
  contractor,
  onRefresh
}) {
  const { call } = useBackendCall();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [showAddDoc, setShowAddDoc] = reactExports.useState(false);
  const [showAddEmp, setShowAddEmp] = reactExports.useState(false);
  const [inductingEmp, setInductingEmp] = reactExports.useState(null);
  const [inductResult, setInductResult] = reactExports.useState({});
  const [perfForm, setPerfForm] = reactExports.useState({
    safetyScore: 75,
    incidentCount: 0,
    nearMissCount: 0,
    ptwCompliance: 90,
    trainingCompliance: 85,
    overallRating: PerformanceRating.Good
  });
  const [savingPerf, setSavingPerf] = reactExports.useState(false);
  const [savingStatus, setSavingStatus] = reactExports.useState(false);
  const canEdit = user ? canManage(user.role) : false;
  const linkedPtwQuery = useQuery({
    queryKey: ["ptw-list"],
    queryFn: async () => {
      const r = await call((a, t) => a.listPTWs(t, null, null));
      if ("err" in r) throw new Error(r.err);
      return r.ok;
    }
  });
  const linkedPtws = (linkedPtwQuery.data ?? []).filter(
    (p) => contractor.linkedPtwNumbers.includes(p.permitNumber)
  );
  const updateStatus = async (status) => {
    setSavingStatus(true);
    try {
      const r = await call(
        (a, t) => a.updateContractorStatus(t, contractor.contractorId, status)
      );
      if ("err" in r) throw new Error(r.err);
      ue.success("Status updated");
      qc.invalidateQueries({ queryKey: ["contractors"] });
      qc.invalidateQueries({
        queryKey: ["contractor", contractor.contractorId]
      });
      onRefresh();
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setSavingStatus(false);
    }
  };
  const recordInduction = async (idNumber, passed) => {
    try {
      const r = await call(
        (a, t) => a.recordInduction(t, contractor.contractorId, idNumber, passed)
      );
      if ("err" in r) throw new Error(r.err);
      setInductResult((prev) => ({
        ...prev,
        [idNumber]: passed ? "ok" in r ? r.ok : "CONIND-PASS" : "FAIL"
      }));
      ue.success(
        passed ? `Induction passed — cert: ${"ok" in r ? r.ok : ""}` : "Induction failed — recorded"
      );
      qc.invalidateQueries({ queryKey: ["contractors"] });
      qc.invalidateQueries({
        queryKey: ["contractor", contractor.contractorId]
      });
      onRefresh();
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setInductingEmp(null);
    }
  };
  const submitPerf = async (e) => {
    e.preventDefault();
    setSavingPerf(true);
    try {
      const r = await call(
        (a, t) => a.recordContractorPerformance(t, contractor.contractorId, {
          safetyScore: BigInt(perfForm.safetyScore),
          incidentCount: BigInt(perfForm.incidentCount),
          nearMissCount: BigInt(perfForm.nearMissCount),
          ptwCompliance: perfForm.ptwCompliance,
          trainingCompliance: perfForm.trainingCompliance,
          overallRating: perfForm.overallRating,
          evaluatedAt: BigInt(Date.now()) * 1000000n,
          evaluatedBy: BigInt((user == null ? void 0 : user.employeeId) ?? 0)
        })
      );
      if ("err" in r) throw new Error(r.err);
      ue.success("Performance evaluation recorded");
      qc.invalidateQueries({
        queryKey: ["contractor", contractor.contractorId]
      });
      onRefresh();
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setSavingPerf(false);
    }
  };
  const docAlerts = contractor.documents.filter(
    (d) => d.status !== ContractorDocStatus.Valid
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-b border-white/10 flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground", children: contractor.companyName }),
          contractorStatusBadge(contractor.status)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
          contractor.contractorId,
          " · ",
          contractor.typeOfWork
        ] })
      ] }),
      docAlerts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-amber-400 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
        docAlerts.length,
        " document alert",
        docAlerts.length > 1 ? "s" : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "info", className: "p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "bg-white/5 border border-white/10 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "info", "data-ocid": "contractor.tab.info", children: "Company Info" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "docs", "data-ocid": "contractor.tab.docs", children: [
          "Documents",
          " ",
          docAlerts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 bg-amber-500/20 text-amber-400 rounded-full px-1.5 text-xs", children: docAlerts.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "employees", "data-ocid": "contractor.tab.employees", children: "Employees" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "ptw", "data-ocid": "contractor.tab.ptw", children: "Linked PTWs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TabsTrigger,
          {
            value: "performance",
            "data-ocid": "contractor.tab.performance",
            children: "Performance"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "info", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [
          ["Registration No.", contractor.registrationNumber],
          ["Contact Person", contractor.contactPerson],
          ["Email", contractor.email],
          ["Phone", contractor.phone],
          ["Type of Work", contractor.typeOfWork],
          ["Contract Start", contractor.contractStartDate],
          ["Contract End", contractor.contractEndDate],
          ["Created", fmtDate(contractor.createdAt)]
        ].map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-white/5 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: k }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-medium", children: v })
        ] }, k)) }),
        canEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-2 block", children: "Update Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: [
            ContractorStatus.Active,
            ContractorStatus.Expired,
            ContractorStatus.Blacklisted
          ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              disabled: savingStatus || contractor.status === s,
              onClick: () => updateStatus(s),
              "data-ocid": `contractor.status_${s.toLowerCase()}_button`,
              className: s === ContractorStatus.Active ? "bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/50" : s === ContractorStatus.Expired ? "bg-amber-600/30 text-amber-400 border border-amber-500/30 hover:bg-amber-600/50" : "bg-red-600/30 text-red-400 border border-red-500/30 hover:bg-red-600/50",
              children: [
                s === contractor.status && "✓ ",
                s
              ]
            },
            s
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "docs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-foreground", children: "Compliance Documents" }),
          canEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              onClick: () => setShowAddDoc(true),
              className: "bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-600/40",
              "data-ocid": "contractor.add_doc_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1" }),
                " Add Document"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: DOC_TYPES.map((dt) => {
          const doc = contractor.documents.find((d) => d.docType === dt);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `flex items-center justify-between rounded-lg border p-3 ${!doc ? "border-white/10 bg-white/5" : doc.status === ContractorDocStatus.Expired ? "border-red-500/30 bg-red-500/5" : doc.status === ContractorDocStatus.Expiring ? "border-amber-500/30 bg-amber-500/5" : "border-emerald-500/20 bg-emerald-500/5"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    FileText,
                    {
                      className: `h-4 w-4 ${doc ? docStatusColor(doc.status) : "text-muted-foreground"}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: dt }),
                    doc ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      "Expires: ",
                      doc.expiryDate
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Not uploaded" })
                  ] })
                ] }),
                doc ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    className: doc.status === ContractorDocStatus.Valid ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : doc.status === ContractorDocStatus.Expiring ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-red-500/20 text-red-400 border-red-500/30",
                    children: doc.status
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-slate-500/20 text-slate-400 border-slate-500/30", children: "Missing" })
              ]
            },
            dt
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AddDocumentDialog,
          {
            open: showAddDoc,
            contractorId: contractor.contractorId,
            onClose: () => setShowAddDoc(false),
            onSuccess: onRefresh
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "employees", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-foreground", children: "Registered Employees" }),
          canEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              onClick: () => setShowAddEmp(true),
              className: "bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-600/40",
              "data-ocid": "contractor.add_employee_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1" }),
                " Add Employee"
              ]
            }
          )
        ] }),
        contractor.employees.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "text-center py-10 text-muted-foreground",
            "data-ocid": "contractor.employees.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-8 w-8 mx-auto mb-2 opacity-30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No employees registered" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: contractor.employees.map((emp, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": `contractor.employee.item.${i + 1}`,
            className: `rounded-lg border p-3 ${emp.inductionStatus === InductionStatus.Fail ? "border-red-500/30 bg-red-500/5" : "border-white/10 bg-white/5"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: emp.empName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  emp.idNumber,
                  " · ",
                  emp.trade
                ] }),
                emp.inductionDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  "Inducted: ",
                  emp.inductionDate
                ] }),
                emp.certificateNumber && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-emerald-400 flex items-center gap-1 mt-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-3 w-3" }),
                  " ",
                  emp.certificateNumber
                ] }),
                inductResult[emp.idNumber] && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: `text-xs mt-1 font-medium ${inductResult[emp.idNumber] === "FAIL" ? "text-red-400" : "text-emerald-400"}`,
                    children: inductResult[emp.idNumber] === "FAIL" ? "✗ Induction Failed" : `✓ Cert: ${inductResult[emp.idNumber]}`
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
                inductionBadge(emp.inductionStatus),
                canEdit && emp.inductionStatus === InductionStatus.Pending && (inductingEmp === emp.idNumber ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      onClick: () => recordInduction(emp.idNumber, true),
                      "data-ocid": `contractor.induction_pass_button.${i + 1}`,
                      className: "bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/50 h-7 text-xs",
                      children: "Pass"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      onClick: () => recordInduction(emp.idNumber, false),
                      "data-ocid": `contractor.induction_fail_button.${i + 1}`,
                      className: "bg-red-600/30 text-red-400 border border-red-500/30 hover:bg-red-600/50 h-7 text-xs",
                      children: "Fail"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      variant: "ghost",
                      onClick: () => setInductingEmp(null),
                      className: "h-7 text-xs text-muted-foreground",
                      children: "✕"
                    }
                  )
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    onClick: () => setInductingEmp(emp.idNumber),
                    "data-ocid": `contractor.record_induction_button.${i + 1}`,
                    className: "bg-white/10 text-foreground border border-white/20 hover:bg-white/20 h-7 text-xs",
                    children: "Record Induction"
                  }
                ))
              ] })
            ] })
          },
          emp.idNumber
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AddEmployeeDialog,
          {
            open: showAddEmp,
            contractorId: contractor.contractorId,
            onClose: () => setShowAddEmp(false),
            onSuccess: onRefresh
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "ptw", children: linkedPtws.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center py-10 text-muted-foreground",
          "data-ocid": "contractor.ptw.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-8 w-8 mx-auto mb-2 opacity-30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No linked permits" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: linkedPtws.map((ptw, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": `contractor.ptw.item.${i + 1}`,
          className: "flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: ptw.permitNumber }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                ptw.permitType,
                " · ",
                ptw.location
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                ptw.startDateTime,
                " → ",
                ptw.endDateTime
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-xs", children: ptw.status })
          ]
        },
        ptw.permitNumber
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "performance", children: [
        contractor.performance && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4 mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide", children: [
            "Latest Evaluation —",
            " ",
            fmtDate(contractor.performance.evaluatedAt)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: [
            ["Safety Score", `${contractor.performance.safetyScore}/100`],
            ["Incidents", String(contractor.performance.incidentCount)],
            ["Near Misses", String(contractor.performance.nearMissCount)],
            [
              "PTW Compliance",
              `${contractor.performance.ptwCompliance}%`
            ],
            [
              "Training Compliance",
              `${contractor.performance.trainingCompliance}%`
            ],
            ["Overall Rating", contractor.performance.overallRating]
          ].map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded bg-white/5 p-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: k }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `text-sm font-semibold ${k === "Overall Rating" ? contractor.performance.overallRating === PerformanceRating.Excellent ? "text-emerald-400" : contractor.performance.overallRating === PerformanceRating.Good ? "text-cyan-400" : contractor.performance.overallRating === PerformanceRating.Fair ? "text-amber-400" : "text-red-400" : "text-foreground"}`,
                children: v
              }
            )
          ] }, k)) })
        ] }),
        canEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submitPerf, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-foreground", children: "Submit New Evaluation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Safety Compliance Score" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-cyan-400", children: [
                perfForm.safetyScore,
                "/100"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Slider,
              {
                min: 0,
                max: 100,
                step: 1,
                value: [perfForm.safetyScore],
                onValueChange: ([v]) => setPerfForm((f) => ({ ...f, safetyScore: v })),
                className: "accent-cyan-500",
                "data-ocid": "contractor.performance.safety_score_slider"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            [
              ["incidentCount", "Incidents this period"],
              ["nearMissCount", "Near Misses"]
            ].map(([k, lbl]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1 block", children: lbl }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 0,
                  value: perfForm[k],
                  onChange: (e) => setPerfForm((f) => ({
                    ...f,
                    [k]: Number(e.target.value)
                  })),
                  className: "bg-white/5 border-white/10 text-foreground"
                }
              )
            ] }, k)),
            [
              ["ptwCompliance", "PTW Compliance %"],
              ["trainingCompliance", "Training Compliance %"]
            ].map(([k, lbl]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1 block", children: lbl }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 0,
                  max: 100,
                  value: perfForm[k],
                  onChange: (e) => setPerfForm((f) => ({
                    ...f,
                    [k]: Number(e.target.value)
                  })),
                  className: "bg-white/5 border-white/10 text-foreground"
                }
              )
            ] }, k))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-2 block", children: "Overall Rating" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: [
              PerformanceRating.Poor,
              PerformanceRating.Fair,
              PerformanceRating.Good,
              PerformanceRating.Excellent
            ].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setPerfForm((f) => ({ ...f, overallRating: r })),
                "data-ocid": `contractor.performance.rating_${r.toLowerCase()}`,
                className: `px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${perfForm.overallRating === r ? r === PerformanceRating.Excellent ? "bg-emerald-600/40 text-emerald-300 border-emerald-500/50" : r === PerformanceRating.Good ? "bg-cyan-600/40 text-cyan-300 border-cyan-500/50" : r === PerformanceRating.Fair ? "bg-amber-600/40 text-amber-300 border-amber-500/50" : "bg-red-600/40 text-red-300 border-red-500/50" : "bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10"}`,
                children: r
              },
              r
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: savingPerf,
              className: "bg-cyan-600 hover:bg-cyan-500 text-white w-full",
              "data-ocid": "contractor.performance.submit_button",
              children: savingPerf ? "Saving…" : "Submit Evaluation"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function ContractorPage() {
  const { call } = useBackendCall();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = reactExports.useState("");
  const [selected, setSelected] = reactExports.useState(null);
  const [showRegister, setShowRegister] = reactExports.useState(false);
  const canManageRole = user ? canManage(user.role) : false;
  const statsQuery = useQuery({
    queryKey: ["contractor-stats"],
    queryFn: async () => {
      const r = await call((a, t) => a.getContractorStats(t));
      if ("err" in r) throw new Error(r.err);
      return r.ok;
    }
  });
  const listQuery = useQuery({
    queryKey: ["contractors"],
    queryFn: async () => {
      const r = await call((a, t) => a.listContractors(t));
      if ("err" in r) throw new Error(r.err);
      return r.ok;
    }
  });
  const refreshSelected = reactExports.useCallback(async () => {
    if (!selected) return;
    try {
      const r = await call((a, t) => a.getContractor(t, selected.contractorId));
      if ("ok" in r) setSelected(r.ok);
    } catch {
    }
    qc.invalidateQueries({ queryKey: ["contractors"] });
    qc.invalidateQueries({ queryKey: ["contractor-stats"] });
  }, [selected, call, qc]);
  const contractors = listQuery.data ?? [];
  const filtered = contractors.filter(
    (c) => !search || c.companyName.toLowerCase().includes(search.toLowerCase()) || c.typeOfWork.toLowerCase().includes(search.toLowerCase()) || c.contractorId.toLowerCase().includes(search.toLowerCase())
  );
  const stats = statsQuery.data;
  function inductionPct(c) {
    if (c.employees.length === 0) return 100;
    const passed = c.employees.filter(
      (e) => e.inductionStatus === InductionStatus.Pass
    ).length;
    return Math.round(passed / c.employees.length * 100);
  }
  function docStatus(c) {
    if (c.documents.some((d) => d.status === ContractorDocStatus.Expired))
      return ContractorDocStatus.Expired;
    if (c.documents.some((d) => d.status === ContractorDocStatus.Expiring))
      return ContractorDocStatus.Expiring;
    if (c.documents.length > 0) return ContractorDocStatus.Valid;
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", "data-ocid": "contractor.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-6 max-w-7xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground tracking-tight", children: "Contractor Safety Management" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage contractor companies, documents, and compliance" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              variant: "outline",
              onClick: () => {
                qc.invalidateQueries({ queryKey: ["contractors"] });
                qc.invalidateQueries({ queryKey: ["contractor-stats"] });
              },
              className: "border-white/10 text-muted-foreground hover:text-foreground",
              "data-ocid": "contractor.refresh_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" })
            }
          ),
          canManageRole && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              onClick: () => setShowRegister(true),
              className: "bg-cyan-600 hover:bg-cyan-500 text-white",
              "data-ocid": "contractor.register_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5" }),
                " Register New Contractor"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            icon: Building2,
            label: "Active Contractors",
            value: stats ? Number(stats.activeCount) : "—",
            accent: "cyan"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            icon: TriangleAlert,
            label: "Document Alerts",
            value: stats ? Number(stats.expiringDocs) : "—",
            accent: "red"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            icon: CircleCheck,
            label: "Induction Compliance",
            value: stats ? `${stats.inductionCompliance}%` : "—",
            accent: "emerald"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            icon: ShieldAlert,
            label: "Incidents (All Time)",
            value: stats ? Number(stats.incidentCount) : "—",
            accent: "amber"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Search contractors…",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              className: "bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground",
              "data-ocid": "contractor.search_input"
            }
          ),
          listQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-20 rounded-xl bg-white/5 animate-pulse"
            },
            i
          )) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "text-center py-12 text-muted-foreground",
              "data-ocid": "contractor.list.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-10 w-10 mx-auto mb-3 opacity-20" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No contractors found" }),
                canManageRole && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    onClick: () => setShowRegister(true),
                    className: "mt-3 bg-cyan-600/20 text-cyan-400 border border-cyan-500/30",
                    "data-ocid": "contractor.list.register_cta",
                    children: "Register First Contractor"
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: filtered.map((c, i) => {
            const ds = docStatus(c);
            const ipc = inductionPct(c);
            const isActive = (selected == null ? void 0 : selected.contractorId) === c.contractorId;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setSelected(c),
                "data-ocid": `contractor.list.item.${i + 1}`,
                className: `w-full text-left rounded-xl border p-3 transition-colors ${isActive ? "border-cyan-500/50 bg-cyan-500/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: c.companyName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: c.typeOfWork }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: c.contractorId })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1 flex-shrink-0", children: [
                      contractorStatusBadge(c.status),
                      ds && ds !== ContractorDocStatus.Valid && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Badge,
                        {
                          className: `text-xs ${ds === ContractorDocStatus.Expired ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"}`,
                          children: [
                            "Doc ",
                            ds
                          ]
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-3 text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: ipc < 80 ? "text-amber-400" : "text-emerald-400",
                        children: [
                          "Induction ",
                          ipc,
                          "%"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      c.employees.length,
                      " emp"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Ends ",
                      c.contractEndDate
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-auto h-3.5 w-3.5 opacity-50" })
                  ] })
                ]
              },
              c.contractorId
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-3", children: selected ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          ContractorDetail,
          {
            contractor: selected,
            onRefresh: refreshSelected
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground",
            "data-ocid": "contractor.detail.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-12 w-12 mb-3 opacity-20" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Select a contractor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", children: "Click any row to view details" })
            ]
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RegisterContractorDialog,
      {
        open: showRegister,
        onClose: () => setShowRegister(false),
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ["contractors"] });
          qc.invalidateQueries({ queryKey: ["contractor-stats"] });
        }
      }
    )
  ] });
}
export {
  ContractorPage as default
};
