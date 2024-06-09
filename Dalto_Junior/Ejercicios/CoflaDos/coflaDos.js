let entrada = (process) => {
    let edad = prompt("¿Que edad tienes?");
    if(edad >= 18){
        time = prompt("En formato de 24 hrs ¿qué hora es?");
        if(time >= 2 && time <= 5){
            alert("Puedes entrar sin pagar");
        } else {
            alert("Paga y entra");
        }
    } else {
        alert("Lo siento, no puedes entrar");
    }
};

entrada();