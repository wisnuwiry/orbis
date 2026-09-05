import { useEffect, useState } from 'react'
import { PaduIcon, type PaduIconName } from '@/components/padu-icon'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export const TOTAL_ONBOARDING_STEPS = 3

interface OnboardingSlideItem {
  icon: PaduIconName
  titleKey: string
  descKey: string
}

interface OnboardingSlide {
  badgeKey: string
  titleKey: string
  descKey: string
  items: OnboardingSlideItem[]
}

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    badgeKey: 'onboarding.slide1_badge',
    titleKey: 'onboarding.slide1_title',
    descKey: 'onboarding.slide1_desc',
    items: [
      {
        icon: 'bot',
        titleKey: 'onboarding.slide1_item1_title',
        descKey: 'onboarding.slide1_item1_desc',
      },
      {
        icon: 'zap',
        titleKey: 'onboarding.slide1_item2_title',
        descKey: 'onboarding.slide1_item2_desc',
      },
      {
        icon: 'lock',
        titleKey: 'onboarding.slide1_item3_title',
        descKey: 'onboarding.slide1_item3_desc',
      },
    ],
  },
  {
    badgeKey: 'onboarding.slide2_badge',
    titleKey: 'onboarding.slide2_title',
    descKey: 'onboarding.slide2_desc',
    items: [
      {
        icon: 'folder',
        titleKey: 'onboarding.slide2_item1_title',
        descKey: 'onboarding.slide2_item1_desc',
      },
      {
        icon: 'fileDiff',
        titleKey: 'onboarding.slide2_item2_title',
        descKey: 'onboarding.slide2_item2_desc',
      },
      {
        icon: 'rewind',
        titleKey: 'onboarding.slide2_item3_title',
        descKey: 'onboarding.slide2_item3_desc',
      },
    ],
  },
  {
    badgeKey: 'onboarding.slide3_badge',
    titleKey: 'onboarding.slide3_title',
    descKey: 'onboarding.slide3_desc',
    items: [
      {
        icon: 'folder',
        titleKey: 'onboarding.slide3_item1_title',
        descKey: 'onboarding.slide3_item1_desc',
      },
      {
        icon: 'sparkle',
        titleKey: 'onboarding.slide3_item2_title',
        descKey: 'onboarding.slide3_item2_desc',
      },
      {
        icon: 'target',
        titleKey: 'onboarding.slide3_item3_title',
        descKey: 'onboarding.slide3_item3_desc',
      },
    ],
  },
]

export function OnboardingModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useI18n()
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (open) {
      setStep(0)
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onOpenChange(false)
      } else if (event.key === 'ArrowRight' || event.key === 'Enter') {
        event.preventDefault()
        if (step + 1 >= TOTAL_ONBOARDING_STEPS) {
          onOpenChange(false)
        } else {
          setStep((current) => current + 1)
        }
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        if (step > 0) {
          setStep((current) => current - 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, step, onOpenChange])

  if (!open) return null

  const currentSlide = ONBOARDING_SLIDES[step] ?? ONBOARDING_SLIDES[0]!
  const isFirst = step === 0
  const isLast = step + 1 === TOTAL_ONBOARDING_STEPS


  const handleNext = () => {
    if (isLast) {
      onOpenChange(false)
    } else {
      setStep((current) => current + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep((current) => current - 1)
    }
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-6 backdrop-blur-[2px] motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-150"
      role="dialog"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="relative flex w-[540px] max-w-[calc(100vw-32px)] flex-col rounded-[16px] bg-background p-7 text-foreground shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar: Step indicators & close button */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-[5px]">
            {Array.from({ length: TOTAL_ONBOARDING_STEPS }).map((_, index) => {
              const active = index === step
              return (
                <button
                  aria-label={`Step ${index + 1} of ${TOTAL_ONBOARDING_STEPS}`}
                  className={cn(
                    'h-1 rounded-full transition-all duration-200 outline-none hover:opacity-80 focus-visible:ring-1 focus-visible:ring-ring',
                    active ? 'w-6 bg-ring' : 'w-[7px] bg-[var(--text-ghost)] opacity-30',
                  )}
                  key={index}
                  type="button"
                  onClick={() => setStep(index)}
                />
              )
            })}
          </div>

          <button
            aria-label={t('common.close')}
            className="grid size-6 place-items-center rounded-md text-[var(--text-ghost)] outline-none hover:bg-accent hover:text-foreground active:bg-accent focus-visible:ring-1 focus-visible:ring-ring"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            <PaduIcon className="size-3" name="x" />
          </button>
        </div>

        {/* Center every slide around the Padu brand. */}
        <div
          className="mt-7 mb-7 flex flex-col items-center text-center"
        >
          <PaduIcon className="size-[72px] text-ring" name="logo" />
          <h2 className="mt-2 text-[20px] font-bold tracking-tight text-foreground">
            {t(currentSlide.titleKey)}
          </h2>
          <p
            className="mt-2 max-w-[360px] text-[13px] leading-[19px] text-[var(--text-secondary)]"
          >
            {t(currentSlide.descKey)}
          </p>
        </div>

        {/* Step 2 presents the core project workflow in compact cards. */}
        {step === 1 && (
          <div className="flex w-full flex-col gap-2.5">
            {currentSlide.items.map((item) => (
              <div
                className="flex items-start gap-3 rounded-[10px] bg-[var(--raised)] p-3"
                key={item.titleKey}
              >
                <div className="grid size-7 shrink-0 place-items-center rounded-[7px] border border-[var(--border-strong)] bg-background text-[var(--text-secondary)] shadow-2xs">
                  <PaduIcon className="size-3.5" name={item.icon} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="text-[13px] font-semibold text-foreground">
                    {t(item.titleKey)}
                  </div>
                  <div className="text-[12px] leading-[16.5px] text-[var(--text-secondary)]">
                    {t(item.descKey)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-[26px] flex w-full items-center justify-between">
          <button
            className="cursor-pointer text-[12px] text-[var(--text-ghost)] outline-none hover:text-[var(--text-secondary)] focus-visible:underline"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            {t('onboarding.skip')}
          </button>

          <div className="flex items-center gap-1.5">
            {!isFirst && (
              <button
                className="flex h-8 items-center justify-center rounded-lg px-3 text-[12.5px] text-[var(--text-secondary)] outline-none hover:bg-accent focus-visible:ring-1 focus-visible:ring-ring"
                type="button"
                onClick={handleBack}
              >
                {t('onboarding.back')}
              </button>
            )}

            <button
              className={cn(
                'flex h-8 items-center justify-center rounded-lg px-4 text-[12.5px] font-medium transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ring',
                isLast
                  ? 'bg-foreground text-background hover:opacity-90 active:opacity-80'
                  : 'bg-accent text-foreground hover:bg-accent/80',
              )}
              type="button"
              onClick={handleNext}
            >
              {isLast ? t('onboarding.get_started') : t('onboarding.next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
