import { Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { SpotifyService } from 'services/spotify.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private static urlListenerAdded = false;

  constructor(private spotifyService: SpotifyService, private platform: Platform) {}

  async ngOnInit() {
    await this.platform.ready();

    const prefersDark = localStorage.getItem('theme');
    if (prefersDark === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    await StatusBar.setOverlaysWebView({ overlay: false });
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#2034b3' });

    if (!AppComponent.urlListenerAdded) {
      App.addListener('appUrlOpen', async ({ url }) => {
        console.log('[DeepLink] URL:', url);
        if (url.startsWith('myapp://callback')) {
          const codeMatch = url.match(/[?&]code=([^&]+)/);
          if (codeMatch) {
            const code = codeMatch[1];
            console.log('[DeepLink] Found auth code:', code);
            await this.spotifyService.initialize();
            await this.spotifyService.handleAuthCallback(code);
          }
        }
      });

      AppComponent.urlListenerAdded = true;
    }

    await this.spotifyService.initialize();
  }
}
