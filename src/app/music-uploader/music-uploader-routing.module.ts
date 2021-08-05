import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MusicUploaderPage } from './music-uploader.page';

const routes: Routes = [
  {
    path: '',
    component: MusicUploaderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MusicUploaderPageRoutingModule {}
