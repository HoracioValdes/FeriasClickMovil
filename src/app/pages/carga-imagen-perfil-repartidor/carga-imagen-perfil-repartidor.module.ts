import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CargaImagenPerfilRepartidorPage } from './carga-imagen-perfil-repartidor.page';

const routes: Routes = [
  {
    path: '',
    component: CargaImagenPerfilRepartidorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CargaImagenPerfilRepartidorPage]
})
export class CargaImagenPerfilRepartidorPageModule {}
