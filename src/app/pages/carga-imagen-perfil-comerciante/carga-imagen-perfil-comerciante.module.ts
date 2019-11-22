import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CargaImagenPerfilComerciantePage } from './carga-imagen-perfil-comerciante.page';

const routes: Routes = [
  {
    path: '',
    component: CargaImagenPerfilComerciantePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CargaImagenPerfilComerciantePage]
})
export class CargaImagenPerfilComerciantePageModule {}
