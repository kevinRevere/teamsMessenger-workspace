import { CommonModule, JsonPipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClient and HttpClientModule
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { Chat } from '@microsoft/microsoft-graph-types';

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
  title = 'teamsMessenger-workspace';
  textBoxContent: string = '';
  chats: Chat[] | null = null;
  selectedChat: Chat | null = null;

  ngOnInit() {
    // get user chats
    this.http.get('https://localhost:7085/api/message/chats').subscribe(
      (response: any) => {
        this.chats = response;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  // onSelectChat(chat: Chat) {
  //   this.selectedChat = chat;
  // }

  constructor(private msalService: MsalService, private http: HttpClient) {}
  onButtonClick() {
    console.log('TextBox Content:', this.textBoxContent);

    this.http
      .post('https://localhost:7085/api/message', {
        content: this.textBoxContent,
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

  onLogout() {
    this.msalService.logout();
  }

  onGetUser() {
    this.http.get('https://localhost:7085/api/user').subscribe(
      (response) => {
        console.log('Response:', response);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getChatType(chatType: any): string {
    switch (chatType) {
      case 0:
        return 'oneOnOne';
      case 1:
        return 'group';
      case 2:
        return 'meeting';
      default:
        return 'unknown';
    }
  }

  loadChatMembers(id: string) {
    this.http
      .get(`https://localhost:7085/api/message/chats/${id}/members`)
      .subscribe(
        (response: any) => {
          console.log('Chat Members:', response);
          const index = this.chats!.findIndex((chat) => chat.id === id);
          this.chats![index].members = response;
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }
}
