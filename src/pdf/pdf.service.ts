import { Injectable } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';

@Injectable()
export class PdfService {
  async combinePdfs(pdfs: Buffer[]): Promise<Buffer> {
    const mergedPdf = await PDFDocument.create();
    for (const pdf of pdfs) {
      const pdfDoc = await PDFDocument.load(pdf);
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    return Buffer.from(await mergedPdf.save());
  }

  async splitPdf(pdf: Buffer, pageNumbers: number[]): Promise<Buffer[]> {
    const pdfDoc = await PDFDocument.load(pdf);
    const splitPdfs = await Promise.all(
      pageNumbers.map(async (pageNumber) => {
        const newPdf = await PDFDocument.create();
        const [ copiedPage ] = await newPdf.copyPages(pdfDoc, [ pageNumber - 1 ]);
        newPdf.addPage(copiedPage);
        return Buffer.from(await newPdf.save());
      }),
    );
    return splitPdfs;
  }

  async extractText(pdf: Buffer): Promise<string> {
    const pdfDoc = await PDFDocument.load(pdf);
    const pages = pdfDoc.getPages();
    let text = '';
    pages.forEach((page) => {
      text += page.getTextContent();
    });
    return text;
  }

  async protectPdf(pdf: Buffer, password: string): Promise<Buffer> {
    const pdfDoc = await PDFDocument.load(pdf);
    pdfDoc.encrypt({ userPassword: password });
    return Buffer.from(await pdfDoc.save());
  }
}
