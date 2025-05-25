import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Filesystem, Directory, ReaddirResult, PermissionStatus } from '@capacitor/filesystem';
import { Platform, ModalController, NavController, ToastController } from '@ionic/angular';
import { AudioService } from 'services/audio.service';
import { Song } from 'models/song.model';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-local-player',
  templateUrl: './local-player.page.html',
  styleUrls: ['./local-player.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, FormsModule],
})
export class LocalPlayerPage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  playlist: Song[] = [];
  currentSong: Song | null = null;
  isPlaying = false;
  isLoading = false;

  directories = ['Music', 'Download', 'DCIM/Audio'];
  supportedExtensions = ['.mp3', '.aac', '.m4a', '.wav', '.ogg', '.flac', '.opus'];

  constructor(
    private platform: Platform,
    private audioService: AudioService,
    private modalController: ModalController,
    private navCtrl: NavController,
    private storage: Storage,
    private toastController: ToastController
  ) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
  }

  async ngOnInit(): Promise<void> {
    await this.platform.ready();
    const granted = await this.requestStoragePermission();
    if (granted) {
      this.scanDirectories();
    } else {
      alert('Storage permission is required to access music files.');
    }
  }

  async requestStoragePermission(): Promise<boolean> {
    try {
      const status: PermissionStatus = await Filesystem.requestPermissions();
      return status.publicStorage === 'granted';
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  }

  openFilePicker() {
    this.fileInput.nativeElement.click();
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files.item(i);
        if (file) {
          const url = URL.createObjectURL(file);

          const song: Song = {
            title: file.name,
            artist: 'Unknown Artist',
            url,
            path: '',
            cover: null,
          };

          this.playlist.push(song);
        }
      }
    }
  }

  async scanDirectories() {
    this.isLoading = true;
    this.playlist = [];

    for (const dir of this.directories) {
      try {
        const result: ReaddirResult = await Filesystem.readdir({
          path: dir,
          directory: Directory.ExternalStorage,
        });

        for (const fileInfo of result.files) {
          const fileName = typeof fileInfo === 'string' ? fileInfo : fileInfo.name;
          const lower = fileName.toLowerCase();

          if (this.supportedExtensions.some(ext => lower.endsWith(ext))) {
            const fullPath = `${dir}/${fileName}`;
            const fileUri = `file:///storage/emulated/0/${fullPath}`;

            const song: Song = {
              title: fileName,
              artist: 'Unknown Artist',
              url: fileUri,
              path: fullPath,
              cover: null,
            };

            this.playlist.push(song);
          }
        }
      } catch (err) {
        console.warn(`Failed to read from ${dir}:`, err);
      }
    }

    this.isLoading = false;
  }

  async playSong(song: Song) {
    this.currentSong = song;
    await this.audioService.play(song.url, song);
    this.isPlaying = true;
  }

  togglePlay() {
    if (this.audioService.isPlaying) {
      this.audioService.pause();
      this.isPlaying = false;
    } else if (this.currentSong) {
      this.audioService.resume();
      this.isPlaying = true;
    }
  }

  async addToPlaylist() {
    if (!this.currentSong) return;

    const localPlaylist: Song[] = (await this.storage.get('localPlaylist')) || [];

    const exists = localPlaylist.some(song =>
      song.title === this.currentSong!.title &&
      song.url === this.currentSong!.url
    );

    if (!exists) {
      localPlaylist.push(this.currentSong!);
      await this.storage.set('localPlaylist', localPlaylist);
      this.showToast('🎵 Song added to playlist');
    } else {
      this.showToast('⚠️ Song already in playlist');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();
  }

  dismiss() {
  this.audioService.stop();
  this.isPlaying = false; 
  this.modalController.dismiss();
}
}
