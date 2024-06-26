import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { ListDataComponent } from '@app/components/list-data/list-data.component';
import { TableDataComponent } from '@app/components/table-data/table-data.component';
import { ICategory } from '@app/core/interfaces/Categories';
import { TableAction, getEntityPropiedades } from '@app/core/interfaces/Table-Column';
import { AlertsService } from '@app/core/services/alerts.service';
import { CategoryService } from '@app/core/services/category.service';
import { LocalstorageService } from '@app/core/services/localstorage.service';
import SpinnerComponent from '@app/shared/spinner/spinner.component';
import { map } from 'rxjs';

@Component({
  standalone: true,
  imports: [TableDataComponent, ListDataComponent, RouterModule, SpinnerComponent],
  templateUrl: './list.component.html',
  styles: ``,
  providers: [CategoryService]
})
export default class ListComponent implements OnInit {
  categories: ICategory[] = [];
  columns: string[] = [];
  title: string = 'Categorias';
  showFirstChild = true;

  // Comparar el tamaño de la pantalla
  private breakpointObserver = inject(BreakpointObserver);
  private isMobile$ = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
  isMobile = toSignal(this.isMobile$, { initialValue: false });

  constructor(private categorySercice: CategoryService, private lsService: LocalstorageService, 
    private alertService: AlertsService, private router: Router) {
  }

  ngOnInit(): void {
    const tokenValidate = this.lsService.validateToken();

    if (tokenValidate) {
      window.location.reload();
    }

    this.getValues();
  }

  getValues() {
    this.columns = getEntityPropiedades('category');

    this.categorySercice.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onAction(action: TableAction) {
    if (action.action == 'Editar') {
      this.edit(action.row.id)
    } else if (action.action == 'Eliminar') {
      this.alertService.confirmBox('Estas a punto de eliminar esta categoía').then((result) => {
        if (result.isConfirmed) {
          this.alertService.success('Categoria eliminada con éxito');
          this.delete(action.row.id);
        }
      });
    }
  }

  edit(id: number) {
    this.router.navigate(['/categorias/edit', id]);
  }

  delete(id: number) {
    this.categorySercice.deleteCategory(id.toString()).subscribe({
      next: (data: any) => {
        this.showFirstChild = false;
        setTimeout(() => {this.getValues(), this.showFirstChild = true}, 0);
      },
      error: (error) => {
        this.alertService.error(undefined, 'Hubo un problema al eliminar la categoría, por favor intente de nuevo');
        console.error(error);
      }
    })
  }
}
