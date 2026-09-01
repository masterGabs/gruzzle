import {
  Container, Typography, Card, Button, Box, Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material'

const badgeColors = {
  gold: '#fbbf24',
  silver: '#94a3b8',
  bronze: '#d97706',
  default: '#334155',
}

export default function FinishedView({ groups, onRestart }) {
  const sorted = [...groups]
    .filter((g) => g.time !== null)
    .sort((a, b) => (a.time ?? Infinity) - (b.time ?? Infinity))

  const getBadge = (i) => {
    if (i === 0) return { label: 1, color: badgeColors.gold }
    if (i === 1) return { label: 2, color: badgeColors.silver }
    if (i === 2) return { label: 3, color: badgeColors.bronze }
    return { label: i + 1, color: badgeColors.default }
  }

  const formatTime = (s) => {
    const min = Math.floor(s / 60)
    const sec = Math.round(s % 60)
    return `${min}:${String(sec).padStart(2, '0')}`
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h3" align="center" gutterBottom fontWeight={700}>
        🏆 Spiel beendet!
      </Typography>

      {sorted.length > 0 && (
        <Card sx={{ textAlign: 'center', p: 4, mb: 2 }}>
          <Typography variant="h2" sx={{ mb: 1 }}>
            🥇
          </Typography>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            {sorted[0].name}
          </Typography>
          <Typography color="text.secondary">
            Zeit: {formatTime(sorted[0].time)}
          </Typography>
        </Card>
      )}

      <Card sx={{ p: 2, mb: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          Endgültige Rangliste
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rang</TableCell>
              <TableCell>Gruppe</TableCell>
              <TableCell>Zeit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map((g, i) => {
              const badge = getBadge(i)
              return (
                <TableRow key={g.id}>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        bgcolor: badge.color,
                        color: i === 2 ? '#fff' : '#1e293b',
                      }}
                    >
                      {badge.label}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: i === 0 ? 700 : undefined }}>
                    {g.name}
                  </TableCell>
                  <TableCell>{formatTime(g.time)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>

      <Button variant="contained" color="success" fullWidth size="large" onClick={onRestart}>
        🔄 Neues Spiel starten
      </Button>
    </Container>
  )
}
