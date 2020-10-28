import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { nbNoOpInterceptorFilter } from '@nebular/auth';
import { NbMenuItem, NbMenuService } from '@nebular/theme';

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
  
  constructor() {
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

}
