const { response } = require("express");
const { ObjectId } = require("mongoose").Types;

const Usuario = require("../models/usuario");
const Publicaciones = require("../models/publicaciones");

const coleccionesPermitidas = ["usuarios", "publicaciones"];

const buscarUsuarios = async (termino = "", res = response) => {
  const esMongoID = ObjectId.isValid(termino); // TRUE

  if (esMongoID) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: usuario ? [usuario] : [],
    });
  }

  const regex = new RegExp(termino, "i");
  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }],
  });

  res.json({
    results: usuarios,
  });
};

const buscarPublicaciones = async (termino = "", res = response) => {
  const esMongoID = ObjectId.isValid(termino); // TRUE

  if (esMongoID) {
    const pubicaciones = await Publicaciones.findById(termino);
    return res.json({
      results: pubicaciones ? [pubicaciones] : [],
    });
  }

  const regex = new RegExp(termino, "i");
  const pubicaciones = await Publicaciones.find({
    titulo: regex,
    estado: true,
  });

  res.json({
    results: pubicaciones,
  });
};

const buscar = (req, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "usuarios":
      buscarUsuarios(termino, res);
      break;
    case "publicaciones":
      buscarPublicaciones(termino, res);
      break;

    default:
      res.status(500).json({
        msg: "Se le olvido hacer esta búsquda",
      });
  }
};

module.exports = {
  buscar,
};
