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

  constructor(private route: ActivatedRoute, private service: CuecardService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let uuid = params.get('uuid');

      if (uuid) {
        this.service.getCuecard(uuid).subscribe(content => {
          document.getElementById('cuecard').innerHTML = content.toString();
        });
      }
    });
  }
}
