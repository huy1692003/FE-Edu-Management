'use client'
import { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, Form, Input, Popconfirm, message, Select, Upload } from 'antd';
import { khoahocService } from '@/services/khoahocService';
import giangvienService from '@/services/giangvienService';
import uploadService from '@/services/uploadService';
import { UploadOutlined } from '@ant-design/icons';
import { URL_SERVER } from '@/constants/api';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const KhoaHocPage = () => {
    const [khoahocs, setKhoahocs] = useState([]);
    const [giangviens, setGiangviens] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingKhoahoc, setEditingKhoahoc] = useState(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [image, setImage] = useState('');
    const [editorContent, setEditorContent] = useState('');

    const fetchKhoahocs = async () => {
        try {
            const data = await khoahocService.getAll();
            console.log(data);
            setKhoahocs(data);
        } catch (error) {
            message.error('Lỗi khi tải danh sách khóa học');
        }
    };

    const fetchGiangviens = async () => {
        try {
            const data = await giangvienService.getAllGiangVien();
            setGiangviens(data);
        } catch (error) {
            message.error('Lỗi khi tải danh sách giảng viên');
        }
    };

    useEffect(() => {
        fetchKhoahocs();
        fetchGiangviens();
    }, []);

    const handleAdd = () => {
        setEditingKhoahoc(null);
        form.resetFields();
        setIsModalVisible(true);
        setImage('');
        setEditorContent('');
    };

    const handleEdit = (record) => {
        setEditingKhoahoc(record);
        form.setFieldsValue(record);
        setImage(record.image || '');
        setEditorContent(record.noidung || '');
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await khoahocService.delete(id);
            message.success('Xóa khóa học thành công');
            fetchKhoahocs();
        } catch (error) {
            message.error('Lỗi khi xóa khóa học');
        }
    };

    const handleUpload = async (file) => {
        try {
            const result = await uploadService.uploadFile(file);
            setImage(result.filePath);
            message.success('Upload ảnh thành công');
            return false;
        } catch (error) {
            message.error('Upload ảnh thất bại');
            return false;
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingKhoahoc) {
                await khoahocService.update(editingKhoahoc.khoaHocId, {
                    ...values, 
                    khoaHocId: editingKhoahoc.khoaHocId,
                    image: image,
                    noidung: editorContent
                });
                message.success('Cập nhật khóa học thành công');
            } else {
                await khoahocService.create({...values, image: image, noiDung: editorContent});
                message.success('Thêm khóa học thành công');
            }
            setIsModalVisible(false);
            fetchKhoahocs();
        } catch (error) {
            message.error('Lỗi khi lưu khóa học');
        }
    };

    const filteredKhoahocs = khoahocs.filter(khoahoc => 
        khoahoc.tenKhoaHoc.toLowerCase().includes(searchText.toLowerCase()) ||
        khoahoc.moTa.toLowerCase().includes(searchText.toLowerCase()) ||
        khoahoc.giangVien?.tenGiangVien.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (image) => (
                image ? <img src={URL_SERVER+image} alt="Course" style={{ width: 100, height: 60, objectFit: 'cover' }} /> 
                : <div style={{ width: 100, height: 60, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Image</div>
            )
        },
        {
            title: 'Tên khóa học',
            dataIndex: 'tenKhoaHoc',
            key: 'tenKhoaHoc',
        },
        {
            title: 'Mô tả',
            dataIndex: 'moTa',
            key: 'moTa',
        },
        {
            title: 'Giảng viên',
            dataIndex: ['giangVien', 'tenGiangVien'],
            key: 'giangVienId',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => handleEdit(record)}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa?"
                        onConfirm={() => handleDelete(record.khoaHocId)}
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
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <Button type="primary" onClick={handleAdd}>
                    Thêm khóa học mới
                </Button>
                <Input.Search
                    placeholder="Tìm kiếm khóa học..."
                    style={{ width: 300 }}
                    onChange={e => setSearchText(e.target.value)}
                />
            </div>
            <Table columns={columns} dataSource={filteredKhoahocs} rowKey="khoaHocId" />
            
            <Modal
                title={editingKhoahoc ? "Sửa khóa học" : "Thêm khóa học mới"}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="tenKhoaHoc"
                        label="Tên khóa học"
                        rules={[{ required: true, message: 'Vui lòng nhập tên khóa học!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="moTa"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="giangVienId"
                        label="Giảng viên"
                        rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}
                    >
                        <Select
                            placeholder="Chọn giảng viên"
                            options={giangviens.map(gv => ({
                                value: gv.giangVienId,
                                label: gv.tenGiangVien
                            }))}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Ảnh khóa học"
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
                                <img src={URL_SERVER+image} alt="Course" style={{ width: 200, height: 120, objectFit: 'cover', borderRadius: '8px' }} />
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
                    <Form.Item
                        label="Nội Dung Khóa Học"
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
};

export default KhoaHocPage;
