'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type Modifier,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import type { PedalConfig, TransformerState } from '@/types/pedal'
import { SortablePedal } from './SortablePedal'

export interface PedalboardProps {
  pedals: PedalConfig[]
  onPedalsChange: (pedals: PedalConfig[]) => void
  pedalStates?: Record<string, TransformerState>
  pedalIntensities?: Record<string, number>
  onIntensityChange?: (pedalId: string, value: number) => void
}

export function Pedalboard({
  pedals,
  onPedalsChange,
  pedalStates = {},
  pedalIntensities = {},
  onIntensityChange,
}: PedalboardProps) {
  const [intensities, setIntensities] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {}
    pedals.forEach((p) => {
      init[p.id] = pedalIntensities[p.id] ?? 0.5
    })
    return init
  })

  const handleIntensityChange = useCallback(
    (pedalId: string, value: number) => {
      setIntensities((prev) => ({ ...prev, [pedalId]: value }))
      onIntensityChange?.(pedalId, value)
    },
    [onIntensityChange]
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const GRID_SIZE = 14
  const snapToGridModifier: Modifier = ({ transform }) => ({
    ...transform,
    x: Math.round(transform.x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(transform.y / GRID_SIZE) * GRID_SIZE,
  })

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return
      const oldIndex = pedals.findIndex((p) => p.id === active.id)
      const newIndex = pedals.findIndex((p) => p.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return
      const next = arrayMove(pedals, oldIndex, newIndex)
      onPedalsChange(next)
    },
    [pedals, onPedalsChange]
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[snapToGridModifier]}
    >
      <div
        className="pedalboard flex flex-wrap justify-center gap-6 px-8 py-8"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.18) 1px, transparent 1px)`,
          backgroundSize: '14px 14px',
        }}
      >
        <SortableContext
          items={pedals.map((p) => p.id)}
          strategy={horizontalListSortingStrategy}
        >
          {pedals.map((pedal) => (
            <SortablePedal
              key={pedal.id}
              {...pedal}
              intensity={intensities[pedal.id] ?? 0.5}
              onIntensityChange={(v) => handleIntensityChange(pedal.id, v)}
              state={pedalStates[pedal.id] ?? 'static'}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  )
}
