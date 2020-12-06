import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MainComponent } from './main/main.component';
import { NbSelectModule, NbActionsModule, NbCardModule, NbIconModule, NbInputModule, NbLayoutModule, NbListModule, NbSidebarModule, NbDialogModule} from '@nebular/theme';
import { DashboardComponent } from './dashboard.component';
import { EditorComponent } from './editor/editor.component';
import { AceEditorModule } from 'ng2-ace-editor';
import { FormsModule } from '@angular/forms';
import { NewfiledialogComponent } from '../newfiledialog/newfiledialog.component';
import { CompetingComponent } from './competing/competing.component';
import { ProblemComponent } from './problem/problem.component';

@NgModule({
  declarations:  [EditorComponent, ProblemComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NbLayoutModule,
    NbListModule,
    NbCardModule,
    AceEditorModule,
    NbSidebarModule,
    NbInputModule,
    FormsModule,
    NbActionsModule,
    NbSelectModule,
    NbDialogModule.forChild(),
    NbIconModule,
  ],
  bootstrap: [DashboardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule { }
