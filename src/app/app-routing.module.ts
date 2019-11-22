import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'agregar-producto/:usuariObj', loadChildren: './pages/agregar-producto/agregar-producto.module#AgregarProductoPageModule' },
  { path: 'calificar-compra/:despachoObj/:usuarioObj',
  loadChildren: './pages/calificar-compra/calificar-compra.module#CalificarCompraPageModule' },
  { path: 'comerciante/:nombre/:apellidos/:clave/:idComuna/:correoElectronico/:direccion/:nombreUsuario/:rut/:tipo/:idUsuario',
  loadChildren: './pages/comerciante/comerciante.module#ComerciantePageModule' },
  { path: 'comprador/:nombre/:apellidos/:clave/:idComuna/:correoElectronico/:direccion/:nombreUsuario/:rut/:tipo/:idUsuario',
  loadChildren: './pages/comprador/comprador.module#CompradorPageModule' },
  { path: 'confirmacion-compra/:listaProductos/:usuariObj',
  loadChildren: './pages/confirmacion-compra/confirmacion-compra.module#ConfirmacionCompraPageModule' },
  { path: 'edicion-producto/:proOfr/:usuariObj',
  loadChildren: './pages/edicion-producto/edicion-producto.module#EdicionProductoPageModule' },
  { path: 'ingreso', loadChildren: './pages/ingreso/ingreso.module#IngresoPageModule' },
  { path: 'registro', loadChildren: './pages/registro/registro.module#RegistroPageModule' },
  { path: 'repartidor/:nombre/:apellidos/:clave/:idComuna/:correoElectronico/:direccion/:nombreUsuario/:rut/:tipo/:idUsuario',
  loadChildren: './pages/repartidor/repartidor.module#RepartidorPageModule' },
  { path: 'carga-imagen-perfil/:usuariObj',
  loadChildren: './pages/carga-imagen-perfil/carga-imagen-perfil.module#CargaImagenPerfilPageModule' },
  { path: 'carga-imagen-producto/:proOfr/:usuariObj',
  loadChildren: './pages/carga-imagen-producto/carga-imagen-producto.module#CargaImagenProductoPageModule' },
  { path: 'carga-imagen-perfil-comerciante/:usuariObj',
  loadChildren: './pages/carga-imagen-perfil-comerciante/carga-imagen-perfil-comerciante.module#CargaImagenPerfilComerciantePageModule' },
  { path: 'carga-imagen-perfil-repartidor/:usuariObj',
  loadChildren: './pages/carga-imagen-perfil-repartidor/carga-imagen-perfil-repartidor.module#CargaImagenPerfilRepartidorPageModule' },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
