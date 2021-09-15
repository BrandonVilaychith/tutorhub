exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex("roles")
        .del()
        .then(function () {
            // Inserts seed entries
            return knex("roles").insert([
                { id: 1, title: "student" },
                { id: 2, title: "tutor" },
            ]);
        });
};
