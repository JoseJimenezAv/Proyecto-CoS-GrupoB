import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cliente } from '../../../services/cliente/cliente';

@Component({
  selector: 'app-cliente-modal',
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './cliente-modal.html',
  styleUrl: './cliente-modal.css',
})
export class ClienteModal implements OnInit{
  mensajeError = signal('');
  esModoEditar: boolean = false;
  clienteId: number | null = null;

  // Formulario reactivo con los campos obligatorios del cliente
  clienteModalFormulario = new FormGroup({
    nombre_completo: new FormControl('', Validators.required),
    cedula: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
    telefono: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
    correo: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(
    private clienteService: Cliente,
    private dialogRef: MatDialogRef<ClienteModal>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ){}

  // Inicializa el modo edición y precarga datos si se recibe un cliente existente
  ngOnInit(): void {
    if(this.data && this.data.id_cliente){
      this.esModoEditar = true;
      this.clienteId = this.data.id_cliente;

      this.clienteModalFormulario.patchValue({
        nombre_completo: this.data.nombre_completo,
        cedula: this.data.cedula,
        telefono: this.data.telefono,
        correo: this.data.correo
      });
    }
  }

  // Indica si un campo es inválido y ya fue tocado (para marcarlo en rojo)
  campoInvalido(nombre: string): boolean {
    const control = this.clienteModalFormulario.get(nombre);
    return !!control && control.invalid && control.touched;
  }

  // Quita el mensaje de error cuando el usuario vuelve a escribir
  limpiarError(){
    this.mensajeError.set('');
  }

  // Extrae el mensaje que envía el backend (acepta 'mensaje' o 'message')
  private obtenerMensaje(error: any, porDefecto: string): string {
    return error?.error?.mensaje || error?.error?.message || porDefecto;
  }

  // Valida el formulario y envía la petición de creación o actualización al servicio
  guardar(){
    if(this.clienteModalFormulario.invalid){
      this.clienteModalFormulario.markAllAsTouched();
      this.mensajeError.set('Por favor, completa todos los campos correctamente (cédula de 10 dígitos y correo válido).');
      return;
    }

    this.mensajeError.set('');
    const formValues = this.clienteModalFormulario.value;

    const peticion = (this.esModoEditar && this.clienteId)
      ? this.clienteService.actualizarCliente(this.clienteId, formValues)
      : this.clienteService.crearCliente(formValues);

    peticion.subscribe({
      next: (response: any) => {
        if(response && (response.success || response.status === 'success')){
          this.dialogRef.close(true);
        }else{
          this.mensajeError.set(response?.mensaje || response?.message || 'Hubo un fallo al procesar los datos');
        }
      },
      error: (error) => {
        console.error('Error en el servidor:', error);
        this.mensajeError.set(this.obtenerMensaje(error, 'Hubo un fallo en el servidor. Inténtalo de nuevo.'));
      }
    });
  }
}