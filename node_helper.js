/*
*
*/
'use strict';

var NodeHelper = require("node_helper");

var path = require("path");

var AWS = require('aws-sdk');
var fs = require('fs');

AWS.config.region = 'ap-northeast-1';
var s3 = new AWS.S3();

var rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});

module.exports = NodeHelper.create({

  start: function() {
	var self = this;
	console.log("Starting node helper for: " + this.name);
  },

  comparingFace: function(payload) {
	var self = this;

	var image = data;
	var params = {
		Image: {
			S3Object: {
				Bucket: payload.Bucket,
				Name: payload.Name
			}
		},
		Attributes: [ "DEFAULT", "ALL" ]
	};
	rekognition.compareFaces(params, function(err, data) {
		if(err) {
			  self.sendSocketNotification("FAIL_FACE_RECOGNITION", err);
		}
		else {
			  var face = data.Faces;
			  for(var i=0; i<face.length; i++) {
				  if(face[i].Face.Confidence > 80) {
			 		 self.sendSocketNotification("SUCCESS_FACE_RECOGNITION", face[i]);
				  	 return;
				  }
			  }
		}
	});
  },


  socketNotificationReceived: function(notification, payload) {
	var self = this;
	
	if (notification == "INIT_FACE_RECOGNITION") {
		self.comparingFace(payload);
	}
  },

});
