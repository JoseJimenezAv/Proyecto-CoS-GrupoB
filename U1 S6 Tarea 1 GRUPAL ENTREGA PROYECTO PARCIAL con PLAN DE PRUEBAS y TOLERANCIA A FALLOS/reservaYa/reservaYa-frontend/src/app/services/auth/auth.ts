import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  // Endpoint del backend para validar credenciales de inicio de sesión
  readonly API_URL = 'http://localhost/reservaYa/reservaYa-api/auth/login.php';

  constructor(private http: HttpClient){}

  // Envía usuario y contraseña mediante POST para iniciar sesión
  nuevoInicioSesion(nuevoInicio: {usuario: string, password: string}){
    return this.http.post<any>(this.API_URL, nuevoInicio);
  }
}
