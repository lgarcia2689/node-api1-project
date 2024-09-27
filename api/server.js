// BUILD YOUR SERVER HERE
const express = require('express')
const Model = require('./users/model')

const server = express()

// GLOBAL MIDDLEWARE
server.use(express.json()) // !!!!!!!!!!!!!!!!

// [POST] /api/users (C of CRUD, create new user from JSON payload)
server.post('/api/users', async (req, res) => {
    try{
        const userFromClient = req.body;
        if(!userFromClient.name || !userFromClient.bio){
            res.status(400).json({
                message: "Please provide name and bio for the user"
            })
        }else{
            const newUser = await Model.insert(userFromClient)
            res.status(201).json(newUser)
        }
    }catch (err) {
        res.status(500).json({
          error: 'something went bad getting users',
          message: err.message,
          stack: err.stack,
        })
      }

})

// [GET] /api/users (R of CRUD, fetch all users)
server.get('/api/users', (req, res) => {
    Model.find()
      .then(person =>{ 
          console.log(person)
          res.json(person)
      })
      .catch(err => {
        res.status(500).json({ 
                error: "The users information could not be retrieved", 
                message: err.message,
                stack: err.stack
            })
      })
  })
  
  // [GET] /api/users/:id (R of CRUD, fetch users by :id)
  server.get('/api/users/:id',async (req, res) =>{
    try{
        const user = await Model.findById(req.params.id)
        if(!user){
            res.status(404).json({
                message: "The user with the specified ID does not exist"
            })
        }else{
            res.json(user)
        }
    }catch (err) {
        res.status(500).json({
          error: 'something went bad getting users',
          message: err.message,
          stack: err.stack,
        })
      }
  })

  // [DELETE] /api/users/:id (D of CRUD, remove users with :id)
  server.delete('/api/users/:id', (req, res) => {
    Model.remove(req.params.id)
    .then(deletedUser =>{ 
        if(!deletedUser){
            res.status(404).json({
                message: "The user with the specified ID does not exist"
            })
        }else{
            res.json(deletedUser)
        }
    })
    .catch(err => {
      res.status(500).json({ 
              error: "something went bad deleting new user", 
              message: err.message,
              stack: err.stack
          })
    })
  })

  // [PUT] /api/users/:id (U of CRUD, update users with :id using JSON payload)
  server.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {name, bio} = req.body;
        if(!name||!bio){
            res.status(400).json({
                message: "Please provide name and bio for the user"
            })
        }else{
            const updateUser = await Model.update(id,{name, bio})
            if(!updateUser){
                res.status(404).status({
                    message: "The user with the specified ID does not exist"
                })
            }else{
                res.json(updateUser)
            }
        }
        
      } catch (err) {
        res.status(500).json({
          error: 'something went bad updating new user',
          message: err.message,
          stack: err.stack,
        })
      }
  })

module.exports = server; // EXPORT YOUR SERVER instead of {}
