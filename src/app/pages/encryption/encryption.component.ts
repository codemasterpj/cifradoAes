import { Component } from '@angular/core';
import { EncryptionService } from '../../services/encryption/encryption.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-encryption',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './encryption.component.html',
  styleUrl: './encryption.component.css'
})
export class EncryptionComponent {
  data = '';
  password = '';
  encryptedData = '';
  decryptedData = '';
  encryptionType = 'text'; // 'text' o 'file'
  selectedFile: File | null = null;
  encryptedFileUrl: string | null = null;
  decryptionFile: File | null = null;
  decryptedFileUrl: string | null = null;
  message = '';

  constructor(private encryptionService: EncryptionService) { }

   // Maneja el cambio de selección de archivo
   onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onDecryptionFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.decryptionFile = input.files[0];
    }
  }


   // Método para cifrar según el tipo de entrada
   encrypt() {
    if (this.encryptionType === 'text') {
      this.encryptionService.encrypt(this.data, this.password).subscribe(
        result => {
          this.encryptedData = result;

        },
        error => console.error('Encryption failed', error)
      );
    } else if (this.encryptionType === 'file' && this.selectedFile) {
      this.encryptionService.encryptFile(this.selectedFile, this.password).subscribe(
        (response: HttpResponse<Blob>) => {
          const blob = response.body;
          if (blob) {
            const filename = this.getFileNameFromResponse(response);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
            this.showMessage('Proceso de cifrado completado.');
            console.log('Cifrado completado');
          } else {
            console.error('El cuerpo de la respuesta es nulo');
          }
        },
        error => console.error('File encryption failed', error)
      );
    }
  }

  // Método para descifrar según el tipo de entrada
  decrypt() {
    if (this.encryptionType === 'text') {
      // Lógica para texto
    } else if (this.encryptionType === 'file' && this.decryptionFile) {
      this.encryptionService.decryptFile(this.decryptionFile, this.password).subscribe(
        (response: HttpResponse<Blob>) => {
          const blob = response.body;
          if (blob) {
            const filename = this.getFileNameFromResponse(response);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
            this.showMessage('Proceso de descifrado completado.');
            console.log('Descifrado completado');
          } else {
            console.error('El cuerpo de la respuesta es nulo');
          }
        },
        error => console.error('File decryption failed', error)
      );
    }
  }
  
  getFileNameFromResponse(response: HttpResponse<Blob>): string {
    const contentDisposition = response.headers.get('Content-Disposition') || '';
    const matches = /filename="([^"]+)"/.exec(contentDisposition);
    return (matches && matches[1]) ? matches[1] : 'downloaded_file';
  }
  

  showMessage(msg: string) {
    this.message = msg;
    setTimeout(() => this.message = '', 3000); 
  }

  closeAlert() {
    this.message = '';
  }

  clear() {
    this.data = '';
    this.password = '';
    this.encryptedData = '';
    this.decryptedData = '';
    this.encryptionType = 'text';
    this.selectedFile = null;
    this.encryptedFileUrl = null;
    this.decryptionFile = null;
    this.decryptedFileUrl = null;
  }

}
