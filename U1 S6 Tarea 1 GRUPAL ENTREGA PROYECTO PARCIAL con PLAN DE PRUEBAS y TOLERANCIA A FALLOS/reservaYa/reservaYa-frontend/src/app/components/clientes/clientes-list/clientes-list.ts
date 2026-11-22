import { ChangeDetectorRef ,Component, inject, OnInit } from '@angular/core';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { Navbar } from '../../layout/navbar/navbar';
import { Cliente } from '../../../services/cliente/cliente';
import { Clientes } from '../../../models/cliente/cliente';
import { MatButtonModule } from '@angular/material/button';
import { ClienteModal } from '../cliente-modal/cliente-modal';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-clientes-list',
  imports: [Sidebar, Navbar, MatButtonModule],
  templateUrl: './clientes-list.html',
  styleUrl: './clientes-list.css',
})
export class ClientesList implements OnInit{
  listaClientes: Clientes[] = [];
  private dialog = inject(MatDialog);
  
  constructor(
    private clienteService: Cliente,
    private cdr: ChangeDetectorRef
  ){}

  // Carga inicial de clientes al montar el componente
  ngOnInit(): void{
    this.listarClientes();
  }

  // Consulta todos los clientes desde la API y refresca la vista
  private listarClientes(){
    this.clienteService.obtenerClientes().subscribe({
      next: (data) =>{
        this.listaClientes = data;
        this.cdr.detectChanges();
      },
      error: (e) =>{
        console.error('Error al listar espacios', e);
      }
    });
  }

  // Abre el modal en modo creación y recarga el listado si se guarda un cliente
  abrirModalClienteCrear(){
    const dialogRef = this.dialog.open(ClienteModal, {
      width: 'auto',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.listarClientes();
      }
    });
  }

  // Abre el modal en modo edición con los datos del cliente seleccionado
  abrirModalClienteEditar(clienteSeleccionado: any){
    const dialogRef = this.dialog.open(ClienteModal, {
      width: 'auto',
      data: clienteSeleccionado
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.listarClientes();
      }
    });
  }

  // Solicita confirmación y elimina el cliente indicado mediante el servicio
  eliminar(idCliente: number){
    if(!confirm('¿Estás seguro de que desea eliminar este espacio?')){ return }

    this.clienteService.eliminarCliente(idCliente).subscribe({
      next: (response: any) => {
        console.log('Cliente eliminado con éxito');
        this.listarClientes();
      },
      error: (e) =>{
        console.error('Error al eliminar el cliente: ', e);
        alert('Hubo un error al intentar eliminar el cliente.');
      }
    })
  }
}
