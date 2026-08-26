const normalizarRol = (valor) =>
  String(valor || "")
    .trim()
    .toUpperCase();

export const checkRole = (...allowedRoles) => {
  const rolesNormalizados = allowedRoles.map(normalizarRol);

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res
        .status(403)
        .json({ message: "No tenés permisos para esta acción" });
    }

    if (!rolesNormalizados.includes(normalizarRol(req.user.role))) {
      return res
        .status(403)
        .json({ message: "No tenés permisos para esta acción" });
    }

    next();
  };
};
