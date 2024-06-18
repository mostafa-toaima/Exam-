import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(private authService: AuthService) {}
  user: any = null;
  ngOnInit(): void {
    this.authService.user.subscribe((res: any) => {
      if (res.role) {
        this.user = res;
        console.log(this.user);
      }
    });
  }

  logout() {
    const model = {};
    this.authService.login(model).subscribe((res) => {
      this.user = null;
      this.authService.user.next(res);
    });
  }
}
