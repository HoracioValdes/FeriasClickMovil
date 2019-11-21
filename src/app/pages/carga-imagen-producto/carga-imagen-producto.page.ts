import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-carga-imagen-producto',
  templateUrl: './carga-imagen-producto.page.html',
  styleUrls: ['./carga-imagen-producto.page.scss'],
})
export class CargaImagenProductoPage implements OnInit {

  // Parámetros de recepción de datos
  productoEditable: any;
  usuario: any;

  // Parámetros de consulta a bbdd
  data: Observable<any>;

  // Variables de tomar foto
  correctPath = '';
  foto: any = '';
  respData: any;
  fileUrl: any = null;
  base64Image: any = '';

  constructor(
    public activateRoute: ActivatedRoute,
    public router: Router,
    private camera: Camera,
    public http: HttpClient,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    // Recepción de datos
    const dataProductosRecv = this.activateRoute.snapshot.paramMap.get('proOfr');
    const dataUsuarioRecv = this.activateRoute.snapshot.paramMap.get('usuariObj');

    // Parseo de objetos
    this.productoEditable = JSON.parse(dataProductosRecv);
    this.usuario = JSON.parse(dataUsuarioRecv);
  }

  saltoEdicionProducto() {
    // Envío de datos
    const usuariObj = JSON.stringify(this.usuario);
    const proOfr = JSON.stringify(this.productoEditable);
    this.router.navigate(['edicion-producto', proOfr, usuariObj]);
  }

  tomarFoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      cameraDirection: 0,
      correctOrientation: true
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // const base64Image = 'data:image/jpeg;base64,' + imageData;
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      // this.foto = this.webview.convertFileSrc(imageData);
    }, (err) => {
      console.log(err);
    });
  }

  seleccionarFoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      cameraDirection: 0,
      correctOrientation: true
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // const base64Image = 'data:image/jpeg;base64,' + imageData;
      // this.foto = this.webview.convertFileSrc(imageData);
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log(err);
    });
  }

  subirFoto() {
    // Subida de imagen
    const url = 'http://feriasclick.desarrollo-tecnologico.com/productos/json_dos.php';
    // Agrego datos a la consulta
    const postData = new FormData();
    postData.append('file', this.base64Image);
    postData.append('idProducto', this.productoEditable.idProducto);
    const data: Observable<any> = this.http.post(url, postData);
    data.subscribe((result) => {
      console.log(result);
      this.fotoSubida();
    });
  }

  // Toast de foto subida
  async fotoSubida() {
    const toast = await this.toastController.create({
      message: 'Foto subida correctamente; recargue el producto',
      duration: 5000
    });
    toast.present();
  }

}
