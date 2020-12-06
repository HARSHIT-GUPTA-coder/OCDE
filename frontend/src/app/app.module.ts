import { CompetingComponent } from './dashboard/competing/competing.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbSelectModule, NbThemeModule, NbLayoutModule, NbCardModule, NbButtonModule, NbListModule, NbSidebarModule, NbIconModule, NbTreeGridModule, NbInputModule, NbMenuModule, NbDialogModule, NbCheckboxModule, NbContextMenuModule, NbToastrModule} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { FsIconComponent, MainComponent } from './dashboard/main/main.component';
import { NbAuthModule, NbDummyAuthStrategy } from '@nebular/auth';
import { FilelistComponent } from './filelist/filelist.component';
import { CodefetchService } from './codefetch.service';
import { CodeService } from './code-compile-service.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';
import { NewfiledialogComponent } from './newfiledialog/newfiledialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    MainComponent,
    CompetingComponent,
    FsIconComponent,
    FilelistComponent,
    NewfiledialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'dark' }),
    NbDialogModule.forRoot(),
    NbCheckboxModule,
    NbLayoutModule,
    NbEvaIconsModule,
    HttpClientModule,
    NbListModule,
    NbCardModule,
    NbButtonModule,
    NbContextMenuModule,
    NbSidebarModule.forRoot(),
    NbIconModule,
    NbSelectModule,
    NbTreeGridModule,
    NbInputModule,
    NbToastrModule.forRoot(),
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
  providers: [
    CodefetchService,
    CodeService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
