import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Song } from 'models/song.model';
import { AudioService } from 'services/audio.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-local-playlist',
  templateUrl: './local-playlist.page.html',
  styleUrls: ['./local-playlist.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
})
export class LocalPlaylistPage {
  playlist: Song[] = [];
  currentlyPlaying: Song | null = null;
  isPlaying = false;

  constructor(private storage: Storage, private audioService: AudioService) {
    this.storage.create().then(() => this.loadPlaylist());
  }

  async loadPlaylist() {
    this.playlist = (await this.storage.get('localPlaylist')) || [];
  }

  async playOrPause(song: Song) {
    if (this.currentlyPlaying?.url === song.url) {
      if (this.isPlaying) {
        this.audioService.pause();
        this.isPlaying = false;
      } else {
        this.audioService.resume();
        this.isPlaying = true;
      }
    } else {
      if (this.audioService.isPlaying) {
        this.audioService.stop();
      }

      this.currentlyPlaying = song;
      await this.audioService.play(song.url, song);
      this.isPlaying = true;
    }
  }

  async removeFromPlaylist(index: number) {
    this.playlist.splice(index, 1);
    await this.storage.set('localPlaylist', this.playlist);
  }

  async clearPlaylist() {
    this.playlist = [];
    await this.storage.remove('localPlaylist');
    this.audioService.stop();
    this.currentlyPlaying = null;
    this.isPlaying = false;
  }

  async doRefresh(event: any) {
    try {
      await this.loadPlaylist();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      event.target.complete();
    }
  }
}
