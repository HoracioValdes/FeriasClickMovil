export class ProductoCompra {
    constructor(
        public idProducto: number,
        public nombre: string,
        public monto: number,
        public cantidad: number,
        public pesoProducto: number
    ) {}
}
