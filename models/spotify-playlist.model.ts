export interface SpotifyPlaylistTrack {
  track: {
    name: string;
    artists: { name: string }[];
    preview_url: string | null;
    album: { images: { url: string }[] };
  };
}

export interface SpotifyPlaylistTracksResponse {
  items: SpotifyPlaylistTrack[];
}
