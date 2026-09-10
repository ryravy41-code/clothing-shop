export type ButtonVariant =
  | 'primary'
  | 'dark'
  | 'gold'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'white'

export type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-charcoal text-bone hover:bg-black active:bg-ink shadow-sm',
  dark: 'bg-ink text-bone hover:bg-charcoal active:bg-black',
  gold: 'bg-gold text-white hover:bg-gold-dark active:bg-gold shadow-sm',
  outline:
    'border border-charcoal/25 text-charcoal hover:border-charcoal hover:bg-charcoal/[0.03]',
  ghost: 'text-charcoal hover:bg-charcoal/5',
  danger: 'bg-clay text-white hover:bg-clay/90 shadow-sm',
  white: 'bg-white text-charcoal border border-charcoal/15 hover:bg-bone shadow-sm',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-6 text-sm gap-2',
  lg: 'h-13 px-8 text-base gap-2.5',
}

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  extra = '',
): string {
  return [
    'inline-flex items-center justify-center rounded-full font-medium tracking-wide transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-50',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    extra,
  ].join(' ')
}