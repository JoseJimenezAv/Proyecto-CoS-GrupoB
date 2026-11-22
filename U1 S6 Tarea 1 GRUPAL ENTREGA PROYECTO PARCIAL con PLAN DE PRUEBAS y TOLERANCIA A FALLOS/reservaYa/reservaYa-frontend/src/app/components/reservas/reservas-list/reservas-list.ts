import { ChangeDetectorRef ,Component, inject, OnInit } from '@angular/core';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { Navbar } from '../../layout/navbar/navbar';
import { Reserva } from '../../../services/reserva/reserva';
import { Reservas } from '../../../models/reserva/reserva';
import { MatButtonModule } from '@angular/material/button';
import { ReservaModal } from '../reserva-modal/reserva-modal'; 
import { MatDialog } from '@angular/material/dialog';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-reservas-list',
  imports: [Sidebar, Navbar, MatButtonModule, NgClass],
  templateUrl: './reservas-list.html',
  styleUrl: './reservas-list.css',
})
export class ReservasList implements OnInit{
  listaReservas: Reservas[] = [];
  private dialog = inject(MatDialog);

  constructor(
    private reservaService: Reserva,
    private cdr: ChangeDetectorRef
  ){}

  // Carga inicial de reservas al montar el componente
  ngOnInit(): void {
    this.listarReservas();
  }

  // Consulta todas las reservas desde la API y actualiza la vista
  private listarReservas(){
    this.reservaService.obtenerReservas().subscribe({
      next: (data) => {
        this.listaReservas = data;
        this.cdr.detectChanges();
      },
      error: (e) =>{
        console.error('Error al listar espacios', e);
      }
    });
  }

  // Abre el modal para crear una reserva y refresca la lista si se guarda correctamente
  abrirModalReservaCrear(){
    const dialogRef = this.dialog.open(ReservaModal, {
      width: 'auto',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.listarReservas();
      }
    });
  }

  // Confirma o cancela una reserva previa validación y refresca el listado
  cambiarEstado(reserva: Reservas, nuevoEstado: 'Confirmada' | 'Cancelada'){
    if(!reserva.id_reserva) return;
    if(reserva.estado === nuevoEstado) return;
    
    const mensaje = nuevoEstado === 'Confirmada'? '¿Deseas confirmar esta reserva?' : '¿Estás seguro de que deseas cancelar esta reserva?';
    
    if(!confirm(mensaje)) return;
    
    const reservaActualizada: Reservas ={
      ...reserva,
      estado: nuevoEstado
    };

    this.reservaService.actualizarReserva(reserva.id_reserva ,reservaActualizada).subscribe({
      next: () =>{
        this.listarReservas();
      },
      error: (e) => {
        console.error('Error al actualizar el estado de la reserva:', e);
        alert('No se pudo actualizar el estado de la reserva.');
      }
    });
  }
}
