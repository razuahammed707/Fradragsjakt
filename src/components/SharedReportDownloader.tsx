/* eslint-disable @typescript-eslint/no-explicit-any */
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Logo from '../../public/skatterpluss_logo_for_pdf.png';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { numberFormatter } from '@/utils/helpers/numberFormatter';
import { Badge } from './ui/badge';
import { useTranslation } from '@/lib/TranslationProvider';
interface SharedReportDownloaderProps {
  body: { title: string; amount?: number; total_amount?: number }[] | undefined;
  total: number;
  origin?: string;
}
export default function SharedReportDownloader({
  body,
  total,
  origin = 'writeOffs',
}: SharedReportDownloaderProps) {
  console.log({ body });

  const generatePDFWithImage = async () => {
    const doc = new jsPDF();

    try {
      const convertImageToBase64 = (imageSrc: typeof Logo) => {
        return new Promise<string>((resolve, reject) => {
          const img = new window.Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          };
          img.onerror = reject;
          img.src = imageSrc.src;
        });
      };

      const base64Image = await convertImageToBase64(Logo);

      const pageWidth = doc.internal.pageSize.getWidth();

      const imgWidth = 45;
      const imgHeight = 6;

      const centerX = (pageWidth - imgWidth) / 2;
      const center = pageWidth / 2;

      doc.addImage(base64Image, 'PNG', centerX, 10, imgWidth, imgHeight);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor('#5B52F9');
      doc.text('REPORT', center - 11, 25);
    } catch (error) {
      console.error('Error adding image:', error);
    }
    const tableBody = body?.map((item) => [
      item.title,
      `NOK ${origin !== 'writeOffs' ? item?.total_amount?.toFixed(2) : item?.amount?.toFixed(2)}`,
    ]);
    autoTable(doc, {
      startY: 55,
      head: [['Category', 'Amount']],
      headStyles: {
        fillColor: [217, 217, 217],
        textColor: '#2a363e',
      },
      body: tableBody,
    });

    const currentY = (doc as any).lastAutoTable?.finalY + 5;

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);

    const pageWidth = doc.internal.pageSize.getWidth();
    const marginRight = 10;
    const label = 'Savings from questions: ';
    const value = `NOK ${numberFormatter(total)}`;
    const labelWidth = doc.getTextWidth(label);
    const valueWidth = doc.getTextWidth(value);

    const startX = pageWidth - labelWidth - valueWidth - marginRight;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.setFont('Helvetica', 'normal');
    doc.text(label, startX, currentY + 20);

    doc.setTextColor('#5B52F9');
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'bold');
    doc.text(value, startX + labelWidth, currentY + 20);

    doc.save('savings_report.pdf');
  };
  const { translate } = useTranslation();
  return origin !== 'writeOffs' ? (
    <Badge
      onClick={generatePDFWithImage}
      className="bg-[#F0EFFE] px-1 h-6  hover:text-white rounded-[5px] text-xs text-[#627A97] font-medium"
    >
      <Download size={16} className="mr-2 " /> {translate('report')}
    </Badge>
  ) : (
    <Button
      onClick={generatePDFWithImage}
      className="btn btn-primary text-white"
    >
      <Download size={16} className="mr-2 " /> {translate('report')}
    </Button>
  );
}
