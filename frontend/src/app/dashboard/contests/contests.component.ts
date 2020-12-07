import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbSidebarService } from '@nebular/theme';
import { CountdownComponent } from 'ngx-countdown';
import { statementsFetchService } from 'src/app/statementsfetchservice.service';

@Component({
  selector: 'app-contests',
  templateUrl: './contests.component.html',
  styleUrls: ['./contests.component.scss']
})
export class ContestsComponent implements OnInit {
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;
  name: string;
  time: string;
  id: string;
  count = true;
  text: string;
  config;
  constructor( private _route : ActivatedRoute, private sidebarService: NbSidebarService, private stmtService: statementsFetchService) { }

  ngOnInit(): void {
    this.sidebarService.collapse('code');
    this.id = this._route.snapshot.paramMap.get('id');
    this.stmtService.getContest({id: this.id}).subscribe(
      _data => {
        console.log(_data);
        this.name = _data["contest"]["Contest Name"];
        let status = _data["contest"]["status"];
        let sec = _data["contest"]["sec"];
        if (status == "r"){
          this.text = "Time till end of contest: ";
          this.count = true;
        }
        else if (status == "e"){
          this.text = "Contest has ended";
          this.count = false;
        }
        else {
          this.text = "Contest will begin in: ";
          this.count = true;
        }
        this.countdown.stop();
        console.log(this.config);
        this.config = {leftTime: parseInt(sec)};
        this.countdown.restart();
      }
    );
  }

}
