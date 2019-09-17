import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ProductoEvaluado } from '../../producto-evaluado';
import { ProductoVentaTotal } from '../../producto-venta-total';

@Component({
  selector: 'app-calificar-compra',
  templateUrl: './calificar-compra.page.html',
  styleUrls: ['./calificar-compra.page.scss'],
})
export class CalificarCompraPage implements OnInit {

  // Parámetro de ejcución regular
  myInterval: any;

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

  // Objetos recibidos
  usuario: any;
  despacho: any;

  // Parámetros de consulta de productos
  productos: any = [];
  data: Observable<any>;
  dataDos: Observable<any>;
  dataTres: Observable<any>;

  // Parámetro del range
  valoracion = 0;

  // Parámetro del texto
  texto = '';

  // Parámetro de validación de calificaciones
  valoracionProducto = 0;

  // Parámetro de consulta de totales por producto
  total: any;
  productosVendidos: any = [];

  // Contador de ciclo
  i = 0;

  // Variable de obtencion de ventas totales
  numero = 0;

  // Arreglo de productos evaluados
  productosEvaluados: ProductoEvaluado[] = [];
  // Objeto de productos evaluados
  productoEvaluado: ProductoEvaluado;

  // Variable de calificación final
  calificacionUltima = 0;

  // Variables de la calificación final
  porcentajeDelTotal = 0.00;
  porcentajeTotal = 0.00;
  fraccionParcial = 0.00;
  fraccionRestante = 0.00;

  // Arreglo de venta total de productos
  ventasTotales: ProductoVentaTotal[] = [];

  // Objeto de venta total
  ventaTotal: ProductoVentaTotal;

  // Variable para ingresar ventas totales por producto
  ventaTotalNumero = 0;

  // Variables de desactivación de elementos de la interfaz
  isReadOnly = false;

  constructor(
    public activateRoute: ActivatedRoute,
    public http: HttpClient,
    public toastController: ToastController,
    public router: Router
  ) { }

  ngOnInit() {
    // Recepción de datos
    const dataDespachoRecv = this.activateRoute.snapshot.paramMap.get('despachoObj');
    const dataUsuarioRecv = this.activateRoute.snapshot.paramMap.get('usuarioObj');

    // Parseo de datos a objetos
    this.usuario = JSON.parse(dataUsuarioRecv);
    this.despacho = JSON.parse(dataDespachoRecv);
    console.log(typeof (this.despacho));
    console.log(typeof (this.usuario));
    console.log(this.despacho);
    console.log(this.usuario);

    // Consulta de productos, valores de calificación y llevar valoración de lista a cero
    this.obtenerProductos();
  }

  calificar() {
    if (this.validarTexto() && this.validarValoracionProductos()) {
      console.log(this.productosEvaluados);

      // Cálculo de calificación final
      this.ajusteCalificacion();

      // Inserción de comentario
      const fechaActual = new Date();
      const fechaFormato = (fechaActual.getFullYear() + '-' + fechaActual.getMonth() + '-' + fechaActual.getDay());
      const horaFormato = (fechaActual.getHours() + ':' + fechaActual.getMinutes() + ':' + fechaActual.getSeconds());
      const fechaHoraFormato = fechaFormato + ' ' + horaFormato;
      console.log(fechaHoraFormato);
      const url = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=26';
      const postData = new FormData();
      postData.append('texto', this.texto);
      postData.append('fechaHoraComentario', fechaHoraFormato);
      postData.append('idDespacho', this.despacho.ID_DESPACHO);
      this.data = this.http.post(url, postData);
      this.data.subscribe(data => {
        if (data === true) {
          console.log('Comentario insertado');

          // Inserción de calificaciones por producto
          this.productosEvaluados.forEach(prodEva => {
            const urlDos = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=27';
            const postDataDos = new FormData();
            postDataDos.append('valoracionProducto', prodEva.valoracionTotal.toString());
            postDataDos.append('idProducto', prodEva.idProducto.toString());
            this.dataDos = this.http.post(urlDos, postDataDos);
            this.dataDos.subscribe(dataDos => {
              if (dataDos === true) {
                console.log('Producto actualizado');
              } else {
                console.log('No se pudo actualizar la calificación de un producto');
              }
            });
          });
          // Cambio de estado de compra
          const urlTres = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=28';
          const postDataTres = new FormData();
          postDataTres.append('idCompra', this.despacho.ID_COMPRA);
          this.dataTres = this.http.post(urlTres, postDataTres);
          this.dataTres.subscribe(dataTres => {
            if (dataTres === true) {
              console.log('Compra actualizada');
              this.calificacionRealizada();
            } else {
              console.log('No se pudo actualizar la compra');
            }
          });
        } else {
          console.log('No se pudo insertar el comentario');
        }
      });
    } else {
      this.errorCalificar();
    }
  }

  deshabilitar() {
    this.isReadOnly = true;
  }

  ajusteCalificacion() {
    this.productosEvaluados.forEach(prodEva => {
      this.porcentajeDelTotal = 0.0;
      this.porcentajeTotal = 0;
      this.fraccionParcial = 0;
      this.fraccionRestante = 0;

      this.porcentajeDelTotal = 1 / (prodEva.totalCompras + 1);
      console.log(this.porcentajeDelTotal);

      this.porcentajeTotal = 1 - this.porcentajeDelTotal;
      console.log(this.porcentajeTotal);

      this.fraccionParcial = this.porcentajeDelTotal * prodEva.valoracionUsuario;
      console.log(this.fraccionParcial);
      this.fraccionRestante = this.porcentajeTotal * prodEva.valoracionActual;
      console.log(this.fraccionRestante);

      prodEva.valoracionTotal = this.fraccionParcial + this.fraccionRestante;
    });
    console.log(this.productosEvaluados);
  }

  obtenerProductos() {
    // Consulta de productos
    const url = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=25';
    const postData = new FormData();
    // Agrego datos a la consulta
    postData.append('despachaId', this.despacho.ID_DESPACHO);
    // Consulta
    this.data = this.http.post(url, postData);
    // Recogida de datos
    this.data.subscribe(data => {
      this.productos = data;
      console.log(this.productos);

      // Llevar valoraciones a 0 para validación
      this.productos.forEach(producto => {
        this.productoEvaluado = new ProductoEvaluado(producto.ID_PRODUCTO, 0, producto.TOTAL_VENTA, producto.VALORACION_PRODUCTO, 0);
        this.productosEvaluados.push(this.productoEvaluado);

        producto.VALORACION_PRODUCTO = 0;
      });
      console.log(this.productosEvaluados);
    });
  }

  // Toast de calificación inválida
  async errorCalificar() {
    const toast = await this.toastController.create({
      message: 'Faltan calificaciones que ingresar',
      duration: 5000
    });
    toast.present();
  }

  // Toast de calificación inválida
  async calificacionRealizada() {
    const toast = await this.toastController.create({
      message: 'La calificación de los productos y el despacho fue ingresada',
      duration: 5000
    });
    toast.present();
  }

  cambioRango(event, producto) {
    this.i = 0;
    // Dar valor a variable según evento de cambio de rango
    this.valoracion = event.detail.value;
    console.log(this.valoracion);
    console.log(producto);
    producto.VALORACION_PRODUCTO = event.detail.value;

    for (const productoEvaluado of this.productosEvaluados) {
      if (productoEvaluado.idProducto === producto.ID_PRODUCTO) {
        productoEvaluado.valoracionUsuario = event.detail.value;
      }
    }

    this.productos.forEach(elemento => {
      if (elemento.ID_PRODUCTO === producto.ID_PRODUCTO) {
        this.productos[this.i].VALORACION_PRODUCTO = event.detail.value;
      }
      this.i = this.i + 1;
    });

    console.log(this.productos);
    console.log(this.productosEvaluados);
  }

  cambioTexto(event) {
    // Dar valor a variable según evento de cambio de rango
    this.texto = event.detail.value;
    console.log(this.texto);
  }

  validarTexto() {
    if (this.texto.length === 0) {
      return false;
    } else {
      return true;
    }
  }

  validarValoracionProductos() {
    this.valoracionProducto = 0;
    this.productos.forEach(producto => {
      if (producto.VALORACION_PRODUCTO !== 0) {
        this.valoracionProducto = this.valoracionProducto + 1;
      }
    });

    console.log(this.valoracionProducto);
    console.log(this.productos.length);

    if (this.valoracionProducto === this.productos.length) {
      return true;
    } else {
      return false;
    }
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

}
