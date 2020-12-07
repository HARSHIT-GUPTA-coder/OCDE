import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService, NbActionComponent } from '@nebular/theme';

import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/UserDetails';


@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: User;

  userMenu = [ { title: 'Profile' }, { title: 'Log out' } ];


  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private _sd: ApiService,
              private router: Router) {
  }

  ngOnInit() {

    this._sd.getDetails()
        .pipe(takeUntil(this.destroy$))
        .subscribe((userDetail: User) => {
          this.user = userDetail;
          this.userMenu = [ { title: this.user.first_name + ' ' + this.user.last_name }, { title: 'Log out' } ]
    });


    this.menuService.onItemClick().subscribe(( event ) => {
      if (event.item.title === 'Log out') {
          this._sd.logoutUser()
              .pipe(takeUntil(this.destroy$))
              .subscribe(() => {
                this.router.navigate(['home']);
          });
      }
    });
  }
  gotoLink(x) {
    this.router.navigate(x);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // toggleSidebar(): boolean {
  //   this.sidebarService.toggle(true, 'menu-sidebar');
  //   this.layoutService.changeLayoutSize();

  //   return false;
  // }

  navigateHome() {
    this.router.navigate(['home']);
    return false;
  }

}
