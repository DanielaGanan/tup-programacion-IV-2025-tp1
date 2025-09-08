import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

let alumnos = [
  { id: 1, nombre: "Maria Martinez", nota1: 8, nota2: 7, nota3: 9 },
  { id: 2, nombre: "Pepe Garcia", nota1: 5, nota2: 4, nota3: 6 },
  { id: 3, nombre: "Carlos Lopez", nota1: 9, nota2: 10, nota3: 8 },
];

let nextId = 4;


// Validacion de notas
const esNotaValida = (nota) => !isNaN(nota) && nota >= 0 && nota <= 10;


// Calcular promedio y el estado
const calcularEstado = (alumno) => {
  const promedio = (alumno.nota1 + alumno.nota2 + alumno.nota3) / 3;
  let estado;
  
  if (promedio < 6) {
    estado = "Reprobado";
  } else if (promedio >= 6 && promedio < 8) {
    estado = "Aprobado";
  } else {
    estado = "Promocionado";
  }
  
  return {
    ...alumno,
    promedio: parseFloat(promedio.toFixed(2)),
    estado: estado
  };
};

app.get("/", (req, res) => {
  res.send("Gestion de alumnos y notas");
});


// GET de listado de alumnos
app.get("/alumnos", (req, res) => {
  const resultado = alumnos.map(calcularEstado);
  res.json({ success: true, data: resultado });
});


// GET para obtener alumno por su id
app.get("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);
  
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Id invalido" });
  }

  const alumno = alumnos.find(a => a.id === id);
  if (!alumno) {
    return res.status(404).json({ success: false, message: "Alumno no encontrado" });
  }

  res.json({ success: true, data: calcularEstado(alumno) });
});


// POST crear nuevo alumno
app.post("/alumnos", (req, res) => {
  const { nombre, nota1, nota2, nota3 } = req.body;

  if (nombre === undefined || nota1 === undefined || nota2 === undefined || nota3 === undefined) {
    return res.status(400).json({ success: false, message: "Faltan campos" });
  }

  if (nombre.trim() === "") {
    return res.status(400).json({ success: false, message: "Nombre invalido" });
  }


  // Verificar que no se repita el nombre
  const nombreExiste = alumnos.find(a => a.nombre.toLowerCase() === nombre.trim().toLowerCase());
  if (nombreExiste) {
    return res.status(400).json({ success: false, message: "Ya existe un alumno con ese nombre" });
  }

  if (!esNotaValida(nota1)) {
    return res.status(400).json({ success: false, message: "Nota1 invalida" });
  }

  if (!esNotaValida(nota2)) {
    return res.status(400).json({ success: false, message: "Nota2 invalida" });
  }

  if (!esNotaValida(nota3)) {
    return res.status(400).json({ success: false, message: "Nota3 invalida" });
  }

  const nuevoAlumno = {
    id: nextId++,
    nombre: nombre.trim(),
    nota1: parseFloat(nota1),
    nota2: parseFloat(nota2),
    nota3: parseFloat(nota3),
  };

  alumnos.push(nuevoAlumno);
  res.status(201).json({ success: true, data: calcularEstado(nuevoAlumno) });
});


// PUT modificar alumno
app.put("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);
  
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Id invalido" });
  }

  const indice = alumnos.findIndex(a => a.id === id);
  if (indice === -1) {
    return res.status(404).json({ success: false, message: "Alumno no encontrado" });
  }

  const { nombre, nota1, nota2, nota3 } = req.body;

  if (nombre === undefined || nota1 === undefined || nota2 === undefined || nota3 === undefined) {
    return res.status(400).json({ success: false, message: "Faltan campos" });
  }

  if (nombre.trim() === "") {
    return res.status(400).json({ success: false, message: "Nombre invalido" });
  }


  // verificacion para que no se repita el nombre
  const nombreExiste = alumnos.find(a => a.nombre.toLowerCase() === nombre.trim().toLowerCase() && a.id !== id);
  if (nombreExiste) {
    return res.status(400).json({ success: false, message: "Ya existe un alumno con ese nombre" });
  }

  if (!esNotaValida(nota1) || !esNotaValida(nota2) || !esNotaValida(nota3)) {
    return res.status(400).json({ success: false, message: "Notas invalidas" });
  }

  alumnos[indice] = {
    id,
    nombre: nombre.trim(),
    nota1: parseFloat(nota1),
    nota2: parseFloat(nota2),
    nota3: parseFloat(nota3)
  };

  res.json({ success: true, data: calcularEstado(alumnos[indice]) });
});


// Eliminar alumno
app.delete("/alumnos/:id", (req, res) => {
  const id = Number(req.params.id);
  
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Id invalido" });
  }

  const indice = alumnos.findIndex(a => a.id === id);
  if (indice === -1) {
    return res.status(404).json({ success: false, message: "No se encontro el alumno" });
  }

  const alumnoEliminado = alumnos.splice(indice, 1)[0];
  res.json({ success: true, data: calcularEstado(alumnoEliminado) });
});


app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en ${port}`);
});