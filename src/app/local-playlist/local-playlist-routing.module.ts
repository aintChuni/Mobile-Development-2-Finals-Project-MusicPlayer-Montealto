import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocalPlaylistPage } from './local-playlist.page';

const routes: Routes = [
  {
    path: '',
    component: LocalPlaylistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocalPlaylistPageRoutingModule {}
