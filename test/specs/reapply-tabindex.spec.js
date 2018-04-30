describe('Reapply existing tabindex', function() {
  before(function() {
    fixture.setBase('test/fixtures');
  });

  beforeEach(function() {
    fixture.load('tabindex.html');
    // Because inert relies on MutationObservers,
    // wait till next microtask before running tests.
    return Promise.resolve();
  });

  afterEach(function() {
    fixture.cleanup();
  });

  it('should reinstate pre-existing tabindex on setting inert=false', function() {
    var container = fixture.el.querySelector('#container');
    var tabindexes = new Map();
    var focusableElements = new Set();
    Array.from(container.children).forEach(function(el) {
      if (el.hasAttribute('tabindex')) {
        tabindexes.set(el, el.getAttribute('tabindex'));
      }
      if (!isUnfocusable(el)) {
        focusableElements.add(el);
      }
    });

    container.inert = true;
    focusableElements.forEach(function(focusableEl) {
      expect(isUnfocusable(focusableEl)).to.equal(true);
    });

    container.inert = false;
    focusableElements.forEach(function(focusableEl) {
      expect(isUnfocusable(focusableEl)).to.equal(false);
    });

    Array.from(container.children).forEach(function(el) {
      var tabindex = tabindexes.get(el);
      if (tabindex) {
        expect(el.hasAttribute('tabindex')).to.equal(true);
        expect(el.getAttribute('tabindex')).to.equal(tabindexes.get(el));
      } else {
        expect(el.hasAttribute('tabindex')).to.equal(false);
      }
    });
  });
});
