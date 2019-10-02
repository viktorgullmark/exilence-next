import React, { useEffect } from 'react';
import { Subject } from 'rxjs';

export const withSubscription = <P extends object>(Component: React.FC<P>, destroy$: Subject<boolean>): React.FC<P & any> => ({
    ...props
}) => {
    useEffect(() => {
        return () => {
            destroy$.next(true);
        }
    }, [])
    return <Component {...props as P} />;
}