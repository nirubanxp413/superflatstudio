import Link from 'next/link'
import { Button, Container, Text } from '@/components/ui'

export default function ThoughtNotFound() {
  return (
    <div
      data-theme="light"
      className="min-h-screen bg-background text-text-primary flex flex-col items-center justify-center px-4"
    >
      <Container className="text-center">
        <Text as="h1" variant="heading-lg" className="text-text-primary mb-04">
          Thought not found
        </Text>
        <Text as="p" variant="body-sm" className="text-text-secondary mb-08">
          That slug is not published as longform yet, or the URL is wrong.
        </Text>
        <Button as={Link} href="/#thought" variant="ghost" size="sm">
          ← Back to Thought
        </Button>
      </Container>
    </div>
  )
}
