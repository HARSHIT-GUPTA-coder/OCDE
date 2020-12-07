import { Component, OnInit, Input } from '@angular/core';
import { fileInterface,TreeNode, submissionInterface } from 'src/app/fileInterface';
import { statementsFetchService } from 'src/app/statementsfetchservice.service';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder, NbAlertModule } from '@nebular/theme';
@Component({
  selector: 'app-submissiontable',
  templateUrl: './submissiontable.component.html',
  styleUrls: ['./submissiontable.component.scss']
})
export class SubmissiontableComponent implements OnInit {
  @Input() problemId: number;
  submissionsColumns = ['Passed', 'Status', 'Time'];
  submissionSource: NbTreeGridDataSource<submissionInterface>;
  private submissionData: TreeNode<submissionInterface>[] = [];

  constructor(private stmtService: statementsFetchService, private submissionBuilder:  NbTreeGridDataSourceBuilder<submissionInterface>) { }

  initialise(){
    this.stmtService.getSubmissions({problem_id: this.problemId}).subscribe(
      _data => {
        this.submissionData =  _data["submissions"] as TreeNode<submissionInterface>[];
        this.submissionSource = this.submissionBuilder.create(this.submissionData);
      }
    );
  }
  ngOnInit(): void {
    this.initialise();
  }
  do(){
    alert("oh");
  }

}
