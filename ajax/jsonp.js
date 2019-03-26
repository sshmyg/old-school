!(function() {
	'use strict';

	if (window.jsonp) return;
	if (!window.CallbackRegistry) window.CallbackRegistry = {};

	var scriptOk = false,
		objectToUri = function(obj) {
			if (!obj) return false;

			var key,
				result = '&';

			for (key in obj) {
				if (!obj.hasOwnProperty(key)) continue;
				result += key + '=' + obj[key];
			}

			return result;
		};

	window.jsonp = function(options) {
		var type	= options.type || 'GET',
			url		= options.url || false,
			jsonp	= options.jsonp || 'jsonp', //jsonp function callback name
			data	= options.data || false,
			success	= options.success || false,
			error	= options.error || false;

		var scriptOk = false,
			callbackName = 'f' + String( Math.random() ).slice(2),
			script = document.createElement('script'),
			checkCallback = function() {
				if (scriptOk) return;
				delete CallbackRegistry[callbackName]; 
				if (typeof error === 'function') error('Error');
			},
			dataStr = objectToUri(data);

		url += ~url.indexOf('?') ? '&' : '?';
		url += 'jsonp=CallbackRegistry.' + callbackName;
		url += dataStr ?  dataStr : '';

		CallbackRegistry[callbackName] = function(data) {
			scriptOk = true;
			delete CallbackRegistry[callbackName];
			if (typeof success === 'function') success.apply(null, arguments);
		};

		/* IE */
		script.onreadystatechange = function() {
			if (this.readyState == 'complete' || this.readyState == 'loaded') {
				this.onreadystatechange = null;
				setTimeout(checkCallback, 0);
			}
		}

		script.onload = script.onerror = checkCallback;
		script.src = url;

		document.getElementsByTagName('head')[0].appendChild(script);
	};
}());



var d = {"id":"c965604a-3a31-be6a-9c63-eb9a26f4b025","device":{"dpidsha1":"0be1185e-50ee-b2f9-f5e9-fe2f9d5f40de","os":"macintel","ua":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36","language":"ru","ext":{"width":1440,"height":779}},"site":{"domain":null,"page":"file:///Users/serhey_shmyg/Work/ad-camp/widget-modules/app/index.html","ref":""},"ext":{"app_id":"88add4e8-cb24-46af-bbd9-79c535f84064","testMode":true},"imp":[{"tagid":"02e7aedb-69c4-44cd-bb6b-80ecf2c00f2d","banner":{"w":320,"h":50},"ext":{"type":"simple","close":1000},"id":"fe090133-e028-077d-bfdd-ffd3a971d225"},{"tagid":"042ca354-df27-4c12-b21c-e096a682f1b7","banner":{"w":320,"h":50},"ext":{"type":"simple","appendTo":".banner"},"id":"1243bafb-7b32-c014-75ed-9f5bbf5c324a"}]};

jsonp({
	url : 'http://rtb.test.adcamp.ru/jsonp/get/',
	data : {rtb : d},
	success : function(res, status) {
		console.log(res, status);
	},
	error : function(res) {
		console.log(res);
	}
})