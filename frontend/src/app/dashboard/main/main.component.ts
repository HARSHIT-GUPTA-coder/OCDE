
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { NbSidebarService, NbDialogService } from '@nebular/theme';
import { CodefetchService } from 'src/app/codefetch.service';
import { fileInterface,TreeNode } from 'src/app/fileInterface';
import { NewfiledialogComponent } from 'src/app/newfiledialog/newfiledialog.component';
@Component({
  selector: 'app-main-view',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit{
  customColumn = 'id';
  defaultColumns = ['name', 'size', 'items' ];
  allColumns = [ this.customColumn, ...this.defaultColumns ];

  dataSource: NbTreeGridDataSource<fileInterface>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  private data: TreeNode<fileInterface>[] = [];

  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<fileInterface>, private sidebarService: NbSidebarService, private _fileService: CodefetchService, private router: Router, private _dialogService: NbDialogService) {
  }
  ngOnInit(): void {
    this.sidebarService.collapse('code')
    this._fileService.getFileList().subscribe(
      _data => {
        console.log(_data);
        if(_data["success"]==false) {
          console.error(
            _data["message"]
          );
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
    console.log("newfile")
    // var dir = this.data.filter((elem,index,arr) => {
    //   return elem.data.is_file === false;
    // })
    const dialog = this._dialogService.open(NewfiledialogComponent).onClose.subscribe(
      data => {
        this._fileService.createFile(data[2],data[0],data[1]);
        console.log(data[2]);
      }
    )
  }
  onClick(s, dialog: TemplateRef<any>) {
    console.log(s)
    if(s.data.is_file==false) return false;
    this._dialogService.open(dialog).onClose.subscribe(
      data => {
        console.log(data)
        if(data==1) {
            //open file
            this._fileService.readfile(s.data.id);
        }
        else if(data==2) {
          //delete 
          this._fileService.deletefile(s.data.id);
        }
      }
    )
    return false;
  }
  getShowOn(index: number) {
      const minWithForMultipleColumns = 125;
      const nextColumnStep = 125;
      // console.log(index)
      return minWithForMultipleColumns + (nextColumnStep * index);
  }

  deleteFile() {
    
  }
}
@Component({
  selector: 'nb-fs-icon',
  template: `
    <nb-icon icon="folder-outline" *ngIf="isDir() && expanded===true"></nb-icon>
    <nb-icon icon="folder" *ngIf="isDir() && expanded===false"></nb-icon>
    <nb-tree-grid-row-toggle [expanded]="expanded" *ngIf="isDir(); else fileIcon">
    </nb-tree-grid-row-toggle>
    <ng-template #fileIcon>
      <nb-icon icon="file-text-outline"></nb-icon>
    </ng-template>
  `,
})
export class FsIconComponent {
  @Input() isFile: boolean;
  @Input() expanded: boolean;

  isDir(): boolean {
    return this.isFile === false;
  }
}