import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocalPlaylistPageRoutingModule } from './local-playlist-routing.module';

import { LocalPlaylistPage } from './local-playlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocalPlaylistPageRoutingModule,
    LocalPlaylistPage
  ]
})
export class LocalPlaylistPageModule {}
