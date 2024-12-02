'use client'

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Typography, Button, Card, Row, Col, message } from "antd";
import { khoahocService } from "@/services/khoahocService";
import { hocvien_khoahocService } from "@/services/hocvien_khoahocService";
import { URL_SERVER } from "@/constants/api";

const ChiTietKhoaHocPage = () => {
  const [khoaHoc, setKhoaHoc] = useState(null);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    const fetchKhoaHoc = async () => {
      try {
        const data = await khoahocService.getById(id);
        setKhoaHoc(data);
      } catch (error) {
        console.error("Error fetching course details:", error);
        message.error("Không thể tải thông tin khóa học");
      }
    };

    if (id) {
      fetchKhoaHoc();
    }
  }, [id]);

  const handleDangKy = async () => {
    try {
      // Get current user info from localStorage or context
      const currentUser = JSON.parse(localStorage.getItem('user'))||null;
      
      if (!currentUser) {
        message.error("Vui lòng đăng nhập để đăng ký khóa học!");
        return;
      }

      // Kiểm tra xem người dùng có phải là học viên không
      if (!currentUser.hocvienID) {
        message.error("Bạn phải là học viên để đăng ký khóa học!");
        return;
      }

      const dangKyData = {
        hocVienId: currentUser.hocvienID,
        khoaHocId: id,
        ngayDangKy: new Date().toISOString(),
        trangThai: true
      };

      await hocvien_khoahocService.create(dangKyData);
      message.success("Đăng ký khóa học thành công!");
    } catch (error) {
      console.error("Error registering for course:", error);
      message.error("Đăng ký khóa học thất bại , bạn đã đăng ký khóa học này trước đó!");
    }
  };

  if (!khoaHoc) {
    return <Typography.Title level={3}>Loading...</Typography.Title>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <img 
              src={URL_SERVER + khoaHoc.image} 
              alt={khoaHoc.tenKhoaHoc}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Col>
          <Col xs={24} md={16}>
            <Typography.Title level={2}>{khoaHoc.tenKhoaHoc}</Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: '16px', display: 'block', marginBottom: '16px' }}>
              Giảng viên: {khoaHoc.giangVien?.tenGiangVien}
            </Typography.Text>
            <Typography.Paragraph style={{ fontSize: '16px', marginBottom: '16px' }}>
              {khoaHoc.moTa}
            </Typography.Paragraph>
            {khoaHoc.thoiGianHoc && (
              <Typography.Text style={{ display: 'block', marginBottom: '8px' }}>
                <strong>Thời gian học:</strong> {khoaHoc.thoiGianHoc}
              </Typography.Text>
            )}
            {khoaHoc.hocPhi && (
              <Typography.Text style={{ display: 'block', marginBottom: '16px' }}>
                <strong>Học phí:</strong> {khoaHoc.hocPhi.toLocaleString('vi-VN')} VNĐ
              </Typography.Text>
            )}
            <Button type="primary" size="large" onClick={handleDangKy}>
              Đăng ký khóa học
            </Button>
          </Col>
        </Row>

        <div style={{ marginTop: '24px' }}>
          <Typography.Title level={3}>Nội dung khóa học</Typography.Title>
          <div dangerouslySetInnerHTML={{ __html: khoaHoc.noidung }} />
        </div>
      </Card>
    </div>
  );
};

export default ChiTietKhoaHocPage;
