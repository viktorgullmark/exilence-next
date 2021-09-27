import {
  asyncScheduler,
  BehaviorSubject,
  Observable,
  OperatorFunction,
  throwError,
  timer,
} from 'rxjs';
import { filter, map, mergeMap, take } from 'rxjs/operators';

export const genericRetryStrategy = ({
  maxRetryAttempts = 3,
  scalingDuration = 1000,
  excludedStatusCodes = [],
}: {
  maxRetryAttempts?: number;
  scalingDuration?: number;
  excludedStatusCodes?: number[];
} = {}) => (attempts: Observable<any>) => {
  return attempts.pipe(
    mergeMap((error, i) => {
      const retryAttempt = i + 1;
      // if maximum number of retries have been met
      // or response is a status code we don't wish to retry, throw error
      if (retryAttempt > maxRetryAttempts || excludedStatusCodes.find((e) => e === error.status)) {
        return throwError(error);
      }
      // retry after 1s, 2s, etc...
      return timer(retryAttempt * scalingDuration);
    })
  );
};

export function rateLimit<T>(count: number, slidingWindowTime: number, scheduler = asyncScheduler) {
  let tokens = count;
  const tokenChanged = new BehaviorSubject(tokens);
  const consumeToken = () => tokenChanged.next(--tokens);
  const renewToken = () => tokenChanged.next(++tokens);
  const availableTokens = tokenChanged.pipe(filter(() => tokens > 0));

  return function (source: { pipe: (arg0: OperatorFunction<T, T>) => any }) {
    return source.pipe(
      mergeMap<T, Observable<T>>((value: T) =>
        availableTokens.pipe(
          take(1),
          map(() => {
            consumeToken();
            timer(slidingWindowTime, scheduler).subscribe(renewToken);
            return value;
          })
        )
      )
    );
  };
}
