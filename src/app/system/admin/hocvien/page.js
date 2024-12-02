'use client'
import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, message } from 'antd'
import hocvienService from '@/services/hocvienService'

const HocVienPage = () => {
  const [hocViens, setHocViens] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [editingId, setEditingId] = useState(null)
  const [taiKhoanId, setTaiKhoanId] = useState(null)
  const [searchText, setSearchText] = useState('')

  const fetchHocViens = async () => {
    try {
      const data = await hocvienService.getAllHocVien()
      console.log(data)
      setHocViens(data)
    } catch (error) {
      console.error('Error fetching data:', error)
      message.error('Không thể tải dữ liệu học viên')
    }
  }

  useEffect(() => {
    fetchHocViens()
  }, [])

  const filteredHocViens = hocViens.filter(hocvien => 
    hocvien.tenHocVien.toLowerCase().includes(searchText.toLowerCase()) ||
    hocvien.email.toLowerCase().includes(searchText.toLowerCase()) ||
    hocvien.soDienThoai.includes(searchText) ||
    hocvien.taiKhoan?.tenDangNhap.toLowerCase().includes(searchText.toLowerCase())
  )

  const columns = [
    {
      title: 'ID',
      dataIndex: 'hocVienId',
      key: 'hocVienId',
    },
    {
      title: 'Tên Học Viên',
      dataIndex: 'tenHocVien',
      key: 'tenHocVien',
    },
    {
      title: 'Tên Đăng Nhập',
      dataIndex: ['taiKhoan', 'tenDangNhap'],
      key: 'tenDangNhap',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'soDienThoai',
      key: 'soDienThoai',
    },
    {
      title: 'Thao Tác',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button type="primary" danger style={{ marginLeft: 10 }} onClick={() => handleDelete(record.hocVienId)}>
            Xóa
          </Button>
        </>
      ),
    },
  ]

  const handleAdd = () => {
    setEditingId(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (record) => {
    setEditingId(record.hocVienId)
    setTaiKhoanId(record.taiKhoanId)
    form.setFieldsValue({
      tenHocVien: record.tenHocVien,
      email: record.email,
      soDienThoai: record.soDienThoai
    })
    setIsModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      await hocvienService.deleteHocVien(id)
      message.success('Xóa học viên thành công')
      fetchHocViens()
    } catch (error) {
      console.error('Error deleting:', error)
      message.error('Không thể xóa học viên')
    }
  }

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingId) {
          // Khi cập nhật chỉ gửi thông tin học viên
          const hocVienData = {
            hocVienId: editingId,
            tenHocVien: values.tenHocVien,
            taiKhoanId: taiKhoanId,
            email: values.email,
            soDienThoai: values.soDienThoai
          }
          await hocvienService.updateHocVien(editingId, hocVienData)
          message.success('Cập nhật học viên thành công')
          setTaiKhoanId(null)
        } else {
          // Khi thêm mới gửi đầy đủ thông tin
          const hocVienData = {
            hocVienId: 0,
            taiKhoanId: 0,
            taiKhoan: {
              taiKhoanId: 0,
              tenDangNhap: values.tenDangNhap,
              matKhau: values.matKhau,
              loaiTaiKhoan: 3
            },
            tenHocVien: values.tenHocVien,
            email: values.email,
            soDienThoai: values.soDienThoai
          }
          await hocvienService.createHocVien(hocVienData)
          message.success('Thêm học viên thành công')
        }
        setIsModalVisible(false)
        fetchHocViens()
      } catch (error) {
        console.error('Error saving:', error)
        message.error('Không thể lưu thông tin học viên')
      }
    })
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Button type="primary" onClick={handleAdd}>
          Thêm Học Viên
        </Button>
        <Input.Search
          placeholder="Tìm kiếm học viên..."
          style={{ width: 300 }}
          onChange={e => setSearchText(e.target.value)}
        />
      </div>
      <Table columns={columns} dataSource={filteredHocViens} rowKey="hocVienId" />

      <Modal
        title={editingId ? "Sửa Học Viên" : "Thêm Học Viên"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="tenHocVien"
            label="Tên Học Viên"
            rules={[{ required: true, message: 'Vui lòng nhập tên học viên' }]}
          >
            <Input />
          </Form.Item>
          {!editingId && (
            <>
              <Form.Item
                name="tenDangNhap"
                label="Tên Đăng Nhập"
                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="matKhau"
                label="Mật Khẩu"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="soDienThoai"
            label="Số Điện Thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default HocVienPage
