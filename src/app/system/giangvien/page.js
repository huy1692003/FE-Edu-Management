'use client'

import LayoutSite from "@/components/Layout";
import { Typography, Card, Avatar, Row, Col } from "antd";
import { useEffect, useState } from "react";
import giangvienService from "@/services/giangvienService";
import { URL_SERVER } from "@/constants/api";

const GiangVienPage = () => {
  const [giangViens, setGiangViens] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const giangVienData = await giangvienService.getAllGiangVien();
        setGiangViens(giangVienData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div style={{ padding: '24px' }}>
        <Typography.Title level={2} style={{ marginBottom: 24, textAlign: 'center' }}>
          Với những đội ngũ giảng viên của chúng tôi gồm các tiến sĩ, thạc sĩ, giáo sư .        </Typography.Title>
        
        <Row gutter={[24, 24]}>
          {giangViens.map((giangVien) => (
            <Col xs={24} sm={12} md={8} lg={6} key={giangVien.giangVienId}>
              <Card hoverable bordered={false}>
                <div style={{ textAlign: 'center' }}>
                  <Avatar 
                    size={150}
                    src={URL_SERVER + giangVien.image || "https://randomuser.me/api/portraits/men/32.jpg"}
                    style={{ marginBottom: 16 }}
                  />
                  <Typography.Title level={4} style={{ marginBottom: 8 }}>
                    {giangVien.tenGiangVien}
                  </Typography.Title>
                  <Typography.Text type="secondary" style={{ display: 'block' }}>
                    {giangVien.email}
                  </Typography.Text>
                  <Typography.Text type="secondary" style={{ display: 'block' }}>
                    SĐT: {giangVien.soDienThoai}
                  </Typography.Text>
                  {giangVien.chuyenNganh && (
                    <Typography.Text type="secondary" style={{ display: 'block' }}>
                      Chuyên ngành: {giangVien.chuyenNganh}
                    </Typography.Text>
                  )}
                  {giangVien.moTa && (
                    <Typography.Paragraph 
                      ellipsis={{ rows: 2 }}
                      style={{ marginTop: 8 }}
                    >
                      {giangVien.moTa}
                    </Typography.Paragraph>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

export default GiangVienPage;


