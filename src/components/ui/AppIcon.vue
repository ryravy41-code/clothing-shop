<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
    size?: number
    class?: string
  }>(),
  { size: 20 },
)

type IconDef = { inner: string; filled?: boolean }

const ICONS: Record<string, IconDef> = {
  search: { inner: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>' },
  heart: {
    inner:
      '<path d="M19.5 12.6 12 20l-7.5-7.4a5 5 0 1 1 7.5-6.6 5 5 0 1 1 7.5 6.6z"/>',
  },
  'heart-fill': {
    inner:
      '<path d="M19.5 12.6 12 20l-7.5-7.4a5 5 0 1 1 7.5-6.6 5 5 0 1 1 7.5 6.6z"/>',
    filled: true,
  },
  bag: {
    inner: '<path d="M6 7h12l1 13H5L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/>',
  },
  user: {
    inner:
      '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6"/>',
  },
  menu: { inner: '<path d="M4 7h16M4 12h16M4 17h16"/>' },
  close: { inner: '<path d="M6 6l12 12M18 6 6 18"/>' },
  'chev-down': { inner: '<path d="m6 9 6 6 6-6"/>' },
  'chev-right': { inner: '<path d="m9 6 6 6-6 6"/>' },
  'chev-left': { inner: '<path d="m15 6-6 6 6 6"/>' },
  'chev-up': { inner: '<path d="m18 15-6-6-6 6"/>' },
  star: {
    inner:
      '<path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"/>',
    filled: true,
  },
  'star-outline': {
    inner:
      '<path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"/>',
  },
  'arrow-right': { inner: '<path d="M5 12h14M13 6l6 6-6 6"/>' },
  'arrow-left': { inner: '<path d="M19 12H5M11 6l-6 6 6 6"/>' },
  plus: { inner: '<path d="M12 5v14M5 12h14"/>' },
  minus: { inner: '<path d="M5 12h14"/>' },
  trash: {
    inner:
      '<path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-1 12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 7"/>',
  },
  check: { inner: '<path d="M5 12l5 5 9-10"/>' },
  truck: {
    inner:
      '<path d="M2 6h12v9H2zM14 9h4l3 3v3h-7z"/><circle cx="6.5" cy="18" r="1.8"/><circle cx="17.5" cy="18" r="1.8"/>',
  },
  shield: {
    inner:
      '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="m9 12 2 2 4-4"/>',
  },
  lock: {
    inner:
      '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  },
  mail: {
    inner:
      '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  },
  phone: {
    inner:
      '<path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  },
  'map-pin': {
    inner:
      '<path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  },
  'credit-card': {
    inner:
      '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/>',
  },
  wallet: {
    inner:
      '<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>',
  },
  'package': {
    inner:
      '<path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    filled: true,
  },
  filter: { inner: '<path d="M4 6h16M7 12h10M10 18h4"/>' },
  grid: {
    inner:
      '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
  },
  list: {
    inner:
      '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  },
  eye: {
    inner:
      '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.7"/>',
  },
  'zoom-in': {
    inner:
      '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3M11 8v6M8 11h6"/>',
  },
  instagram: {
    inner:
      '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="0.4" fill="currentColor"/>',
  },
  facebook: {
    inner:
      '<path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.4V11H8.8v3h2.2v7z"/>',
    filled: true,
  },
  twitter: {
    inner:
      '<path d="M4 4l7.5 9.6L4.4 20h2.2l5.6-5 4.2 5H20l-7.8-10L19 4h-2.2l-5.1 4.5L8 4z"/>',
    filled: true,
  },
  refresh: {
    inner:
      '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
  },
  alert: {
    inner:
      '<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>',
  },
  info: {
    inner:
      '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  },
  'check-circle': {
    inner:
      '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  },
  'x-circle': {
    inner:
      '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
  },
  clock: {
    inner:
      '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
  },
  calendar: {
    inner:
      '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
  },
  tag: {
    inner:
      '<path d="M20.6 13.4 13 21l-9-3-1-9 7.6-7.6a2 2 0 0 1 2.8 0z"/><circle cx="8.5" cy="8.5" r="1.2"/>',
  },
  gift: {
    inner:
      '<rect x="4" y="9" width="16" height="12" rx="1.5"/><path d="M12 9v12"/><path d="M4 13h16"/><path d="M12 9C9 9 7 7.5 7 5.5S9 3 11 4.5 12 9 12 9z"/><path d="M12 9c3 0 5-1.5 5-3.5S15 3 13 4.5 12 9 12 9z"/>',
  },
  sparkles: {
    inner:
      '<path d="M12 3l1.9 5 5 1.9-5 1.9-1.9 5-1.9-5-5-1.9 5-1.9z"/><path d="M19 15l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9z"/><path d="M5 16l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
  },
  logout: {
    inner:
      '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>',
  },
  home: {
    inner:
      '<path d="m3 11 9-7 9 7"/><path d="M5 10v10h14V10"/>',
  },
  help: {
    inner:
      '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.8 2.8 0 1 1 4.4 2.3c-1 .7-1.9 1.2-1.9 2.4v.3"/><path d="M12 17h.01"/>',
  },
  play: { inner: '<path d="M8 5v14l11-7z"/>', filled: true },
  shirt: {
    inner:
      '<path d="M20 8l-3-4h-2l-1 2a3 3 0 0 1-6 0L7 4H5l-3 4 3 2v10h14V10z"/>',
  },
  send: {
    inner:
      '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  },
  undo: {
    inner:
      '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>',
  },
  bell: {
    inner:
      '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  },
  globe: {
    inner:
      '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 4 5.6 4 9s-1.5 6.4-4 9c-2.5-2.6-4-5.6-4-9s1.5-6.4 4-9z"/>',
  },
  percent: {
    inner:
      '<path d="M19 5 5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>',
  },
  quote: {
    inner:
      '<path d="M10 11H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2zM9 20v-4c0-2 1-4 4-5M10 9h0"/>',
  },
  'bag-plus': {
    inner:
      '<path d="M6 7h12l1 13H5L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/><path d="M12 11v5M9.5 13.5h5"/>',
  },
  min: { inner: '<path d="M4 20 20 4"/>' },
}

const active = computed<IconDef | null>(() => ICONS[props.name] ?? null)
</script>

<template>
  <svg
    :viewBox="'0 0 24 24'"
    :width="size"
    :height="size"
    :class="props.class"
    :fill="active?.filled ? 'currentColor' : 'none'"
    :stroke="active?.filled ? 'none' : 'currentColor'"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    role="presentation"
    v-html="active?.inner ?? ''"
  />
</template>