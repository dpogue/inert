describe('ShadowDOM v0', function() {
  if (!Element.prototype.createShadowRoot) {
    console.log('ShadowDOM v0 is not supported by the browser.');
    return;
  }

  before(function() {
    fixture.setBase('test/fixtures');
  });

  beforeEach(function() {
    fixture.load('basic.html');
    // Because inert relies on MutationObservers,
    // wait till next microtask before running tests.
    return Promise.resolve();
  });

  afterEach(function() {
    fixture.cleanup();
  });

  var host;

  beforeEach(function() {
    fixture.el.inert = false;
    host = document.createElement('div');
    fixture.el.appendChild(host);
    host.createShadowRoot();
  });

  it('should apply inside shadow trees', function() {
    var shadowButton = document.createElement('button');
    shadowButton.textContent = 'Shadow button';
    host.shadowRoot.appendChild(shadowButton);
    shadowButton.focus();
    fixture.el.inert = true;
    expect(isUnfocusable(shadowButton)).to.equal(true);
  });

  it('should apply inert styles inside shadow trees', function() {
    var shadowButton = document.createElement('button');
    shadowButton.textContent = 'Shadow button';
    host.shadowRoot.appendChild(shadowButton);
    shadowButton.focus();
    shadowButton.inert = true;
    expect(getComputedStyle(shadowButton).pointerEvents).to.equal('none');
  });

  it('should apply inside shadow trees distributed content', function() {
    host.shadowRoot.appendChild(document.createElement('content'));
    var distributedButton = document.createElement('button');
    distributedButton.textContent = 'Distributed button';
    host.appendChild(distributedButton);
    distributedButton.focus();
    fixture.el.inert = true;
    expect(isUnfocusable(distributedButton)).to.equal(true);
  });
});
