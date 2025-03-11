import { serviceContainer } from './service.container';

export function Service(serviceName: string) {
  return function(constructor: any) {
    serviceContainer.register({
      name: serviceName,
      factory: () => new constructor(),
      singleton: true
    });
  };
}
