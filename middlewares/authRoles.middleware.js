const authorizeRoles = (requiredRole = "admin") => {
    return (req, res, next) => {
        if (req.user.role !== requiredRole) {
            return res.status(403).json({
                message: 'Bạn không có quyền thực hiện hành động này.',
            });
        }
        next();
    };
};

module.exports = authorizeRoles;
