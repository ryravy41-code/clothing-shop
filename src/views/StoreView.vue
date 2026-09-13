<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const hours = [
  { day: 'Monday – Friday', time: '10am – 7pm' },
  { day: 'Saturday', time: '10am – 8pm' },
  { day: 'Sunday', time: '11am – 6pm' },
]
</script>

<template>
  <div>
    <section class="bg-charcoal px-4 py-20 text-center text-bone">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Visit us</p>
      <h1 class="mx-auto mt-4 font-display text-4xl">Our flagship store</h1>
      <p class="mx-auto mt-3 max-w-md text-bone/70">
        Stop by our San Francisco studio to try pieces on and meet the team.
      </p>
    </section>

    <section class="px-4 py-16">
      <div class="wrap grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div class="space-y-6">
          <div class="overflow-hidden rounded-3xl">
            <iframe
              src="https://www.google.com/maps?q=128+Laurel+Avenue+San+Francisco+CA+94105&output=embed"
              width="100%"
              height="420"
              style="border:0"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="VESTE store location"
              class="aspect-[4/3] w-full rounded-3xl"
            />
          </div>

          <div class="rounded-3xl border border-charcoal/8 bg-white p-6">
            <h3 class="flex items-center gap-2 font-display text-lg text-charcoal">
              <AppIcon name="map-pin" :size="18" class="text-gold" />
              Studio &amp; flagship
            </h3>
            <address class="mt-3 not-italic text-sm leading-relaxed text-charcoal/65">
              128 Laurel Avenue<br />
              San Francisco, CA 94105<br />
              United States
            </address>
          </div>
        </div>

        <div class="space-y-6">
          <div class="rounded-3xl border border-charcoal/8 bg-white p-6">
            <h3 class="flex items-center gap-2 font-display text-lg text-charcoal">
              <AppIcon name="clock" :size="18" class="text-gold" />
              Opening hours
            </h3>
            <dl class="mt-4 space-y-3">
              <div v-for="h in hours" :key="h.day" class="flex justify-between">
                <dt class="text-sm text-charcoal/65">{{ h.day }}</dt>
                <dd class="font-medium text-charcoal">{{ h.time }}</dd>
              </div>
            </dl>
          </div>

          <div class="rounded-3xl border border-charcoal/8 bg-white p-6">
            <h3 class="flex items-center gap-2 font-display text-lg text-charcoal">
              <AppIcon name="phone" :size="18" class="text-gold" />
              Contact
            </h3>
            <ul class="mt-4 space-y-3 text-sm text-charcoal/65">
              <li class="flex items-center gap-2">
                <AppIcon name="mail" :size="16" class="text-gold shrink-0" />
                care@veste.com
              </li>
              <li class="flex items-center gap-2">
                <AppIcon name="phone" :size="16" class="text-gold shrink-0" />
                +1 (555) 010-5000
              </li>
              <li class="flex items-center gap-2">
                <AppIcon name="calendar" :size="16" class="text-gold shrink-0" />
                Mon–Sat, 8am–8pm PT
              </li>
            </ul>
          </div>

          <BaseButton as="a" href="https://www.google.com/maps?q=128+Laurel+Avenue+San+Francisco+CA+94105" target="_blank" rel="noopener" size="lg" block>
            <AppIcon name="direction" :size="17" />
            Open in Google Maps
          </BaseButton>
        </div>
      </div>
    </section>
  </div>
</template>
