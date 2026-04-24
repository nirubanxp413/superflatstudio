'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { PTBlock } from '@/components/blocks/TextBlock'
import { renderPortableTextAbout } from '@/components/blocks/textBlockUtils'

const ABOUT_ANIM_MS = 200

export function AboutOverlay({
  open,
  onClose,
  portraitSrc,
  portraitAlt = '',
  bodyBlocks,
  fallbackParagraphs,
  linkedInUrl,
}: {
  open: boolean
  onClose: () => void
  portraitSrc: string
  portraitAlt?: string
  bodyBlocks: PTBlock[] | null
  fallbackParagraphs: string[]
  linkedInUrl: string | null
}) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const [layerMounted, setLayerMounted] = useState(false)
  const [animIn, setAnimIn] = useState(false)

  useEffect(() => {
    if (open) {
      setLayerMounted(true)
      let cancelled = false
      const t = window.setTimeout(() => {
        if (!cancelled) setAnimIn(true)
      }, 0)
      return () => {
        cancelled = true
        clearTimeout(t)
      }
    }

    setAnimIn(false)
    const t = window.setTimeout(() => {
      setLayerMounted(false)
    }, ABOUT_ANIM_MS)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!layerMounted || !animIn) return
    closeRef.current?.focus()
  }, [layerMounted, animIn])

  useEffect(() => {
    if (!layerMounted) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [layerMounted, onClose])

  if (!layerMounted) return null

  const usePortable = Boolean(bodyBlocks && bodyBlocks.length > 0)

  return (
    <div
      className={`about-overlay${animIn ? ' about-overlay--open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="about-overlay-bg" aria-hidden />
      <button
        type="button"
        className="about-overlay-dismiss"
        aria-label="Close about"
        onClick={onClose}
      />
      <div className="about-overlay-stage">
        <button
          ref={closeRef}
          type="button"
          className="about-overlay-close nav-button"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="about-overlay-fade">
          <div className="about-overlay-inner">
            <img
              className="about-overlay-portrait"
              src={portraitSrc}
              alt={portraitAlt}
              width={200}
              height={200}
            />
            <h2 id={titleId} className="sr-only">
              About
            </h2>
            <div className="about-overlay-body">
              {usePortable
                ? renderPortableTextAbout(bodyBlocks!)
                : fallbackParagraphs.map((text, i) => (
                    <p key={i} className="about-overlay-paragraph">
                      {text}
                    </p>
                  ))}
            </div>
            {linkedInUrl ? (
              <a
                className="about-overlay-link"
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
