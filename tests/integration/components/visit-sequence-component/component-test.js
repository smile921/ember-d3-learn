import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('visit-sequence-component', 'Integration | Component | visit sequence component', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{visit-sequence-component}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#visit-sequence-component}}
      template block text
    {{/visit-sequence-component}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
