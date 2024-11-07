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
  fileAction = 'encrypt'; // 'encrypt' o 'decrypt'
  selectedFile: File | null = null;
  decryptionFile: File | null = null;
  encryptedFileUrl: string | null = null;
  decryptedFileUrl: string | null = null;
  encryptedFileName = '';
  decryptedFileName = '';
  message = '';
  isErrorMessage = false;

  constructor(private encryptionService: EncryptionService) { }

  onEncryptionTypeChange() {
    // Limpia todos los campos cuando cambia el tipo de cifrado
    this.clear();
    // Establece el valor por defecto de fileAction si es necesario
    if (this.encryptionType === 'file') {
      this.fileAction = 'encrypt'; // O el valor que prefieras por defecto
    }
  }

  onFileActionChange() {
    // Limpia los campos específicos de la acción de archivo
    this.password = '';
    this.selectedFile = null;
    this.decryptionFile = null;
    this.encryptedFileUrl = null;
    this.decryptedFileUrl = null;
    this.encryptedFileName = '';
    this.decryptedFileName = '';
    this.message = '';
  }
  

  // Maneja el cambio de selección de archivo
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (this.fileAction === 'encrypt') {
        this.selectedFile = input.files[0];
        this.decryptionFile = null; // Asegura que el otro campo esté vacío
      } else if (this.fileAction === 'decrypt') {
        this.decryptionFile = input.files[0];
        this.selectedFile = null; // Asegura que el otro campo esté vacío
      }
    }
  }

  encrypt() {
    if (this.encryptionType === 'text') {
      this.encryptionService.encrypt(this.data, this.password).subscribe(
        result => {
          this.encryptedData = result;
          this.showMessage('Texto cifrado correctamente.');
        },
        error => console.error('Encryption failed', error)
      );
    } else if (this.encryptionType === 'file' && this.fileAction === 'encrypt') {
      if (this.selectedFile) {
        this.encryptionService.encryptFile(this.selectedFile, this.password).subscribe(
          (response: HttpResponse<Blob>) => {
            const blob = response.body;
            if (blob) {
              const filename = this.getFileNameFromResponse(response);
              this.encryptedFileName = filename;
              this.encryptedFileUrl = window.URL.createObjectURL(blob);
              this.showMessage('Archivo cifrado correctamente.');
            } else {
              console.error('El cuerpo de la respuesta es nulo');
            }
          },
          error => console.error('File encryption failed', error)
        );
      } else {
        console.error('No se ha seleccionado ningún archivo para cifrar');
      }
    } else {
      console.error('Acción no válida para cifrado');
    }
  }

  decrypt() {
    if (this.encryptionType === 'text') {
      this.encryptionService.decrypt(this.encryptedData, this.password).subscribe(
        result => {
          this.decryptedData = result;
          this.showMessage('Texto descifrado correctamente.');
        },
        error => {
          console.error('Decryption failed', error);
          this.showErrorMessage('Error al descifrar el texto. Por favor, verifica la contraseña y los datos ingresados.');
        }
      );
    } else if (this.encryptionType === 'file' && this.fileAction === 'decrypt') {
      if (this.decryptionFile) {
        this.encryptionService.decryptFile(this.decryptionFile, this.password).subscribe(
          (response: HttpResponse<Blob>) => {
            const blob = response.body;
            if (blob) {
              const filename = this.getFileNameFromResponse(response);
              this.decryptedFileName = filename;
              this.decryptedFileUrl = window.URL.createObjectURL(blob);
              this.showMessage('Archivo descifrado correctamente.');
            } else {
              console.error('El cuerpo de la respuesta es nulo');
              this.showErrorMessage('Error al descifrar el archivo.');
            }
          },
          error => {
            console.error('File decryption failed', error);
            this.showErrorMessage('Error al descifrar el archivo. Por favor, verifica la contraseña y el archivo seleccionado.');
          }
        );
      } else {
        console.error('No se ha seleccionado ningún archivo para descifrar');
        this.showErrorMessage('Por favor, selecciona un archivo para descifrar.');
      }
    } else {
      console.error('Acción no válida para descifrado');
    }
  }
  

  getFileNameFromResponse(response: HttpResponse<Blob>): string {
    const contentDisposition = response.headers.get('Content-Disposition') || '';
    const matches = /filename="([^"]+)"/.exec(contentDisposition);
    return (matches && matches[1]) ? matches[1] : 'archivo';
  }

  showMessage(msg: string) {
    this.message = msg;
    this.isErrorMessage = false;
    setTimeout(() => (this.message = ''), 3000);
  }

  showErrorMessage(msg: string) {
    this.message = msg;
    this.isErrorMessage = true;
    setTimeout(() => (this.message = ''), 3000);
  }
  

  closeAlert() {
    this.message = '';
  }

  clear() {
    this.data = '';
    this.password = '';
    this.encryptedData = '';
    this.decryptedData = '';
    this.selectedFile = null;
    this.decryptionFile = null;
    this.encryptedFileUrl = null;
    this.decryptedFileUrl = null;
    this.encryptedFileName = '';
    this.decryptedFileName = '';
    this.message = '';
  }


  
}