import pThrottle from 'p-throttle';

export const throttle = pThrottle({
  limit: 1,
  interval: 10,
});
