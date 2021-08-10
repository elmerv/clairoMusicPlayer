import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import {Router} from '@angular/router';
import { ToastController } from '@ionic/angular';

export interface FILE {
  title: string;
  description: string; 
  name: string;
  filepath: string;
  size: number;
  isPlaying: boolean;
  progress: number;
}

@Component({
  selector: 'app-music-uploader',
  templateUrl: './music-uploader.page.html',
  styleUrls: ['./music-uploader.page.scss'],
})
export class MusicUploaderPage implements OnInit {
  ngFireUploadTask: AngularFireUploadTask;

  fileUploadedPath: Observable<string>;

  files: Observable<FILE[]>;


  progressNum: Observable<number>;

  progressSnapshot: Observable<any>;

  audioTitle; 
  audioDescription; 
  FileName: string;
  FileSize: number;

  isSongUploading: boolean;
  isSongUploaded: boolean;
  private ngFirestoreCollection: AngularFirestoreCollection<FILE>;

  constructor(private angularFirestore: AngularFirestore,private angularFireStorage: AngularFireStorage, private router: Router, public toastController: ToastController) {
    this.isSongUploaded = false; 
    this.isSongUploading = false;
    this.ngFirestoreCollection = angularFirestore.collection<FILE>('profileCollection');
    this.files = this.ngFirestoreCollection.valueChanges();
  }

  fileUpload(event: FileList){
    const file = event.item(0);

    this.isSongUploaded = false;
    this.isSongUploading = true; 
    
    this.FileName = file.name;
    const fileStoragePath = `audios/${new Date().getTime()}_${file.name}`;
    const audioRef = this.angularFireStorage.ref(fileStoragePath);
    this.ngFireUploadTask = this.angularFireStorage.upload(fileStoragePath, file);
    this.progressNum = this.ngFireUploadTask.percentageChanges();
    this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(
      
      finalize(() => {
        this.fileUploadedPath = audioRef.getDownloadURL();
        
        this.fileUploadedPath.subscribe(resp=>{
          this.fileStorage({
            title: this.audioTitle, 
            description: this.audioDescription,
            name: file.name,
            filepath: resp,
            size: this.FileSize, 
            isPlaying: false,
            progress: 0,
          });
          this.isSongUploading = false;
          this.isSongUploaded = true;
          this.handleButtonClick();
          this.router.navigateByUrl('/home');

        },error => {
          console.log(error);
        })
      }),
      tap(snap => {
          this.FileSize = snap.totalBytes;

      })
    )

  }
  fileStorage(audio: FILE) {
    const audioId = this.angularFirestore.createId();
    
    this.ngFirestoreCollection.doc(audioId).set(audio).then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
    });
  }  

  async handleButtonClick() {
    const toast = await this.toastController.create({
      color: 'dark',
      duration: 2000,
      message: 'You audio has been uploaded 😎',
    });

    await toast.present();
  }
  ngOnInit() {
  }

}
