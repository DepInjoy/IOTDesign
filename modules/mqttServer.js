module.exports = function (client) {
    client.on("connect", function (packet) {
        self.clients[packet.clientId] = client;
        client.id = packet.clientId;
        console.log("MQTT CONNECT: client id: " + client.id);
        //
        client.connack({returnCode: 0});
    });
    
    client.on("subscribe", function (packet) {
        var granted = [];
        console.log("MQTT SUBSCRIBE(%s):%j", client.id, packet);
        for(var i = 0; i < packet.subscriptions.length;i++){
            var qos = packet.subscriptions[i].qos;
            var topic = packet.subscriptions[i].topic;
            var reg = new RegExp(topic.replace("+", "[^\/]+")
                            .replace("+", ".+") + "$");
            granted.push(qos);
            client.subscriptions.push(reg);
        }
        client.suback({
            messageId:          packet.subscriptions.messageId,
            granted:            granted
        });
    });

    client.on("publish", function (packet) {
        console.log("MQTT PUBLISH: %s %j", client.id, packet);
        for(var k in self.clients){
            var _client = self.clients[k];
            for(var i = 0; i < _client.subscriptions.length;i++){
                var subscription = _client.subscriptions[i];
                if(subscription.test(packet.topic)){
                    _client.publish({
                        topic:          packet.topic,
                        payload:        packet.payload
                    });
                    break;
                }
            }
        }
    });
    
    client.on("disconnect", function (packet) {
        console.log("MQTT DISCONNECT: client id: " + client.id);
        client.stream.end();
    });
};