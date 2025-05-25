import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SpotifyService } from 'services/spotify.service';
import { IonicModule, ToastController, NavController, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-fullscreen-player',
  templateUrl: './fullscreen-player.page.html',
  styleUrls: ['./fullscreen-player.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
})
export class FullscreenPlayerPage implements OnDestroy {
  song!: { title: string; artist: string; cover: string; url: string };
  progress = 0;
  isPlaying = false;
  interval: any;
  currentTime: string = '0:00';
  durationTime: string = '0:00';

  lastKnownPosition: number = 0;
  lastKnownDuration: number = 0;
  lastUpdatedAt: number = 0;

  constructor(
    private router: Router,
    private spotifyService: SpotifyService,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private cdr: ChangeDetectorRef,
    private modalController: ModalController,
    private navParams: NavParams
  ) {}

  async ionViewDidEnter() {
  if (!this.song) {
    this.showToast('No track data provided.');
    this.close();
    return;
  }

  try {
    const currentTrackUri = await this.spotifyService.getCurrentTrackUri();
    const isCurrentlyPlaying = await this.spotifyService.isPlaying();

    if (currentTrackUri !== this.song.url) {
      await this.spotifyService.playTrack(this.song.url);
      this.isPlaying = true;
    } else if (!isCurrentlyPlaying) {
      await this.spotifyService.resumePlayback();
      this.isPlaying = true;
    }

    await this.updateFromSpotify();
    this.startProgressTracking();
  } catch (err) {
    console.error('Fullscreen Player Error:', err);
    this.showToast('⚠️ Spotify playback failed. Check connection and authentication.');
  }
}

  async togglePlayPause() {
    if (this.isPlaying) {
      await this.spotifyService.pausePlayback();
      this.isPlaying = false;
      this.stopProgressTracking();
    } else {
      await this.spotifyService.resumePlayback();
      this.isPlaying = true;
      this.startProgressTracking();
    }
  }

  async seekTo(event: any) {
    const durationMs = await this.spotifyService.getPlaybackDuration();
    const positionMs = (event.detail.value / 100) * durationMs;
    await this.spotifyService.seekPlayback(positionMs);

    this.lastKnownPosition = positionMs;
    this.lastUpdatedAt = Date.now();
  }

  startProgressTracking() {
    this.stopProgressTracking();

    this.updateFromSpotify();

    this.interval = setInterval(async () => {
      try {
        const now = Date.now();
        const elapsed = now - this.lastUpdatedAt;
        const position = this.lastKnownPosition + elapsed;

        if (this.lastKnownDuration > 0) {
          const progressPercent = (position / this.lastKnownDuration) * 100;
          this.progress = Math.min(progressPercent, 100);
          this.currentTime = this.formatTime(position);
          this.durationTime = this.formatTime(this.lastKnownDuration);
          this.cdr.detectChanges();
        }

        if (elapsed >= 10000) {
          await this.updateFromSpotify();
        }
      } catch (err) {
        console.error('Error during progress tracking:', err);
      }
    }, 1000);
  }

  async updateFromSpotify() {
    try {
      const position = await this.spotifyService.getPlaybackPosition();
      const duration = await this.spotifyService.getPlaybackDuration();

      if (duration > 0) {
        this.lastKnownPosition = position;
        this.lastKnownDuration = duration;
        this.lastUpdatedAt = Date.now();

        this.progress = (position / duration) * 100;
        this.currentTime = this.formatTime(position);
        this.durationTime = this.formatTime(duration);

        this.cdr.detectChanges();
      }
    } catch (err) {
      console.error('Error syncing with Spotify:', err);
    }
  }

  stopProgressTracking() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  formatTime(ms: number): string {
    if (!ms || ms < 0) return '0:00';
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500,
      position: 'bottom',
    });
    await toast.present();
  }

  close() {
    this.modalController.dismiss();
  }

  ngOnDestroy() {
    this.stopProgressTracking();
  }
}
