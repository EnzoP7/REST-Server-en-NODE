const { Router } = require("express");
const { check } = require("express-validator");
const {
  obtenerPublicaciones,
  obtenerPublicacion,
  crearPublicacion,
  actualizarPublicacion,
  borrarPublicacion,
} = require("../controllers/publicacion");
const {
  existePublicacionPorId,
  existeUsuarioPorId,
} = require("../helpers/db-validators");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { esSuPublicacion } = require("../middlewares/validar-roles");

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get("/", obtenerPublicaciones);

// Obtener una categoria por id - publico
router.get(
  "/:id",
  [
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(existePublicacionPorId),
    validarCampos,
  ],
  obtenerPublicacion
);

// Crear categoria - privado - cualquier persona con un token válido
router.post(
  "/",
  [
    validarJWT,
    check("titulo", "El titulo es obligatorio").not().isEmpty(),
    check("usuario", "No es un id de Mongo").isMongoId(),

    validarCampos,
  ],
  crearPublicacion
);

// Actualizar - privado - cualquiera con token válido
router.put(
  "/:id",
  [
    validarJWT,
    // check('categoria','No es un id de Mongo').isMongoId(),
    check("id").custom(existePublicacionPorId),
    validarCampos,
  ],
  actualizarPublicacion
);

// Borrar una categoria - Admin
router.delete(
  "/:id",
  [
    validarJWT,
    esSuPublicacion,
    check("id", "No es un id de Mongo válido").isMongoId(),

    validarCampos,
  ],
  borrarPublicacion
);

module.exports = router;
