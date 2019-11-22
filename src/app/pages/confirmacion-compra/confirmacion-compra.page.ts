import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmacion-compra',
  templateUrl: './confirmacion-compra.page.html',
  styleUrls: ['./confirmacion-compra.page.scss'],
})
export class ConfirmacionCompraPage implements OnInit {

  // Arreglo de productos comprados
  listaProductos: any;
  usuario: any;
  montoCompra = 0;
  montoReparto = 0;
  montoGanancia = 0;

  // Parámetros de BBDD
  data: Observable<any>;
  dataDos: Observable<any>;
  dataTres: Observable<any>;
  idCompra: any;
  postDataTres = new FormData();
  dataCuatro: Observable<any>;
  postDataCuatro = new FormData();
  cantidadEliminar: any;
  cantidadActualizar: any;
  dataCinco: Observable<any>;
  postDataCinco = new FormData();

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

  // Activar o desactivar botón de pago
  boton = false;

  constructor(
    public activateRoute: ActivatedRoute,
    private http: HttpClient,
    public toastController: ToastController,
    public router: Router
  ) { }

  ngOnInit() {
    // Recepción de datos
    const dataProductosRecv = this.activateRoute.snapshot.paramMap.get('listaProductos');
    const dataUsuarioRecv = this.activateRoute.snapshot.paramMap.get('usuariObj');
    // Parseo de datos a objetos
    this.listaProductos = JSON.parse(dataProductosRecv);
    this.usuario = JSON.parse(dataUsuarioRecv);
    console.log(typeof (this.listaProductos));
    console.log(typeof (this.usuario));
    console.log(this.listaProductos);
    console.log(this.usuario);

    // Cálculo de montos

    for (const producto of this.listaProductos) {
      // Monto de despacho es sumatoria de el valor por peso (1 kg)
      const valorKilo = 0.3;
      this.montoReparto = this.montoReparto + ((producto.monto / producto.cantidad) * valorKilo);
      this.montoCompra = this.montoCompra + producto.monto;
      console.log(producto);
    }
    // Cobro por transacción de Ferias Click, pago de Captura de Despacho y Valor de Distancia Cubierta
    const cobroTransaccion = 1.03;
    const inicialDespacho = 400;
    const valorDesplazamiento = 40;
    this.montoReparto = this.montoReparto + inicialDespacho;
    // Cambiar
    const distancia = this.usuario.idUsuario;
    console.log(distancia);
    this.montoReparto = this.montoReparto + (distancia * valorDesplazamiento);
    this.montoGanancia = this.montoCompra * 0.03;
    console.log(this.montoGanancia);
    this.montoCompra = (this.montoCompra * cobroTransaccion) + this.montoReparto;
    console.log(this.montoCompra);

  }

  hacerPago() {
    const fechaActual = new Date();
    const fechaFormato = (fechaActual.getFullYear() + '-' + fechaActual.getMonth() + '-' + fechaActual.getDay());
    const horaFormato = (fechaActual.getHours() + ':' + fechaActual.getMinutes() + ':' + fechaActual.getSeconds());
    const fechaHoraFormato = fechaFormato + ' ' + horaFormato;
    console.log(fechaHoraFormato);
    const url = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=4';
    const postData = new FormData();
    postData.append('monto', this.montoCompra.toString());
    postData.append('montoReparto', this.montoReparto.toString());
    postData.append('montoGanancia', this.montoGanancia.toString());
    postData.append('idUsuario', this.usuario.idUsuario);
    postData.append('fecha', fechaHoraFormato);
    this.data = this.http.post(url, postData);
    this.data.subscribe(data => {
      if (data === true) {
        console.log('Compra insertada');
        const urlDos = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=5';
        const postDataDos = new FormData();
        // Agrego datos a la consulta
        postDataDos.append('idUsuario', this.usuario.idUsuario);
        postDataDos.append('fecha', fechaHoraFormato);
        // Consulta
        this.dataDos = this.http.post(urlDos, postDataDos);
        // Recogida de datos
        this.dataDos.subscribe(dataDos => {
          this.idCompra = dataDos[0].ID_COMPRA;
          console.log(this.idCompra);
          // Revisión de resultado
          if (dataDos.length >= 1) {
            // Revisión de tipo de usuario
            console.log('Datos Encontrados');
            for (const producto of this.listaProductos) {
              const urlTres = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=6';
              this.postDataTres = new FormData();
              this.postDataTres.append('idCompra', this.idCompra);
              this.postDataTres.append('idProducto', producto.idProducto);
              this.postDataTres.append('cantidadProducto', producto.cantidad);
              this.postDataTres.append('montoProducto', producto.monto.toString());
              this.dataTres = this.http.post(urlTres, this.postDataTres);
              this.dataTres.subscribe(dataTres => {
                if (dataTres === true) {
                  console.log(dataTres);
                  console.log('CANTIDAD PRODUCTO: ' + producto.cantidad);
                  const urlCuatro = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=7';
                  this.postDataCuatro = new FormData();
                  // Agrego datos a la consulta
                  this.postDataCuatro.append('idProducto', producto.idProducto);
                  // Consulta
                  this.dataCuatro = this.http.post(urlCuatro, this.postDataCuatro);
                  // Recogida de datos
                  this.dataCuatro.subscribe(dataCuatro => {
                    this.cantidadEliminar = dataCuatro[0].CANTIDAD_PRODUCTO;
                    console.log('CANTIDAD A ACTUALIZAR: ' + this.cantidadEliminar);
                    // Revisión de resultado
                    if (dataCuatro.length >= 1) {
                      this.cantidadActualizar = this.cantidadEliminar - producto.cantidad;
                      console.log('NUEVA CANTIDAD: ' + this.cantidadActualizar);
                      const urlCinco = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=8';
                      this.postDataCinco = new FormData();
                      this.postDataCinco.append('idProducto', producto.idProducto);
                      this.postDataCinco.append('cantidad', this.cantidadActualizar);
                      this.dataCinco = this.http.post(urlCinco, this.postDataCinco);
                      this.dataCinco.subscribe(dataCinco => {
                        if (dataCinco === true) {
                          console.log('Cantidad actualizada');
                          console.log(dataCinco);
                          this.listaProductos = [];
                          this.montoCompra = 0;
                          this.montoReparto = 0;
                          this.montoGanancia = 0;
                          this.boton = true;
                        } else {
                          console.log('No se pudo actualizar la cantidad');
                        }
                      });
                    } else {
                      console.log('No se pudo obtener la cantidad a modificar');
                    }
                  });
                } else {
                  console.log('No se pudo registrar producto agregado');
                }
              });
            }
            this.compraRealizada();
          } else {
            console.log('Datos No Encontrados');
          }
        });
      } else {
        console.log('Problema en la inserción');
      }
    });
  }

  // Toast de compra realizada
  async compraRealizada() {
    const toast = await this.toastController.create({
      message: 'Compra realizada',
      duration: 5000
    });
    toast.present();
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
