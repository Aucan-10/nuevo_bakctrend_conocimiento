export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res
        .status(403)
        .json({ message: "No tenés permisos para esta acción" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "No tenés permisos para esta acción" });
    }

    next();
  };
};
