import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'services/spotify.service';
import { AlertController, ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Song } from 'models/song.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  playlists: any[] = [];
  userId: string = '';
  currentlyPlayingTrack: Song | null = null;
  isPlaying = false;

  constructor(
    private spotifyService: SpotifyService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.loadPlaylists();

    this.spotifyService.currentSong$.subscribe(song => {
      this.currentlyPlayingTrack = song;
    });

    this.spotifyService.isPlaying$.subscribe(state => {
      this.isPlaying = state;
    });
  }

  private async loadPlaylists(): Promise<void> {
    try {
      await this.spotifyService.initialize();
      const userProfile = await this.spotifyService.getUserProfile();
      this.userId = userProfile.id;

      const playlistData = await this.spotifyService.getUserPlaylists();
      this.playlists = playlistData.items.map((p: any) => ({ ...p, expanded: false }));
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  }

  togglePlaylistExpanded(playlist: any) {
    playlist.expanded = !playlist.expanded;
    if (playlist.expanded && !playlist.tracksData) {
      this.loadTracksForPlaylist(playlist);
    }
  }

  async loadTracksForPlaylist(playlist: any) {
    try {
      const token = await this.spotifyService.getValidAccessToken();
      const res = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      playlist.tracksData = data.items.map((item: any) => item.track);
    } catch (err) {
      console.error('Error loading tracks:', err);
    }
  }

  async playTrack(track: any) {
  if (!track.uri) return;

  const newSongUri = track.uri;
  const currentUri = await this.spotifyService.getCurrentTrackUri();
  const isPlaying = await this.spotifyService.isPlaying();

  if (isPlaying && currentUri && currentUri !== newSongUri) {
    await this.spotifyService.pausePlayback();
  }

  const songData = {
    title: track.name,
    artist: track.artists?.[0]?.name || 'Unknown Artist',
    cover: track.album?.images?.[0]?.url || '',
    url: newSongUri,
  };

  try {
    await this.spotifyService.playTrack(newSongUri);
    this.currentlyPlayingTrack = songData;
    this.isPlaying = true;
  } catch (err) {
    console.error('Playback failed:', err);
    this.showToast('Failed to play track');
  }
}

  async pausePlayback() {
    try {
      await this.spotifyService.pausePlayback();
      this.isPlaying = false;
    } catch (err) {
      console.error('Pause failed:', err);
    }
  }

  async stopPlayback() {
    try {
      await this.spotifyService.pausePlayback();
      this.isPlaying = false;
      this.currentlyPlayingTrack = null;
      this.showToast('Playback stopped');
    } catch (err) {
      console.error('Stop failed:', err);
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500,
      position: 'bottom',
    });
    toast.present();
  }

  async createPlaylistPrompt() {
    const alert = await this.alertCtrl.create({
      header: 'Create New Playlist',
      inputs: [{ name: 'playlistName', type: 'text', placeholder: 'Playlist name' }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Create',
          handler: async (data) => {
            if (data.playlistName && this.userId) {
              try {
                const newPlaylist = await this.spotifyService.createPlaylist(this.userId, data.playlistName);
                this.playlists.unshift({ ...newPlaylist, expanded: false });
              } catch (err) {
                console.error('Error creating playlist:', err);
              }
            }
          },
        },
      ],
    });

    await alert.present();
  }

  deletePlaylistAndStop(event: Event, playlistId: string) {
    event.stopPropagation();
    this.deletePlaylist(playlistId);
  }

  async deletePlaylist(playlistId: string) {
    const token = await this.spotifyService.getValidAccessToken();
    if (!playlistId || !token) return;

    try {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 204) {
        this.playlists = this.playlists.filter((p) => p.id !== playlistId);
      } else {
        console.error('Failed to delete playlist', response);
      }
    } catch (err) {
      console.error('Error deleting playlist', err);
    }
  }

  async removeTrack(event: Event, playlist: any, track: any) {
  event.stopPropagation();

  try {
    await this.spotifyService.removeTrackFromPlaylist(playlist.id, track.uri);
    playlist.tracksData = playlist.tracksData.filter((t: any) => t.uri !== track.uri);
    this.showToast(`Removed "${track.name}" from "${playlist.name}"`);
  } catch (err) {
    console.error('Error removing track:', err);
    this.showToast('Failed to remove track');
  }
}

  async doRefresh(event: any) {
    try {
      await this.loadPlaylists();
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      event.target.complete();
    }
  }
}
