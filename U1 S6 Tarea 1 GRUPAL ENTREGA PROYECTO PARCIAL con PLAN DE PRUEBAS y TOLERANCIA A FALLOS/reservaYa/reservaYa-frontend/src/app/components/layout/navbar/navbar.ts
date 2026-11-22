import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit{
  nombreUsuario: string = '';
  tituloPagina: string = 'Inicio';

  constructor(private router: Router){}

  // Carga los datos del usuario y mantiene sincronizado el título con la navegación del router
  ngOnInit(): void {
    this.cargarDatos();

    this.actualizarTitulo(this.router.url);
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) =>{
      this.actualizarTitulo(event.urlAfterRedirects || event.url);
    });
  }

  // Lee el nombre del usuario autenticado desde localStorage
  private cargarDatos() {
    const usuarioGuardado = localStorage.getItem('usuario');

    if(usuarioGuardado){
      const usuario = JSON.parse(usuarioGuardado);
      this.nombreUsuario = usuario.data.nombre;
    }
  }

  // Determina el título visible de la sección según la URL actual
  private actualizarTitulo(url: string): void{
    if(url.includes('/inicio') || url === '/'){
      this.tituloPagina = 'Inicio';
    } else if(url.includes('/espacios') || url === '/'){
      this.tituloPagina = 'Espacios';
    } else if(url.includes('/reservas') || url === '/'){
      this.tituloPagina = 'Reservas'
    } else if(url.includes('/clientes') || url === '/'){
      this.tituloPagina = 'Clientes'
    }
  }

  // Limpia la sesión almacenada y redirige a la pantalla de login
  cerrarSesion(){
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}
