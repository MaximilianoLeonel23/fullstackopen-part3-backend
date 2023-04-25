const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/persons");
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

// let persons = [
//   {
//     name: "Arto Hellas",
//     number: "040-123456",
//     id: 1,
//   },
//   {
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//     id: 2,
//   },
//   {
//     name: "Dan Abramov",
//     number: "12-43-234345",
//     id: 3,
//   },
//   {
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//     id: 4,
//   },
// ];

app.use(morgan("tiny"));

// Persons
app.get("/", () => {
  response.send("<h1>Phonebook Master</h1>");
});

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});
////////
// Info
// app.get("/info", (request, response) => {
//   response.send(`<div>
//     <p>Phonebook has info for x people</p>
//     <p>${new Date()}</p>
//     </div>`);
// });
////////////////

// Create a person
app.post("/api/persons", (request, response, next) => {
  let body = request.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => savedPerson.toJson())
    .then((savedAndFormattedPerson) => response.json(savedAndFormattedPerson))
    .catch((error) => next(error));
});

// Get a single person
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});
//////////////////

// Delete a single person
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});
//////////////////

// Get info
app.get("/info", (request, response, next) => {
  response.send("<h1>Information</h1>").end();
});
// Update a person
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => {
      next(error);
    });
});
//////////////////////
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

//////////////

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
