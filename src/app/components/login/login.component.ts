import { Component } from '@angular/core';
import { SpotifyService } from 'services/spotify.service';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [IonicModule],
  template: `
    <div class="login-container">
      <ion-button (click)="login()">Login with Spotify</ion-button>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private spotifyService: SpotifyService) {}

  login() {
    this.spotifyService.loginWithSpotify();
  }
}
