import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../../doctor/services/doctor.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss'],
})
export class ExamComponent implements OnInit {
  id: any;
  subject: any;
  user: any;
  studentInfo: any;
  result: number = 0;
  userSubjects: any[] = [];
  showResult: boolean = false;
  validExam: boolean = true;
  buttonEnabled: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private tostar: ToastrService,
    private authService: AuthService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getSubject();
    this.getLoginedUser();
  }

  ngOnInit(): void {}

  getSubject() {
    this.doctorService.getSubject(this.id).subscribe((res: any) => {
      this.subject = res;
    });
  }

  getLoginedUser() {
    this.authService.getRole().subscribe((res: any) => {
      this.user = res;
      this.getUserData();
    });
  }

  getUserData() {
    this.authService.getStudent(this.user.userId).subscribe((res: any) => {
      this.studentInfo = res;
      this.userSubjects = res?.subjects ? res?.subjects : [];
      this.checkValidExam();
    });
  }

  checkValidExam() {
    for (let x in this.userSubjects) {
      if (this.userSubjects[x].id == this.id) {
        this.result = this.userSubjects[x].degree;
        this.validExam = false;
        this.tostar.warning('لقد انجزت هذا الاختبار مسبقا');
      }
    }
  }

  getAnswerStudent(event: any) {
    let value = event.value,
      questionIndex = event.source.name;
    this.subject.questions[questionIndex].studentAnswer = value;
    console.log(value);
    this.buttonEnabled = true;
  }

  delete(index: number) {
    this.subject.questions.splice(index, 1);
    const model = {
      name: this.subject.name,
      questions: this.subject.questions,
    };
    this.doctorService.updateSubject(model, this.id).subscribe((res: any) => {
      this.tostar.success('تم حذف السؤال بنجاح');
    });
  }

  getResult() {
    this.result = 0;
    for (let x in this.subject.questions) {
      if (
        this.subject.questions[x].studentAnswer ==
        this.subject.questions[x].correctAnswer
      ) {
        this.result++;
      }
    }
    this.showResult = true;
    this.userSubjects.push({
      name: this.subject.name,
      id: this.subject.id,
      degree: this.result,
    });
    const model = {
      username: this.studentInfo.username,
      email: this.studentInfo.email,
      password: this.studentInfo.password,
      subjects: this.userSubjects,
    };
    this.authService
      .updateStudent(this.user.userId, model)
      .subscribe((res: any) => {
        this.tostar.success('تم تسجيل النتيجة بنجاح');
      });
  }
}
