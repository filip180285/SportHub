import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Sport = new Schema({
    id: {
        type: Number
    },
    name: {
        type: String
    },
    picture: {
        type: String
    },
}, {
versionKey: false,
_id:false
},
);

export default mongoose.model('Sport', Sport, 'sports');