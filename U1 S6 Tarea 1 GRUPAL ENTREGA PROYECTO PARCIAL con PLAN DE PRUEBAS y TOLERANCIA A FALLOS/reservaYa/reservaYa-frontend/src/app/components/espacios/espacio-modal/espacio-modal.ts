import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Espacio } from '../../../services/espacio/espacio';

@Component({
  selector: 'app-espacio-modal',
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './espacio-modal.html',
  styleUrl: './espacio-modal.css',
})
export class EspacioModal implements OnInit{
  mensajeError = signal('');
  esModoEditar: boolean = false;
  espacioId: number | null = null;

  // Formulario reactivo con los campos y validaciones requeridas para un espacio
  espacioModalFormulario = new FormGroup({
    nombre: new FormControl('', Validators.required),
    tipo:  new FormControl('', Validators.required),
    capacidad: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    precio_hora: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    estado: new FormControl('', Validators.required)
  });

  constructor(
    private espacioService: Espacio,
    private dialogRef: MatDialogRef<EspacioModal>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  // Configura el modo edición y precarga los valores si se recibe un espacio existente
  ngOnInit(): void{
    if(this.data && this.data.id_espacio){
      this.esModoEditar = true;
      this.espacioId = this.data.id_espacio;

      this.espacioModalFormulario.patchValue({
        nombre: this.data.nombre,
        tipo: this.data.tipo,
        capacidad: this.data.capacidad,
        precio_hora: this.data.precio_hora,
        estado: this.data.estado
      });
    }
  }

  // Indica si un campo es inválido y ya fue tocado (para marcarlo en rojo)
  campoInvalido(nombre: string): boolean {
    const control = this.espacioModalFormulario.get(nombre);
    return !!control && control.invalid && control.touched;
  }

  // Valida el formulario y envía los datos para actualizar o crear el espacio vía API
  guardar(){
    if(this.espacioModalFormulario.invalid){
      this.espacioModalFormulario.markAllAsTouched();
      this.mensajeError.set('Por favor, completa todos los campos requeridos correctamente.');
      return;
    }

    this.mensajeError.set('');
    const formValues = this.espacioModalFormulario.value;

    // Ejecuta actualización si está en modo edición o creación si es un registro nuevo
    if(this.esModoEditar && this.espacioId){
      this.espacioService.actualizarEspacio(this.espacioId, formValues).subscribe({
        next: (response: any) =>{
          if(response && response.success){
            this.dialogRef.close(true);
          }else{
            this.mensajeError.set(response.message || 'Hubo un fallo al actualizar los datos');
          }
        },
        error: (error) =>{
          console.error('Error en el servidor:', error);
          this.mensajeError.set('Hubo un fallo en el servidor al actualizar. Inténtalo de nuevo');
        }
      });
    } else{
      this.espacioService.crearEspacio(formValues).subscribe({
        next:(response: any) =>{
          if(response && response.success){
            this.dialogRef.close(true);
          } else{
            this.mensajeError.set(response.message || 'Hubo un fallo al procesar los datos');
          }
        },
        error: (error) =>{
          console.error('Error en el servidor:', error);
          this.mensajeError.set('Faltaron datos o hubo un fallo en el servidor. Inténtalo de nuevo.');
        }
      });
    }
  }
}