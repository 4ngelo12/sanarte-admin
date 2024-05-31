import { Component, OnInit, inject } from '@angular/core';
import { ListDataComponent } from '@app/components/list-data/list-data.component';
import { TableDataComponent } from '@app/components/table-data/table-data.component';
import { ICategory } from '@app/core/interfaces/Categories';
import { TableAction, getEntityPropiedades } from '@app/core/interfaces/Table-Column';
import { CategoryService } from '@app/core/services/category.service';
import { LocalstorageService } from '@app/core/services/localstorage.service';


@Component({
  standalone: true,
  imports: [TableDataComponent, ListDataComponent],
  templateUrl: './categorias.component.html',
  styles: ``,
  providers: [CategoryService]
})
export default class CategoriasComponent implements OnInit {
  categories: ICategory[] = [];
  columns: string[] = [];
  title: string = 'Categorias';


  constructor(private categorySercice: CategoryService, private lsService: LocalstorageService) {

  }

  ngOnInit(): void {
    const tokenValidate = this.lsService.validateToken();
    
    if (tokenValidate) {
      window.location.reload();
    }

    this.columns = getEntityPropiedades('category');

    this.categorySercice.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data.data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onAction(action: TableAction) {
    if (action.action == 'Editar') {
      this.edit(action.row)
    } else if (action.action == 'Eliminar') {
      this.delete(action.row.name)
    }
  }

  edit(objeto: any) {
    console.log("editar", objeto)
  }

  delete(name: string) {
    console.log("eliminar", name)
  }
}
