import { Component, OnInit, OnDestroy } from '@angular/core';
import { AudioService } from 'services/audio.service';
import { StorageService } from 'services/storage.service';
import { SpotifyService } from 'services/spotify.service';
import { Song } from 'models/song.model';
import { Playlist } from 'models/playlist.model';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PlaylistModalComponent } from '../components/modal/playlist-modal.component';
import { LocalPlayerPage } from '../local-player/local-player.page';
import { FullscreenPlayerPage } from '../fullscreen-player/fullscreen-player.page';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, FormsModule, PlaylistModalComponent]
})
export class Tab1Page implements OnInit, OnDestroy {
  songs: Song[] = [];
  currentSong: Song | null = null;
  progress = 0;
  isPlaying = false;

  playlists: Playlist[] = [];
  selectedSong: Song | null = null;
  selectedPlaylist: Playlist | null = null;
  showPlaylistModal = false;

  searchQuery: string = '';
  private progressInterval: any;

  // Subscriptions for BehaviorSubjects
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private audioService: AudioService,
    private storageService: StorageService,
    private spotifyService: SpotifyService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    try {
      await this.spotifyService.initialize();

      const token = await this.spotifyService.getValidAccessToken();
      if (!token) {
        const callbackHandled = await this.spotifyService['storage'].get('callback_handled');
        if (!callbackHandled) return;
        this.router.navigate(['/login']);
        return;
      }

      await this.loadPlaylists();
      this.searchQuery = 'Top Hits';
      await this.onSearchChanged();

      this.subscriptions.push(
        this.spotifyService.currentSong$.subscribe(song => {
          this.currentSong = song;
        }),
        this.spotifyService.isPlaying$.subscribe(isPlaying => {
          this.isPlaying = isPlaying;
          if (isPlaying) {
            this.startProgressTracking();
          } else {
            this.stopProgressTracking();
          }
        })
      );

    } catch (error) {
      console.error('Error during initialization:', error);
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.stopProgressTracking();
  }

  async onSearchChanged() {
    if (!this.searchQuery.trim()) return;

    try {
      const data = await this.spotifyService.searchTrack(this.searchQuery);

      if (!data?.tracks?.items) {
        console.warn('No tracks found');
        this.songs = [];
        return;
      }

      this.songs = data.tracks.items.slice(0, 50).map((item: any) => ({
        title: item.name,
        artist: item.artists.map((a: any) => a.name).join(', '),
        url: item.uri,
        cover: item.album.images[0]?.url || '',
        path: ''
      }));
    } catch (err) {
      console.error('Error searching tracks:', err);
    }
  }

  async playSong(song: Song) {
    if (!song.url) return;

    try {
      await this.spotifyService.playTrack(song.url);
      this.spotifyService.currentSong$.next(song);
      this.spotifyService.isPlaying$.next(true);
    } catch (err) {
      console.error('Playback failed:', err);
      this.spotifyService.isPlaying$.next(false);
    }
  }

  async togglePlayPause() {
    if (this.isPlaying) {
      await this.spotifyService.pausePlayback();
      this.spotifyService.isPlaying$.next(false);
    } else {
      const deviceId = await this.spotifyService.getActiveDeviceId();
      if (!deviceId) {
        console.warn('No active device. Cannot resume playback.');
        return;
      }
      await this.spotifyService.resumePlayback();
      this.spotifyService.isPlaying$.next(true);
    }
  }

  async seekTo(event: any) {
    const durationMs = await this.spotifyService.getPlaybackDuration();
    const positionMs = (event.detail.value / 100) * durationMs;
    this.spotifyService.seekPlayback(positionMs);
  }

  startProgressTracking() {
    this.stopProgressTracking();
    this.progressInterval = setInterval(async () => {
      const position = await this.spotifyService.getPlaybackPosition();
      const duration = await this.spotifyService.getPlaybackDuration();
      if (duration > 0) {
        this.progress = (position / duration) * 100;
      }
    }, 500);
  }

  stopProgressTracking() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  async openFullScreen(song: Song) {
    const modal = await this.modalCtrl.create({
      component: FullscreenPlayerPage,
      componentProps: { song }
    });
    await modal.present();
  }

  async openPlaylistSelect(song: Song) {
    const modal = await this.modalCtrl.create({
      component: PlaylistModalComponent,
      componentProps: {
        playlists: this.playlists
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      this.selectedPlaylist = data;
      this.selectedSong = song;
      this.saveToPlaylist();
    }
  }

  closePlaylistModal() {
    this.showPlaylistModal = false;
    this.selectedSong = null;
  }

  async loadPlaylists() {
    try {
      const playlistData = await this.spotifyService.getUserPlaylists();
      this.playlists = playlistData.items;
    } catch (err) {
      console.error('Error loading Spotify playlists:', err);
    }
  }

  selectPlaylist(playlist: Playlist) {
    this.selectedPlaylist = playlist;
  }

  async saveToPlaylist() {
    if (this.selectedPlaylist && this.selectedSong && this.selectedPlaylist.id) {
      try {
        await this.spotifyService.addTrackToPlaylist(
          this.selectedPlaylist.id,
          this.selectedSong.url
        );
        this.closePlaylistModal();
        this.showToast(`Added to ${this.selectedPlaylist.name}`);
      } catch (error) {
        console.error('Error saving to Spotify playlist:', error);
      }
    } else {
      console.warn('Selected playlist does not have a valid ID.');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
  }

  togglePlaylistSelection(playlist: Playlist) {
    if (this.selectedPlaylist?.name === playlist.name) {
      this.selectedPlaylist = null;
    } else {
      this.selectedPlaylist = playlist;
    }
  }

  toggleSong(song: Song) {
    if (this.isCurrentSong(song)) {
      this.togglePlayPause();
    } else {
      this.playSong(song);
    }
  }

  isCurrentSong(song: Song): boolean {
    return this.currentSong?.url === song.url;
  }

  async openLocalPlayer() {
    const modal = await this.modalCtrl.create({
      component: LocalPlayerPage,
    });
    return await modal.present();
  }

  async handleRefresh(event: any) {
    console.log('Pull-to-refresh triggered');
    try {
      await this.loadPlaylists();
      await this.onSearchChanged(); 
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      event.target.complete();
    }
  }
}
