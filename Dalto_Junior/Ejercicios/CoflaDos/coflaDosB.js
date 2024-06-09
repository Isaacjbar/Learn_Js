let create = true;
let students = [];
let days;

function registerStudents() {
    let numStudents = parseInt(prompt("¿Cuántos alumnos deseas registrar?"));
    for (let i = 0; i < numStudents; i++) {
        let studentName = prompt("Introduce el nombre del estudiante " + (i + 1));
        students.push({name: studentName, attendance: []});
    }
    days = parseInt(prompt("¿Cuántos días?"));
}

function passlist() {
    for (let i = 0; i < students.length; i++) {
        for (let j = 0; j < days; j++) {
            let attendance = parseInt(prompt("Día " + (j + 1) + " - Estudiante: " + students[i].name + " (1) Presente, (0) Ausente"));
            students[i].attendance.push(attendance);
        }
    }
}

function statusStudent() {
    for (let i = 0; i < students.length; i++) {
        let daysActive = 0;
        for (let j = 0; j < days; j++) {
            daysActive += students[i].attendance[j];
        }
        if (daysActive >= (days * 0.10)) {
            alert("El estudiante: " + students[i].name + " si pasó");
        } else {
            alert("El estudiante: " + students[i].name + " no pasó");
        }
    }
}

registerStudents();
passlist();
console.log(students);
statusStudent();
