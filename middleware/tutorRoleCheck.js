const tutorRoleCheck = (req, res, next) => {
    const user = req.user;

    if (user.role_title !== "tutor") {
        return res
            .status(403)
            .json({ message: "Current role not authorized for this action." });
    }

    next();
};

module.exports = tutorRoleCheck;
