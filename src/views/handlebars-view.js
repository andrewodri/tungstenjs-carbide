/**
 * @class HandlebarsView
 * @author Andrew Odri andrew@affirmix.com
 *
 * This extends the base view in TungstenJS with Handlebars templating. It provides an updated static render function that compiles and caches the template on first execution, renders the template, and chains any deferred responses.
 */
import {View} from '../../../tungstenjs/src/view';

//import Handlebars from '../bower_components/handlebars/handlebars.runtime';

export class HandlebarsView extends View {
	/**
	 * @static
	 * @param {Object} request The request is a deferred object containing the data to be rendered by the view. Usually this is a deferred AJAX object returned by the model, but could be any appropriate object.
	 * @return {Object} Returns a deferred object containing the rendered view HTML after it has been applied to the template in the in the template function
	 *
	 * This function compiles and caches the Handlebars template supplied, and then renders the template as a deferred based on deferred data.
	 */
	static render(request) {
		console.log('HandlebarsView.render()');

		if(!Reflect.has(this, 'compiledTemplate')){
			this.compiledTemplate = Handlebars.compile(this.template);
		}

		let deferred = $.Deferred();

		$.when(request).done(
			(data, textStatus, jqXHR) => deferred.resolve(
				this.compiledTemplate(data)
			)
		);

		return deferred.promise();
	}
}
