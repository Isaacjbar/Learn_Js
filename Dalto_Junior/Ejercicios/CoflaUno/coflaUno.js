let iceCreams = [
    ["Palito de helado de agua", 0.6],
    ["Palito de helado de crema", 1],
    ["Bombón helado marca heladix", 1.6],
    ["Bombón helado marca heladovich", 1.7],
    ["Bombón helado marca helardo", 1.8],
    ["Potecito de helado con confites", 2.9],
    ["Pote de 1/4 kg", 2.9]
];

let cash = parseFloat(prompt("Inserta precio"));
let optionsIce = [];
let maxPrice = 0;

// Encontrar el helado más caro
for (let i = 0; i < iceCreams.length; i++) {
    if (iceCreams[i][1] <= cash) {
        if (iceCreams[i][1] > maxPrice) {
            maxPrice = iceCreams[i][1];
            optionsIce = [iceCreams[i][0]];
        } else if (iceCreams[i][1] === maxPrice) {
            optionsIce.push(iceCreams[i][0]);
        }
    }
}

if (optionsIce.length > 0) {
    alert("Te alcanza para: " + optionsIce.join(", ") + "\nTu cambio es: " + (cash - maxPrice).toFixed(2));
} else {
    alert("No te alcanza para ningún helado.");
}
