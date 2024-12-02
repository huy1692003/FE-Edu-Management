'use client'
import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, message, Upload } from 'antd'
import giangvienService from '@/services/giangvienService'
import uploadService from '@/services/uploadService'
import { UploadOutlined } from '@ant-design/icons'
import { URL_SERVER } from '@/constants/api'

const GiangVienPage = () => {
  const [giangViens, setGiangViens] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [editingId, setEditingId] = useState(null)
  const [taiKhoanId, setTaiKhoanId] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [image, setImage] = useState('')

  const fetchGiangViens = async () => {
    try {
      const data = await giangvienService.getAllGiangVien()
      console.log(data)
      setGiangViens(data)
    } catch (error) {
      console.error('Error fetching data:', error)
      message.error('Không thể tải dữ liệu giảng viên')
    }
  }

  useEffect(() => {
    fetchGiangViens()
  }, [])

  const filteredGiangViens = giangViens.filter(giangvien => 
    giangvien.tenGiangVien.toLowerCase().includes(searchText.toLowerCase()) ||
    giangvien.email.toLowerCase().includes(searchText.toLowerCase()) ||
    giangvien.soDienThoai.includes(searchText) ||
    giangvien.taiKhoan?.tenDangNhap.toLowerCase().includes(searchText.toLowerCase())
  )

  const columns = [
    {
      title: 'ID',
      dataIndex: 'giangVienId',
      key: 'giangVienId',
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        image ? <img src={URL_SERVER+image} alt="Avatar" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '50%' }} /> 
        : <div style={{ width: 50, height: 50, background: '#eee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>N/A</div>
      )
    },
    {
      title: 'Tên Giảng Viên',
      dataIndex: 'tenGiangVien',
      key: 'tenGiangVien',
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
          <Button type="primary" danger style={{ marginLeft: 10 }} onClick={() => handleDelete(record.giangVienId)}>
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
    setImage('')
  }

  const handleEdit = (record) => {
    setEditingId(record.giangVienId)
    setTaiKhoanId(record.taiKhoanId)
    form.setFieldsValue({
      tenGiangVien: record.tenGiangVien,
      email: record.email,
      soDienThoai: record.soDienThoai
    })
    setImage(record.image || '')
    setIsModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      await giangvienService.deleteGiangVien(id)
      message.success('Xóa giảng viên thành công')
      fetchGiangViens()
    } catch (error) {
      console.error('Error deleting:', error)
      message.error('Không thể xóa giảng viên')
    }
  }

  const handleUpload = async (file) => {
    try {
      const result = await uploadService.uploadFile(file)
      setImage(result.filePath)
      message.success('Upload ảnh thành công')
      return false
    } catch (error) {
      message.error('Upload ảnh thất bại')
      return false
    }
  }

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingId) {
          // Khi cập nhật chỉ gửi thông tin giảng viên
          const giangVienData = {
            giangVienId: editingId,
            tenGiangVien: values.tenGiangVien,
            taiKhoanId: taiKhoanId,
            email: values.email,
            soDienThoai: values.soDienThoai,
            image: image
          }
          await giangvienService.updateGiangVien(editingId, giangVienData)
          message.success('Cập nhật giảng viên thành công')
          setTaiKhoanId(null)
        } else {
          // Khi thêm mới gửi đầy đủ thông tin
          const giangVienData = {
            giangVienId: 0,
            taiKhoanId: 0,
            taiKhoan: {
              taiKhoanId: 0,
              tenDangNhap: values.tenDangNhap,
              matKhau: values.matKhau,
              loaiTaiKhoan: 2
            },
            tenGiangVien: values.tenGiangVien,
            email: values.email,
            soDienThoai: values.soDienThoai,
            image: image
          }
          console.log(giangVienData)
          await giangvienService.createGiangVien(giangVienData)
          message.success('Thêm giảng viên thành công')
        }
        setIsModalVisible(false)
        fetchGiangViens()
      } catch (error) {
        console.error('Error saving:', error)
        message.error('Không thể lưu thông tin giảng viên')
      }
    })
  }

  return (
    <div >
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Button type="primary" onClick={handleAdd}>
          Thêm Giảng Viên
        </Button>
        <Input.Search
          placeholder="Tìm kiếm giảng viên..."
          style={{ width: 300 }}
          onChange={e => setSearchText(e.target.value)}
        />
      </div>
      <Table columns={columns} dataSource={filteredGiangViens} rowKey="giangVienId" />

      <Modal
        title={editingId ? "Sửa Giảng Viên" : "Thêm Giảng Viên"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="tenGiangVien"
            label="Tên Giảng Viên"
            rules={[{ required: true, message: 'Vui lòng nhập tên giảng viên' }]}
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
          <Form.Item
            label="Ảnh Đại Diện"
          >
            <Upload
              beforeUpload={handleUpload}
              maxCount={1}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Chọn Ảnh</Button>
            </Upload>
            {image && (
              <div style={{ marginTop: 10 }}>
                <img src={URL_SERVER+image} alt="Avatar" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '8px' }} />
                <Button 
                  type="text" 
                  danger 
                  style={{ marginLeft: 10 }}
                  onClick={() => setImage('')}
                >
                  Xóa ảnh
                </Button>
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default GiangVienPage
