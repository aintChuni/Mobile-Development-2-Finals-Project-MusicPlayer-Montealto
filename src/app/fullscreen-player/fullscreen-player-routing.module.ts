import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullscreenPlayerPage } from './fullscreen-player.page';

const routes: Routes = [
  {
    path: '',
    component: FullscreenPlayerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FullscreenPlayerPageRoutingModule {}
