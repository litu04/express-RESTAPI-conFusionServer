const express = require('express');
const bodyparser = require('body-parser');
const leaderRouter = express.Router({mergeParams: true});

leaderRouter.use(bodyparser.json());

leaderRouter.route("/")
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Conten-Type','text/plain');
    next();
})
.get((req,res) => {
    res.end("Will send all the leaders to you!");
})
.post((req,res) => {
    res.end("Will add the leader: " + req.body.name + " with details: " + req.body.description);
})
.put((req,res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /leaders");
})
.delete((req,res) => {
    res.end("Deleting all leaders");
})


leaderRouter.route("/:leaderId")
.get((req,res) => {
    res.end("will send details of the leader: " + req.params.leaderId);
})
.post((req,res) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /leaders/" + req.params.leaderId);
})
.put((req,res) => {
    res.write("Updating the leader: " + req.params.leaderId + "\n");
    res.end("Will update the leader: " + req.body.name + " with details: " + req.body.description);
})
.delete((req,res) => {
    res.end("Deleting leader: " + req.params.leaderId);
})

module.exports = leaderRouter;