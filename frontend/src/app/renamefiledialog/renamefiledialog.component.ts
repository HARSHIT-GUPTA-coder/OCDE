import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-dialog-rename-prompt',
  template: `
      <nb-card>
      <nb-card-header>Rename</nb-card-header>
      <nb-card-body>
        <input class="input" [(value)] = "oldname" #name nbInput id="name" placeholder="New name">
        <br>
      </nb-card-body>
      <nb-card-footer>
        <button class="cancel" nbButton status="danger" (click)="cancel()">Cancel</button>
        <button nbButton status="success" (click)="submit(name.value)">Submit</button>
      </nb-card-footer>
    </nb-card>
  `,
  styleUrls: ['renamefiledialog.scss'],
})
export class RenamefileDialog implements OnInit{

  constructor(protected ref: NbDialogRef<RenamefileDialog>) {}
  oldname: string;

  ngOnInit(): void { 
  }

  cancel() {
    this.ref.close(false);
  }

  submit(name) {
    this.ref.close(name);
  }
  }