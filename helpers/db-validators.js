const usuario = require("../models/usuario");
const publicacion = require("../models/publicaciones");

const emailExiste = async (correo = "") => {
  // Verificar si el correo existe
  const existeEmail = await usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(`El correo: ${correo}, ya está registrado`);
  }
};

const existeUsuarioPorId = async (id) => {
  // Verificar si el correo existe
  const existeUsuario = await usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id no existe ${id}`);
  }
};

/**
 * Productos
 */
const existePublicacionPorId = async (id) => {
  // Verificar si el correo existe
  const existePublicacion = await publicacion.findById(id);
  if (!existePublicacion) {
    throw new Error(`El id no existe ${id}`);
  }
};

/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
  const incluida = colecciones.includes(coleccion);
  if (!incluida) {
    throw new Error(
      `La colección ${coleccion} no es permitida, ${colecciones}`
    );
  }
  return true;
};

module.exports = {
  emailExiste,
  existeUsuarioPorId,
  existePublicacionPorId,
  coleccionesPermitidas,
};
