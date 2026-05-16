import { a as createLucideIcon, R as React, b as clsx, r as reactExports, d as useAuth, u as useBackend, h as useQueryClient, e as Role, f as useQuery, j as jsxRuntimeExports, ab as Leaf, B as Button, i as useMutation, ac as WasteType, I as Input, ad as AirPollutant, ae as AirEmissionSource, af as WaterSource, ag as EffluentParameter, ah as EffluentType, T as TriangleAlert, ai as EnergyType, aj as CarbonScope, m as Label } from "./index-o5KNRZJC.js";
import { B as Badge } from "./badge-drMlJ0Eb.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-BvYOjhYq.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-BC0tVdjJ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DLpeTQN2.js";
import { S as Skeleton } from "./skeleton-FWJuhcbn.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-B-XpMixB.js";
import { R as RefreshCw } from "./refresh-cw-C2ML6aao.js";
import { F as Flame, W as Wind } from "./wind-BdNYi-u1.js";
import { Z as Zap } from "./zap-BiKxaMoq.js";
import { f as filterProps, L as Layer, q as max, r as isNumber, s as Curve, A as Animate, i as interpolateNumber, u as isNil, v as isNan, b as isEqual, w as hasClipDot, c as LabelList, x as uniqueId, d as isFunction, G as Global, j as getValueByDataKey, y as getCateCoordinateOfLine, D as Dot, n as generateCategoricalChart, z as formatAxisMap, R as ResponsiveContainer, T as Tooltip, C as Cell, E as Legend, B as Bar } from "./generateCategoricalChart-BOnoDJkg.js";
import { L as LineChart, a as Line } from "./LineChart-D3VuIIPh.js";
import { X as XAxis, Y as YAxis, C as CartesianGrid, B as BarChart } from "./BarChart-DuUEcQky.js";
import { b as PieChart, c as Pie } from "./PieChart-CecCgq1x.js";
import { P as Plus } from "./x-CXE19MnU.js";
import { C as CircleCheckBig } from "./circle-check-big-CmR7_H-4.js";
import "./index-BgKcp2pS.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242", key: "1pljnt" }],
  ["path", { d: "M16 14v6", key: "1j4efv" }],
  ["path", { d: "M8 14v6", key: "17c4r9" }],
  ["path", { d: "M12 16v6", key: "c8a4gj" }]
];
const CloudRain = createLucideIcon("cloud-rain", __iconNode);
var _excluded = ["layout", "type", "stroke", "connectNulls", "isRange", "ref"], _excluded2 = ["key"];
var _Area;
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", { writable: false });
  return Constructor;
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch (t2) {
  }
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct2() {
    return !!t;
  })();
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
  Object.defineProperty(subClass, "prototype", { writable: false });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf(o, p);
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(t);
}
var Area = /* @__PURE__ */ function(_PureComponent) {
  function Area2() {
    var _this;
    _classCallCheck(this, Area2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, Area2, [].concat(args));
    _defineProperty(_this, "state", {
      isAnimationFinished: true
    });
    _defineProperty(_this, "id", uniqueId("recharts-area-"));
    _defineProperty(_this, "handleAnimationEnd", function() {
      var onAnimationEnd = _this.props.onAnimationEnd;
      _this.setState({
        isAnimationFinished: true
      });
      if (isFunction(onAnimationEnd)) {
        onAnimationEnd();
      }
    });
    _defineProperty(_this, "handleAnimationStart", function() {
      var onAnimationStart = _this.props.onAnimationStart;
      _this.setState({
        isAnimationFinished: false
      });
      if (isFunction(onAnimationStart)) {
        onAnimationStart();
      }
    });
    return _this;
  }
  _inherits(Area2, _PureComponent);
  return _createClass(Area2, [{
    key: "renderDots",
    value: function renderDots(needClip, clipDot, clipPathId) {
      var isAnimationActive = this.props.isAnimationActive;
      var isAnimationFinished = this.state.isAnimationFinished;
      if (isAnimationActive && !isAnimationFinished) {
        return null;
      }
      var _this$props = this.props, dot = _this$props.dot, points = _this$props.points, dataKey = _this$props.dataKey;
      var areaProps = filterProps(this.props, false);
      var customDotProps = filterProps(dot, true);
      var dots = points.map(function(entry, i) {
        var dotProps = _objectSpread(_objectSpread(_objectSpread({
          key: "dot-".concat(i),
          r: 3
        }, areaProps), customDotProps), {}, {
          index: i,
          cx: entry.x,
          cy: entry.y,
          dataKey,
          value: entry.value,
          payload: entry.payload,
          points
        });
        return Area2.renderDotItem(dot, dotProps);
      });
      var dotsProps = {
        clipPath: needClip ? "url(#clipPath-".concat(clipDot ? "" : "dots-").concat(clipPathId, ")") : null
      };
      return /* @__PURE__ */ React.createElement(Layer, _extends({
        className: "recharts-area-dots"
      }, dotsProps), dots);
    }
  }, {
    key: "renderHorizontalRect",
    value: function renderHorizontalRect(alpha) {
      var _this$props2 = this.props, baseLine = _this$props2.baseLine, points = _this$props2.points, strokeWidth = _this$props2.strokeWidth;
      var startX = points[0].x;
      var endX = points[points.length - 1].x;
      var width = alpha * Math.abs(startX - endX);
      var maxY = max(points.map(function(entry) {
        return entry.y || 0;
      }));
      if (isNumber(baseLine) && typeof baseLine === "number") {
        maxY = Math.max(baseLine, maxY);
      } else if (baseLine && Array.isArray(baseLine) && baseLine.length) {
        maxY = Math.max(max(baseLine.map(function(entry) {
          return entry.y || 0;
        })), maxY);
      }
      if (isNumber(maxY)) {
        return /* @__PURE__ */ React.createElement("rect", {
          x: startX < endX ? startX : startX - width,
          y: 0,
          width,
          height: Math.floor(maxY + (strokeWidth ? parseInt("".concat(strokeWidth), 10) : 1))
        });
      }
      return null;
    }
  }, {
    key: "renderVerticalRect",
    value: function renderVerticalRect(alpha) {
      var _this$props3 = this.props, baseLine = _this$props3.baseLine, points = _this$props3.points, strokeWidth = _this$props3.strokeWidth;
      var startY = points[0].y;
      var endY = points[points.length - 1].y;
      var height = alpha * Math.abs(startY - endY);
      var maxX = max(points.map(function(entry) {
        return entry.x || 0;
      }));
      if (isNumber(baseLine) && typeof baseLine === "number") {
        maxX = Math.max(baseLine, maxX);
      } else if (baseLine && Array.isArray(baseLine) && baseLine.length) {
        maxX = Math.max(max(baseLine.map(function(entry) {
          return entry.x || 0;
        })), maxX);
      }
      if (isNumber(maxX)) {
        return /* @__PURE__ */ React.createElement("rect", {
          x: 0,
          y: startY < endY ? startY : startY - height,
          width: maxX + (strokeWidth ? parseInt("".concat(strokeWidth), 10) : 1),
          height: Math.floor(height)
        });
      }
      return null;
    }
  }, {
    key: "renderClipRect",
    value: function renderClipRect(alpha) {
      var layout = this.props.layout;
      if (layout === "vertical") {
        return this.renderVerticalRect(alpha);
      }
      return this.renderHorizontalRect(alpha);
    }
  }, {
    key: "renderAreaStatically",
    value: function renderAreaStatically(points, baseLine, needClip, clipPathId) {
      var _this$props4 = this.props, layout = _this$props4.layout, type = _this$props4.type, stroke = _this$props4.stroke, connectNulls = _this$props4.connectNulls, isRange = _this$props4.isRange;
      _this$props4.ref;
      var others = _objectWithoutProperties(_this$props4, _excluded);
      return /* @__PURE__ */ React.createElement(Layer, {
        clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : null
      }, /* @__PURE__ */ React.createElement(Curve, _extends({}, filterProps(others, true), {
        points,
        connectNulls,
        type,
        baseLine,
        layout,
        stroke: "none",
        className: "recharts-area-area"
      })), stroke !== "none" && /* @__PURE__ */ React.createElement(Curve, _extends({}, filterProps(this.props, false), {
        className: "recharts-area-curve",
        layout,
        type,
        connectNulls,
        fill: "none",
        points
      })), stroke !== "none" && isRange && /* @__PURE__ */ React.createElement(Curve, _extends({}, filterProps(this.props, false), {
        className: "recharts-area-curve",
        layout,
        type,
        connectNulls,
        fill: "none",
        points: baseLine
      })));
    }
  }, {
    key: "renderAreaWithAnimation",
    value: function renderAreaWithAnimation(needClip, clipPathId) {
      var _this2 = this;
      var _this$props5 = this.props, points = _this$props5.points, baseLine = _this$props5.baseLine, isAnimationActive = _this$props5.isAnimationActive, animationBegin = _this$props5.animationBegin, animationDuration = _this$props5.animationDuration, animationEasing = _this$props5.animationEasing, animationId = _this$props5.animationId;
      var _this$state = this.state, prevPoints = _this$state.prevPoints, prevBaseLine = _this$state.prevBaseLine;
      return /* @__PURE__ */ React.createElement(Animate, {
        begin: animationBegin,
        duration: animationDuration,
        isActive: isAnimationActive,
        easing: animationEasing,
        from: {
          t: 0
        },
        to: {
          t: 1
        },
        key: "area-".concat(animationId),
        onAnimationEnd: this.handleAnimationEnd,
        onAnimationStart: this.handleAnimationStart
      }, function(_ref) {
        var t = _ref.t;
        if (prevPoints) {
          var prevPointsDiffFactor = prevPoints.length / points.length;
          var stepPoints = points.map(function(entry, index) {
            var prevPointIndex = Math.floor(index * prevPointsDiffFactor);
            if (prevPoints[prevPointIndex]) {
              var prev = prevPoints[prevPointIndex];
              var interpolatorX = interpolateNumber(prev.x, entry.x);
              var interpolatorY = interpolateNumber(prev.y, entry.y);
              return _objectSpread(_objectSpread({}, entry), {}, {
                x: interpolatorX(t),
                y: interpolatorY(t)
              });
            }
            return entry;
          });
          var stepBaseLine;
          if (isNumber(baseLine) && typeof baseLine === "number") {
            var interpolator = interpolateNumber(prevBaseLine, baseLine);
            stepBaseLine = interpolator(t);
          } else if (isNil(baseLine) || isNan(baseLine)) {
            var _interpolator = interpolateNumber(prevBaseLine, 0);
            stepBaseLine = _interpolator(t);
          } else {
            stepBaseLine = baseLine.map(function(entry, index) {
              var prevPointIndex = Math.floor(index * prevPointsDiffFactor);
              if (prevBaseLine[prevPointIndex]) {
                var prev = prevBaseLine[prevPointIndex];
                var interpolatorX = interpolateNumber(prev.x, entry.x);
                var interpolatorY = interpolateNumber(prev.y, entry.y);
                return _objectSpread(_objectSpread({}, entry), {}, {
                  x: interpolatorX(t),
                  y: interpolatorY(t)
                });
              }
              return entry;
            });
          }
          return _this2.renderAreaStatically(stepPoints, stepBaseLine, needClip, clipPathId);
        }
        return /* @__PURE__ */ React.createElement(Layer, null, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("clipPath", {
          id: "animationClipPath-".concat(clipPathId)
        }, _this2.renderClipRect(t))), /* @__PURE__ */ React.createElement(Layer, {
          clipPath: "url(#animationClipPath-".concat(clipPathId, ")")
        }, _this2.renderAreaStatically(points, baseLine, needClip, clipPathId)));
      });
    }
  }, {
    key: "renderArea",
    value: function renderArea(needClip, clipPathId) {
      var _this$props6 = this.props, points = _this$props6.points, baseLine = _this$props6.baseLine, isAnimationActive = _this$props6.isAnimationActive;
      var _this$state2 = this.state, prevPoints = _this$state2.prevPoints, prevBaseLine = _this$state2.prevBaseLine, totalLength = _this$state2.totalLength;
      if (isAnimationActive && points && points.length && (!prevPoints && totalLength > 0 || !isEqual(prevPoints, points) || !isEqual(prevBaseLine, baseLine))) {
        return this.renderAreaWithAnimation(needClip, clipPathId);
      }
      return this.renderAreaStatically(points, baseLine, needClip, clipPathId);
    }
  }, {
    key: "render",
    value: function render() {
      var _filterProps;
      var _this$props7 = this.props, hide = _this$props7.hide, dot = _this$props7.dot, points = _this$props7.points, className = _this$props7.className, top = _this$props7.top, left = _this$props7.left, xAxis = _this$props7.xAxis, yAxis = _this$props7.yAxis, width = _this$props7.width, height = _this$props7.height, isAnimationActive = _this$props7.isAnimationActive, id = _this$props7.id;
      if (hide || !points || !points.length) {
        return null;
      }
      var isAnimationFinished = this.state.isAnimationFinished;
      var hasSinglePoint = points.length === 1;
      var layerClass = clsx("recharts-area", className);
      var needClipX = xAxis && xAxis.allowDataOverflow;
      var needClipY = yAxis && yAxis.allowDataOverflow;
      var needClip = needClipX || needClipY;
      var clipPathId = isNil(id) ? this.id : id;
      var _ref2 = (_filterProps = filterProps(dot, false)) !== null && _filterProps !== void 0 ? _filterProps : {
        r: 3,
        strokeWidth: 2
      }, _ref2$r = _ref2.r, r = _ref2$r === void 0 ? 3 : _ref2$r, _ref2$strokeWidth = _ref2.strokeWidth, strokeWidth = _ref2$strokeWidth === void 0 ? 2 : _ref2$strokeWidth;
      var _ref3 = hasClipDot(dot) ? dot : {}, _ref3$clipDot = _ref3.clipDot, clipDot = _ref3$clipDot === void 0 ? true : _ref3$clipDot;
      var dotSize = r * 2 + strokeWidth;
      return /* @__PURE__ */ React.createElement(Layer, {
        className: layerClass
      }, needClipX || needClipY ? /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("clipPath", {
        id: "clipPath-".concat(clipPathId)
      }, /* @__PURE__ */ React.createElement("rect", {
        x: needClipX ? left : left - width / 2,
        y: needClipY ? top : top - height / 2,
        width: needClipX ? width : width * 2,
        height: needClipY ? height : height * 2
      })), !clipDot && /* @__PURE__ */ React.createElement("clipPath", {
        id: "clipPath-dots-".concat(clipPathId)
      }, /* @__PURE__ */ React.createElement("rect", {
        x: left - dotSize / 2,
        y: top - dotSize / 2,
        width: width + dotSize,
        height: height + dotSize
      }))) : null, !hasSinglePoint ? this.renderArea(needClip, clipPathId) : null, (dot || hasSinglePoint) && this.renderDots(needClip, clipDot, clipPathId), (!isAnimationActive || isAnimationFinished) && LabelList.renderCallByParent(this.props, points));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.animationId !== prevState.prevAnimationId) {
        return {
          prevAnimationId: nextProps.animationId,
          curPoints: nextProps.points,
          curBaseLine: nextProps.baseLine,
          prevPoints: prevState.curPoints,
          prevBaseLine: prevState.curBaseLine
        };
      }
      if (nextProps.points !== prevState.curPoints || nextProps.baseLine !== prevState.curBaseLine) {
        return {
          curPoints: nextProps.points,
          curBaseLine: nextProps.baseLine
        };
      }
      return null;
    }
  }]);
}(reactExports.PureComponent);
_Area = Area;
_defineProperty(Area, "displayName", "Area");
_defineProperty(Area, "defaultProps", {
  stroke: "#3182bd",
  fill: "#3182bd",
  fillOpacity: 0.6,
  xAxisId: 0,
  yAxisId: 0,
  legendType: "line",
  connectNulls: false,
  // points of area
  points: [],
  dot: false,
  activeDot: true,
  hide: false,
  isAnimationActive: !Global.isSsr,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease"
});
_defineProperty(Area, "getBaseValue", function(props, item, xAxis, yAxis) {
  var layout = props.layout, chartBaseValue = props.baseValue;
  var itemBaseValue = item.props.baseValue;
  var baseValue = itemBaseValue !== null && itemBaseValue !== void 0 ? itemBaseValue : chartBaseValue;
  if (isNumber(baseValue) && typeof baseValue === "number") {
    return baseValue;
  }
  var numericAxis = layout === "horizontal" ? yAxis : xAxis;
  var domain = numericAxis.scale.domain();
  if (numericAxis.type === "number") {
    var domainMax = Math.max(domain[0], domain[1]);
    var domainMin = Math.min(domain[0], domain[1]);
    if (baseValue === "dataMin") {
      return domainMin;
    }
    if (baseValue === "dataMax") {
      return domainMax;
    }
    return domainMax < 0 ? domainMax : Math.max(Math.min(domain[0], domain[1]), 0);
  }
  if (baseValue === "dataMin") {
    return domain[0];
  }
  if (baseValue === "dataMax") {
    return domain[1];
  }
  return domain[0];
});
_defineProperty(Area, "getComposedData", function(_ref4) {
  var props = _ref4.props, item = _ref4.item, xAxis = _ref4.xAxis, yAxis = _ref4.yAxis, xAxisTicks = _ref4.xAxisTicks, yAxisTicks = _ref4.yAxisTicks, bandSize = _ref4.bandSize, dataKey = _ref4.dataKey, stackedData = _ref4.stackedData, dataStartIndex = _ref4.dataStartIndex, displayedData = _ref4.displayedData, offset = _ref4.offset;
  var layout = props.layout;
  var hasStack = stackedData && stackedData.length;
  var baseValue = _Area.getBaseValue(props, item, xAxis, yAxis);
  var isHorizontalLayout = layout === "horizontal";
  var isRange = false;
  var points = displayedData.map(function(entry, index) {
    var value;
    if (hasStack) {
      value = stackedData[dataStartIndex + index];
    } else {
      value = getValueByDataKey(entry, dataKey);
      if (!Array.isArray(value)) {
        value = [baseValue, value];
      } else {
        isRange = true;
      }
    }
    var isBreakPoint = value[1] == null || hasStack && getValueByDataKey(entry, dataKey) == null;
    if (isHorizontalLayout) {
      return {
        x: getCateCoordinateOfLine({
          axis: xAxis,
          ticks: xAxisTicks,
          bandSize,
          entry,
          index
        }),
        y: isBreakPoint ? null : yAxis.scale(value[1]),
        value,
        payload: entry
      };
    }
    return {
      x: isBreakPoint ? null : xAxis.scale(value[1]),
      y: getCateCoordinateOfLine({
        axis: yAxis,
        ticks: yAxisTicks,
        bandSize,
        entry,
        index
      }),
      value,
      payload: entry
    };
  });
  var baseLine;
  if (hasStack || isRange) {
    baseLine = points.map(function(entry) {
      var x = Array.isArray(entry.value) ? entry.value[0] : null;
      if (isHorizontalLayout) {
        return {
          x: entry.x,
          y: x != null && entry.y != null ? yAxis.scale(x) : null
        };
      }
      return {
        x: x != null ? xAxis.scale(x) : null,
        y: entry.y
      };
    });
  } else {
    baseLine = isHorizontalLayout ? yAxis.scale(baseValue) : xAxis.scale(baseValue);
  }
  return _objectSpread({
    points,
    baseLine,
    layout,
    isRange
  }, offset);
});
_defineProperty(Area, "renderDotItem", function(option, props) {
  var dotItem;
  if (/* @__PURE__ */ React.isValidElement(option)) {
    dotItem = /* @__PURE__ */ React.cloneElement(option, props);
  } else if (isFunction(option)) {
    dotItem = option(props);
  } else {
    var className = clsx("recharts-area-dot", typeof option !== "boolean" ? option.className : "");
    var key = props.key, rest = _objectWithoutProperties(props, _excluded2);
    dotItem = /* @__PURE__ */ React.createElement(Dot, _extends({}, rest, {
      key,
      className
    }));
  }
  return dotItem;
});
var AreaChart = generateCategoricalChart({
  chartName: "AreaChart",
  GraphicalChild: Area,
  axisComponents: [{
    axisType: "xAxis",
    AxisComp: XAxis
  }, {
    axisType: "yAxis",
    AxisComp: YAxis
  }],
  formatAxisMap
});
const CARBON_FACTORS = {
  [EnergyType.Electricity]: 0.4,
  [EnergyType.Gas]: 2,
  [EnergyType.Diesel]: 2.68,
  [EnergyType.LPG]: 1.51,
  [EnergyType.Renewable]: 0
};
const CURRENT_YEAR = (/* @__PURE__ */ new Date()).getFullYear();
const YEARS = Array.from({ length: 4 }, (_, i) => CURRENT_YEAR - i);
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
function fmtNum(n, d = 2) {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(d);
}
function tsToDate(ts) {
  return new Date(Number(ts / 1000000n)).toLocaleDateString();
}
function GaugeWidget({
  label,
  value,
  unit = "%",
  loading
}) {
  const color = value >= 70 ? "#22c55e" : value >= 50 ? "#f59e0b" : "#ef4444";
  const pct = Math.min(100, Math.max(0, value));
  const dashOffset = 220 - pct / 100 * 220;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-white/5 border-white/10 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "flex flex-col items-center justify-center p-6", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-24 rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-28 h-28", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "svg",
        {
          viewBox: "0 0 100 100",
          className: "w-full h-full -rotate-90",
          role: "img",
          "aria-label": "ESG gauge chart",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: "50",
                cy: "50",
                r: "35",
                fill: "none",
                stroke: "rgba(255,255,255,0.08)",
                strokeWidth: "10"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: "50",
                cy: "50",
                r: "35",
                fill: "none",
                stroke: color,
                strokeWidth: "10",
                strokeDasharray: "220",
                strokeDashoffset: dashOffset,
                strokeLinecap: "round",
                style: { transition: "stroke-dashoffset 0.6s ease" }
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xl font-bold", style: { color }, children: [
        fmtNum(value, 0),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs ml-0.5", children: unit })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground text-center", children: label })
  ] }) }) });
}
function StatCard({
  label,
  value,
  unit,
  icon,
  loading
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-white/5 border-white/10 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-primary/10 text-primary", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-20 mb-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-bold text-foreground truncate", children: [
        value,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-normal", children: unit })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: label })
    ] })
  ] }) });
}
function FormRow({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-muted-foreground text-xs", children: label }),
    children
  ] });
}
const INPUT_CLS = "bg-white/5 border-white/20 text-foreground placeholder:text-muted-foreground";
function WasteTab({
  entries,
  canAdd,
  onAdd
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    wasteType: WasteType.General,
    quantity: 0,
    unit: "kg",
    disposalMethod: "",
    contractorName: "",
    manifestNumber: "",
    disposalDate: "",
    department: ""
  });
  const [saving, setSaving] = reactExports.useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await onAdd(form);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    canAdd && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        size: "sm",
        onClick: () => setOpen(true),
        className: "gap-2",
        "data-ocid": "esg.waste.add_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
          " Add Waste Entry"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: [
        "Type",
        "Qty",
        "Unit",
        "Disposal Method",
        "Contractor",
        "Manifest #",
        "Date",
        "Dept"
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "text-left px-3 py-2 text-muted-foreground font-medium",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "td",
        {
          colSpan: 8,
          className: "px-3 py-8 text-center text-muted-foreground",
          "data-ocid": "esg.waste.empty_state",
          children: "No waste entries yet."
        }
      ) }) : entries.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-t border-white/5 hover:bg-white/5",
          "data-ocid": `esg.waste.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.wasteType }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: fmtNum(e.quantity, 1) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.unit }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.disposalMethod }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.contractorName || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.manifestNumber || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.disposalDate }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.department })
          ]
        },
        i
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "bg-slate-900 border-white/10 max-w-lg",
        "data-ocid": "esg.waste.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add Waste Entry" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "grid grid-cols-2 gap-3 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Waste Type", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.wasteType,
                onValueChange: (v) => setForm((p) => ({ ...p, wasteType: v })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: INPUT_CLS, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.values(WasteType).map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: v, children: v }, v)) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Quantity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: 0,
                step: 0.01,
                value: form.quantity,
                onChange: (e) => setForm((p) => ({
                  ...p,
                  quantity: Number.parseFloat(e.target.value) || 0
                })),
                className: INPUT_CLS
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Unit", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.unit,
                onValueChange: (v) => setForm((p) => ({ ...p, unit: v })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: INPUT_CLS, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ["kg", "tonnes", "litres", "m³"].map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: v, children: v }, v)) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Disposal Method", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.disposalMethod,
                onChange: (e) => setForm((p) => ({ ...p, disposalMethod: e.target.value })),
                className: INPUT_CLS,
                placeholder: "e.g. Landfill, Incinerate"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Contractor Name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.contractorName,
                onChange: (e) => setForm((p) => ({ ...p, contractorName: e.target.value })),
                className: INPUT_CLS
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Manifest Number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.manifestNumber,
                onChange: (e) => setForm((p) => ({ ...p, manifestNumber: e.target.value })),
                className: INPUT_CLS
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Disposal Date", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "date",
                value: form.disposalDate,
                onChange: (e) => setForm((p) => ({ ...p, disposalDate: e.target.value })),
                className: INPUT_CLS,
                required: true
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Department", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.department,
                onChange: (e) => setForm((p) => ({ ...p, department: e.target.value })),
                className: INPUT_CLS,
                required: true
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 flex justify-end gap-2 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => setOpen(false),
                  "data-ocid": "esg.waste.cancel_button",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  disabled: saving,
                  "data-ocid": "esg.waste.submit_button",
                  children: saving ? "Saving..." : "Save"
                }
              )
            ] })
          ] })
        ]
      }
    ) })
  ] });
}
function AirTab({
  entries,
  canAdd,
  onAdd
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    source: AirEmissionSource.Stack,
    pollutant: AirPollutant.CO2,
    value: 0,
    unit: "ppm",
    measurementDate: "",
    regulatoryLimit: 0,
    department: ""
  });
  const [saving, setSaving] = reactExports.useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await onAdd(form);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    canAdd && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        size: "sm",
        onClick: () => setOpen(true),
        className: "gap-2",
        "data-ocid": "esg.air.add_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
          " Add Air Emission"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: [
        "Source",
        "Pollutant",
        "Value",
        "Unit",
        "Reg. Limit",
        "Status",
        "Date",
        "Dept"
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "text-left px-3 py-2 text-muted-foreground font-medium",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "td",
        {
          colSpan: 8,
          className: "px-3 py-8 text-center text-muted-foreground",
          "data-ocid": "esg.air.empty_state",
          children: "No air emission records yet."
        }
      ) }) : entries.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-t border-white/5 hover:bg-white/5",
          "data-ocid": `esg.air.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.source }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.pollutant }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: fmtNum(e.value, 3) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.unit }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: fmtNum(e.regulatoryLimit, 3) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.isExceeded ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "text-xs", children: "Exceeded" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-xs bg-green-500/20 text-green-400 border-green-500/30", children: "Within Limit" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.measurementDate }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.department })
          ]
        },
        i
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "bg-slate-900 border-white/10 max-w-lg",
        "data-ocid": "esg.air.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add Air Emission Reading" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "grid grid-cols-2 gap-3 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Source", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.source,
                onValueChange: (v) => setForm((p) => ({ ...p, source: v })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: INPUT_CLS, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.values(AirEmissionSource).map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: v, children: v }, v)) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Pollutant", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.pollutant,
                onValueChange: (v) => setForm((p) => ({ ...p, pollutant: v })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: INPUT_CLS, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.values(AirPollutant).map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: v, children: v }, v)) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Measured Value", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                step: "0.001",
                value: form.value,
                onChange: (e) => setForm((p) => ({
                  ...p,
                  value: Number.parseFloat(e.target.value) || 0
                })),
                className: INPUT_CLS
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Unit", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.unit,
                onValueChange: (v) => setForm((p) => ({ ...p, unit: v })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: INPUT_CLS, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ["ppm", "mg/m³", "µg/m³", "tonnes", "%"].map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: v, children: v }, v)) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Regulatory Limit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                step: "0.001",
                value: form.regulatoryLimit,
                onChange: (e) => setForm((p) => ({
                  ...p,
                  regulatoryLimit: Number.parseFloat(e.target.value) || 0
                })),
                className: INPUT_CLS
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Measurement Date", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "date",
                value: form.measurementDate,
                onChange: (e) => setForm((p) => ({ ...p, measurementDate: e.target.value })),
                className: INPUT_CLS,
                required: true
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Department", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.department,
                onChange: (e) => setForm((p) => ({ ...p, department: e.target.value })),
                className: INPUT_CLS,
                required: true
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 flex justify-end gap-2 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => setOpen(false),
                  "data-ocid": "esg.air.cancel_button",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  disabled: saving,
                  "data-ocid": "esg.air.submit_button",
                  children: saving ? "Saving..." : "Save"
                }
              )
            ] })
          ] })
        ]
      }
    ) })
  ] });
}
function WaterTab({
  entries,
  canAdd,
  onAdd
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    source: WaterSource.Municipal,
    consumption: 0,
    target: 0,
    month: BigInt((/* @__PURE__ */ new Date()).getMonth() + 1),
    year: BigInt(CURRENT_YEAR),
    department: ""
  });
  const [saving, setSaving] = reactExports.useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await onAdd(form);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    canAdd && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        size: "sm",
        onClick: () => setOpen(true),
        className: "gap-2",
        "data-ocid": "esg.water.add_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
          " Add Water Entry"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: [
        "Source",
        "Consumption (m³)",
        "Target (m³)",
        "vs Target",
        "Month",
        "Year",
        "Dept"
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "text-left px-3 py-2 text-muted-foreground font-medium",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "td",
        {
          colSpan: 7,
          className: "px-3 py-8 text-center text-muted-foreground",
          "data-ocid": "esg.water.empty_state",
          children: "No water entries yet."
        }
      ) }) : entries.map((e, i) => {
        const overTarget = e.consumption > e.target && e.target > 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-t border-white/5 hover:bg-white/5",
            "data-ocid": `esg.water.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.source }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: fmtNum(e.consumption, 1) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: fmtNum(e.target, 1) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.target > 0 && (overTarget ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "text-xs", children: "Over Target" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-xs bg-green-500/20 text-green-400 border-green-500/30", children: "Within Target" })) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: MONTHS[Number(e.month) - 1] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: String(e.year) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.department })
            ]
          },
          i
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "bg-slate-900 border-white/10 max-w-md",
        "data-ocid": "esg.water.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add Water Consumption" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "grid grid-cols-2 gap-3 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Source", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.source,
                onValueChange: (v) => setForm((p) => ({ ...p, source: v })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: INPUT_CLS, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.values(WaterSource).map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: v, children: v }, v)) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Consumption (m³)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                step: "0.1",
                value: form.consumption,
                onChange: (e) => setForm((p) => ({
                  ...p,
                  consumption: Number.parseFloat(e.target.value) || 0
                })),
                className: INPUT_CLS
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Monthly Target (m³)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                step: "0.1",
                value: form.target,
                onChange: (e) => setForm((p) => ({
                  ...p,
                  target: Number.parseFloat(e.target.value) || 0
                })),
                className: INPUT_CLS
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Month", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: String(form.month),
                onValueChange: (_v) => setForm((p) => ({ ...p, month: BigInt(_v) })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: INPUT_CLS, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: MONTHS.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(i + 1), children: m }, i)) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Year", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: String(form.year),
                onValueChange: (v) => setForm((p) => ({ ...p, year: BigInt(v) })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: INPUT_CLS, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: YEARS.map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(y), children: y }, y)) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Department", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.department,
                onChange: (e) => setForm((p) => ({ ...p, department: e.target.value })),
                className: INPUT_CLS,
                required: true
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 flex justify-end gap-2 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => setOpen(false),
                  "data-ocid": "esg.water.cancel_button",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  disabled: saving,
                  "data-ocid": "esg.water.submit_button",
                  children: saving ? "Saving..." : "Save"
                }
              )
            ] })
          ] })
        ]
      }
    ) })
  ] });
}
function EffluentTab({
  entries,
  canAdd,
  onAdd
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    effluentType: EffluentType.Process,
    parameter: EffluentParameter.COD,
    value: 0,
    regulatoryLimit: 0,
    samplingDate: "",
    department: ""
  });
  const [saving, setSaving] = reactExports.useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await onAdd(form);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    canAdd && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        size: "sm",
        onClick: () => setOpen(true),
        className: "gap-2",
        "data-ocid": "esg.effluent.add_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
          " Add Effluent Entry"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: [
        "Type",
        "Parameter",
        "Value",
        "Reg. Limit",
        "Compliance",
        "Sampling Date",
        "Dept"
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "text-left px-3 py-2 text-muted-foreground font-medium",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "td",
        {
          colSpan: 7,
          className: "px-3 py-8 text-center text-muted-foreground",
          "data-ocid": "esg.effluent.empty_state",
          children: "No effluent records yet."
        }
      ) }) : entries.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: `border-t border-white/5 hover:bg-white/5 ${!e.isCompliant ? "bg-red-500/5" : ""}`,
          "data-ocid": `esg.effluent.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.effluentType }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.parameter }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-mono", children: fmtNum(e.value, 3) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-mono", children: fmtNum(e.regulatoryLimit, 3) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.isCompliant ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-green-400 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3 h-3" }),
              "Compliant"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-red-400 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3 h-3" }),
              "Non-Compliant"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.samplingDate }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.department })
          ]
        },
        i
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "bg-slate-900 border-white/10 max-w-lg",
        "data-ocid": "esg.effluent.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add Effluent Reading" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "grid grid-cols-2 gap-3 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Effluent Type", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.effluentType,
                onValueChange: (v) => setForm((p) => ({ ...p, effluentType: v })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: INPUT_CLS, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.values(EffluentType).map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: v, children: v }, v)) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Parameter", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.parameter,
                onValueChange: (v) => setForm((p) => ({ ...p, parameter: v })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: INPUT_CLS, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.values(EffluentParameter).map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: v, children: v }, v)) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Measured Value", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                step: "0.001",
                value: form.value,
                onChange: (e) => setForm((p) => ({
                  ...p,
                  value: Number.parseFloat(e.target.value) || 0
                })),
                className: INPUT_CLS
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Regulatory Limit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                step: "0.001",
                value: form.regulatoryLimit,
                onChange: (e) => setForm((p) => ({
                  ...p,
                  regulatoryLimit: Number.parseFloat(e.target.value) || 0
                })),
                className: INPUT_CLS
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Sampling Date", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "date",
                value: form.samplingDate,
                onChange: (e) => setForm((p) => ({ ...p, samplingDate: e.target.value })),
                className: INPUT_CLS,
                required: true
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Department", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.department,
                onChange: (e) => setForm((p) => ({ ...p, department: e.target.value })),
                className: INPUT_CLS,
                required: true
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 flex justify-end gap-2 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => setOpen(false),
                  "data-ocid": "esg.effluent.cancel_button",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  disabled: saving,
                  "data-ocid": "esg.effluent.submit_button",
                  children: saving ? "Saving..." : "Save"
                }
              )
            ] })
          ] })
        ]
      }
    ) })
  ] });
}
function EnergyTab({
  entries,
  canAdd,
  onAdd
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    energyType: EnergyType.Electricity,
    consumption: 0,
    unit: "kWh",
    target: 0,
    month: (/* @__PURE__ */ new Date()).getMonth() + 1,
    year: CURRENT_YEAR,
    department: ""
  });
  const [saving, setSaving] = reactExports.useState(false);
  const carbonEq = form.consumption * CARBON_FACTORS[form.energyType];
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const input = {
      energyType: form.energyType,
      consumption: form.consumption,
      unit: form.unit,
      target: form.target,
      month: BigInt(form.month),
      year: BigInt(form.year),
      department: form.department,
      carbonEquivalent: carbonEq
    };
    try {
      await onAdd(input);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    canAdd && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        size: "sm",
        onClick: () => setOpen(true),
        className: "gap-2",
        "data-ocid": "esg.energy.add_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
          " Add Energy Entry"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: [
        "Type",
        "Consumption",
        "Unit",
        "Target",
        "vs Target",
        "Carbon Eq.",
        "Month",
        "Year",
        "Dept"
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "text-left px-3 py-2 text-muted-foreground font-medium",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "td",
        {
          colSpan: 9,
          className: "px-3 py-8 text-center text-muted-foreground",
          "data-ocid": "esg.energy.empty_state",
          children: "No energy records yet."
        }
      ) }) : entries.map((e, i) => {
        const over = e.consumption > e.target && e.target > 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-t border-white/5 hover:bg-white/5",
            "data-ocid": `esg.energy.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.energyType }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: fmtNum(e.consumption, 1) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.unit }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: fmtNum(e.target, 1) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.target > 0 && (over ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "text-xs", children: "Over Target" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-xs bg-green-500/20 text-green-400 border-green-500/30", children: "OK" })) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 text-right font-mono", children: [
                fmtNum(e.carbonEquivalent, 2),
                " kg"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: MONTHS[Number(e.month) - 1] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: String(e.year) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.department })
            ]
          },
          i
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "bg-slate-900 border-white/10 max-w-lg",
        "data-ocid": "esg.energy.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add Energy Entry" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "grid grid-cols-2 gap-3 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Energy Type", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.energyType,
                onValueChange: (v) => setForm((p) => ({
                  ...p,
                  energyType: v,
                  unit: v === EnergyType.Electricity ? "kWh" : v === EnergyType.Gas ? "m³" : "litres"
                })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: INPUT_CLS, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.values(EnergyType).map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: v, children: v }, v)) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Unit", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.unit,
                onValueChange: (v) => setForm((p) => ({ ...p, unit: v })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: INPUT_CLS, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ["kWh", "MWh", "m³", "litres", "GJ"].map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: v, children: v }, v)) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Consumption", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                step: "0.1",
                value: form.consumption,
                onChange: (e) => setForm((p) => ({
                  ...p,
                  consumption: Number.parseFloat(e.target.value) || 0
                })),
                className: INPUT_CLS
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Target", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                step: "0.1",
                value: form.target,
                onChange: (e) => setForm((p) => ({
                  ...p,
                  target: Number.parseFloat(e.target.value) || 0
                })),
                className: INPUT_CLS
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Month", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: String(form.month),
                onValueChange: (v) => setForm((p) => ({ ...p, month: Number.parseInt(v) })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: INPUT_CLS, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: MONTHS.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(i + 1), children: m }, i)) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Year", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: String(form.year),
                onValueChange: (v) => setForm((p) => ({ ...p, year: Number.parseInt(v) })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: INPUT_CLS, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: YEARS.map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(y), children: y }, y)) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Department", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.department,
                onChange: (e) => setForm((p) => ({ ...p, department: e.target.value })),
                className: INPUT_CLS,
                required: true
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Carbon Equivalent (auto-calculated)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-bold text-cyan-400", children: [
                fmtNum(carbonEq, 3),
                " kg CO₂e"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "Factor: ",
                CARBON_FACTORS[form.energyType],
                " kg CO₂e / unit"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 flex justify-end gap-2 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => setOpen(false),
                  "data-ocid": "esg.energy.cancel_button",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  disabled: saving,
                  "data-ocid": "esg.energy.submit_button",
                  children: saving ? "Saving..." : "Save"
                }
              )
            ] })
          ] })
        ]
      }
    ) })
  ] });
}
function CarbonTab({
  entries,
  canAdd,
  onAdd
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    scope: CarbonScope.Scope1,
    co2eTonnes: 0,
    month: BigInt((/* @__PURE__ */ new Date()).getMonth() + 1),
    year: BigInt(CURRENT_YEAR),
    description: ""
  });
  const [saving, setSaving] = reactExports.useState(false);
  const totalCO2e = entries.reduce((acc, e) => acc + e.co2eTonnes, 0);
  const trendMap = /* @__PURE__ */ new Map();
  for (const e of entries) {
    const key = `${MONTHS[Number(e.month) - 1]} ${e.year}`;
    trendMap.set(key, (trendMap.get(key) || 0) + e.co2eTonnes);
  }
  const trendData = Array.from(trendMap.entries()).slice(-12).map(([month, co2e]) => ({ month, co2e }));
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await onAdd(form);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-orange-500/10 border border-orange-500/20 px-4 py-2 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-5 h-5 text-orange-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total CO₂e" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xl font-bold text-orange-400", children: [
            fmtNum(totalCO2e, 2),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-normal", children: "tonnes" })
          ] })
        ] })
      ] }),
      canAdd && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          size: "sm",
          onClick: () => setOpen(true),
          className: "gap-2",
          "data-ocid": "esg.carbon.add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            " Add Carbon Entry"
          ]
        }
      )
    ] }),
    trendData.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-white/5 border-white/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Monthly CO₂e Trend" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 200, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        AreaChart,
        {
          data: trendData,
          margin: { top: 5, right: 10, left: 0, bottom: 5 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "carbonGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: "#f97316", stopOpacity: 0.3 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: "#f97316", stopOpacity: 0 })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CartesianGrid,
              {
                strokeDasharray: "3 3",
                stroke: "rgba(255,255,255,0.05)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              XAxis,
              {
                dataKey: "month",
                tick: { fill: "#94a3b8", fontSize: 11 }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: { fill: "#94a3b8", fontSize: 11 } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Tooltip,
              {
                contentStyle: {
                  background: "#1e293b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Area,
              {
                type: "monotone",
                dataKey: "co2e",
                stroke: "#f97316",
                fill: "url(#carbonGrad)",
                strokeWidth: 2,
                name: "CO₂e (tonnes)"
              }
            )
          ]
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: [
        "Scope",
        "CO₂e (tonnes)",
        "Month",
        "Year",
        "Description",
        "Logged"
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "text-left px-3 py-2 text-muted-foreground font-medium",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "td",
        {
          colSpan: 6,
          className: "px-3 py-8 text-center text-muted-foreground",
          "data-ocid": "esg.carbon.empty_state",
          children: "No carbon records yet."
        }
      ) }) : entries.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-t border-white/5 hover:bg-white/5",
          "data-ocid": `esg.carbon.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                className: `text-xs ${e.scope === CarbonScope.Scope1 ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : e.scope === CarbonScope.Scope2 ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-purple-500/20 text-purple-400 border-purple-500/30"}`,
                children: e.scope
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-mono font-bold", children: fmtNum(e.co2eTonnes, 3) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: MONTHS[Number(e.month) - 1] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: String(e.year) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 max-w-[200px] truncate", children: e.description || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: tsToDate(e.createdAt) })
          ]
        },
        i
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "bg-slate-900 border-white/10 max-w-md",
        "data-ocid": "esg.carbon.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add Carbon Entry" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "grid grid-cols-2 gap-3 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Scope", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.scope,
                onValueChange: (v) => setForm((p) => ({ ...p, scope: v })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: INPUT_CLS, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: CarbonScope.Scope1, children: "Scope 1 (Direct — Fuel, Vehicles)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: CarbonScope.Scope2, children: "Scope 2 (Purchased Electricity)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: CarbonScope.Scope3, children: "Scope 3 (Value Chain)" })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "CO₂e (tonnes)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                step: "0.001",
                value: form.co2eTonnes,
                onChange: (e) => setForm((p) => ({
                  ...p,
                  co2eTonnes: Number.parseFloat(e.target.value) || 0
                })),
                className: INPUT_CLS
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Month", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: String(form.month),
                onValueChange: (v) => setForm((p) => ({ ...p, month: BigInt(v) })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: INPUT_CLS, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: MONTHS.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(i + 1), children: m }, i)) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Year", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: String(form.year),
                onValueChange: (v) => setForm((p) => ({ ...p, year: BigInt(v) })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: INPUT_CLS, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: YEARS.map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(y), children: y }, y)) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FormRow, { label: "Description", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.description,
                onChange: (e) => setForm((p) => ({ ...p, description: e.target.value })),
                className: INPUT_CLS,
                placeholder: "e.g. Diesel generator fuel usage"
              }
            ) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 flex justify-end gap-2 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => setOpen(false),
                  "data-ocid": "esg.carbon.cancel_button",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  disabled: saving,
                  "data-ocid": "esg.carbon.submit_button",
                  children: saving ? "Saving..." : "Save"
                }
              )
            ] })
          ] })
        ]
      }
    ) })
  ] });
}
function ESGPage() {
  const { user } = useAuth();
  const { actor, token, isReady } = useBackend();
  const qc = useQueryClient();
  const [filterMonth, setFilterMonth] = reactExports.useState("all");
  const [filterYear, setFilterYear] = reactExports.useState(String(CURRENT_YEAR));
  const canAdd = (user == null ? void 0 : user.role) === Role.SafetyOfficer || (user == null ? void 0 : user.role) === Role.SystemAdmin;
  const statsQ = useQuery({
    queryKey: ["esgStats", filterMonth, filterYear],
    queryFn: async () => {
      if (!actor || !token) return null;
      const month = filterMonth === "all" ? null : BigInt(filterMonth);
      const year = filterYear === "all" ? null : BigInt(filterYear);
      const res = await actor.getEsgStats(token, month, year, null);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady
  });
  const dataQ = useQuery({
    queryKey: ["esgData"],
    queryFn: async () => {
      if (!actor || !token) return null;
      const res = await actor.getEsgData(token);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady
  });
  function useMut(fn) {
    return useMutation({
      mutationFn: async (data2) => {
        if (!actor || !token) throw new Error("Not authenticated");
        const res = await fn(actor, token, data2);
        if (res.__kind__ === "err") throw new Error(res.err);
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["esgData"] });
        qc.invalidateQueries({ queryKey: ["esgStats"] });
      }
    });
  }
  const addWaste = useMut((a, t, d) => a.addWasteEntry(t, d));
  const addAir = useMut(
    (a, t, d) => a.addAirEmission(t, d)
  );
  const addWater = useMut((a, t, d) => a.addWaterEntry(t, d));
  const addEffluent = useMut(
    (a, t, d) => a.addEffluentEntry(t, d)
  );
  const addEnergy = useMut(
    (a, t, d) => a.addEnergyEntry(t, d)
  );
  const addCarbon = useMut(
    (a, t, d) => a.addCarbonEntry(t, d)
  );
  const stats = statsQ.data;
  const data = dataQ.data;
  const loadingStats = statsQ.isLoading;
  const trendChartData = ((stats == null ? void 0 : stats.trendData) ?? []).map(([label, val]) => ({
    label,
    value: val
  }));
  const yoyData = [2024, 2025, 2026].map((yr) => {
    const energySum = ((data == null ? void 0 : data.energy) ?? []).filter((e) => Number(e.year) === yr).reduce((s, e) => s + e.consumption, 0);
    const carbonSum = ((data == null ? void 0 : data.carbon) ?? []).filter((e) => Number(e.year) === yr).reduce((s, e) => s + e.co2eTonnes, 0);
    const wasteSum = ((data == null ? void 0 : data.waste) ?? []).filter((e) => new Date(e.disposalDate).getFullYear() === yr).reduce((s, e) => s + e.quantity, 0);
    const waterSum = ((data == null ? void 0 : data.water) ?? []).filter((e) => Number(e.year) === yr).reduce((s, e) => s + e.consumption, 0);
    return {
      year: String(yr),
      energy: energySum,
      carbon: carbonSum,
      waste: wasteSum,
      water: waterSum
    };
  });
  const compliancePieData = [
    { name: "Compliant", value: Number((stats == null ? void 0 : stats.complianceRate) ?? 0) },
    {
      name: "Non-Compliant",
      value: Math.max(0, 100 - Number((stats == null ? void 0 : stats.complianceRate) ?? 0))
    }
  ];
  const PIE_COLORS = ["#22c55e", "#ef4444"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 p-6", "data-ocid": "esg.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { className: "w-6 h-6 text-green-400" }),
          "Environmental Monitoring & ESG"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Track environmental performance and ESG compliance across all parameters" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterMonth, onValueChange: setFilterMonth, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              className: "w-28 bg-white/5 border-white/20",
              "data-ocid": "esg.month_filter",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Month" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Months" }),
            MONTHS.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(i + 1), children: m }, i))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterYear, onValueChange: setFilterYear, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              className: "w-24 bg-white/5 border-white/20",
              "data-ocid": "esg.year_filter",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Year" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Years" }),
            YEARS.map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(y), children: y }, y))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            size: "icon",
            onClick: () => {
              statsQ.refetch();
              dataQ.refetch();
            },
            "data-ocid": "esg.refresh_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "esg.dashboard.section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          GaugeWidget,
          {
            label: "ESG Score",
            value: Number((stats == null ? void 0 : stats.esgScore) ?? 0),
            loading: loadingStats
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          GaugeWidget,
          {
            label: "Compliance Rate",
            value: Number((stats == null ? void 0 : stats.complianceRate) ?? 0),
            loading: loadingStats
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Carbon Total",
            value: fmtNum((stats == null ? void 0 : stats.carbonTotal) ?? 0, 2),
            unit: "t CO₂e",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-4 h-4" }),
            loading: loadingStats
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Energy Total",
            value: fmtNum((stats == null ? void 0 : stats.energyTotal) ?? 0, 1),
            unit: "kWh",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4" }),
            loading: loadingStats
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Water Total",
            value: fmtNum((stats == null ? void 0 : stats.waterTotal) ?? 0, 1),
            unit: "m³",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CloudRain, { className: "w-4 h-4" }),
            loading: loadingStats
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Waste Total",
            value: fmtNum((stats == null ? void 0 : stats.wasteTotal) ?? 0, 1),
            unit: "kg",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wind, { className: "w-4 h-4" }),
            loading: loadingStats
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "lg:col-span-2 bg-white/5 border-white/10 backdrop-blur-sm",
            "data-ocid": "esg.trend.card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "ESG Trend (12 Months)" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: loadingStats ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 200, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                LineChart,
                {
                  data: trendChartData,
                  margin: { top: 5, right: 10, left: 0, bottom: 5 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CartesianGrid,
                      {
                        strokeDasharray: "3 3",
                        stroke: "rgba(255,255,255,0.05)"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      XAxis,
                      {
                        dataKey: "label",
                        tick: { fill: "#94a3b8", fontSize: 11 }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: { fill: "#94a3b8", fontSize: 11 } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Tooltip,
                      {
                        contentStyle: {
                          background: "#1e293b",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 8
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Line,
                      {
                        type: "monotone",
                        dataKey: "value",
                        stroke: "#22c55e",
                        strokeWidth: 2,
                        dot: false,
                        name: "ESG Score"
                      }
                    )
                  ]
                }
              ) }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "bg-white/5 border-white/10 backdrop-blur-sm",
            "data-ocid": "esg.compliance.card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Environmental Compliance" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: loadingStats ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 160, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Pie,
                    {
                      data: compliancePieData,
                      cx: "50%",
                      cy: "50%",
                      innerRadius: 45,
                      outerRadius: 65,
                      dataKey: "value",
                      paddingAngle: 2,
                      children: compliancePieData.map((_entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: PIE_COLORS[idx] }, idx))
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Tooltip,
                    {
                      contentStyle: {
                        background: "#1e293b",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8
                      }
                    }
                  )
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-green-500 inline-block" }),
                    "Compliant ",
                    compliancePieData[0].value,
                    "%"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-red-500 inline-block" }),
                    "Non-Compliant ",
                    compliancePieData[1].value,
                    "%"
                  ] })
                ] })
              ] }) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "bg-white/5 border-white/10 backdrop-blur-sm mt-4",
          "data-ocid": "esg.yoy.card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Year-on-Year ESG Comparison" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: dataQ.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 200, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              BarChart,
              {
                data: yoyData,
                margin: { top: 5, right: 10, left: 0, bottom: 5 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CartesianGrid,
                    {
                      strokeDasharray: "3 3",
                      stroke: "rgba(255,255,255,0.05)"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    XAxis,
                    {
                      dataKey: "year",
                      tick: { fill: "#94a3b8", fontSize: 11 }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: { fill: "#94a3b8", fontSize: 11 } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Tooltip,
                    {
                      contentStyle: {
                        background: "#1e293b",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { wrapperStyle: { fontSize: 11, color: "#94a3b8" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bar,
                    {
                      dataKey: "carbon",
                      name: "Carbon (t)",
                      fill: "#f97316",
                      radius: [2, 2, 0, 0]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bar,
                    {
                      dataKey: "energy",
                      name: "Energy (kWh)",
                      fill: "#06b6d4",
                      radius: [2, 2, 0, 0]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bar,
                    {
                      dataKey: "water",
                      name: "Water (m³)",
                      fill: "#3b82f6",
                      radius: [2, 2, 0, 0]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bar,
                    {
                      dataKey: "waste",
                      name: "Waste (kg)",
                      fill: "#a855f7",
                      radius: [2, 2, 0, 0]
                    }
                  )
                ]
              }
            ) }) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "waste", "data-ocid": "esg.data_tabs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "bg-white/5 border border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "waste", "data-ocid": "esg.tab.waste", children: "🗑 Waste" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "air", "data-ocid": "esg.tab.air", children: "💨 Air" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "water", "data-ocid": "esg.tab.water", children: "💧 Water" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "effluent", "data-ocid": "esg.tab.effluent", children: "🌊 Effluent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "energy", "data-ocid": "esg.tab.energy", children: "⚡ Energy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "carbon", "data-ocid": "esg.tab.carbon", children: "🔥 Carbon" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "waste", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          WasteTab,
          {
            entries: (data == null ? void 0 : data.waste) ?? [],
            canAdd,
            onAdd: (d) => addWaste.mutateAsync(d)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "air", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          AirTab,
          {
            entries: (data == null ? void 0 : data.air) ?? [],
            canAdd,
            onAdd: (d) => addAir.mutateAsync(d)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "water", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          WaterTab,
          {
            entries: (data == null ? void 0 : data.water) ?? [],
            canAdd,
            onAdd: (d) => addWater.mutateAsync(d)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "effluent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          EffluentTab,
          {
            entries: (data == null ? void 0 : data.effluent) ?? [],
            canAdd,
            onAdd: (d) => addEffluent.mutateAsync(d)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "energy", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          EnergyTab,
          {
            entries: (data == null ? void 0 : data.energy) ?? [],
            canAdd,
            onAdd: (d) => addEnergy.mutateAsync(d)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "carbon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          CarbonTab,
          {
            entries: (data == null ? void 0 : data.carbon) ?? [],
            canAdd,
            onAdd: (d) => addCarbon.mutateAsync(d)
          }
        ) })
      ] })
    ] })
  ] });
}
export {
  ESGPage as default
};
