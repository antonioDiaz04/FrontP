import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-qr-gnerar-pdf',
  templateUrl: './qr-gnerar-pdf.component.html',
  styleUrl: './qr-gnerar-pdf.component.css'
})
export class QrGnerarPdfComponent {


  title = 'Generador de QR';
  clientes = [
    { nombre: 'Nico Antonio', id: 1 },
    { nombre: 'Ana Perez', id: 2 },
    { nombre: 'Juan Lopez', id: 3 },
    // Agrega más clientes según sea necesario
  ];



generarPDF() {
    const pdf = new jsPDF();
    const dataElement = document.getElementById('qr-container');

    if (dataElement) {
      html2canvas(dataElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('qrs.pdf');
      });
    }
  }




}
