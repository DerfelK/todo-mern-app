const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
const PORT = 3000

app.use(express.json())

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['Content-type']
}

app.use(cors(corsOptions))

mongoose.set('strictQuery', false);

mongoose.connect("mongodb://127.0.0.1:27017/mern-todo", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to DB"))
.catch (console.error)

const Todo = require('./module/Todo')

app.get('/todos', async (req, res) => {
    const todos = await Todo.find()
    
    res.json(todos)
})

app.post('/todo/new', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    })

    todo.save()

    res.json(todo)
})

app.delete('/todo/delete/:id', async(req, res) => {
    const result = await Todo.findOneAndDelete(req.params.id)

    res.json(result)
})

app.delete('/todo/delete-all', async (req, res) => {
    const todos = await Todo.find();
    if (todos.length === 0) {
        return res.json({ message: "No todos to delete." });
    }
    
    const result = await Todo.deleteMany();
    
    res.json({ message: "All todos deleted.", result });
})

app.get('/todo/complete/:id', async(req, res) => {
    const todo = await Todo.findById(req.params.id)
    if (!todo) {
        return res.status(404).json({ message: "Todo not found." });
    }

    todo.complete = !todo.complete

    todo.save()

    res.json(todo)
})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})