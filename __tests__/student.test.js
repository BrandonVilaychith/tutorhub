const app = require("../index.js");
const request = require("supertest");
const testDB = require("../database/knex/knex.js");

describe("Student API Topics", () => {
    test("Creating a topic with valid information", async () => {
        // Login tutor role and get token
        const loginResult = await request(app)
            .post("/api/auth/login")
            .send({ email: "blvilaychith@gmail.com", password: "Nismo1!!" });

        const token = loginResult.body.token;

        const newTopic = {
            title: "Math",
            description: "need help understand this formula",
        };

        const topicResult = await request(app)
            .post("/api/students/topics")
            .send(newTopic)
            .set({ "x-access-token": token });

        expect(topicResult.status).toBe(200);
        expect(topicResult.body).toHaveProperty("message");
        expect(topicResult.body).toHaveProperty("topic");
        expect(topicResult.body.topic[0]).toStrictEqual({
            id: 1,
            title: "Math",
            description: "need help understand this formula",
            user_id: 1,
        });
    });
    test("Creating topic with invalid role", async () => {
        const loginResult = await request(app)
            .post("/api/auth/login")
            .send({ email: "jsmith@gmail.com", password: "Nismo1!!" });

        const token = loginResult.body.token;

        const newTopic = {
            title: "Math",
            description: "need help understand this formula",
        };

        const topicResult = await request(app)
            .post("/api/students/topics")
            .send(newTopic)
            .set({ "x-access-token": token });
        // console.log(topicResult);
        expect(topicResult.status).toBe(403);
        expect(topicResult.body).toHaveProperty("Message");
        expect(topicResult.body.Message).toBe(
            "Current role not authorized for this action."
        );
    });
    // test("Get all topics from user", async () => {
    //     const result = await request(app).get("/api/students/1");
    // });
});
