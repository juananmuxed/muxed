import { RouteLocationNormalized } from 'vue-router';

import { t } from 'src/plugins/I18n';
import { router } from 'src/router/Router';
import { APP_CONST } from 'src/constants/App';

export const useTitle = () => {
  const setTitle = (to?: RouteLocationNormalized) => {
    const _to = !to ? router.currentRoute.value : to;
    const titleRoute = _to.meta?.titleTag ? t(`${_to.meta?.titleTag}`) : '';
    document.title = `${titleRoute}@${APP_CONST.NAME}`;
  };

  return {
    setTitle,
  };
};
