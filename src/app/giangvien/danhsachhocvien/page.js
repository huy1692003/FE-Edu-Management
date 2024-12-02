'use client'
import { useState, useEffect } from 'react';
import hocvienService from '@/services/hocvienService';
import sendEmailService from '@/services/sendEmailService';
import { Table, Space, Button, message, Modal, Form, Input, Spin } from 'antd';

export default function DanhSachHocVien() {
  const [hocviens, setHocviens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedHocVien, setSelectedHocVien] = useState(null);
  const [form] = Form.useForm();
  const [pdfBlob, setPdfBlob] = useState(null);
  const [isPdfModalVisible, setIsPdfModalVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    const fetchHocViens = async () => {
      try {
        const giangvienId = JSON.parse(localStorage.getItem('user'))?.giangvienID||0;
        if (giangvienId) {
          const data = await hocvienService.getHocViensByGiangVien(giangvienId);
          setHocviens(data);
        }
      } catch (error) {
        console.error('Error fetching hoc viens:', error);
        message.error('Không thể tải danh sách học viên');
      } finally {
        setLoading(false);
      }
    };

    fetchHocViens();
  }, []);

  const showModal = (hocvien) => {
    setSelectedHocVien(hocvien);
    setIsModalVisible(true);
    form.setFieldsValue({
      email: hocvien.email
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSendNotification = async (values) => {
    setIsSendingEmail(true);
    try {
      const emailData = {
        toEmail: values.email,
        subject: values.tieuDe,
        body: values.noiDung
      };

      await sendEmailService.sendEmail(emailData);
      message.success('Đã gửi email thông báo cho học viên thành công');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Lỗi khi gửi email thông báo: ' + error.message);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleExportResults = async (hocvienId) => {
    setIsExporting(true);
    try {
      const pdfData = await hocvienService.getKetQuaHocTap(hocvienId);
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      setPdfBlob(blob);
      setIsPdfModalVisible(true);
    } catch (error) {
      message.error('Lỗi khi xuất kết quả học tập: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPdf = () => {
    if (pdfBlob) {
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `KetQuaHocTap_${selectedHocVien.hocVienId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setIsPdfModalVisible(false);
      setPdfBlob(null);
    } else {
      message.error('Không có file PDF để tải xuống');
    }
  };

  const handleViewPdf = () => {
    if (pdfBlob) {
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
    } else {
      message.error('Không có file PDF để xem');
    }
  };

  const columns = [
    {
      title: 'Mã học viên',
      dataIndex: 'hocVienId',
      key: 'hocVienId',
    },
    {
      title: 'Tên học viên', 
      dataIndex: 'tenHocVien',
      key: 'tenHocVien',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'soDienThoai',
      key: 'soDienThoai',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary"
            onClick={() => showModal(record)}
            loading={isSendingEmail && selectedHocVien?.hocVienId === record.hocVienId}
          >
            Gửi thông báo
          </Button>
          <Button
            type="primary" 
            onClick={() => {
              setSelectedHocVien(record);
              handleExportResults(record.hocVienId);
            }}
            loading={isExporting && selectedHocVien?.hocVienId === record.hocVienId}
          >
            Xem thành tích học tập
          </Button>
        </Space>
      ),
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Danh sách học viên</h1>
      <Table 
        columns={columns}
        dataSource={hocviens}
        loading={loading}
        rowKey="hocVienId"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} học viên`
        }}
      />

      <Modal
        title={`Gửi thông báo cho học viên ${selectedHocVien?.tenHocVien}`}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSendNotification}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input placeholder="Nhập email người nhận" />
          </Form.Item>

          <Form.Item
            name="tieuDe"
            label="Tiêu đề email"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề email!' }]}
          >
            <Input placeholder="Nhập tiêu đề email" />
          </Form.Item>

          <Form.Item
            name="noiDung"
            label="Nội dung email"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung email!' }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Nhập nội dung email"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={isSendingEmail}>
                Gửi email
              </Button>
              <Button onClick={handleCancel}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Kết quả học tập"
        open={isPdfModalVisible}
        onCancel={() => setIsPdfModalVisible(false)}
        footer={[
          <Button key="view" type="default" onClick={handleViewPdf}>
            Xem PDF
          </Button>,
          <Button key="download" type="primary" onClick={handleDownloadPdf}>
            Tải xuống
          </Button>,
          <Button key="cancel" onClick={() => setIsPdfModalVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        <p>Bạn có thể xem trực tiếp file PDF hoặc tải xuống.</p>
      </Modal>
    </div>
  );
}
