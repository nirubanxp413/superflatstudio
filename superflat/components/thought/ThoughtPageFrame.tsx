import type { ReactNode } from 'react'
import { ThoughtSiteNav } from '@/components/thought/ThoughtSiteNav'

/**
 * Thought page sticky-footer skeleton.
 *
 * The thought layout root is `min-h-dvh flex flex-col`. We render three direct
 * children as siblings: `nav`, a `flex-1` content column, and `bottomNav`.
 * The middle column expands to fill remaining vertical space, so the bottom nav
 * always sits at the bottom of the viewport for short content and below the
 * content for long content.
 */
export function ThoughtPageFrame({
  children,
  bottomNav,
}: {
  children: ReactNode
  bottomNav: ReactNode
}) {
  return (
    <>
      <ThoughtSiteNav />
      <div className="flex w-full min-w-0 flex-1 flex-col">{children}</div>
      {bottomNav}
    </>
  )
}
