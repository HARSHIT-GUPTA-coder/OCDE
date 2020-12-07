import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NbMenuService, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { NbSidebarService, NbDialogService, NbMenuItem } from '@nebular/theme';
import { CodefetchService } from 'src/app/codefetch.service';
import { fileInterface,TreeNode } from 'src/app/fileInterface';
import { NewfiledialogComponent } from 'src/app/newfiledialog/newfiledialog.component';
import { ConnectpartService } from '../connectpart.service';
import { RenamefileDialog } from 'src/app/renamefiledialog/renamefiledialog.component';


@Component({
  selector: 'app-filelist',
  templateUrl: './filelist.component.html',
  styleUrls: ['./filelist.component.scss'],
})
export class FilelistComponent implements OnInit {
  customColumn = 'name';
  allColumns = [ this.customColumn ];
  dataSource: NbTreeGridDataSource<fileInterface>;
  activeFileID = -1;
  activeFileName = '';
  rightClickedRow: any;
  items: NbMenuItem[];

  private data: TreeNode<fileInterface>[] = [];

  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<fileInterface>,
    private sidebarService: NbSidebarService,
    private _fileService: CodefetchService,
    private _dialogService: NbDialogService,
    private _connect: ConnectpartService,
    private menu: NbMenuService) {

        menu.onItemClick().subscribe(async x => {
        var action = x.item.title.substring(0, 3);
        if (action == 'Ope')
          this._fileService.readfile(this.activeFileID.toString());
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
        });
        _connect.setcallback(() => this.refreshFileStructure().bind(this))
}
  
  refreshFileStructure(): any {
    // this.sidebarService.collapse('code');
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
    this.refreshFileStructure();
  }

  newFile(par: number) {
    // console.log("newfile")
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
          icon: { icon: 'file-text-outline', pack: 'eva' },
        },
        {
          title: 'Rename File',
          icon: { icon: 'edit-2-outline', pack: 'eva' },
        },
        {
          title: 'Delete File',
          icon: { icon: 'trash-2-outline', pack: 'eva' },
        },
      ];
    }
    else {
      this.items = [
        {
          title: 'New File/Folder',
          icon: { icon: 'file-add-outline', pack: 'eva' },
        },
        {
          title: 'Rename Folder',
          icon: { icon: 'edit-2-outline', pack: 'eva' },
        },
        {
          title: 'Delete Folder',
          icon: { icon: 'trash-2-outline', pack: 'eva' },
        },
      ];
    }
  }

  onClick(s) {
    this.activeFileID = s.data.id;
    this.activeFileName = s.data.name;
    if (s.data.is_file)
      this._fileService.readfile(s.data.id);
    else
      this.onRightClick(s);
  }
  getShowOn(index: number) {
      const minWithForMultipleColumns = 125;
      const nextColumnStep = 125;
      // console.log(index)
      return minWithForMultipleColumns + (nextColumnStep * index);
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
