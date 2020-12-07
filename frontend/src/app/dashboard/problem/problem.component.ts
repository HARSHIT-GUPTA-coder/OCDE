import { LeaderboardComponent } from './../../leaderboard/leaderboard.component';
import { SubmissiontableComponent } from './../../submissiontable/submissiontable.component';
import { statementInterface } from './../../fileInterface';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { statementsFetchService } from 'src/app/statementsfetchservice.service';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder, NbAlertModule } from '@nebular/theme';
import { NbSidebarService, NbDialogService } from '@nebular/theme';
import { CodefetchService } from 'src/app/codefetch.service';
import { fileInterface,TreeNode, submissionInterface } from 'src/app/fileInterface';
import { TemplateRef } from '@angular/core';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss']
})
export class ProblemComponent implements OnInit {
  @ViewChild(SubmissiontableComponent) child: SubmissiontableComponent ;
  @ViewChild(LeaderboardComponent) child2: LeaderboardComponent ;
  problemId: string;
  name: string;
  statement: string;
  memory_limit: string;
  time_limit: string;
  statusMessage: string;
  submissionStatus: string;

  status = "";
  selected = "";
  selectedId:number;
  language = "python3";
  data;
  constructor(private _fileService: CodefetchService, private _dialogService: NbDialogService, private _route : ActivatedRoute, private stmtService: statementsFetchService,  private sidebarService: NbSidebarService) { }


  ngOnInit() {
    this.sidebarService.collapse('code');
    this.problemId = this._route.snapshot.paramMap.get('id');


    this.stmtService.getProblemStatement(this.problemId).subscribe(
      _data => {
        console.log(_data);
        this.name = _data["problem"]["name"];
        this.statement = _data["problem"]["statement"];
        console.log(this.statement);
        this.memory_limit = _data["problem"]["memory_limit"];
        this.time_limit = _data["problem"]["time_limit"];
      }
    );
    this._fileService.getFiles().subscribe(
      _data => {
        if(_data["success"]==false) {
          this._fileService.handleError(_data["message"],this._fileService.toastrService);
        }
        else {
          // this.data = _data["data"];
          console.log(_data["data"]);
          this.data = _data["data"];
          console.log(this.data);
        }
      }
    );

  }

  setId(row){
    this.selected = row.filename;
    this.selectedId = row.file_id;

  }
  submit(){
    let data = {lang: this.language, file_id: this.selectedId, problem_id: this.problemId};
    this.submissionStatus = "Submitting...";
    this.stmtService.submitProblem(data).subscribe(
      _data => {
        this.submissionStatus = _data["status"]["message"];
        if (_data["status"]["passed"]){
          this.status = "success";
        }
        else {
          this.status = "danger";
        }
        this.child.initialise();
        this.child2.initialise();
      }
    );


  }
  onClick(dialog: TemplateRef<any>) {
    this._fileService.getFiles().subscribe(
      _data => {
        console.log(_data);
        if(_data["success"]==false) {
          this._fileService.handleError(_data["message"],this._fileService.toastrService);
        }
        else {
          console.log(_data["data"]);
          this.data = _data["data"];
          console.log("mu");
        }
      }
    );
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
