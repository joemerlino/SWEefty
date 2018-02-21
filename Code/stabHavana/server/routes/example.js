export default function (server) {

  server.route({
    path: '/api/stabHavana/example',
    method: 'GET',
    handler(req, reply) {
      reply({ time: (new Date()).toISOString() });
    }
  });

}
