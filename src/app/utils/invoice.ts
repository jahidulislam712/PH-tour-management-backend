import PDFDocument from "pdfkit";

interface InvoiceData {
  invoiceNumber: string;
  booking: {
    _id: string;
    gestCount: number;
    createdAt: Date;
    user: {
      name: string;
      email: string;
      phone: string;
      address?: string;
    };
  };
  payment: {
    transactionId: string;
    amount: number;
    status: string;
  };
  tour: {
    title: string;
    departureLocation?: string;
    arrivalLocation?: string;
    startDate?: Date;
    endDate?: Date;
    costFrom?: number;
  };
}

export const generateInvoicePDF = (data: InvoiceData): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      const chunks: Buffer[] = [];

      doc.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });

      doc.on("error", (err: Error) => {
        reject(err);
      });

      // Header
      doc
        .fontSize(24)
        .font("Helvetica-Bold")
        .text("INVOICE", 50, 50);

      // Invoice details
      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Invoice #: ${data.invoiceNumber}`, 50, 85)
        .text(`Status: ${data.payment.status}`, 50, 115);

      // Horizontal line
      doc.moveTo(50, 130).lineTo(550, 130).stroke();

      // Customer Info Section
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("CUSTOMER DETAILS", 50, 145);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(
          `${data.booking.user.name}`,
          50,
          165
        )
        .text(`Email: ${data.booking.user.email}`, 50, 180)
        .text(`Phone: ${data.booking.user.phone}`, 50, 195)
        .text(`Address: ${data.booking.user.address || "N/A"}`, 50, 210);

      // Tour Details Section
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("TOUR DETAILS", 50, 235);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Tour: ${data.tour.title}`, 50, 255)
        .text(
          `Route: ${data.tour.departureLocation || "N/A"} → ${
            data.tour.arrivalLocation || "N/A"
          }`,
          50,
          270
        );

      if (data.tour.startDate && data.tour.endDate) {
        doc.text(
          `Dates: ${new Date(data.tour.startDate).toLocaleDateString()} - ${new Date(
            data.tour.endDate
          ).toLocaleDateString()}`,
          50,
          285
        );
      }

      doc.text(`Number of Guests: ${data.booking.gestCount}`, 50, 300);

      // Cost Breakdown Section
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("COST BREAKDOWN", 50, 325);

      // Table header
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Description", 50, 345)
        .text("Unit Price", 250, 345)
        .text("Quantity", 380, 345)
        .text("Total", 450, 345);

      // Horizontal line
      doc.moveTo(50, 360).lineTo(550, 360).stroke();

      // Cost row
      doc
        .fontSize(10)
        .font("Helvetica")
        .text("Tour Per Guest", 50, 375)
        .text(`$${(data.payment.amount / data.booking.gestCount).toFixed(2)}`, 250, 375)
        .text(data.booking.gestCount.toString(), 380, 375)
        .text(`$${data.payment.amount.toFixed(2)}`, 450, 375);

      // Horizontal line
      doc.moveTo(50, 390).lineTo(550, 390).stroke();

      // Total
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("TOTAL AMOUNT", 50, 410)
        .text(`$${data.payment.amount.toFixed(2)}`, 450, 410);

      // Payment Info
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("PAYMENT INFORMATION", 50, 450);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Transaction ID: ${data.payment.transactionId}`, 50, 470)
        .text(`Payment Status: ${data.payment.status}`, 50, 485)
        .text(
          `Booking Reference: ${data.booking._id}`,
          50,
          500
        );

      // Footer
      doc
        .fontSize(8)
        .font("Helvetica")
        .text(
          "Thank you for your business! This is an automatically generated invoice.",
          50,
          700,
          { align: "center" }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};


