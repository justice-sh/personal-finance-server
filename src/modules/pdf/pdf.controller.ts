import { Controller, Post } from "@nestjs/common";
import { PdfService } from "./pdf.service";

@Controller("pdf")
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post()
  generatePdf() {
    return this.pdfService.generateSamplePdf();
  }
}
