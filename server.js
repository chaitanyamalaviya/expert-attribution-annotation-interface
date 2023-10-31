const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001
// MongoDB Connection
mongoose.set('strictQuery',false)
mongoose.connect(process.env.MONGODB_URI)

const Task = require('./schema.js')

app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})
app.use(cors())
app.use(express.static('build'))

// routes
// app.get('/api/questions', (request, response) => {
//     Question.find({}).then(questions => {
//         response.json(questions)
//     })
// })

// route redirection for react router
app.get('/tasks', (request, response) => {
    response.sendFile(path.join(__dirname, '/build/index.html'))
})

// get all tasks from a specific annotator (given an id)
app.get('/api/tasks/:annotator_id', (request, response) => {
    console.log('here')
    Task.find({annotator_id: request.params.annotator_id}).then(tasks => {
        response.json(tasks)
    }).catch(error => response.json(error))
})

// annotate task
app.patch('/api/annotate/task/:task_id', (request, response) => {
    const body = request.body
    Task.findByIdAndUpdate(request.params.task_id, {$set: {'completed' : body.completed, 'usefulness' : body.usefulness, 'revised_answer': body.revised_answer, 'time_spent': body.time_spent}}).then(task => {
        response.json(task)
    }).catch(error => response.json(error))
})

// annotate example
app.patch('/api/annotate/task/:task_id/example/:example_id', (request, response) => {
    const key = `examples.${request.params.example_id}`
    const body = request.body
    Task.findByIdAndUpdate(request.params.task_id, {$set: {[key + '.structure_followed']: body.structure_followed, [key + '.depth']: body.depth, [key + '.factuality']: body.factuality, [key + '.attribution']: body.attribution, [key + '.revised_example'] : body.revised_example, [key + '.revised_evidence']: body.revised_evidence}}).then(task => {
        response.json(task)
    }).catch(error => response.json(error))
})

app.listen(PORT, () => {
    console.log('Listening on port', PORT)
})