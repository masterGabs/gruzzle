export function getLabel(n) {
  let label = ''
  while (n >= 0) {
    label = String.fromCharCode(65 + (n % 26)) + label
    n = Math.floor(n / 26) - 1
  }
  return label
}

export function sliceImage(imageSrc, cols, rows, cellSize = 100) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const pieceW = cellSize
      const pieceH = cellSize
      const fullCanvas = document.createElement('canvas')
      fullCanvas.width = cellSize * cols
      fullCanvas.height = cellSize * rows
      const ctx = fullCanvas.getContext('2d')
      ctx.drawImage(img, 0, 0, fullCanvas.width, fullCanvas.height)

      const allCoords = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          allCoords.push(`${getLabel(c)}${r + 1}`)
        }
      }

      const pieces = []
      const ids = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const id = `${getLabel(c)}${r + 1}`
          ids.push(id)
          const pCanvas = document.createElement('canvas')
          pCanvas.width = pieceW
          pCanvas.height = pieceH
          const pCtx = pCanvas.getContext('2d')
          pCtx.drawImage(
            fullCanvas,
            c * pieceW, r * pieceH, pieceW, pieceH,
            0, 0, pieceW, pieceH
          )
          pieces.push({
            id,
            dataUrl: pCanvas.toDataURL('image/jpeg', 0.85),
            correctRow: r,
            correctCol: c,
            scatterLabel: '',
          })
        }
      }

      const shuffledLabels = shuffle(allCoords)
      for (let i = 0; i < pieces.length; i++) {
        pieces[i].scatterLabel = shuffledLabels[i]
      }

      resolve(pieces)
    }
    img.src = imageSrc
  })
}

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
