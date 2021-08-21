//
//              SISTEMA DE SIMULACIÓN DE PRÉSTAMOS
//
//  2 tipo de préstamos habilitados:
//  
//  - Préstamo Simple: Préstamo en que el capital solicitado se divide en partes iguales en todas las cuotas.
//                      Además se paga el interés correspondiente a cada mensualidad.
//                      En las primeras cuotas se paga más y en las útimas menos.
//
//  - Prestamo Americano: Préstamo en que el capital solicitado se paga en su totalidad en la últimacuota y en el
//                         resto solo se pagan intereses, por ello la última cuota es muy superior a las demás.
//



/**************************************************************
*                          CLASES
**************************************************************/

//Creo la clase global prestamo, que contiene los parámetros y métodos generales de todos los tipos de préstamos.
class prestamo {
    constructor (id, monto, cantidadCuotas) {
        this.id = id;
        this.monto = monto;
        this.cantidadCuotas = cantidadCuotas;
        this.coleccionCuotas = [];
        this.pagoTotal = 0;
    }


    interes(capital, tasaAnual) {
        return (capital * (tasaAnual / 12)) / 100;
    }

    //Método para guardar las cuotas en el array de colección.
    guardarCuota(valorCuota) {
        this.coleccionCuotas.push(valorCuota);
    }
}


//Creo la clase prestamoSimple como subclase de prestamo.
class prestamoSimple extends prestamo {

    cargarCuotas() {
        //Defino la variable saldo, como el resto de capital que falta pagar.
        let saldo = this.monto;

        let abonoMensual = this.monto / this.cantidadCuotas;

        //Ciclo que calcula y carga en la colección el valor de cada cuota. Además va sumando el pagoTotal.
        for (let i = 1; i <= this.cantidadCuotas; i++) {
            let interesCuota = this.interes(saldo, tasaAnualSimple);
            let valorCuota = abonoMensual + interesCuota;
            this.pagoTotal = this.pagoTotal + valorCuota;

            this.guardarCuota(valorCuota);
            
            //Actualizo el saldo.
            saldo = saldo - abonoMensual;
        }
    }
}


//Creo la clase prestamoAmericano como subclase de prestamo.
class prestamoAmericano extends prestamo {

    cargarCuotas() {
        let interesMensual = this.interes(this.monto, tasaAnualAmericana);

        //Las primeras cuotas únicamente tienen interés, las cargo con este ciclo.
        for (let i = 1; i < this.cantidadCuotas; i++) {
            this.guardarCuota(interesMensual);
        }

        //Calculo la cuota final y la guardo.
        let cuotaFinal = interesMensual + this.monto;
        this.guardarCuota(cuotaFinal);

        //En este caso, el pago total es el monto solicitado sumado al interes pagado en todas las cuotas. Lo cálculo y transformo.
        this.pagoTotal = this.monto + (interesMensual * this.cantidadCuotas);
    }
}



/**************************************************************
*                    CONSTANTES Y VARIABLES
**************************************************************/

//Constantes, variables y funciones generales.
const tasaAnualSimple = 40;
const tasaAnualAmericana = 50;



/**************************************************************
*                          FUNCIONES
**************************************************************/

//Función para transformar un valor númerico en formato de moneda.
const valorAMoneda = (valor) => {
    return new Intl.NumberFormat('es-UY', {style: 'currency',currency: 'UYU', minimumFractionDigits: 2}).format(valor);
}



/**************************************************************
*                          EJECUCIÓN
**************************************************************/

//Pedido de datos al cliente. Selección del tipo de préstamo a gestionar.
let tipo = Number(prompt("Bienvenido, seleccione el tipo de préstamo que desea solitar ([1] Préstamo Simple  -  [2] Préstamo Americano)"));

//Ciclo While hasta que el cliente seleccione una opción de tipo correcta.
while ((tipo != 1) && (tipo != 2)) {
    tipo = Number(prompt("Debe seleccionar una opción válida ([1] Préstamo Simple  -  [2] Préstamo Americano)"));
}


//Pedido de datos al cliente. Monto y cantidad de cuotas a gestionar.
let prestamoMonto = Number(prompt("Ingrese el monto que desea solicitar", "Monto"));
let prestamoCuotas = parseInt(prompt("Ingrese la cantidad de cuotas que desea solicitar", "Cuotas"));

//Ciclo While hasta que el cliente seleccione una cantidad de cuotas mayor a 1 para evitar un ciclo for infinito.
while (prestamoCuotas < 1) {
    prestamoCuotas = parseInt(prompt("Debe ingresar una cantidad de cuotas correcta (mayor o igual a 1)"));
}



//Creo la variable que será utilizada para crear el objeto préstamo según el tipo.
let prestamo1;


//Inicio los elementos para impimir el mensaje del tipo de préstamo.
let contenedorTipoPrestamo = document.getElementById("contenedorTipoPrestamo");
let mensajeTipoPrestamo = document.createElement("p");

//Variable auxiliar para poder imprimir el monto como moneda sin romper los cálculos posteriores.
let montoAMoneda = 0;

switch (tipo) {
    case 1:
        //Genero el objeto con la clase correspondiente.
        prestamo1 = new prestamoSimple(1, prestamoMonto, prestamoCuotas);

        montoAMoneda = valorAMoneda(prestamo1.monto);
        mensajeTipoPrestamo.textContent = `Préstamo del tipo Simple por ${montoAMoneda} en ${prestamo1.cantidadCuotas} cuotas.`;
        break;

    case 2:
        //Genero el objeto con la clase correspondiente.
        prestamo1 = new prestamoAmericano(1, prestamoMonto, prestamoCuotas);

        montoAMoneda = valorAMoneda(prestamo1.monto);
        mensajeTipoPrestamo.textContent = `Préstamo del tipo Americano por ${montoAMoneda} en ${prestamo1.cantidadCuotas} cuotas.`;
        break;
}

contenedorTipoPrestamo.appendChild(mensajeTipoPrestamo);

//Genero las cuotas y pago total del préstamo.
prestamo1.cargarCuotas();



//  Imprimiendo todas las cuotas
let listado = document.getElementById("tablaAmortizacionListado");
let itemListado = []

for (let i = 0; i < prestamo1.cantidadCuotas; i++) {
    itemListado[i] = document.createElement("li");
    let cuotaAMoneda = valorAMoneda(prestamo1.coleccionCuotas[i]);
    itemListado[i].textContent = `El valor de la cuota ${i + 1} es ${cuotaAMoneda}.`;
    listado.appendChild(itemListado[i]);
}


//Esta forma también es correcta o siempre debo crear el elemento?
let pagoTotalMoneda = valorAMoneda(prestamo1.pagoTotal)
let mensajePagoTotal = document.getElementById("pagoTotal");
mensajePagoTotal.textContent = `El total a pagar al final del crédito será de ${pagoTotalMoneda}`;
