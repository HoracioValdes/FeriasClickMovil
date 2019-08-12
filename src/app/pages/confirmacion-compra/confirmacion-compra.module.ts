import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConfirmacionCompraPage } from './confirmacion-compra.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmacionCompraPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ConfirmacionCompraPage]
})
export class ConfirmacionCompraPageModule {}
