const mongoose = require('mongoose');
const db = require('debug')('database-log');

mongoose.connect('mongodb://localhost/genre', { useNewUrlParser: true })
    .then(() => db('Connected to db'))
    .catch(err => db('Error connecting to database : ', err.message));

const genreSchema = new mongoose.Schema({
    name: { type: String, required: true },
    tags: {
        type: Array,
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'There needs to be atleast one tag'
        }
    },
});

const Genre = mongoose.model('Genre', genreSchema);

async function getGenres() {
    return await Genre.find();
}

async function getGenre(id) {
    try {
        const genre = await Genre.findById(id);
        if (genre && genre.length > 0)
            return genre;
    } catch (ex) {
        const er = new Error('No such genre found.');
        db(er);
        return er;
    }
}

async function addGenre(genre) {
    try {
        const g = new Genre(genre);
        const result = await g.save();
        return result;
    } catch (ex) {
        const er = new Error('Can\'t insert. Genre already present.');
        db(er);
        return er;
    }
}


async function updateGenre(id, newData) {
    try {
        const g = await Genre.findByIdAndUpdate(id, {
            $set: newData
        }, { new: true });
        return g;
    } catch (ex) {
        const er = new Error('No such genre found.');
        db(er);
        return er;
    }
}

async function deleteGenre(id) {
    try {
        const g = await Genre.deleteOne({ _id: id });
        return g;
    } catch (ex) {
        const er = new Error('No such genre found.');
        db(er);
        return er;
    }
}

module.exports.getGenres = getGenres;
module.exports.getGenre = getGenre;
module.exports.addGenre = addGenre;