'use client'
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import hocvienService from '@/services/hocvienService';
import { Table, Space, Button, message, Modal } from 'antd';
import { baihocService } from '@/services/baihocService';
import { tiendohoctapService } from '@/services/tiendohoctapService';

export default function DanhSachHocVienKhoaHoc() {
  const [hocviens, setHocviens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedHocVien, setSelectedHocVien] = useState(null);
  const [baiHocs, setBaiHocs] = useState([]);
  const [tienDoHocTap, setTienDoHocTap] = useState([]);
  const searchParams = useSearchParams();
  const khoaHocId = searchParams.get('id');
  const tenKhoaHoc = searchParams.get('tenKhoaHoc');

  useEffect(() => {
    const fetchHocViens = async () => {
      try {
        if (!khoaHocId) {
          message.error('Không tìm thấy khóa học!');
          return;
        }
        const data = await hocvienService.getHocViensByKhoaHoc(khoaHocId);
        setHocviens(data);
      } catch (error) {
        console.error('Error fetching hoc viens:', error);
        message.error('Lỗi khi tải danh sách học viên');
      } finally {
        setLoading(false);
      }
    };

    fetchHocViens();
  }, [khoaHocId]);

  const showModal = async (record) => {
    setSelectedHocVien(record);
    try {
      const [baiHocData, tienDoData] = await Promise.all([
        baihocService.getByKhoaHocId(khoaHocId),
        tiendohoctapService.getByKhoaHocAndHocVien(khoaHocId, record.hocVienId)
      ]);
      setBaiHocs(baiHocData);
      setTienDoHocTap(tienDoData);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Lỗi khi tải dữ liệu tiến độ học tập');
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedHocVien(null);
  };

  const getTrangThaiHoc = (baiHocId) => {
    const tienDo = tienDoHocTap.find(td => td.baiHocId === baiHocId);
    return tienDo?.trangThai === 1 ? 'Đã học' : 'Chưa học';
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
        <Button 
          type="primary"
          onClick={() => showModal(record)}
        >
          Xem tiến độ học tập
        </Button>
      ),
    }
  ];

  const tienDoColumns = [
    {
      title: 'Tên bài học',
      dataIndex: 'tenBaiHoc',
      key: 'tenBaiHoc',
    },
    {
      title: 'Trạng thái',
      key: 'trangThai',
      render: (_, record) => getTrangThaiHoc(record.baiHocId),
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Danh sách học viên khóa học : {tenKhoaHoc}</h1>
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
        title={`Tiến độ học tập của học viên ${selectedHocVien?.tenHocVien}`}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Table
          columns={tienDoColumns}
          dataSource={baiHocs}
          rowKey="baiHocId"
          pagination={false}
        />
      </Modal>
    </div>
  );
}
