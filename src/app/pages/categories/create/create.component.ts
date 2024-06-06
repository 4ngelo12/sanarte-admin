import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { INewCategory } from '@app/core/interfaces/Categories';
import { CategoryService } from '@app/core/services/category.service';
import { LocalstorageService } from '@app/core/services/localstorage.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './create.component.html',
  styles: ``
})
export default class CreateComponent implements OnInit {
  Categoryform!: FormGroup;
  categoryData: INewCategory = {} as INewCategory;

  constructor(private categoryService: CategoryService, private lsService: LocalstorageService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    const tokenValidate = this.lsService.validateToken();
    if (tokenValidate) {
      window.location.reload();
    }

    this.Categoryform = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      warning: ['', [Validators.minLength(10)]],
      image: ['', [Validators.required]]
    });
  }

  categorySubmit() {
    if (this.Categoryform.invalid) {
      return;
    }

    if (this.Categoryform.value.warning === '') {
      this.Categoryform.value.warning = null;
    }

    this.categoryData = this.Categoryform.value;
    this.categoryService.newCategory(this.categoryData).subscribe({
      next: (resp: any) => {
        this.Categoryform.reset();
        console.log(resp);
      },
      complete: () => {
        console.log('Category created');
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  // Validaciones del formulario

  get name() {
    return this.Categoryform.get('name') as FormGroup;
  }

  get description() {
    return this.Categoryform.get('description') as FormGroup;
  }

  get warning() {
    return this.Categoryform.get('warning') as FormGroup;
  }

  get image() {
    return this.Categoryform.get('image') as FormGroup;
  }
}
