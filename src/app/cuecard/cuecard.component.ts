import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CuecardService } from './cuecard.service';


@Component({
  selector: 'app-cuecard',
  templateUrl: './cuecard.component.html',
  styleUrls: ['./cuecard.component.scss']
})
export class CuecardComponent implements OnInit {

  content: String;

  audioContext;
  audioBuffer;
  audioSource;
  playbackRate = 1.0;
  playDisabled = true;
  stopDisabled = true;
  
  constructor(private route: ActivatedRoute, private service: CuecardService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let uuid = params.get('uuid');

      if (uuid) {
        this.service.getCuecard(uuid).subscribe(content => {
          document.getElementById('cuecard').innerHTML = content.toString();

          let node = document.querySelector("#cuecard meta[name='x:audio-file']");
          

          let fileName = node.getAttribute('content');
          this.service.getAudioFile(fileName).subscribe(file => this.load(file));
        });
      }
    });
  
  }

  load(audioFile: Blob) {
    let self = this;
    let reader = new FileReader();
    reader.onload = (event: any) => {
      console.debug('File load complete')
      let arrayBufffer = event.target.result;
      let audioContext: any = (<any>window).AudioContext || (<any>window).webkitAudioContext;
      let ctx = new audioContext();

      let bufferSource = ctx.createBufferSource();
      

      ctx.decodeAudioData(arrayBufffer).then((audioBuffer) => {
        console.debug('Decoded');
        //console.log(audioBuffer);
        bufferSource.buffer = audioBuffer;
        //console.log(bufferSource);
        bufferSource.connect(ctx.destination);
        self.audioContext = ctx;
        self.audioSource = bufferSource;
        self.audioBuffer = audioBuffer;
        self.playDisabled = false;
        //console.log(ctx);
      });
    };
    reader.readAsArrayBuffer(audioFile);
  }

  play() {
    if (this.audioSource) {
      this.audioSource.start();
      this.playDisabled = true;
      this.stopDisabled = false;
    }
  }

  stop() {
    if (this.audioSource) {
      this.audioSource.stop();

      this.audioSource = this.audioContext.createBufferSource();
      this.audioSource.buffer = this.audioBuffer;
      this.audioSource.connect(this.audioContext.destination);
      this.playDisabled = false;
      this.stopDisabled = true;
    }
  }

  rateChange(e: any) {
    console.log(e);
    console.log(this.playbackRate);
    this.audioSource.playbackRate.value = this.playbackRate;
  }
}
