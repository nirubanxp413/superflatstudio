import { Text } from '@/components/ui'
import { SiteContainer } from './SiteContainer'
import type { AppsStepItem } from './types'

type StepsProps = {
  title: string
  steps: AppsStepItem[]
  containerClassName?: string
  className?: string
}

export function Steps({
  title,
  steps,
  containerClassName = '',
  className = '',
}: StepsProps) {
  return (
    <section className={['mb-8', className].filter(Boolean).join(' ')}>
      <SiteContainer className={containerClassName}>
        <div className="flex flex-col gap-06 pt-08 pb-0">
          <h2 className="text-center text-body font-semibold text-neutral-950">{title}</h2>

          <div className="grid gap-04 md:grid-cols-3">
            {steps.map((step) => (
              <article
                key={`${step.stepLabel}-${step.title}`}
                className="rounded-md border border-gray-200 bg-white p-05"
              >
                <Text as="p" variant="label" className="text-neutral-500">
                  {step.stepLabel}
                </Text>
                <div className="mt-03 inline-flex rounded-sm bg-gray-200 p-02 text-slate-400">
                  {step.icon}
                </div>
                <h3 className="mt-04 text-lg font-semibold text-neutral-950">{step.title}</h3>
                <Text as="p" variant="body" className="mt-02 text-neutral-600">
                  {step.description}
                </Text>
              </article>
            ))}
          </div>
        </div>
      </SiteContainer>
    </section>
  )
}
