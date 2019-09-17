import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductoCompra } from '../../producto-compra';
import { Router } from '@angular/router';
import { Usuario } from '../../usuario';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-comprador',
  templateUrl: './comprador.page.html',
  styleUrls: ['./comprador.page.scss'],
})
export class CompradorPage implements OnInit {

  // Parámetros de consulta de productos
  productos: any = [];
  despachos: any = [];
  data: Observable<any>;
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
  idUsuario: string;
  nombreComuna: string;
  // Parámetro del range
  cantidad = 0;
  // Arreglo de productos comprados
  productosComprados: ProductoCompra[] = [];
  contadorCompra = 0;
  productoComprado: ProductoCompra;
  sumaCompra = 0;
  // Arreglos y parámetros para confirmación de compra
  usuario: Usuario;
  // Parámetros de página secundaria
  confirmacionPagina: any;
  // Parámetro de ejcución regular
  myInterval: any;

  tamaño: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    public http: HttpClient,
    public router: Router,
    public toastController: ToastController,
    private storage: Storage
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

    // Consulta de productos
    this.obtenerProductos();

    // Consulta de despachos
    this.obtenerDespachos();
  }

  agregar(producto) {
    if (this.cantidad !== 0) {
      // Impresión de valores recogidos por ítem seleccionado
      console.log(producto.ID_PRODUCTO);
      console.log(producto.COSTO_PRODUCTO);
      console.log(this.cantidad);
      // Agregar objetos al Array
      this.productoComprado = new ProductoCompra(producto.ID_PRODUCTO, producto.NOMBRE_PRODUCTO, producto.COSTO_PRODUCTO * this.cantidad,
        this.cantidad);
      this.sumaCompra = this.sumaCompra + this.productoComprado.monto;
      console.log(this.productosComprados.push(this.productoComprado));
      this.contadorCompra++;
      console.log(this.productosComprados);
    } else {
      this.cantidadNula();
    }
  }

  calificar(despacho) {
    if (despacho.MONTO_COMPRA > 0) {
      this.usuario = new Usuario(this.idUsuario, this.rut, this.nombre, this.apellidos, this.nombreUsuario,
        this.clave, this.correoElectronico, this.tipo, this.idComuna, this.direccion);
      const usuariObj = JSON.stringify(this.usuario);
      const despachoObj = JSON.stringify(despacho);
      this.router.navigate(['calificar-compra', despachoObj, usuariObj]);
    } else {
      this.errorCalificar();
    }
  }

  resetearValor() {
    this.cantidad = 0;
    console.log('Reseteo de cantidad: ' + this.cantidad);
    console.log('chao');
  }

  hola() {
    console.log('hola');
  }

  tomarValor(formulario) {
    console.log(formulario.range);
  }

  cambioRango(event) {
    // Dar valor a variable según evento de cambio de rango
    this.cantidad = event.detail.value;
    console.log(this.cantidad);
  }

  confirmarCompra() {
    if (this.productosComprados.length > 0) {
      this.usuario = new Usuario(this.idUsuario, this.rut, this.nombre, this.apellidos, this.nombreUsuario,
        this.clave, this.correoElectronico, this.tipo, this.idComuna, this.direccion);
      console.log(this.usuario.idUsuario);
      const usuariObj = JSON.stringify(this.usuario);
      const listaProductos = JSON.stringify(this.productosComprados);
      this.router.navigate(['confirmacion-compra', listaProductos, usuariObj]);
    } else {
      this.carroVacio();
    }
  }

  // Toast de compra realizada
  async errorCalificar() {
    const toast = await this.toastController.create({
      message: 'Error al calificar un despacho',
      duration: 5000
    });
    toast.present();
  }

  // Toast de compra realizada
  async carroVacio() {
    const toast = await this.toastController.create({
      message: 'No ha agregado productos aún',
      duration: 5000
    });
    toast.present();
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

  // Toast de cantidad nula
  async cantidadNula() {
    const toast = await this.toastController.create({
      message: 'No indicó la cantidad del producto seleccionado',
      duration: 5000
    });
    toast.present();
  }

  ionViewDidEnter() {
    console.log('Volvi');
    // Carga de intervalo
    this.myInterval = setInterval(this.repetir, 60000);
    // Consulta de productos
    this.obtenerProductos();
    // Consulta de despachos
    this.obtenerDespachos();
    this.sumaCompra = 0;
    this.productosComprados = [];
    this.contadorCompra = 0;
  }

  obtenerProductos() {
    // Consulta de productos
    const url = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=1';
    const postData = new FormData();
    // Agrego datos a la consulta
    postData.append('idComuna', this.idComuna);
    // Consulta
    this.data = this.http.post(url, postData);
    // Recogida de datos
    this.data.subscribe(data => {
      this.productos = data;
      console.log(this.productos);
    });
  }

  obtenerDespachos() {
    // Consulta de despachos
    const url = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=24';
    const postData = new FormData();
    // Agrego datos a la consulta
    postData.append('idUsuario', this.idUsuario);
    // Consulta
    this.data = this.http.post(url, postData);
    // Recogida de datos
    this.data.subscribe(data => {
      this.despachos = data;
      console.log(this.despachos);
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

  subirImagen() {
    this.usuario = new Usuario(this.idUsuario, this.rut, this.nombre, this.apellidos, this.nombreUsuario,
      this.clave, this.correoElectronico, this.tipo, this.idComuna, this.direccion);
    console.log(this.usuario);
    const usuariObj = JSON.stringify(this.usuario);
    this.router.navigate(['carga-imagen-perfil', usuariObj]);
  }
}
