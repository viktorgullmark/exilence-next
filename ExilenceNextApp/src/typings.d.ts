/* SystemJS module definition */
declare var nodeModule: NodeModule;
interface NodeModule {
  id: string;
}

declare var window: Window;
declare var Window: {
  prototype: Window;
  new(): Window;
};

declare module 'yup';