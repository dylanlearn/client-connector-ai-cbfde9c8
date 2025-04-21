
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

export async function exportWireframeAsImage(element: HTMLElement) {
  try {
    const canvas = await html2canvas(element);
    const imageData = canvas.toDataURL('image/png');
    saveAs(imageData, 'wireframe.png');
    return true;
  } catch (error) {
    console.error('Failed to export wireframe as image:', error);
    return false;
  }
}

export async function exportWireframeAsPDF(element: HTMLElement, wireframe: WireframeData) {
  try {
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('wireframe.pdf');
    return true;
  } catch (error) {
    console.error('Failed to export wireframe as PDF:', error);
    return false;
  }
}
