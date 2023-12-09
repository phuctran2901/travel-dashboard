import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select
} from 'antd'
import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import styled from 'styled-components'
import Upload from '../../components/Upload'
import {
  DeleteOutlined,
  MenuOutlined,
  PlusCircleOutlined
} from '@ant-design/icons'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import useFetchLocation from './useFetchLocation'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { URL_API } from '../../constants/config'
const Wrapper = styled.div`
  padding: 10px;
  border-radius: 10px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`
const CustomReactQuill = styled(ReactQuill)`
  & > .ql-container {
    min-height: 150px;
  }
`
export default function AddProductPage() {
  const history = useHistory()
  const { data, loading } = useFetchLocation()
  const [rsForm, setRsForm] = useState(false)
  const [files, setFiles] = useState([])

  const onFinish = (data) => {
    const formData = formatObjFromFormData(data)

    createTour(formData)
  }

  const onSuccess = () => {
    setRsForm(true)
    setFiles([])

    toast.success({
      type: 'success',
      content: 'Tạo tour thành công'
    })

    setTimeout(() => {
      history.push('/product/list')
    }, 500)
  }

  const onError = (message) => {
    toast.error({
      type: 'error',
      content: message
    })
  }

  const createTour = (body) => {
    const token = sessionStorage.getItem('token')
    axios({
      url: `${URL_API}/products`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: body
    })
      .then((res) => {
        console.log(res)
        if (res?.data?.status === 'success') {
          onSuccess()
        }
      })
      .catch((err) => {
        onError(err.message)
      })
  }

  const formatObjFromFormData = (obj) => {
    const formData = new FormData()
    if (files.length > 0) {
      files.forEach((file) => {
        formData.append('image', file)
      })
    }
    formData.append('locationName', obj?.title)
    formData.append('description', obj?.description)
    formData.append('endDate', moment(obj?.endDate).format('DDMMYYYY'))
    formData.append('startDate', moment(obj?.startDate).format('DDMMYYYY'))
    formData.append('schedule', JSON.stringify(obj?.schedule))
    formData.append('numberOfSeatsLeft', obj?.numberOfSeatsLeft)
    formData.append('sale', obj?.sale)
    formData.append('price', obj?.price)
    return formData
  }

  return (
    <div style={{ padding: 30 }}>
      <Wrapper>
        <Form
          onFinish={onFinish}
          layout='vertical'
          initialValues={{
            schedule: [{}]
          }}
        >
          <h3>Chi tiết tour</h3>
          <Row gutter={5}>
            <Col span={12}>
              <Form.Item
                label='Tên tour'
                name='title'
                rules={[
                  {
                    required: true,
                    message: 'This is required'
                  }
                ]}
              >
                <Input placeholder='Nhập tên tour' />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label='Ngày bắt đầu'
                name='startDate'
                rules={[
                  {
                    required: true,
                    message: 'This is required'
                  }
                ]}
              >
                <DatePicker style={{ width: '100%' }} placeholder='Chọn ngày' />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label='Ngày kết thúc'
                name='endDate'
                rules={[
                  {
                    required: true,
                    message: 'This is required'
                  }
                ]}
              >
                <DatePicker style={{ width: '100%' }} placeholder='Chọn ngày' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={5}>
            <Col span={8}>
              <Form.Item
                label='Số chỗ'
                name='numberOfSeatsLeft'
                rules={[
                  {
                    required: true,
                    message: 'This is required'
                  }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder='Nhập số chỗ'
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label='Giá'
                name='price'
                rules={[
                  {
                    required: true,
                    message: 'This is required'
                  }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder='Nhập giá tour'
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label='Giảm giá (%)'
                name='sale'
                rules={[
                  {
                    required: true,
                    message: 'This is required'
                  }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder='Nhập giảm giá'
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item label='Mô tả' name='description'>
                <CustomReactQuill />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='Hình ảnh' name='image'>
                <Upload rsForm={rsForm} onSubmitImage={setFiles} />
              </Form.Item>
            </Col>
          </Row>
          <h3>Lịch trình tour</h3>
          <Form.List name={'schedule'}>
            {(fields, { add, remove, move }) => (
              <div>
                <DragDropContext
                  onDragEnd={(e) => {
                    move(e?.source?.index, e?.destination?.index)
                  }}
                >
                  <Droppable droppableId='droppable'>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        // style={getListStyle(snapshot.isDraggingOver)}
                      >
                        {fields.map((field, index) => {
                          return (
                            <Draggable
                              key={field.key}
                              draggableId={field.key.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}

                                  // style={getItemStyle(
                                  //   snapshot.isDragging,
                                  //   provided.draggableProps.style
                                  // )}
                                >
                                  <Row key={field.key} gutter={10}>
                                    <Col span={1}>
                                      <span {...provided.dragHandleProps}>
                                        <MenuOutlined />
                                      </span>
                                    </Col>
                                    <Col span={15}>
                                      <Form.Item
                                        name={[field.name, 'location']}
                                      >
                                        <Select
                                          options={data?.location?.map((l) => ({
                                            value: l._id,
                                            label: l.locationName
                                          }))}
                                          placeholder={'Select location'}
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col span={7}>
                                      <Form.Item name={[field.name, 'date']}>
                                        <DatePicker style={{ width: '100%' }} />
                                      </Form.Item>
                                    </Col>
                                    <Col span={1}>
                                      <span
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                          remove(index)
                                        }}
                                      >
                                        <DeleteOutlined />
                                      </span>
                                    </Col>
                                  </Row>
                                </div>
                              )}
                            </Draggable>
                          )
                        })}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                <Button
                  type='dashed'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%'
                  }}
                  onClick={() => {
                    add({})
                  }}
                  icon={<PlusCircleOutlined />}
                >
                  Thêm địa điểm
                </Button>
              </div>
            )}
          </Form.List>
          <Form.Item style={{ marginTop: 50 }}>
            <Button style={{ width: '100%' }} type='primary' htmlType='submit'>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Wrapper>
    </div>
  )
}
