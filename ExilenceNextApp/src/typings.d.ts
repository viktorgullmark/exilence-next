/* SystemJS module definition */
declare let nodeModule: NodeModule;
interface NodeModule {
  id: string;
}

declare let window: Window;
declare let Window: {
  prototype: Window;
  new (): Window;
};
