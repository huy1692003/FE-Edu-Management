'use client'
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import taikhoanService from '@/services/taikhoanService';

const LoginPage = () => {
    const router = useRouter();
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const response = await taikhoanService.login({
                tenDangNhap: values.username,
                matKhau: values.password
            });

            if (response) {
                console.log(response);
                // Lưu thông tin user vào localStorage
                let user = {...response.taiKhoan,giangvienID:response.giangvienID||null, hocvienID:response.hocvienID||null};
                localStorage.setItem('user', JSON.stringify(user));
                message.success('Đăng nhập thành công!');
                router.push('/');
            }
        } catch (error) {
            message.error('Đăng nhập thất bại! Vui lòng kiểm tra lại tên đăng nhập và mật khẩu');
        }
    };

    return (
        <div style={{ 
            height: '60vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#f0f2f5'
        }}>
            <Card style={{ width: 400 }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Typography.Title level={2}>Đăng nhập</Typography.Title>
                </div>
                
                <Form
                    form={form}
                    name="login"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                    >
                        <Input 
                            prefix={<UserOutlined />} 
                            placeholder="Tên đăng nhập"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Mật khẩu"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large">
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;
