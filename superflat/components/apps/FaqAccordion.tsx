'use client'

import { useState } from 'react'
import { Text } from '@/components/ui'
import { SiteContainer } from './SiteContainer'
import type { FaqItem } from './types'

type FaqAccordionProps = {
  title: string
  items: FaqItem[]
  containerClassName?: string
  className?: string
}

export function FaqAccordion({
  title,
  items,
  containerClassName = '',
  className = '',
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className={['mb-8', className].filter(Boolean).join(' ')}>
      <SiteContainer className={containerClassName}>
        <div className="pt-08 pb-0">
          <h2 className="text-2xl font-semibold text-neutral-950">{title}</h2>
          <div className="mt-05 space-y-03">
            {items.map((item, index) => {
              const open = openIndex === index
              return (
                <article key={item.question} className="rounded-md bg-gray-100 p-04">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-03 text-left"
                    onClick={() => setOpenIndex(open ? null : index)}
                  >
                    <span className="text-body font-semibold text-neutral-950">{item.question}</span>
                    <span className="text-neutral-600">{open ? '−' : '+'}</span>
                  </button>
                  {open ? (
                    <Text as="p" variant="body" className="mt-03 text-neutral-600">
                      {item.answer}
                    </Text>
                  ) : null}
                </article>
              )
            })}
          </div>
        </div>
      </SiteContainer>
    </section>
  )
}
