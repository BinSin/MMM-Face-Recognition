/*
 * Author : BinSin
 * https://github.com/BinSin/MMM-Face-Recognition
 */

Module.register("MMM-Face-Recognition", {
  defaults: {
	Bucket: 'YOUR_BUCKET_NAME',
	Name: 'YOUR_FACE_IMAGE_PATH',
  },

  start: function() {
	var self = this;
	Log.log("Starting module: " + this.name);
	self.sendSocketNotification("INIT_FACE_RECOGNITION", self.config);
  },

  notificationReceived: function(notification, payload, sender) {
	var self = this;
	if(sender) {
		if (notification == "RECOGNITION_FACE") {
			self.sendSocketNotification("WAKE_UP_MIRROR", self.config);
		}
	}
  },

  socketNotificationReceived: function(notification, payload) {
	var self = this;
	if(notification == "FAIL_FACE_RECOGNITION") {
		console.log("fail face recognition");
	}
	else if(notification == "SUCCESS_FACE_RECOGNITION") {
		console.log("success face recognition");
	}
  },

});
