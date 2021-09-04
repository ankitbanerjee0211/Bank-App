const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
}, { timestamps: true })

const Customer = mongoose.model('Customer', customerSchema);
// this const is basically Capital by practice

module.exports = Customer;