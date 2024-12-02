'use client'
import { useEffect, useState } from 'react';
import { khoahocService } from '@/services/khoahocService';
import { Table, Button, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

export default function KhoaHocPage() {
    const router = useRouter();
    const [khoahocs, setKhoahocs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user && user.taiKhoanId) {
                    const data = await khoahocService.getByUserId(user.taiKhoanId);
                    setKhoahocs(data);
                }
            } catch (error) {
                message.error('Có lỗi xảy ra khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

   
    const columns = [
        {
            title: 'Tên Khóa Học',
            dataIndex: 'tenKhoaHoc',
            key: 'tenKhoaHoc',
        },
        {
            title: 'Mô Tả',
            dataIndex: 'moTa',
            key: 'moTa',
        },
        
        {
            title: 'Thao Tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button 
                        type="primary" 
                        icon={<EditOutlined />}
                        onClick={() => router.push(`/giangvien/baihoc?idKhoaHoc=${record.khoaHocId}&&tenKhoaHoc=${record.tenKhoaHoc}`)}
                    >
                        Quản Lý Bài Học
                    </Button>
                    <Button
                        type="primary"
                        icon={<TeamOutlined />}
                        onClick={() => router.push(`/giangvien/khoahoc/danhsachhocvien?id=${record.khoaHocId}&&tenKhoaHoc=${record.tenKhoaHoc}`)}
                    >
                        Quản Lý Học Viên
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Danh Sách Khóa Học Giảng Dạy</h1>
                
            </div>
            <Table 
                columns={columns} 
                dataSource={khoahocs} 
                loading={loading}
                rowKey="khoaHocId"
            />
        </div>
    );
}
