import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ICategory } from '@app/core/interfaces/Categories';
import { AlertsService } from '@app/core/services/alerts.service';
import { CategoryService } from '@app/core/services/category.service';
import { LocalstorageService } from '@app/core/services/localstorage.service';
import SpinnerComponent from '@app/shared/spinner/spinner.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, SpinnerComponent],
  templateUrl: './edit.component.html',
  styles: ``
})
export default class EditComponent implements OnInit {
  Categoryform!: FormGroup;
  categoryData: ICategory = {} as ICategory;
  idCategory: string = this.router.url.split('/')[3];

  constructor(private categoryService: CategoryService, private lsService: LocalstorageService,
    private alertService: AlertsService, private router: Router, private fb: FormBuilder) { }

  async ngOnInit(): Promise<void> {
    const tokenValidate = this.lsService.validateToken();
    if (tokenValidate) {
      window.location.reload();
    }

    this.Categoryform = this.fb.group({
      id: [this.idCategory],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      warning: ['', [Validators.minLength(10)]],
      image: ['', [Validators.required]]
    });

    await this.getCategoryDataById(this.idCategory);
  }

  async getCategoryDataById(id: string) {
    this.categoryService.getCategoryById(id).subscribe({
      next: (data: any) => {
        this.Categoryform.patchValue(data.data);
      },
      error: (error) => {
        this.alertService.error(undefined, error.error.message);
        this.router.navigate(['/categorias']);
      }
    });
  }

  categoryUpdate() {
    if (this.Categoryform.invalid) {
      this.alertService.error(undefined, 'Formulario invalido, por favor llene los campos requeridos');
      return;
    }

    if (this.Categoryform.value.warning === '') {
      this.Categoryform.value.warning = null;
    }

    this.categoryData = this.Categoryform.value;
    this.categoryService.updateCategory(this.categoryData).subscribe({
      next: (resp: any) => {
        this.alertService.success(resp.message);
      },
      complete: () => {
        this.router.navigate(['/categorias']);
      },
      error: (err: any) => {
        this.alertService.error(undefined, 'Hubo un problema al actualizar la categoría, por favor intente de nuevo');
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
