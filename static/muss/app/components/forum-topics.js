import Ember from 'ember';
import config from './../config/environment';

export default Ember.Component.extend({
    session: Ember.inject.service('session'),
    ajax: Ember.inject.service('ajax'),
    routing: Ember.inject.service('-routing'),
    params: null,
    currentUrl: window.location.href,
    rssUrl: config.APP.API_HOST + "/" + "feed/",
    isLoaded: false,
    canCreateTopic: false,
    canRegister: false,
    isAdminOrModerator: false,

    didInsertElement() {
        this._super();
        this.params = this.get('routing.router.currentState.routerJsState.params.forum');
        this.checkPermissionsUser();
    },
    /**
    * @method: FinishedLoading
    * @description: Finished loading data server and hide loading
    */
    FinishedLoading() {
        //Is completed
        this.set('isLoaded', true);
        //Hide loading
        this.get('loadingSpinner').set('loading', false);
    },
    /**
    * @method: checkPermissionsUser
    * @description: Check if user logged can create topic or register, etc.
    */
    checkPermissionsUser(){
        let publicForum = this.get('model.forum.publicForum');
        let isAuthenticated = this.get('session.isAuthenticated');
        if (isAuthenticated) {

            // If is a public forum, not check permissions
            if(publicForum) {
                this.set('canCreateTopic', true);
                //Is completed
                this.FinishedLoading();
                return;
            }

            let namespace = config.APP.API_NAMESPACE;
            let pk = this.get('session').session.content.authenticated.user.id;

            //Check if user logged is superuser
            let isSuperUser = this.get('session').session.content.authenticated.user.is_superuser;

            return this.get('ajax').request('/' + namespace + '/check-permissions-forum-user/', {
                method: 'GET',
                data: {'user_id': pk, 'forum_id': this.params.pk}
            }).then(response => {
                //Is completed
                this.FinishedLoading();

                let isRegistered = response.data.register;
                let isModerator = response.data.is_moderator;
                let isTroll = response.data.is_troll;

                this.set('isAdminOrModerator', isSuperUser || isModerator);

                //Check if is a troll
                if(!isTroll) {
                    //Check if user logged can create topic
                    if(isRegistered || isModerator || isSuperUser) {
                        this.set('canCreateTopic', true);
                    }

                    //Check if user logged can register or unregister
                    if(isRegistered) {
                        //Already register
                        this.set('canRegister', false);
                    } else {
                        if(!isModerator || !isSuperUser ) {
                            this.set('canRegister', true)
                        }
                    }
                }
            });
        } else {
            //Is completed
            this.FinishedLoading();
        }
    }
});
