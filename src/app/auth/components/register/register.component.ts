import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  userForm!: FormGroup;
  students: any[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tostar: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getStudents();
  }

  createForm() {
    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  getStudents() {
    this.authService.getUsers('students').subscribe((res: any) => {
      this.students = res;
    });
  }

  submit() {
    const Model = {
      username: this.userForm.value.username,
      email: this.userForm.value.email,
      password: this.userForm.value.password,
    };

    let index = this.students.findIndex(
      (item) => item.email == this.userForm.value.email
    );

    if (index !== -1) {
      this.tostar.error('هذا الايميل موجود  بالفعل', "", {
        disableTimeOut: false,
        titleClass: "tostar_title;",
        messageClass: "tostar_message",
        timeOut: 5000,
        closeButton: true,
      });
    } else {
      this.authService.createUser(Model).subscribe((res: any) => {
        this.tostar.success('تم انشاء الحساب بنجاح', '', {
          disableTimeOut: false,
          titleClass: 'tostar_title;',
          messageClass: 'tostar_message',
          timeOut: 5000,
          closeButton: true,
        });
              const model = {
                username: res.username,
                role: 'students',
                userId: res.id,
              };

              this.authService.login(model).subscribe((res: any) => {
                this.authService.user.next(res);
              });
        this.router.navigate(['./subjects']);
      });
    }
  }
}
