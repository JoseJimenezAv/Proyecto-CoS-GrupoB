import { ChangeDetectorRef ,Component, OnInit } from '@angular/core';
import { Sidebar } from '../layout/sidebar/sidebar';
import { Navbar } from '../layout/navbar/navbar';
import { Cliente } from '../../services/cliente/cliente';
import { Espacio } from '../../services/espacio/espacio';
import { Reserva } from '../../services/reserva/reserva';
import { Clientes } from '../../models/cliente/cliente';
import { EstadoReserva, Reservas } from '../../models/reserva/reserva';
import { Espacios } from '../../models/espacio/espacio';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [Sidebar, Navbar, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit{
  nombreUsuario: string = '';
  saludo = '';
  fechaHoy= '';
  cantidadReservasHoy: number = 0;
  espaciosDisponibles: number = 0;
  totalEspacios: number = 0;
  cantidadClientes: number = 0;

  proximasReservas: Reservas[] = [];

  constructor(
    private clienteService: Cliente,
    private espacioService: Espacio,
    private reservaService: Reserva,
    private cdr: ChangeDetectorRef
  ){}

  // Inicializa la sesión del usuario, saludo/fecha y carga los indicadores del panel
  ngOnInit(): void{
    this.cargarNombreUsuario();
    this.cargarSaludoYFecha();
    this.cargarReservas();
    this.cargarEspacios();
    this.cargarClientes();
  } 

  // Recupera el nombre del administrador autenticado desde localStorage
  private cargarNombreUsuario(): void{
    const rawUsuario = localStorage.getItem('usuario');
    if(rawUsuario){
      try{
        const sesion = JSON.parse(rawUsuario);
        this.nombreUsuario = sesion.data?.nombre ?? sesion.data?.usuario ?? '';
      } catch (e){
        console.error('Error al leer la sesión desde localStorage', e);
      }
    }
  }

  // Genera el saludo según la hora del día y formatea la fecha actual en español
  private cargarSaludoYFecha(): void{
    const ahora = new Date();
    const hora = ahora.getHours();
    this.saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';

    const texto = ahora.toLocaleDateString('es-EC', {
      weekday: 'long', day: 'numeric', month: 'long',
    });
    this.fechaHoy = texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  // Calcula las reservas activas de hoy y obtiene las próximas 5 reservas ordenadas por fecha y hora
  private cargarReservas(): void{
    this.reservaService.obtenerReservas().subscribe({
      next: (data: Reservas[]) => {
        const hoy = this.aISO(new Date());

        this.cantidadReservasHoy = data.filter(r => r.fecha?.substring(0, 10) === hoy && r.estado != 'Cancelada').length;

        this.proximasReservas = data.filter(r => r.fecha?.substring(0, 10) >= hoy && r.estado != 'Cancelada')
                                    .sort((a, b) => (a.fecha.substring(0, 10) + a.hora_inicio).localeCompare(b.fecha.substring(0, 10) + b.hora_inicio)).slice(0, 5);
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('Error al obtener reservas', e);
      }
    });
  }

  // Consulta los espacios para calcular el total y cuántos se encuentran disponibles
  private cargarEspacios(): void{
    this.espacioService.obtenerEspacios().subscribe({
      next: (data: Espacios[]) => {
        this.totalEspacios = data.length;
        this.espaciosDisponibles = data.filter(e => e.estado === 'Disponible').length;
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('Error al obtener espacios', e);
      }
    });
  }

  // Obtiene el total de clientes registrados en el sistema
  private cargarClientes(): void{
    this.clienteService.obtenerClientes().subscribe({
      next: (data: Clientes[]) => {
        this.cantidadClientes = data.length;
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('Error al obtener clientes', e);
      }
    });
  }

  // Formatea una fecha ISO a un formato legible para el usuario
  formatearFecha(fecha: string): string{
    const d = new Date(fecha.substring(0, 10) + 'T00:00:00');
    return d.toLocaleDateString('es-EC', {day: 'numeric', month: 'short', year: 'numeric'}).replace(/\./g, '');
  }

  // Devuelve la clase CSS correspondiente al estado de una reserva
  claseEstado(estado: EstadoReserva): string{
    switch(estado){
      case 'Confirmada': return 'confirmada';
      case 'Cancelada': return 'cancelada';
      default: return 'pendiente';
    }
  }

  // Convierte un objeto Date a formato YYYY-MM-DD en zona horaria local
  private aISO(d: Date): string {
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mes}-${dia}`;
  }
}
