import { computed, onScopeDispose, ref } from 'vue'

export interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function useCountdown(target: () => Date) {
  const now = ref(Date.now())
  let timer: number | undefined

  function tick() {
    now.value = Date.now()
    timer = window.setTimeout(tick, 1000)
  }

  tick()

  onScopeDispose(() => {
    if (timer) window.clearTimeout(timer)
  })

  const diff = computed(() => Math.max(0, target().getTime() - now.value))

  const countdown = computed<Countdown>(() => {
    const total = Math.floor(diff.value / 1000)
    return {
      days: Math.floor(total / 86400),
      hours: Math.floor((total % 86400) / 3600),
      minutes: Math.floor((total % 3600) / 60),
      seconds: total % 60,
    }
  })

  const parts = computed(() => [
    { label: 'Days', value: countdown.value.days },
    { label: 'Hours', value: countdown.value.hours },
    { label: 'Min', value: countdown.value.minutes },
    { label: 'Sec', value: countdown.value.seconds },
  ])

  const isFinished = computed(() => diff.value <= 0)

  return { countdown, parts, isFinished }
}

export function endOfNext(arg: 'week' | 'month' | 'day'): Date {
  const end = new Date()
  if (arg === 'week') {
    end.setDate(end.getDate() + ((7 - end.getDay() + 1) % 7))
    end.setHours(23, 59, 59, 999)
  } else if (arg === 'month') {
    end.setMonth(end.getMonth() + 1, 1)
    end.setHours(0, 0, 0, 0)
  } else {
    end.setHours(23, 59, 59, 999)
  }
  return end
}