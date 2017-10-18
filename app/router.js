import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('loading');
  this.route('demo');
  this.route('treemap');
  this.route('listarea-treemap');
  this.route('prime');
  this.route('pack');
  this.route('buble-zjex');
  this.route('buble-zjex1');
});

export default Router;
