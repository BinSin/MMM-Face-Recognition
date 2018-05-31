/*
 * Author : BinSin
 * https://github.com/BinSin/MMM-Face-Recognition
 */

Module.register("MMM-Face-Recognition", {
  defaults: {
	Bucket: 'YOUR_BUCKET_NAME',
	sourceName: 'YOUR_FACE_IMAGE_PATH',
	targetName: 'TARGET_IAMGE_PATH'
  },

  start: function() {
	var self = this;
	Log.log("Starting module: " + this.name);
	
	setTimeout(function() {
		self.sendSocketNotification("HIDE", "hide");
	}, 4000);

  },

  notificationReceived: function(notification, payload, sender) {
	var self = this;
	if(sender) {
		if (notification == "RECOGNITION_FACE") {
			console.log("wake up!!");
			self.sendSocketNotification("WAKE_UP_MIRROR", self.config);
		}
		else if(notification == "COMMAND") {
			if(payload == " go to sleep") {
				self.sendSocketNotification("HIDE", "hide");
			}
		}
	}
  },

  socketNotificationReceived: function(notification, payload) {
	var self = this;


	if(notification == "FAIL_FACE_RECOGNITION") {
		console.log("who are you? : " + payload);
	}
	else if(notification == "SUCCESS_FACE_RECOGNITION") {
		console.log("hello master! : " + payload);
	var options = {lockString: this.identifier};
	var modules = MM.getModules();
		modules.enumerate(function(module) {
			if(module.name != "MMM-Rekognition" && module.name != "MMM-Face-Recognition" && module.name != "MMM-Youtube-iframe") {
				try {
					options.force = true;
					module.show(1000, options);
				} catch(exception) {
				}
			}
		});
	}
	else if(notification == "HIDE_ALL_MODULES") {
		console.log("hide all modules");
		var options = {lockString: this.identifier};
		var modules = MM.getModules();
		modules.exceptModule(this).enumerate(function(module) {
			if(module.name != "MMM-Rekognition" && module.name != "MMM-Face-Recognition" && module.name != "MMM-Youtube-iframe") {
				module.hide(1000, options);
			}
		});
	}
  },

});
