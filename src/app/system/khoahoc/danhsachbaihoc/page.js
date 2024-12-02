'use client'

import { useEffect, useState } from "react";
import { Typography, List, Card, Row, Col, message } from "antd";
import { useSearchParams, useRouter } from "next/navigation";
import { khoahocService } from "@/services/khoahocService";
import { baihocService } from "@/services/baihocService";

const DanhSachBaiHocPage = () => {
  const [khoaHoc, setKhoaHoc] = useState(null);
  const [baiHocList, setBaiHocList] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const khoaHocId = searchParams.get('id');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!khoaHocId) {
          message.error("Không tìm thấy khóa học!");
          router.push('/system/khoahoc');
          return;
        }

        // Fetch khóa học info
        const khoaHocData = await khoahocService.getById(khoaHocId);
        setKhoaHoc(khoaHocData);

        // Fetch danh sách bài học
        const baiHocData = await baihocService.getByKhoaHocId(khoaHocId);
        setBaiHocList(baiHocData);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Không thể tải dữ liệu");
      }
    };

    fetchData();
  }, [khoaHocId]);

  const handleClickBaiHoc = (baiHocId) => {
    router.push(`/system/khoahoc/chitietbaihoc?id=${baiHocId}`);
  };

  return (
    <div style={{ padding: '24px' }}>
      {khoaHoc && (
        <Typography.Title level={2}>
          Danh sách bài học - {khoaHoc.tenKhoaHoc}
        </Typography.Title>
      )}

      <List
        itemLayout="horizontal"
        dataSource={baiHocList}
        renderItem={(item) => (
          <List.Item>
            <Card
              hoverable
              style={{ width: '100%' }}
              onClick={() => handleClickBaiHoc(item.baiHocId)}
            >
              <Card.Meta
                title={item.tenBaiHoc}
                description={
                  <Typography.Paragraph ellipsis={{ rows: 2 }}>
                    {item.moTa}
                  </Typography.Paragraph>
                }
              />
            </Card>
          </List.Item>
        )}
      />

      {baiHocList.length === 0 && (
        <Typography.Text>Chưa có bài học nào trong khóa học này</Typography.Text>
      )}
    </div>
  );
};

export default DanhSachBaiHocPage;
