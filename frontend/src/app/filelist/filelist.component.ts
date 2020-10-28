import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { nbNoOpInterceptorFilter } from '@nebular/auth';
import { NbMenuItem, NbMenuService } from '@nebular/theme';

@Component({
  selector: 'app-filelist',
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './filelist.component.html',
  styleUrls: ['./filelist.component.scss'],
})
export class FilelistComponent implements OnInit {
  items: NbMenuItem[] = [
    {
      title: 'Your Files',
      group: true,
    }
  ];
  
  constructor() {
   }

  newFile() {
    console.log(this.items)
  }
  onClick(s) {
    console.log(s)
  }
  ngOnInit(): void {
  }

}
