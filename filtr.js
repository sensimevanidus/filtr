(function($) {
	var methods = {
		tumblr_getApiURL: function(settings) {
			return settings.tumblr_apiURL + "/" + settings.tumblr_apiVersion + "/blog/" + settings.tumblr_blogName;
		},

		tumblr_get: function(query, settings) {
			$.ajax({
    			type: "GET",
    			url : this.tumblr_getApiURL(settings) + query,
    			dataType: "jsonp",
    			data: {
        			"api_key": settings.tumblr_apiKey
    			},
    			success: function(data) {
    				if (! data || ! data.meta || ! data.meta.status || 200 != data.meta.status) {
    					throw new Error("Posts could not be fetched this time, please try again!");
    				}

    				if (data.response && data.response.posts && data.response.posts.length) {
    					for (var i = 0; i < data.response.posts.length; i++) {
    						$.tmpl("postTemplate_" + data.response.posts[i].type, data.response.posts[i]).appendTo(settings.$container);
    						if ("audio" == data.response.posts[i].type) {
    							replaceIfFlash(9,"audio_player_" + data.response.posts[i].id,'\x3cdiv class=\x22audio_player\x22\x3e' + data.response.posts[i].player +'\x3c/div\x3e')
    						}
    					}
    				}
    			}
			});
		}
	};

	$.fn.filtr = function(options) {
		var settings = $.extend({
			// default settings.
			"pagination": true,
			"postsPerPage": 10,
			"tumblr_apiVersion": "v2",
			"tumblr_apiURL": "http://api.tumblr.com",
			"tumblr_apiKey": null, // REQUIRED
			"tumblr_blogName": null, // REQUIRED
			"postTemplatePrefix": null // REQUIRED
		}, options);
		settings.$container = this;

		return this.each(function() {
			methods.tumblr_get("/posts", settings);

			// prepare templates.
			$("#" + settings.postTemplatePrefix + "_text").template("postTemplate_text");
			$("#" + settings.postTemplatePrefix + "_quote").template("postTemplate_quote");
			$("#" + settings.postTemplatePrefix + "_answer").template("postTemplate_answer");
			$("#" + settings.postTemplatePrefix + "_video").template("postTemplate_video");
			$("#" + settings.postTemplatePrefix + "_audio").template("postTemplate_audio");
			$("#" + settings.postTemplatePrefix + "_link").template("postTemplate_link");
			$("#" + settings.postTemplatePrefix + "_chat").template("postTemplate_chat");
			$("#" + settings.postTemplatePrefix + "_photo").template("postTemplate_photo");

			// event handlers.
			$(".filtr_btn").live("click", function() {
				settings.$container.empty();
				methods.tumblr_get("/posts/" + $(this).attr("data-type"), settings);
			});
		});
	};
})(jQuery);