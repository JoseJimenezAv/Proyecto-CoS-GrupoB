import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reservas } from '../../models/reserva/reserva';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Reserva {
  // Endpoints del backend en PHP para operaciones de reservas
  readonly API_URL_GET = 'http://localhost/reservaYa/reservaYa-api/api/reservas/listarReservas.php';
  readonly API_URL_POST = 'http://localhost/reservaYa/reservaYa-api/api/reservas/crearReserva.php';
  readonly API_URL_PUT = 'http://localhost/reservaYa/reservaYa-api/api/reservas/actualizarReserva.php';

  constructor(private http: HttpClient){}

  // Obtiene el listado completo de reservas
  obtenerReservas(): Observable<Reservas[]>{
    return this.http.get<Reservas[]>(this.API_URL_GET);
  }

  // Envía una nueva reserva al servidor
  crearReservas(nuevaReserva: any): Observable<Reservas>{
    return this.http.post<Reservas>(this.API_URL_POST, nuevaReserva);
  }

  // Actualiza los datos o el estado de una reserva existente por su ID
  actualizarReserva(id_reserva: number, datosActualizados: any): Observable<any>{
    return this.http.put<any>(this.API_URL_PUT, {...datosActualizados, id_reserva});
  }
}
