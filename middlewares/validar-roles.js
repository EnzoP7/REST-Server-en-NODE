const { response } = require("express");
const Publicacion = require("../models/publicaciones");

const esAdminRole = (req, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      msg: "Se quiere verificar el role sin validar el token primero",
    });
  }

  const { rol, nombre } = req.usuario;

  if (rol !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${nombre} no es administrador - No puede hacer esto`,
    });
  }

  next();
};

const esSuPublicacion = async (req, res, next) => {
  try {
    // Obtener el ID de usuario del token JWT
    const usuarioID = req.usuario.id;

    // Obtener el ID de la publicación desde los parámetros de la ruta
    const publicacionID = req.params.id;

    // Realiza una comprobación para ver si el usuario es el propietario de la publicación
    const publicacion = await Publicacion.findById(publicacionID);

    if (!publicacion) {
      return res.status(404).json({ mensaje: "La publicación no existe" });
    }

    if (publicacion.usuario.toString() !== usuarioID) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para eliminar esta publicación" });
    }

    // Si llegamos aquí, el usuario es el propietario de la publicación
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en la autorización" });
  }
};

const tieneRole = (...roles) => {
  return (req, res = response, next) => {
    if (!req.usuario) {
      return res.status(500).json({
        msg: "Se quiere verificar el role sin validar el token primero",
      });
    }
    const losroles = ["ADMIN_ROLE", "USER_ROLE"];

    if (!losroles.includes(req.usuario.rol)) {
      return res.status(401).json({
        msg: `El servicio requiere uno de estos roles ${losroles}`,
      });
    }

    next();
  };
};

module.exports = {
  esAdminRole,
  tieneRole,
  esSuPublicacion,
};
