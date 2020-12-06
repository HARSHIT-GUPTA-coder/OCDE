import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NbSidebarService } from '@nebular/theme'
import { statementsFetchService } from 'src/app/statementsfetchservice.service';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss']
})
export class ProblemComponent implements AfterViewInit {
  problemId: string;

  constructor(private _route : ActivatedRoute,  private sidebarService: NbSidebarService) { }

  ngAfterViewInit() {
    this.sidebarService.collapse('code');
    this.problemId = this._route.snapshot.paramMap.get('id');
  }

}
