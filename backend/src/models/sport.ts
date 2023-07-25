import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Sport = new Schema({
    id: {
        type: Number
    },
    name: {
        type: String
    },
    pictures: {
        type: Array
    },
})

export default mongoose.model('Sport', Sport, 'sports');