import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss'],
})
export class SubjectsComponent implements OnInit {
  subjects: any[] = [];
  user: any = {};

  constructor(
    private doctorService: DoctorService,
    private authService: AuthService,
    private tostar: ToastrService
  ) {}

  ngOnInit(): void {
    this.getSubjects();
    this.getUserInfo();
  }

  getSubjects() {
    this.doctorService.getAllSubjects().subscribe((res: any) => {
      this.subjects = res;
    });
  }

  getUserInfo() {
    this.authService.getRole().subscribe((res: any) => {
      this.user = res;
    });
  }

  delete(index: number) {
    let id = this.subjects[index].id;
    this.subjects.splice(index, 1)
    this.doctorService.deleteSubject(id).subscribe((res: any) => {
      this.tostar.success('تم حذف المادة بنجاح')
    })
  }
}
