'use client'

import { useState } from 'react'
import { Text } from '@/components/ui'
import { AppsCtaButton } from './AppsCtaButton'
import { SiteContainer } from './SiteContainer'
import type { PersonaTab } from './types'

type UseCasePersonaProps = {
  title: string
  tabs: PersonaTab[]
  containerClassName?: string
  className?: string
}

export function UseCasePersona({
  title,
  tabs,
  containerClassName = '',
  className = '',
}: UseCasePersonaProps) {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id ?? '')
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0]

  return (
    <section className={['mb-8', className].filter(Boolean).join(' ')}>
      <SiteContainer className={containerClassName}>
        <div className="pt-08 pb-0">
          <h2 className="text-2xl font-semibold text-neutral-950">{title}</h2>

          <div className="mt-05 flex flex-wrap gap-02">
            {tabs.map((tab) => {
              const active = tab.id === activeTab?.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={[
                    'rounded-md px-04 py-02 text-body-sm transition-colors',
                    active
                      ? 'bg-[var(--brand)] text-slate-50'
                      : 'bg-gray-100 text-neutral-700 hover:bg-gray-200',
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {activeTab ? (
            <article className="mt-04 rounded-md bg-gray-100 p-05">
              <h3 className="text-body font-semibold text-neutral-950">{activeTab.title}</h3>
              <Text as="p" variant="body" className="mt-02 text-neutral-600">
                {activeTab.description}
              </Text>
              {activeTab.bullets?.length ? (
                <ul className="mt-04 list-disc space-y-02 pl-05 text-body-sm text-neutral-700">
                  {activeTab.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
              {activeTab.cta ? (
                <div className="mt-04">
                  <AppsCtaButton cta={activeTab.cta} />
                </div>
              ) : null}
            </article>
          ) : null}
        </div>
      </SiteContainer>
    </section>
  )
}
