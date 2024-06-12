import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

import HeaderVue from '../header/Header.vue';

describe('Header', () => {
  describe('Props', () => {
    it('Default', async () => {
      const wrapper = mount(HeaderVue);

      expect(wrapper).toMatchSnapshot();
    });
  });
});
