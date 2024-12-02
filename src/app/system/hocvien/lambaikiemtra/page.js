'use client'
import { useState, useEffect } from 'react'
import { Input, Button, Card, Radio, Space, message, Modal } from 'antd'
import { baikiemtraService } from '@/services/baikiemtraService'
import { cauhoiService } from '@/services/cauhoiService'
import { ketquakiemtraService } from '@/services/ketquakiemtraService'

export default function LamBaiKiemTraPage() {
  const [maBKT, setMaBKT] = useState('')
  const [baiKiemTra, setBaiKiemTra] = useState(null)
  const [cauHois, setCauHois] = useState([])
  const [answers, setAnswers] = useState({})
  const [isStarted, setIsStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [totalScore, setTotalScore] = useState(0)

  useEffect(() => {
    if (timeLeft > 0 && isStarted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)

      if (timeLeft === 0) {
        handleSubmit()
      }

      return () => clearTimeout(timer)
    }
  }, [timeLeft, isStarted])

  const searchBaiKiemTra = async () => {
    try {
      const data = await baikiemtraService.getByMaBKT(maBKT)
      setBaiKiemTra(data)
    } catch (error) {
      message.error('Không tìm thấy bài kiểm tra')
    }
  }

  const startBaiKiemTra = async () => {
    try {
      const data = await cauhoiService.getByBaiKiemTraId(baiKiemTra.baiKiemTraId)
      setCauHois(data)
      setIsStarted(true)
      setTimeLeft(baiKiemTra.thoiLuong * 60) // Convert minutes to seconds
    } catch (error) {
      message.error('Lỗi khi tải câu hỏi')
    }
  }

  const handleAnswerChange = (cauHoiId, luaChonId) => {
    setAnswers({
      ...answers,
      [cauHoiId]: luaChonId
    })
  }

  const handleSubmit = async () => {
    let score = 0
    cauHois.forEach(cauHoi => {
      const selectedAnswer = answers[cauHoi.cauHoiId]
      const correctAnswer = cauHoi.luaChons.find(lc => lc.laDapAnDung)
      
      if (selectedAnswer === correctAnswer?.luaChonId) {
        score += cauHoi.diem
      }
    })
    
    setTotalScore(score)
    setIsSubmitted(true)
    setIsStarted(false)

    try {
      const currentUser = JSON.parse(localStorage.getItem('user'))
      const ketQuaKiemTra = {
        hocVienId: currentUser.hocvienID,
        baiKiemTraId: baiKiemTra.baiKiemTraId,
        diem: score
      }
      await ketquakiemtraService.create(ketQuaKiemTra)
      message.success('Đã lưu kết quả bài kiểm tra')
    } catch (error) {
      message.error('Lỗi khi lưu kết quả bài kiểm tra')
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  if (!isStarted) {
    return (
      <div className="p-6">
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>Làm bài kiểm tra</h1>
        
        {!baiKiemTra ? (
          <Space direction="vertical" style={{ width: '100%', alignItems: 'center' }}>
            <span>

            <Input 
              placeholder="Nhập mã bài kiểm tra" 
              value={maBKT}
              onChange={(e) => setMaBKT(e.target.value)}
              style={{ width: 200, textAlign: 'center'  ,marginRight: '10px'}}
            />
            <Button type="primary" onClick={searchBaiKiemTra}>
              Tìm kiếm
            </Button>
            </span>
          </Space>
        ) : isSubmitted ? (
          <div>
            <h2 className="text-xl mb-4">Kết quả: {totalScore.toFixed(1)} điểm</h2>
            <Button onClick={() => {
              setBaiKiemTra(null)
              setMaBKT('')
              setIsSubmitted(false)
              setAnswers({})
            }}>
              Làm bài khác
            </Button>
          </div>
        ) : (
          <Card title={baiKiemTra.tenBaiKiemTra}>
            <p>Thời gian: {baiKiemTra.thoiLuong} phút</p>
            <Button type="primary" onClick={startBaiKiemTra}>
              Bắt đầu làm bài
            </Button>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{baiKiemTra.tenBaiKiemTra}</h1>
        <div className="text-xl">
          Thời gian còn lại: {formatTime(timeLeft)}
        </div>
      </div>

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {cauHois.map((cauHoi, index) => (
          <Card key={cauHoi.cauHoiId} title={`Câu ${index + 1} (${cauHoi.diem} điểm)`}>
            <p className="mb-4">{cauHoi.noiDung}</p>
            <Radio.Group 
              onChange={(e) => handleAnswerChange(cauHoi.cauHoiId, e.target.value)}
              value={answers[cauHoi.cauHoiId]}
            >
              <Space direction="vertical">
                {cauHoi.luaChons.map(luaChon => (
                  <Radio key={luaChon.luaChonId} value={luaChon.luaChonId}>
                    {luaChon.noiDung}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Card>
        ))}
      </Space>

      <div className="mt-4 text-right">
        <Button type="primary" onClick={handleSubmit}>
          Nộp bài
        </Button>
      </div>
    </div>
  )
}
