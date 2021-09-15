const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../database/knex/knex.js");
const lowercaseAll = require("../util/lowercase.js");

router
    .post("/register", async (req, res) => {
        let { first_name, last_name, email, password, role_title } = req.body;

        // Check if user in database already
        const user = await db("users").where("email", email);
        if (user.length !== 0) {
            return res.status(400).json({
                message: "User with that email address already exist",
            });
        }

        // Setting up insert
        let accountInformation = { first_name, last_name, email, password };
        const salt = await bcrypt.genSalt(10);
        accountInformation.password = await bcrypt.hash(password, salt);
        // Adds role if there is a role in the request
        if (role_title) {
            if (role_title === "tutor" || role_title === "student") {
                accountInformation["role_title"] = role_title;
            }
        }

        accountInformation = lowercaseAll(accountInformation);

        try {
            const newUser = await db("users")
                .insert(accountInformation)
                .returning("*");
            // Create token to send
            const payload = {
                id: newUser[0].id,
                first_name: newUser[0].first_name,
                last_name: newUser[0].last_name,
                role_title: newUser[0].role_title,
            };
            const secret = process.env.JWTSecret;
            const token = jwt.sign(payload, secret);

            return res.status(201).json({
                message: "Account created successfully",
                token,
            });
        } catch (error) {
            return res.status(400).json({
                Message: "An error has occurred on the server",
                error,
            });
        }
    })
    .post("/login", async (req, res) => {
        const { email, password } = req.body;
        // Find user in database if found grab hash password
        try {
            let user = await db("users")
                .where("email", email.toLowerCase())
                .first();

            if (user) {
                // Setting up token to send
                bcrypt.compare(password, user.password, (err, result) => {
                    if (result) {
                        const payload = {
                            user_id: user.id,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            role_title: user.role_title,
                        };
                        const secret = process.env.JWTSecret;
                        const token = jwt.sign(payload, secret);
                        return res.status(200).json({
                            message: "User logged in successfully",
                            token,
                        });
                    }
                });
            } else {
                return res.status(400).json({
                    message: "User does not exist",
                });
            }
        } catch (error) {
            return res.status(400).json({
                Message: "An error has occurred on the server",
                error,
            });
        }
    });

module.exports = router;
