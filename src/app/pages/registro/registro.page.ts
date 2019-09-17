import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../usuario';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  result: any = [];
  data: Observable<any>;

  private usuario: Usuario;
  comunas: any;

  // Estructuración del modelo que funciona en el formulario
  model = {
    rut: '',
    nombre: '',
    apellidos: '',
    clave: '',
    nombreUsuario: '',
    correo: '',
    tipoUsuario: '',
    comuna: '',
    idComuna: '',
    direccion: ''
  };

  constructor(
    public navCtrl: NavController,
    private http: HttpClient,
    public toastController: ToastController
  ) {
  }

  ngOnInit() {
    const url = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=15';
    const postData = new FormData();
    // Consulta
    this.data = this.http.post(url, postData);
    // Recogida de datos
    this.data.subscribe(data => {
      this.usuario = data;
      console.log(data);
      if (data.length >= 1) {
        console.log('Obtención de comunas');
        this.comunas = data;
      } else {
        console.log('Error en la obtención de comunas');
      }
    });
  }

  // Toast de registro
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Registrado/a',
      duration: 5000
    });
    toast.present();
  }

  // Toast de error en el registro (falta un catch)
  async registroInvalido() {
    const toast = await this.toastController.create({
      message: 'Error en el registro',
      duration: 5000
    });
    toast.present();
  }

  saltoPagina() {
    this.navCtrl.navigateRoot('/ingreso');
  }

  // Método para registrar usuario
  registrar(formulario) {
    console.log(formulario);
    // Carga de la base de datos
    const url = 'http://feriasclick.desarrollo-tecnologico.com/ferias/registro.php?opcion=3';
    const postData = new FormData();
    postData.append('rut', this.model.rut.toUpperCase());
    postData.append('nombre', this.model.nombre.toUpperCase());
    postData.append('apellidos', this.model.apellidos.toUpperCase());
    postData.append('clave', this.model.clave);
    postData.append('nombreUsuario', this.model.nombreUsuario);
    postData.append('correo', this.model.correo.toUpperCase());
    postData.append('tipoUsuario', this.model.tipoUsuario);
    postData.append('idComuna', this.model.idComuna);
    postData.append('direccion', this.model.direccion.toUpperCase());
    this.data = this.http.post(url, postData);
    this.data.subscribe(data => {
      if (data === true) {
        this.presentToast();
      } else {
        this.registroInvalido();
      }
      console.log(data);
      // Método precargado de limpieza de formularios
      formulario.reset();
      this.saltoPagina();
    });
  }
}
