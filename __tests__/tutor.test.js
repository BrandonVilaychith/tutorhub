const app = require("../index.js");
const request = require("supertest");

describe("Tutor API", () => {
    test("Add class with valid information", async () => {
        const classInformation = {
            name: "Brandon's Algebra 1 review",
            subject: "Math",
        };

        const response = await request(app)
            .post("/api/tutors/classes")
            .send(classInformation);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("class");
        expect(response.body.message).toBe("Class has been created.");
        expect(response.body.class[0].id).toBe(1);
        expect(response.body.class[0].name).toBe("brandon's algebra 1 review");
        expect(response.body.class[0].subject).toBe("math");
        expect(response.body.class[0].user_id).toBe(1);
    });

    // test("Get all classes owned with user", async () => {
    //     const newClass = {
    //         name: "Brandon's Biology review",
    //         subject: "science",
    //     };

    //     await request(app).post("/api/tutors/classes/1").send(newClass);

    //     const response = await request(app).get("/api/tutors/classes/1");

    //     expect(response.statusCode).toBe(200);
    //     expect(response.body).toHaveProperty("classes");
    //     expect(response.body.classes.length).toBe(2);
    // });

    // test("Delete class", async () => {
    //     const response = await request(app).delete("/api/tutors/classes/1/1");

    //     expect(response.statusCode).toBe(200);
    //     expect(response.body).toHaveProperty("message");
    //     expect(response.body.message).toBe("Class deleted");
    // });

    // test("Delete class that doesn't exist", async () => {
    //     const response = await request(app).delete("/api/tutors/classes/1/2");

    //     expect(response.statusCode).toBe(404);
    //     expect(response.body).toHaveProperty("message");
    //     expect(response.body.message).toBe("Class does not exist");
    // });
});
