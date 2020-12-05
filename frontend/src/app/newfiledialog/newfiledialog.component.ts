import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { fileInterface, TreeNode } from '../fileInterface';
import { NbCardModule } from '@nebular/theme'

@Component({
  selector: 'ngx-dialog-name-prompt',
  template: `
      <nb-card>
      <nb-card-header>Enter your name</nb-card-header>
      <nb-card-body>
        <label class="name-label" for="name">Name:</label>
        <input class="input" #name nbInput id="name" placeholder="Name">
        <br>
        <nb-checkbox (checkedChange)="toggle($event)">Is this a file?</nb-checkbox>
        <br>
        <nb-select #parent placeholder="Select Parent Directory" [(selected)]="dir" style="width: 200px;">
          <nb-option value="c">C </nb-option>
          <nb-option value="c++">C++</nb-option>
          <nb-option value="python">Python</nb-option>
          <nb-option value="python3">Python 3</nb-option>
          <nb-option value="haskell">Haskell</nb-option>
          <nb-option value="sh">Bash</nb-option>
        </nb-select>
      </nb-card-body>
      <nb-card-footer>
        <button class="cancel" nbButton status="danger" (click)="cancel()">Cancel</button>
        <button nbButton status="success" (click)="submit(name.value,parent.value)">Submit</button>
      </nb-card-footer>
    </nb-card>
  `,
  styleUrls: ['newfiledialog.scss'],
})
export class NewfiledialogComponent {

  constructor(protected ref: NbDialogRef<NewfiledialogComponent>) {}

  dir: TreeNode<fileInterface>[];
  checked = false;

  Newfiledialogcomponent(dir: TreeNode<fileInterface>[]) { 
    this.dir = dir;
    return this;
  }

  toggle(checked: boolean) {
    this.checked = checked;
  }

  cancel() {
    this.ref.close();
  }

  submit(name, parent) {
    this.ref.close([name,this.checked,parent]);
  }
  }