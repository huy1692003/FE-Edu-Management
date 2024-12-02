'use client'

import LayoutSite from "@/components/Layout";
import { Typography, Card, Avatar } from "antd";
import { useEffect, useState } from "react";
import giangvienService from "@/services/giangvienService";
import { khoahocService } from "@/services/khoahocService";
import { URL_SERVER } from "@/constants/api";
import { useRouter } from "next/navigation";

const Home = () => {
  const [giangViens, setGiangViens] = useState([]);
  const [khoaHocs, setKhoaHocs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const giangVienData = await giangvienService.getAllGiangVien();
        const khoaHocData = await khoahocService.getAll();
        setGiangViens(giangVienData);
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
    <LayoutSite>
      <div style={{ marginBottom: 40 }}>
        <Typography.Title level={2} style={{ marginBottom: 24 }}>Khóa học nổi bật</Typography.Title>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {khoaHocs.slice(0, 8).map((khoaHoc) => (
            <Card
              key={khoaHoc.khoaHocId}
              hoverable
              onClick={() => handleKhoaHocClick(khoaHoc.khoaHocId)}
              cover={<img alt={khoaHoc.tenKhoaHoc} src={URL_SERVER+khoaHoc.image || "/images/courses/default.jpg"} style={{ height: 160, objectFit: 'cover' }} />}
            >
              <Card.Meta
                title={khoaHoc.tenKhoaHoc}
                description={khoaHoc.moTa}
              />
              <Typography.Text type="secondary" style={{ marginTop: 8, display: 'block' }}>
                Giảng viên: {khoaHoc.giangVien?.tenGiangVien}
              </Typography.Text>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Typography.Title level={2} style={{ marginBottom: 24 }}>Giảng viên tiêu biểu</Typography.Title>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {giangViens.slice(0, 4).map((giangVien) => (
            <Card key={giangVien.giangVienId} bordered={false}>
              <div style={{ textAlign: 'center'   }}>
                <Avatar 
                  size={120} 
                  src={URL_SERVER+giangVien.image || "https://randomuser.me/api/portraits/men/32.jpg"} 
                  style={{ marginBottom: 16 }} 
                />
                <Typography.Title level={4} style={{ marginBottom: 8 }}>
                  {giangVien.tenGiangVien}
                </Typography.Title>
                <Typography.Text type="secondary">{giangVien.email}</Typography.Text>
                <Typography.Text type="secondary" style={{ display: 'block' }}>
                  SĐT: {giangVien.soDienThoai}
                </Typography.Text>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </LayoutSite>
  );
}

export default Home;