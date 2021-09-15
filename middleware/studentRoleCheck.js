const studentRoleCheck = (req, res, next) => {
    const user = req.user;
    if (user.role_title !== "student") {
        return res
            .status(403)
            .json({ message: "Current role not authorized for this action." });
    }

    next();
};

module.exports = studentRoleCheck;
