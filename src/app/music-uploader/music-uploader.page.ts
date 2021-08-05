import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

export interface FILE {
  name: string;
  filepath: string;
  size: number;
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


  FileName: string;
  FileSize: number;

  isSongUploading: boolean;
  isSongUploaded: boolean;
  private ngFirestoreCollection: AngularFirestoreCollection<FILE>;

  constructor(private angularFirestore: AngularFirestore,private angularFireStorage: AngularFireStorage) {
    this.isSongUploaded = false; 
    this.isSongUploading = false;
    this.ngFirestoreCollection = angularFirestore.collection<FILE>('filesCollection');
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
            name: file.name,
            filepath: resp,
            size: this.FileSize
          });
          this.isSongUploading = false;
          this.isSongUploaded = true;
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
  ngOnInit() {
  }

}
