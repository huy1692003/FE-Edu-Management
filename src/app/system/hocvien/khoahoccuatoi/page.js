'use client'

import { useEffect, useState } from "react";
import { Typography, Card, Row, Col, message } from "antd";
import { hocvien_khoahocService } from "@/services/hocvien_khoahocService";
import { URL_SERVER } from "@/constants/api";
import { useRouter } from "next/navigation";

const KhoaHocCuaToiPage = () => {
  const [khoaHocList, setKhoaHocList] = useState([]);
  const router = useRouter();
  const currentUser = JSON.parse(localStorage.getItem('user')) || null;

  useEffect(() => {
    const fetchKhoaHoc = async () => {
      try {
        if (!currentUser?.hocvienID) {
          message.error("Bạn cần đăng nhập với tư cách học viên!");
          router.push('/system/login');
          return;
        }

        const data = await hocvien_khoahocService.getByHocVienId(currentUser.hocvienID);
        setKhoaHocList(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        message.error("Không thể tải danh sách khóa học");
      }
    };

    fetchKhoaHoc();
  }, [currentUser]);

  const handleClickKhoaHoc = (id) => {
    router.push(`/system/khoahoc/danhsachbaihoc?id=${id}`);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Typography.Title level={2}>Khóa học của tôi</Typography.Title>
      
      <Row gutter={[24, 24]}>
        {khoaHocList.map((item) => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.khoaHoc.khoaHocId}>
            <Card
              hoverable
              cover={
                <img
                  alt={item.khoaHoc.tenKhoaHoc}
                  src={URL_SERVER + item.khoaHoc.image}
                  style={{ height: 200, objectFit: 'cover' }}
                />
              }
              onClick={() => handleClickKhoaHoc(item.khoaHoc.khoaHocId)}
            >
              <Card.Meta
                title={item.khoaHoc.tenKhoaHoc}
                description={
                  <>
                    <Typography.Paragraph ellipsis={{ rows: 2 }}>
                      {item.khoaHoc.moTa}
                    </Typography.Paragraph>
                    <Typography.Text type="secondary">
                      Giảng viên: {item.khoaHoc.giangVien?.tenGiangVien}
                    </Typography.Text>
                    <br />
                    <Typography.Text type="secondary">
                      Ngày đăng ký: {new Date(item.ngayDangKy).toLocaleDateString('vi-VN')}
                    </Typography.Text>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {khoaHocList.length === 0 && (
        <Typography.Text>Bạn chưa đăng ký khóa học nào</Typography.Text>
      )}
    </div>
  );
};

export default KhoaHocCuaToiPage;
