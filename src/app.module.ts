import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PdfModule } from './pdf/pdf.module';
import { ExcelModule } from './excel/excel.module';

@Module({
  imports: [PdfModule, ExcelModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
