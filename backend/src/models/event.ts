import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Event = new Schema({
    id: {
        type: Number
    },
    idOrg: { // id organizatora
        type: Number
    },
    idSport: {
        type: Number
    },
    pollDeadline: { // rok za prijavu
        type: Number
    },
    dateTime: { // datum i vreme termina
        type: Number
    },
    location: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String // status poll-a
    },
    participationFee: {
        type: Number
    },
    comments: {
        type: Array
    },
    participants: { // prijavljeni ucesnici
        type: Array
    },
})

export default mongoose.model('Event', Event, 'events');