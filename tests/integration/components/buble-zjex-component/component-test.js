import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('buble-zjex-component', 'Integration | Component | buble zjex component', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{buble-zjex-component}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#buble-zjex-component}}
      template block text
    {{/buble-zjex-component}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
