import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Auth } from '../../services/auth/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private auth: Auth, private router: Router) {}

  mensajeError = signal('');

  // Formulario reactivo con credenciales obligatorias de acceso
  formularioInicioSesion = new FormGroup({
    usuario: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  // Envía las credenciales al servicio de autenticación, guarda la sesión y navega al panel
  iniciarSesion(){
    this.mensajeError.set('');

    if(this.formularioInicioSesion.invalid){
      this.formularioInicioSesion.markAllAsTouched();
      this.mensajeError.set('Por favor, ingresa tu usuario y contraseña.');
      return;
    }

    const datos = {
      usuario : this.formularioInicioSesion.value.usuario ?? '',
      password: this.formularioInicioSesion.value.password ?? ''
    };

    this.auth.nuevoInicioSesion(datos).subscribe({
      next: (respuesta: any) => {
        if(respuesta.status === 'success'){
          localStorage.setItem('usuario', JSON.stringify(respuesta));
          this.router.navigate(['/dashboard']);
        }else{
          this.mensajeError.set(respuesta.mensaje || 'Usuario o contraseña incorrectos.');
        }
      },
      error: (e) => {
        console.error('Error en la petición: ', e);
        this.mensajeError.set(e.error?.mensaje || 'No se pudo conectar con el servidor.');
      }
    });
  }

  // Quita el mensaje de error cuando el usuario vuelve a escribir
  limpiarError(){
    this.mensajeError.set('');
  }
}
