import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.page.html',
  styleUrls: ['./agregar-producto.page.scss'],
})
export class AgregarProductoPage implements OnInit {

  // Parámetros de recepción de datos
  productoEditable: any;
  usuario: any;
  idProductoInsertado: any;

  // Parámetros de obtención de datos
  data: Observable<any>;
  dataDos: Observable<any>;
  dataTres: Observable<any>;
  tipos: any;
  valoracion = 8;

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

  // Estructuración del modelo que funciona en el formulario
  model = {
    nombreProducto: '',
    cantidadProducto: '',
    costoProducto: '',
    idTipo: ''
  };

  constructor(
    public activateRoute: ActivatedRoute,
    public http: HttpClient,
    public toastController: ToastController,
    public router: Router
  ) { }

  ngOnInit() {
    // Recepción de datos}
    const dataUsuarioRecv = this.activateRoute.snapshot.paramMap.get('usuariObj');
    // Parseo de objetos}
    this.usuario = JSON.parse(dataUsuarioRecv);
    console.log(this.usuario);
    // Obtención de tipos de productos
    const url = 'http://www.feriasclick.escuela-fundacion-sol.cl/ferias/registro.php?opcion=11';
    const postData = new FormData();
    // Consulta
    this.data = this.http.post(url, postData);
    // Recogida de datos
    this.data.subscribe(data => {
      this.tipos = data;
      console.log(data);
    });
  }

  agregar(formulario) {
    console.log('Aca agregamos');
    console.log('Nombre: ' + this.model.nombreProducto);
    console.log('Cantidad: ' + this.model.cantidadProducto);
    console.log('Costo: ' + this.model.costoProducto);
    console.log('Tipo: ' + this.model.idTipo);
    // Operación en la base de datos
    // Carga de la base de datos
    const url = 'http://www.feriasclick.escuela-fundacion-sol.cl/ferias/registro.php?opcion=12';
    const postData = new FormData();
    postData.append('nombreProducto', this.model.nombreProducto.toUpperCase());
    postData.append('cantidadProducto', this.model.cantidadProducto);
    postData.append('valoracionProducto', '8');
    postData.append('costoProducto', this.model.costoProducto);
    postData.append('idTipo', this.model.idTipo);
    postData.append('idUsuario', this.usuario.idUsuario);
    this.data = this.http.post(url, postData);
    this.data.subscribe(data => {
      console.log(data);
      if (data === true) {
        this.productoIngresado();
        // Método precargado de limpieza de formularios
        formulario.reset();
      } else {
        this.ingresoErroneo();
      }
    });
  }

  // Toast de ingreso correcto
  async productoIngresado() {
    const toast = await this.toastController.create({
      message: 'Ingreso de producto realizado',
      duration: 5000
    });
    toast.present();
  }

  // Toast de ingreso correcto
  async ingresoErroneo() {
    const toast = await this.toastController.create({
      message: 'Error en el ingreso de producto',
      duration: 5000
    });
    toast.present();
  }

  saltoPaginaComerciante() {
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
    this.router.navigate(['/comerciante', this.nombre, this.apellidos,
      this.clave, this.idComuna, this.correoElectronico, this.direccion,
      this.nombreUsuario, this.rut, this.tipo, this.idUsuario]);
  }

}
