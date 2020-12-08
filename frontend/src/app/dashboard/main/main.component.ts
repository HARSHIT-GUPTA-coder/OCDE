import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbMenuService, NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { NbSidebarService, NbDialogService, NbMenuItem } from '@nebular/theme';
import { CodefetchService } from 'src/app/codefetch.service';
import { fileInterface,TreeNode } from 'src/app/fileInterface';
import { NewfiledialogComponent } from 'src/app/newfiledialog/newfiledialog.component';
import { RenamefileDialog } from 'src/app/renamefiledialog/renamefiledialog.component';

@Component({
  selector: 'app-main-view',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit{
  customColumn = 'name';
  defaultColumns = ['size', 'items' ];
  allColumns = [ this.customColumn, ...this.defaultColumns ];
  activeFileID = -1;
  activeFileName = '';

  // For right click menu
  items: NbMenuItem[];

  dataSource: NbTreeGridDataSource<fileInterface>;

  rightClickedRow: any;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  private data: TreeNode<fileInterface>[] = [];

  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<fileInterface>,
              private sidebarService: NbSidebarService,
              private _fileService: CodefetchService,
              private _dialogService: NbDialogService,
              private router: Router) {
      
  }
  async itemClicked(action) {
    action = action.substring(0, 3);
    if (action == 'Ope'){
      this._fileService.readfile(this.activeFileID.toString());
      this._fileService.changeOpenedFile({name: this.activeFileName, id: this.activeFileID});
      this.router.navigate(['dashboard', 'editor']);
    }
    else if (action == 'Del') {
      if(await this._fileService.deletefile(this.activeFileID.toString()))
        this.refreshFileStructure();
    }
    else if (action == 'New') {
      this.newFile(this.activeFileID);
    }
    else if (action == "Ren") {
      this.renameFile(this.activeFileID);
    }
  }
  refreshFileStructure(): void {
    this._fileService.getFileList().subscribe(
      _data => {
        if(_data["success"]==false) {
          this._fileService.handleError(_data["message"],this._fileService.toastrService);
        }
        else {
          this.data =  _data["structure"] as TreeNode<fileInterface>[];
          this.dataSource = this.dataSourceBuilder.create(this.data);
        }
      }, error => {
        this._fileService.handleError(error,this._fileService.toastrService);
      }
    );
  }
  ngOnInit(): void {
    this.sidebarService.collapse('code');
    this.refreshFileStructure();
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

  newFile(par: number) {
    this._dialogService.open(NewfiledialogComponent, {context: {par: par.toString()}}).onClose.subscribe(
      async data => {
        if (data) {
          if (await this._fileService.createFile(data[2],data[0],data[1]))
            this.refreshFileStructure();
        }
        // console.log(data[2]);
      }
    )
  }
  renameFile(par: number) {
    // console.log("Rename called from main");
    this._dialogService.open(RenamefileDialog, {context: {oldname: this.activeFileName}}).onClose.subscribe(
      async data => {
        if (data) {
          if (await this._fileService.renamefile(par.toString(), data))
            this.refreshFileStructure();
        }
      }
    )
  }

  onSingleCick(s) {
    this.activeFileID = s.data.id;
    this.activeFileName = s.data.name;
  }

  onRightClick(s) {
    this.activeFileID = s.data.id;
    this.activeFileName = s.data.name;
    this.rightClickedRow = s.data;
    if (s.data.is_file) {
      this.items = [
        {
          title: 'Open File',
          icon: 'file-text-outline',
        },
        {
          title: 'Rename File',
          icon: 'edit-2-outline',
        },
        {
          title: 'Delete File',
          icon: 'trash-2-outline',
        },
      ];
    }
    else {
      this.items = [
        {
          title: 'New File/Folder',
          icon: 'file-add-outline',
        },
        {
          title: 'Rename Folder',
          icon: 'edit-2-outline',
        },
        {
          title: 'Delete Folder',
          icon: 'trash-2-outline',
        },
      ];
    }
  }

  onClick(s) {
    this.activeFileID = s.data.id;
    this.activeFileName = s.data.name;
    if (s.data.is_file) {
      this._fileService.readfile(s.data.id);
      this._fileService.changeOpenedFile({name: this.activeFileName, id: this.activeFileID});
      this.router.navigate(['dashboard', 'editor']);
    }
  }

  getShowOn(index: number) {
      const minWithForMultipleColumns = 125;
      const nextColumnStep = 125;
      // console.log(index)
      return minWithForMultipleColumns + (nextColumnStep * index);
  }

  displayValue(val: any, field: string, is_file: boolean) : any {
    if (field == 'items') {
      if (is_file) return '-';
      return val;
    }
    if (field == 'size') {
      val = parseInt(val);
      if (val >= 1000000000) return (val/1000000000) + ' GB';
      if (val >= 1000000) return (val/1000000) + ' MB';
      if (val >= 1000) return (val/1000) + ' KB';
      return val + ' B';
    }
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