var spicedPg = require('spiced-pg');

var db;

if (process.env.DATABASE_URL){
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg('postgres:postgres:postgres@localhost:5432/social');
}

exports.getUsersById = (ids) => {
    return db.query(`SELECT * FROM users WHERE id = ANY($1)`, [ids]);
}

exports.register = (first, last, email, pass) => {
    return db.query('INSERT INTO users (first, last, email, pass) VALUES($1, $2, $3, $4) RETURNING *', [first, last, email, pass])
}

exports.getMatchesByEmail = (email) => {
    return db.query('SELECT first, last, pass, id FROM users WHERE email = $1', [email])
}

exports.getInfo = (id) => {
    return db.query('SELECT * FROM users WHERE id = $1', [id])
}

exports.insertImage = (img, id) => {
    return db.query('UPDATE users SET img=$1 WHERE id=$2 RETURNING *', [img, id])
}

exports.editBio = (bio, id) => {
    return db.query('UPDATE users SET bio=$1 WHERE id=$2 RETURNING *', [bio, id])
}

exports.acceptFR = (sender_id, receiver_id) => {
    return db.query(`UPDATE friendships
                    SET status = 2
                    WHERE status = 1
                    AND ((sender_id = $1 AND receiver_id = $2)
                    OR (sender_id = $2 AND receiver_id = $1))`, [sender_id, receiver_id])
}

exports.rejectFR = (sender_id, receiver_id) => {
    return db.query(`UPDATE friendships
                    SET status = 5
                    WHERE status = 1
                    AND ((sender_id = $1 AND receiver_id = $2)
                    OR (sender_id = $2 AND receiver_id = $1))`, [sender_id, receiver_id])
}

exports.deleteFR = (sender_id, receiver_id) => {
    return db.query(`UPDATE friendships
                    SET status = 4
                    WHERE status = 2
                    AND ((sender_id = $1 AND receiver_id = $2)
                    OR (sender_id = $2 AND receiver_id = $1))`, [sender_id, receiver_id])
}

exports.cancelFR = (sender_id, receiver_id) => {
    return db.query(`UPDATE friendships
                    SET status = 3
                    WHERE status = 1
                    AND ((sender_id = $1 AND receiver_id = $2)
                    OR (sender_id = $2 AND receiver_id = $1))`, [sender_id, receiver_id])
}

exports.sendFR = (sender_id, receiver_id, status) => {
    return db.query('INSERT INTO friendships (sender_id, receiver_id, status) VALUES ($1, $2, $3) RETURNING *', [sender_id, receiver_id, status])
}

exports.seeFR = (sender_id, receiver_id) => {
    return db.query('SELECT * FROM friendships WHERE (status = 1 OR status = 2) AND ((sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1))', [sender_id, receiver_id])
}

exports.listFR = (id) => {
    return db.query(`
        SELECT users.id, first, last, img, status, receiver_id, sender_id
        FROM friendships
        JOIN users
        ON (status = 1 AND receiver_id = $1 AND sender_id = users.id)
        OR (status = 2 AND receiver_id = $1 AND sender_id = users.id)
        OR (status = 2 AND sender_id = $1 AND receiver_id = users.id)
    `, [id])
}

exports.getUsersbyName = (name) => {
    return db.query('SELECT * FROM users WHERE first ILIKE '%$1%'', [name])
}
