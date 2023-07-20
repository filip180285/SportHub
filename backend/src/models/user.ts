import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let User = new Schema({
    id: {
        type: Number
    },
    name: {
        type: String
    },
    lastname: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    type: {
        type: String
    },
    status: {
        type: String
    },
    phone: {
        type: String
    },
    picture: {
        type: String
    },
    subscriptions: { // za organizatora - subscribe-ovani ucesnici, za ucesnika - organizatori na koje je subscribe-ovan
        type: Array
    }
})

export default mongoose.model('User', User, 'users');