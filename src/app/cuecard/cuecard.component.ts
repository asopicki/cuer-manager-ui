import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { CuecardService } from './cuecard.service';

import {PitchShifter} from 'soundtouchjs';
import { Cuecard } from '../events/cuecard';
import { MarkData } from './markdata';

const CUE_CHAR = "c";
const PLAY_CHAR = "p";
const STOP_CHAR = "s";
const RECORD_CHAR = "r";
const LOAD_CHAR = "l";


/*
TODO: Extract player component
*/

@Component({
  selector: 'app-cuecard',
  templateUrl: './cuecard.component.html',
  styleUrls: ['./cuecard.component.scss']
})
export class CuecardComponent implements OnInit {

  cuecard: Cuecard;
  content: String;
  uuid: String;

  audioContext;
  audioBuffer;
  audioSource;
  playbackRate = 100;
  playDisabled = true;
  stopDisabled = true;
  loadDisabled = false;
  shifter;
  analyser;
  dataArray;
  canvas;
  canvasContext;
  startPos = 0;
  stride = 32768;
  startTime = 0;
  trackTime = 0;
  perc = 0;
  length = 0;

  recordCues = false;
  marks: String[] = [];
  headlines: String[] = [];
  karaokeMarks = [];

  currentH: HTMLElement;
  currentP: HTMLElement;
  currentElement = 0;
  currentIndex = 0;
  
  constructor(
    private route: ActivatedRoute, 
    private service: CuecardService, 
    private changeDetection: ChangeDetectorRef)  { 
    
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.uuid = params.get('uuid');

      if (this.uuid) {
        this.service.getCuecard(this.uuid).subscribe(cuecard => {
          this.cuecard = cuecard
          if (this.cuecard.karaoke_marks) {
            let marks = JSON.parse(this.cuecard.karaoke_marks.toString());

            if (Array.isArray(marks)) {
              this.marks = marks;
            } else if (typeof(marks) === 'object') {
              marks = new MarkData(marks);
              this.marks = marks.marks;
              this.headlines = marks.headlines;
            }
          }
          if (!this.cuecard.music_file) {
            this.loadDisabled = true;
          }
        });

        this.service.getCuecardContent(this.uuid).subscribe(content => {
          document.getElementById('cuecard').innerHTML = content.toString();

          let headlines = document.querySelectorAll('#cuecard > h1');

          headlines.forEach(headline => headline.addEventListener('dblclick', this.startAtHeadline.bind(this)));
        });
      }
    });
  
    document.addEventListener('keyup', this.keyup.bind(this));
  }

  load(audioFile: Blob) {
    let reader = new FileReader();
    reader.addEventListener('load', this.handleFileLoad.bind(this));
    reader.readAsArrayBuffer(audioFile);
  }

  loadMusicFile() {
    if (this.cuecard && this.cuecard.music_file) {
      this.service.getAudioFile(this.cuecard.music_file).subscribe(file => this.load(file));
    }
  }

  loadExternalFile(e: Event) {
    let target = <HTMLInputElement>e.target;

    if (target.files.length) {
      let file = target.files[0];

      console.log(file);

      let reader = new FileReader();
      reader.addEventListener('load', this.handleFileLoad.bind(this));

      reader.readAsArrayBuffer(file);
    }
  }

  handleFileLoad(e: ProgressEvent) {
    console.debug('File load complete')
      let arrayBufffer = (<FileReader>e.target).result;
      let audioContext: any = (<any>window).AudioContext || (<any>window).webkitAudioContext;
      let ctx = new audioContext({"latencyHint": "interactive"});

      let bufferSource = ctx.createBufferSource();

      ctx.decodeAudioData(arrayBufffer).then((audioBuffer) => {
        console.debug('Decoded');
        bufferSource.buffer = audioBuffer;
        this.audioContext = ctx;
        this.audioSource = bufferSource;
        this.audioBuffer = audioBuffer;
        this.playDisabled = false;
        this.loadDisabled = true;
        this.length = Math.trunc(audioBuffer.duration);
      });
  }

  playRateChange(e: Event) {
    let elem = <HTMLInputElement>e.target;
    this.playbackRate = Number.parseFloat(elem.value);
  }

  startAtHeadline(e: Event) {
    if (!this.headlines) {
      return true;
    }

    if (this.playDisabled) {
      return true;
    }

    let headline = <HTMLElement>e.target;
    let headlines = document.querySelectorAll('#cuecard > h1');
    
    let i = 1;

    while (i < headlines.length) {
      let current = headlines.item(i)
      if (current == headline) {
        if (i-1 < this.headlines.length) {
          let markTime = Number.parseFloat(this.headlines[i-1].toString());
          let perc = markTime / this.length * 100 - 0.5;

          console.log(markTime, perc);
          if (perc > 0 ) {
            this.perc = perc;
          } else {
            this.perc = 0;
          }
        }
      }
      i++;
    }

    e.preventDefault();
    return false;
  }

  changePerc(e: Event) {
    if (this.stopDisabled) {
      const pos = (<HTMLElement>event.target).getBoundingClientRect();
      const relX = (<any>event).pageX - (<any>pos).x;
      const percentage = (relX / (<HTMLElement>event.target).offsetWidth);
      this.perc = percentage * 100;
      this.trackTime = this.length * percentage;
    }
  }

  resetRate() {
    this.playbackRate = 100;
  }

  play() {
    if (this.audioSource) {
      this.shifter = new PitchShifter(this.audioContext, this.audioBuffer, 16384, this.stop.bind(this));
      this.shifter.tempo = this.playbackRate / 100;
      this.shifter.pitch = 1.0;
      this.playDisabled = true;
      this.stopDisabled = false;
      this.startTime = this.audioContext.currentTime;

      if (this.recordCues) {
        this.marks = [];
        this.headlines = [];
        document.getElementById('cuecard').focus();
      } else {
        this.karaokeMarks = this.marks.slice();

        if (this.perc > 0) {
          while (this.karaokeMarks.length) {
            let markTime = this.length * this.perc / 100;
            if (markTime > Number.parseFloat(this.karaokeMarks[0])) {
              this.karaokeMarks.shift();
              this.highlight();
            } else {
              break;
            }
          }
        }
      }

      this.shifter.on('play', this.playProgress.bind(this));

      this.shifter.connect(this.audioContext.destination);

      this.shifter.percentagePlayed = this.perc / 100;
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
        console.log(this.headlines);
      }

      if (this.currentP) {
        let elem = document.createElement('p');
        elem.innerHTML = this.currentP.innerText;
        this.currentP.replaceWith(elem);
      }

      this.currentP = null;
      this.currentH = null;
      this.currentIndex = 0;
      this.currentElement = 0;
      this.perc = 0;
    }
  }

  save() {
    let data = new MarkData({marks: this.marks, headlines: this.headlines});
    this.service.setMarks(this.uuid, data).subscribe(() => console.log('marks saved'));
    return false;
  }

  keyup(event) {
    if (this.recordCues && event.key === CUE_CHAR) {
      this.highlight();

      let markTime = this.length * this.shifter.percentagePlayed / 100;
      this.marks.push(markTime.toFixed(3));

      let headline = this.getCurrentHeadline();
      if (this.currentH == null) {
        this.headlines.push('0.0');
      } else if (this.currentH != headline) {
        this.headlines.push(markTime.toFixed(3));
      }
      this.currentH = headline;
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
      this.loadMusicFile();
    }
  }

  playProgress(_) {
    if (this.stopDisabled ) {
      return;
    }
    this.trackTime = this.shifter.percentagePlayed / 100 * this.length;
    this.perc = this.shifter.percentagePlayed;
    
    if (this.karaokeMarks) {
      this.karaoke();
    }
  }

  karaoke() {
    if (this.stopDisabled || this.recordCues) {
      return;
    }

    if (this.karaokeMarks.length) {
     /*let rate = this.playbackRate / 100;
     let markTime = ((this.audioContext.currentTime - this.startTime) * rate).toFixed(3);
     if (Number.parseFloat(markTime) > Number.parseFloat(this.karaokeMarks[0])) {
       let mark = this.karaokeMarks.shift();
       this.highlight();
     }*/

     let markTime = this.length * this.shifter.percentagePlayed / 100;
     if (markTime > Number.parseFloat(this.karaokeMarks[0])) {
       this.karaokeMarks.shift();
       this.highlight();
     }
    }
    
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

  getCurrentHeadline(): HTMLElement | null {
    let current = <HTMLElement>this.currentP.parentNode;

    while (current.previousSibling) {
      if (current.previousSibling.nodeName.toLowerCase() === 'h1') {
        return <HTMLElement>current.previousSibling;
      }

      current = <HTMLElement>current.previousSibling;
    }

    return null;
  }

  scrollTo(elem: HTMLElement) {
    if ((<any>elem).scrollIntoViewIfNeeded) {
      (<any>elem).scrollIntoViewIfNeeded(true);
    } else {
      elem.scrollIntoView({"behavior": "auto", "block": "center", "inline": "center"});
    }
  }
}
