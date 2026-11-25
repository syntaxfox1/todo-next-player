export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  audioUrl: string;
  year: number;
  artworkUrl?: string;
  artistImageUrl?: string;
  isPreview?: boolean;
  storeUrl?: string;
  artStart: string;
  artEnd: string;
};
