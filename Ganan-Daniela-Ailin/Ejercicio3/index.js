import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

let tareas = [
  { id: 1, nombre: "Estudiar programacion", completada: true },
  { id: 2, nombre: "Trabajar", completada: false },
  { id: 3, nombre: "GYM", completada: false },
  { id: 4, nombre: "Limpiar la casa", completada: true },
];

let nextId = 5;

// Validacion de nombre de tarea
const esNombreValido = (nombre) => nombre && nombre.trim() !== "";

app.get("/", (req, res) => {
  res.send("Gestion de tareas completadas y pendientes");
});


// GET para entregar listado de tareas con filtro opcional
app.get("/tareas", (req, res) => {
  let resultado = [...tareas];


// Filtro por estado completada/pendiente
  const completada = req.query.completada;
  if (completada !== undefined) {
    if (completada !== "true" && completada !== "false") {
      return res.status(400).json({ 
        success: false, 
        message: "Filtro completada debe ser true o false" 
      });
    }
    
    const filtroCompletada = completada === "true";
    resultado = resultado.filter(t => t.completada === filtroCompletada);
  }

  res.json({ success: true, data: resultado });
});


// GET para obtener tarea por id
app.get("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);
  
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Id invalido" });
  }

  const tarea = tareas.find(t => t.id === id);
  if (!tarea) {
    return res.status(404).json({ success: false, message: "Tarea no encontrada" });
  }

  res.json({ success: true, data: tarea });
});


// POST crear nueva tarea
app.post("/tareas", (req, res) => {
  const { nombre, completada } = req.body;

  if (nombre === undefined || completada === undefined) {
    return res.status(400).json({ success: false, message: "Faltan campos" });
  }

  if (!esNombreValido(nombre)) {
    return res.status(400).json({ success: false, message: "Nombre invalido" });
  }


  // Verificion nombre
  const nombreExiste = tareas.find(t => t.nombre.toLowerCase() === nombre.trim().toLowerCase());
  if (nombreExiste) {
    return res.status(400).json({ success: false, message: "Ya existe una tarea con ese nombre" });
  }

  if (typeof completada !== "boolean") {
    return res.status(400).json({ success: false, message: "Completada debe ser true o false" });
  }

  const nuevaTarea = {
    id: nextId++,
    nombre: nombre.trim(),
    completada: completada,
  };

  tareas.push(nuevaTarea);
  res.status(201).json({ success: true, data: nuevaTarea });
});


//PUT modificar tarea
app.put("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);
  
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Id invalido" });
  }

  const indice = tareas.findIndex(t => t.id === id);
  if (indice === -1) {
    return res.status(404).json({ success: false, message: "Tarea no encontrada" });
  }

  const { nombre, completada } = req.body;

  if (nombre === undefined || completada === undefined) {
    return res.status(400).json({ success: false, message: "Faltan campos" });
  }

  if (!esNombreValido(nombre)) {
    return res.status(400).json({ success: false, message: "Nombre invalido" });
  }


  // Verificar que no se repita el nombre
  const nombreExiste = tareas.find(t => t.nombre.toLowerCase() === nombre.trim().toLowerCase() && t.id !== id);
  if (nombreExiste) {
    return res.status(400).json({ success: false, message: "Ya existe una tarea con ese nombre" });
  }

  if (typeof completada !== "boolean") {
    return res.status(400).json({ success: false, message: "Completada debe ser true o false" });
  }

  tareas[indice] = {
    id,
    nombre: nombre.trim(),
    completada: completada
  };

  res.json({ success: true, data: tareas[indice] });
});


// DELETE eliminar tarea
app.delete("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);
  
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Id invalido" });
  }

  const indice = tareas.findIndex(t => t.id === id);
  if (indice === -1) {
    return res.status(404).json({ success: false, message: "Tarea no encontrada" });
  }

  const tareaEliminada = tareas.splice(indice, 1)[0];
  res.json({ success: true, data: tareaEliminada });
});


app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en ${port}`);
});