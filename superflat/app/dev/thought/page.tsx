import { notFound } from 'next/navigation'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import {
  ThoughtHeader,
  thoughtArticleColumnClassName,
  thoughtBlocksColumnClassName,
} from '@/components/thought/ThoughtHeader'
import { Button, Container } from '@/components/ui'
import Link from 'next/link'

const IMG = (w: number, h: number, seed: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

const TEXT_BLOCK_BODY = [
  {
    _type: 'block' as const,
    style: 'normal' as const,
    children: [
      {
        _type: 'span' as const,
        text: 'This is a dev-only fixture for the longform thought layout — no Sanity required.',
      },
    ],
  },
  {
    _type: 'block' as const,
    style: 'h2' as const,
    children: [{ _type: 'span' as const, text: 'Section' }],
  },
  {
    _type: 'block' as const,
    style: 'normal' as const,
    children: [
      {
        _type: 'span' as const,
        text: 'Body copy uses the same block stack as production thought pages.',
      },
    ],
  },
]

const FIXTURE_BLOCKS = [
  {
    _type: 'textBlock',
    _key: 't1',
    content: TEXT_BLOCK_BODY,
  },
  {
    _type: 'imageBlock',
    _key: 'i1',
    image: { url: IMG(1200, 700, 41) },
    caption: 'Supporting image — dev fixture',
  },
  {
    _type: 'codeCanvas',
    _key: 'c1',
    title: 'example.ts',
    language: 'typescript',
    code: `export function greet(name: string) {\n  return \`Hello, \${name}\`\n}`,
  },
  {
    _type: 'thinking',
    _key: 'th1',
    label: 'Note',
    text: 'Optional marginalia uses the thinking block.',
  },
]

export default function DevThoughtLayoutPage() {
  if (process.env.NODE_ENV === 'production') notFound()

  const publishedAt = '2026-01-15T12:00:00.000Z'

  return (
    <div
      data-theme="light"
      className="min-h-screen bg-background text-text-primary pb-14"
    >
      <ThoughtHeader
        title="Dev thought layout"
        publishedAt={publishedAt}
        description="Standfirst / dek text for layout validation. Not in the CMS."
      />

      <div className={`${thoughtBlocksColumnClassName} pb-10`}>
        <BlockRenderer blocks={FIXTURE_BLOCKS} />
      </div>

      <div className={thoughtArticleColumnClassName}>
        <div className="pt-06 border-t border-border-subtle">
          <Button as={Link} href="/#thought" variant="ghost" size="sm">
            ← Back to Thought
          </Button>
        </div>
      </div>

      <Container>
        <p className="text-xs font-mono text-text-muted py-06">
          /dev/thought — returns 404 in production
        </p>
      </Container>
    </div>
  )
}
