export class Usuario {

    constructor(
        public idUsuario: string,
        public rut: string,
        public nombre: string,
        public apellidos: string,
        public nombreUsuario: string,
        public clave: string,
        public correo: string,
        public tipoUsuario: string,
        public idComuna: string,
        public direccion: string
    ) { }
}
