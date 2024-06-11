class Persona{
    constructor(nombre, edad, genero) {
        this.nombre = nombre;
        this.edad = edad;
        this.genero = genero;
      }
    
      saludar(){
        console.log("Hola soy "+this.nombre);
      }
      esMayorDeEdad(){
        if(this.edad >= 18){
            console.log(this.nombre + " es mayor de edad :)");
            } else {
                console.log(this.nombre + " no es mayor de edad :)");                
            }
      }
}

let PersonaUno = new Persona("Isaac",18,"H");
let PersonaDos = new Persona("Helen",12,"M");

PersonaUno.saludar();
PersonaUno.esMayorDeEdad();

PersonaDos.saludar();
PersonaDos.esMayorDeEdad();