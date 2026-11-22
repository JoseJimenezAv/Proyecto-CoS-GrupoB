import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Reserva } from '../../../services/reserva/reserva';
import { Espacio } from '../../../services/espacio/espacio';
import { Cliente } from '../../../services/cliente/cliente';

@Component({
  selector: 'app-reserva-modal',
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './reserva-modal.html',
  styleUrl: './reserva-modal.css',
})
export class ReservaModal implements OnInit {
  mensajeError = signal('');
  listaClientes = signal<any[]>([]);
  listaEspacios = signal<any[]>([]);
  fechaMinima: string = '';

  // Formulario reactivo con los datos obligatorios de la reserva y estado inicial pendiente
  reservaModalFormulario = new FormGroup({
    id_cliente: new FormControl('', Validators.required),
    id_espacio: new FormControl('', Validators.required),
    fecha: new FormControl('', Validators.required),
    hora_inicio: new FormControl('', Validators.required),
    hora_fin: new FormControl('', Validators.required),
    estado: new FormControl('Pendiente', Validators.required)
  });

  constructor(
    private reservaService: Reserva,
    private clienteService: Cliente,
    private espacioService: Espacio,
    private dialogRef: MatDialogRef<ReservaModal>
  ) {
    this.fechaMinima = this.obtenerFechaHoyLocal();
  }

  // Carga los catálogos de clientes y espacios al inicializar el modal
  ngOnInit(): void {
    this.cargarClientes();
    this.cargarEspacios();
  }

  // Obtiene la fecha actual en formato YYYY-MM-DD según la zona horaria local
  private obtenerFechaHoyLocal(): string {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }

  // Obtiene la lista de clientes disponibles para el selector del formulario
  private cargarClientes() {
    this.clienteService.obtenerClientes().subscribe({
      next: (data: any) => {
        this.listaClientes.set(Array.isArray(data) ? data : (data.data || []));
      },
      error: (err) => console.error('Error al cargar clientes:', err)
    });
  }

  // Obtiene la lista de espacios disponibles para el selector del formulario
  private cargarEspacios() {
    this.espacioService.obtenerEspacios().subscribe({
      next: (data: any) => {
        this.listaEspacios.set(Array.isArray(data) ? data : (data.data || []));
      },
      error: (err) => console.error('Error al cargar espacios:', err)
    });
  }

  // Indica si un campo es inválido y ya fue tocado (para marcarlo en rojo)
  campoInvalido(nombre: string): boolean {
    const control = this.reservaModalFormulario.get(nombre);
    return !!control && control.invalid && control.touched;
  }

  // Quita el mensaje de error cuando el usuario modifica el formulario
  limpiarError() {
    this.mensajeError.set('');
  }

  // Valida campos, fecha mínima y coherencia horaria antes de registrar la reserva vía API
  guardar() {
    if (this.reservaModalFormulario.invalid) {
      this.reservaModalFormulario.markAllAsTouched();
      this.mensajeError.set('Por favor, completa todos los campos requeridos correctamente.');
      return;
    }

    const formValues = this.reservaModalFormulario.value;

    // Impide registrar reservas en fechas pasadas y verifica que la hora de fin sea posterior al inicio
    if (formValues.fecha && formValues.fecha < this.fechaMinima) {
      this.mensajeError.set('No puedes registrar una reserva en una fecha anterior a hoy.');
      return;
    }

    if (formValues.hora_inicio && formValues.hora_fin && formValues.hora_fin <= formValues.hora_inicio) {
      this.mensajeError.set('La hora de fin debe ser mayor que la hora de inicio.');
      return;
    }

    this.mensajeError.set('');

    this.reservaService.crearReservas(formValues).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.dialogRef.close(true);
        } else {
          this.mensajeError.set(response?.error || response?.message || 'No se pudo crear la reserva.');
        }
      },
      error: (error) => {
        console.error('Error en el servidor:', error);
        this.mensajeError.set(error.error?.error || error.error?.message || 'No se pudo registrar la reserva (verifica horario o disponibilidad).');
      }
    });
  }
}