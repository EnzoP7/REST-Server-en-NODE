const { response } = require("express");
const Publicacion = require("../models/publicaciones");

const obtenerPublicaciones = async (req, res = response) => {
  const query = { estado: true };

  const [total, pubicaciones] = await Promise.all([
    Publicacion.countDocuments(query),
    Publicacion.find(query).populate("usuario", "titulo"),
  ]);

  res.json({
    total,
    pubicaciones,
  });
};

const obtenerPublicacion = async (req, res = response) => {
  const { id } = req.params;
  const publicacion = await Publicacion.findById(id).populate(
    "usuario",
    "nombre"
  );

  res.json(publicacion);
};

const crearPublicacion = async (req, res = response) => {
  const { estado, usuario, ...body } = req.body;

  const publicacionDB = await Publicacion.findOne({ nombre: body.nombre });

  //   if (publicacionDB) {
  //     return res.status(400).json({
  //       msg: `La publicacion ${publicacionDB.nombre}, ya existe`,
  //     });
  //   }

  // Generar la data a guardar
  const data = {
    ...body,
    titulo: body.titulo.toUpperCase(),
    descripcion: body.descripcion.toUpperCase(),
    usuario: req.usuario._id,
  };

  const publicacion = new Publicacion(data);

  // Guardar DB
  await publicacion.save();

  res.status(201).json(publicacion);
};

const actualizarPublicacion = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  if (data.titulo) {
    data.titulo = data.titulo.toUpperCase();
  }
  if (data.descripcion) {
    data.descripcion = data.descripcion.toUpperCase();
  }

  data.usuario = req.usuario._id;

  const publicacion = await Publicacion.findByIdAndUpdate(id, data, {
    new: true,
  });

  res.json(publicacion);
};

const borrarPublicacion = async (req, res = response) => {
  const { id } = req.params;
  const publicacionBorrada = await Publicacion.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json(publicacionBorrada);
};

module.exports = {
  crearPublicacion,
  obtenerPublicaciones,
  obtenerPublicacion,
  actualizarPublicacion,
  borrarPublicacion,
};
