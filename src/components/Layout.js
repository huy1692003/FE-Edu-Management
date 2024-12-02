'use client'
import { Breadcrumb, Button, Dropdown, Layout, Menu, Space, Typography } from "antd";
import "../app/globals.css";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { usePathname, useRouter } from 'next/navigation';
  
const LayoutSite = ({children}) => {
  const pathname = usePathname();
  const router = useRouter();
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const breadcrumbItems = pathname
    .split('/')
    .filter(item => item)
    .map((item, index) => ({
      title: item.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }));

  const menuItems = [
    {
      key: 'home',
      label: 'Trang chủ',
      onClick: () => router.push('/')
    },
    {
      key: 'khoahoc',
      label: 'Khóa học',
      onClick: () => router.push('/system/khoahoc')
    },
    {
      key: 'giangvien',
      label: 'Giảng viên',
      onClick: () => router.push('/system/giangvien')
    },
   
   
    {
      key: 'lien-he',
      label: 'Liên hệ',
      onClick: () => router.push('/lien-he')
    },
    {
      key: 'ho_tro',
      label: 'Hỗ trợ',
      onClick: () => router.push('/')
    }
  ];

  return (

    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center', background: '#1890ff' }}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={menuItems}
          style={{ flex: 1, minWidth: 0, fontSize: 17, fontWeight: 600, color: "white", background: '#1890ff' }}
        />
        <Space>
          {user ? (
            <Dropdown
              menu={{
                items: [
                  ...(user.loaiTaiKhoan === 1 ? [
                    {
                      key: 'quan-ly-khoa-hoc',
                      label: 'Quản lý khóa học',
                      onClick: () => router.push('/system/admin/khoahoc')
                    },
                    {
                      key: 'quan-ly-giang-vien', 
                      label: 'Quản lý giảng viên',
                      onClick: () => router.push('/system/admin/giangvien')
                    },
                    {
                      key: 'quan-ly-hoc-vien',
                      label: 'Quản lý học viên', 
                      onClick: () => router.push('/system/admin/hocvien')
                    }
                  ] : []),
                  ...(user.loaiTaiKhoan === 2 ? [
                    {
                      key: 'khoa-hoc-giang-day',
                      label: 'Khóa học giảng dạy',
                      onClick: () => router.push('/giangvien/khoahoc')
                    },
                    {
                      key: 'bai-kiem-tra',
                      label: 'Quản lý Bài kiểm tra',
                      onClick: () => router.push('/giangvien/baikiemtra')
                    },
                    {
                      key: 'quan-ly-hoc-vien',
                      label: 'Quản lý học viên',
                      onClick: () => router.push('/giangvien/danhsachhocvien') 
                    }
                  ] : []),
                  ...(user.loaiTaiKhoan === 3 ? [
                    {
                      key: 'khoa-hoc-cua-toi',
                      label: 'Khóa học của tôi',
                      onClick: () => router.push('/system/hocvien/khoahoccuatoi')
                    },
                    {
                      key: 'lam-bai-kiem-tra',
                      label: 'Làm bài kiểm tra',
                      onClick: () => router.push('/system/hocvien/lambaikiemtra')
                    },
                  ] : []),
                  {
                    key: 'dang-xuat',
                    label: 'Đăng xuất',
                    onClick: () => {
                      localStorage.removeItem('user');
                      router.push('/system/login');
                    }
                  }
                ]
              }}
            >
              <Button type="link" style={{ color: '#fff' }}>
                Xin chào , <b style={{fontSize: 16}}>{user?.tenDangNhap}</b>
              </Button>
            </Dropdown>
          ) : (
            <Button type="link" style={{ color: '#fff' }} onClick={() => router.push('/system/login')}>
              Đăng nhập
            </Button>
          )}
        </Space>
        
      </Header>
      <Content style={{ padding: '0 48px', marginBottom: 24 }}>
        <Breadcrumb style={{ margin: '16px 0' }} items={[{ title: 'Home' }, ...breadcrumbItems]} />
        <div style={{ padding: 24, minHeight: 280, background: '#fff', borderRadius: 8 }}>
          <div className="page">
           {children}
          </div>
        </div>
      </Content>
      <Layout.Footer style={{ backgroundColor: "#0b2149", padding: '48px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
            <div>
              <Typography.Title level={4} style={{ color: '#fff', marginBottom: 16 }}>Về chúng tôi</Typography.Title>
              <Typography.Paragraph style={{ color: '#fff' }}>
                Cung cấp nền giáo dục chất lượng cao, hoàn toàn miễn phí, cho bất kỳ ai, ở bất kỳ nơi đâu.
              </Typography.Paragraph>
            </div>
            <div>
              <Typography.Title level={4} style={{ color: '#fff', marginBottom: 16 }}>Liên kết</Typography.Title>
              <Menu theme="dark" mode="vertical" style={{ background: 'transparent' }}>
                <Menu.Item key="home">Trang chủ</Menu.Item>
                <Menu.Item key="courses">Khóa học</Menu.Item>
                <Menu.Item key="blog">Blog</Menu.Item>
                <Menu.Item key="contact">Liên hệ</Menu.Item>
              </Menu>
            </div>
            <div>
              <Typography.Title level={4} style={{ color: '#fff', marginBottom: 16 }}>Đối tác</Typography.Title>
              <Menu theme="dark" mode="vertical" style={{ background: 'transparent' }}>
                <Menu.Item key="gates">Bill & Melinda Gates Foundation</Menu.Item>
                <Menu.Item key="boa">Bank of America</Menu.Item>
                <Menu.Item key="college">College Board</Menu.Item>
              </Menu>
            </div>
            <div>
              <Typography.Title level={4} style={{ color: '#fff', marginBottom: 16 }}>Kết nối</Typography.Title>
              <Space size="large">
                <Button type="link" icon={<i className="pi pi-facebook" />} />
                <Button type="link" icon={<i className="pi pi-twitter" />} />
                <Button type="link" icon={<i className="pi pi-youtube" />} />
              </Space>
            </div>
          </div>
        </div>
      </Layout.Footer>
    </Layout>

  );
}
export default LayoutSite;