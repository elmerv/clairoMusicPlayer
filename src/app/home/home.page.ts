import { Component, ViewChildren } from '@angular/core';
import { IonRange } from '@ionic/angular';
import { Howl } from 'howler';
import { QueryList } from '@angular/core';
import { Observable } from 'rxjs';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

// export interface Track {
//   name: string;
//   path: string;
//   isPlaying: boolean;
//   progress: number;
// }
export interface Track {
  title: string;
  description: string; 
  name: string;
  filepath: string;
  size: number;
  isPlaying: boolean;
  progress: number;
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})



export class HomePage {
  files: Observable<Track[]>;

  private ngFirestoreCollection: AngularFirestoreCollection<Track>;

  @ViewChildren('range') range: QueryList<IonRange>;

  activeTrack: Track = null;
  player: Howl = null;

  constructor(private angularFirestore: AngularFirestore) {
    this.ngFirestoreCollection = angularFirestore.collection<Track>('filesCollection');
    this.files = this.ngFirestoreCollection.valueChanges();
  }
  start(track: Track){
    if(this.player){
      this.player.stop();
    }
    this.player = new Howl({
      src: [track.filepath],
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
    else if(this.activeTrack.filepath != track.filepath){
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
    else if(this.activeTrack.filepath != track.filepath){
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
    console.log(this.activeTrack.name);
    console.log(track.name);
    if(track.isPlaying && this.activeTrack.filepath == track.filepath){
      setTimeout(() => {
        this.updateProgress(track);
      }, 1000);
    }
  }


}
