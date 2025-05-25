import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Playlist } from 'models/playlist.model';
import { Song } from 'models/song.model';

@Injectable({ providedIn: 'root' })
export class StorageService {
  constructor(private storage: Storage) {
    this.storage.create();
  }

async savePlaylist(name: string, tracks: Song[]) {
  if (!Array.isArray(tracks)) return;
  await this.storage.set(name, tracks);
}

  async getPlaylist(name: string): Promise<Song[]> {
    return await this.storage.get(name);
  }

  async getAllPlaylists(): Promise<Playlist[]> {
    const keys = await this.storage.keys();
    const playlists: Playlist[] = [];
    for (const key of keys) {
      const songs = await this.storage.get(key);
      playlists.push({ name: key, songs });
    }
    return playlists;
  }

  async addToPlaylist(name: string, song: Song) {
  const playlist = (await this.getPlaylist(name)) || [];

  const isDuplicate = playlist.some(
    (s) => s.title === song.title && s.artist === song.artist
  );
  if (!isDuplicate) {
    playlist.push(song);
    await this.savePlaylist(name, playlist);
  }
}

  async setPreference(key: string, value: any) {
    await this.storage.set(key, value);
  }

  async getPreference(key: string) {
    return await this.storage.get(key);
  }

  async deletePlaylist(name: string) {
  await this.storage.remove(name);
}
}
