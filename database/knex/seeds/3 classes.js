exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex("classes")
        .del()
        .then(function () {
            // Inserts seed entries
            return knex("classes").insert([
                {
                    id: 1,
                    name: "Algebra 1 Review",
                    subject: "math",
                    user_id: "1",
                },
                {
                    id: 2,
                    name: "Chemistry 3 Review",
                    subject: "science",
                    user_id: "1",
                },
            ]);
        });
};
