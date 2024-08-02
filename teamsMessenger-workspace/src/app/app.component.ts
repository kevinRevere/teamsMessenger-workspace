import { CommonModule, JsonPipe } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http'; // Import HttpClient and HttpClientModule
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { User } from '@microsoft/microsoft-graph-types';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    HttpClientModule,
    JsonPipe,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'teams messenger';
  loadingUsers: boolean = true;
  users: User[] | null = null;
  selectedUsers: User[] = [];
  messageToSend: string = 'this is a test';

  constructor(private msalService: MsalService, private http: HttpClient) {}

  ngOnInit() {
    // get users
    this.http.get('https://localhost:7085/api/graph/users').subscribe(
      (response: any) => {
        this.users = response;
        this.loadingUsers = false;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  addUser(userId: string) {
    const user = this.users!.find((user) => user.id === userId);
    if (user) {
      this.selectedUsers.push(user);
    }
  }

  removeUser(userId: string) {
    const index = this.selectedUsers.findIndex((user) => user.id === userId);
    if (index !== -1) {
      this.selectedUsers.splice(index, 1);
    }
  }

  send() {
    const userIds = this.selectedUsers.map((user) => user.id);
    const payload = {
      userIds: userIds,
      message: this.messageToSend,
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http
      .post('https://localhost:7085/api/graph/send', JSON.stringify(payload), {
        headers,
      })
      .subscribe(
        (response) => {
          console.log('Response:', response);
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }
}
