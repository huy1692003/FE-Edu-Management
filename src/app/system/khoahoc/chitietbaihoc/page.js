'use client'

import { useEffect, useState } from "react";
import { Typography, message } from "antd";
import { useSearchParams, useRouter } from "next/navigation";
import { baihocService } from "@/services/baihocService";
import { tiendohoctapService } from "@/services/tiendohoctapService";

const ChiTietBaiHocPage = () => {
  const [baiHoc, setBaiHoc] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const baiHocId = searchParams.get('id');

  useEffect(() => {
    const fetchBaiHoc = async () => {
      try {
        if (!baiHocId) {
          message.error("Không tìm thấy bài học!");
          router.push('/system/khoahoc/danhsachbaihoc');
          return;
        }

        const data = await baihocService.getById(baiHocId);
        setBaiHoc(data);

        // Thêm tiến độ học tập khi truy cập bài học
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.hocvienID) {
          const tienDoData = {
            hocVienId: user.hocvienID,
            khoaHocId: data.khoaHocId,
            baiHocId: parseInt(baiHocId),
            trangThai: 1
          };
          console.log(tienDoData);
          try {
            await tiendohoctapService.create(tienDoData);
          } catch (error) {
            console.error("Error creating learning progress:", error);
          }
        }

      } catch (error) {
        console.error("Error fetching lesson:", error);
        message.error("Không thể tải thông tin bài học");
      }
    };

    fetchBaiHoc();
  }, [baiHocId]);

  return (
    <div style={{ padding: '24px' }}>
      {baiHoc && (
        <>
          <Typography.Title level={2}>{baiHoc.tenBaiHoc}</Typography.Title>
          
          <Typography.Paragraph>
            <strong>Mô tả:</strong> {baiHoc.moTa}
          </Typography.Paragraph>

          {baiHoc.thoiGianHoanThanh && (
            <Typography.Paragraph>
              <strong>Thời gian hoàn thành:</strong> {baiHoc.thoiGianHoanThanh} phút
            </Typography.Paragraph>
          )}

          <Typography.Title level={3}>Nội dung bài học</Typography.Title>
          <div 
            dangerouslySetInnerHTML={{ __html: baiHoc.noidung }} 
            style={{
              padding: '20px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
        </>
      )}

      {!baiHoc && (
        <Typography.Text>Đang tải thông tin bài học...</Typography.Text>
      )}
    </div>
  );
};

export default ChiTietBaiHocPage;
