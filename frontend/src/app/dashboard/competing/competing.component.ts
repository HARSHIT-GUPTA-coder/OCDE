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

  defaultColumns = ['Problem Name', 'Time Limit', 'Memory Limit' ];
  allColumns = this.defaultColumns;

  dataSource: NbTreeGridDataSource<statementInterface>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  private data: TreeNode<statementInterface>[] = [];
  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<statementInterface>, private sidebarService: NbSidebarService, private _stmtService: statementsFetchService, private router: Router, private _dialogService: NbDialogService) {
  }

  ngOnInit(): void {

    this.sidebarService.collapse('code');
    this._stmtService.getProblems().subscribe(
      _data => {
        console.log(_data);
        if(_data["success"]==false) {
          this._stmtService.handleError(_data["message"],this._stmtService.toastrService);
        }
        else {
          console.log("success");
          console.log(_data["problems"] as TreeNode<statementInterface>[])
          this.data =  _data["problems"] as TreeNode<statementInterface>[];
          console.log(this.data)
          this.dataSource = this.dataSourceBuilder.create(this.data);
        }
      }
    );
  }

  onClick(s){
     this.router.navigate(['/dashboard/problem', {id: s.data.id}]);
  }

}
