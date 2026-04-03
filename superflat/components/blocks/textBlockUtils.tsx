import type { PTBlock, PTChild } from './TextBlock'

function renderChildren(children: PTChild[]) {
  return children.map((child, i) => {
    const marks = child.marks ?? []
    let node: React.ReactNode = child.text
    if (marks.includes('strong')) node = <strong key={i}>{node}</strong>
    if (marks.includes('em')) node = <em key={i}>{node}</em>
    if (marks.includes('code')) node = <code key={i} className="font-mono text-code-sm bg-layer px-01">{node}</code>
    return <span key={i}>{node}</span>
  })
}

export function renderPortableTextSimple(blocks: PTBlock[]) {
  return blocks.map((block, idx) => {
    const text = renderChildren(block.children)
    switch (block.style) {
      case 'h2':
        return <h2 key={idx} className="text-heading-md font-sans text-text-primary mt-06 mb-03">{text}</h2>
      case 'h3':
        return <h3 key={idx} className="text-heading font-sans font-semibold text-text-primary mt-05 mb-02">{text}</h3>
      case 'blockquote':
        return (
          <blockquote key={idx} className="pl-06 border-l-2 text-text-secondary text-body my-05" style={{ borderLeftColor: 'var(--interactive)' }}>
            {text}
          </blockquote>
        )
      default:
        return <p key={idx} className="text-body font-sans text-text-primary mb-04">{text}</p>
    }
  })
}
