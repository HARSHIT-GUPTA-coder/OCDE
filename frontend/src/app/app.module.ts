import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbSelectModule, NbThemeModule, NbLayoutModule, NbCardModule, NbButtonModule, NbListModule, NbSidebarModule, NbIconModule, NbTreeGridModule, NbInputModule, NbMenuModule} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { FsIconComponent, MainComponent } from './dashboard/main/main.component';
import { NbAuthModule, NbDummyAuthStrategy } from '@nebular/auth';
import { FilelistComponent } from './filelist/filelist.component';
import { CodefetchService } from './codefetch.service';
import { CodeService } from './code-compile-service.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    MainComponent,
    FsIconComponent,
    FilelistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'dark' }),
    NbLayoutModule,
    NbEvaIconsModule,
    HttpClientModule,
    NbListModule,
    NbCardModule,
    NbButtonModule,
    NbSidebarModule.forRoot(),
    NbIconModule,
    NbSelectModule,
    NbTreeGridModule,
    NbInputModule,
    NbMenuModule.forRoot(),
    NbAuthModule.forRoot({
      strategies: [
        NbDummyAuthStrategy.setup({
          name: 'email',

          alwaysFail: true,
          delay: 1000,
        }),
      ],
    }),
  ],
  providers: [CodefetchService, CodeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
