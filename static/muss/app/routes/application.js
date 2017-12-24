import Route from "@ember/routing/route";
import { inject as service} from '@ember/service';
import { computed } from '@ember/object';
import Configuration from 'ember-simple-auth/configuration';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import RSVP from "rsvp";
import config from './../config/environment';

export default Route.extend(ApplicationRouteMixin, {
    ajax: service('ajax'),
    session: service('session'),
    currentUser: service('current-user'),

    beforeModel(transition) {
        Configuration.authenticationRoute = 'index';
        Configuration.authenticationRoute = 'index';
    },

    model() {
        if(this.get('currentUser').user != undefined) {
            let user_id = parseInt(this.get('currentUser').user.id);
            let namespace = config.APP.API_NAMESPACE;
            return RSVP.hash({
                notifications: this.get('store').query('notification', {"user": user_id, "limit": 10}),
                totalNotifications: this.get('ajax').request('/' + namespace + '/get-total-pending-notifications-user/', {
                    method: 'GET',
                    data: {
                        user_id: user_id
                    }
                }).then(response => {
                    return response.data;
                })
            });
        } else {
            return [];
        }
    },
    /**
    * @method renderTemplate
    * @description: Render all templates and show loading before
    */
    renderTemplate() {
        this.render('loading');
        this._super();
    },
});
