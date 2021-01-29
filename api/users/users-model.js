const db = require("../../data/dbConfig");

module.exports = {
    get,
    getBy,
    getById,
    insert
}

function get() {
    return db("users").orderBy("id");
}

function getBy(param) {
    return db("users").where(param).orderBy("id");
}

function getById(id) {
    return db("users").where("id", id).first();
}

async function insert(user) {
    const [id] = await db("users").insert(user, "user_id");
    return getById(id);
}