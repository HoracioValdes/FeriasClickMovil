import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  // Variables de logueo automático
  nombreUsuarioLogueo = '';
  claveLogueo = '';
  confirmacionUsuario = false;
  confirmacionClave = false;

  usuario: any = [];
  data: Observable<any>;
  idUsuario: string;
  rut: string;
  nombre: string;
  apellidos: string;
  clave: string;
  idComuna: string;
  correoElectronico: string;
  direccion: string;
  nombreUsuario: string;
  tipo: string;

  constructor(
    private router: Router,
    public http: HttpClient,
    private storage: Storage
  ) {}

  obtenerDatosUsuario() {
    this.storage.get('nombreUsuario').then((val) => {
      this.nombreUsuarioLogueo = val;
      console.log(this.nombreUsuarioLogueo);
    });
    this.storage.get('clave').then((val) => {
      this.claveLogueo = val;
      console.log(this.claveLogueo);
    });
    if (this.nombreUsuarioLogueo.length > 0 && this.claveLogueo.length > 0) {
      this.logeoAutomatico(this.nombreUsuarioLogueo, this.claveLogueo);
      // console.log('listo para método');
    }
  }

  logeoAutomatico(nombreUsuario: string, clave: string) {
    const urlDos = 'http://www.feriasclick.escuela-fundacion-sol.cl/ferias/registro.php?opcion=2';
    const postDataDos = new FormData();
    // Agrego datos a la consulta
    postDataDos.append('nombreUsuario', nombreUsuario);
    postDataDos.append('clave', clave);
    // Consulta
    this.data = this.http.post(urlDos, postDataDos);
    // Recogida de datos
    this.data.subscribe(data => {
      this.usuario = data;
      console.log(data);

      // Revisión de resultado
      if (data.length >= 1) {
        // Revisión de tipo de usuario
        if (this.usuario[0].TIPO === 'COMPRADOR') {
          this.saltoPaginaComprador();
        } else if (this.usuario[0].TIPO === 'COMERCIANTE') {
          this.saltoPaginaComerciante();
        } else if (this.usuario[0].TIPO === 'REPARTIDOR') {
          this.saltoPaginaRepartidor();
        }
      }
    });
  }

  saltoPaginaComprador() {
    // Carga de datos
    this.nombre = this.usuario[0].NOMBRE;
    this.apellidos = this.usuario[0].APELLIDOS;
    this.clave = this.usuario[0].CLAVE;
    this.idComuna = this.usuario[0].ID_COMUNA;
    this.correoElectronico = this.usuario[0].CORREO_ELECTRONICO;
    this.direccion = this.usuario[0].DIRECCION;
    this.nombreUsuario = this.usuario[0].NOMBRE_USUARIO;
    this.rut = this.usuario[0].RUT;
    this.tipo = this.usuario[0].TIPO;
    this.idUsuario = this.usuario[0].ID_USUARIO;
    // Envío de datos
    this.router.navigate(['/comprador', this.nombre, this.apellidos,
      this.clave, this.idComuna, this.correoElectronico, this.direccion,
      this.nombreUsuario, this.rut, this.tipo, this.idUsuario]);
  }

  saltoPaginaComerciante() {
    // Carga de datos
    this.nombre = this.usuario[0].NOMBRE;
    this.apellidos = this.usuario[0].APELLIDOS;
    this.clave = this.usuario[0].CLAVE;
    this.idComuna = this.usuario[0].ID_COMUNA;
    this.correoElectronico = this.usuario[0].CORREO_ELECTRONICO;
    this.direccion = this.usuario[0].DIRECCION;
    this.nombreUsuario = this.usuario[0].NOMBRE_USUARIO;
    this.rut = this.usuario[0].RUT;
    this.tipo = this.usuario[0].TIPO;
    this.idUsuario = this.usuario[0].ID_USUARIO;
    // Envío de datos
    this.router.navigate(['/comerciante', this.nombre, this.apellidos,
      this.clave, this.idComuna, this.correoElectronico, this.direccion,
      this.nombreUsuario, this.rut, this.tipo, this.idUsuario]);
  }

  saltoPaginaRepartidor() {
    // Carga de datos
    this.nombre = this.usuario[0].NOMBRE;
    this.apellidos = this.usuario[0].APELLIDOS;
    this.clave = this.usuario[0].CLAVE;
    this.idComuna = this.usuario[0].ID_COMUNA;
    this.correoElectronico = this.usuario[0].CORREO_ELECTRONICO;
    this.direccion = this.usuario[0].DIRECCION;
    this.nombreUsuario = this.usuario[0].NOMBRE_USUARIO;
    this.rut = this.usuario[0].RUT;
    this.tipo = this.usuario[0].TIPO;
    this.idUsuario = this.usuario[0].ID_USUARIO;
    // Envío de datos
    this.router.navigate(['/repartidor', this.nombre, this.apellidos,
      this.clave, this.idComuna, this.correoElectronico, this.direccion,
      this.nombreUsuario, this.rut, this.tipo, this.idUsuario]);
  }

  ngOnInit() {
    this.obtenerDatosUsuario();
  }

}
