function sumar() {
    const numero1 = parseFloat(document.getElementById('numero1').value);
    const numero2 = parseFloat(document.getElementById('numero2').value);
    const resultado = numero1 + numero2;
    mostrarResultado(resultado);
}

function restar() {
    const numero1 = parseFloat(document.getElementById('numero1').value);
    const numero2 = parseFloat(document.getElementById('numero2').value);
    const resultado = numero1 - numero2;
    mostrarResultado(resultado);
}

function multiplicar() {
    const numero1 = parseFloat(document.getElementById('numero1').value);
    const numero2 = parseFloat(document.getElementById('numero2').value);
    const resultado = numero1 * numero2;
    mostrarResultado(resultado);
}

function dividir() {
    const numero1 = parseFloat(document.getElementById('numero1').value);
    const numero2 = parseFloat(document.getElementById('numero2').value);
    if (numero2 !== 0) {
        const resultado = numero1 / numero2;
        mostrarResultado(resultado);
    } else {
        mostrarResultado("No se puede dividir por cero");
    }
}

function mostrarResultado(resultado) {
    document.getElementById('resultado').innerText = "El resultado es: " + resultado;
}
