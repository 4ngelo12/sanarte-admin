import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICategory } from '@app/core/interfaces/Categories';
import { INewService } from '@app/core/interfaces/Services';
import { CategoryService } from '@app/core/services/category.service';
import { LocalstorageService } from '@app/core/services/localstorage.service';
import { ServiceService } from '@app/core/services/service.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './create.component.html',
  styles: ``
})
export default class CreateComponent implements OnInit {
  ServiceForm!: FormGroup;
  serviceData: INewService = {} as INewService;
  categoryData: ICategory[] = [];

  constructor(private servicesService: ServiceService, private categoryService: CategoryService,
    private lsService: LocalstorageService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    const tokenValidate = this.lsService.validateToken();

    if (tokenValidate) {
      window.location.reload();
    }

    this.getCategoryData();

    this.ServiceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      image: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      durationMin: ['', [Validators.required, Validators.pattern(/^(?:[1-9]?[0-9]|[12][0-9]{2}|300)$/)]],
      durationMax: [null, [Validators.pattern(/^(?:[1-9]?[0-9]?|[12][0-9]{2}|300)?$/)]],
      category_id: ['', [Validators.required]],
    });
  }

  getCategoryData() {
    this.categoryService.getCategories().subscribe({
      next: (data: any) => {
        this.categoryData = data.data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  submitService() {
    if (this.ServiceForm.invalid) {
      return;
    }

    let duration!: number[];
    if (this.ServiceForm.value.durationMax !== null &&
      (this.ServiceForm.value.durationMin <= this.ServiceForm.value.durationMax)) {
      duration = [this.ServiceForm.value.durationMin, this.ServiceForm.value.durationMax];
    } else if (this.ServiceForm.value.durationMax === null) {
      duration = [this.ServiceForm.value.durationMin];
    } else {
      console.log('La duración máxima debe ser mayor a la mínima');
      return;
    }

    this.ServiceForm.value.duration = duration;
    delete this.ServiceForm.value.durationMin;
    delete this.ServiceForm.value.durationMax;

    this.serviceData = this.ServiceForm.value;
    this.servicesService.newService(this.serviceData).subscribe({
      next: (resp: any) => {
        this.ServiceForm.reset();
        console.log(resp);
      },
      complete: () => {
        console.log('Service created');
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  // Validaciones del teclado
  onKeyPress(event: KeyboardEvent) {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace'];
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  // Validaciones del formulario
  get name() {
    return this.ServiceForm.get('name') as FormGroup;
  }

  get description() {
    return this.ServiceForm.get('description') as FormGroup;
  }

  get image() {
    return this.ServiceForm.get('image') as FormGroup;
  }

  get price() {
    return this.ServiceForm.get('price') as FormGroup;
  }

  get durationMin() {
    return this.ServiceForm.get('durationMin') as FormGroup;
  }

  get durationMax() {
    return this.ServiceForm.get('durationMax') as FormGroup;
  }

  get category_id() {
    return this.ServiceForm.get('category_id') as FormGroup;
  }
}
