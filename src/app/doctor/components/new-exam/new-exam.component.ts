import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DoctorService } from '../../services/doctor.service';

@Component({
  selector: 'app-new-exam',
  templateUrl: './new-exam.component.html',
  styleUrls: ['./new-exam.component.scss'],
})
export class NewExamComponent implements OnInit {
  name = new FormControl('');
  questionForm!: FormGroup;
  correctNum: any;
  questions: any[] = [];
  startAdd: boolean = false;
  preview: boolean = false;
  stepperIndex = 0;
  subjectName: any = '';
  id: any;
  // Num: any[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]

  constructor(
    private fb: FormBuilder,
    private tostar: ToastrService,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.questionForm = this.fb.group({
      question: ['', [Validators.required]],
      answer1: ['', [Validators.required]],
      answer2: ['', [Validators.required]],
      answer3: ['', [Validators.required]],
      answer4: ['', [Validators.required]],
    });
  }

  createQuestion() {
    if (this.correctNum) {
      const Model = {
        question: this.questionForm.value.question,
        answer1: this.questionForm.value.answer1,
        answer2: this.questionForm.value.answer2,
        answer3: this.questionForm.value.answer3,
        answer4: this.questionForm.value.answer4,
        correctAnswer: this.questionForm.value[this.correctNum],
      };
      this.questions.push(Model);
      this.questionForm.reset();
    } else {
      this.tostar.error('يرجي اختيار الاجابة الصحيحه');
    }
  }

  start() {
    if (this.name.value == '') {
      this.tostar.error('يرجي ادخال اسم المادة');
    } else {
      this.subjectName = this.name.value;
      this.startAdd = true;
    }
    if (this.startAdd) {
      this.stepperIndex = 1;
    }
  }

  clearForm() {
    this.questionForm.reset();
  }

  cancel() {
    this.questionForm.reset();
    this.questions = [];
    this.subjectName = '';
    this.stepperIndex = 0;
    this.startAdd = false;
  }

  getCorrect(event: any) {
    this.correctNum = event.value;
  }

  submit() {
    const model = {
      name: this.subjectName,
      questions: this.questions,
    };
    if (this.preview) {
      this.stepperIndex = 2;
    } else {
      this.doctorService.createSubject(model).subscribe((res: any) => {
        this.preview = true;
        this.id = res.id;
      });
    }
  }

  delete(index: number) {
    this.questions.splice(index, 1);
    const model = {
      name: this.subjectName,
      questions: this.questions,
    };
    this.doctorService.updateSubject(model, this.id).subscribe((res: any) => {
      this.tostar.success('تم حذف السؤال بنجاح');
    });
  }

  Updated(index: number) {
    const model = {
      name: this.subjectName,
      questions: this.questions,
    };
    this.doctorService.updateSubject(model, this.id).subscribe((res: any) => {
      console.log(res);
    });
  }
}
