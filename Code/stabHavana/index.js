
import exampleRoute from './server/routes/example';
export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'stab-havana',
    uiExports: {

      app: {
        title: 'Stab Havana',
        description: 'An awesome Kibana plugin',
        main: 'plugins/stab-havana/app'
      },



    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },


    init(server, options) {
      // Add server routes and initalize the plugin here
      exampleRoute(server);
    }


  });
};
