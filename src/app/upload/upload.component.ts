import { Component, OnInit } from '@angular/core';
import { UploadService } from '../upload.service';
import { map, expand } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import * as tus from 'tus-js-client';
import { EmbedVideoService } from 'ngx-embed-video';

@Component({
  selector: 'app-upload',
  template: `<div style="text-align:center">
  <input type="file" #file name="video" id="video" accept="video/*" multiple>
  <input type="button" value="Upload" (click)="start(file.files);"> </div>
  <br>
  <h1>Liste des videos</h1>
  <div *ngFor="let videos of links" [innerHtml]="videos">
  </div>
  `,
})
export class UploadComponent implements OnInit {
  title = 'vimeo-uploader';
  videoList: FileList;
  videoLinks = [];
  iframe_html: any;
  pendingFiles: uploadFiles[] = [];
  links: any[];
  constructor(private upload: UploadService, private embedService: EmbedVideoService) {
  }

  ngOnInit() {
    this.upload.getVideos().subscribe((v: any) => {
      this.links = v.data.filter(v => v.status === 'available').map(element => this.embedService.embed(element.link));
    });
  }
  public start(files: FileList) {
    this.videoList = files;
    const recursion = this.getLink(this.videoList[0], 0, this.videoList).pipe(expand(res => {
      return res.index > res.arr.length - 1 ?
        EMPTY : this.getLink(this.videoList[res.index], res.index, this.videoList);
    }));
    recursion.subscribe(x => {
      if (x.index > x.arr.length - 1) {
        console.log('Link generated, Starting upload');
        // All links have been generated now you can start the upload
      }
    });
  }

  getLink = (video: File, index, arr) => {
    return this.upload.createVideo(video).pipe(map(response => {
      const videoFile = new uploadFiles(video, response.body.link, response.body.upload.upload_link);
      this.pendingFiles.push(videoFile);
      return { data: response, index: index + 1, arr: arr };
    })
    );
  }

  videoUpload() {
    const success = () => { console.log('after video upload section') };
    const upload: Array<any> = [];
    for (let i = 0; i < this.pendingFiles.length; i++) {
      upload.push(this.tusUpload(this.pendingFiles[i], i, this.pendingFiles, upload, success));
    }
    upload[0].start();
  }

  tusUpload(file: uploadFiles, i: number, videoArray: uploadFiles[], uploadArray: tus.Upload[], success: any, ): tus.Upload {
    const upload = new tus.Upload(file.video, {
      uploadUrl: file.uploadURI, endpoint: file.uploadURI, retryDelays: [0, 1000, 3000, 5000],
      onError: error => { console.log('Failed: ' + file.video.name + error) },
      onProgress: (bytesUploaded, bytesTotal) => {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        console.log(
          'file: ' + i + ' of ' + (videoArray.length - 1) + ':',
          bytesUploaded,
          bytesTotal,
          percentage + '%'
        );
      },
      onSuccess: () => {
        console.log('Download' + file.video.name + 'from' + upload.url);
        if (i < videoArray.length - 1) {
          uploadArray[i + 1].start();
        } else {
          success();
          console.log('Videos uploaded successfully');
        }
      }
    });
    return upload;
  }

}



export class uploadFiles {
  constructor(public video: File, public path: string, public uploadURI: string) {
    this.video = video;
    this.path = path;
    this.uploadURI = uploadURI;
  }
}