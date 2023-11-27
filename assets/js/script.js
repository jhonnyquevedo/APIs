/* variable grafico */
let grafico ;



async function getMonedas() {
    try {
        const selectorMoneda = document.getElementById('selector');
        const nombreMoneda = selectorMoneda.value;
        const endpoint = `https://mindicador.cl/api/${nombreMoneda}`; 
        const res = await fetch(endpoint);
        const data = await res.json();
        return data;
        
    } catch (error) {
        /* Mensaje de error */
        alert("Algo salio mal");
    }
}


async function calcular() {
    try {
        const cantidad = document.getElementById('pesosInput');
        const pesoChileno = cantidad.value;

        const data = await getMonedas();
        
        // convertir el valor peso chileno ingresado por el usuario a la moneda seleccionada.
        const resultado = (pesoChileno / data.serie[0].valor);

        return resultado.toFixed(3);
    } catch (error) {
        alert("Algo salio mal");
    }  
}

async function actualizarResultado() {
    try {
        const valorCalculado = await calcular();
        const mostrarResultado = document.getElementById("resultado");
        mostrarResultado.innerHTML = valorCalculado;
    } catch (error) {
        alert("Algo salio mal");
    } 
}

// devuelve la moneda seleccionada.
function obtenerMonedaSeleccionada() {
    const monedaSeleccionada = document.getElementById("selector").value;
    return monedaSeleccionada;
}

function dataParaElGrafico(indicadorEconomico) {
    // restringir el arreglo a 10 dias.
    const dias = indicadorEconomico.serie.slice(0, 10).reverse();
    
    // creamos labels para el grafico.
    const labels = dias.map((serie) => {
        return serie.fecha.substring(0,10);
    });

    // creamos data para el grafico.
    const data = dias.map((serie) => {
        const valor = serie.valor;
        return Number(valor);
    });

    const datasets = [
        {
            label: obtenerMonedaSeleccionada(),
            borderColor: "red",
            data
        }
    ];

    return { labels, datasets };
}

function cargarGrafico(indicadorEconomico) {

    // obtiene la informacion para cargar el grafico.
    const data = dataParaElGrafico(indicadorEconomico);

    // configuracion para el grafico.
    const config = {
        type: "line",
        data
    };

    // busco el canvas para el grafico
    const chartDOM = document.getElementById("myChart");
    chartDOM.style.backgroundColor = "white";

    // si ya existe el grafico, entonces lo elimino.
    if (grafico != undefined) {
        grafico.destroy();
    }
    // crea el nuevo grafico.
    grafico = new Chart(chartDOM, config);
}

async function buscar() {

    // 1 obtener el valor que el usuario ingreso (peso chileno) y el tipo de moneda.
    const pesoChileno = Number(document.getElementById("pesosInput").value);
    const tipoMoneda = document.getElementById("selector").value;

    // 2 validamos si el valor ingresado es un numero.
    if (Number.isInteger(pesoChileno)) {
        // validamos si el tipo de moneda seleccionada es el correcto.
        if (tipoMoneda != "Seleccione moneda") {

            // obtengo los indicadores economicos.
            const indicadorEconomico = await getMonedas();

            // podemos calcular pasando pesoChileno y tipoMoneda ingresados.
            const valorCalculado = await calcular();

            // actualizo el DOM con el resultado.
            actualizarResultado();

            // mostrar el grafico.
            cargarGrafico(indicadorEconomico);
        } else {
            // mostramos un mensaje para que seleccione un tipo de moneda.
            alert("Seleccione un tipo de moneda");
        }
    } else {
        // mostramos un mensaje para que ingrese solo valores numericos.
        alert("Ingrese un monto válido");
    }
}

function cargarEventoBotonBuscar() {
    const botonBuscar = document.getElementById("boton");
    botonBuscar.addEventListener("click", function () {
        buscar();
    });
}

function limpiarInputPesos() {
    const mostrarResultado = document.getElementById("pesosInput");
    mostrarResultado.value = "";
}
function limpiarSelectorMoneda() {
    const mostrarResultado = document.getElementById("selector");
    mostrarResultado.value = "seleccione";
}

function cargaInicial() {
    cargarEventoBotonBuscar();
    limpiarInputPesos();
    limpiarSelectorMoneda();
}

cargaInicial();