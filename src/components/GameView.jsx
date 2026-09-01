import { useEffect, useRef, useState } from "react";
import { Container, Card, Typography, Box, IconButton } from "@mui/material";
import { sliceImage, shuffle, getLabel } from "../utils/sliceImage.js";
import Timer from "./Timer.jsx";
import Leaderboard from "./Leaderboard.jsx";

const CELL_SIZE = 100;

export default function GameView({
  puzzle,
  puzzleIndex,
  totalPuzzles,
  group,
  groupIndex,
  totalGroups,
  groups,
  onTimerStop,
  onNextGroup,
}) {
  const [pieces, setPieces] = useState([]);
  const [scatterOrder, setScatterOrder] = useState([]);
  const [placed, setPlaced] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const [triggerStop, setTriggerStop] = useState(false);
  const [ready, setReady] = useState(false);
  const dragPiece = useRef(null);

  const totalCells = puzzle.cols * puzzle.rows;

  useEffect(() => {
    setLoading(true);
    setPlaced(new Set());
    setShowCompletion(false);
    setTriggerStop(false);
    setReady(false);

    sliceImage(puzzle.dataUrl, puzzle.cols, puzzle.rows, CELL_SIZE).then(
      (sliced) => {
        const order = shuffle(sliced).map((p) => p.id);
        setPieces(sliced);
        setScatterOrder(order);
        setLoading(false);
        setReady(true);
      },
    );
  }, [puzzle.dataUrl, puzzle.cols, puzzle.rows]);

  useEffect(() => {
    if (placed.size === totalCells && totalCells > 0) {
      setShowCompletion(true);
      setTriggerStop(true);
    }
  }, [placed.size, totalCells]);

  const handleCloseCompletion = () => {
    setShowCompletion(false);
  };

  const handleDragStart = (pieceId) => {
    dragPiece.current = pieceId;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (row, col) => {
    const pieceId = dragPiece.current;
    if (!pieceId) return;
    const piece = pieces.find((p) => p.id === pieceId);
    if (!piece) return;
    if (piece.correctRow === row && piece.correctCol === col) {
      setPlaced((prev) => new Set(prev).add(pieceId));
    }
    dragPiece.current = null;
  };

  const pieceMap = new Map(pieces.map((p) => [p.id, p]));

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Card sx={{ p: 4, textAlign: "center" }}>
          <Typography>Puzzle wird vorbereitet...</Typography>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Card sx={{ p: 2, mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Puzzle {puzzleIndex + 1} / {totalPuzzles}
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {puzzle.name}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body2" color="text.secondary">
              Gruppe
            </Typography>
            <Typography fontWeight={600}>
              {group.name} ({groupIndex + 1}/{totalGroups})
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {placed.size}/{totalCells} platziert
          </Typography>
        </Box>
      </Card>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "flex-start",
          flexWrap: { xs: "wrap", md: "nowrap" },
        }}
      >
        <Box sx={{ width: 280, flexShrink: 0 }}>
          <Leaderboard groups={groups} currentGroupId={group.id} />
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            p: 3,
            bgcolor: "background.default",
            borderRadius: 2,
            border: "1px solid #334155",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(${puzzle.cols}, ${CELL_SIZE}px)`,
              zIndex: 10,
              border: "2px solid #6366f1",
              borderRadius: 1,
              boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)",
              flexShrink: 0,
            }}
          >
            {Array.from({ length: puzzle.rows }, (_, r) =>
              Array.from({ length: puzzle.cols }, (_, c) => {
                const cellId = `${getLabel(c)}${r + 1}`;
                const isPlaced = placed.has(cellId);
                const placedPiece = isPlaced ? pieceMap.get(cellId) : null;
                return (
                  <Box
                    key={cellId}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(r, c)}
                    sx={{
                      position: "relative",
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      border: "1px solid #475569",
                      bgcolor: "rgba(30, 41, 59, 0.8)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.15s",
                      "&:hover": { bgcolor: "rgba(99, 102, 241, 0.15)" },
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 2,
                        left: 2,
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        color: "#64748b",
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    >
                      {cellId}
                    </Box>
                    {placedPiece && (
                      <Box
                        component="img"
                        src={placedPiece.dataUrl}
                        alt={cellId}
                        draggable={false}
                        sx={{
                          width: 1,
                          height: 1,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    )}
                  </Box>
                );
              }),
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 1,
            }}
          >
            {ready &&
              scatterOrder
                .filter((id) => !placed.has(id))
                .map((id) => {
                  const piece = pieceMap.get(id);
                  if (!piece) return null;
                  return (
                    <Box
                      key={piece.id}
                      draggable
                      onDragStart={() => handleDragStart(piece.id)}
                      sx={{
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        flexShrink: 0,
                        cursor: "grab",
                        borderRadius: 1,
                        overflow: "hidden",
                        border: "2px solid #6366f1",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
                        position: "relative",
                        transition: "transform 0.15s, box-shadow 0.15s",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: "0 6px 16px rgba(99, 102, 241, 0.5)",
                        },
                        "&:active": {
                          cursor: "grabbing",
                          transform: "scale(1.08)",
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={piece.dataUrl}
                        alt={piece.id}
                        draggable={false}
                        sx={{
                          width: 1,
                          height: 1,
                          objectFit: "cover",
                          display: "block",
                          pointerEvents: "none",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 2,
                          left: 2,
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          color: "#fff",
                          bgcolor: "rgba(0, 0, 0, 0.7)",
                          px: 0.5,
                          borderRadius: 0.5,
                          pointerEvents: "none",
                        }}
                      >
                        {piece.scatterLabel}
                      </Box>
                    </Box>
                  );
                })}
          </Box>

          {showCompletion && (
            <Box
              onClick={handleCloseCompletion}
              sx={{
                position: "absolute",
                inset: 0,
                bgcolor: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 50,
                borderRadius: 2,
                animation: "fadeIn 0.3s ease",
                top: "100%",
              }}
            >
              <Card
                onClick={(e) => e.stopPropagation()}
                sx={{
                  textAlign: "center",
                  p: 3,
                  animation: "bounceIn 0.4s ease",
                  position: "relative",
                }}
              >
                <IconButton
                  size="small"
                  onClick={handleCloseCompletion}
                  sx={{ position: "absolute", top: 8, right: 8 }}
                >
                  ✕
                </IconButton>
                <Box
                  component="img"
                  src={puzzle.dataUrl}
                  alt={puzzle.name}
                  sx={{
                    maxWidth: "90vw",
                    maxHeight: "70vh",
                    borderRadius: 2,
                    border: "3px solid #6366f1",
                    boxShadow: "0 0 40px rgba(99, 102, 241, 0.5)",
                    mb: 2,
                  }}
                />
                <Typography variant="h4" gutterBottom fontWeight={700}>
                  Fertig!
                </Typography>
                <Typography color="text.secondary">
                  Alle Teile sind richtig platziert.
                </Typography>
              </Card>
            </Box>
          )}
        </Box>
      </Box>

      <Timer
        key={`${puzzle.id}-${group.id}`}
        groupName={group.name}
        autoStart={ready}
        triggerStop={triggerStop}
        onStop={onTimerStop}
        onDone={onNextGroup}
      />
    </Container>
  );
}
