export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  url: string;
  lyrics?: string;
  /** Seconds; optional when loaded from audio metadata only */
  duration?: number;
}
