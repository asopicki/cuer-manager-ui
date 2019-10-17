import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CuecardService } from './cuecard.service';

import {PitchShifter} from 'soundtouchjs';

const CUE_CHAR = "c";
const PLAY_CHAR = "p";
const STOP_CHAR = "s";
const RECORD_CHAR = "r";
const LOAD_CHAR = "l";

@Component({
  selector: 'app-cuecard',
  templateUrl: './cuecard.component.html',
  styleUrls: ['./cuecard.component.scss']
})
export class CuecardComponent implements OnInit {

  content: String;
  uuid: String;

  audioContext;
  audioBuffer;
  audioSource;
  playbackRate = 1.0;
  playDisabled = true;
  stopDisabled = true;
  shifter;
  analyser;
  dataArray;
  canvas;
  canvasContext;
  startPos = 0;
  stride = 32768;
  startTime = 0;

  recordCues = false;
  marks: String[] = [];
  karaokeMarks = [];

  currentP: HTMLElement;
  currentElement = 0;
  currentIndex = 0;
  fileName;
  
  constructor(private route: ActivatedRoute, private service: CuecardService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.uuid = params.get('uuid');

      if (this.uuid) {
        this.service.getCuecard(this.uuid).subscribe(content => {
          document.getElementById('cuecard').innerHTML = content.toString();

          let node = document.querySelector("#cuecard meta[name='x:audio-file']");

          this.fileName = node.getAttribute('content');
        });
      }
    });
  
    document.addEventListener('keyup', this.keyup.bind(this));
  }

  load(audioFile: Blob) {
    let self = this;
    let reader = new FileReader();
    reader.onload = (event: any) => {
      console.debug('File load complete')
      let arrayBufffer = event.target.result;
      let audioContext: any = (<any>window).AudioContext || (<any>window).webkitAudioContext;
      let ctx = new audioContext({"latencyHint": "interactive"});

      let bufferSource = ctx.createBufferSource();
      

      ctx.decodeAudioData(arrayBufffer).then((audioBuffer) => {
        console.debug('Decoded');
        bufferSource.buffer = audioBuffer;
        self.audioContext = ctx;
        self.audioSource = bufferSource;
        self.audioBuffer = audioBuffer;
        self.playDisabled = false;
        self.analyser = ctx.createAnalyser();
        self.analyser.fftSize = 2048;
        self.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        self.analyser.connect(ctx.destination);
      });
    };
    reader.readAsArrayBuffer(audioFile);
  }

  playRateChange(e: Event) {
    let elem = <HTMLInputElement>e.target;
    this.playbackRate = Number.parseFloat(elem.value);
  }

  resetRate() {
    this.playbackRate = 1.0;
  }

  play() {
    if (this.audioSource) {
      this.shifter = new PitchShifter(this.audioContext, this.audioBuffer, 1024);
      this.shifter.tempo = this.playbackRate;
      this.shifter.pitch = 1.0;
      this.shifter.connect(this.analyser);
      this.playDisabled = true;
      this.stopDisabled = false;
      this.startTime = this.audioContext.currentTime;
      this.audioSource.addEventListener('ended', () => {
        console.log('end of audio');
        this.stop();
      });

      if (this.recordCues) {
        this.marks = [];
        document.getElementById('cuecard').focus();
      } else {
        this.karaokeMarks = this.marks.slice();
        this.karaoke();
      }
    }
  }

  stop() {
    if (this.audioSource) {
      this.audioSource = null;
      this.shifter.disconnect();
      this.shifter = null;

      this.audioSource = this.audioContext.createBufferSource();
      this.audioSource.buffer = this.audioBuffer;

      this.playDisabled = false;
      this.stopDisabled = true;

      if (this.recordCues) {
        console.log(this.marks);
      }

      if (this.currentP) {
        let elem = document.createElement('p');
        elem.innerHTML = this.currentP.innerText;
        this.currentP.replaceWith(elem);
      }

      this.currentP = null;
      this.currentIndex = 0;
      this.currentElement = 0;
    }
  }

  save() {
    this.service.setMarks(this.uuid, this.marks).subscribe(() => console.log('marks saved'));
    return false;
  }

  incrRate() {
    this.playbackRate += 0.02;
  }

  decrRate() {
    this.playbackRate -= 0.02;
  }

  keyup(event) {
    if (this.recordCues && event.key === CUE_CHAR) {
      this.highlight();

      let markTime = this.audioContext.currentTime - this.startTime;
      this.marks.push(markTime.toFixed(3));
      event.preventDefault();
      return false;
    } else if (!this.playDisabled && event.key === PLAY_CHAR) {
      this.play();
      event.preventDefault();
      return false;
    } else if (!this.stopDisabled && event.key === STOP_CHAR) {
      this.stop();
      event.preventDefault();
      return false;
    } else if (this.stopDisabled && event.key === RECORD_CHAR) {
      this.recordCues = !this.recordCues;
      event.preventDefault();
      return false;
    } else if (event.key == LOAD_CHAR) {
      this.service.getAudioFile(this.fileName).subscribe(file => this.load(file));
    }
  } 

  karaoke() {
    if (this.stopDisabled || this.recordCues) {
      return;
    }

   if (this.karaokeMarks.length > 0) {
     let markTime = ((this.audioContext.currentTime - this.startTime) * this.playbackRate).toFixed(3);
     if (Number.parseFloat(markTime) > Number.parseFloat(this.karaokeMarks[0])) {
       let mark = this.karaokeMarks.shift();
       this.highlight();
     }
   }

    requestAnimationFrame(this.karaoke.bind(this));
  }

  highlight() {
    if (this.currentP) {
      //console.log(this.currentP);

      let text = this.currentP.innerText;

      let parts = text.split(';');
      //console.log(parts);

      while (true) {
        if (this.currentIndex >= parts.length) {
          this.currentP.innerHTML = parts.join(';'); //remove highlight from current line
          this.updateCurrentParagraph();
          if (!this.currentP) {
            return;
          }
          //reset state
          this.currentIndex = 0;
          text = (<HTMLElement>this.currentP).innerText;
          parts = text.split(';');
          continue;
        }
        if (parts[this.currentIndex].trim() === '') {
          this.currentIndex++;
          continue;
        }

        let cueterm = parts[this.currentIndex];

        cueterm = '<span style="color: blue;">' + cueterm + '</span>';

        parts[this.currentIndex++] = cueterm;

        let elem = document.createElement('p');
        elem.innerHTML = parts.join(';');
        this.currentP.replaceWith(elem);
        this.currentP = <HTMLElement>elem;
        this.scrollTo(elem);
        break;
      }
    } else {
      //get first paragraph of the cuecard
      this.updateCurrentParagraph();

      if (!this.currentP) {
        return;
      }
      //console.log(this.currentP);

      //hightlight first cue term if any
      let text = (<HTMLElement>this.currentP).innerText;

      let parts = text.split(';');

      if (parts.length == 0) {
        return; //return if there are no parts
      }

      let cueterm = parts[this.currentIndex++];

      cueterm = '<span style="color: blue;">' + cueterm + '</span>;';

      parts.shift();

      let elem = document.createElement('p');
      elem.innerHTML = cueterm + parts.join(';');
      this.currentP.replaceWith(elem);
      this.currentP = elem;
      this.scrollTo(elem);
    }


    
  }

  updateCurrentParagraph() {
    let nodes = document.querySelectorAll('#cuecard blockquote p');

    if (this.currentElement >= nodes.length) {
      this.currentP = null;
      return;
    }

    this.currentP = <HTMLElement>nodes.item(this.currentElement++);
  }

  scrollTo(elem: HTMLElement) {
    if ((<any>elem).scrollIntoViewIfNeeded) {
      (<any>elem).scrollIntoViewIfNeeded(true);
    } else {
      elem.scrollIntoView({"behavior": "auto", "block": "center", "inline": "center"});
    }
  }
}
