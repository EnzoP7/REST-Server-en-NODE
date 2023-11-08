const { Schema, model } = require("mongoose");

const PublicacionSchema = Schema({
  titulo: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  descripcion: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  img: { type: String },
  estado: {
    type: Boolean,
    default: true,
    required: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

PublicacionSchema.methods.toJSON = function () {
  const { __v, estado, ...data } = this.toObject();
  return data;
};

module.exports = model("Publicacion", PublicacionSchema);
