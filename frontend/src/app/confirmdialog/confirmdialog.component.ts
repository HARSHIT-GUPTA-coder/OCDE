import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-dialog-confirm-prompt',
  template: `
      <nb-card>
        <nb-card-header>Delete forever?</nb-card-header>
        <nb-card-body>
          Your file/folder will be deleted forever and you won't be able to restore it.
        </nb-card-body>
        <nb-card-footer>
          <button class="cancel" nbButton status="primary" (click)="cancel()" style = "float:left">Cancel</button>
          <button nbButton status="danger" (click)="delete()" style = "float:right">Delete forever</button>
        </nb-card-footer>
      </nb-card>
  `,
  styleUrls: ['confirmdialog.scss'],
})
export class ConfirmDialog implements OnInit{

  constructor(protected ref: NbDialogRef<ConfirmDialog>) {}

  ngOnInit(): void {
  }

  cancel() {
    this.ref.close(false);
  }

  delete() {
    this.ref.close(true);
  }
}