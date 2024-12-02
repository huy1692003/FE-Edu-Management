'use client'
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Table, Button, Space, message, Modal, Form, Input, InputNumber } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { baihocService } from '@/services/baihocService';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function BaiHocPage() {
    const searchParams = useSearchParams();
    const idKhoaHoc = searchParams.get('idKhoaHoc');
    const tenKhoaHoc = searchParams.get('tenKhoaHoc');
    
    const [baihocs, setBaihocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingBaiHoc, setEditingBaiHoc] = useState(null);
    const [editorContent, setEditorContent] = useState('');

    useEffect(() => {
        fetchBaiHocs();
    }, [idKhoaHoc]);

    const fetchBaiHocs = async () => {
        try {
            const data = await baihocService.getByKhoaHocId(idKhoaHoc);
            setBaihocs(data);
        } catch (error) {
            message.error('Có lỗi xảy ra khi tải dữ liệu bài học');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingBaiHoc(null);
        form.resetFields();
        setEditorContent('');
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingBaiHoc(record);
        form.setFieldsValue(record);
        setEditorContent(record.noidung || '');
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await baihocService.delete(id);
            message.success('Xóa bài học thành công');
            fetchBaiHocs();
        } catch (error) {
            message.error('Có lỗi xảy ra khi xóa bài học');
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const currentDate = new Date().toISOString();
            
            const dataToSave = {
                ...values,
                noidung: editorContent,
                khoaHocId: idKhoaHoc,
            };
            
            if (editingBaiHoc) {
                await baihocService.update(editingBaiHoc.baiHocId, {
                    ...dataToSave,baiHocId:editingBaiHoc.baiHocId,
                    ngayCapNhat: currentDate
                });
                message.success('Cập nhật bài học thành công');
            } else {
                await baihocService.create({
                    ...dataToSave,
                    ngayTao: currentDate,
                    ngayCapNhat: currentDate
                });
                message.success('Thêm bài học thành công');
            }
            setIsModalVisible(false);
            fetchBaiHocs();
        } catch (error) {
            message.error('Có lỗi xảy ra khi lưu bài học');
        }
    };

    const columns = [
        {
            title: 'Tên Bài Học',
            dataIndex: 'tenBaiHoc',
            key: 'tenBaiHoc',
        },
        {
            title: 'Mô Tả',
            dataIndex: 'moTa',
            key: 'moTa',
        },
        {
            title: 'Thời Gian Hoàn Thành (phút)',
            dataIndex: 'thoiGianHoanThanh',
            key: 'thoiGianHoanThanh',
        },
        {
            title: 'Ngày Tạo',
            dataIndex: 'ngayTao',
            key: 'ngayTao',
            render: (date) => new Date(date).toLocaleDateString('vi-VN')
        },
        {
            title: 'Thao Tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Sửa
                    </Button>
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.baiHocId)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Quản Lý Bài Học - {tenKhoaHoc}</h1>
                <Button
                    style={{margin:"20px 0px"}}
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                >
                    Thêm Bài Học
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={baihocs}
                loading={loading}
                rowKey="baiHocId"
            />

            <Modal
                title={editingBaiHoc ? "Sửa Bài Học" : "Thêm Bài Học"}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="tenBaiHoc"
                        label="Tên Bài Học"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên bài học' },
                            { max: 100, message: 'Tên bài học không được vượt quá 100 ký tự' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="moTa"
                        label="Mô Tả"
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="thoiGianHoanThanh"
                        label="Thời Gian Hoàn Thành (phút)"
                        rules={[{ required: true, message: 'Vui lòng nhập thời gian hoàn thành' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label="Nội Dung Bài Học"
                        required
                    >
                        <CKEditor
                            editor={ClassicEditor}
                            data={editorContent}
                            onChange={(event, editor) => {
                                setEditorContent(editor.getData());
                            }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
