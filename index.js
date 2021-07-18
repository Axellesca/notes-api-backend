// const http = require('http');
const express = require('express'); //npm install express
const cors = require('cors'); //npm install cors -D // Soluciona error de compatibildiad en las API
const logger = require('./loggerMiddleware');

//npm install nodemon -D, Guarda los cambios sin necesidad de recargar el servicio

const app = express();

app.use(cors())

app.use(express.json())

app.use(logger);

let notes = [
    {
        "id": 1,
        "content": "Aprender JavaScript",
        "date": "21-01-2000",
        "important": true
    },
    {
        "id": 2,
        "content": "Aprender React",
        "date": "7-08-2020",
        "important": true
    },
    {
        "id": 3,
        "content": "Aprender NodeJs y Express",
        "date": "15-05-1990",
        "important": true
    },
]

// const app = http.createServer((request, response) => {
//     response.writeHead(200, { 'Content-Type': 'text/plain' })
//     response.end('Hola Mundo desde NodeJs')
// })

app.get('/',(req,res) => {
    res.send('<h1>Hola Mundo desde Express</h1>')
});

app.get('/api/notes',(request,response) => {
    response.json(notes);
})

app.get('/api/notes/:id',(request,response) => {
    const id = Number(request.params.id) //Hay que pasar el tipo de dato que recibe, ya que lo hace en String
    const note = notes.find(note => note.id === id);
    if(note){
        response.json(note);
    }else{
        response.status(404).end();
    }
})

app.delete('/api/notes/:id',(request,response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

app.post('/api/notes', (request,response) => {
    const note = request.body

    if(!note || !note.content){
        return response.status(400).json({
            error: 'note.content no se encuentra'
        })
    }

    //Generar ID en este caso nómas
    const ids = notes.map(note => note.id)
    const maxId = Math.max(...ids)

    const newNote = {
        id: maxId + 1,
        content: note.content,
        important: typeof note.important !== 'undefined' ? note.important : false,
        date: new Date().toISOString()
    }

    // notes = [...note,newNote];
    notes = notes.concat(newNote);

    response.status(201).json(newNote);
})

app.use((request,response) => {
    console.log(request.path);
    response.status(404).json({
        error: "Not found"
    })
})


const PORT = process.env.PORT || 3001
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`);
app.listen(PORT, () => {
    console.log(`Servidor Corriendo en el puerto ${PORT}`);
})