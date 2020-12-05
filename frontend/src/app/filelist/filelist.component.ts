import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { NbSidebarService, NbDialogService } from '@nebular/theme';
import { CodefetchService } from 'src/app/codefetch.service';
import { fileInterface,TreeNode } from 'src/app/fileInterface';
import { NewfiledialogComponent } from 'src/app/newfiledialog/newfiledialog.component';
import { ConnectpartService } from '../connectpart.service';

@Component({
  selector: 'app-filelist',
  templateUrl: './filelist.component.html',
  styleUrls: ['./filelist.component.scss'],
})
export class FilelistComponent implements OnInit {
  customColumn = 'name';
  allColumns = [ this.customColumn ];
  dataSource: NbTreeGridDataSource<fileInterface>;
  private activefile;
  private data: TreeNode<fileInterface>[] = [];

  constructor(private _connect: ConnectpartService , private dataSourceBuilder: NbTreeGridDataSourceBuilder<fileInterface>, private _fileService: CodefetchService, private _dialogService: NbDialogService) {
  }
  ngOnInit(): void {
    this._connect.setcallback( (_data, active) => {
      console.log("callback")
    this.data = _data as TreeNode<fileInterface>[];
    console.log(this.data);
    this.activefile = parseInt(active);
    this.dataSource = this.dataSourceBuilder.create(this.data);
    });
  }

  newFile() {
    console.log("newfile")
    // console.log(typeof this.activefile)
    this._dialogService.open(NewfiledialogComponent).onClose.subscribe(
      data => {
        this._fileService.createFile(data[2],data[0],data[1]);
        console.log(data[2]);
      }
    )
  }

  onSingleCick(s,dialog: TemplateRef<any>) {
    if(s.data.is_file==false) return false;
    this.onClick(s,dialog)
  }

  onClick(s, dialog: TemplateRef<any>) {
    console.log(s)
    // if(s.data.is_file==false) return false;
    this._dialogService.open(dialog).onClose.subscribe(
      data => {
        console.log(data)
        if(data==1) {
          this._connect.changeFile(s.data.id);
          
            //open file
            // this._fileService.readfiledata(s.data.id);
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
