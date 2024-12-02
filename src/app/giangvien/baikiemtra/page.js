'use client'
import { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, Form, Input, InputNumber, message, Popconfirm, Select } from 'antd';
import baikiemtraService from '@/services/baikiemtraService';
import { khoahocService } from '@/services/khoahocService';
import { useRouter } from 'next/navigation';

export default function QuanLyBaiKiemTra() {
  const [baiKiemTras, setBaiKiemTras] = useState([]);
  const [khoaHocs, setKhoaHocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const router = useRouter();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || !user.giangvienID) {
      router.push('/system/login');
      return;
    }
    fetchBaiKiemTras();
    fetchKhoaHocs();
  }, []);

  const fetchKhoaHocs = async () => {
    try {
      const data = await khoahocService.getAll();
      setKhoaHocs(data);
    } catch (error) {
      console.error('Error fetching khoa hoc:', error);
      message.error('Lỗi khi tải danh sách khóa học');
    }
  };

  const fetchBaiKiemTras = async () => {
    try {
      const data = await baikiemtraService.getByGiangVienId(user.giangvienID);
      setBaiKiemTras(data);
    } catch (error) {
      console.error('Error fetching bai kiem tra:', error);
      message.error('Lỗi khi tải danh sách bài kiểm tra');
    } finally {
      setLoading(false);
    }
  };

  const showModal = (record = null) => {
    setEditingId(record?.baiKiemTraId || null);
    form.setFieldsValue(record || {});
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingId(null);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        await baikiemtraService.update(editingId, {...values, giangVienID: user.giangvienID});
        message.success(`Cập nhật bài kiểm tra ${values.maBKT} thành công`);
      } else {
        await baikiemtraService.create({...values, giangVienID: user.giangvienID});
        message.success(`Thêm bài kiểm tra ${values.maBKT} thành công`);
      }
      handleCancel();
      fetchBaiKiemTras();
    } catch (error) {
      console.error('Error submitting:', error);
      message.error('Có lỗi xảy ra khi lưu bài kiểm tra');
    }
  };

  const handleDelete = async (id) => {
    try {
      await baikiemtraService.delete(id);
      message.success('Xóa bài kiểm tra thành công');
      fetchBaiKiemTras();
    } catch (error) {
      console.error('Error deleting:', error);
      message.error('Có lỗi xảy ra khi xóa bài kiểm tra');
    }
  };

  const handleQuanLyCauHoi = (baiKiemTraId) => {
    router.push(`/giangvien/baikiemtra/cauhoi?id=${baiKiemTraId}`);
  };

  const columns = [
    {
      title: 'Mã bài kiểm tra',
      dataIndex: 'maBKT',
      key: 'maBKT',
    },
    {
      title: 'Tên bài kiểm tra',
      dataIndex: 'tenBaiKiemTra',
      key: 'tenBaiKiemTra',
    },
    {
      title: 'Thời lượng (phút)',
      dataIndex: 'thoiLuong',
      key: 'thoiLuong',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'ngayTao',
      key: 'ngayTao',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Khóa học',
      dataIndex: 'khoaHocId',
      key: 'khoaHocId',
      render: (khoaHocId) => {
        const khoaHoc = khoaHocs.find(k => k.khoaHocId === khoaHocId);
        return khoaHoc ? khoaHoc.tenKhoaHoc : '';
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => showModal(record)}>
            Sửa
          </Button>
          <Button type="default" onClick={() => handleQuanLyCauHoi(record.baiKiemTraId)}>
            Quản lý câu hỏi
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.baiKiemTraId)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý bài kiểm tra</h1>
        <Button type="primary" style={{margin:"20px 0px"}} onClick={() => showModal()}>
          Thêm bài kiểm tra mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={baiKiemTras}
        loading={loading}
        rowKey="baiKiemTraId"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} bài kiểm tra`,
        }}
      />

      <Modal
        title={editingId ? "Sửa bài kiểm tra" : "Thêm bài kiểm tra mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="maBKT"
            label="Mã bài kiểm tra"
            rules={[{ required: true, message: 'Vui lòng nhập mã bài kiểm tra!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="tenBaiKiemTra"
            label="Tên bài kiểm tra"
            rules={[{ required: true, message: 'Vui lòng nhập tên bài kiểm tra!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="thoiLuong"
            label="Thời lượng (phút)"
            rules={[{ required: true, message: 'Vui lòng nhập thời lượng!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="khoaHocId"
            label="Khóa học"
            rules={[{ required: true, message: 'Vui lòng chọn khóa học!' }]}
          >
            <Select>
              {khoaHocs.map(khoaHoc => (
                <Select.Option key={khoaHoc.khoaHocId} value={khoaHoc.khoaHocId}>
                  {khoaHoc.tenKhoaHoc}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space className="w-full justify-end">
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingId ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
