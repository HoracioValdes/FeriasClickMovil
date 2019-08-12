import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductoOfrecido } from '../../producto-ofrecido';
import { Usuario } from '../../usuario';

@Component({
  selector: 'app-comerciante',
  templateUrl: './comerciante.page.html',
  styleUrls: ['./comerciante.page.scss'],
})
export class ComerciantePage implements OnInit {

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
  nombreComuna: string;
  idUsuario: string;

  // Parámetros de consulta de productos
  productos: any = [];
  data: Observable<any>;
  productoOfrecido: ProductoOfrecido;

  // Arreglos y parámetros para edición y agregación de producto
  usuario: Usuario;

  // Parámetro de ejcución regular
  myInterval: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public http: HttpClient
  ) { }

  ngOnInit() {
    // Recepción de datos de usuario
    this.nombre = this.activatedRoute.snapshot.paramMap.get('nombre');
    console.log(this.nombre);
    this.apellidos = this.activatedRoute.snapshot.paramMap.get('apellidos');
    console.log(this.apellidos);
    this.clave = this.activatedRoute.snapshot.paramMap.get('clave');
    console.log(this.clave);
    this.idComuna = this.activatedRoute.snapshot.paramMap.get('idComuna');
    console.log(this.idComuna);
    this.correoElectronico = this.activatedRoute.snapshot.paramMap.get('correoElectronico');
    console.log(this.correoElectronico);
    this.direccion = this.activatedRoute.snapshot.paramMap.get('direccion');
    console.log(this.direccion);
    this.nombreUsuario = this.activatedRoute.snapshot.paramMap.get('nombreUsuario');
    console.log(this.nombreUsuario);
    this.rut = this.activatedRoute.snapshot.paramMap.get('rut');
    console.log(this.rut);
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo');
    console.log(this.tipo);
    this.idUsuario = this.activatedRoute.snapshot.paramMap.get('idUsuario');
    console.log(this.idUsuario);

    // Carga de productos
    this.obtenerProductos();

    // Consulta de comuna
    this.obtenerComuna();
  }

  obtenerComuna() {
    // Consulta de productos
    const url = 'http://www.feriasclick.escuela-fundacion-sol.cl/ferias/registro.php?opcion=16';
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

  obtenerProductos() {
    // Consulta de productos
    const url = 'http://www.feriasclick.escuela-fundacion-sol.cl/ferias/registro.php?opcion=9';
    const postData = new FormData();
    // Agrego datos a la consulta
    postData.append('idUsuario', this.idUsuario);
    // Consulta
    this.data = this.http.post(url, postData);
    // Recogida de datos
    this.data.subscribe(data => {
      this.productos = data;
      console.log(data);
      console.log(this.productos);
    });
  }

  editar(producto) {
    // Impresión de valores recogidos por ítem seleccionado
    console.log(producto.ID_PRODUCTO);
    console.log(producto.NOMBRE_PRODUCTO);
    console.log(producto.CANTIDAD_PRODUCTO);
    console.log(producto.VALORACION_PRODUCTO);
    console.log(producto.COSTO_PRODUCTO);
    console.log(producto.ID_TIPO);
    // Redireccionamiento a Edicion de Producto
    this.usuario = new Usuario(this.idUsuario, this.rut, this.nombre, this.apellidos, this.nombreUsuario,
      this.clave, this.correoElectronico, this.tipo, this.idComuna, this.direccion);
    this.productoOfrecido = new ProductoOfrecido(producto.ID_PRODUCTO, producto.NOMBRE_PRODUCTO,
      producto.CANTIDAD_PRODUCTO, producto.VALORACION_PRODUCTO, producto.COSTO_PRODUCTO, producto.ID_TIPO);
    console.log(this.usuario);
    const usuariObj = JSON.stringify(this.usuario);
    const proOfr = JSON.stringify(this.productoOfrecido);
    this.router.navigate(['edicion-producto', proOfr, usuariObj]);
  }

  agregarProducto() {
    console.log('Acá agregamos producto');
    // Redireccionamiento a Agregación de Producto
    this.usuario = new Usuario(this.idUsuario, this.rut, this.nombre, this.apellidos, this.nombreUsuario,
      this.clave, this.correoElectronico, this.tipo, this.idComuna, this.direccion);
    const usuariObj = JSON.stringify(this.usuario);
    this.router.navigate(['agregar-producto', usuariObj]);
  }

  // Cerrar sesión
  cerrarSesion() {
    this.router.navigate(['home']);
  }

  ionViewDidEnter() {
    console.log('Volvi');
    // Carga de intervalo
    this.myInterval = setInterval(this.repetir, 60000);
    // Consulta de productos
    this.obtenerProductos();
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
}

