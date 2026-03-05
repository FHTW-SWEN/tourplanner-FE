import { TestBed } from '@angular/core/testing';
import { SearchInputViewModel } from './search-input.vm';

describe('SearchViewModel', () => {
  let vm: SearchInputViewModel;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    vm = new SearchInputViewModel();
  });

  describe('initial state', () => {
    it('should have an empty query', () => {
      expect(vm.query()).toBe('');
    });

    it('should have search disabled', () => {
      expect(vm.isSearchEnabled()).toBe(false);
    });
  });

  describe('setQuery()', () => {
    it('should update the query signal', () => {
      vm.setQuery('hello');
      expect(vm.query()).toBe('hello');
    });

    it('should enable search when query has content', () => {
      vm.setQuery('angular');
      expect(vm.isSearchEnabled()).toBe(true);
    });

    it('should disable search when query is cleared', () => {
      vm.setQuery('angular');
      vm.setQuery('');
      expect(vm.isSearchEnabled()).toBe(false);
    });
  });

  describe('isSearchEnabled', () => {
    it('should be false for an empty string', () => {
      vm.setQuery('');
      expect(vm.isSearchEnabled()).toBe(false);
    });

    it('should be false for whitespace only', () => {
      vm.setQuery('   ');
      expect(vm.isSearchEnabled()).toBe(false);
    });

    it('should be true for a string with content', () => {
      vm.setQuery('hello');
      expect(vm.isSearchEnabled()).toBe(true);
    });

    it('should be true for a string with leading/trailing whitespace and content', () => {
      vm.setQuery('  hello  ');
      expect(vm.isSearchEnabled()).toBe(true);
    });
  });
});
