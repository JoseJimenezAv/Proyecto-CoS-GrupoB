import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Espacios } from '../../models/espacio/espacio';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Espacio {
  // URLs de los endpoints del backend en PHP
  readonly API_URL_GET = 'http://localhost/reservaYa/reservaYa-api/api/espacios/listarEspacios.php'
  readonly API_URL_POST = 'http://localhost/reservaYa/reservaYa-api/api/espacios/crearEspacio.php'
  readonly API_URL_PUT = 'http://localhost/reservaYa/reservaYa-api/api/espacios/actualizarEspacio.php'
  readonly API_URL_DELETE = 'http://localhost/reservaYa/reservaYa-api/api/espacios/eliminarEspacio.php'

  constructor(private http: HttpClient){}

  // Obtiene el listado de espacios
  obtenerEspacios(): Observable<Espacios[]>{
    return this.http.get<Espacios[]>(this.API_URL_GET);
  }

  // Crea un nuevo espacio en la base de datos
  crearEspacio(nuevoEspacio: any): Observable<Espacios>{
    return this.http.post<Espacios>(this.API_URL_POST, nuevoEspacio);
  }

  // Actualiza los datos de un espacio existente por su ID
  actualizarEspacio(id_espacio: number, datosActualizados: any): Observable<any>{
    return this.http.put<any>(this.API_URL_PUT, {...datosActualizados, id_espacio});
  }

  // Elimina un espacio enviando el ID en el cuerpo de la petición DELETE
  eliminarEspacio(id_espacio: number){
    return this.http.request('delete', `${this.API_URL_DELETE}`,{
      body: { id_espacio }
    });
  }
}