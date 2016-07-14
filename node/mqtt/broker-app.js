var mqtt = require('mqtt');

// connection
var client = mqtt.connect('mqtt://localhost:8884');
var sqllib = require('../mysql/app');

client.on('connect', function() { // connected

  // subscribe to a topic
  client.subscribe('#', function() {
    // message arrived
    client.on('message', function(topic, message, packet) {
      console.log("Received '" + message + "' on '" + topic + "'");
      var t = topic.split('/');
      console.log(t[2]);
      sqllib.update_req(parseInt(t[2], 10), message);
    });
  });

  // publish to a topic
  client.publish('/booth/mysql_client', 'I am up ..', function() {
    console.log("Message is published");
//    client.end(); // Close the connection when published
  });
});
