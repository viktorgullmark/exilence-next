import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import RateLimiter from 'rxjs-ratelimiter';

@Injectable()
export class ExternalService {

  private rateLimiter = new RateLimiter(7, 10000);

  constructor(private http: HttpClient) { }
}
