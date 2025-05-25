import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from 'services/spotify.service';

@Component({
  selector: 'app-callback',
  template: '<p>Processing Spotify login...</p>',
})
export class CallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spotifyService: SpotifyService
  ) {}

  async ngOnInit() {
    console.log('[Callback] Reached Spotify callback handler');

    const code = this.route.snapshot.queryParamMap.get('code');
    const error = this.route.snapshot.queryParamMap.get('error');

    if (error) {
      console.error('Spotify login error:', error);
      this.router.navigate(['/login']);
      return;
    }

    if (!code) {
      console.error('No authorization code found in URL');
      this.router.navigate(['/login']);
      return;
    }

    try {
      await this.spotifyService.handleAuthCallback(code);
      console.log('[Callback] Auth callback successful, redirecting...');
      this.router.navigate(['/tabs/tab1']);
    } catch (err) {
      console.error('[Callback] Error during token exchange:', err);
      this.router.navigate(['/login']);
    }
  }
}
