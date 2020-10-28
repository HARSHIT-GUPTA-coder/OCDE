
import { Component, Input, OnInit } from '@angular/core';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { NbSidebarService } from '@nebular/theme';
import { CodefetchService } from 'src/app/codefetch.service';
import { fileInterface,TreeNode } from 'src/app/fileInterface';

@Component({
  selector: 'app-main-view',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit{
  customColumn = 'id';
  defaultColumns = ['name', 'size', 'type', 'items' ];
  allColumns = [ this.customColumn, ...this.defaultColumns ];

  dataSource: NbTreeGridDataSource<fileInterface>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  private data: TreeNode<fileInterface>[] = [];

  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<fileInterface>, private sidebarService: NbSidebarService, private _fileService: CodefetchService) {
  }
  ngOnInit(): void {
    this.sidebarService.collapse('code')
    this._fileService.getFileList().subscribe(
      _data => {
        // for(var d of _data) {
        //   if(!d.parent){
        //     console.log(d)
        //     this.data.push({
        //       data: d
        //     })
        //   }
        //   else {
        //     for(var x of this.data) {
        //       if(x.data.id==d.parent){
        //         if(!x.children)
        //           x.children = [{data: d}]
        //         else
        //           x.children.push({data: d})
        //       }
        //     }
        //   }
        // }
        this.data = _data
        this.dataSource = this.dataSourceBuilder.create(this.data);
      }
      );
  }

  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }

  newFile() {
    console.log(this.data)
  }
  onClick(s) {
    console.log(s)
  }
  getShowOn(index: number) {
      const minWithForMultipleColumns = 125;
      const nextColumnStep = 125;
      console.log(index)
      return minWithForMultipleColumns + (nextColumnStep * index);
  }

}

@Component({
  selector: 'nb-fs-icon',
  template: `
    <nb-tree-grid-row-toggle [expanded]="expanded" *ngIf="isDir(); else fileIcon">
    </nb-tree-grid-row-toggle>
    <ng-template #fileIcon>
      <nb-icon icon="file-text-outline"></nb-icon>
    </ng-template>
  `,
})
export class FsIconComponent {
  @Input() type: string;
  @Input() expanded: boolean;

  isDir(): boolean {
    return this.type === 'dir';
  }
}