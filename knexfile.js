module.exports = {
    development: {
        client: "postgresql",
        connection: {
            host: "localhost",
            user: "postgres",
            password: "Nismo1!!",
            database: "tutorhub",
        },
        migrations: {
            directory: __dirname + "/database/knex/migrations",
        },
        seeds: {
            directory: __dirname + "/database/knex/seeds",
        },
    },
    testing: {
        client: "postgresql",
        connection: {
            host: "localhost",
            user: "postgres",
            password: "Nismo1!!",
            database: "tutor_test",
        },
        migrations: {
            directory: __dirname + "/database/knex/migrations",
        },
        seeds: {
            directory: __dirname + "/database/knex/seeds",
        },
    },
};
