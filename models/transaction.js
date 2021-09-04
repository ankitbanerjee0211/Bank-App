const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    sender_id: {
        type: String,
        required: true
    },
    sender_name: {
        type: String,
        required: true
    },
    recipient_id: {
        type: String,
        required: true
    },
    recipient_name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
}, { timestamps: true })

const Transaction = mongoose.model('Transaction', transactionSchema);
// this const is basically Capital by practice

module.exports = Transaction;