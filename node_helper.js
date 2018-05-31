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
	var params = {
		SimilarityThreshold: 90,
		SourceImage: {
			S3Object: {
				Bucket: payload.Bucket,
				Name: payload.sourceName
			}
		},
		TargetImage: {
			S3Object: {
				Bucket: payload.Bucket,
				Name: payload.targetName
			}
		}
	};
	rekognition.compareFaces(params, function(err, data) {
		if(err) {
			  self.sendSocketNotification("FAIL_FACE_RECOGNITION", err);
		}
		else {
			  var face = data.FaceMatches;
			  for(var i=0; i<face.length; i++) {
				  if(face[i].Similarity > 90) {
			 		 self.sendSocketNotification("SUCCESS_FACE_RECOGNITION", face[i].Similarity);
				  }
			  }
			  self.sendSocketNotification("FAIL_FACE_RECOGNITION", face[i].Similarity);
			return;
		}
	});
  },


  socketNotificationReceived: function(notification, payload) {
	var self = this;
	if (notification == "WAKE_UP_MIRROR") {
		self.comparingFace(payload);
	}
	else if(notification == "INIT_FACE") {
		self.sendSocketNotification("HIDE_MODULES");
	}
	else if(notification == "HIDE") {
		self.sendSocketNotification("HIDE_ALL_MODULES", "hide all modules");
	}
  },

});
