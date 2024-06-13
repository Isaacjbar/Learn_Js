class Celular {
    constructor(color, weight, displayRes, cameraRes, ram) {
        this.color = color;
        this.weight = weight;
        this.displayRes = displayRes;
        this.cameraRes = cameraRes;
        this.ram = ram;
    }
    prender() {
        document.write("Prendiendo...<br>");
    }
    reiniciar() {
        document.write("Reiniciando...<br>");
    }
    apagar() {
        document.write("Apagando...<br>");
    }
    tomarFotos() {
        document.write("Tomando foto...<br>");
    }
    grabar() {
        document.write("Grabando...<br>");
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
