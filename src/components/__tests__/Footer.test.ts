import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

import FooterVue from '../footer/Footer.vue';

describe('Footer', () => {
  it('Default', () => {
    const wrapper = mount(FooterVue);

    expect(wrapper.element).toMatchSnapshot();
  });
});
