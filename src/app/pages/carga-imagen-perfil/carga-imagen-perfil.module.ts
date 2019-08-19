import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CargaImagenPerfilPage } from './carga-imagen-perfil.page';

const routes: Routes = [
  {
    path: '',
    component: CargaImagenPerfilPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CargaImagenPerfilPage]
})
export class CargaImagenPerfilPageModule {}
