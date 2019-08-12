export class ProductoOfrecido {
    constructor(
        public idProducto: number,
        public nombreProducto: string,
        public cantidadProducto: number,
        public valoracionProducto: number,
        public costoProducto: number,
        public idTipo: number
    ) { }
}
