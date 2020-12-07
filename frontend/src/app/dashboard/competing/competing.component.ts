import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { NbSidebarService, NbDialogService } from '@nebular/theme';
import { statementsFetchService } from 'src/app/statementsfetchservice.service';
import { statementInterface, TreeNode } from 'src/app/fileInterface';

@Component({
  selector: 'app-competing',
  templateUrl: './competing.component.html',
  styleUrls: ['./competing.component.scss']
})
export class CompetingComponent implements OnInit {


  constructor(private sidebarService: NbSidebarService, private _stmtService: statementsFetchService, private router: Router, private _dialogService: NbDialogService) {
  }

  ngOnInit(): void {

    this.sidebarService.collapse('code');
  }

}
