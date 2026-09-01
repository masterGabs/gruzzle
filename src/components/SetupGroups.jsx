import { useState } from 'react'
import { Container, Card, Typography, TextField, Button, Box, Stack, Avatar } from '@mui/material'

export default function SetupGroups({ groups, onAdd, onRemove, onDone }) {
  const [name, setName] = useState('')

  const handleAdd = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setName('')
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h3" align="center" gutterBottom fontWeight={700}>
        🎉 Puzzle Party
      </Typography>

      <Card sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          Gruppen einrichten
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Füge die Gruppen hinzu, die gegeneinander antreten.
        </Typography>

        <Stack direction="row" spacing={1} mb={2}>
          <TextField
            fullWidth
            size="small"
            placeholder="Gruppenname..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button variant="contained" onClick={handleAdd}>
            Hinzufügen
          </Button>
        </Stack>

        {groups.length > 0 && (
          <Stack spacing={1} mb={2}>
            {groups.map((g, i) => (
              <Box
                key={g.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  bgcolor: 'background.default',
                  p: 1.5,
                  borderRadius: 2,
                }}
              >
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: 'primary.main',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </Avatar>
                <Typography sx={{ flex: 1 }}>{g.name}</Typography>
                <Button variant="contained" color="error" size="small" onClick={() => onRemove(g.id)}>
                  Entfernen
                </Button>
              </Box>
            ))}
          </Stack>
        )}

        {groups.length > 0 && (
          <Button variant="contained" color="success" fullWidth size="large" onClick={onDone} sx={{ mt: 1 }}>
            Spielen!
          </Button>
        )}
      </Card>
    </Container>
  )
}
