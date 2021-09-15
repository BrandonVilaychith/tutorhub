const router = require("express").Router();
const db = require("../database/knex/knex.js");
const lowercaseAll = require("../util/lowercase.js");

router
    // Create new comment
    .post("/:user_id/:topic_id", async (req, res) => {
        const { user_id, topic_id } = req.params;
        const { comment } = req.body;

        try {
            let commentData = {
                user_id,
                topic_id,
                comment,
            };

            commentData = lowercaseAll(commentData);
            const result = await db("comments")
                .insert(commentData)
                .returning("*");

            return res.status(201).json({
                message: "Comment has been added",
                comment: result,
            });
        } catch (error) {
            return res.status(500).json({
                message: "An error has occurred on the server",
                error,
            });
        }
    })
    // Remove comment
    .delete("/:user_id/:comment_id", async (req, res) => {
        const { user_id, comment_id } = req.params;
        const comment = await db("comments")
            .where("id", comment_id)
            .select("*")
            .first();
        // Checks
        if (!comment) {
            return res.status(404).json({
                message: "Comment not found, unable to delete.",
            });
        }
        if (comment.user_id !== parseInt(user_id)) {
            return res.status(403).json({
                message: "Comment is not current users comment",
            });
        }
        // Remove
        try {
            const result = await db("comments")
                .where({ user_id, id: comment_id })
                .delete();
            return res.status(200).json({
                message: "Comment has been removed",
                result,
            });
        } catch (error) {
            return res.status(500).json({
                message: "An error has occurred on the server",
                error,
            });
        }
    })
    // Edit comment
    .put("/:user_id/:comment_id", async (req, res) => {
        // Get user_id and comment_id
        // Get make updateInformation
        // Valid user_id
        const { user_id, comment_id } = req.params;
        const { comment: commentUpdate } = req.body;

        const comment = await db("comments")
            .where("id", comment_id)
            .select("user_id")
            .first();

        // Checks
        if (!comment) {
            return res.status(400).json({
                message: "Could not update comment.",
            });
        }

        if (comment.user_id !== parseInt(user_id)) {
            return res.status(403).json({
                message:
                    "Can not update comment, comment does not belong to user",
            });
        }
        // Update
        try {
            const result = await db("comments")
                .where("id", comment_id)
                .update({ comment: commentUpdate }, ["id", "comment"]);

            return res.status(200).json({
                message: "Comment updated successfully",
                updatedComment: result,
            });
        } catch (error) {
            return res.status(500).json({
                message: "An error has occurred on the server",
                error,
            });
        }
    })
    // Get all comments from topic
    .get("/:topic_id", async (req, res) => {
        const { topic_id } = req.params;

        try {
            const result = await db("comments")
                .where("topic_id", topic_id)
                .select("*");

            return res.status(200).json({
                message: "Comments fetched for this topic",
                comments: result,
            });
        } catch (error) {
            return res.status(500).json({
                message: "An error has occurred on the server",
                error,
            });
        }
    });

module.exports = router;
