import type { Track } from "@/types/music";

export interface TrackService {
  getAll(): Track[];
  getById(id: string): Track | undefined;
  search(query: string): Track[];
}

export class StaticTrackService implements TrackService {
  constructor(private readonly tracks: Track[]) {}

  getAll(): Track[] {
    return this.tracks;
  }

  getById(id: string): Track | undefined {
    return this.tracks.find((track) => track.id === id);
  }

  search(query: string): Track[] {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return this.tracks;
    }

    return this.tracks.filter((track) =>
      `${track.title} ${track.artist} ${track.album}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }
}
