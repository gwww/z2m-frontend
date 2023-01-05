import { devices } from '../hooks.server'
import type { PageServerLoad } from './$types';

export const load = (async ({ url, route }) => {
  // console.log('url: ', url, 'route: ', route)
  return {
    devices
  };
}) satisfies PageServerLoad;
