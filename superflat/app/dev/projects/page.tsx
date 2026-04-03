import { notFound } from 'next/navigation'
import { HeroImage } from '@/components/blocks/HeroImage'
import { PageHeader } from '@/components/blocks/PageHeader'
import { HeroCodeSketch } from '@/components/blocks/HeroCodeSketch'
import { ThinkingGallery } from '@/components/blocks/ThinkingGallery'
import { Thinking } from '@/components/blocks/Thinking'
import { Artefact } from '@/components/blocks/Artefact'
import { CodeCanvas } from '@/components/blocks/CodeCanvas'
import { TextBlock } from '@/components/blocks/TextBlock'
import { ImageBlock } from '@/components/blocks/ImageBlock'

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const IMG = (w: number, h: number, seed: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

const HERO_IMAGE_BLOCK = {
  image: { url: IMG(1600, 900, 10) },
}

const PAGE_HEADER_BLOCK = {
  title: 'Project blocks',
  subtitle: 'All block components rendered with dummy data. No Sanity required.',
}

const HERO_SKETCH_BLOCK = {
  language: 'javascript',
  code: `function setup() { createCanvas(windowWidth, windowHeight); }
function draw() {
  background(0);
  fill(0, 63, 255);
  ellipse(mouseX, mouseY, 80, 80);
}`,
}

const THINKING_GALLERY_BLOCK = {
  heading: 'Design process',
  body: "Exploring the interplay between constraint and expression. Every creative decision is also a structural one — the two can't be separated.",
  images: [
    { image: { url: IMG(800, 600, 20) }, size: 'full' as const },
    { image: { url: IMG(400, 300, 21) }, size: 'half' as const },
    { image: { url: IMG(400, 300, 22) }, size: 'half' as const },
    { image: { url: IMG(800, 600, 23) }, size: 'full' as const },
  ],
}

const THINKING_BLOCK = {
  text: 'Early on we decided to separate the data model from the view layer completely. This let us iterate on the UI without touching the underlying structure — a discipline that paid off in every subsequent revision.',
}

const ARTEFACT_BLOCK = {
  title: 'Prototype v2',
  url: 'https://example.com/prototype',
  description:
    'Interactive mock-up exploring the core user flows. Built in Figma with auto-layout — all components are responsive.',
}

const CODE_CANVAS_BLOCK = {
  title: 'lib/queries.ts',
  language: 'typescript',
  code: `export const projectBySlugQuery = \`
  *[_type == "project" && slug.current == $slug][0] {
    _id, title, slug, category, description,
    tags, publishedAt, isFeatured, type,
    mainImage { asset->, hotspot },
    pageContent[] {
      ...,
      image { asset->, hotspot },
      images[] { image { asset->, hotspot }, size }
    }
  }
\``,
}

const TEXT_BLOCK_BODY = [
  {
    _type: 'block' as const,
    style: 'normal' as const,
    children: [
      {
        _type: 'span' as const,
        text: 'The project started with a simple question: what does it mean to design a tool that shapes the way you think, not just the way you work? Most productivity software optimises for throughput. We wanted to optimise for quality of thought.',
      },
    ],
  },
  {
    _type: 'block' as const,
    style: 'h2' as const,
    children: [{ _type: 'span' as const, text: 'The constraint that set us free' }],
  },
  {
    _type: 'block' as const,
    style: 'normal' as const,
    children: [
      {
        _type: 'span' as const,
        text: 'By limiting the interface to a single primary action at a time, we forced every interaction to be intentional.',
      },
    ],
  },
  {
    _type: 'block' as const,
    style: 'blockquote' as const,
    children: [
      {
        _type: 'span' as const,
        text: 'Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.',
      },
    ],
  },
]

const IMAGE_BLOCK = {
  image: { url: IMG(1200, 700, 40) },
  caption: 'Final system diagram — showing how each layer connects to the next.',
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DevProjectsPage() {
  if (process.env.NODE_ENV === 'production') notFound()

  return (
    <div
      style={{
        background: 'var(--background)',
        color: 'var(--text-primary)',
        minHeight: '100vh',
      }}
    >
      {/* Hero image is always first */}
      <HeroImage block={HERO_IMAGE_BLOCK} />

      {/* Page header — sits directly below hero */}
      <PageHeader block={PAGE_HEADER_BLOCK} />

      <div className="pt-8">
        <HeroCodeSketch block={HERO_SKETCH_BLOCK} />
      </div>

      <div className="pt-8">
        <ThinkingGallery block={THINKING_GALLERY_BLOCK} />
      </div>

      <div className="pt-8">
        <Thinking block={THINKING_BLOCK} />
      </div>

      <div className="pt-8">
        <Artefact block={ARTEFACT_BLOCK} />
      </div>

      <div className="pt-8">
        <CodeCanvas block={CODE_CANVAS_BLOCK} />
      </div>

      {/* TextBlock — left (default) */}
      <div className="pt-8">
        <TextBlock block={{ content: TEXT_BLOCK_BODY, align: 'left' }} />
      </div>

      {/* TextBlock — center */}
      <div className="pt-8">
        <TextBlock block={{ content: TEXT_BLOCK_BODY, align: 'center' }} />
      </div>

      {/* TextBlock — right */}
      <div className="pt-8">
        <TextBlock block={{ content: TEXT_BLOCK_BODY, align: 'right' }} />
      </div>

      <div className="pt-8">
        <ImageBlock block={IMAGE_BLOCK} />
      </div>

      <div className="max-w-[1584px] mx-auto px-4 md:px-8 py-09">
        <p className="text-xs font-mono text-text-muted">
          /dev/projects — returns 404 in production
        </p>
      </div>
    </div>
  )
}
