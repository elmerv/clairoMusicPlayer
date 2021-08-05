import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MusicUploaderPageRoutingModule } from './music-uploader-routing.module';
import { FileSizePipe } from '../file-size.pipe';

import { MusicUploaderPage } from './music-uploader.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MusicUploaderPageRoutingModule
  ],
  declarations: [MusicUploaderPage, FileSizePipe]
})
export class MusicUploaderPageModule {}
