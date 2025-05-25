export interface Song {
  title: string;
  artist: string;
  artists?: { name: string }[]; 
  url: string;
  cover: string | null;
  name?: string;
  path?: string;
}