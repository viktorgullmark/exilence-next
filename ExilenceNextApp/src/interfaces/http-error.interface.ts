import { HttpErrorResponse } from '@angular/common/http';

export interface HttpError extends HttpErrorResponse {
  message: string;
}
