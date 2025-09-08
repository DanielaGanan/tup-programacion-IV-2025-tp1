import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

let calculos = [
  { id: 1, ancho: 5, alto: 10, perimetro: 30, superficie: 50 },
  { id: 2, ancho: 4, alto: 4, perimetro: 16, superficie: 16 },
  { id: 3, ancho: 8, alto: 3, perimetro: 22, superficie: 24 },
];

let nextId = 4;


// Validacion de numeros positivos
const esNumeroValido = (valor) => !isNaN(valor) && valor > 0;


// Agregar tipo
const agregarTipo = (calculo) => ({
  ...calculo,
  tipo: calculo.ancho === calculo.alto ? "Cuadrado" : "Rectangulo"
});

app.get("/", (req, res) => {
  res.send("Calculos de perimetros y superficies de rectangulos");
});


// GET para entregar listado de calculos
app.get("/calculos", (req, res) => {
  const resultado = calculos.map(agregarTipo);
  res.json({ success: true, data: resultado });
});


// GET para obtener calculos por id
app.get("/calculos/:id", (req, res) => {
  const id = Number(req.params.id);
  
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Id invalido" });
  }

  const calculo = calculos.find(c => c.id === id);
  if (!calculo) {
    return res.status(404).json({ success: false, message: "Calculo no encontrado" });
  }

  res.json({ success: true, data: agregarTipo(calculo) });
});


// POST crear nuevo calculo
app.post("/calculos", (req, res) => {
  const { ancho, alto } = req.body;

  if (ancho === undefined || alto === undefined) {
    return res.status(400).json({ success: false, message: "Faltan campos" });
  }

  if (!esNumeroValido(ancho)) {
    return res.status(400).json({ success: false, message: "Ancho invalido" });
  }

  if (!esNumeroValido(alto)) {
    return res.status(400).json({ success: false, message: "Alto invalido" });
  }

  const nuevoCalculo = {
    id: nextId++,
    ancho: parseFloat(ancho),
    alto: parseFloat(alto),
    perimetro: 2 * (parseFloat(ancho) + parseFloat(alto)),
    superficie: parseFloat(ancho) * parseFloat(alto),
  };

  calculos.push(nuevoCalculo);
  res.status(201).json({ success: true, data: agregarTipo(nuevoCalculo) });
});


// Modificar calculo
app.put("/calculos/:id", (req, res) => {
  const id = Number(req.params.id);
  
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Id invalido" });
  }

  const indice = calculos.findIndex(c => c.id === id);
  if (indice === -1) {
    return res.status(404).json({ success: false, message: "Calculo no encontrado" });
  }

  const { ancho, alto } = req.body;

  if (ancho === undefined || alto === undefined) {
    return res.status(400).json({ success: false, message: "Faltan campos ancho o alto" });
  }

  if (!esNumeroValido(ancho) || !esNumeroValido(alto)) {
    return res.status(400).json({ success: false, message: "Valores invalidos" });
  }

  calculos[indice] = {
    id,
    ancho: parseFloat(ancho),
    alto: parseFloat(alto),
    perimetro: 2 * (parseFloat(ancho) + parseFloat(alto)),
    superficie: parseFloat(ancho) * parseFloat(alto)
  };

  res.json({ success: true, data: agregarTipo(calculos[indice]) });
});


// Eliminar calculo
app.delete("/calculos/:id", (req, res) => {
  const id = Number(req.params.id);
  
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Id invalido" });
  }

  const indice = calculos.findIndex(c => c.id === id);
  if (indice === -1) {
    return res.status(404).json({ success: false, message: "No se encontro el calculo" });
  }

  const calculoEliminado = calculos.splice(indice, 1)[0];
  res.json({ success: true, data: agregarTipo(calculoEliminado) });
});


app.listen(port, () => {
  console.log(`La aplicación esta funcionando en ${port}`);
});