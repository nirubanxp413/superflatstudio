import Link from 'next/link'
import { SHOW_PROJECTS_NAV } from '@/lib/siteNavConfig'
import { siteNavLinkClass } from '@/lib/siteNavLinkClass'
import { thoughtArticleColumnClassName } from '@/components/thought/ThoughtHeader'

export function ThoughtSiteNav() {
  return (
    <nav
      className={`${thoughtArticleColumnClassName} flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-b border-border-subtle pb-04 pt-06 md:pt-08`}
      aria-label="Site"
    >
      <div className="flex flex-wrap items-end gap-x-2 gap-y-1 min-w-0">
        <Link href="/#thought" scroll={false} className={siteNavLinkClass(true)}>
          Thought
        </Link>
        {SHOW_PROJECTS_NAV ? (
          <Link href="/" className={siteNavLinkClass(false)}>
            Work
          </Link>
        ) : null}
        {SHOW_PROJECTS_NAV ? (
          <Link href="/#projects" scroll={false} className={siteNavLinkClass(false)}>
            Projects
          </Link>
        ) : null}
        <Link href="/#sketches" scroll={false} className={siteNavLinkClass(false)}>
          Sketches
        </Link>
      </div>
      <Link href="/" className={siteNavLinkClass(false)}>
        About
      </Link>
    </nav>
  )
}
