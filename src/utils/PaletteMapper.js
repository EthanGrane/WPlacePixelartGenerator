export const freePaletteHex = [
  "#000000", "#3c3c3c", "#787878", "#d2d2d2", "#ffffff", "#600018", "#ed1c24", "#ff7f27", "#f6aa09", "#f9dd3b", "#fffabc",
  "#0eb968", "#13e67b", "#87ff5e", "#0c816e", "#10aea6", "#13e1be", "#28509e", "#4093e4", "#60f7f2", "#6b50f6", "#99b1fb",
  "#780c99", "#aa38b9", "#e09ff9", "#cb007a", "#ec1f80", "#f38da9", "#684634", "#95682a", "#f8b277"
];

export const freeBasicPaletteHex = [
  "#000000", "#ffffff",
  "#ed1c24", "#ff7f27", "#f9dd3b",
  "#0eb968", "#13e1be", "#4093e4", "#6b50f6",
  "#780c99", "#ec1f80", "#f38da9",
  "#684634", "#95682a", "#f8b277"
];

export const paidPalleteHex = [
  "#000000", "#3c3c3c", "#787878", "#aaaaaa", "#d2d2d2", "#ffffff",
  "#600018", "#a50e1e", "#ed1c24", "#fa8072", "#e45c1a", "#ff7f27",
  "#f6aa09", "#f9dd3b", "#fffabc", "#9c8431", "#c5ad31", "#e8d45f",
  "#4a6b3a", "#5a944a", "#84c573", "#0eb968", "#13e67b", "#87ff5e",
  "#0c816e", "#10aea6", "#13e1be", "#0f799f", "#60f7f2", "#bbfaf2",
  "#28509e", "#4093e4", "#7dc7ff", "#4d31b8", "#6b50f6", "#99b1fb",
  "#4a4284", "#7a71c4", "#b5aef1", "#780c99", "#aa38b9", "#e09ff9",
  "#cb007a", "#ec1f80", "#f38da9", "#9b5249", "#d18078", "#fab6a4",
  "#684634", "#95682a", "#dba463", "#7b6352", "#9c846b", "#d6b594",
  "#d18051", "#f8b277", "#ffc5a5", "#6d643f", "#948c6b", "#cdc59e",
  "#333941", "#6d758d", "#b3b9d1"
];

export const palettesRGB = {
  free: hexArrayToRgb(freePaletteHex),
  freeBasic: hexArrayToRgb(freeBasicPaletteHex),
  paid: hexArrayToRgb(paidPalleteHex)
};

export function hexArrayToRgb(hexArray) {
  return hexArray.map(hexToRgb);
}


export function hexToRgb(hex) { 
  hex = hex.replace("#", ""); 
  return [
    parseInt(hex.substring(0, 2), 16), 
    parseInt(hex.substring(2, 4), 16), 
    parseInt(hex.substring(4, 6), 16)]; 
}

export let activePalette = palettesRGB.free;

export function setPalette(name) {
  if (palettesRGB[name]) {
    activePalette = palettesRGB[name];
  } else {
    console.warn(`Paleta "${name}" no existe. Usando default.`);
    activePalette = palettesRGB.free;
  }
}

export function nearestColorIndex(r, g, b) {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < activePalette.length; i++) {
    const [pr, pg, pb] = activePalette[i];
    const dr = r - pr;
    const dg = g - pg;
    const db = b - pb;
    const dist = dr * dr + dg * dg + db * db;
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return best;
}

export function processImageCanvas(img, canvas, size) {
  let maxSize = size;
  let { width, height } = img;

  if (width > maxSize || height > maxSize) {
    const scale = Math.min(maxSize / width, maxSize / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0, width, height);

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const idx = nearestColorIndex(data[i], data[i + 1], data[i + 2]);
    const [nr, ng, nb] = activePalette[idx]; // <-- usar la paleta activa
    data[i] = nr;
    data[i + 1] = ng;
    data[i + 2] = nb;
  }

  ctx.putImageData(imgData, 0, 0);
}

