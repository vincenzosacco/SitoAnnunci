import { Component } from '@angular/core';
import { chatbotService } from '../../services/chatbot.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, NgIf, NgForOf]
})

export class ChatbotComponent {
  isOpen = false; // stato della tendina

  tag: string[] = ["","","",""];
  ruolo: string[] = ["Famiglia","Investitore"];
  investimento: string[] = ["Budget elevato","Budget limitato"];
  puntoDiForza: string[] = ["Caratteristica interna","Location"];
  urgenza: string[] = ["Posso aspettare","Urgente"];

  parte1Data = false;
  parte2Data = false;
  parte3Data = false;
  parte4Data = false;
  rispostaOttenuta = false;

  constructor(protected chatService: chatbotService, private router: Router) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
  }
  private controlla(val: string, pos: number) {
    if (!val) {
      this.tag[pos - 1] = "";
      return false;
    }
    this.tag[pos - 1] = val;
    return true;
  }

  controlla1() { this.parte1Data = this.controlla(this.tag[0],1); }
  controlla2() { this.parte2Data = this.controlla(this.tag[1],2); }
  controlla3() { this.parte3Data = this.controlla(this.tag[2],3); }
  controlla4() {
    this.parte4Data = this.controlla(this.tag[3],4);
    if(this.parte4Data) this.visualizza();
  }

  private visualizza(){
    this.chatService.raccomandazione(this.tag).subscribe(() => {
      setTimeout(()=> this.rispostaOttenuta = true, 1000);
    });
  }

  esci(){
    this.router.navigate(['/']);
  }
}
