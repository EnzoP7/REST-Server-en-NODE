const { Router } = require("express");
const { check } = require("express-validator");
const {
  usuariosPost,
  usuariosGet,
  usuariosPut,
  usuariosDelete,
} = require("../controllers/usuarios");
const { validarCampos } = require("../middlewares/validar-campos");
const { emailExiste, existeUsuarioPorId } = require("../helpers/db-validators");
const { validarJWT } = require("../middlewares/validar-jwt");
const { tieneRole } = require("../middlewares/validar-roles");

const router = Router();

router.get("/", usuariosGet);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe de ser más de 6 letras").isLength({
      min: 6,
    }),
    check("correo", "El correo no es válido").isEmail(),
    check("correo").custom(emailExiste),
    check("rol", "No es un rol válido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    // check('rol').custom( esRoleValido ),
    validarCampos,
  ],
  usuariosPost
);

router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol", "No es un rol válido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    validarCampos,
  ],
  usuariosPut
);

router.delete(
  "/:id",
  [
    validarJWT,
    // esAdminRole,
    tieneRole("ADMIN_ROLE", "VENTAR_ROLE", "OTRO_ROLE"),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);

module.exports = router;
