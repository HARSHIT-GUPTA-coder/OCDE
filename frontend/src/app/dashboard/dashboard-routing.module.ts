import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './dashboard.component';
import { EditorComponent } from './editor/editor.component';

const routes: Routes = [{
  path: '', 
  component: DashboardComponent,
  children: [
    {
      path: 'main',
      component: MainComponent
    }, 
    {
      path: 'editor',
      component: EditorComponent
    },
    { 
      path: '**', 
      redirectTo: '/dashboard/main', 
      pathMatch: 'full'
    }
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {
}
