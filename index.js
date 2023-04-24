const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.use(morgan("tiny"));

app.get("/", (request, response) => {
  response.send("<h1>Phonebook</h1>");
});

// Persons
app.get("/api/persons", (request, response) => {
  response.json(persons);
});
////////
// Info
app.get("/info", (request, response) => {
  response.send(`<div>
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    </div>`);
});
////////////////

// Create a person
app.post("/api/persons", (request, response) => {
  let per = request.body;
  console.log("per", per);
  if (per.name === "" || per.number === "") {
    response.status(409).json({ error: "Name or number is missing" });
  } else if (persons.find((person) => person.name === per.name)) {
    response
      .status(404)
      .json({ error: "This person is already in the phonebook" });
  } else {
    let newId = getRandomNumber(persons.length + 9999);
    per.id = newId;
    persons = persons.concat(per);
    response.json(per);
  }
});
// Get a single person
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  let returnedPerson;

  persons.forEach((person) => {
    if (person.id === id) {
      returnedPerson = person;
    }
  });

  if (returnedPerson) {
    response.json(returnedPerson);
  } else {
    response.status(404).end();
  }
});
/////////
// Delete a single person
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});
//////////////

const getRandomNumber = (max) => {
  return Math.floor(Math.random() * max);
};

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
