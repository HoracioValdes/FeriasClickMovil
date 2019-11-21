import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CargaImagenProductoPage } from './carga-imagen-producto.page';

const routes: Routes = [
  {
    path: '',
    component: CargaImagenProductoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CargaImagenProductoPage]
})
export class CargaImagenProductoPageModule {}
