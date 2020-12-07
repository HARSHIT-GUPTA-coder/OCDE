
import { Component, OnInit, Input } from '@angular/core';
import { TreeNode, statementInterface } from 'src/app/fileInterface';
import { statementsFetchService } from 'src/app/statementsfetchservice.service';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder, NbAlertModule } from '@nebular/theme';
import { Router } from '@angular/router';
@Component({
  selector: 'app-contestlist',
  templateUrl: './contestlist.component.html',
  styleUrls: ['./contestlist.component.scss']
})
export class ContestlistComponent implements OnInit {
  @Input() state: string;
  submissionsColumns = ['Contest Name', 'Starting Time', 'Ending Time'];
  submissionSource: NbTreeGridDataSource<statementInterface>;
  private submissionData: TreeNode<statementInterface>[] = [];

  constructor(private router: Router, private stmtService: statementsFetchService, private submissionBuilder:  NbTreeGridDataSourceBuilder<statementInterface>) { }

  initialise(){
    this.stmtService.getContests({state: this.state}).subscribe(
      _data => {

        this.submissionData =  _data["contests"] as TreeNode<statementInterface>[];
        console.log(this.submissionData);
        this.submissionSource = this.submissionBuilder.create(this.submissionData);
      }
    );
  }
  ngOnInit(): void {
    this.initialise();
  }

  onClick(s){
    this.router.navigate(['/dashboard/contest', {id: s.data.id}]);
 }

}
