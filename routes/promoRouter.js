const express = require('express');
const bodyparser = require('body-parser');
const promoRouter = express.Router({mergeParams: true});

promoRouter.use(bodyparser.json());

promoRouter.route("/")
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Conten-Type','text/plain');
    next();
})
.get((req,res) => {
    res.end("Will send all the promotions to you!");
})
.post((req,res) => {
    res.end("Will add the promotion: " + req.body.name + " with details: " + req.body.description);
})
.put((req,res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions");
})
.delete((req,res) => {
    res.end("Deleting all promotions");
})


promoRouter.route("/:promoId")
.get((req,res) => {
    res.end("will send details of the promotion: " + req.params.promoId);
})
.post((req,res) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /promotions/" + req.params.promoId);
})
.put((req,res) => {
    res.write("Updating the promotion: " + req.params.promoId + "\n");
    res.end("Will update the promotion: " + req.body.name + " with details: " + req.body.description);
})
.delete((req,res) => {
    res.end("Deleting promotion: " + req.params.promoId);
})

module.exports = promoRouter;