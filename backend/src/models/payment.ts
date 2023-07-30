import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Payment = new Schema({
    eventId: {
        type: Number
    },
    paid: {
        type: Array
    }
})

export default mongoose.model('Payment', Payment, 'payments');