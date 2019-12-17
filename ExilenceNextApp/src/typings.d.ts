import { ObjectOmit } from 'typelevel-ts'; // Thanks @gcanti, we <3 you all!
import * as signalR from '@microsoft/signalr';

declare module 'mobx-react' {
  export function inject<D>(
    mapStoreToProps: (store: any) => D
  ): <A extends D>(
    component: React.ComponentType<A>
  ) => React.SFC<ObjectOmit<A, keyof D> & Partial<D>>;
}

/* SystemJS module definition */
declare var nodeModule: NodeModule;
interface NodeModule {
  id: string;
}

declare var window: Window;
declare var Window: {
  prototype: Window;
  new (): Window;
};

declare module 'yup';

declare class HubConnection extends signalR.HubConnection {
  send(methodName: string, ...args: any[]): Promise<T>;
  /** Invokes a hub method on the server using the specified name and arguments.
   *
   * The Promise returned by this method resolves when the server indicates it has finished invoking the method. When the promise
   * resolves, the server has finished invoking the method. If the server method returns a result, it is produced as the result of
   * resolving the Promise.
   *
   * @typeparam T The expected return type.
   * @param {string} methodName The name of the server method to invoke.
   * @param {any[]} args The arguments used to invoke the server method.
   * @returns {Promise<T>} A Promise that resolves with the result of the server method (if any), or rejects with an error.
   */
}
