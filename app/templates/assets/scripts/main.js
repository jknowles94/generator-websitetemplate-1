var website = (function () {
// Responsive stae managerment
	var responsiveStates = (function () {
		return {
			init: function () {
				ssm = ssm || {};

				ssm.addStates([
					{
						id: 'xs',
						maxWidth: 767,
						colorbox: false
					},
					{
						id: 'sm',
						minWidth: 768,
						maxWidth: 991,
						colorbox: false
					},
					{
						id: 'md',
						minWidth: 992,
						maxWidth: 1199
					},
					{
						id: 'lg',
						minWidth: 1200
					}]
				).ready();
			},

			is: function (state) {
				var states = ssm.getCurrentStates();
				for (var prop in states) {
					if (states.hasOwnProperty(prop)) {
						if (states[prop].id === state) {
							return true;
						}
					}
				}
				return false;

			}
		};
	}());


// Cookies
    var cookiePolicy = (function(){
    	var $cookie = $('#cookie');

        function init() {
            var cookie = Cookies.get('CLIENTNAMEcookie');

            if(cookie === undefined){
            	$cookie.addClass('active');
                $cookie.on('click','.close', close);
                Cookies.set('CLIENTNAMEcookie', 'true', { expires: 60*60*24*365 });
            }
            else{
                close();
            }
        }

        function close() {
            $cookie.remove();
            return false;
        }

        return {
            init: init
        };
	}());


// Form validation, add class of .form-vaildate around the form to validate
	var siteForms = (function () {
		var $forms = $('.form-validate');

		var init = function () {
			$forms.bootstrapValidator({
				excluded: [':disabled'],
				feedbackIcons: {
				valid: 'icon-ok',
				invalid: 'icon-cancel',
				validating: 'icon-loading'
				}
			});
		};

		return {
			init: function () {
				if ($forms.length) {
					init();
				}
			}
		};
	}());


// Global init function
	return {
		init: function () {
			responsiveStates.init();

			cookiePolicy.init();

			siteForms.init();

			// SVG fallback
			if (!Modernizr.svg) {
				$('img[src*="svg"]').attr('src', function () {
					return $(this).attr('src').replace('.svg', '.png');
				});
			}

		}

	};

}());

$(document).ready(website.init);
