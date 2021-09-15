const router = require("express").Router();
const db = require("../database/knex/knex.js");
const tutorRoleCheck = require("../middleware/tutorRoleCheck.js");
const lowercaseAll = require("../util/lowercase.js");

router
    // Creates class
    .post("/classes", tutorRoleCheck, async (req, res) => {
        const { name, subject } = req.body;
        const { user_id } = req.user;

        try {
            let classInformation = { name, subject, user_id };

            classInformation = lowercaseAll(classInformation);

            const result = await db("classes")
                .insert(classInformation)
                .returning("*");

            return res.status(201).json({
                message: "Class has been created.",
                class: result,
            });
        } catch (error) {
            return res.status(500).json({
                message: "An error has occurred on the server",
                error,
            });
        }
    })
    // Deletes class
    .delete("/classes/:class_id", async (req, res) => {
        const { class_id } = req.params;
        const { user_id } = req.user;

        try {
            // Find class by ID
            const findResult = await db("classes")
                .select("*")
                .where({
                    id: class_id,
                })
                .first();
            // If no class found
            if (!findResult) {
                return res
                    .status(404)
                    .json({ message: "Class does not exist" });
            }
            // If class found but does not belong to user
            if (findResult.user_id !== user_id) {
                return res.status(403).json({
                    message: "This class does not belong to this user.",
                });
            }
            // Delete class after checks
            await db("classes")
                .where({
                    id: class_id,
                    user_id,
                })
                .del();

            return res.status(200).json({
                message: "Class deleted",
            });
        } catch (error) {
            return res.status(500).json({
                message: "An error has occurred on the server",
                error,
            });
        }
    })
    // Get classes created by this user
    .get("/classes/:user_id", async (req, res) => {
        const { user_id } = req.params;

        try {
            const result = await db("classes")
                .select("*")
                .where("user_id", user_id);

            return res.status(200).json({
                classes: result,
            });
        } catch (error) {
            return res.status(500).json({
                message: "An error has occurred on the server",
                error,
            });
        }
    });

module.exports = router;
