const router = require("express").Router();
const db = require("../database/knex/knex.js");
const studentRoleCheck = require("../middleware/studentRoleCheck.js");

// Topics
router
    // Get all topics from current user
    .get("/:user_id/topics", studentRoleCheck, async (req, res) => {
        const { user_id } = req.params;

        const topics = await db("topics").where("user_id", user_id);

        if (topics[0].user_id !== user_id)
            if (topics.length <= 0) {
                return res.status(400).json({
                    message: "Could not find any topics this user owns",
                });
            }

        return res.status("200").json({
            message: "All topics returned successfully",
            topics,
        });
    })
    // Add new topic
    .post("/topics", studentRoleCheck, async (req, res) => {
        const { user_id } = req.user;
        const { title, description } = req.body;

        const topic = { title, description, user_id };

        try {
            const result = await db("topics").insert(topic).returning("*");
            return res.status(200).json({
                message: "Topic added successfully",
                topic: result,
            });
        } catch (error) {
            return res.status(400).json({
                message: "An error has occurred on the server",
                error,
            });
        }
    })
    // Delete topic
    .delete(
        "/:user_id/topics/:topic_id",
        studentRoleCheck,
        async (req, res) => {
            const { user_id, topic_id } = req.params;

            try {
                await db("topics")
                    .where({
                        user_id,
                        id: topic_id,
                    })
                    .del();

                return res.status(200).json({
                    message: "Topic has been deleted",
                });
            } catch (error) {
                return res.status(400).json({
                    Message: "An error has occurred on the server",
                    error,
                });
            }
        }
    )
    // Update topic
    .put("/:user_id/topics/:topic_id", async (req, res) => {});

// Classes
router
    // Get all classes this user is in
    .get("/:user_id/classes", async (req, res) => {
        const { user_id } = req.params;
        try {
            const result = db("student_classes")
                .select("*")
                .where("user_id", user_id);

            return res.status(200).json({ classes: result });
        } catch (error) {
            return res.status(400).json({
                Message: "An error has occurred on the server",
                error,
            });
        }
    })
    // Add user to class
    .post("/:user_id/classes/:class_id", async (req, res) => {
        const { user_id, class_id } = req.params;

        try {
            const information = {
                student_id: user_id,
                class_id,
            };
            await db("student_classes").insert(information);

            return res.status(200).json({
                message: "Student has joined this class",
            });
        } catch (error) {
            return res.status(400).json({
                Message: "An error has occurred on the server",
                error,
            });
        }
    })
    // Leave class
    .delete("/:user_id/leave_class/:class_id", async (req, res) => {});

module.exports = router;
