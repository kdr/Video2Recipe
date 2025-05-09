export function getYoutubeVideoId(url: string): string | null {
  // Handle youtu.be URLs
  const youtubeShortRegex = /youtu\.be\/([a-zA-Z0-9_-]{11})/;
  const shortMatch = url.match(youtubeShortRegex);
  if (shortMatch) return shortMatch[1];

  // Handle youtube.com/shorts URLs
  const shortsRegex = /\/shorts\/([a-zA-Z0-9_-]{11})/;
  const shortsMatch = url.match(shortsRegex);
  if (shortsMatch) return shortsMatch[1];

  // Handle standard youtube.com URLs
  const standardRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const standardMatch = url.match(standardRegex);
  return standardMatch ? standardMatch[1] : null;
}

export function getYoutubeThumbnailUrl(videoId: string, quality: 'default' | 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault' = 'maxresdefault'): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
} 