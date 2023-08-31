import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable,  } from 'rxjs';
import { timeout } from 'rxjs/operators';

export class TimeoutInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {

    return next.handle().pipe(timeout(12000));
}
}
