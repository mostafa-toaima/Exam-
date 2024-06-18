import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent implements OnInit {
  dataSource: any;
  dataTable: any;
  displayedColumns: any;
  constructor(private authService: AuthService) {
    this.displayedColumns = ['position', 'name', 'weight', 'symbol'];
  }

  ngOnInit(): void {
    this.getStudents();
  }

  getStudents() {
    this.authService.getUsers('students').subscribe((res: any) => {
      this.dataSource = res?.map((student: any) => {
        if (student?.subjects) {
          return student?.subjects?.map((sub: any) => {
            return {
              username: student.username,
              subjectName: sub.name,
              degree: sub.degree,
            };
          });
        } else {
          return [
            {
              name: student.username,
              subjectName: '-',
              degree: '-',
            },
          ];
        }
      });
      this.dataTable = [];
      this.dataSource.forEach((item: any) => {
        item.forEach((subItem: any) => {
          this.dataTable.push({
            name: subItem.username,
            subjectName: subItem.subjectName,
            degree: subItem.degree,
          });
        });
      });
    });
  }
}
