import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MainComponent } from './main/main.component';
import {NbCardModule, NbLayoutModule, NbListModule} from '@nebular/theme';
import { DashboardComponent } from './dashboard.component';
import { EditorComponent } from './editor/editor.component';
import { AceEditorModule } from 'ng2-ace-editor';

@NgModule({
  declarations: [MainComponent, EditorComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NbLayoutModule,
    NbListModule,
    NbCardModule,
    AceEditorModule,
  ],
  bootstrap: [DashboardComponent]
})
export class DashboardModule { }
