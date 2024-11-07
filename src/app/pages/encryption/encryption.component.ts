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
  data: string = '';
  password: string = '';
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
  // Variables para la generación de claves
  passphrase = '';
  fullName = '';
  email = '';
  publicKey = '';
  privateKey = '';
  identity = '';

  showCreatorInfo: boolean = false;
  isTouchDevice: boolean = false;
  ngOnInit() {
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  constructor(private encryptionService: EncryptionService) { }


   // Método para alternar la visibilidad
   toggleCreatorInfo() {
    this.showCreatorInfo = !this.showCreatorInfo;
  }

  // Método para cerrar la información
  closeCreatorInfo() {
    this.showCreatorInfo = false;
  }
  onEncryptionTypeChange() {
    this.clear(); // Limpia todos los campos
  
    // Opciones específicas
    if (this.encryptionType === 'file') {
      this.fileAction = 'encrypt'; // Valor por defecto
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
      this.encryptionService.encrypt(this.data, this.password).subscribe({
        next: result => {
          this.encryptedData = result;
          this.showMessage('Texto cifrado correctamente.');
        },
        error: error => console.error('Encryption failed', error)
      });
    } else if (this.encryptionType === 'file' && this.fileAction === 'encrypt') {
      if (this.selectedFile) {
        this.encryptionService.encryptFile(this.selectedFile, this.password).subscribe({
          next: (response: HttpResponse<Blob>) => {
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
          error: error => console.error('File encryption failed', error)
        });
      } else {
        console.error('No se ha seleccionado ningún archivo para cifrar');
      }
    } else {
      console.error('Acción no válida para cifrado');
    }
  }
  

  decrypt() {
    if (this.encryptionType === 'text') {
      this.encryptionService.decrypt(this.encryptedData, this.password).subscribe({
        next: result => {
          this.decryptedData = result;
          this.showMessage('Texto descifrado correctamente.');
        },
        error: error => {
          console.error('Decryption failed', error);
          this.showErrorMessage('Error al descifrar el texto. Por favor, verifica la contraseña y los datos ingresados.');
        }
      });
    } else if (this.encryptionType === 'file' && this.fileAction === 'decrypt') {
      if (this.decryptionFile) {
        this.encryptionService.decryptFile(this.decryptionFile, this.password).subscribe({
          next: (response: HttpResponse<Blob>) => {
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
          error: error => {
            console.error('File decryption failed', error);
            this.showErrorMessage('Error al descifrar el archivo. Por favor, verifica la contraseña y el archivo seleccionado.');
          }
        });
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
  this.fileAction = 'encrypt';
  this.encryptedData = '';
  this.decryptedData = '';
  this.encryptedFileUrl = '';
  this.decryptedFileUrl = '';
  this.encryptedFileName = '';
  this.decryptedFileName = '';
  this.message = '';
  this.isErrorMessage = false;

  // Campos de generación de claves
  this.passphrase = '';
  this.fullName = '';
  this.email = '';
  this.publicKey = '';
  this.privateKey = '';
  this.identity = '';
}

  //cifrado ascimetrico
  generateKeys() {
    if (this.passphrase && this.fullName && this.email) {
      this.identity = `${this.fullName} <${this.email}>`;
      this.encryptionService.generateKeys(this.passphrase, this.identity).subscribe({
        next: keys => {
          this.publicKey = keys.publicKey;
          this.privateKey = keys.privateKey;
          this.showMessage('Claves generadas correctamente.');
        },
        error: error => {
          console.error('Key generation failed', error);
          this.showErrorMessage('Error al generar las claves.');
        }
      });
    } else {
      this.showErrorMessage('Por favor, completa todos los campos.');
    }
  }
  

  downloadKey(keyContent: string, filename: string) {
    const blob = new Blob([keyContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
  


  
}