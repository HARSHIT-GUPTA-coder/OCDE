import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { statementsFetchService } from 'src/app/statementsfetchservice.service';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { NbSidebarService, NbDialogService } from '@nebular/theme';
import { CodefetchService } from 'src/app/codefetch.service';
import { fileInterface,TreeNode } from 'src/app/fileInterface';
import { TemplateRef } from '@angular/core';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss']
})
export class ProblemComponent implements OnInit {
  problemId: string;
  name: string;
  statement: string;
  memory_limit: string;
  time_limit: string;
  statusMessage: string;

  selected = "";
  selectedId:number;
  language = "python";

  defaultColumns = ['name' ];
  allColumns = this.defaultColumns;

  dataSource: NbTreeGridDataSource<fileInterface>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  private data: TreeNode<fileInterface>[] = [];

  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<fileInterface>,private _fileService: CodefetchService, private _dialogService: NbDialogService, private _route : ActivatedRoute, private stmtService: statementsFetchService,  private sidebarService: NbSidebarService) { }


  ngOnInit() {
    this.sidebarService.collapse('code');
    this.problemId = this._route.snapshot.paramMap.get('id');


    this.stmtService.getProblemStatement(this.problemId).subscribe(
      _data => {
        console.log(_data);
        this.name = _data["problem"]["name"];
        this.statement = _data["problem"]["statement"];
        this.memory_limit = _data["problem"]["memory_limit"];
        this.time_limit = _data["problem"]["time_limit"];
      }
    );
    this._fileService.getFileList().subscribe(
      _data => {
        console.log(_data);
        if(_data["success"]==false) {
          this._fileService.handleError(_data["message"],this._fileService.toastrService);
        }
        else {
          console.log("success");
          console.log(_data["structure"] as TreeNode<fileInterface>[])
          this.data =  _data["structure"] as TreeNode<fileInterface>[];
          console.log(this.data)
          this.dataSource = this.dataSourceBuilder.create(this.data);
        }
      }
    );
  }

  setId(row){
    this.selected = row.data.name;
    this.selectedId = row.data.id;
  }
  submit(){

  }
  onClick(dialog: TemplateRef<any>) {
    this._dialogService.open(dialog).onClose.subscribe(
      data => {
        console.log(data);
        if (data == 1){
          if (this.selected == ""){
            this.statusMessage = "Choose a File please";
            this.onClick(dialog);
          }
          else {
            this.statusMessage = "";
            this.submit();
            this.selected = "";
          }
        }
        // if (data ==)
      }
    );
  }

}
