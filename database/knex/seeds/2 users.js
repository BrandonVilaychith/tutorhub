exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex("users")
        .del()
        .then(function () {
            // Inserts seed entries
            return knex("users").insert([
                {
                    id: 1,
                    first_name: "Brandon",
                    last_name: "Vilaychith",
                    email: "blvilaychith@gmail.com",
                    password: "Nismo1!!",
                    role_title: "tutor",
                },
                {
                    id: 2,
                    first_name: "John",
                    last_name: "Smith",
                    email: "jsmith@gmail.com",
                    password: "Nismo1!!",
                    role_title: "student",
                },
            ]);
        });
};
