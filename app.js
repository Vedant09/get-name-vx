// app.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/simple-node-db', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema for the data
const personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  school: String,
  address: String
});

const Person = mongoose.model('Person', personSchema);

// Body parser middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Endpoint to render a form for user input
app.get('/addPersonForm', (req, res) => {
  res.send(`
    <form method="post" action="/addPerson">
      <label for="name">Name:</label>
      <input type="text" name="name" required><br>
      <label for="age">Age:</label>
      <input type="number" name="age" required><br>
      <label for="school">School:</label>
      <input type="text" name="school" required><br>
      <label for="address">Address:</label>
      <input type="text" name="address" required><br>
      <button type="submit">Submit</button>
    </form>
  `);
});

// Endpoint to insert data into the database
app.post('/addPerson', async (req, res) => {
  try {
    const { name, age, school, address } = req.body;
    const person = new Person({ name, age, school, address });
    await person.save();
    res.status(201).json({ message: 'Person added to the database' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get data from the database based on the name
app.get('/getPerson/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const person = await Person.findOne({ name });
    if (!person) {
      res.status(404).json({ message: 'Person not found' });
    } else {
      res.status(200).json(person);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
