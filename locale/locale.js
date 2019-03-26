(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], function () {
			return factory();
		});
	} else {
		// Browser globals
		if (!root.Locale) root.Locale = factory();
	}
}(this, function () {
	var Locale = function(options) {
		this.messages = options.messages || null;
		this.lang = options.lang || 'ru';

		if (!this._isProperObj(this.messages)) throw new Error('Options lang is not json or js object, check it.');
		if (this.isJson(this.messages)) this.messages = JSON.parse(this.messages);
	};

	Locale.prototype = {
		constructor : Locale,
		/**
		 * Check if messages for lang has prope format (json or js object)
		 * @param {object} obj
		 */
		_isProperObj : function(obj) {
			return this.isJson(obj) || this.isObject(obj);
		},
		/**
		 * Get lang key
		 */
		gettext : function(key) {
			var str, n, res,
				args = Array.prototype.slice.apply(arguments);
			if (!this.messages) throw new Error('Messages list require');
			if (!args || args.length < 1 || !RegExp) return;

			str = this.messages[key];
			if (!str) {
				str = key;
			} else if (str != null && typeof( str ) == 'object' && typeof( str.unshift ) == 'function') {
				n = args[1];
				str = str[this.nplural(this.lang, n) ] || '';
			}
			args[0] = str;
			try {
				res = this.sprintf.apply(null, args);
			} catch (e){
				return str;
			}
			
			return res;
		},
		/**
		 * Set new lang
		 * @param {String} lang Like 'ru', 'uk'
		 * @param {String|Object} messages JSON or js object
		 */
		setLang : function(lang, messages) {
			if (arguments.length !== 1) throw new Error('Require all arguments');
			if (!this._isProperObj(messages)) throw new Error('Require prope messages format');
			this.lang = lang;
			this.messages = messages;
		},
		isJson : function(str) {
			var json;

			if (typeof str !== 'string') return false;
			
			try {
				json = JSON.parse(str);
				return json;
			} catch(e) {
				return false;
			}
		},
		isObject : function(value) {
			var str = Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
			return str === 'object';
		},
		/**
		 * Sprintf function for js
		 * @s - to string
		 * @d - to integer
		 */
		sprintf : function() {
			var	str_repeat = function(i, m) {
					for (var o = []; m > 0; o[--m] = i); return(o.join('')); 
				},
				i = 0,
				f = arguments[i++],
				o = [],
				m, p, c, x, a;

			while (f) {
				if (m = /^[^\x25]+/.exec(f)) {
					o.push(m[0]);
				} else if (m = /^\x25{2}/.exec(f)) {
					o.push('%');
				} else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {
					if (((a = arguments[m[1] || i++]) == null) || (a == undefined)) {
						throw ("Too few arguments.");
					}
					if (/[^s]/.test(m[7]) && (typeof(a) != 'number')) {
						throw ("Expecting number but found " + typeof(a));
					}
					switch (m[7]) {
						case 'b':
							a = a.toString(2);
							break;
						case 'c':
							a = String.fromCharCode(a);
							break;
						case 'd':
							a = parseInt(a, 10);
							break;
						case 'e':
							a = m[6] ? a.toExponential(m[6]) : a.toExponential();
							break;
						case 'f':
							a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a);
							break;
						case 'o':
							a = a.toString(8);
							break;
						case 's':
							a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a);
							break;
						case 'u':
							a = Math.abs(a);
							break;
						case 'x':
							a = a.toString(16);
							break;
						case 'X':
							a = a.toString(16).toUpperCase();
							break;
					}
					a = (/[def]/.test(m[7]) && m[2] && a > 0 ? '+' + a : a);
					c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
					x = m[5] - String(a).length;
					p = m[5] ? str_repeat(c, x) : '';
					o.push(m[4] ? a + p : p + a);
				} else {
					throw ("Huh ?!");
				}
				f = f.substr(m[0].length);
			}
			return o.join('');
		},
		/**
		 * Plurals form http://docs.translatehouse.org/projects/localization-guide/en/latest/l10n/pluralforms.html?id=l10n/pluralforms
		 */
		nplural : function(lang, n) {
			if (lang == 'ru') {
				return ( 
				(n % 10 == 1 && n % 100 != 11)
					? 0
					: (n % 10 >= 2 && n % 10 <= 4 && ( n % 100 < 10 || n % 100 >= 20))
						? 1
						: 2
						);
			} else if (lang == 'en') {
				return n == 1 ? 0 : 1;
			} else {
				return 0;
			}
		}
	};

	return Locale;
}));