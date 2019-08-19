import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carga-imagen-perfil',
  templateUrl: './carga-imagen-perfil.page.html',
  styleUrls: ['./carga-imagen-perfil.page.scss'],
})
export class CargaImagenPerfilPage implements OnInit {

  // Parámetro del usuario
  usuario: any;

  // Parámetros del usuario
  nombre: string;
  apellidos: string;
  clave: string;
  idComuna: string;
  correoElectronico: string;
  direccion: string;
  nombreUsuario: string;
  rut: string;
  tipo: string;
  idUsuario: string;

  // Variables de tomar foto
  correctPath = '';
  currentName = '';

  // Arreglo de imágenes
  images = [];

  // Variable de path de imagen
  FilePath = '';

  constructor(
    public activateRoute: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    // Recepción de datos
    const dataUsuarioRecv = this.activateRoute.snapshot.paramMap.get('usuariObj');
    // Parseo de objetos
    this.usuario = JSON.parse(dataUsuarioRecv);
    console.log(this.usuario);
  }

  saltoPaginaComprador() {
    // Carga de datos
    this.nombre = this.usuario.nombre;
    this.apellidos = this.usuario.apellidos;
    this.clave = this.usuario.clave;
    this.idComuna = this.usuario.idComuna;
    this.correoElectronico = this.usuario.correo;
    this.direccion = this.usuario.direccion;
    this.nombreUsuario = this.usuario.nombreUsuario;
    this.rut = this.usuario.rut;
    this.tipo = this.usuario.tipoUsuario;
    this.idUsuario = this.usuario.idUsuario;
    // Envío de datos
    this.router.navigate(['/comprador', this.nombre, this.apellidos,
      this.clave, this.idComuna, this.correoElectronico, this.direccion,
      this.nombreUsuario, this.rut, this.tipo, this.idUsuario]);
  }

  nada() {
  }

}
