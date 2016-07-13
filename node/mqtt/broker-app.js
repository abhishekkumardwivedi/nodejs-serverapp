var mqtt = require('mqtt');

// connection
var client = mqtt.connect('mqtt://localhost:8884');

client.on('connect', function() { // connected

  // subscribe to a topic
  client.subscribe('/request/#', function() {
    // message arrived
    client.on('message', function(topic, message, packet) {
      console.log("Received '" + message + "' on '" + topic + "'");
    });
  });

  // publish to a topic
  client.publish('/booth/mysql_client', 'I am up ..', function() {
    console.log("Message is published");
//    client.end(); // Close the connection when published
  });
});
