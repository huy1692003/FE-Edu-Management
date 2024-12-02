'use client'

import { Typography, Card, Row, Col } from "antd";
import { useEffect, useState } from "react";
import { khoahocService } from "@/services/khoahocService";
import { URL_SERVER } from "@/constants/api";
import { useRouter } from "next/navigation";

const KhoaHocPage = () => {
  const [khoaHocs, setKhoaHocs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const khoaHocData = await khoahocService.getAll();
        setKhoaHocs(khoaHocData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleKhoaHocClick = (khoaHocId) => {
    router.push(`/system/khoahoc/chitietkhoahoc?id=${khoaHocId}`);
  };

  return (
    <>
      <div style={{ padding: '24px' }}>
        <Typography.Title level={2} style={{ marginBottom: 24, textAlign: 'center' }}>
          Danh sách khóa học
        </Typography.Title>
        
        <Row gutter={[24, 24]}>
          {khoaHocs.map((khoaHoc) => (
            <Col xs={24} sm={12} md={8} lg={6} key={khoaHoc.khoaHocId}>
              <Card
                hoverable
                onClick={() => handleKhoaHocClick(khoaHoc.khoaHocId)}
                cover={<img alt={khoaHoc.tenKhoaHoc} src={URL_SERVER + khoaHoc.image || "/images/courses/default.jpg"} style={{ height: 160, objectFit: 'cover' }} />}
              >
                <Card.Meta
                  title={khoaHoc.tenKhoaHoc}
                  description={khoaHoc.moTa}
                />
                <Typography.Text type="secondary" style={{ marginTop: 8, display: 'block' }}>
                  Giảng viên: {khoaHoc.giangVien?.tenGiangVien}
                </Typography.Text>
                {khoaHoc.thoiGianHoc && (
                  <Typography.Text type="secondary" style={{ display: 'block' }}>
                    Thời gian học: {khoaHoc.thoiGianHoc}
                  </Typography.Text>
                )}
                {khoaHoc.hocPhi && (
                  <Typography.Text type="secondary" style={{ display: 'block' }}>
                    Học phí: {khoaHoc.hocPhi.toLocaleString('vi-VN')} VNĐ
                  </Typography.Text>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

export default KhoaHocPage;
