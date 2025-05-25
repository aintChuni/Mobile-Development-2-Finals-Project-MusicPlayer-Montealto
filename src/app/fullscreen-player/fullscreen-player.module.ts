import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FullscreenPlayerPageRoutingModule } from './fullscreen-player-routing.module';

import { FullscreenPlayerPage } from './fullscreen-player.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FullscreenPlayerPageRoutingModule,
    FullscreenPlayerPage
  ]

})
export class FullscreenPlayerPageModule {}
