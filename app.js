// Requiring Express
const express = require('express');
// Requiring Middleware Morgan
const morgan = require('morgan');

// Including mongoose
const mongoose = require('mongoose');

// Including mongoose schema
const Customer = require('./models/customer');
const Transaction = require('./models/transaction');

// Including ejs
const { render } = require('ejs');

// express app
const app = express();

// Database connection
const dbURI = 'mongodb+srv://ankit:ankit12345@bank-app.qnla8.mongodb.net/bankDataBase?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(process.env.PORT || 80))
    .catch((err) => console.log(err));
// Using mongoose

// register view engine
app.set('view engine', 'ejs');

// Static files
app.use(express.static('public'));

// Middleware
app.use(express.urlencoded({ extended: true }));
// it takes all the url encoded data from the form and pass it as an object

// Using Middleware morgan
app.use(morgan('dev'));

//// Routes 
app.get('/', (req, res) => {
    res.render('index', {title: 'Home'});
});

app.get('/about', (req, res) => {
    // Using the view engine
    res.render('about', {title: 'About'});
});

// blog routes
// Create a new user
app.get('/customers/create', (req, res) => {
    res.render('create', {title: 'Create a New User'});
})

// saving the customer to db
app.post('/customers', (req, res) => {
    const customer = new Customer(req.body);
    customer.save()
        .then((result) => {
            res.redirect('/customers')
        })
        .catch((err) => {
            console.log(err)
        });
})

// getting all the customers from db
app.get('/customers', (req, res) => {
    Customer.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('customers', {title: 'All Customers', customers: result});
        })
        .catch((err) => {
            console.log(err); 
        })
    // sorted by descending order of submission
})

// Transfer Money
app.get('/transfer', (req, res) => {
    res.render('transfer', {title: 'Transfer Money'});
})

// saving the transaction to db
app.post('/transfer', (req, res) => {
    const transaction = new Transaction(req.body)
    
    // Updating the customers database
    // The sender
    Customer.findOneAndUpdate({ id: transaction.sender_id }, { $inc: { 'balance': -transaction.amount }})
        .catch((err) => {
            console.log(err)
        });
    // The recipient
    Customer.findOneAndUpdate({ id: transaction.recipient_id }, { $inc: { 'balance': transaction.amount }})
        .catch((err) => {
            console.log(err)
        });

    transaction.save()
        .then((result) => {
            // console.log(result)
            res.redirect('/customers')
        })
        .catch((err) => {
            console.log(err)
        });
})


// getting all the customers from db
app.get('/transaction-history', (req, res) => {
    Transaction.find().sort({ createdAt: -1 })
    .then((result) => {
        res.render('transaction-history', {title: 'All Transactions', transactions: result});
    })
    .catch((err) => {
        console.log(err); 
    })
    // sorted by descending order of submission
})

// showing a single customer according to the id
app.get('/customers/:id', (req, res) => {
    const id = req.params.id; 
    // it means the :id provided with the address
    Customer.find({ id: id })
        .then((result) => {
            res.render('details', {title: 'Customer Details', customer: result[0]})
        })
        .catch((err) => {
            console.log(err);
        })
})

// Deletion of user
app.delete('/customers/:id', (req, res) => {
    const id = req.params.id; 
    Customer.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/customers' });
            // sending this to the frontend js of the details
        })
        .catch(err => console.log(err));
})

// 404 page
app.use((req, res) => {
    res.status(404).render('404', {title: 'Page Not Found'});
});