import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Usuario } from '../../usuario';

@Component({
  selector: 'app-repartidor',
  templateUrl: './repartidor.page.html',
  styleUrls: ['./repartidor.page.scss'],
})
export class RepartidorPage implements OnInit {

  // Parámetros de consulta a BBDD
  data: Observable<any>;
  dataDos: Observable<any>;
  comprasPendientes: any;
  listaComentarios: any;

  // Parametros de usuario
  nombre: string;
  apellidos: string;
  clave: string;
  idComuna: string;
  correoElectronico: string;
  direccion: string;
  nombreUsuario: string;
  rut: string;
  tipo: string;
  nombreComuna: any;
  idUsuario: string;

  // Parámetros de insercion de despacho
  fechaActual: Date;
  fechaFormato: string;
  horaFormato: string;
  fechaHoraFormato: string;

  // Parámetros de obtención de compra en entrega
  ganancia: any = 0;
  productoEnEntrega: any;
  entrega: any = false;
  nombreCliente: any;
  comunaCliente: any;
  direccionCliente: any;
  fechaCompraCliente: any;
  montoCompraCliente: any;
  ganaciaCompra: any;

  // Parametros de obtención de listado de productos en entrega
  listaProductosEntrega: any;

  // Parámetro de ejcución regular
  myInterval: any;

  // Parámetro de obtención de foto de perfil
  perfil = '';

  // Parámetro para cargar imagen de perfil
  usuario: Usuario;

  constructor(
    private activatedRoute: ActivatedRoute,
    public http: HttpClient,
    public toastController: ToastController,
    public router: Router,
    private storage: Storage,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Recepción de datos de usuario
    this.nombre = this.activatedRoute.snapshot.paramMap.get('nombre');
    this.apellidos = this.activatedRoute.snapshot.paramMap.get('apellidos');
    this.clave = this.activatedRoute.snapshot.paramMap.get('clave');
    this.idComuna = this.activatedRoute.snapshot.paramMap.get('idComuna');
    this.correoElectronico = this.activatedRoute.snapshot.paramMap.get('correoElectronico');
    this.direccion = this.activatedRoute.snapshot.paramMap.get('direccion');
    this.nombreUsuario = this.activatedRoute.snapshot.paramMap.get('nombreUsuario');
    this.rut = this.activatedRoute.snapshot.paramMap.get('rut');
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo');
    this.idUsuario = this.activatedRoute.snapshot.paramMap.get('idUsuario');

    // Consulta de comuna
    this.obtenerComuna();

    // Obtención de despachos pendientes
    this.obtenerDespachosPendientes();

    // Obtención de despacho pendiente
    this.obtenerCompraEnEntrega();

    // Obtención de comentarios
    this.obtenerComentarios();

    // Carga de imagen de perfil
    this.perfil = 'http://feriasclick.desarrollo-tecnologico.com/perfiles/' + this.idUsuario + '.jpg';
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
      window.location.reload();
      this.ref.detectChanges();
    }, 2000);
  }

  obtenerComentarios() {
    // Consulta de comentarios
    const url = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=29';
    const postData = new FormData();
    // Agrego datos a la consulta
    postData.append('idUsuario', this.idUsuario);
    // Consulta
    this.data = this.http.post(url, postData);
    // Recogida de datos
    this.data.subscribe(data => {
      this.listaComentarios = data;
      console.log(this.listaComentarios);
    });
  }

  comentarioVisto(comentario) {
    // Actualización de compra
    const url = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=30';
    const postData = new FormData();
    // Agrego datos a la consulta
    postData.append('idCompra', comentario.ID_COMPRA);
    // Consulta
    this.data = this.http.post(url, postData);
    // Recogida de datos
    this.data.subscribe(data => {
      if (data === true) {
        this.comentarioRevisado();
        this.obtenerComentarios();
      } else {
        this.errorComentarioRevisado();
      }
    });
  }

  obtenerComuna() {
    // Consulta de productos
    const url = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=16';
    const postData = new FormData();
    // Agrego datos a la consulta
    postData.append('idComuna', this.idComuna);
    // Consulta
    this.data = this.http.post(url, postData);
    // Recogida de datos
    this.data.subscribe(data => {
      this.nombreComuna = data[0].NOMBRE_COMUNA;
      console.log(this.nombreComuna);
    });
  }

  obtenerDespachosPendientes() {
    // Consulta de productos
    const url = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=17';
    const postData = new FormData();
    // Consulta
    this.data = this.http.post(url, postData);
    // Recogida de datos
    this.data.subscribe(data => {
      this.comprasPendientes = data;
      console.log(this.comprasPendientes);
    });
  }

  enEntrega(compra) {
    if (this.entrega === false) {
      console.log('En entrega');
      // Operación en la base de datos
      // Carga de la base de datos
      const url = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=18';
      const postData = new FormData();
      postData.append('idCompra', compra.ID_COMPRA);
      this.data = this.http.post(url, postData);
      this.data.subscribe(data => {
        if (data === true) {
          console.log('Compra alterada "En entrega"');
          this.insertarDespacho(compra);
          // this.obtenerCompraEnEntrega();
          // this.obtenerDespachosPendientes();
          this.cargarPagina();
        } else {
          console.log('Error en la alteracion de compra');
        }
      });
    } else {
      this.repartidorOcupado();
    }
  }

  // Toast de repartidor ocupado
  async repartidorOcupado() {
    const toast = await this.toastController.create({
      message: 'Usted ya tiene una entrega pendiente',
      duration: 5000
    });
    toast.present();
  }

  obtenerCompraEnEntrega() {
    const url = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=20';
    const postData = new FormData();
    // Agrego datos a la consulta
    postData.append('idUsuario', this.idUsuario);
    // Consulta
    this.data = this.http.post(url, postData);
    // Recogida de datos
    this.data.subscribe(data => {
      this.productoEnEntrega = data;
      console.log(this.productoEnEntrega);
      // Revisión de resultado
      if (data.length >= 1) {
        this.ganancia = 6000;
        this.entrega = true;
        this.nombreCliente = this.productoEnEntrega[0].NOMBRE + ' ' + this.productoEnEntrega[0].APELLIDOS;
        this.comunaCliente = this.productoEnEntrega[0].NOMBRE_COMUNA;
        this.direccionCliente = this.productoEnEntrega[0].DIRECCION;
        this.fechaCompraCliente = this.productoEnEntrega[0].FECHA_HORA_COMPRA;
        this.montoCompraCliente = this.productoEnEntrega[0].MONTO_COMPRA;
        this.entrega = true;
        this.obtenerProductosDeCompraEnEntrega();
      } else {
        console.log('No hay compras pendientes de entrega');
      }
    });
  }

  obtenerProductosDeCompraEnEntrega() {
    const url = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=21';
    const postData = new FormData();
    // Agrego datos a la consulta
    postData.append('idCompra', this.productoEnEntrega[0].ID_COMPRA);
    // Consulta
    this.data = this.http.post(url, postData);
    // Recogida de datos
    this.data.subscribe(data => {
      this.listaProductosEntrega = data;
      console.log(data);
      // Revisión de resultado
      if (data.length >= 1) {
        console.log('Lista de productos obtenida');
      } else {
        console.log('Lista de productos no obtenida');
      }
    });
  }

  confirmarEntrega() {
    if (this.entrega === true) {
      // Carga de la base de datos
      const url = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=22';
      const postData = new FormData();
      postData.append('idCompra', this.productoEnEntrega[0].ID_COMPRA);
      this.data = this.http.post(url, postData);
      this.data.subscribe(data => {
        if (data === true) {
          console.log('Compra actualizada');
          this.obtenerFecha();
          // Carga de la base de datos
          const urlDos = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=23';
          const postDataDos = new FormData();
          console.log(this.fechaHoraFormato);
          postDataDos.append('fecha', this.fechaHoraFormato);
          postDataDos.append('idCompra', this.productoEnEntrega[0].ID_COMPRA);
          this.dataDos = this.http.post(urlDos, postDataDos);
          this.dataDos.subscribe(dataDos => {
            if (dataDos === true) {
              this.entregaRealizada();
              this.cargarPagina();
            } else {
              this.entregaNoRealizada();
            }
          });
        } else {
          console.log('Compra no actualizada');
        }
      });
    } else {
      this.despachoVacio();
    }
  }

  cargarPagina() {
    window.location.reload();
  }

  // Toast de entrega realizada
  async despachoVacio() {
    const toast = await this.toastController.create({
      message: 'No tiene ninguna compra pendiente de entrega',
      duration: 5000
    });
    toast.present();
  }

  // Toast de entrega realizada
  async comentarioRevisado() {
    const toast = await this.toastController.create({
      message: 'Se revisó el comentario',
      duration: 5000
    });
    toast.present();
  }

  // Toast de entrega realizada
  async errorComentarioRevisado() {
    const toast = await this.toastController.create({
      message: 'No se pudo actualizar el comentario',
      duration: 5000
    });
    toast.present();
  }

  // Toast de entrega realizada
  async entregaRealizada() {
    const toast = await this.toastController.create({
      message: 'Entrega realizada',
      duration: 5000
    });
    toast.present();
  }

  // Toast de entrega no realizada
  async entregaNoRealizada() {
    const toast = await this.toastController.create({
      message: 'Error en la entrega',
      duration: 5000
    });
    toast.present();
  }

  insertarDespacho(compra) {
    this.obtenerFecha();
    // Carga de la base de datos
    const url = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=19';
    const postData = new FormData();
    postData.append('fechaHoraDespacho', this.fechaHoraFormato);
    postData.append('direccionDespacho', compra.DIRECCION);
    postData.append('idCompra', compra.ID_COMPRA);
    postData.append('idUsuario', this.idUsuario);
    console.log(this.fechaHoraFormato);
    console.log(compra.DIRECCION);
    console.log(compra.ID_COMPRA);
    console.log(this.idUsuario);
    this.data = this.http.post(url, postData);
    this.data.subscribe(data => {
      if (data === true) {
        console.log('Despacho insertado');
      } else {
        console.log('Despacho no insertado');
      }
    });
  }

  obtenerFecha() {
    this.fechaActual = new Date();
    this.fechaFormato = (this.fechaActual.getFullYear() + '-' + this.fechaActual.getMonth() + '-' + this.fechaActual.getDay());
    this.horaFormato = (this.fechaActual.getHours() + ':' + this.fechaActual.getMinutes() + ':' + this.fechaActual.getSeconds());
    this.fechaHoraFormato = this.fechaFormato + ' ' + this.horaFormato;
  }

  ionViewDidEnter() {
    console.log('Volvi');
    // Carga de intervalo
    this.myInterval = setInterval(this.repetir, 60000);
    // Consulta de comuna
    this.obtenerComuna();

    // Obtención de despachos pendientes
    this.obtenerDespachosPendientes();

    // Obtención de despacho pendiente
    this.obtenerCompraEnEntrega();

    // Obtención de comentarios
    this.obtenerComentarios();
  }

  repetir() {
    console.log('se repite');
    // Recarga de página
    window.location.reload();
  }

  ionViewWillLeave() {
    console.log('Me voy');
    // Limpieza de intervalo
    clearInterval(this.myInterval);
  }

  // Cerrar sesión
  cerrarSesion() {
    this.seteoDatosUsuario('', '');
    this.router.navigate(['home']);
  }

  // Seteo de datos de storage
  seteoDatosUsuario(nombreUsuario: string, clave: string) {
    this.storage.set('nombreUsuario', nombreUsuario);
    this.storage.set('clave', clave);
  }

  subirImagen() {
    this.usuario = new Usuario(
      this.idUsuario,
      this.rut,
      this.nombre,
      this.apellidos,
      this.nombreUsuario,
      this.clave,
      this.correoElectronico,
      this.tipo,
      this.idComuna,
      this.direccion
    );
    console.log(this.usuario);
    const usuariObj = JSON.stringify(this.usuario);
    this.router.navigate(['carga-imagen-perfil', usuariObj]);
  }
}

