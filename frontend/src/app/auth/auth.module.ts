import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbPasswordAuthStrategy, NbAuthModule } from '@nebular/auth';
// import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthRoutingModule,
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',
          // baseEndpoint: "",
          // login: {
          //   endpoint: "?",
          // method: "?"
          // },
          // register: {
          //   endpoint: "?",
          // method: "?"
          // }...
        }),
      ],
      forms: {
        register: {
          terms: false,
        }
      },
    }), 
  ]
})
export class AuthModule { }
