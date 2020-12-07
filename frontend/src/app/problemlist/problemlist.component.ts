
import { Component, OnInit, Input } from '@angular/core';
import { TreeNode, statementInterface } from 'src/app/fileInterface';
import { statementsFetchService } from 'src/app/statementsfetchservice.service';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder, NbAlertModule } from '@nebular/theme';
import { Router } from '@angular/router';
@Component({
  selector: 'app-problemlist',
  templateUrl: './problemlist.component.html',
  styleUrls: ['./problemlist.component.scss']
})
export class ProblemlistComponent implements OnInit {
  @Input() contestId: number;
  submissionsColumns = ['Problem Name', 'Accepted Submissions', 'Total Submissions'];
  submissionSource: NbTreeGridDataSource<statementInterface>;
  private submissionData: TreeNode<statementInterface>[] = [];

  constructor(private router: Router, private stmtService: statementsFetchService, private submissionBuilder:  NbTreeGridDataSourceBuilder<statementInterface>) { }

  initialise(){
    this.stmtService.getProblems({contest_id: this.contestId}).subscribe(
      _data => {
        console.log(_data);
        console.log("uu");
        this.submissionData =  _data["problems"] as TreeNode<statementInterface>[];
        console.log(this.submissionData);
        this.submissionSource = this.submissionBuilder.create(this.submissionData);
      }
    );
  }
  ngOnInit(): void {
    this.initialise();
  }

  onClick(s){
    this.router.navigate(['/dashboard/problem', {id: s.data.id}]);
 }

}
