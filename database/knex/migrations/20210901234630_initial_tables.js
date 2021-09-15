exports.up = function (knex) {
    return knex.schema
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
};

exports.down = function (knex) {
    return knex.schema
        .dropTable("student_classes")
        .dropTable("classes")
        .dropTable("comments")
        .dropTable("topics")
        .dropTable("users")
        .dropTable("roles");
};
