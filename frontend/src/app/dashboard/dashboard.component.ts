import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { User } from '../UserDetails';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  user: User;

  constructor(private router: Router,
              private api: ApiService) { }

  ngOnInit(): void {
  }

  logout() {
    this.api.logoutUser().subscribe(res => {
      this.user = res;
      if (this.user.success) {
        this.router.navigate(['home']);
      }
    });
  }

}
