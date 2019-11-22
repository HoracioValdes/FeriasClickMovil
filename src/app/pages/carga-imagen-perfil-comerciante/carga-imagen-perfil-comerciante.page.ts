import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-carga-imagen-perfil-comerciante',
  templateUrl: './carga-imagen-perfil-comerciante.page.html',
  styleUrls: ['./carga-imagen-perfil-comerciante.page.scss'],
})
export class CargaImagenPerfilComerciantePage implements OnInit {

  // Parámetro del usuario
  usuario: any;

  // Parámetros de consulta a bbdd
  data: Observable<any>;

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
    const dataUsuarioRecv = this.activateRoute.snapshot.paramMap.get('usuariObj');
    // Parseo de objetos
    this.usuario = JSON.parse(dataUsuarioRecv);
    console.log(this.usuario);
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
    const url = 'http://feriasclick.desarrollo-tecnologico.com/perfiles/json.php';
    // Agrego datos a la consulta
    const postData = new FormData();
    postData.append('file', this.base64Image);
    postData.append('idUsuario', this.usuario.idUsuario);
    const data: Observable<any> = this.http.post(url, postData);
    data.subscribe((result) => {
      console.log(result);
      this.fotoSubida();
    });
  }

  // Toast de foto subida
  async fotoSubida() {
    const toast = await this.toastController.create({
      message: 'Foto subida correctamente; recargue su perfil',
      duration: 5000
    });
    toast.present();
  }

}
