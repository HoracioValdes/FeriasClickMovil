import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ProductoOfrecido } from '../../producto-ofrecido';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-edicion-producto',
  templateUrl: './edicion-producto.page.html',
  styleUrls: ['./edicion-producto.page.scss'],
})
export class EdicionProductoPage implements OnInit {

  productoOfrecido: ProductoOfrecido;

  // Parámetros de peso de producto
  pesoProducto: any;

  // Parámetros de recepción de datos
  productoEditable: any;
  usuario: any;

  // Estructuración del modelo que funciona en el formulario
  model = {
    nombreProducto: '',
    cantidadProducto: '',
    costoProducto: '',
    pesoProducto: ''
  };

  // Parámetros de update
  data: Observable<any>;

  // Parámetro de obtención de foto de perfil
  producto = '';

  constructor(
    public activateRoute: ActivatedRoute,
    private http: HttpClient,
    public toastController: ToastController,
    public navCtrl: NavController,
    private router: Router,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Recepción de datos
    const dataProductosRecv = this.activateRoute.snapshot.paramMap.get('proOfr');
    const dataUsuarioRecv = this.activateRoute.snapshot.paramMap.get('usuariObj');
    // Parseo de objetos
    this.productoEditable = JSON.parse(dataProductosRecv);
    this.usuario = JSON.parse(dataUsuarioRecv);
    console.log(this.productoEditable);
    console.log(this.usuario);

    // Carga de imagen de perfil
    this.producto = 'http://feriasclick.desarrollo-tecnologico.com/productos/' + this.productoEditable.idProducto + '.jpg';
  }

  // Obtener peso de producto
  obtenerpeso() {
    const url = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=33';
    const postData = new FormData();
    console.log(this.productoEditable.idProducto);
    postData.append('idProducto', this.productoEditable.idProducto);
    this.data = this.http.post(url, postData);
    this.data.subscribe(data => {
      console.log(data);
      this.pesoProducto = data[0].PESO_PRODUCTO;
      console.log(this.pesoProducto);
    });
  }

  ionViewDidEnter() {
    this.obtenerpeso();
  }

  modificar(formulario) {
    console.log('Nombre: ' + this.model.nombreProducto);
    console.log('Costo: ' + this.model.costoProducto);
    console.log('Cantidad: ' + this.model.cantidadProducto);
    // Operación en la base de datos
    // Carga de la base de datos
    const url = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=10';
    const postData = new FormData();
    postData.append('idProducto', this.productoEditable.idProducto);
    postData.append('nombreProducto', this.model.nombreProducto.toUpperCase());
    postData.append('cantidadProducto', this.model.cantidadProducto);
    postData.append('costoProducto', this.model.costoProducto);
    postData.append('pesoProducto', this.model.pesoProducto);
    this.data = this.http.post(url, postData);
    this.data.subscribe(data => {
      if (data === true) {
        this.updateOk();
        // Método precargado de limpieza de formularios
        this.refrescarProducto();
        formulario.reset();
      } else {
        this.updateMal();
      }
      console.log(data);
    });
  }

  // Toast de registro
  async updateOk() {
    const toast = await this.toastController.create({
      message: 'Modificación realizada',
      duration: 5000
    });
    toast.present();
  }

  // Toast de registro inválido
  async updateMal() {
    const toast = await this.toastController.create({
      message: 'No se pudo realizar la modificación',
      duration: 5000
    });
    toast.present();
  }

  refrescarProducto() {
    this.productoEditable.nombreProducto = this.model.nombreProducto.toUpperCase();
    this.productoEditable.cantidadProducto = this.model.cantidadProducto;
    this.productoEditable.costoProducto = this.model.costoProducto;
    this.pesoProducto = this.model.pesoProducto;
  }

  volver() {
    console.log(this.usuario);
    this.router.navigate(['/comerciante', this.usuario.nombre, this.usuario.apellidos,
      this.usuario.clave, this.usuario.idComuna, this.usuario.correo, this.usuario.direccion,
      this.usuario.nombreUsuario, this.usuario.rut, this.usuario.tipoUsuario, this.usuario.idUsuario]);
  }

  subirImagen() {
    // Redireccionamiento a Carga de Imagen de Producto
    this.productoOfrecido = this.productoEditable;
    const proOfr = JSON.stringify(this.productoOfrecido);
    const usuariObj = JSON.stringify(this.usuario);
    this.router.navigate(['carga-imagen-producto', proOfr, usuariObj]);
  }

}
