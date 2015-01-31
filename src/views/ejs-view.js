/**
 * @class EJSView
 * @author Andrew Odri andrew@affirmix.com
 *
 * This extends the base view in TungstenJS with EJS templating. It provides an updated static render function that renders the template, and chains any deferred responses. The EJS library handles caching so that we don't have to.
 */
import {View} from '../../../tungstenjs/src/view';

//import {ejs as EJS} from '../bower_components/ejs/ejs';

export class EJSView extends View {
	/**
	 * @static
	 * @param {Object} request The request is a deferred object containing the data to be rendered by the view. Usually this is a deferred AJAX object returned by the model, but could be any appropriate object.
	 * @return {Object} Returns a deferred object containing the rendered view HTML after it has been applied to the template in the in the template function
	 *
	 * This function takes the supplied EJS template from `this.template`, and then renders the template as a deferred based on deferred data.
	 */
	static render(request) {
		console.log('EJSView.render()');

		let deferred = $.Deferred();

		$.when(request).done(
			(data, textStatus, jqXHR) => deferred.resolve(
				new EJS(this.template).render(data)
			)
		);

		return deferred.promise();
	}
}
