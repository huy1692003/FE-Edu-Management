import apiClient from '@/constants/api';

export const sendEmailService = {
  sendEmail: async (emailData) => {
    try {
      // Convert any PDF blob to byte array if present
      let attachment = null;
      let attachmentName = null;
      let attachmentContentType = null;

      if (emailData.pdfBlob) {
        const arrayBuffer = await emailData.pdfBlob.arrayBuffer();
        attachment = Array.from(new Uint8Array(arrayBuffer));
        attachmentName = 'KetQuaHocTap.pdf';
        attachmentContentType = 'application/pdf';
      }

      const response = await apiClient.post('/api/SendEmail', {
        toEmail: emailData.toEmail,
        subject: emailData.subject,
        body: emailData.body,
        attachment: attachment,
        attachmentName: attachmentName,
        attachmentContentType: attachmentContentType
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default sendEmailService;
