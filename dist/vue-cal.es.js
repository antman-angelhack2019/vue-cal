var N = Object.defineProperty;
var I = (e, t, i) => t in e ? N(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i;
var f = (e, t, i) => (I(e, typeof t != "symbol" ? t + "" : t, i), i);
import b from "vue";
/**
  * vue-cal v3.11.0
  * (c) 2023 Antoni Andre <antoniandre.web@gmail.com>
  * @license MIT
  */
let T, $, H, y, S = {}, M = {};
class P {
  constructor(t) {
    f(this, "_vuecal", null);
    f(this, "selectCell", (t = !1, i, n) => {
      this._vuecal.$emit("cell-click", n ? { date: i, split: n } : i), this._vuecal.clickToNavigate || t ? this._vuecal.switchToNarrowerView() : this._vuecal.dblclickToNavigate && "ontouchstart" in window && (this._vuecal.domEvents.dblTapACell.taps++, setTimeout(() => this._vuecal.domEvents.dblTapACell.taps = 0, this._vuecal.domEvents.dblTapACell.timeout), this._vuecal.domEvents.dblTapACell.taps >= 2 && (this._vuecal.domEvents.dblTapACell.taps = 0, this._vuecal.switchToNarrowerView(), this._vuecal.$emit("cell-dblclick", n ? { date: i, split: n } : i)));
    });
    f(this, "keyPressEnterCell", (t, i) => {
      this._vuecal.$emit("cell-keypress-enter", i ? { date: t, split: i } : t), this._vuecal.switchToNarrowerView();
    });
    f(this, "getPosition", (t) => {
      const { left: i, top: n } = this._vuecal.$refs.cells.getBoundingClientRect(), { clientX: s, clientY: a } = "ontouchstart" in window && t.touches ? t.touches[0] : t;
      return { x: s - i, y: a - n };
    });
    f(this, "minutesAtCursor", (t) => {
      let i = 0, n = { x: 0, y: 0 };
      const { timeStep: s, timeCellHeight: a, timeFrom: r } = this._vuecal.$props;
      return typeof t == "number" ? i = t : typeof t == "object" && (n = this.getPosition(t), i = Math.round(n.y * s / parseInt(a) + r)), { minutes: Math.max(Math.min(i, 1440), 0), cursorCoords: n };
    });
    this._vuecal = t;
  }
}
const W = 1440;
let c, v, V;
class z {
  constructor(t, i) {
    f(this, "_vuecal", null);
    f(this, "eventDefaults", { _eid: null, start: "", startTimeMinutes: 0, end: "", endTimeMinutes: 0, title: "", content: "", background: !1, allDay: !1, segments: null, repeat: null, daysCount: 1, deletable: !0, deleting: !1, titleEditable: !0, resizable: !0, resizing: !1, draggable: !0, dragging: !1, draggingStatic: !1, focused: !1, class: "" });
    this._vuecal = t, c = i;
  }
  createAnEvent(t, i, n) {
    if (typeof t == "string" && (t = c.stringToDate(t)), !(t instanceof Date))
      return !1;
    const s = c.dateToMinutes(t), a = s + (i = 1 * i || 120), r = c.addMinutes(new Date(t), i);
    n.end && (typeof n.end == "string" && (n.end = c.stringToDate(n.end)), n.endTimeMinutes = c.dateToMinutes(n.end));
    const l = { ...this.eventDefaults, _eid: `${this._vuecal._uid}_${this._vuecal.eventIdIncrement++}`, start: t, startTimeMinutes: s, end: r, endTimeMinutes: a, segments: null, ...n };
    return typeof this._vuecal.onEventCreate != "function" || this._vuecal.onEventCreate(l, () => this.deleteAnEvent(l)) ? (l.startDateF !== l.endDateF && (l.daysCount = c.countDays(l.start, l.end)), this._vuecal.mutableEvents.push(l), this._vuecal.addEventsToView([l]), this._vuecal.emitWithEvent("event-create", l), this._vuecal.$emit("event-change", { event: this._vuecal.cleanupEvent(l), originalEvent: null }), l) : void 0;
  }
  addEventSegment(t) {
    t.segments || (b.set(t, "segments", {}), b.set(t.segments, c.formatDateLite(t.start), { start: t.start, startTimeMinutes: t.startTimeMinutes, endTimeMinutes: W, isFirstDay: !0, isLastDay: !1 }));
    const i = t.segments[c.formatDateLite(t.end)];
    i && (i.isLastDay = !1, i.endTimeMinutes = W);
    const n = c.addDays(t.end, 1), s = c.formatDateLite(n);
    return n.setHours(0, 0, 0, 0), b.set(t.segments, s, { start: n, startTimeMinutes: 0, endTimeMinutes: t.endTimeMinutes, isFirstDay: !1, isLastDay: !0 }), t.end = c.addMinutes(n, t.endTimeMinutes), t.daysCount = Object.keys(t.segments).length, s;
  }
  removeEventSegment(t) {
    let i = Object.keys(t.segments).length;
    if (i <= 1)
      return c.formatDateLite(t.end);
    b.delete(t.segments, c.formatDateLite(t.end)), i--;
    const n = c.subtractDays(t.end, 1), s = c.formatDateLite(n), a = t.segments[s];
    return i ? a && (a.isLastDay = !0, a.endTimeMinutes = t.endTimeMinutes) : t.segments = null, t.daysCount = i || 1, t.end = n, s;
  }
  createEventSegments(t, i, n) {
    const s = i.getTime(), a = n.getTime();
    let r, l, o, d = t.start.getTime(), u = t.end.getTime(), h = !1;
    for (t.end.getHours() || t.end.getMinutes() || (u -= 1e3), b.set(t, "segments", {}), t.repeat ? (r = s, l = Math.min(a, t.repeat.until ? c.stringToDate(t.repeat.until).getTime() : a)) : (r = Math.max(s, d), l = Math.min(a, u)); r <= l; ) {
      let m = !1;
      const D = c.addDays(new Date(r), 1).setHours(0, 0, 0, 0);
      let p, g, _, w;
      if (t.repeat) {
        const k = new Date(r), C = c.formatDateLite(k);
        (h || t.occurrences && t.occurrences[C]) && (h || (d = t.occurrences[C].start, o = new Date(d).setHours(0, 0, 0, 0), u = t.occurrences[C].end), h = !0, m = !0), p = r === o, g = C === c.formatDateLite(new Date(u)), _ = new Date(p ? d : r), w = c.formatDateLite(_), g && (h = !1);
      } else
        m = !0, p = r === d, g = l === u && D > l, _ = p ? t.start : new Date(r), w = c.formatDateLite(p ? t.start : _);
      m && b.set(t.segments, w, { start: _, startTimeMinutes: p ? t.startTimeMinutes : 0, endTimeMinutes: g ? t.endTimeMinutes : W, isFirstDay: p, isLastDay: g }), r = D;
    }
    return t;
  }
  deleteAnEvent(t) {
    this._vuecal.emitWithEvent("event-delete", t), this._vuecal.mutableEvents = this._vuecal.mutableEvents.filter((i) => i._eid !== t._eid), this._vuecal.view.events = this._vuecal.view.events.filter((i) => i._eid !== t._eid);
  }
  checkCellOverlappingEvents(t, i) {
    V = t.slice(0), v = {}, t.forEach((s) => {
      V.shift(), v[s._eid] || b.set(v, s._eid, { overlaps: [], start: s.start, position: 0 }), v[s._eid].position = 0, V.forEach((a) => {
        v[a._eid] || b.set(v, a._eid, { overlaps: [], start: a.start, position: 0 });
        const r = this.eventInRange(a, s.start, s.end), l = i.overlapsPerTimeStep ? c.datesInSameTimeStep(s.start, a.start, i.timeStep) : 1;
        if (s.background || s.allDay || a.background || a.allDay || !r || !l) {
          let o, d;
          (o = (v[s._eid] || { overlaps: [] }).overlaps.indexOf(a._eid)) > -1 && v[s._eid].overlaps.splice(o, 1), (d = (v[a._eid] || { overlaps: [] }).overlaps.indexOf(s._eid)) > -1 && v[a._eid].overlaps.splice(d, 1), v[a._eid].position--;
        } else
          v[s._eid].overlaps.push(a._eid), v[s._eid].overlaps = [...new Set(v[s._eid].overlaps)], v[a._eid].overlaps.push(s._eid), v[a._eid].overlaps = [...new Set(v[a._eid].overlaps)], v[a._eid].position++;
      });
    });
    let n = 0;
    for (const s in v) {
      const a = v[s], r = a.overlaps.map((l) => ({ id: l, start: v[l].start }));
      r.push({ id: s, start: a.start }), r.sort((l, o) => l.start < o.start ? -1 : l.start > o.start ? 1 : l.id > o.id ? -1 : 1), a.position = r.findIndex((l) => l.id === s), n = Math.max(this.getOverlapsStreak(a, v), n);
    }
    return [v, n];
  }
  getOverlapsStreak(t, i = {}) {
    let n = t.overlaps.length + 1, s = [];
    return t.overlaps.forEach((a) => {
      s.includes(a) || t.overlaps.filter((r) => r !== a).forEach((r) => {
        i[r].overlaps.includes(a) || s.push(r);
      });
    }), s = [...new Set(s)], n -= s.length, n;
  }
  eventInRange(t, i, n) {
    if (t.allDay || !this._vuecal.time) {
      const r = new Date(t.start).setHours(0, 0, 0, 0);
      return new Date(t.end).setHours(23, 59, 0, 0) >= new Date(i).setHours(0, 0, 0, 0) && r <= new Date(n).setHours(0, 0, 0, 0);
    }
    const s = t.start.getTime(), a = t.end.getTime();
    return s < n.getTime() && a > i.getTime();
  }
}
function E(e, t, i, n, s, a, r, l) {
  var o, d = typeof e == "function" ? e.options : e;
  if (t && (d.render = t, d.staticRenderFns = i, d._compiled = !0), n && (d.functional = !0), a && (d._scopeId = "data-v-" + a), r ? (o = function(m) {
    (m = m || this.$vnode && this.$vnode.ssrContext || this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) || typeof __VUE_SSR_CONTEXT__ > "u" || (m = __VUE_SSR_CONTEXT__), s && s.call(this, m), m && m._registeredComponents && m._registeredComponents.add(r);
  }, d._ssrRegister = o) : s && (o = l ? function() {
    s.call(this, (d.functional ? this.parent : this).$root.$options.shadowRoot);
  } : s), o)
    if (d.functional) {
      d._injectStyles = o;
      var u = d.render;
      d.render = function(m, D) {
        return o.call(D), u(m, D);
      };
    } else {
      var h = d.beforeCreate;
      d.beforeCreate = h ? [].concat(h, o) : [o];
    }
  return { exports: e, options: d };
}
const F = E({ inject: ["vuecal", "utils", "view"], props: { transitionDirection: { type: String, default: "right" }, weekDays: { type: Array, default: () => [] }, switchToNarrowerView: { type: Function, default: () => {
} } }, methods: { selectCell(e, t) {
  e.getTime() !== this.view.selectedDate.getTime() && (this.view.selectedDate = e), this.utils.cell.selectCell(!1, e, t);
}, cleanupHeading: (e) => ({ label: e.full, date: e.date, ...e.today ? { today: e.today } : {} }) }, computed: { headings() {
  if (!["month", "week"].includes(this.view.id))
    return [];
  let e = !1;
  return this.weekDays.map((t, i) => {
    const n = this.utils.date.addDays(this.view.startDate, i);
    return { hide: t.hide, full: t.label, small: t.short || t.label.substr(0, 3), xsmall: t.short || t.label.substr(0, 1), ...this.view.id === "week" ? { dayOfMonth: n.getDate(), date: n, today: !e && this.utils.date.isToday(n) && !e++ } : {} };
  });
}, cellWidth() {
  return 100 / (7 - this.weekDays.reduce((e, t) => e + t.hide, 0));
}, weekdayCellStyles() {
  return { ...this.vuecal.hideWeekdays.length ? { width: `${this.cellWidth}%` } : {} };
}, cellHeadingsClickable() {
  return this.view.id === "week" && (this.vuecal.clickToNavigate || this.vuecal.dblclickToNavigate);
} } }, function() {
  var e = this, t = e._self._c;
  return t("div", { staticClass: "vuecal__flex vuecal__weekdays-headings" }, [e._l(e.headings, function(i, n) {
    return [i.hide ? e._e() : t("div", { key: n, staticClass: "vuecal__flex vuecal__heading", class: { today: i.today, clickable: e.cellHeadingsClickable }, style: e.weekdayCellStyles, on: { click: function(s) {
      e.view.id === "week" && e.selectCell(i.date, s);
    }, dblclick: function(s) {
      e.view.id === "week" && e.vuecal.dblclickToNavigate && e.switchToNarrowerView();
    } } }, [t("transition", { attrs: { name: `slide-fade--${e.transitionDirection}`, appear: e.vuecal.transitions } }, [t("div", { key: !!e.vuecal.transitions && `${n}-${i.dayOfMonth}`, staticClass: "vuecal__flex", attrs: { column: "" } }, [t("div", { staticClass: "vuecal__flex weekday-label", attrs: { grow: "" } }, [e._t("weekday-heading", function() {
      return [t("span", { staticClass: "full" }, [e._v(e._s(i.full))]), t("span", { staticClass: "small" }, [e._v(e._s(i.small))]), t("span", { staticClass: "xsmall" }, [e._v(e._s(i.xsmall))]), i.dayOfMonth ? t("span", [e._v("\xA0" + e._s(i.dayOfMonth))]) : e._e()];
    }, { heading: e.cleanupHeading(i), view: e.view })], 2), e.vuecal.hasSplits && e.vuecal.stickySplitLabels ? t("div", { staticClass: "vuecal__flex vuecal__split-days-headers", attrs: { grow: "" } }, e._l(e.vuecal.daySplits, function(s, a) {
      return t("div", { key: a, staticClass: "day-split-header", class: s.class || !1 }, [e._t("split-label", function() {
        return [e._v(e._s(s.label))];
      }, { split: s, view: e.view })], 2);
    }), 0) : e._e()])])], 1)];
  })], 2);
}, [], !1, null, null, null, null).exports, U = E({ inject: ["vuecal", "previous", "next", "switchView", "updateSelectedDate", "modules", "view"], components: { WeekdaysHeadings: F }, props: { options: { type: Object, default: () => ({}) }, editEvents: { type: Object, required: !0 }, hasSplits: { type: [Boolean, Number], default: !1 }, daySplits: { type: Array, default: () => [] }, viewProps: { type: Object, default: () => ({}) }, weekDays: { type: Array, default: () => [] }, switchToNarrowerView: { type: Function, default: () => {
} } }, data: () => ({ highlightedControl: null }), methods: { goToToday() {
  this.updateSelectedDate(new Date(new Date().setHours(0, 0, 0, 0)));
}, switchToBroaderView() {
  this.transitionDirection = "left", this.broaderView && this.switchView(this.broaderView);
} }, computed: { transitionDirection: { get() {
  return this.vuecal.transitionDirection;
}, set(e) {
  this.vuecal.transitionDirection = e;
} }, broaderView() {
  const { enabledViews: e } = this.vuecal;
  return e[e.indexOf(this.view.id) - 1];
}, showDaySplits() {
  return this.view.id === "day" && this.hasSplits && this.options.stickySplitLabels && !this.options.minSplitWidth;
}, dnd() {
  return this.modules.dnd;
} } }, function() {
  var e = this, t = e._self._c;
  return t("div", { staticClass: "vuecal__header" }, [e.options.hideViewSelector ? e._e() : t("div", { staticClass: "vuecal__flex vuecal__menu", attrs: { role: "tablist", "aria-label": "Calendar views navigation" } }, [e._l(e.viewProps.views, function(i, n) {
    return [i.enabled ? t("button", { key: n, staticClass: "vuecal__view-btn", class: { "vuecal__view-btn--active": e.view.id === n, "vuecal__view-btn--highlighted": e.highlightedControl === n }, attrs: { type: "button", "aria-label": `${i.label} view` }, on: { dragenter: function(s) {
      e.editEvents.drag && e.dnd && e.dnd.viewSelectorDragEnter(s, n, e.$data);
    }, dragleave: function(s) {
      e.editEvents.drag && e.dnd && e.dnd.viewSelectorDragLeave(s, n, e.$data);
    }, click: function(s) {
      return e.switchView(n, null, !0);
    } } }, [e._v(e._s(i.label))]) : e._e()];
  })], 2), e.options.hideTitleBar ? e._e() : t("div", { staticClass: "vuecal__title-bar" }, [t("button", { staticClass: "vuecal__arrow vuecal__arrow--prev", class: { "vuecal__arrow--highlighted": e.highlightedControl === "previous" }, attrs: { type: "button", "aria-label": `Previous ${e.view.id}` }, on: { click: e.previous, dragenter: function(i) {
    e.editEvents.drag && e.dnd && e.dnd.viewSelectorDragEnter(i, "previous", e.$data);
  }, dragleave: function(i) {
    e.editEvents.drag && e.dnd && e.dnd.viewSelectorDragLeave(i, "previous", e.$data);
  } } }, [e._t("arrow-prev")], 2), t("div", { staticClass: "vuecal__flex vuecal__title", attrs: { grow: "" } }, [t("transition", { attrs: { name: e.options.transitions ? `slide-fade--${e.transitionDirection}` : "" } }, [t(e.broaderView ? "button" : "span", { key: `${e.view.id}${e.view.startDate.toString()}`, tag: "component", attrs: { type: !!e.broaderView && "button", "aria-label": !!e.broaderView && `Go to ${e.broaderView} view` }, on: { click: function(i) {
    e.broaderView && e.switchToBroaderView();
  } } }, [e._t("title")], 2)], 1)], 1), e.options.todayButton ? t("button", { staticClass: "vuecal__today-btn", class: { "vuecal__today-btn--highlighted": e.highlightedControl === "today" }, attrs: { type: "button", "aria-label": "Today" }, on: { click: e.goToToday, dragenter: function(i) {
    e.editEvents.drag && e.dnd && e.dnd.viewSelectorDragEnter(i, "today", e.$data);
  }, dragleave: function(i) {
    e.editEvents.drag && e.dnd && e.dnd.viewSelectorDragLeave(i, "today", e.$data);
  } } }, [e._t("today-button")], 2) : e._e(), t("button", { staticClass: "vuecal__arrow vuecal__arrow--next", class: { "vuecal__arrow--highlighted": e.highlightedControl === "next" }, attrs: { type: "button", "aria-label": `Next ${e.view.id}` }, on: { click: e.next, dragenter: function(i) {
    e.editEvents.drag && e.dnd && e.dnd.viewSelectorDragEnter(i, "next", e.$data);
  }, dragleave: function(i) {
    e.editEvents.drag && e.dnd && e.dnd.viewSelectorDragLeave(i, "next", e.$data);
  } } }, [e._t("arrow-next")], 2)]), e.viewProps.weekDaysInHeader ? t("weekdays-headings", { attrs: { "week-days": e.weekDays, "transition-direction": e.transitionDirection, "switch-to-narrower-view": e.switchToNarrowerView }, scopedSlots: e._u([e.$scopedSlots["weekday-heading"] ? { key: "weekday-heading", fn: function({ heading: i, view: n }) {
    return [e._t("weekday-heading", null, { heading: i, view: n })];
  } } : null, e.$scopedSlots["split-label"] ? { key: "split-label", fn: function({ split: i }) {
    return [e._t("split-label", null, { split: i, view: e.view })];
  } } : null], null, !0) }) : e._e(), t("transition", { attrs: { name: `slide-fade--${e.transitionDirection}` } }, [e.showDaySplits ? t("div", { staticClass: "vuecal__flex vuecal__split-days-headers" }, e._l(e.daySplits, function(i, n) {
    return t("div", { key: n, staticClass: "day-split-header", class: i.class || !1 }, [e._t("split-label", function() {
      return [e._v(e._s(i.label))];
    }, { split: i, view: e.view.id })], 2);
  }), 0) : e._e()])], 1);
}, [], !1, null, null, null, null).exports, B = E({ inject: ["vuecal", "utils", "modules", "view", "domEvents"], components: { Event: E({ inject: ["vuecal", "utils", "modules", "view", "domEvents", "editEvents"], props: { cellFormattedDate: { type: String, default: "" }, event: { type: Object, default: () => ({}) }, cellEvents: { type: Array, default: () => [] }, overlaps: { type: Array, default: () => [] }, eventPosition: { type: Number, default: 0 }, overlapsStreak: { type: Number, default: 0 }, allDay: { type: Boolean, default: !1 } }, data: () => ({ touch: { dragThreshold: 30, startX: 0, startY: 0, dragged: !1 } }), methods: { onMouseDown(e, t = !1) {
  if ("ontouchstart" in window && !t)
    return !1;
  const { clickHoldAnEvent: i, focusAnEvent: n, resizeAnEvent: s, dragAnEvent: a } = this.domEvents;
  if (n._eid === this.event._eid && i._eid === this.event._eid)
    return !0;
  this.focusEvent(), i._eid = null, this.vuecal.editEvents.delete && this.event.deletable && (i.timeoutId = setTimeout(() => {
    s._eid || a._eid || (i._eid = this.event._eid, this.event.deleting = !0);
  }, i.timeout));
}, onMouseUp(e) {
  this.domEvents.focusAnEvent._eid !== this.event._eid || this.touch.dragged || (this.domEvents.focusAnEvent.mousedUp = !0), this.touch.dragged = !1;
}, onMouseEnter(e) {
  e.preventDefault(), this.vuecal.emitWithEvent("event-mouse-enter", this.event);
}, onMouseLeave(e) {
  e.preventDefault(), this.vuecal.emitWithEvent("event-mouse-leave", this.event);
}, onTouchMove(e) {
  if (typeof this.vuecal.onEventClick != "function")
    return;
  const { clientX: t, clientY: i } = e.touches[0], { startX: n, startY: s, dragThreshold: a } = this.touch;
  (Math.abs(t - n) > a || Math.abs(i - s) > a) && (this.touch.dragged = !0);
}, onTouchStart(e) {
  this.touch.startX = e.touches[0].clientX, this.touch.startY = e.touches[0].clientY, this.onMouseDown(e, !0);
}, onEnterKeypress(e) {
  if (typeof this.vuecal.onEventClick == "function")
    return this.vuecal.onEventClick(this.event, e);
}, onDblClick(e) {
  if (typeof this.vuecal.onEventDblclick == "function")
    return this.vuecal.onEventDblclick(this.event, e);
}, onDragStart(e) {
  this.dnd && this.dnd.eventDragStart(e, this.event);
}, onDragEnd() {
  this.dnd && this.dnd.eventDragEnd(this.event);
}, onResizeHandleMouseDown() {
  this.focusEvent(), this.domEvents.dragAnEvent._eid = null, this.domEvents.resizeAnEvent = Object.assign(this.domEvents.resizeAnEvent, { _eid: this.event._eid, start: (this.segment || this.event).start, split: this.event.split || null, segment: !!this.segment && this.utils.date.formatDateLite(this.segment.start), originalEnd: new Date((this.segment || this.event).end), originalEndTimeMinutes: this.event.endTimeMinutes }), this.event.resizing = !0;
}, deleteEvent(e = !1) {
  if ("ontouchstart" in window && !e)
    return !1;
  this.utils.event.deleteAnEvent(this.event);
}, touchDeleteEvent(e) {
  this.deleteEvent(!0);
}, cancelDeleteEvent() {
  this.event.deleting = !1;
}, focusEvent() {
  const { focusAnEvent: e } = this.domEvents, t = e._eid;
  if (t !== this.event._eid) {
    if (t) {
      const i = this.view.events.find((n) => n._eid === t);
      i && (i.focused = !1);
    }
    this.vuecal.cancelDelete(), this.vuecal.emitWithEvent("event-focus", this.event), e._eid = this.event._eid, this.event.focused = !0;
  }
} }, computed: { eventDimensions() {
  const { startTimeMinutes: e, endTimeMinutes: t } = this.segment || this.event;
  let i = e - this.vuecal.timeFrom;
  const n = Math.max(Math.round(i * this.vuecal.timeCellHeight / this.vuecal.timeStep), 0);
  i = Math.min(t, this.vuecal.timeTo) - this.vuecal.timeFrom;
  const s = Math.round(i * this.vuecal.timeCellHeight / this.vuecal.timeStep);
  return { top: n, height: Math.max(s - n, 5) };
}, eventStyles() {
  if (this.event.allDay || !this.vuecal.time || !this.event.endTimeMinutes || this.view.id === "month" || this.allDay)
    return {};
  let e = 100 / Math.min(this.overlaps.length + 1, this.overlapsStreak), t = 100 / (this.overlaps.length + 1) * this.eventPosition;
  this.vuecal.minEventWidth && e < this.vuecal.minEventWidth && (e = this.vuecal.minEventWidth, t = (100 - this.vuecal.minEventWidth) / this.overlaps.length * this.eventPosition);
  const { top: i, height: n } = this.eventDimensions;
  return { top: `${i}px`, height: `${n}px`, width: `${e}%`, left: this.event.left && `${this.event.left}px` || `${t}%` };
}, eventClasses() {
  const { isFirstDay: e, isLastDay: t } = this.segment || {};
  return { [this.event.class]: !!this.event.class, "vuecal__event--focus": this.event.focused, "vuecal__event--resizing": this.event.resizing, "vuecal__event--background": this.event.background, "vuecal__event--deletable": this.event.deleting, "vuecal__event--all-day": this.event.allDay, "vuecal__event--dragging": !this.event.draggingStatic && this.event.dragging, "vuecal__event--static": this.event.dragging && this.event.draggingStatic, "vuecal__event--multiple-days": !!this.segment, "event-start": this.segment && e && !t, "event-middle": this.segment && !e && !t, "event-end": this.segment && t && !e };
}, segment() {
  return this.event.segments && this.event.segments[this.cellFormattedDate] || null;
}, draggable() {
  const { draggable: e, background: t, daysCount: i } = this.event;
  return this.vuecal.editEvents.drag && e && !t && i === 1;
}, resizable() {
  const { editEvents: e, time: t } = this.vuecal;
  return e.resize && this.event.resizable && t && !this.allDay && (!this.segment || this.segment && this.segment.isLastDay) && this.view.id !== "month";
}, dnd() {
  return this.modules.dnd;
} } }, function() {
  var e = this, t = e._self._c;
  return t("div", { staticClass: "vuecal__event", class: e.eventClasses, style: e.eventStyles, attrs: { tabindex: "0", draggable: e.draggable }, on: { focus: e.focusEvent, keypress: function(i) {
    return !i.type.indexOf("key") && e._k(i.keyCode, "enter", 13, i.key, "Enter") ? null : (i.stopPropagation(), e.onEnterKeypress.apply(null, arguments));
  }, mouseenter: e.onMouseEnter, mouseleave: e.onMouseLeave, touchstart: function(i) {
    return i.stopPropagation(), e.onTouchStart.apply(null, arguments);
  }, mousedown: function(i) {
    e.onMouseDown(i);
  }, mouseup: e.onMouseUp, touchend: e.onMouseUp, touchmove: e.onTouchMove, dblclick: e.onDblClick, dragstart: function(i) {
    e.draggable && e.onDragStart(i);
  }, dragend: function(i) {
    e.draggable && e.onDragEnd();
  } } }, [e.vuecal.editEvents.delete && e.event.deletable ? t("div", { staticClass: "vuecal__event-delete", on: { click: function(i) {
    return i.stopPropagation(), e.deleteEvent.apply(null, arguments);
  }, touchstart: function(i) {
    return i.stopPropagation(), e.touchDeleteEvent.apply(null, arguments);
  } } }, [e._v(e._s(e.vuecal.texts.deleteEvent))]) : e._e(), e._t("event", null, { event: e.event, view: e.view.id }), e.resizable ? t("div", { staticClass: "vuecal__event-resize-handle", attrs: { contenteditable: "false" }, on: { mousedown: function(i) {
    return i.stopPropagation(), i.preventDefault(), e.onResizeHandleMouseDown.apply(null, arguments);
  }, touchstart: function(i) {
    return i.stopPropagation(), i.preventDefault(), e.onResizeHandleMouseDown.apply(null, arguments);
  } } }) : e._e()], 2);
}, [], !1, null, null, null, null).exports }, props: { options: { type: Object, default: () => ({}) }, editEvents: { type: Object, required: !0 }, data: { type: Object, required: !0 }, cellSplits: { type: Array, default: () => [] }, minTimestamp: { type: [Number, null], default: null }, maxTimestamp: { type: [Number, null], default: null }, cellWidth: { type: [Number, Boolean], default: !1 }, allDay: { type: Boolean, default: !1 } }, data: () => ({ cellOverlaps: {}, cellOverlapsStreak: 1, timeAtCursor: null, highlighted: !1, highlightedSplit: null }), methods: { getSplitAtCursor({ target: e }) {
  let t = e.classList.contains("vuecal__cell-split") ? e : this.vuecal.findAncestor(e, "vuecal__cell-split");
  return t && (t = t.attributes["data-split"].value, parseInt(t).toString() === t.toString() && (t = parseInt(t))), t || null;
}, splitClasses(e) {
  return { "vuecal__cell-split": !0, "vuecal__cell-split--highlighted": this.highlightedSplit === e.id, [e.class]: !!e.class };
}, checkCellOverlappingEvents() {
  this.options.time && this.eventsCount && !this.splitsCount && (this.eventsCount === 1 ? (this.cellOverlaps = [], this.cellOverlapsStreak = 1) : [this.cellOverlaps, this.cellOverlapsStreak] = this.utils.event.checkCellOverlappingEvents(this.events, this.options));
}, isDOMElementAnEvent(e) {
  return this.vuecal.isDOMElementAnEvent(e);
}, selectCell(e, t = !1) {
  const i = this.splitsCount ? this.getSplitAtCursor(e) : null;
  this.utils.cell.selectCell(t, this.timeAtCursor, i), this.timeAtCursor = null;
}, onCellkeyPressEnter(e) {
  this.isSelected || this.onCellFocus(e);
  const t = this.splitsCount ? this.getSplitAtCursor(e) : null;
  this.utils.cell.keyPressEnterCell(this.timeAtCursor, t), this.timeAtCursor = null;
}, onCellFocus(e) {
  if (!this.isSelected && !this.isDisabled) {
    this.isSelected = this.data.startDate;
    const t = this.splitsCount ? this.getSplitAtCursor(e) : null, i = this.timeAtCursor || this.data.startDate;
    this.vuecal.$emit("cell-focus", t ? { date: i, split: t } : i);
  }
}, onCellMouseDown(e, t = null, i = !1) {
  if ("ontouchstart" in window && !i)
    return !1;
  this.isSelected || this.onCellFocus(e);
  const { clickHoldACell: n, focusAnEvent: s } = this.domEvents;
  this.domEvents.cancelClickEventCreation = !1, n.eventCreated = !1, this.timeAtCursor = new Date(this.data.startDate);
  const { minutes: a, cursorCoords: { y: r } } = this.vuecal.minutesAtCursor(e);
  this.timeAtCursor.setMinutes(a);
  const l = this.isDOMElementAnEvent(e.target);
  !l && s._eid && ((this.view.events.find((o) => o._eid === s._eid) || {}).focused = !1), this.editEvents.create && !l && this.setUpEventCreation(e, r);
}, setUpEventCreation(e, t) {
  if (this.options.dragToCreateEvent && ["week", "day"].includes(this.view.id)) {
    const { dragCreateAnEvent: i } = this.domEvents;
    if (i.startCursorY = t, i.split = this.splitsCount ? this.getSplitAtCursor(e) : null, i.start = this.timeAtCursor, this.options.snapToTime) {
      let n = 60 * this.timeAtCursor.getHours() + this.timeAtCursor.getMinutes();
      const s = n + this.options.snapToTime / 2;
      n = s - s % this.options.snapToTime, i.start.setHours(0, n, 0, 0);
    }
  } else
    this.options.cellClickHold && ["month", "week", "day"].includes(this.view.id) && this.setUpCellHoldTimer(e);
}, setUpCellHoldTimer(e) {
  const { clickHoldACell: t } = this.domEvents;
  t.cellId = `${this.vuecal._uid}_${this.data.formattedDate}`, t.split = this.splitsCount ? this.getSplitAtCursor(e) : null, t.timeoutId = setTimeout(() => {
    if (t.cellId && !this.domEvents.cancelClickEventCreation) {
      const { _eid: i } = this.utils.event.createAnEvent(this.timeAtCursor, null, t.split ? { split: t.split } : {});
      t.eventCreated = i;
    }
  }, t.timeout);
}, onCellTouchStart(e, t = null) {
  this.onCellMouseDown(e, t, !0);
}, onCellClick(e) {
  this.isDOMElementAnEvent(e.target) || this.selectCell(e);
}, onCellDblClick(e) {
  const t = new Date(this.data.startDate);
  t.setMinutes(this.vuecal.minutesAtCursor(e).minutes);
  const i = this.splitsCount ? this.getSplitAtCursor(e) : null;
  this.vuecal.$emit("cell-dblclick", i ? { date: t, split: i } : t), this.options.dblclickToNavigate && this.vuecal.switchToNarrowerView();
}, onCellContextMenu(e) {
  e.stopPropagation(), e.preventDefault();
  const t = new Date(this.data.startDate), { cursorCoords: i, minutes: n } = this.vuecal.minutesAtCursor(e);
  t.setMinutes(n);
  const s = this.splitsCount ? this.getSplitAtCursor(e) : null;
  this.vuecal.$emit("cell-contextmenu", { date: t, ...i, ...s || {}, e });
} }, computed: { dnd() {
  return this.modules.dnd;
}, nowInMinutes() {
  return this.utils.date.dateToMinutes(this.vuecal.now);
}, isBeforeMinDate() {
  return this.minTimestamp !== null && this.minTimestamp > this.data.endDate.getTime();
}, isAfterMaxDate() {
  return this.maxTimestamp && this.maxTimestamp < this.data.startDate.getTime();
}, isDisabled() {
  const { disableDays: e } = this.options, { isYearsOrYearView: t } = this.vuecal;
  return !(!e.length || !e.includes(this.data.formattedDate) || t) || this.isBeforeMinDate || this.isAfterMaxDate;
}, isSelected: { get() {
  let e = !1;
  const { selectedDate: t } = this.view;
  return e = this.view.id === "years" ? t.getFullYear() === this.data.startDate.getFullYear() : this.view.id === "year" ? t.getFullYear() === this.data.startDate.getFullYear() && t.getMonth() === this.data.startDate.getMonth() : t.getTime() === this.data.startDate.getTime(), e;
}, set(e) {
  this.view.selectedDate = e, this.vuecal.$emit("update:selected-date", this.view.selectedDate);
} }, isWeekOrDayView() {
  return ["week", "day"].includes(this.view.id);
}, transitionDirection() {
  return this.vuecal.transitionDirection;
}, specialHours() {
  return this.data.specialHours.map((e) => {
    let { from: t, to: i } = e;
    return t = Math.max(t, this.options.timeFrom), i = Math.min(i, this.options.timeTo), { ...e, height: (i - t) * this.timeScale, top: (t - this.options.timeFrom) * this.timeScale };
  });
}, events() {
  const { startDate: e, endDate: t } = this.data;
  let i = [];
  if (!["years", "year"].includes(this.view.id) || this.options.eventsCountOnYearView) {
    if (i = this.view.events.slice(0), this.view.id === "month" && i.push(...this.view.outOfScopeEvents), i = i.filter((n) => this.utils.event.eventInRange(n, e, t)), this.options.showAllDayEvents && this.view.id !== "month" && (i = i.filter((n) => !!n.allDay === this.allDay)), this.options.time && this.isWeekOrDayView && !this.allDay) {
      const { timeFrom: n, timeTo: s } = this.options;
      i = i.filter((a) => {
        const r = a.daysCount > 1 && a.segments[this.data.formattedDate] || {}, l = a.daysCount === 1 && a.startTimeMinutes < s && a.endTimeMinutes > n, o = a.daysCount > 1 && r.startTimeMinutes < s && r.endTimeMinutes > n;
        return a.allDay || l || o || !1;
      });
    }
    !this.options.time || !this.isWeekOrDayView || this.options.showAllDayEvents && this.allDay || i.sort((n, s) => n.start < s.start ? -1 : 1), this.cellSplits.length || this.$nextTick(this.checkCellOverlappingEvents);
  }
  return i;
}, eventsCount() {
  return this.events.length;
}, splits() {
  return this.cellSplits.map((e, t) => {
    const i = this.events.filter((a) => a.split === e.id), [n, s] = this.utils.event.checkCellOverlappingEvents(i.filter((a) => !a.background && !a.allDay), this.options);
    return { ...e, overlaps: n, overlapsStreak: s, events: i };
  });
}, splitsCount() {
  return this.splits.length;
}, cellClasses() {
  return { [this.data.class]: !!this.data.class, "vuecal__cell--current": this.data.current, "vuecal__cell--today": this.data.today, "vuecal__cell--out-of-scope": this.data.outOfScope, "vuecal__cell--before-min": this.isDisabled && this.isBeforeMinDate, "vuecal__cell--after-max": this.isDisabled && this.isAfterMaxDate, "vuecal__cell--disabled": this.isDisabled, "vuecal__cell--selected": this.isSelected, "vuecal__cell--highlighted": this.highlighted, "vuecal__cell--has-splits": this.splitsCount, "vuecal__cell--has-events": this.eventsCount };
}, cellStyles() {
  return { ...this.cellWidth ? { width: `${this.cellWidth}%` } : {} };
}, timelineVisible() {
  const { time: e, timeTo: t } = this.options;
  return this.data.today && this.isWeekOrDayView && e && !this.allDay && this.nowInMinutes <= t;
}, todaysTimePosition() {
  if (!this.data.today || !this.options.time)
    return;
  const e = this.nowInMinutes - this.options.timeFrom;
  return Math.round(e * this.timeScale);
}, timeScale() {
  return this.options.timeCellHeight / this.options.timeStep;
} } }, function() {
  var e = this, t = e._self._c;
  return t("transition-group", { staticClass: "vuecal__cell", class: e.cellClasses, style: e.cellStyles, attrs: { name: `slide-fade--${e.transitionDirection}`, tag: "div", appear: e.options.transitions } }, [e._l(e.splitsCount ? e.splits : 1, function(i, n) {
    return t("div", { key: e.options.transitions ? `${e.view.id}-${e.data.content}-${n}` : n, staticClass: "vuecal__flex vuecal__cell-content", class: e.splitsCount && e.splitClasses(i), attrs: { "data-split": !!e.splitsCount && i.id, column: "", tabindex: "0", "aria-label": e.data.content }, on: { focus: function(s) {
      return e.onCellFocus(s);
    }, keypress: function(s) {
      return !s.type.indexOf("key") && e._k(s.keyCode, "enter", 13, s.key, "Enter") ? null : e.onCellkeyPressEnter(s);
    }, touchstart: function(s) {
      !e.isDisabled && e.onCellTouchStart(s, e.splitsCount ? i.id : null);
    }, mousedown: function(s) {
      !e.isDisabled && e.onCellMouseDown(s, e.splitsCount ? i.id : null);
    }, click: function(s) {
      !e.isDisabled && e.onCellClick(s);
    }, dblclick: function(s) {
      !e.isDisabled && e.onCellDblClick(s);
    }, contextmenu: function(s) {
      !e.isDisabled && e.options.cellContextmenu && e.onCellContextMenu(s);
    }, dragenter: function(s) {
      !e.isDisabled && e.editEvents.drag && e.dnd && e.dnd.cellDragEnter(s, e.$data, e.data.startDate);
    }, dragover: function(s) {
      !e.isDisabled && e.editEvents.drag && e.dnd && e.dnd.cellDragOver(s, e.$data, e.data.startDate, e.splitsCount ? i.id : null);
    }, dragleave: function(s) {
      !e.isDisabled && e.editEvents.drag && e.dnd && e.dnd.cellDragLeave(s, e.$data, e.data.startDate);
    }, drop: function(s) {
      !e.isDisabled && e.editEvents.drag && e.dnd && e.dnd.cellDragDrop(s, e.$data, e.data.startDate, e.splitsCount ? i.id : null);
    } } }, [e.options.showTimeInCells && e.options.time && e.isWeekOrDayView && !e.allDay ? t("div", { staticClass: "cell-time-labels" }, e._l(e.vuecal.timeCells, function(s, a) {
      return t("span", { key: a, staticClass: "cell-time-label" }, [e._v(e._s(s.label) + `
`)]);
    }), 0) : e._e(), e.isWeekOrDayView && !e.allDay && e.specialHours.length ? e._l(e.specialHours, function(s, a) {
      return t("div", { staticClass: "vuecal__special-hours", class: `vuecal__special-hours--day${s.day} ${s.class}`, style: `height: ${s.height}px;top: ${s.top}px` }, [s.label ? t("div", { staticClass: "special-hours-label", domProps: { innerHTML: e._s(s.label) } }) : e._e()]);
    }) : e._e(), e._t("cell-content", null, { events: e.events, selectCell: (s) => e.selectCell(s, !0), split: !!e.splitsCount && i }), e.eventsCount && (e.isWeekOrDayView || e.view.id === "month" && e.options.eventsOnMonthView) ? t("div", { staticClass: "vuecal__cell-events" }, e._l(e.splitsCount ? i.events : e.events, function(s, a) {
      return t("event", { key: a, attrs: { "cell-formatted-date": e.data.formattedDate, event: s, "all-day": e.allDay, "cell-events": e.splitsCount ? i.events : e.events, overlaps: ((e.splitsCount ? i.overlaps[s._eid] : e.cellOverlaps[s._eid]) || []).overlaps, "event-position": ((e.splitsCount ? i.overlaps[s._eid] : e.cellOverlaps[s._eid]) || []).position, "overlaps-streak": e.splitsCount ? i.overlapsStreak : e.cellOverlapsStreak }, scopedSlots: e._u([{ key: "event", fn: function({ event: r, view: l }) {
        return [e._t("event", null, { view: l, event: r })];
      } }], null, !0) });
    }), 1) : e._e()], 2);
  }), e.timelineVisible ? t("div", { key: e.options.transitions ? `${e.view.id}-now-line` : "now-line", staticClass: "vuecal__now-line", style: `top: ${e.todaysTimePosition}px`, attrs: { title: e.utils.date.formatTime(e.vuecal.now) } }) : e._e()], 2);
}, [], !1, null, null, null, null).exports, R = E({ inject: ["vuecal", "view", "editEvents"], components: { "vuecal-cell": B }, props: { options: { type: Object, required: !0 }, cells: { type: Array, required: !0 }, label: { type: String, required: !0 }, daySplits: { type: Array, default: () => [] }, shortEvents: { type: Boolean, default: !0 }, height: { type: String, default: "" }, cellOrSplitMinWidth: { type: Number, default: null } }, computed: { hasCellOrSplitWidth() {
  return !!(this.options.minCellWidth || this.daySplits.length && this.options.minSplitWidth);
} } }, function() {
  var e = this, t = e._self._c;
  return t("div", { staticClass: "vuecal__flex vuecal__all-day", style: e.cellOrSplitMinWidth && { height: e.height } }, [e.cellOrSplitMinWidth ? e._e() : t("div", { staticClass: "vuecal__all-day-text", staticStyle: { width: "3em" } }, [t("span", [e._v(e._s(e.label))])]), t("div", { staticClass: "vuecal__flex vuecal__cells", class: `${e.view.id}-view`, style: e.cellOrSplitMinWidth ? `min-width: ${e.cellOrSplitMinWidth}px` : "", attrs: { grow: "" } }, e._l(e.cells, function(i, n) {
    return t("vuecal-cell", { key: n, attrs: { options: e.options, "edit-events": e.editEvents, data: i, "all-day": !0, "cell-width": e.options.hideWeekdays.length && (e.vuecal.isWeekView || e.vuecal.isMonthView) && e.vuecal.cellWidth, "min-timestamp": e.options.minTimestamp, "max-timestamp": e.options.maxTimestamp, "cell-splits": e.daySplits }, scopedSlots: e._u([{ key: "event", fn: function({ event: s, view: a }) {
      return [e._t("event", null, { view: a, event: s })];
    } }], null, !0) });
  }), 1)]);
}, [], !1, null, null, null, null).exports;
var X = function() {
  var e = this, t = e._self._c;
  return t("div", { ref: "vuecal", staticClass: "vuecal__flex vuecal", class: e.cssClasses, attrs: { column: "", lang: e.locale } }, [t("vuecal-header", { attrs: { options: e.$props, "edit-events": e.editEvents, "view-props": { views: e.views, weekDaysInHeader: e.weekDaysInHeader }, "week-days": e.weekDays, "has-splits": e.hasSplits, "day-splits": e.daySplits, "switch-to-narrower-view": e.switchToNarrowerView }, scopedSlots: e._u([{ key: "arrow-prev", fn: function() {
    return [e._t("arrow-prev", function() {
      return [e._v("\xA0"), t("i", { staticClass: "angle" }), e._v("\xA0")];
    })];
  }, proxy: !0 }, { key: "arrow-next", fn: function() {
    return [e._t("arrow-next", function() {
      return [e._v("\xA0"), t("i", { staticClass: "angle" }), e._v("\xA0")];
    })];
  }, proxy: !0 }, { key: "today-button", fn: function() {
    return [e._t("today-button", function() {
      return [t("span", { staticClass: "default" }, [e._v(e._s(e.texts.today))])];
    })];
  }, proxy: !0 }, { key: "title", fn: function() {
    return [e._t("title", function() {
      return [e._v(e._s(e.viewTitle))];
    }, { title: e.viewTitle, view: e.view })];
  }, proxy: !0 }, e.$scopedSlots["weekday-heading"] ? { key: "weekday-heading", fn: function({ heading: i, view: n }) {
    return [e._t("weekday-heading", null, { heading: i, view: n })];
  } } : null, e.$scopedSlots["split-label"] ? { key: "split-label", fn: function({ split: i }) {
    return [e._t("split-label", null, { split: i, view: e.view.id })];
  } } : null], null, !0) }), e.hideBody ? e._e() : t("div", { staticClass: "vuecal__flex vuecal__body", attrs: { grow: "" } }, [t("transition", { attrs: { name: `slide-fade--${e.transitionDirection}`, appear: e.transitions } }, [t("div", { key: !!e.transitions && e.view.id, staticClass: "vuecal__flex", staticStyle: { "min-width": "100%" }, attrs: { column: "" } }, [e.showAllDayEvents && e.hasTimeColumn && (!e.cellOrSplitMinWidth || e.isDayView && !e.minSplitWidth) ? t("all-day-bar", e._b({ scopedSlots: e._u([{ key: "event", fn: function({ event: i, view: n }) {
    return [e._t("event", function() {
      return [e.editEvents.title && i.titleEditable ? t("div", { staticClass: "vuecal__event-title vuecal__event-title--edit", attrs: { contenteditable: "" }, domProps: { innerHTML: e._s(i.title) }, on: { blur: function(s) {
        return e.onEventTitleBlur(s, i);
      } } }) : i.title ? t("div", { staticClass: "vuecal__event-title", domProps: { innerHTML: e._s(i.title) } }) : e._e(), !i.content || e.hasShortEvents || e.isShortMonthView ? e._e() : t("div", { staticClass: "vuecal__event-content", domProps: { innerHTML: e._s(i.content) } })];
    }, { view: n, event: i })];
  } }], null, !0) }, "all-day-bar", e.allDayBar, !1)) : e._e(), t("div", { staticClass: "vuecal__bg", class: { vuecal__flex: !e.hasTimeColumn }, attrs: { column: "" } }, [t("div", { staticClass: "vuecal__flex", attrs: { row: "", grow: "" } }, [e.hasTimeColumn ? t("div", { staticClass: "vuecal__time-column" }, [e.showAllDayEvents && e.cellOrSplitMinWidth && (!e.isDayView || e.minSplitWidth) ? t("div", { staticClass: "vuecal__all-day-text", style: { height: e.allDayBar.height } }, [t("span", [e._v(e._s(e.texts.allDay))])]) : e._e(), e._l(e.timeCells, function(i, n) {
    return t("div", { key: n, staticClass: "vuecal__time-cell", style: `height: ${e.timeCellHeight}px` }, [e._t("time-cell", function() {
      return [t("span", { staticClass: "vuecal__time-cell-line" }), t("span", { staticClass: "vuecal__time-cell-label" }, [e._v(e._s(i.label))])];
    }, { hours: i.hours, minutes: i.minutes })], 2);
  })], 2) : e._e(), e.showWeekNumbers && e.isMonthView ? t("div", { staticClass: "vuecal__flex vuecal__week-numbers", attrs: { column: "" } }, e._l(6, function(i) {
    return t("div", { key: i, staticClass: "vuecal__flex vuecal__week-number-cell", attrs: { grow: "" } }, [e._t("week-number-cell", function() {
      return [e._v(e._s(e.getWeekNumber(i - 1)))];
    }, { week: e.getWeekNumber(i - 1) })], 2);
  }), 0) : e._e(), t("div", { staticClass: "vuecal__flex vuecal__cells", class: `${e.view.id}-view`, attrs: { grow: "", wrap: !e.cellOrSplitMinWidth || !e.isWeekView, column: !!e.cellOrSplitMinWidth } }, [e.cellOrSplitMinWidth && e.isWeekView ? t("weekdays-headings", { style: e.cellOrSplitMinWidth ? `min-width: ${e.cellOrSplitMinWidth}px` : "", attrs: { "transition-direction": e.transitionDirection, "week-days": e.weekDays, "switch-to-narrower-view": e.switchToNarrowerView }, scopedSlots: e._u([e.$scopedSlots["weekday-heading"] ? { key: "weekday-heading", fn: function({ heading: i, view: n }) {
    return [e._t("weekday-heading", null, { heading: i, view: n })];
  } } : null, e.$scopedSlots["split-label"] ? { key: "split-label", fn: function({ split: i }) {
    return [e._t("split-label", null, { split: i, view: e.view.id })];
  } } : null], null, !0) }) : e.hasSplits && e.stickySplitLabels && e.minSplitWidth ? t("div", { staticClass: "vuecal__flex vuecal__split-days-headers", style: e.cellOrSplitMinWidth ? `min-width: ${e.cellOrSplitMinWidth}px` : "" }, e._l(e.daySplits, function(i, n) {
    return t("div", { key: n, staticClass: "day-split-header", class: i.class || !1 }, [e._t("split-label", function() {
      return [e._v(e._s(i.label))];
    }, { split: i, view: e.view.id })], 2);
  }), 0) : e._e(), e.showAllDayEvents && e.hasTimeColumn && (e.isWeekView && e.cellOrSplitMinWidth || e.isDayView && e.hasSplits && e.minSplitWidth) ? t("all-day-bar", e._b({ scopedSlots: e._u([{ key: "event", fn: function({ event: i, view: n }) {
    return [e._t("event", function() {
      return [e.editEvents.title && i.titleEditable ? t("div", { staticClass: "vuecal__event-title vuecal__event-title--edit", attrs: { contenteditable: "" }, domProps: { innerHTML: e._s(i.title) }, on: { blur: function(s) {
        return e.onEventTitleBlur(s, i);
      } } }) : i.title ? t("div", { staticClass: "vuecal__event-title", domProps: { innerHTML: e._s(i.title) } }) : e._e(), !i.content || e.hasShortEvents || e.isShortMonthView ? e._e() : t("div", { staticClass: "vuecal__event-content", domProps: { innerHTML: e._s(i.content) } })];
    }, { view: n, event: i })];
  } }], null, !0) }, "all-day-bar", e.allDayBar, !1)) : e._e(), t("div", { ref: "cells", staticClass: "vuecal__flex", style: e.cellOrSplitMinWidth ? `min-width: ${e.cellOrSplitMinWidth}px` : "", attrs: { grow: "", wrap: !e.cellOrSplitMinWidth || !e.isWeekView } }, e._l(e.viewCells, function(i, n) {
    return t("vuecal-cell", { key: n, attrs: { options: e.$props, "edit-events": e.editEvents, data: i, "cell-width": e.hideWeekdays.length && (e.isWeekView || e.isMonthView) && e.cellWidth, "min-timestamp": e.minTimestamp, "max-timestamp": e.maxTimestamp, "cell-splits": e.hasSplits && e.daySplits || [] }, scopedSlots: e._u([{ key: "cell-content", fn: function({ events: s, split: a, selectCell: r }) {
      return [e._t("cell-content", function() {
        return [a && !e.stickySplitLabels ? t("div", { staticClass: "split-label", domProps: { innerHTML: e._s(a.label) } }) : e._e(), i.content ? t("div", { staticClass: "vuecal__cell-date", domProps: { innerHTML: e._s(i.content) } }) : e._e(), (e.isMonthView && !e.eventsOnMonthView || e.isYearsOrYearView && e.eventsCountOnYearView) && s.length ? t("div", { staticClass: "vuecal__cell-events-count" }, [e._t("events-count", function() {
          return [e._v(e._s(s.length))];
        }, { view: e.view, events: s })], 2) : e._e(), !e.cellOrSplitHasEvents(s, a) && e.isWeekOrDayView ? t("div", { staticClass: "vuecal__no-event" }, [e._t("no-event", function() {
          return [e._v(e._s(e.texts.noEvent))];
        })], 2) : e._e()];
      }, { cell: i, view: e.view, goNarrower: r, events: s })];
    } }, { key: "event", fn: function({ event: s, view: a }) {
      return [e._t("event", function() {
        return [e.editEvents.title && s.titleEditable ? t("div", { staticClass: "vuecal__event-title vuecal__event-title--edit", attrs: { contenteditable: "" }, domProps: { innerHTML: e._s(s.title) }, on: { blur: function(r) {
          return e.onEventTitleBlur(r, s);
        } } }) : s.title ? t("div", { staticClass: "vuecal__event-title", domProps: { innerHTML: e._s(s.title) } }) : e._e(), !e.time || s.allDay || e.isMonthView && (s.allDay || e.showAllDayEvents === "short") || e.isShortMonthView ? e._e() : t("div", { staticClass: "vuecal__event-time" }, [e._v(e._s(e.utils.date.formatTime(s.start, e.TimeFormat))), s.endTimeMinutes ? t("span", [e._v("\xA0- " + e._s(e.utils.date.formatTime(s.end, e.TimeFormat, null, !0)))]) : e._e(), s.daysCount > 1 && (s.segments[i.formattedDate] || {}).isFirstDay ? t("small", { staticClass: "days-to-end" }, [e._v("\xA0+" + e._s(s.daysCount - 1) + e._s((e.texts.day[0] || "").toLowerCase()))]) : e._e()]), !s.content || e.isMonthView && s.allDay && e.showAllDayEvents === "short" || e.isShortMonthView ? e._e() : t("div", { staticClass: "vuecal__event-content", domProps: { innerHTML: e._s(s.content) } })];
      }, { view: a, event: s })];
    } }, { key: "no-event", fn: function() {
      return [e._t("no-event", function() {
        return [e._v(e._s(e.texts.noEvent))];
      })];
    }, proxy: !0 }], null, !0) });
  }), 1)], 1)])])], 1)]), e.ready ? e._e() : t("div", { staticClass: "vuecal__scrollbar-check" }, [t("div")])], 1)], 1);
}, q = [];
const O = 1440, x = { weekDays: Array(7).fill(""), weekDaysShort: [], months: Array(12).fill(""), years: "", year: "", month: "", week: "", day: "", today: "", noEvent: "", allDay: "", deleteEvent: "", createEvent: "", dateFormat: "dddd MMMM D, YYYY", am: "am", pm: "pm" }, Y = ["years", "year", "month", "week", "day"], L = new class {
  constructor(e, t = !1) {
    f(this, "texts", {});
    f(this, "dateToMinutes", (e) => 60 * e.getHours() + e.getMinutes());
    y = this, this._texts = e, t || !Date || Date.prototype.addDays || this._initDatePrototypes();
  }
  _initDatePrototypes() {
    Date.prototype.addDays = function(e) {
      return y.addDays(this, e);
    }, Date.prototype.subtractDays = function(e) {
      return y.subtractDays(this, e);
    }, Date.prototype.addHours = function(e) {
      return y.addHours(this, e);
    }, Date.prototype.subtractHours = function(e) {
      return y.subtractHours(this, e);
    }, Date.prototype.addMinutes = function(e) {
      return y.addMinutes(this, e);
    }, Date.prototype.subtractMinutes = function(e) {
      return y.subtractMinutes(this, e);
    }, Date.prototype.getWeek = function() {
      return y.getWeek(this);
    }, Date.prototype.isToday = function() {
      return y.isToday(this);
    }, Date.prototype.isLeapYear = function() {
      return y.isLeapYear(this);
    }, Date.prototype.format = function(e = "YYYY-MM-DD") {
      return y.formatDate(this, e);
    }, Date.prototype.formatTime = function(e = "HH:mm") {
      return y.formatTime(this, e);
    };
  }
  removePrototypes() {
    delete Date.prototype.addDays, delete Date.prototype.subtractDays, delete Date.prototype.addHours, delete Date.prototype.subtractHours, delete Date.prototype.addMinutes, delete Date.prototype.subtractMinutes, delete Date.prototype.getWeek, delete Date.prototype.isToday, delete Date.prototype.isLeapYear, delete Date.prototype.format, delete Date.prototype.formatTime;
  }
  updateTexts(e) {
    this._texts = e;
  }
  _todayFormatted() {
    return $ !== new Date().getDate() && (T = new Date(), $ = T.getDate(), H = `${T.getFullYear()}-${T.getMonth()}-${T.getDate()}`), H;
  }
  addDays(e, t) {
    const i = new Date(e.valueOf());
    return i.setDate(i.getDate() + t), i;
  }
  subtractDays(e, t) {
    const i = new Date(e.valueOf());
    return i.setDate(i.getDate() - t), i;
  }
  addHours(e, t) {
    const i = new Date(e.valueOf());
    return i.setHours(i.getHours() + t), i;
  }
  subtractHours(e, t) {
    const i = new Date(e.valueOf());
    return i.setHours(i.getHours() - t), i;
  }
  addMinutes(e, t) {
    const i = new Date(e.valueOf());
    return i.setMinutes(i.getMinutes() + t), i;
  }
  subtractMinutes(e, t) {
    const i = new Date(e.valueOf());
    return i.setMinutes(i.getMinutes() - t), i;
  }
  getWeek(e) {
    const t = new Date(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate())), i = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - i);
    const n = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    return Math.ceil(((t - n) / 864e5 + 1) / 7);
  }
  isToday(e) {
    return `${e.getFullYear()}-${e.getMonth()}-${e.getDate()}` === this._todayFormatted();
  }
  isLeapYear(e) {
    const t = e.getFullYear();
    return !(t % 400) || t % 100 && !(t % 4);
  }
  getPreviousFirstDayOfWeek(e = null, t) {
    const i = e && new Date(e.valueOf()) || new Date(), n = t ? 7 : 6;
    return i.setDate(i.getDate() - (i.getDay() + n) % 7), i;
  }
  stringToDate(e) {
    return e instanceof Date ? e : (e.length === 10 && (e += " 00:00"), new Date(e.replace(/-/g, "/")));
  }
  countDays(e, t) {
    typeof e == "string" && (e = e.replace(/-/g, "/")), typeof t == "string" && (t = t.replace(/-/g, "/")), e = new Date(e).setHours(0, 0, 0, 0), t = new Date(t).setHours(0, 0, 1, 0);
    const i = 60 * (new Date(t).getTimezoneOffset() - new Date(e).getTimezoneOffset()) * 1e3;
    return Math.ceil((t - e - i) / 864e5);
  }
  datesInSameTimeStep(e, t, i) {
    return Math.abs(e.getTime() - t.getTime()) <= 60 * i * 1e3;
  }
  formatDate(e, t = "YYYY-MM-DD", i = null) {
    if (i || (i = this._texts), t || (t = "YYYY-MM-DD"), t === "YYYY-MM-DD")
      return this.formatDateLite(e);
    S = {}, M = {};
    const n = { YYYY: () => this._hydrateDateObject(e, i).YYYY, YY: () => this._hydrateDateObject(e, i).YY(), M: () => this._hydrateDateObject(e, i).M, MM: () => this._hydrateDateObject(e, i).MM(), MMM: () => this._hydrateDateObject(e, i).MMM(), MMMM: () => this._hydrateDateObject(e, i).MMMM(), MMMMG: () => this._hydrateDateObject(e, i).MMMMG(), D: () => this._hydrateDateObject(e, i).D, DD: () => this._hydrateDateObject(e, i).DD(), S: () => this._hydrateDateObject(e, i).S(), d: () => this._hydrateDateObject(e, i).d, dd: () => this._hydrateDateObject(e, i).dd(), ddd: () => this._hydrateDateObject(e, i).ddd(), dddd: () => this._hydrateDateObject(e, i).dddd(), HH: () => this._hydrateTimeObject(e, i).HH, H: () => this._hydrateTimeObject(e, i).H, hh: () => this._hydrateTimeObject(e, i).hh, h: () => this._hydrateTimeObject(e, i).h, am: () => this._hydrateTimeObject(e, i).am, AM: () => this._hydrateTimeObject(e, i).AM, mm: () => this._hydrateTimeObject(e, i).mm, m: () => this._hydrateTimeObject(e, i).m };
    return t.replace(/(\{[a-zA-Z]+\}|[a-zA-Z]+)/g, (s, a) => {
      const r = n[a.replace(/\{|\}/g, "")];
      return r !== void 0 ? r() : a;
    });
  }
  formatDateLite(e) {
    const t = e.getMonth() + 1, i = e.getDate();
    return `${e.getFullYear()}-${t < 10 ? "0" : ""}${t}-${i < 10 ? "0" : ""}${i}`;
  }
  formatTime(e, t = "HH:mm", i = null, n = !1) {
    let s = !1;
    if (n) {
      const [l, o, d] = [e.getHours(), e.getMinutes(), e.getSeconds()];
      l + o + d === 141 && (s = !0);
    }
    if (e instanceof Date && t === "HH:mm")
      return s ? "24:00" : this.formatTimeLite(e);
    M = {}, i || (i = this._texts);
    const a = this._hydrateTimeObject(e, i), r = t.replace(/(\{[a-zA-Z]+\}|[a-zA-Z]+)/g, (l, o) => {
      const d = a[o.replace(/\{|\}/g, "")];
      return d !== void 0 ? d : o;
    });
    return s ? r.replace("23:59", "24:00") : r;
  }
  formatTimeLite(e) {
    const t = e.getHours(), i = e.getMinutes();
    return `${(t < 10 ? "0" : "") + t}:${(i < 10 ? "0" : "") + i}`;
  }
  _nth(e) {
    if (e > 3 && e < 21)
      return "th";
    switch (e % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }
  _hydrateDateObject(e, t) {
    if (S.D)
      return S;
    const i = e.getFullYear(), n = e.getMonth() + 1, s = e.getDate(), a = (e.getDay() - 1 + 7) % 7;
    return S = { YYYY: i, YY: () => i.toString().substring(2), M: n, MM: () => (n < 10 ? "0" : "") + n, MMM: () => t.months[n - 1].substring(0, 3), MMMM: () => t.months[n - 1], MMMMG: () => (t.monthsGenitive || t.months)[n - 1], D: s, DD: () => (s < 10 ? "0" : "") + s, S: () => this._nth(s), d: a + 1, dd: () => t.weekDays[a][0], ddd: () => t.weekDays[a].substr(0, 3), dddd: () => t.weekDays[a] }, S;
  }
  _hydrateTimeObject(e, t) {
    if (M.am)
      return M;
    let i, n;
    e instanceof Date ? (i = e.getHours(), n = e.getMinutes()) : (i = Math.floor(e / 60), n = Math.floor(e % 60));
    const s = i % 12 ? i % 12 : 12, a = (t || { am: "am", pm: "pm" })[i === 24 || i < 12 ? "am" : "pm"];
    return M = { H: i, h: s, HH: (i < 10 ? "0" : "") + i, hh: (s < 10 ? "0" : "") + s, am: a, AM: a.toUpperCase(), m: n, mm: (n < 10 ? "0" : "") + n }, M;
  }
}(x), G = { name: "vue-cal", components: { "vuecal-cell": B, "vuecal-header": U, WeekdaysHeadings: F, AllDayBar: R }, provide() {
  return { vuecal: this, utils: this.utils, modules: this.modules, previous: this.previous, next: this.next, switchView: this.switchView, updateSelectedDate: this.updateSelectedDate, editEvents: this.editEvents, view: this.view, domEvents: this.domEvents };
}, props: { activeView: { type: String, default: "week" }, allDayBarHeight: { type: [String, Number], default: "25px" }, cellClickHold: { type: Boolean, default: !0 }, cellContextmenu: { type: Boolean, default: !1 }, clickToNavigate: { type: Boolean, default: !1 }, dblclickToNavigate: { type: Boolean, default: !0 }, disableDatePrototypes: { type: Boolean, default: !1 }, disableDays: { type: Array, default: () => [] }, disableViews: { type: Array, default: () => [] }, dragToCreateEvent: { type: Boolean, default: !0 }, dragToCreateThreshold: { type: Number, default: 15 }, editableEvents: { type: [Boolean, Object], default: !1 }, events: { type: Array, default: () => [] }, eventsCountOnYearView: { type: Boolean, default: !1 }, eventsOnMonthView: { type: [Boolean, String], default: !1 }, hideBody: { type: Boolean, default: !1 }, hideTitleBar: { type: Boolean, default: !1 }, hideViewSelector: { type: Boolean, default: !1 }, hideWeekdays: { type: Array, default: () => [] }, hideWeekends: { type: Boolean, default: !1 }, locale: { type: [String, Object], default: "en" }, maxDate: { type: [String, Date], default: "" }, minCellWidth: { type: Number, default: 0 }, minDate: { type: [String, Date], default: "" }, minEventWidth: { type: Number, default: 0 }, minSplitWidth: { type: Number, default: 0 }, onEventClick: { type: [Function, null], default: null }, onEventCreate: { type: [Function, null], default: null }, onEventDblclick: { type: [Function, null], default: null }, overlapsPerTimeStep: { type: Boolean, default: !1 }, resizeX: { type: Boolean, default: !1 }, selectedDate: { type: [String, Date], default: "" }, showAllDayEvents: { type: [Boolean, String], default: !1 }, showTimeInCells: { type: Boolean, default: !1 }, showWeekNumbers: { type: [Boolean, String], default: !1 }, snapToTime: { type: Number, default: 0 }, small: { type: Boolean, default: !1 }, specialHours: { type: Object, default: () => ({}) }, splitDays: { type: Array, default: () => [] }, startWeekOnSunday: { type: Boolean, default: !1 }, stickySplitLabels: { type: Boolean, default: !1 }, time: { type: Boolean, default: !0 }, timeCellHeight: { type: Number, default: 40 }, timeFormat: { type: String, default: "" }, timeFrom: { type: Number, default: 0 }, timeStep: { type: Number, default: 60 }, timeTo: { type: Number, default: O }, todayButton: { type: Boolean, default: !1 }, transitions: { type: Boolean, default: !0 }, twelveHour: { type: Boolean, default: !1 }, watchRealTime: { type: Boolean, default: !1 }, xsmall: { type: Boolean, default: !1 } }, data() {
  return { ready: !1, texts: { ...x }, utils: { date: !!this.disableDatePrototypes && L.removePrototypes() || L, cell: null, event: null }, modules: { dnd: null }, view: { id: "", title: "", startDate: null, endDate: null, firstCellDate: null, lastCellDate: null, selectedDate: null, events: [] }, eventIdIncrement: 1, now: new Date(), timeTickerIds: [null, null], domEvents: { resizeAnEvent: { _eid: null, start: null, split: null, segment: null, originalEndTimeMinutes: 0, originalEnd: null, end: null, startCell: null, endCell: null }, dragAnEvent: { _eid: null }, dragCreateAnEvent: { startCursorY: null, start: null, split: null, event: null }, focusAnEvent: { _eid: null, mousedUp: !1 }, clickHoldAnEvent: { _eid: null, timeout: 1200, timeoutId: null }, dblTapACell: { taps: 0, timeout: 500 }, clickHoldACell: { cellId: null, split: null, timeout: 1200, timeoutId: null, eventCreated: !1 }, cancelClickEventCreation: !1 }, mutableEvents: [], transitionDirection: "right" };
}, methods: { async loadLocale(e) {
  if (typeof this.locale == "object")
    return this.texts = Object.assign({}, x, e), void this.utils.date.updateTexts(this.texts);
  if (this.locale === "en") {
    const t = await import("./i18n/en.es.js");
    this.texts = Object.assign({}, x, t);
  } else
    import(`./i18n/${e}.json`).then((t) => {
      this.texts = Object.assign({}, x, t.default), this.utils.date.updateTexts(this.texts);
    });
}, loadDragAndDrop() {
  import("./drag-and-drop.es.js").then((e) => {
    const { DragAndDrop: t } = e;
    this.modules.dnd = new t(this);
  }).catch(() => console.warn("Vue Cal: Missing drag & drop module."));
}, validateView(e) {
  return Y.includes(e) || (console.error(`Vue Cal: invalid active-view parameter provided: "${e}".
A valid view must be one of: ${Y.join(", ")}.`), e = "week"), this.enabledViews.includes(e) || (console.warn(`Vue Cal: the provided active-view "${e}" is disabled. Using the "${this.enabledViews[0]}" view instead.`), e = this.enabledViews[0]), e;
}, switchToNarrowerView(e = null) {
  this.transitionDirection = "right";
  const t = this.enabledViews[this.enabledViews.indexOf(this.view.id) + 1];
  t && this.switchView(t, e);
}, switchView(e, t = null, i = !1) {
  e = this.validateView(e);
  const n = this.utils.date, s = this.view.startDate && this.view.startDate.getTime();
  if (this.transitions && i) {
    if (this.view.id === e)
      return;
    const l = this.enabledViews;
    this.transitionDirection = l.indexOf(this.view.id) > l.indexOf(e) ? "left" : "right";
  }
  const a = this.view.id;
  switch (this.view.events = [], this.view.id = e, this.view.firstCellDate = null, this.view.lastCellDate = null, t || (t = this.view.selectedDate || this.view.startDate), e) {
    case "years":
      this.view.startDate = new Date(25 * Math.floor(t.getFullYear() / 25) || 2e3, 0, 1), this.view.endDate = new Date(this.view.startDate.getFullYear() + 25, 0, 1), this.view.endDate.setSeconds(-1);
      break;
    case "year":
      this.view.startDate = new Date(t.getFullYear(), 0, 1), this.view.endDate = new Date(t.getFullYear() + 1, 0, 1), this.view.endDate.setSeconds(-1);
      break;
    case "month": {
      this.view.startDate = new Date(t.getFullYear(), t.getMonth(), 1), this.view.endDate = new Date(t.getFullYear(), t.getMonth() + 1, 1), this.view.endDate.setSeconds(-1);
      let l = new Date(this.view.startDate);
      if (l.getDay() !== (this.startWeekOnSunday ? 0 : 1) && (l = n.getPreviousFirstDayOfWeek(l, this.startWeekOnSunday)), this.view.firstCellDate = l, this.view.lastCellDate = n.addDays(l, 41), this.view.lastCellDate.setHours(23, 59, 59, 0), this.hideWeekends) {
        if ([0, 6].includes(this.view.firstCellDate.getDay())) {
          const o = this.view.firstCellDate.getDay() !== 6 || this.startWeekOnSunday ? 1 : 2;
          this.view.firstCellDate = n.addDays(this.view.firstCellDate, o);
        }
        if ([0, 6].includes(this.view.startDate.getDay())) {
          const o = this.view.startDate.getDay() === 6 ? 2 : 1;
          this.view.startDate = n.addDays(this.view.startDate, o);
        }
        if ([0, 6].includes(this.view.lastCellDate.getDay())) {
          const o = this.view.lastCellDate.getDay() !== 0 || this.startWeekOnSunday ? 1 : 2;
          this.view.lastCellDate = n.subtractDays(this.view.lastCellDate, o);
        }
        if ([0, 6].includes(this.view.endDate.getDay())) {
          const o = this.view.endDate.getDay() === 0 ? 2 : 1;
          this.view.endDate = n.subtractDays(this.view.endDate, o);
        }
      }
      break;
    }
    case "week": {
      t = n.getPreviousFirstDayOfWeek(t, this.startWeekOnSunday);
      const l = this.hideWeekends ? 5 : 7;
      this.view.startDate = this.hideWeekends && this.startWeekOnSunday ? n.addDays(t, 1) : t, this.view.startDate.setHours(0, 0, 0, 0), this.view.endDate = n.addDays(t, l), this.view.endDate.setSeconds(-1);
      break;
    }
    case "day":
      this.view.startDate = t, this.view.startDate.setHours(0, 0, 0, 0), this.view.endDate = new Date(t), this.view.endDate.setHours(23, 59, 59, 0);
  }
  this.addEventsToView();
  const r = this.view.startDate && this.view.startDate.getTime();
  if ((a !== e || r !== s) && (this.$emit("update:activeView", e), this.ready)) {
    const l = this.view.startDate, o = { view: e, startDate: l, endDate: this.view.endDate, ...this.isMonthView ? { firstCellDate: this.view.firstCellDate, lastCellDate: this.view.lastCellDate, outOfScopeEvents: this.view.outOfScopeEvents.map(this.cleanupEvent) } : {}, events: this.view.events.map(this.cleanupEvent), ...this.isWeekView ? { week: n.getWeek(this.startWeekOnSunday ? n.addDays(l, 1) : l) } : {} };
    this.$emit("view-change", o);
  }
}, previous() {
  this.previousNext(!1);
}, next() {
  this.previousNext();
}, previousNext(e = !0) {
  const t = this.utils.date;
  this.transitionDirection = e ? "right" : "left";
  const i = e ? 1 : -1;
  let n = null;
  const { startDate: s, id: a } = this.view;
  switch (a) {
    case "years":
      n = new Date(s.getFullYear() + 25 * i, 0, 1);
      break;
    case "year":
      n = new Date(s.getFullYear() + 1 * i, 1, 1);
      break;
    case "month":
      n = new Date(s.getFullYear(), s.getMonth() + 1 * i, 1);
      break;
    case "week":
      n = t[e ? "addDays" : "subtractDays"](t.getPreviousFirstDayOfWeek(s, this.startWeekOnSunday), 7);
      break;
    case "day":
      n = t[e ? "addDays" : "subtractDays"](s, 1);
      const r = n.getDay(), l = this.startWeekOnSunday ? r : (r || 7) - 1;
      if (this.weekDays[l].hide) {
        const o = this.weekDays.map((u, h) => ({ ...u, i: h }));
        let d = 0;
        e ? ([...o.slice(l), ...o].find((u) => (d++, !u.hide)).i, d--) : [...o, ...o.slice(0, l)].reverse().find((u) => (d++, !u.hide)).i, n = t[e ? "addDays" : "subtractDays"](n, d);
      }
  }
  n && this.switchView(a, n);
}, addEventsToView(e = []) {
  const t = this.utils.event, { startDate: i, endDate: n, firstCellDate: s, lastCellDate: a } = this.view;
  if (e.length || (this.view.events = []), !(e = e.length ? e : [...this.mutableEvents]) || this.isYearsOrYearView && !this.eventsCountOnYearView)
    return;
  let r = e.filter((l) => t.eventInRange(l, i, n));
  this.isYearsOrYearView || this.isMonthView && !this.eventsOnMonthView || (r = r.map((l) => l.daysCount > 1 ? t.createEventSegments(l, s || i, a || n) : l)), this.view.events.push(...r), this.isMonthView && (this.view.outOfScopeEvents = [], e.forEach((l) => {
    (t.eventInRange(l, s, i) || t.eventInRange(l, n, a)) && (this.view.events.some((o) => o._eid === l._eid) || this.view.outOfScopeEvents.push(l));
  }));
}, findAncestor(e, t) {
  for (; (e = e.parentElement) && !e.classList.contains(t); )
    ;
  return e;
}, isDOMElementAnEvent(e) {
  return e.classList.contains("vuecal__event") || this.findAncestor(e, "vuecal__event");
}, onMouseMove(e) {
  const { resizeAnEvent: t, dragAnEvent: i, dragCreateAnEvent: n } = this.domEvents;
  (t._eid !== null || i._eid !== null || n.start) && (e.preventDefault(), t._eid ? this.eventResizing(e) : this.dragToCreateEvent && n.start && this.eventDragCreation(e));
}, onMouseUp(e) {
  const { focusAnEvent: t, resizeAnEvent: i, clickHoldAnEvent: n, clickHoldACell: s, dragCreateAnEvent: a } = this.domEvents, { _eid: r } = n, { _eid: l } = i;
  let o = !1;
  const { event: d, start: u } = a, h = this.isDOMElementAnEvent(e.target), m = t.mousedUp;
  if (t.mousedUp = !1, h && (this.domEvents.cancelClickEventCreation = !0), s.eventCreated)
    return;
  if (l) {
    const { originalEnd: p, originalEndTimeMinutes: g, endTimeMinutes: _ } = i, w = this.view.events.find((k) => k._eid === i._eid);
    if (o = _ && _ !== g, w && w.end.getTime() !== p.getTime()) {
      const k = this.mutableEvents.find((j) => j._eid === i._eid);
      k.endTimeMinutes = w.endTimeMinutes, k.end = w.end;
      const C = this.cleanupEvent(w), A = { ...this.cleanupEvent(w), end: p, endTimeMinutes: w.originalEndTimeMinutes };
      this.$emit("event-duration-change", { event: C, oldDate: i.originalEnd, originalEvent: A }), this.$emit("event-change", { event: C, originalEvent: A });
    }
    w && (w.resizing = !1), i._eid = null, i.start = null, i.split = null, i.segment = null, i.originalEndTimeMinutes = null, i.originalEnd = null, i.endTimeMinutes = null, i.startCell = null, i.endCell = null;
  } else
    u && (d && (this.emitWithEvent("event-drag-create", d), a.event.resizing = !1), a.start = null, a.split = null, a.event = null);
  h || l || this.unfocusEvent(), n.timeoutId && !r && (clearTimeout(n.timeoutId), n.timeoutId = null), s.timeoutId && (clearTimeout(s.timeoutId), s.timeoutId = null);
  const D = typeof this.onEventClick == "function";
  if (m && !o && !r && !d && D) {
    let p = this.view.events.find((g) => g._eid === t._eid);
    return !p && this.isMonthView && (p = this.view.outOfScopeEvents.find((g) => g._eid === t._eid)), p && this.onEventClick(p, e);
  }
}, onKeyUp(e) {
  e.keyCode === 27 && this.cancelDelete();
}, eventResizing(e) {
  const { resizeAnEvent: t } = this.domEvents, i = this.view.events.find((d) => d._eid === t._eid) || { segments: {} }, { minutes: n, cursorCoords: s } = this.minutesAtCursor(e), a = i.segments && i.segments[t.segment], { date: r, event: l } = this.utils, o = Math.max(n, this.timeFrom + 1, (a || i).startTimeMinutes + 1);
  if (i.endTimeMinutes = t.endTimeMinutes = o, this.snapToTime) {
    const d = i.endTimeMinutes + this.snapToTime / 2;
    i.endTimeMinutes = d - d % this.snapToTime;
  }
  if (a && (a.endTimeMinutes = i.endTimeMinutes), i.end.setHours(0, i.endTimeMinutes, i.endTimeMinutes === O ? -1 : 0, 0), this.resizeX && this.isWeekView) {
    i.daysCount = r.countDays(i.start, i.end);
    const d = this.$refs.cells, u = d.offsetWidth / d.childElementCount, h = Math.floor(s.x / u);
    if (t.startCell === null && (t.startCell = h - (i.daysCount - 1)), t.endCell !== h) {
      t.endCell = h;
      const m = r.addDays(i.start, h - t.startCell), D = Math.max(r.countDays(i.start, m), 1);
      if (D !== i.daysCount) {
        let p = null;
        p = D > i.daysCount ? l.addEventSegment(i) : l.removeEventSegment(i), t.segment = p, i.endTimeMinutes += 1e-3;
      }
    }
  }
  this.$emit("event-resizing", { _eid: i._eid, end: i.end, endTimeMinutes: i.endTimeMinutes });
}, eventDragCreation(e) {
  const { dragCreateAnEvent: t } = this.domEvents, { start: i, startCursorY: n, split: s } = t, a = new Date(i), { minutes: r, cursorCoords: { y: l } } = this.minutesAtCursor(e);
  if (t.event || !(Math.abs(n - l) < this.dragToCreateThreshold))
    if (t.event) {
      if (a.setHours(0, r, r === O ? -1 : 0, 0), this.snapToTime) {
        let u = 60 * a.getHours() + a.getMinutes();
        const h = u + this.snapToTime / 2;
        u = h - h % this.snapToTime, a.setHours(0, u, 0, 0);
      }
      const o = i < a, { event: d } = t;
      d.start = o ? i : a, d.end = o ? a : i, d.startTimeMinutes = 60 * d.start.getHours() + d.start.getMinutes(), d.endTimeMinutes = 60 * d.end.getHours() + d.end.getMinutes();
    } else {
      if (t.event = this.utils.event.createAnEvent(i, 1, { split: s }), !t.event)
        return t.start = null, t.split = null, void (t.event = null);
      t.event.resizing = !0;
    }
}, unfocusEvent() {
  const { focusAnEvent: e, clickHoldAnEvent: t } = this.domEvents, i = this.view.events.find((n) => n._eid === (e._eid || t._eid));
  e._eid = null, t._eid = null, i && (i.focused = !1, i.deleting = !1);
}, cancelDelete() {
  const { clickHoldAnEvent: e } = this.domEvents;
  if (e._eid) {
    const t = this.view.events.find((i) => i._eid === e._eid);
    t && (t.deleting = !1), e._eid = null, e.timeoutId = null;
  }
}, onEventTitleBlur(e, t) {
  if (t.title === e.target.innerHTML)
    return;
  const i = t.title;
  t.title = e.target.innerHTML;
  const n = this.cleanupEvent(t);
  this.$emit("event-title-change", { event: n, oldTitle: i }), this.$emit("event-change", { event: n, originalEvent: { ...n, title: i } });
}, updateMutableEvents() {
  const e = this.utils.date;
  this.mutableEvents = [], this.events.forEach((t) => {
    const i = typeof t.start == "string" ? e.stringToDate(t.start) : t.start, n = e.formatDateLite(i), s = e.dateToMinutes(i);
    let a = null;
    typeof t.end == "string" && t.end.includes("24:00") ? (a = new Date(t.end.replace(" 24:00", "")), a.setHours(23, 59, 59, 0)) : a = typeof t.end == "string" ? e.stringToDate(t.end) : t.end;
    let r = e.formatDateLite(a), l = e.dateToMinutes(a);
    l && l !== O || (!this.time || typeof t.end == "string" && t.end.length === 10 ? a.setHours(23, 59, 59, 0) : a.setSeconds(a.getSeconds() - 1), r = e.formatDateLite(a), l = O);
    const o = n !== r;
    t = Object.assign({ ...this.utils.event.eventDefaults }, t, { _eid: `${this.uid}_${this.eventIdIncrement++}`, segments: o ? {} : null, start: i, startTimeMinutes: s, end: a, endTimeMinutes: l, daysCount: o ? e.countDays(i, a) : 1, class: t.class }), this.mutableEvents.push(t);
  });
}, minutesAtCursor(e) {
  return this.utils.cell.minutesAtCursor(e);
}, createEvent(e, t, i = {}) {
  return this.utils.event.createAnEvent(e, t, i);
}, cleanupEvent(e) {
  return e = { ...e }, ["segments", "deletable", "deleting", "titleEditable", "resizable", "resizing", "draggable", "dragging", "draggingStatic", "focused"].forEach((t) => {
    t in e && delete e[t];
  }), e.repeat || delete e.repeat, e;
}, emitWithEvent(e, t) {
  this.$emit(e, this.cleanupEvent(t));
}, updateSelectedDate(e) {
  if ((e = e && typeof e == "string" ? this.utils.date.stringToDate(e) : new Date(e)) && e instanceof Date) {
    const { selectedDate: t } = this.view;
    t && (this.transitionDirection = t.getTime() > e.getTime() ? "left" : "right"), e.setHours(0, 0, 0, 0), t && t.getTime() === e.getTime() || (this.view.selectedDate = e), this.switchView(this.view.id);
  }
  this.$emit("update:selected-date", this.view.selectedDate);
}, getWeekNumber(e) {
  const t = this.utils.date, i = this.firstCellDateWeekNumber + e, n = this.startWeekOnSunday ? 1 : 0;
  return i > 52 ? t.getWeek(t.addDays(this.view.firstCellDate, 7 * e + n)) : i;
}, timeTick() {
  this.now = new Date(), this.timeTickerIds[1] = setTimeout(this.timeTick, 6e4);
}, updateDateTexts() {
  this.utils.date.updateTexts(this.texts);
}, alignWithScrollbar() {
  if (document.getElementById("vuecal-align-with-scrollbar"))
    return;
  const e = this.$refs.vuecal.getElementsByClassName("vuecal__scrollbar-check")[0], t = e.offsetWidth - e.children[0].offsetWidth;
  if (t) {
    const i = document.createElement("style");
    i.id = "vuecal-align-with-scrollbar", i.type = "text/css", i.innerHTML = `.vuecal--view-with-time .vuecal__weekdays-headings,.vuecal--view-with-time .vuecal__all-day {padding-right: ${t}px}`, document.head.appendChild(i);
  }
}, cellOrSplitHasEvents: (e, t = null) => e.length && (!t && e.length || t && e.some((i) => i.split === t.id)) }, created() {
  this.utils.cell = new P(this), this.utils.event = new z(this, this.utils.date), this.loadLocale(this.locale), this.editEvents.drag && this.loadDragAndDrop(), this.updateMutableEvents(this.events), this.view.id = this.currentView, this.selectedDate ? this.updateSelectedDate(this.selectedDate) : (this.view.selectedDate = new Date(), this.switchView(this.currentView)), this.time && this.watchRealTime && (this.timeTickerIds[0] = setTimeout(this.timeTick, 1e3 * (60 - this.now.getSeconds())));
}, mounted() {
  const e = this.utils.date, t = "ontouchstart" in window, { resize: i, drag: n, create: s, delete: a, title: r } = this.editEvents, l = this.onEventClick && typeof this.onEventClick == "function";
  (i || n || s || a || r || l) && window.addEventListener(t ? "touchend" : "mouseup", this.onMouseUp), (i || n || s && this.dragToCreateEvent) && window.addEventListener(t ? "touchmove" : "mousemove", this.onMouseMove, { passive: !1 }), r && window.addEventListener("keyup", this.onKeyUp), t && (this.$refs.vuecal.oncontextmenu = function(u) {
    u.preventDefault(), u.stopPropagation();
  }), this.hideBody || this.alignWithScrollbar();
  const o = this.view.startDate, d = { view: this.view.id, startDate: o, endDate: this.view.endDate, ...this.isMonthView ? { firstCellDate: this.view.firstCellDate, lastCellDate: this.view.lastCellDate } : {}, events: this.view.events.map(this.cleanupEvent), ...this.isWeekView ? { week: e.getWeek(this.startWeekOnSunday ? e.addDays(o, 1) : o) } : {} };
  this.$emit("ready", d), this.ready = !0;
}, beforeDestroy() {
  const e = "ontouchstart" in window;
  window.removeEventListener(e ? "touchmove" : "mousemove", this.onMouseMove, { passive: !1 }), window.removeEventListener(e ? "touchend" : "mouseup", this.onMouseUp), window.removeEventListener("keyup", this.onKeyUp), this.timeTickerIds[0] && clearTimeout(this.timeTickerIds[0]), this.timeTickerIds[1] && clearTimeout(this.timeTickerIds[1]), this.timeTickerIds = [null, null];
}, computed: { editEvents() {
  return this.editableEvents && typeof this.editableEvents == "object" ? { title: !!this.editableEvents.title, drag: !!this.editableEvents.drag, resize: !!this.editableEvents.resize, create: !!this.editableEvents.create, delete: !!this.editableEvents.delete } : { title: !!this.editableEvents, drag: !!this.editableEvents, resize: !!this.editableEvents, create: !!this.editableEvents, delete: !!this.editableEvents };
}, views() {
  return { years: { label: this.texts.years, enabled: !this.disableViews.includes("years") }, year: { label: this.texts.year, enabled: !this.disableViews.includes("year") }, month: { label: this.texts.month, enabled: !this.disableViews.includes("month") }, week: { label: this.texts.week, enabled: !this.disableViews.includes("week") }, day: { label: this.texts.day, enabled: !this.disableViews.includes("day") } };
}, currentView() {
  return this.validateView(this.activeView);
}, enabledViews() {
  return Object.keys(this.views).filter((e) => this.views[e].enabled);
}, hasTimeColumn() {
  return this.time && this.isWeekOrDayView;
}, isShortMonthView() {
  return this.isMonthView && this.eventsOnMonthView === "short";
}, firstCellDateWeekNumber() {
  const e = this.utils.date, t = this.view.firstCellDate;
  return e.getWeek(this.startWeekOnSunday ? e.addDays(t, 1) : t);
}, timeCells() {
  const e = [];
  for (let t = this.timeFrom, i = this.timeTo; t < i; t += this.timeStep)
    e.push({ hours: Math.floor(t / 60), minutes: t % 60, label: this.utils.date.formatTime(t, this.TimeFormat), value: t });
  return e;
}, TimeFormat() {
  return this.timeFormat || (this.twelveHour ? "h:mm{am}" : "HH:mm");
}, daySplits() {
  return (this.splitDays.filter((e) => !e.hide) || []).map((e, t) => ({ ...e, id: e.id || t + 1 }));
}, hasSplits() {
  return this.daySplits.length && this.isWeekOrDayView;
}, hasShortEvents() {
  return this.showAllDayEvents === "short";
}, cellOrSplitMinWidth() {
  let e = null;
  return this.hasSplits && this.minSplitWidth ? e = this.visibleDaysCount * this.minSplitWidth * this.daySplits.length : this.minCellWidth && this.isWeekView && (e = this.visibleDaysCount * this.minCellWidth), e;
}, allDayBar() {
  let e = this.allDayBarHeight || null;
  return e && !isNaN(e) && (e += "px"), { cells: this.viewCells, options: this.$props, label: this.texts.allDay, shortEvents: this.hasShortEvents, daySplits: this.hasSplits && this.daySplits || [], cellOrSplitMinWidth: this.cellOrSplitMinWidth, height: e };
}, minTimestamp() {
  let e = null;
  return this.minDate && typeof this.minDate == "string" ? e = this.utils.date.stringToDate(this.minDate) : this.minDate && this.minDate instanceof Date && (e = this.minDate), e ? e.getTime() : null;
}, maxTimestamp() {
  let e = null;
  return this.maxDate && typeof this.maxDate == "string" ? e = this.utils.date.stringToDate(this.maxDate) : this.maxDate && this.minDate instanceof Date && (e = this.maxDate), e ? e.getTime() : null;
}, weekDays() {
  let { weekDays: e, weekDaysShort: t = [] } = this.texts;
  return e = e.slice(0).map((i, n) => ({ label: i, ...t.length ? { short: t[n] } : {}, hide: this.hideWeekends && n >= 5 || this.hideWeekdays.length && this.hideWeekdays.includes(n + 1) })), this.startWeekOnSunday && e.unshift(e.pop()), e;
}, weekDaysInHeader() {
  return this.isMonthView || this.isWeekView && !this.minCellWidth && !(this.hasSplits && this.minSplitWidth);
}, months() {
  return this.texts.months.map((e) => ({ label: e }));
}, specialDayHours() {
  return this.specialHours && Object.keys(this.specialHours).length ? Array(7).fill("").map((e, t) => {
    let i = this.specialHours[t + 1] || [];
    return Array.isArray(i) || (i = [i]), e = [], i.forEach(({ from: n, to: s, class: a, label: r }, l) => {
      e[l] = { day: t + 1, from: [null, void 0].includes(n) ? null : 1 * n, to: [null, void 0].includes(s) ? null : 1 * s, class: a || "", label: r || "" };
    }), e;
  }) : {};
}, viewTitle() {
  const e = this.utils.date;
  let t = "";
  const i = this.view.startDate, n = i.getFullYear(), s = i.getMonth();
  switch (this.view.id) {
    case "years":
      t = this.texts.years;
      break;
    case "year":
      t = n;
      break;
    case "month":
      t = `${this.months[s].label} ${n}`;
      break;
    case "week": {
      const a = this.view.endDate, r = i.getFullYear();
      let l = this.texts.months[i.getMonth()];
      this.xsmall && (l = l.substring(0, 3));
      let o = `${l} ${r}`;
      if (a.getMonth() !== i.getMonth()) {
        const d = a.getFullYear();
        let u = this.texts.months[a.getMonth()];
        this.xsmall && (u = u.substring(0, 3)), o = r === d ? `${l} - ${u} ${r}` : this.small ? `${l.substring(0, 3)} ${r} - ${u.substring(0, 3)} ${d}` : `${l} ${r} - ${u} ${d}`;
      }
      t = `${this.texts.week} ${e.getWeek(this.startWeekOnSunday ? e.addDays(i, 1) : i)} (${o})`;
      break;
    }
    case "day":
      t = this.utils.date.formatDate(i, this.texts.dateFormat, this.texts);
  }
  return t;
}, viewCells() {
  const e = this.utils.date;
  let t = [], i = null, n = !1;
  this.watchRealTime || (this.now = new Date());
  const s = this.now;
  switch (this.view.id) {
    case "years":
      i = this.view.startDate.getFullYear(), t = Array.apply(null, Array(25)).map((a, r) => {
        const l = new Date(i + r, 0, 1), o = new Date(i + r + 1, 0, 1);
        return o.setSeconds(-1), { startDate: l, formattedDate: e.formatDateLite(l), endDate: o, content: i + r, current: i + r === s.getFullYear() };
      });
      break;
    case "year":
      i = this.view.startDate.getFullYear(), t = Array.apply(null, Array(12)).map((a, r) => {
        const l = new Date(i, r, 1), o = new Date(i, r + 1, 1);
        return o.setSeconds(-1), { startDate: l, formattedDate: e.formatDateLite(l), endDate: o, content: this.xsmall ? this.months[r].label.substr(0, 3) : this.months[r].label, current: r === s.getMonth() && i === s.getFullYear() };
      });
      break;
    case "month": {
      const a = this.view.startDate.getMonth(), r = new Date(this.view.firstCellDate);
      n = !1, t = Array.apply(null, Array(42)).map((l, o) => {
        const d = e.addDays(r, o), u = new Date(d);
        u.setHours(23, 59, 59, 0);
        const h = !n && e.isToday(d) && !n++;
        return { startDate: d, formattedDate: e.formatDateLite(d), endDate: u, content: d.getDate(), today: h, outOfScope: d.getMonth() !== a, class: `vuecal__cell--day${d.getDay() || 7}` };
      }), (this.hideWeekends || this.hideWeekdays.length) && (t = t.filter((l) => {
        const o = l.startDate.getDay() || 7;
        return !(this.hideWeekends && o >= 6 || this.hideWeekdays.length && this.hideWeekdays.includes(o));
      }));
      break;
    }
    case "week": {
      n = !1;
      const a = this.view.startDate, r = this.weekDays;
      t = r.map((l, o) => {
        const d = e.addDays(a, o), u = new Date(d);
        u.setHours(23, 59, 59, 0);
        const h = (d.getDay() || 7) - 1;
        return { startDate: d, formattedDate: e.formatDateLite(d), endDate: u, today: !n && e.isToday(d) && !n++, specialHours: this.specialDayHours[h] || [] };
      }).filter((l, o) => !r[o].hide);
      break;
    }
    case "day": {
      const a = this.view.startDate, r = new Date(this.view.startDate);
      r.setHours(23, 59, 59, 0);
      const l = (a.getDay() || 7) - 1;
      t = [{ startDate: a, formattedDate: e.formatDateLite(a), endDate: r, today: e.isToday(a), specialHours: this.specialDayHours[l] || [] }];
      break;
    }
  }
  return t;
}, visibleDaysCount() {
  return this.isDayView ? 1 : 7 - this.weekDays.reduce((e, t) => e + t.hide, 0);
}, cellWidth() {
  return 100 / this.visibleDaysCount;
}, cssClasses() {
  const { resizeAnEvent: e, dragAnEvent: t, dragCreateAnEvent: i } = this.domEvents;
  return { [`vuecal--${this.view.id}-view`]: !0, [`vuecal--${this.locale}`]: this.locale, "vuecal--no-time": !this.time, "vuecal--view-with-time": this.hasTimeColumn, "vuecal--week-numbers": this.showWeekNumbers && this.isMonthView, "vuecal--twelve-hour": this.twelveHour, "vuecal--click-to-navigate": this.clickToNavigate, "vuecal--hide-weekends": this.hideWeekends, "vuecal--split-days": this.hasSplits, "vuecal--sticky-split-labels": this.hasSplits && this.stickySplitLabels, "vuecal--overflow-x": this.minCellWidth && this.isWeekView || this.hasSplits && this.minSplitWidth, "vuecal--small": this.small, "vuecal--xsmall": this.xsmall, "vuecal--resizing-event": e._eid, "vuecal--drag-creating-event": i.event, "vuecal--dragging-event": t._eid, "vuecal--events-on-month-view": this.eventsOnMonthView, "vuecal--short-events": this.isMonthView && this.eventsOnMonthView === "short", "vuecal--has-touch": typeof window < "u" && "ontouchstart" in window };
}, isYearsOrYearView() {
  return ["years", "year"].includes(this.view.id);
}, isYearsView() {
  return this.view.id === "years";
}, isYearView() {
  return this.view.id === "year";
}, isMonthView() {
  return this.view.id === "month";
}, isWeekOrDayView() {
  return ["week", "day"].includes(this.view.id);
}, isWeekView() {
  return this.view.id === "week";
}, isDayView() {
  return this.view.id === "day";
} }, watch: { events: { handler(e, t) {
  this.updateMutableEvents(e), this.addEventsToView();
}, deep: !0 }, locale(e) {
  this.loadLocale(e);
}, selectedDate(e) {
  this.updateSelectedDate(e);
}, activeView(e) {
  this.switchView(e);
} } }, J = E(G, X, q, !1, null, null, null, null).exports;
export {
  J as default
};
