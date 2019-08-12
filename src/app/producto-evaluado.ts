export class ProductoEvaluado {
    constructor(
        public idProducto: number,
        public valoracionTotal: number,
        public totalCompras: number,
        public valoracionActual: number,
        public valoracionUsuario: number
    ) { }
}
