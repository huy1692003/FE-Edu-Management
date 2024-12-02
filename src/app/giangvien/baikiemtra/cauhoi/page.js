'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { cauhoiService } from '@/services/cauhoiService'
import { luachonService } from '@/services/luachonService'
import { Button, Table, Modal, Form, Input, InputNumber, message, Space, Switch } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'

export default function CauHoiPage() {
  const searchParams = useSearchParams()
  const baiKiemTraId = searchParams.get('id')
  
  const [cauHois, setCauHois] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCauHoi, setEditingCauHoi] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    loadCauHois()
  }, [baiKiemTraId])

  const loadCauHois = async () => {
    try {
      const data = await cauhoiService.getByBaiKiemTraId(baiKiemTraId)
      setCauHois(data)
    } catch (error) {
      message.error('Lỗi khi tải danh sách câu hỏi')
    }
  }

  const columns = [
    {
      title: 'Nội dung',
      dataIndex: 'noiDung',
      key: 'noiDung'
    },
    {
      title: 'Số điểm',
      dataIndex: 'diem',
      key: 'diem',
      render: (diem) => diem.toFixed(1) + ' điểm'
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          />
          <Button 
            icon={<DeleteOutlined />} 
            danger
            onClick={() => handleDelete(record.cauHoiId)}
          />
        </>
      )
    }
  ]

  const handleEdit = async (cauHoi) => {
    try {
      const luaChons = await luachonService.getByCauHoiId(cauHoi.cauHoiId)
      setEditingCauHoi(cauHoi)
      form.setFieldsValue({
        cauHoiId: cauHoi.cauHoiId,
        noiDung: cauHoi.noiDung,
        diem: cauHoi.diem,
        luaChons: luaChons.map(lc => ({
          ...lc,
          laDapAnDung: lc.laDapAnDung || false
        }))
      })
      setIsModalOpen(true)
    } catch (error) {
      message.error('Lỗi khi tải lựa chọn')
    }
  }

  const handleDelete = async (id) => {
    try {
      const luaChons = await luachonService.getByCauHoiId(id)
      // Delete all lua chon first
      for (const luaChon of luaChons) {
        await luachonService.delete(luaChon.luaChonId)
      }
      // Then delete cau hoi
      await cauhoiService.delete(id)
      message.success('Xóa câu hỏi thành công')
      loadCauHois()
    } catch (error) {
      message.error('Lỗi khi xóa câu hỏi')
    }
  }

  const handleSubmit = async (values) => {
    try {
      let cauHoiId
      if (editingCauHoi) {
        // Update cau hoi
        await cauhoiService.update(editingCauHoi.cauHoiId, {
          cauHoiId: editingCauHoi.cauHoiId,
          ...values,
          baiKiemTraId: parseInt(baiKiemTraId)
        })
        cauHoiId = editingCauHoi.cauHoiId
        
        // Get old lua chons
        const oldLuaChons = await luachonService.getByCauHoiId(cauHoiId)
        
        // Delete removed lua chons
        const newLuaChonIds = values.luaChons
          .filter(lc => lc.luaChonId)
          .map(lc => lc.luaChonId)
        
        for (const oldLuaChon of oldLuaChons) {
          if (!newLuaChonIds.includes(oldLuaChon.luaChonId)) {
            await luachonService.delete(oldLuaChon.luaChonId)
          }
        }

        // Update existing and create new lua chons
        for (const luaChon of values.luaChons) {
          if (luaChon.luaChonId) {
            // Update existing
            await luachonService.update(luaChon.luaChonId, {
              ...luaChon,
              laDapAnDung: luaChon.laDapAnDung || false,
              cauHoiId: cauHoiId
            })
          } else {
            // Create new
            await luachonService.create({
              ...luaChon,
              laDapAnDung: luaChon.laDapAnDung || false,
              cauHoiId: cauHoiId
            })
          }
        }

        message.success('Cập nhật câu hỏi thành công')
      } else {
        // Create new cau hoi
        const newCauHoi = await cauhoiService.create({
          ...values,
          baiKiemTraId: parseInt(baiKiemTraId)
        })
        cauHoiId = newCauHoi.cauHoiId
        
        // Create new lua chons
        if (values.luaChons) {
          for (const luaChon of values.luaChons) {
            await luachonService.create({
              ...luaChon,
              laDapAnDung: luaChon.laDapAnDung || false,
              cauHoiId: cauHoiId
            })
          }
        }
        
        message.success('Thêm câu hỏi thành công')
      }

      setIsModalOpen(false)
      form.resetFields()
      setEditingCauHoi(null)
      loadCauHois()
    } catch (error) {
      message.error('Có lỗi xảy ra')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Quản lý câu hỏi</h1>
        <Button 
          type="primary"
          style={{ margin: "10px 0px" }}
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCauHoi(null)
            form.resetFields()
            setIsModalOpen(true)
          }}
        >
          Thêm câu hỏi
        </Button>
      </div>

      <Table 
        columns={columns}
        dataSource={cauHois}
        rowKey="cauHoiId"
      />

      <Modal
        title={editingCauHoi ? "Sửa câu hỏi" : "Thêm câu hỏi"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
          setEditingCauHoi(null)
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          {editingCauHoi && (
            <Form.Item
              name="cauHoiId"
              hidden
            >
              <Input />
            </Form.Item>
          )}

          <Form.Item
            name="noiDung"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="diem"
            label="Điểm"
            rules={[{ required: true, message: 'Vui lòng nhập điểm' }]}
          >
            <InputNumber min={0} step={0.5} style={{ width: '100%' }} />
          </Form.Item>

          <Form.List name="luaChons">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8, justifyContent: 'space-between' }} align="baseline">
                    <Form.Item style={{ width: '600px' }}
                      {...restField}
                      name={[name, 'noiDung']}
                      rules={[{ required: true, message: 'Vui lòng nhập nội dung lựa chọn' }]}
                    >
                      <Input style={{ width: '100%' }} placeholder="Nội dung lựa chọn" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'laDapAnDung']}
                      valuePropName="checked"
                      initialValue={false}
                    >
                      <Switch checkedChildren="Đúng" unCheckedChildren="Sai" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm lựa chọn
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item className="text-right">
            <Button type="primary" htmlType="submit">
              {editingCauHoi ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
