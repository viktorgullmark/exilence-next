declare module 'react-image' {
  import * as React from 'react';

  export interface ImgProps {
    // For img element props such as 'alt'
    [key: string]: any;

    src?: string | string[];
    loader?: JSX.Element;
    unloader?: JSX.Element;
    decode?: boolean;
    crossorigin?: string;
    container?: () => JSX.Element;
    loaderContainer?: () => JSX.Element;
    unloaderContainer?: () => JSX.Element;
  }

  export default class Img extends React.Component<ImgProps> {
    constructor(props: ImgProps);
    srcToArray(src: string): [];
    onLoad(): void;
    onError(): void;
    loadImg(): void;
    unloadImg(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
  }
}
