import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { Navbar } from '../../layout/navbar/navbar';
import { Espacio } from '../../../services/espacio/espacio';
import { Espacios } from '../../../models/espacio/espacio';
import { MatButtonModule } from '@angular/material/button';
import { EspacioModal } from '../espacio-modal/espacio-modal';
import { MatDialog } from '@angular/material/dialog';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-espacios-list',
  imports: [Sidebar, Navbar, MatButtonModule, NgClass],
  templateUrl: './espacios-list.html',
  styleUrl: './espacios-list.css',
})
export class EspaciosList implements OnInit{
  listaEspacio: Espacios[] = [];
  private dialog = inject(MatDialog);

  constructor(
    private espacioService: Espacio,
    private cdr: ChangeDetectorRef
  ){}

  // Carga inicial de espacios al montar el componente
  ngOnInit(): void{
    this.listarEspacios();
  }

  // Obtiene todos los espacios desde el servicio y actualiza la vista
  private listarEspacios(){
    this.espacioService.obtenerEspacios().subscribe({
      next: (data) => {
        this.listaEspacio = data;
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('Error al listar espacios', e);
      }
    });
  }

  // Abre el modal en modo creación y refresca el listado si se guarda un nuevo espacio
  abrirModalEspacioCrear(){
    const dialogRef = this.dialog.open(EspacioModal, {
      width: 'auto',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true){
        this.listarEspacios();
      }
    });
  }

  // Abre el modal en modo edición con los datos del espacio seleccionado
  abrirModalEspacioEditar(espacioSeleccionado: any){
    const dialogRef = this.dialog.open(EspacioModal, {
      width: 'auto',
      data: espacioSeleccionado
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.listarEspacios();
      }
    });
  }

  // Solicita confirmación y elimina el espacio indicado mediante el servicio
  eliminar(idEspacio: number){
    if(!confirm('¿Estás seguro de que deseas eliminar este espacio?')){ return }

    this.espacioService.eliminarEspacio(idEspacio).subscribe({
      next: (response: any) => {
        console.log('Espacio eliminado con éxito');
        this.listarEspacios();
      },
      error: (e) =>{
        console.error('Error al eliminar el espacio:', e);
        alert('Hubo un error al intentar eliminar el espacio.');
      }
    });
  }
}
