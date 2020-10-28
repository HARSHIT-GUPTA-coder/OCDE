import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { nbNoOpInterceptorFilter } from '@nebular/auth';
import { NbMenuItem } from '@nebular/theme';
import { CodefetchService } from '../codefetch.service';
import { fileInterface, TreeNode } from '../fileInterface';

@Component({
  selector: 'app-filelist',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filelist.component.html',
  styleUrls: ['./filelist.component.scss']
})
export class FilelistComponent implements OnInit {
  items: NbMenuItem[] = [
    {
      title: 'Your Files',
      group: true,
    },
    {
      title: 'Layout',
      icon: 'layout-outline',
      
     }
  ];
  
  constructor(private _fileservice: CodefetchService) {
    this._fileservice.getFileList().subscribe(
      _data => {
        for(var d of _data)
          this.items.push(this.treeToMenu(d)) 
      }
      );
   }

  newFile() {
    console.log(this.items)
    console.log("SAfa")
  }
  onClick(s) {
    console.log(s)
  }
  ngOnInit(): void {
    
  }

  treeToMenu(tree: TreeNode<fileInterface>): NbMenuItem {
    let n:NbMenuItem = {title: tree.data.name};
    if(tree.children) {
      n.children = [];
      for(var t in tree.children){
        n.children.push(this.treeToMenu(tree.children[t]))
      }
    }
    return n;
  }
}
