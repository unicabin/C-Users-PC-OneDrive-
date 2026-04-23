export function chunkText(text: string, size = 500): string[] {
  const chunks: string[] = [];
  const normalizedText = text.replace(/\s+/g, " ").trim();

  for (let i = 0; i < normalizedText.length; i += size) {
    const chunk = normalizedText.slice(i, i + size).trim();

    if (chunk) {
      chunks.push(chunk);
    }
  }

  console.log("[chunk] text split", {
    textLength: normalizedText.length,
    chunkCount: chunks.length,
    size,
  });

  return chunks;
}
