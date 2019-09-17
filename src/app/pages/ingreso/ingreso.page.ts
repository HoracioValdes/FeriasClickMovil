import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.page.html',
  styleUrls: ['./ingreso.page.scss'],
})
export class IngresoPage implements OnInit {

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


  // Estructuración del modelo que funciona en el formulario
  model = {
    nombreUsuario: '',
    clave: ''
  };

  constructor(
    public navCtrl: NavController,
    public http: HttpClient,
    public toastController: ToastController,
    private router: Router,
    private storage: Storage
  ) { }

  // Seteo de datos de storage
  seteoDatosUsuario(nombreUsuario: string, clave: string) {
    this.storage.set('nombreUsuario', nombreUsuario);
    this.storage.set('clave', clave);
  }

  // Toast de datos inválidos
  async datosInvalidos() {
    const toast = await this.toastController.create({
      message: 'Sus datos están inválidos',
      duration: 5000
    });
    toast.present();
  }

  // Toast de datos inválidos
  async loginExitoso() {
    const toast = await this.toastController.create({
      message: 'Ingresando a la aplicación...',
      duration: 5000
    });
    toast.present();
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

  ingresar(formulario) {
    const url = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=2';
    const postData = new FormData();
    // Agrego datos a la consulta
    postData.append('nombreUsuario', this.model.nombreUsuario);
    postData.append('clave', this.model.clave);
    // Consulta
    this.data = this.http.post(url, postData);
    // Recogida de datos
    this.data.subscribe(data => {
      this.usuario = data;
      console.log(data);
      // console.log(this.result[0].TIPO);

      // Revisión de resultado
      if (data.length >= 1) {
        this.loginExitoso();
        this.seteoDatosUsuario(this.model.nombreUsuario, this.model.clave);
        // Revisión de tipo de usuario
        if (this.usuario[0].TIPO === 'COMPRADOR') {
          this.saltoPaginaComprador();
        } else if (this.usuario[0].TIPO === 'COMERCIANTE') {
          this.saltoPaginaComerciante();
        } else if (this.usuario[0].TIPO === 'REPARTIDOR') {
          this.saltoPaginaRepartidor();
        }
      } else {
        this.datosInvalidos();
      }
    });
  }

  ngOnInit() {
  }

}
