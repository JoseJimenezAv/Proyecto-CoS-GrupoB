import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Clientes } from '../../models/cliente/cliente';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Cliente {
  // Endpoints del backend en PHP para operaciones CRUD de clientes
  readonly API_URL_GET = 'http://localhost/reservaYa/reservaYa-api/api/clientes/listarClientes.php';
  readonly API_URL_POST = 'http://localhost/reservaYa/reservaYa-api/api/clientes/crearCliente.php';
  readonly API_URL_PUT = 'http://localhost/reservaYa/reservaYa-api/api/clientes/actualizarCliente.php';
  readonly API_URL_DELETE = 'http://localhost/reservaYa/reservaYa-api/api/clientes/eliminarCliente.php';

  constructor(private http: HttpClient){}

  // Obtiene el listado completo de clientes
  obtenerClientes(): Observable<Clientes[]>{
    return this.http.get<Clientes[]>(this.API_URL_GET);
  }

  // Registra un nuevo cliente en la base de datos
  crearCliente(nuevoCliente: any): Observable<Clientes>{
    return this.http.post<Clientes>(this.API_URL_POST, nuevoCliente);
  }

  // Actualiza los datos de un cliente existente por su ID
  actualizarCliente(id_cliente: number, datosActualizados: any): Observable<any>{
    return this.http.put<any>(this.API_URL_PUT, {...datosActualizados, id_cliente});
  }

  // Elimina un cliente enviando el ID en el cuerpo de la petición DELETE
  eliminarCliente(id_cliente: number){
    return this.http.request('delete', `${this.API_URL_DELETE}`,{
      body: { id_cliente }
    });
  }

}
