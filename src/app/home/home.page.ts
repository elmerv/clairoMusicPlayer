import { Component, ViewChild, ViewChildren } from '@angular/core';
import { IonRange } from '@ionic/angular';
import { Howl } from 'howler';
import { QueryList } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

export interface FILE {
  name: string;
  filepath: string;
  size: number;
}


export interface Track {
  name: string;
  path: string;
  isPlaying: boolean;
  progress: number;
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})



export class HomePage {

  ngFireUploadTask: AngularFireUploadTask;

  fileUploadedPath: Observable<string>;

  files: Observable<FILE[]>;

  FileName: string;
  FileSize: number;

  isImgUploading: boolean;
  isImgUploaded: boolean;

  private ngFirestoreCollection: AngularFirestoreCollection<FILE>;

  
  @ViewChildren('range') range: QueryList<IonRange>;

  playList: Track[] = [
    {
      name: 'How Did I Ever',
      path: '../../assets/audio/howDidIEver.mp3', 
      isPlaying: false, 
      progress: 0
    },
    {
      name: 'Sum 1 Else',
      path: '../../assets/audio/sumOneElse.mp3', 
      isPlaying: false, 
      progress: 0
    }
  ];
  activeTrack: Track = null;
  player: Howl = null;

  constructor(private angularFirestore: AngularFirestore, private angularFireStorage: AngularFireStorage) {}
  start(track: Track){
    if(this.player){
      this.player.stop();
    }
    this.player = new Howl({
      src: [track.path],
      onplay: () => {
        track.isPlaying = true;
        this.activeTrack = track;
        this.updateProgress(track);
      },
      onend: () => {

      }
    });
    console.log(track);
    this.player.play();
  }
  
  togglePlayer(pause,track: Track){
    if(this.activeTrack == null){
      this.start(track);
    }
    else if(this.activeTrack.name !== track.name){
      this.start(track);
    }
    track.isPlaying = !pause;
    if(pause){
      this.player.pause();
    }
    else{
      this.player.play();
    }
  }

  seek(track: Track){
    if(!track.isPlaying){
      return 0; 
    }
    if(this.activeTrack == null){
      this.start(track);
    }
    else if(this.activeTrack.name != track.name){
      this.start(track);
    }
    const rangeElement = this.range.find(element => element.name === track.name);
    console.log(rangeElement);
    const newValue = +rangeElement.value;
    const duration = this.player.duration();
    this.player.seek(duration *(newValue/100));
  }

  updateProgress(track: Track){
    console.log(track);

    const seek = this.player.seek();
    track.progress = (seek/this.player.duration()) * 100 || 0;
    if(track.isPlaying){
      setTimeout(() => {
        this.updateProgress(track);
      }, 1000);
    }
  }


}
