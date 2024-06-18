import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  users: any[] = [];
  type: string = 'students';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tostar: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getUsers();
  }

  createForm() {
    this.loginForm = this.fb.group({
      type: [this.type],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  getRole(event: any) {
    this.type = event.value;
    this.getUsers();
  }

  getUsers() {
    this.authService.getUsers(this.type).subscribe((res: any) => {
      this.users = res;
    });
  }

  submit() {
    let index = this.users.findIndex(
      (item) =>
        item.email == this.loginForm.value.email &&
        item.password == this.loginForm.value.password
    );

    if (index == -1) {
      this.tostar.error('الايميل او كلمة المرور غير صحيحه', '', {
        disableTimeOut: false,
        titleClass: 'tostar_title;',
        messageClass: 'tostar_message',
        timeOut: 5000,
        closeButton: true,
      });
    } else {
      const model = {
        username: this.users[index].username,
        role: this.type,
        userId: this.users[index].id,
      };

      this.authService.login(model).subscribe((res: any) => {
        this.authService.user.next(res);
        this.router.navigate(['./subjects']);

        this.tostar.success('تم تسجيل الدخول بنجاح', '', {
          disableTimeOut: false,
          titleClass: 'tostar_title;',
          messageClass: 'tostar_message',
          timeOut: 5000,
          closeButton: true,
        });
      });
    }
  }
}
