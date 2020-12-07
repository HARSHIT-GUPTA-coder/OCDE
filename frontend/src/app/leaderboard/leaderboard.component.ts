import { Component, OnInit, Input } from '@angular/core';
import { TreeNode, scoreInterface } from 'src/app/fileInterface';
import { statementsFetchService } from 'src/app/statementsfetchservice.service';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder, NbAlertModule } from '@nebular/theme';
@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  @Input() problemId: number;
  submissionsColumns = ['Name', 'Score'];
  submissionSource: NbTreeGridDataSource<scoreInterface>;
  private submissionData: TreeNode<scoreInterface>[] = [];

  constructor(private stmtService: statementsFetchService, private submissionBuilder:  NbTreeGridDataSourceBuilder<scoreInterface>) { }

  initialise(){
    this.stmtService.getScores({problem_id: this.problemId}).subscribe(
      _data => {
        this.submissionData =  _data["scores"] as TreeNode<scoreInterface>[];
        this.submissionSource = this.submissionBuilder.create(this.submissionData);
      }
    );
  }
  ngOnInit(): void {
    this.initialise();
  }


}
