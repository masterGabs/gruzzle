import { Card, Typography, Box } from '@mui/material'

const badgeColors = {
  gold: '#fbbf24',
  silver: '#94a3b8',
  bronze: '#d97706',
  default: '#334155',
}

const cell = {
  p: 1,
  textAlign: 'left',
  borderBottom: '1px solid #334155',
  fontSize: '0.9rem',
}

const headerCell = {
  ...cell,
  color: 'text.secondary',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontSize: '0.75rem',
}

export default function Leaderboard({ groups, currentGroupId }) {
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

  if (sorted.length === 0) return null

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        🏆 Rangliste
      </Typography>
      <Box component="table" sx={{ width: 1, borderCollapse: 'collapse' }}>
        <Box component="thead">
          <Box component="tr">
            <Box component="th" sx={headerCell}>Rang</Box>
            <Box component="th" sx={headerCell}>Gruppe</Box>
            <Box component="th" sx={headerCell}>Zeit</Box>
          </Box>
        </Box>
        <Box component="tbody">
          {sorted.map((g, i) => {
            const badge = getBadge(i)
            const isCurrent = g.id === currentGroupId
            return (
              <Box
                component="tr"
                key={g.id}
                sx={{ bgcolor: isCurrent ? 'rgba(99, 102, 241, 0.1)' : undefined }}
              >
                <Box component="td" sx={cell}>
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
                </Box>
                <Box component="td" sx={cell}>
                  {g.name}
                  {isCurrent && g.time !== null ? ' ✅' : ''}
                </Box>
                <Box component="td" sx={cell}>{formatTime(g.time)}</Box>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Card>
  )
}
