import { useState } from 'react'
import { Container } from '@mui/material'
import SetupGroups from './components/SetupGroups.jsx'
import UploadPuzzles from './components/UploadPuzzles.jsx'
import GameView from './components/GameView.jsx'
import FinishedView from './components/FinishedView.jsx'

let nextGroupId = 1
let nextPuzzleId = 1

function createGroup(name) {
  return { id: `g${nextGroupId++}`, name, time: null }
}

function createPuzzle(dataUrl, name) {
  return { id: `p${nextPuzzleId++}`, name, dataUrl, cols: 3, rows: 3, completed: false }
}

export default function App() {
  const [phase, setPhase] = useState('upload')
  const [groups, setGroups] = useState([])
  const [puzzles, setPuzzles] = useState([])
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const [groupIndex, setGroupIndex] = useState(0)

  const currentPuzzle = puzzles[puzzleIndex]
  const currentGroup = groups[groupIndex]

  const addGroup = (name) => {
    setGroups((prev) => [...prev, createGroup(name)])
  }

  const removeGroup = (id) => {
    setGroups((prev) => prev.filter((g) => g.id !== id))
  }

  const addPuzzle = (dataUrl, name) => {
    setPuzzles((prev) => [...prev, createPuzzle(dataUrl, name)])
  }

  const updatePuzzle = (id, cols, rows) => {
    setPuzzles((prev) => prev.map((p) => (p.id === id ? { ...p, cols, rows } : p)))
  }

  const removePuzzle = (id) => {
    setPuzzles((prev) => prev.filter((p) => p.id !== id))
  }

  const handleTimerStop = (time) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === currentGroup.id ? { ...g, time: (g.time ?? 0) + time } : g
      )
    )
  }

  const nextTurn = () => {
    const nextGroupIdx = groupIndex + 1
    const nextPuzzleIdx = puzzleIndex + 1

    if (nextGroupIdx < groups.length && nextPuzzleIdx < puzzles.length) {
      setGroupIndex(nextGroupIdx)
      setPuzzleIndex(nextPuzzleIdx)
    } else if (nextGroupIdx >= groups.length && nextPuzzleIdx < puzzles.length) {
      setGroupIndex(0)
      setPuzzleIndex(nextPuzzleIdx)
    } else {
      setPhase('finished')
    }
  }

  const restart = () => {
    nextGroupId = 1
    nextPuzzleId = 1
    setPhase('setup')
    setGroups([])
    setPuzzles([])
    setPuzzleIndex(0)
    setGroupIndex(0)
  }

  return (
    <Container maxWidth="lg">
      {phase === 'upload' && (
        <UploadPuzzles
          puzzles={puzzles}
          onAdd={addPuzzle}
          onUpdate={updatePuzzle}
          onRemove={removePuzzle}
          onDone={() => {
            setPuzzleIndex(0)
            setGroupIndex(0)
            setGroups((prev) => prev.map((g) => ({ ...g, time: null })))
            setPhase('setup')
          }}
        />
      )}

      {phase === 'setup' && (
        <SetupGroups
          groups={groups}
          onAdd={addGroup}
          onRemove={removeGroup}
          onDone={() => setPhase('play')}
        />
      )}

      {phase === 'play' && currentPuzzle && currentGroup && (
        <GameView
          puzzle={currentPuzzle}
          puzzleIndex={puzzleIndex}
          totalPuzzles={puzzles.length}
          group={currentGroup}
          groupIndex={groupIndex}
          totalGroups={groups.length}
          groups={groups}
          onTimerStop={handleTimerStop}
          onNextGroup={nextTurn}
        />
      )}

      {phase === 'finished' && (
        <FinishedView groups={groups} onRestart={restart} />
      )}
    </Container>
  )
}
