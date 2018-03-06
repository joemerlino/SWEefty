export default function (server) {

  server.route({
    path: '/api/stabHavana/example',
    method: 'GET',
    handler(req, reply) {
      reply({ time: (new Date()).toISOString() });
    }
  });

  /*
    1) cluster.state, controlla le API per vedere cosa puoi chiedere
  */
  
   /*
  server.route({
    path: '/api/v0/stabHavana/retrieveData',
    method: 'GET',
    handler(req, reply) {
      server.plugins.elasticsearch.callWithRequest(req, 'cluster.state', {
        metric: 'metadata',
        index: req.params.name
      }).then(function (response) {
        reply(response.metadata.indices[req.params.name]);
      });
    }
  });
  /*
  
  
  
  
}
