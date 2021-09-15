const testDB = require("../database/knex/knex.js");
const app = require("../index.js");
const request = require("supertest");

beforeAll(async () => {
    await testDB.schema
        .createTable("roles", (table) => {
            table.increments();
            table.string("title").notNullable().unique();
        })
        .createTable("users", (table) => {
            table.increments();
            table.string("first_name").notNullable();
            table.string("last_name").notNullable();
            table.string("email").notNullable();
            table.string("password").notNullable();
            table.string("role_title").defaultTo("student").notNullable();
            table
                .foreign("role_title")
                .references("title")
                .inTable("roles")
                .onUpdate("CASCADE");
        })
        .createTable("classes", (table) => {
            table.increments();
            table.string("name").notNullable();
            table.string("subject").notNullable();
            table.integer("user_id").notNullable();
            table
                .foreign("user_id")
                .references("id")
                .inTable("users")
                .onDelete("CASCADE");
        })
        .createTable("topics", (table) => {
            table.increments();
            table.string("title").notNullable();
            table.string("description").notNullable();
            table.integer("user_id").notNullable();
            table
                .foreign("user_id")
                .references("id")
                .inTable("users")
                .onDelete("CASCADE");
        })
        .createTable("comments", (table) => {
            table.increments();
            table.integer("user_id").notNullable();
            table.integer("topic_id").notNullable();
            table.text("comment").notNullable();
            table
                .foreign("user_id")
                .references("id")
                .inTable("users")
                .onDelete("CASCADE");
            table
                .foreign("topic_id")
                .references("id")
                .inTable("topics")
                .onDelete("CASCADE");
        })
        .createTable("student_classes", (table) => {
            table.increments();
            table.integer("class_id").notNullable();
            table.integer("student_id").notNullable();
            table
                .foreign("class_id")
                .references("id")
                .inTable("classes")
                .onDelete("CASCADE");
            table
                .foreign("student_id")
                .references("id")
                .inTable("users")
                .onDelete("CASCADE");
        });

    await testDB("roles").insert({ title: "student" });
    await testDB("roles").insert({ title: "tutor" });
});

afterAll(async () => {
    await testDB.schema
        .dropTable("student_classes")
        .dropTable("classes")
        .dropTable("comments")
        .dropTable("topics")
        .dropTable("users")
        .dropTable("roles");

    testDB.destroy();
});

describe("Register tests", () => {
    test("Register with valid information", async () => {
        const user = {
            first_name: "Brandon",
            last_name: "Vilaychith",
            email: "testemail@gmail.com",
            password: "Nismo1!!",
        };

        const response = await request(app)
            .post("/api/auth/register")
            .send(user);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("message");
    });
    test("Register with no role title", async () => {
        const createdUser = await testDB("users")
            .where("email", "testemail@gmail.com")
            .select("first_name", "last_name", "email", "role_title");

        expect(createdUser[0]["role_title"]).toBe("student");
    });
    test("Register with tutor role", async () => {
        const user = {
            first_name: "John",
            last_name: "Smith",
            email: "jsmith@gmail.com",
            password: "Nismo1!!",
            role_title: "tutor",
        };

        await request(app).post("/api/auth/register").send(user);

        const createdUser = await testDB("users")
            .where("email", user.email)
            .first();

        expect(createdUser.role_title).toBe("tutor");
    });
    test("Adding same user", async () => {
        const user = {
            first_name: "Brandon",
            last_name: "Vilaychith",
            email: "testemail@gmail.com",
            password: "Nismo1!!",
        };

        const response = await request(app)
            .post("/api/auth/register")
            .send(user);

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe(
            "User with that email address already exist"
        );
    });
});

describe("Login tests", () => {
    test("Login with user that isn't in database", async () => {
        const user = {
            first_name: "Amy",
            last_name: "Smith",
            email: "asmith@gmail.com",
            password: "Nismo1!!",
        };

        const response = await request(app).post("/api/auth/login").send(user);

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe("User does not exist");
    });
    test("Login with correct credentials", async () => {
        const user = {
            first_name: "Brandon",
            last_name: "Vilaychith",
            email: "testemail@gmail.com",
            password: "Nismo1!!",
        };

        const response = await request(app).post("/api/auth/login").send(user);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe("User logged in successfully");
        expect(response.body).toHaveProperty("token");
    });
});
