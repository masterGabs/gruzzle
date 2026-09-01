import { useState, useEffect, useRef } from 'react'
import { Box, Typography, Button, Stack } from '@mui/material'

export default function Timer({ groupName, autoStart, triggerStop, onStop, onDone }) {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const interval = useRef(null)
  const startTimeRef = useRef(0)

  useEffect(() => {
    return () => {
      if (interval.current) {
        clearInterval(interval.current)
        interval.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (autoStart && !finished) {
      start()
    }
  }, [autoStart, finished])

  useEffect(() => {
    if (triggerStop && running) {
      stop()
    }
  }, [triggerStop, running])

  const start = () => {
    if (interval.current) return
    setRunning(true)
    startTimeRef.current = Date.now()
    interval.current = window.setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current)
    }, 100)
  }

  const stop = () => {
    if (interval.current) {
      clearInterval(interval.current)
      interval.current = null
    }
    const now = Date.now()
    const total = now - startTimeRef.current
    setElapsed(total)
    setRunning(false)
    setFinished(true)
    const seconds = Math.round(total / 100) / 10
    onStop(seconds)
  }

  const reset = () => {
    if (interval.current) {
      clearInterval(interval.current)
      interval.current = null
    }
    setElapsed(0)
    setRunning(false)
    setFinished(false)
  }

  const format = (ms) => {
    const totalSec = Math.floor(ms / 1000)
    const min = Math.floor(totalSec / 60)
    const sec = totalSec % 60
    const dec = Math.floor((ms % 1000) / 100)
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${dec}`
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px solid #334155',
        mt: 2,
      }}
    >
      <Typography fontWeight={600} sx={{ minWidth: 100 }}>
        {groupName}
      </Typography>
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{
          fontVariantNumeric: 'tabular-nums',
          fontFamily: "'Courier New', monospace",
          minWidth: 120,
          textAlign: 'center',
          color: running ? 'success.main' : 'inherit',
        }}
      >
        {format(elapsed)}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
        {!running && !finished && (
          <Button variant="contained" color="success" onClick={start}>
            ▶ Start
          </Button>
        )}
        {running && (
          <Button variant="contained" color="error" onClick={stop}>
            ⏹ Stop
          </Button>
        )}
        {finished && (
          <>
            <Button variant="outlined" onClick={reset}>
              🔄 Zurücksetzen
            </Button>
            <Button variant="contained" onClick={onDone}>
              Weiter ➡
            </Button>
          </>
        )}
      </Stack>
    </Box>
  )
}