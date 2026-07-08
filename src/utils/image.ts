export function getImageSrc(image: string | { src: string } | undefined | null, fallback: string): string {
  return image
    ? typeof image === "string"
      ? image
      : image.src
    : fallback
}
