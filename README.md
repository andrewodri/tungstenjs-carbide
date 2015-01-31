## What is Carbide for TungstenJS?

Carbide for TungstenJS is a set of official helper classes for [TungstenJS](https://github.com/affirmix/tungstenjs) that provide easy access to common web technologies and services. Classes are not interdepenent; these can be implemented one-by-one in TungstenJS projects as needed.

## What can I expect from Carbide for TungstenJS as development continues?

The following classes are currently on the roadmap for development:

**Models**

* [_LocalStorageModel_](https://github.com/affirmix/tungstenjs-carbide/blob/master/src/models/localstorage-model.js). Wraps HTML5 local storage.
* _TwitterModel_. Wraps services offered by Twitter.
* _FacebookModel_. Wraps services offered by Facebook.
* _GooglePlusModel_. Wraps services offered by Google+.
* _InboxModel_. Wraps services offered by [Inbox](https://www.inboxapp.com/).

**Views**

* [_HandlebarsView_](https://github.com/affirmix/tungstenjs-carbide/blob/master/src/views/handlebars-view.js). TungstenJS view functionality for Handlebars templates.
* _MustacheView_. TungstenJS view functionality for Mustache templates.
* _JadeView_. TungstenJS view functionality for Mustache templates.
* [_EJSView_](https://github.com/affirmix/tungstenjs-carbide/blob/master/src/views/ejs-view.js). TungstenJS view functionality for EJS templates.
* _UnderscoreView_. TungstenJS view functionality for Underscore templates.

**Controllers**

* _ResourceController_. TungstenJS routing enabled controller.

## This is all new to me. How can I use Carbide for TungstenJS?

See the [TungstenJS Todo MVC application](https://github.com/affirmix/tungstenjs-todomvc) for an example of TungstenJS with Carbide components.

These classes are completely self-contained, and as such the only dependency is [TungstenJS](https://github.com/affirmix/tungstenjs).

That said, each model may import it's own resources; for example, EJSView, MustacheView, and UnderscoreView each import their respective libraries. If you wish to use your own server or CDN for these imnported resources, you will need to adjust these as needed.
