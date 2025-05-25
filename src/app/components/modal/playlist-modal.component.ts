import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Playlist } from 'models/playlist.model';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-playlist-modal',
  templateUrl: './playlist-modal.component.html',
  standalone: true, 
  imports: [IonicModule,CommonModule],
})
export class PlaylistModalComponent {
  @Input() playlists: Playlist[] = [];
  selectedPlaylist: Playlist | null = null;

  constructor(private modalCtrl: ModalController) {}

  togglePlaylistSelection(playlist: Playlist) {
    this.selectedPlaylist = this.selectedPlaylist?.name === playlist.name ? null : playlist;
  }

  save() {
    this.modalCtrl.dismiss(this.selectedPlaylist);
  }

  close() {
    this.modalCtrl.dismiss(null);
  }
}
