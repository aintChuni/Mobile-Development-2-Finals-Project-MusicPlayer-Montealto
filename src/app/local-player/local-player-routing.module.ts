import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocalPlayerPage } from './local-player.page';

const routes: Routes = [
  {
    path: '',
    component: LocalPlayerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocalPlayerPageRoutingModule {}
