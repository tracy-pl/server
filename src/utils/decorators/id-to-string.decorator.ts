/* eslint-disable @typescript-eslint/no-explicit-any */
type Consturctor = { new (...args: any[]): any };

export function IdToString<T extends Consturctor>(BaseClass: T): T {
  return class extends BaseClass {
    constructor(...args) {
      super(...args);
      Object.getOwnPropertyNames(BaseClass.prototype).forEach(
        (propertyName) => {
          if (
            propertyName !== 'constructor' &&
            typeof BaseClass.prototype[propertyName] === 'function'
          ) {
            this[propertyName] = new Proxy(BaseClass.prototype[propertyName], {
              apply: async function (
                target,
                thisArg,
                argumentsList,
              ): Promise<any> {
                const callResult = await target.apply(thisArg, argumentsList);
                if (callResult?._id?.toString) {
                  callResult._id = callResult._id.toString();
                }
                return callResult;
              },
            });
          }
        },
      );
    }
  };
}
