import type { PTBlock, PTChild, PTMarkDef } from './TextBlock'

export type PortableInlineOptions = {
  codeClassName?: string
  linkClassName?: string
}

export function renderPortableInlineSpans(
  children: PTChild[],
  markDefs: PTMarkDef[] = [],
  options: PortableInlineOptions = {},
) {
  const codeClass =
    options.codeClassName ?? 'font-mono text-code-sm bg-layer px-01'
  const linkClass =
    options.linkClassName ?? 'underline underline-offset-2'

  const linkByKey = new Map(
    markDefs
      .filter((d) => d._type === 'link' && d.href)
      .map((d) => [d._key, d.href!]),
  )

  return children.map((child, i) => {
    const marks = child.marks ?? []
    let node: React.ReactNode = child.text
    if (marks.includes('strong')) node = <strong>{node}</strong>
    if (marks.includes('em')) node = <em>{node}</em>
    if (marks.includes('code')) node = <code className={codeClass}>{node}</code>

    const linkHref = marks.map((m) => linkByKey.get(m)).find(Boolean)
    if (linkHref) {
      const external = /^https?:\/\//i.test(linkHref)
      node = (
        <a
          href={linkHref}
          className={linkClass}
          {...(external
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {node}
        </a>
      )
    }

    return <span key={child._key ?? i}>{node}</span>
  })
}

export function renderPortableTextSimple(blocks: PTBlock[]) {
  return blocks.map((block, idx) => {
    const text = renderPortableInlineSpans(block.children, block.markDefs)
    switch (block.style) {
      case 'h2':
        return (
          <h2
            key={block._key ?? idx}
            className="text-heading-md font-sans text-text-primary mt-06 mb-03"
          >
            {text}
          </h2>
        )
      case 'h3':
        return (
          <h3
            key={block._key ?? idx}
            className="text-heading font-sans font-semibold text-text-primary mt-05 mb-02"
          >
            {text}
          </h3>
        )
      case 'blockquote':
        return (
          <blockquote
            key={block._key ?? idx}
            className="pl-06 border-l-2 text-text-secondary text-body my-05"
            style={{ borderLeftColor: 'var(--interactive)' }}
          >
            {text}
          </blockquote>
        )
      default:
        return (
          <p
            key={block._key ?? idx}
            className="text-body font-sans text-text-primary mb-04"
          >
            {text}
          </p>
        )
    }
  })
}

/** Portable text styled for the home About overlay (homeExperience.css). */
export function renderPortableTextAbout(blocks: PTBlock[]) {
  return blocks.map((block, idx) => {
    const text = renderPortableInlineSpans(block.children, block.markDefs, {
      linkClassName: 'about-overlay-inline-link',
    })
    switch (block.style) {
      case 'h2':
        return (
          <h2 key={block._key ?? idx} className="about-overlay-h2">
            {text}
          </h2>
        )
      case 'h3':
        return (
          <h3 key={block._key ?? idx} className="about-overlay-h3">
            {text}
          </h3>
        )
      case 'blockquote':
        return (
          <blockquote
            key={block._key ?? idx}
            className="about-overlay-blockquote"
          >
            {text}
          </blockquote>
        )
      default:
        return (
          <p key={block._key ?? idx} className="about-overlay-paragraph">
            {text}
          </p>
        )
    }
  })
}
