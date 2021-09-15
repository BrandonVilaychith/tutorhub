exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex("topics")
        .del()
        .then(function () {
            // Inserts seed entries
            return knex("topics").insert([
                {
                    id: 1,
                    title: "Cant understand this formula",
                    description: "Place holder description",
                    user_id: 2,
                },
                {
                    id: 2,
                    title: "Placeholder",
                    description: "Place holder description",
                    user_id: 2,
                },
                {
                    id: 3,
                    title: "Placeholder",
                    description: "Place holder description",
                    user_id: 2,
                },
            ]);
        });
};
