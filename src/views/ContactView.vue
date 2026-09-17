<script setup lang="ts">
import { ref } from 'vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { useToastStore } from '@/stores/toast'
import { validate, RULES } from '@/composables/useValidation'

const toasts = useToastStore()

const form = ref({ name: '', email: '', topic: 'Order support', message: '' })
const errors = ref<Record<string, string>>({})
const modalOpen = ref(false)

const topics = [
  { label: 'Order support', value: 'Order support' },
  { label: 'Returns & exchanges', value: 'Returns & exchanges' },
  { label: 'Product & sizing', value: 'Product & sizing' },
  { label: 'Shipping', value: 'Shipping' },
  { label: 'Something else', value: 'Something else' },
]

const contactChannels = [
  { icon: 'map-pin', title: 'Address', body: 'Phnom Penh, Cambodia' },
  { icon: 'phone', title: 'Phone', body: '+855 23 456 789' },
  { icon: 'mail', title: 'Email', body: 'care@veste.com' },
  { icon: 'clock', title: 'Opening Hours', body: 'Mon–Fri: 9am–8pm, Sat: 10am–6pm, Sun: Closed' },
]

function submit() {
  const result = validate(
    { name: form.value.name, email: form.value.email, message: form.value.message },
    {
      name: [RULES.required('Your name is required.')],
      email: [RULES.required('Email is required.'), RULES.email()],
      message: [RULES.required('Please tell us how we can help.')],
    },
  )
  errors.value = result.errors
  if (!result.valid) return
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  form.value = { name: '', email: '', topic: 'Order support', message: '' }
  errors.value = {}
  toasts.success('Message sent', 'Our team will get back to you soon.')
}
</script>

<template>
  <div>
    <section class="bg-charcoal px-4 py-20 text-center text-bone">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Contact</p>
      <h1 class="mx-auto mt-4 font-display text-4xl">We'd love to hear from you</h1>
      <p class="mx-auto mt-3 max-w-md text-bone/70">
        Questions, compliments, sizing SOS — our team replies fast, in plain English.
      </p>
    </section>

    <section class="px-4 py-16">
      <div class="wrap grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div class="space-y-6">
          <div class="grid gap-4 sm:grid-cols-2">
            <a
              v-for="c in contactChannels"
              :key="c.icon"
              :href="c.icon === 'map-pin' ? 'https://maps.app.goo.gl/7XKZzQJvQ7Q2JQzW7' : 'mailto:care@veste.com'"
              :target="c.icon === 'map-pin' ? '_blank' : undefined"
              :rel="c.icon === 'map-pin' ? 'noopener noreferrer' : undefined"
              class="flex items-start gap-4 rounded-3xl border border-charcoal/8 bg-white p-5 transition hover:shadow-lg hover:shadow-charcoal/5"
          
            >
              <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-beige/60 text-gold">
                <AppIcon :name="c.icon" :size="19" />
              </span>
              <div>
                <h3 class="font-semibold text-charcoal">{{ c.title }}</h3>
                <p class="mt-0.5 text-sm font-medium text-gold">{{ c.body }}</p>
              </div>

            </a>
          </div>

          <div class="rounded-3xl bg-bone/50 p-6">
            <h3 class="flex items-center gap-2 font-display text-lg text-charcoal">
              <AppIcon name="calendar" :size="18" class="text-gold" />
              Business Hours
            </h3>
            <div class="mt-4 space-y-3">
              <div v-for="h in [
                { day: 'Monday – Friday', hours: '9:00 AM – 8:00 PM' },
                { day: 'Saturday', hours: '10:00 AM – 6:00 PM' },
                { day: 'Sunday', hours: 'Closed' },
              ]" :key="h.day"
                class="flex items-center justify-between py-2 border-b border-charcoal/8 last:border-0 last:pb-0"
              >
                <span class="text-sm text-charcoal/70">{{ h.day }}</span>
                <span class="text-sm font-medium text-charcoal" :class="h.hours === 'Closed' ? 'text-clay' : ''">{{ h.hours }}</span>
              </div>
            </div>
          </div>

          <div class="rounded-3xl border border-charcoal/8 bg-white p-6">
            <h3 class="flex items-center gap-2 font-display text-lg text-charcoal">
              <AppIcon name="map-pin" :size="18" class="text-gold" />
              Our Store
            </h3>
            <address class="mt-3 text-sm not-italic leading-relaxed text-charcoal/65">
              Phnom Penh<br />
              Cambodia
            </address>
            <a
              href="https://maps.app.goo.gl/7XKZzQJvQ7Q2JQzW7"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gold-dark"
            >
              <AppIcon name="map-pin" :size="16" class="mr-1.5" />
              Get Directions
            </a>
          </div>
        </div>

        <div class="space-y-6">
          <div class="contact-map-container rounded-3xl overflow-hidden border border-charcoal/8 bg-white">
            <div class="aspect-video relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.173!2d104.916!3d11.567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109517a4d8f5e01%3A0x4d8f5e01!2sPhnom+Penh%2C+Cambodia!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style="border:0;"
                allowfullscreen
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                aria-label="Store location on Google Maps"
                class="absolute inset-0 h-full w-full"
              ></iframe>
            </div>
          </div>

          <form class="rounded-3xl border border-charcoal/8 bg-white p-7" @submit.prevent="submit">
            <h2 class="font-display text-xl text-charcoal">Send a message</h2>
            <div class="mt-5 space-y-4">
              <div class="grid gap-4 sm:grid-cols-2">
                <BaseInput v-model="form.name" label="Your name" :error="errors.name" :required="true" />
                <BaseInput v-model="form.email" label="Email address" type="email" icon="mail" :error="errors.email" :required="true" />
              </div>
              <BaseSelect v-model="form.topic" label="Topic" :options="topics" />
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal">
                  Message<span class="text-clay"> *</span>
                </label>
                <textarea
                  v-model="form.message"
                  rows="5"
                  class="w-full resize-none rounded-xl border px-4 py-3 text-sm text-charcoal transition-all duration-200 focus:outline-none"
                  :class="errors.message
                    ? 'border-clay focus:border-clay focus:ring-2 focus:ring-clay/20'
                    : 'border-charcoal/15 hover:border-charcoal/30 focus:border-charcoal focus:ring-2 focus:ring-charcoal/10'"
                  :aria-invalid="Boolean(errors.message)"
                  placeholder="How can we help?"
                />
                <p v-if="errors.message" class="text-xs font-medium text-clay">{{ errors.message }}</p>
              </div>
              <BaseButton type="submit" size="lg" block>
                <AppIcon name="send" :size="16" />
                Send message
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </section>

    <BaseModal :open="modalOpen" title="Message sent" subtitle="Thanks for reaching out." size="sm" @close="closeModal">
      <p class="text-sm leading-relaxed text-charcoal/65">
        We've received your message about <span class="font-semibold text-charcoal">{{ form.topic }}</span>.
        A member of our team will reply to <span class="font-semibold text-charcoal">{{ form.email }}</span> within 24 hours.
      </p>
      <BaseButton class="mt-6 w-full" @click="closeModal">Done</BaseButton>
    </BaseModal>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  .contact-map-container {
    min-height: 240px;
  }
}
</style>
