require('../../../../testdom')();
var assert = require('chai').assert;
var sinon = require('sinon');
var rewire = require('rewire');
var helpers = require('../../../../../app/views/components/helpers.js');
var Profile = rewire('../../../../../app/views/pages/profile.js');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

import stubRouterContext from '../../../stub-router-context';
function renderComponent(props, ctx) {
  let Component = stubRouterContext(Profile, props);
  return TestUtils.renderIntoDocument(<Component {...props} />);
}

describe('Profile', function() {
  beforeEach(function() {
    this.sinon = sinon.sandbox.create();
    this.props = {}

    this.component = renderComponent(this.props, this);
  });

  afterEach(function() {
    this.sinon.restore();
  });

  it('renders the Profile component', function() {
    var slotMachine = TestUtils.findRenderedComponentWithType(this.component, Profile);
    assert.isDefined(slotMachine)
  })
})
