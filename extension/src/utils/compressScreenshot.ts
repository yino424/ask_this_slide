const maxDimension = 1600;
const jpegQuality = 0.82;

export async function compressScreenshot(dataUrl: string): Promise<string> {
  const image = new Image();
  image.src = dataUrl;
  await image.decode();

  const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    return dataUrl;
  }

  context.drawImage(image, 0, 0, width, height);
  const compressed = canvas.toDataURL("image/jpeg", jpegQuality);

  return compressed.length < dataUrl.length ? compressed : dataUrl;
}
