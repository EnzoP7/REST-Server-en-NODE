const { Router } = require("express");
const { check } = require("express-validator");

const { validarArchivoSubir } = require("../middlewares/validar-archivo");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
} = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers/db-validators");

const router = Router();

router.post("/", validarArchivoSubir, cargarArchivo);

router.put(
  "/:coleccion/:id",
  [
    validarArchivoSubir,
    check("id", "El id debe de ser de mongo").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "publicaciones"])
    ),
    validarCampos,
  ],
  actualizarImagenCloudinary
);
// ], actualizarImagen )

router.get(
  "/:coleccion/:id",
  [
    check("id", "El id debe de ser de mongo").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "publicaciones"])
    ),
    validarCampos,
  ],
  mostrarImagen
);

module.exports = router;
