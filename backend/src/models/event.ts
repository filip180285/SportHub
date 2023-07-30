import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Event = new Schema({
    id: {
        type: Number
    },
    organiser: { // username
        type: String
    },
    sport: {
        type: String
    },
    pollDeadline: { // rok za prijavu, podrazumevano do pocetka dana u kome se odrzava termin
        type: Number
    },
    minParticipants: {
        type: Number
    },
    maxParticipants: {
        type: Number
    },
    dateTime: { // datum i vreme termina
        type: Number
    },
    location: {
        type: String
    },
    status: { // aktivan, zavrsen, otkazan
        type: String
    },
    eventPrice: {
        type: Number
    },
    pricePerUser: {
        type: Number
    },
    comments: {
        type: Array
    },
    participants: { // prijavljeni ucesnici
        type: Array
    },
    paid: { // ucesnici koji su platili
        type: Array
    } 
}, {
    versionKey: false,
    _id:false
});

export default mongoose.model('Event', Event, 'events');