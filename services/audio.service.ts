import { Injectable } from '@angular/core';
import { Song } from 'models/song.model';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio: HTMLAudioElement | null = null;
  public isPlaying = false;
  public currentTrack = '';
  public currentTrackInfo: Song | null = null;

  constructor() {}

  async play(url: string, song?: Song): Promise<void> {
    this.stop();

    this.audio = new Audio(url);
    this.audio.onended = () => this.stop();
    this.audio.onerror = (e) => console.error('Audio error:', e);

    try {
      await this.audio.play();
      this.isPlaying = true;
      this.currentTrack = url;
      this.currentTrackInfo = song || null;
    } catch (err) {
      console.error('HTML5 Audio play error:', err);
    }
  }

  pause(): void {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  resume(): void {
    if (this.audio && !this.isPlaying) {
      this.audio.play();
      this.isPlaying = true;
    }
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio.load();
      this.audio = null;
    }
    this.isPlaying = false;
    this.currentTrack = '';
    this.currentTrackInfo = null;
  }
}
