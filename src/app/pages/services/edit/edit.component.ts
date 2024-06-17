import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ICategory } from '@app/core/interfaces/Categories';
import { IService } from '@app/core/interfaces/Services';
import { CategoryService } from '@app/core/services/category.service';
import { LocalstorageService } from '@app/core/services/localstorage.service';
import { ServiceService } from '@app/core/services/service.service';
import SpinnerComponent from '@app/shared/spinner/spinner.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, SpinnerComponent],
  templateUrl: './edit.component.html',
  styles: ``
})
export default class EditComponent {
  ServiceForm!: FormGroup;
  categoryData: ICategory[] = [];
  serviceData: IService = {} as IService;
  idService: string = this.router.url.split('/')[3];

  constructor(private servicesService: ServiceService, private categoryService: CategoryService,
    private lsService: LocalstorageService, private router: Router, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    const tokenValidate = this.lsService.validateToken();

    if (tokenValidate) {
      window.location.reload();
    }

    this.getCategoryData();

    this.ServiceForm = this.fb.group({
      id: [this.idService],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      image: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      durationMin: ['', [Validators.required, Validators.pattern(/^(?:[1-9]?[0-9]|[12][0-9]{2}|300)$/)]],
      durationMax: [null, [Validators.pattern(/^(?:[1-9]?[0-9]?|[12][0-9]{2}|300)?$/)]],
      state: ['', [Validators.required]],
      category_id: ['', [Validators.required]],
    });

    this.getServicesDataById(this.idService);
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

  getServicesDataById(id: string) {
    this.servicesService.getServiceById(id).subscribe({
      next: (data: any) => {
        const datos = data.data;
        this.ServiceForm.patchValue(datos);
        this.ServiceForm.get('durationMin')?.setValue(datos.duration[0]);
        this.ServiceForm.get('durationMax')?.setValue(datos.duration[1]);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  updateService() {
    if (this.ServiceForm.invalid) {
      return;
    }

    let duration!: number[];
    if ((this.ServiceForm.value.durationMax !== undefined || this.ServiceForm.value.durationMax !== null) &&
      (this.ServiceForm.value.durationMin <= this.ServiceForm.value.durationMax)) {
      duration = [this.ServiceForm.value.durationMin, this.ServiceForm.value.durationMax];
    } else if (this.ServiceForm.value.durationMax === undefined || this.ServiceForm.value.durationMax === null) {
      duration = [this.ServiceForm.value.durationMin];
    } else {
      console.log('La duración máxima debe ser mayor a la mínima');
      return;
    }

    this.ServiceForm.value.duration = duration;
    delete this.ServiceForm.value.durationMin;
    delete this.ServiceForm.value.durationMax;

    this.serviceData = this.ServiceForm.value;
    console.log(this.serviceData);
    this.servicesService.updateService(this.serviceData).subscribe({
      next: (resp: any) => {
        console.log(resp);
      },
      complete: () => {
        this.router.navigate(['/servicios']);
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

  get state() {
    return this.ServiceForm.get('state') as FormGroup;
  }

  get category_id() {
    return this.ServiceForm.get('category_id') as FormGroup;
  }
}
