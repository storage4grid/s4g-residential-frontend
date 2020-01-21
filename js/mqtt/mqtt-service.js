'use strict';

//The service implemented in this module will save the status of the user (logged or not logged) ad will save user info at first registration
angular.module('mqttIsmb.mqttIsmbService', [])

    .factory('MqttFactory', ['$rootScope', 'MqttClient', function($rootScope, MqttClient) {

        //open the socket
        var listOfTopicManager = {};
        var inConnection = false;
        //this queue is used to let user register new topic even though the connection is not yet established
        //if the connection is not yet established, in fact, we insert the topic here and then, when the successCallback will be called, we will subscribe it
        var tempQueueOfTopic = [];
        return {
            init: function(ip, port, id) {
                //TODO: understand what to do if I want to connect to more than one mqtt broker
                if (!MqttClient.connected && inConnection!=true) {
                    MqttClient.init(ip, port, id);
                    MqttClient._client.onMessageArrived = this.mqttOnMessageArrived;
                    MqttClient._client.onConnectionLost = this.onConnectionLost
                    this.reconnect();
                }
            },
            mqttSuccessCallback: function () {
                inConnection = false;
                var arrayLength = tempQueueOfTopic.length;
                for (var i = 0; i < arrayLength; i++) {
                    var value = tempQueueOfTopic.pop();
                    //alert(value);
                    MqttClient.subscribe(value);
                    //console.log($scope.tempQueueOfTopic.length);
                }
                /*
                //send a sample message
                var message = new Paho.MQTT.Message("Hello");
                message.destinationName = "testtopic/1";
                MqttClient.MqttClient.send(message);
                */
            },
            mqttSubscribeToNewTopic: function(topic, messageManagerMethod)
            {
                if (MqttClient.connected)
                {
                    MqttClient.subscribe(topic);
                }
                else
                {
                    //if the connection is not yet established, we insert the topic in tempQueueOfTopic and then, when the successCallback will be called, we will actually subscribe it
                    tempQueueOfTopic.push(topic);
                }
                listOfTopicManager[topic]= messageManagerMethod;
            },
            mqttOnMessageArrived : function (message) {
                var topic = message.destinationName;
                for (var key in listOfTopicManager) {
                    // skip loop if the property is from prototype
                    if (listOfTopicManager.hasOwnProperty(key)) {
                        var obj = listOfTopicManager[key];
                        obj(message);
                    }
                    else
                    {
                        console.log("ERROR: the listOfTopicManager was not processed properly for "+key);
                    }
                }


            },
            reconnect: function()
            {
                if (!MqttClient.connected && inConnection!=true) {
                    MqttClient.connect({onSuccess: this.mqttSuccessCallback});
                    inConnection = true;
                }
            },
            onConnectionLost : function(resp) {
                console.log("Angular-Paho: Connection lost on ", MqttClient._client._id, ", error code: ", resp);
                MqttClient._client._isConnected = false;
                inConnection=false;
                //try to reconnect
                //this.reconnect();
            }

    };
    }]);