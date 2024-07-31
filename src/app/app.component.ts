import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClient and HttpClientModule
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'teamsMessenger-workspace';
  textBoxContent: string = '';

  constructor(private msalService: MsalService, private http: HttpClient) {}
  onButtonClick() {
    console.log('TextBox Content:', this.textBoxContent);

    // Make an HTTP POST request
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
}
