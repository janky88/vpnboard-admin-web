import { proxy } from 'valtio';

export const configState = proxy<{
  site: API.GetSiteConfigResponse;
}>();
