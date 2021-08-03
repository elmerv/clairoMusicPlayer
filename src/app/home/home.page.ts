import { Component, ViewChild, ViewChildren } from '@angular/core';
import { IonRange } from '@ionic/angular';
import { Howl } from 'howler';
import { QueryList } from '@angular/core';
import { ElementSchemaRegistry } from '@angular/compiler';
export interface Track {
  name: string;
  path: string;
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})



export class HomePage {
  @ViewChildren('range') range: QueryList<IonRange>;

  playList: Track[] = [
    {
      name: 'How Did I Ever',
      path: '../../assets/audio/howDidIEver.mp3'
    },
    {
      name: 'Sum 1 Else',
      path: '../../assets/audio/sumOneElse.mp3'
    }
  ];
  activeTrack: Track = null;
  player: Howl = null;
  isPlaying = false;
  progress = 0;
  constructor() {}
  start(track: Track){
    if(this.player){
      this.player.stop();
    }
    this.player = new Howl({
      src: [track.path],
      onplay: () => {
        this.isPlaying = true;
        this.activeTrack = track;
        this.updateProgress();
      },
      onend: () => {

      }
    });
    this.player.play();
  }
  togglePlayer(pause,track: Track){
    if(this.activeTrack == null){
      this.start(track);
    }
    else if(this.activeTrack.name !== track.name){
      this.start(track);
    }
    this.isPlaying = !pause;
    if(pause){
      this.player.pause();
    }
    else{
      this.player.play();
    }
  }

  seek(track: Track){
    if(this.activeTrack == null){
      this.start(track);
    }
    else if(this.activeTrack.name !== track.name){
      this.start(track);
    }
    const rangeElement = this.range.find(element => element.name === track.name);
    const newValue = +rangeElement.value;
    const duration = this.player.duration();
    this.player.seek(duration *(newValue/100));
  }

  updateProgress(){
    const seek = this.player.seek();
    console.log(seek);
    this.progress = (seek/this.player.duration()) * 100 || 0;
    setTimeout(() => {
      this.updateProgress();
    }, 100000);
  }
}
