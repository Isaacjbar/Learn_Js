class Celular {
    constructor(color, weight, displayRes, cameraRes, ram, state = false) {
        this.color = color;
        this.weight = weight;
        this.displayRes = displayRes;
        this.cameraRes = cameraRes;
        this.ram = ram;
        this.state = state;
    }

    prender() {
        if (this.state === false) {
            document.write("Prendiendo...<br>");
            this.state = true;
        } else {
            document.write("Ya está prendido<br>");
        }
    }

    reiniciar() {
        if (this.state === true) {
            document.write("Reiniciando...<br>");
        } else {
            document.write("No se puede reiniciar, el celular está apagado<br>");
        }
    }

    apagar() {
        if (this.state === true) {
            document.write("Apagando...<br>");
            this.state = false;
        } else {
            document.write("Ya está apagado<br>");
        }
    }

    tomarFotos() {
        if (this.state === true) {
            document.write("Tomando foto...<br>");
        } else {
            document.write("No se puede tomar foto, el celular está apagado<br>");
        }
    }

    grabar() {
        if (this.state === true) {
            document.write("Grabando...<br>");
        } else {
            document.write("No se puede grabar, el celular está apagado<br>");
        }
    }

    showInfo() {
        document.write("Color: " + this.color + "<br>" +
                        "Peso: " + this.weight + " gramos<br>" +
                        "Resolución de Pantalla: " + this.displayRes + "p<br>" +
                        "Resolución de Cámara: " + this.cameraRes + " MP<br>" +
                        "Memoria RAM: " + this.ram + " GB<br>");
    }
}

const celOne = new Celular("Rojo", 450, 90, 50, 2);
const celTwo = new Celular("Azul", 300, 120, 50, 4);
const celThree = new Celular("Verde", 500, 240, 65, 12);

celOne.showInfo();
document.write("<br>");
celTwo.showInfo();
document.write("<br>");
celThree.showInfo();
document.write("<br>");
