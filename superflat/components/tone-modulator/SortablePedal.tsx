'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { PedalConfig, TransformerState } from '@/types/pedal'
import { Pedal } from './Pedal'

export interface SortablePedalProps extends PedalConfig {
  intensity: number
  onIntensityChange: (v: number) => void
  state: TransformerState
}

export function SortablePedal(props: SortablePedalProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'z-50 opacity-90' : ''}`}
    >
      <Pedal
        {...props}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}
