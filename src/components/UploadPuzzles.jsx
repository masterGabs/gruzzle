import { useRef } from "react";
import {
  Container,
  Card,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  Stack,
  Box,
} from "@mui/material";

function resizeImage(dataUrl, maxDim) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      if (w <= maxDim && h <= maxDim) {
        resolve(dataUrl);
        return;
      }
      const ratio = Math.min(maxDim / w, maxDim / h);
      w = Math.round(w * ratio);
      h = Math.round(h * ratio);
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      resolve(c.toDataURL("image/jpeg", 0.85));
    };
    img.src = dataUrl;
  });
}

function getLabel(n) {
  let label = "";
  while (n >= 0) {
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26) - 1;
  }
  return label;
}

export default function UploadPuzzles({
  puzzles,
  onAdd,
  onUpdate,
  onRemove,
  onDone,
}) {
  const fileRef = useRef(null);
  const folderRef = useRef(null);

  const handleFiles = (files) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = async () => {
        const name = file.name.replace(/\.[^/.]+$/, "");
        const resized = await resizeImage(reader.result, 800);
        onAdd(resized, name);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" align="center" gutterBottom fontWeight={700}>
        🧩 Bilder hochladen
      </Typography>

      {puzzles.length === 0 && (
        <Card sx={{ p: 4, textAlign: "center", mb: 1 }}>
          <Typography color="text.secondary">
            Noch keine Bilder hochgeladen.
          </Typography>
        </Card>
      )}

      {puzzles.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 2,
            mb: 3,
          }}
        >
          {puzzles.map((p) => {
            const total = p.cols * p.rows;
            return (
              <Card key={p.id} sx={{ p: 1.5, bgcolor: "background.default" }}>
                <Box
                  component="img"
                  src={p.dataUrl}
                  alt={p.name}
                  sx={{
                    width: 1,
                    height: 140,
                    objectFit: "cover",
                    borderRadius: 1,
                    mb: 1,
                  }}
                />
                <Typography
                  variant="body2"
                  fontWeight={500}
                  noWrap
                  sx={{ mb: 2 }}
                >
                  {p.name}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  mt={0.5}
                  sx={{ alignItems: "center", flexWrap: "wrap" }}
                >
                  <TextField
                    type="number"
                    label="Spalten"
                    value={p.cols}
                    onChange={(e) =>
                      onUpdate(p.id, Math.max(1, +e.target.value || 1), p.rows)
                    }
                    slotProps={{
                      htmlInput: {
                        min: 1,
                        max: 12,
                        style: { textAlign: "center" },
                      },
                    }}
                    sx={{ width: 110 }}
                  />
                  <TextField
                    type="number"
                    label="Zeilen"
                    value={p.rows}
                    onChange={(e) =>
                      onUpdate(p.id, p.cols, Math.max(1, +e.target.value || 1))
                    }
                    slotProps={{
                      htmlInput: {
                        min: 1,
                        max: 12,
                        style: { textAlign: "center" },
                      },
                    }}
                    sx={{ width: 110 }}
                  />
                  <Chip
                    label={`= ${total} Teile`}
                    size="small"
                    variant="outlined"
                  />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onRemove(p.id)}
                  >
                    ✕
                  </IconButton>
                </Stack>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    mt: 1,
                    display: "block",
                    lineHeight: 1.8,
                    fontFamily: "monospace",
                    fontSize: "0.8rem",
                  }}
                >
                  {Array.from({ length: p.rows }, (_, r) => (
                    <Box
                      key={r}
                      sx={{
                        display: "block",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {Array.from({ length: p.cols }, (_, c) => (
                        <Box
                          key={c}
                          component="span"
                          sx={{
                            display: "inline-block",
                            width: 20,
                            textAlign: "center",
                            mr: 0.25,
                          }}
                        >
                          {getLabel(c)}
                          {r + 1}
                        </Box>
                      ))}
                    </Box>
                  ))}
                </Typography>
              </Card>
            );
          })}
        </Box>
      )}

      <Stack direction="row" spacing={2} mb={3}>
        <Card
          sx={{
            flex: 1,
            p: 4,
            textAlign: "center",
            cursor: "pointer",
            borderStyle: "dashed",
            borderColor: "#475569",
          }}
          onClick={() => fileRef.current?.click()}
        >
          <Typography variant="h6" gutterBottom>
            📁 Dateien auswählen
          </Typography>
          <Typography variant="body2" color="text.secondary">
            PNG, JPG, WEBP – mehrere Dateien auswählbar
          </Typography>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            style={{ display: "none" }}
          />
        </Card>
      </Stack>

      {puzzles.length > 0 && (
        <Button
          variant="contained"
          color="success"
          fullWidth
          size="large"
          onClick={onDone}
          sx={{ mt: 1 }}
        >
          Weiter
        </Button>
      )}
    </Container>
  );
}
