"use strict";

const addAudio = require("../controllers/addAudio.js");
const mergeAudio = require("../controllers/mergeAudio.js");
const removeAudio = require("../controllers/removeAudio.js");
const retrieveAudio = require("../controllers/retrieveAudio.js");

module.exports = async function (fastify) {
  // Register each route with the Fastify instance
  fastify.route(addAudio(fastify));
  fastify.route(mergeAudio(fastify));
  fastify.route(removeAudio(fastify));
  fastify.route(retrieveAudio(fastify));
};
