import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { BASE_URL } from '../core/constants';
import { IUser } from '../entities/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  // getUser -> retrieves the user details
  getUser() {
    return this.http.get<IUser>(BASE_URL + '/api/user').pipe(
      catchError((error: any) => {
        console.error(error);
        return throwError(error);
      })
    );
  }
}
