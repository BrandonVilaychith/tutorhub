const lowercaseAll = (object) => {
    let newObject = {};

    for (const property in object) {
        if (Number.isInteger(object[property])) {
            // console.log(Number.isInteger(object[property]));
            newObject[property] = object[property];
        } else {
            if (property !== "password") {
                newObject[property] = object[property].toLowerCase();
            }
        }
    }

    if (object.password) {
        newObject["password"] = object.password;
    }

    return newObject;
};

module.exports = lowercaseAll;
