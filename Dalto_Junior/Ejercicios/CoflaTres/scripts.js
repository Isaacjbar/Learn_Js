class Celular {
    constructor(color, weight, displayRes, cameraRes, ram, state) {
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

const celOne = new Celular("Rojo", 450, 90, 50, 2, false);
const celTwo = new Celular("Azul", 300, 120, 50, 4, false);
const celThree = new Celular("Verde", 500, 240, 65, 12, false);

// celOne.showInfo();
// document.write("<br>");
// celTwo.showInfo();
// document.write("<br>");
// celThree.showInfo();
// document.write("<br>");

// 3B Camara lenta, reconocimiento facial, y camara extra

class GamaAlta extends Celular {
    constructor(color, weight, displayRes, cameraRes, ram, state, camE) {
        super(color, weight, displayRes, cameraRes, ram, state);
        this.camE = camE;
    }
    grabarL() {
        if (this.state === true) {
            document.write("Grabando en cámara lenta...<br>");
        } else {
            document.write("No se puede grabar, el celular está apagado<br>");
        }
    }
    
    reconocerF() {
        if (this.state === true) {
            document.write("Reconociendo rostro...<br>");
        } else {
            document.write("No se puede reconocer, el celular está apagado<br>");
        }
    }
    
    showInfo() {
        super.showInfo();
        document.write("Cámara extra: " + this.camE + " MP<br>");
    }
}

const celGA = new GamaAlta("Oro", 450, 90, 50, 2, false, 35);
const celGB = new GamaAlta("Plata", 300, 120, 50, 4, false, 25);

// celGA.showInfo();
// document.write("<br>");
// celGB.showInfo();
// document.write("<br>");

// COFLA 3C
class App{
    constructor(name,descargas,puntuacion,stateD,stateO){
        this.name=name;
        this.descargas=descargas;
        this.puntuacion=puntuacion;
        this.stateD=stateD;
        this.stateO=stateO;
    }
    descargar(){
        if(this.stateD===false){
            document.write("Descargando...")
            this.stateD=true;
            } else{
            document.write("Ya está instalada")
        }
    }
    desinstalar(){
        if(this.stateD===true){
            document.write("Desinstalando...")
            this.stateD=false;
            } else{
            document.write("No está instalada")
        }
    }
    abrir(){
        if(this.stateD===true && this.stateO===false){
            document.write("Abriendo...")
            this.stateO=true;
        } else if (this.stateD===false){
            document.write("No se puede abrir porque no se ha instalado");
        } else if (this.stateO===true){
            document.write("No se puede abrir porque ya está abierta");
        } 
    }
    cerrar(){
        if(this.stateD===true && this.stateO===true){
            document.write("Cerrando...")
            this.stateO=false;
        } else if (this.stateD===false){
            document.write("No se puede abrir porque no se ha instalado");
        } else if (this.stateO===false){
            document.write("No se puede cerra porque ya está cerrada");
        } 
    }
}

const appOne = new App("Clash royale","2M",5,false,false);
const appTwo = new App("Brawl","1M",3,false,false);