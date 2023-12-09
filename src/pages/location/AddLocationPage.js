import { Button, Form, Input, Upload } from 'antd'
import React, { useRef, useState } from 'react'
import { CloudUploadOutlined } from '@ant-design/icons'
import axios from 'axios'
import { URL_API } from '../../constants/config'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'
import draftToHtml from 'draftjs-to-html'
import { convertToRaw } from 'draft-js'
import { useForm } from 'antd/lib/form/Form'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
export default function AddLocationPage() {
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [form] = useForm()
  const history = useHistory()
  const createLocation = (formData) => {
    setLoadingSubmit(true)
    axios({
      url: `${URL_API}/location`,
      method: 'POST',
      data: formData,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    })
      .then((res) => {
        if (res?.data?.status !== 'failed') {
          onSuccess()
        }
      })
      .catch((err) => {
        onError(err.message)
      })
      .finally(() => {
        setLoadingSubmit(true)
      })
  }

  const onError = (message) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 3000,
      closeButton: true
    })
  }

  const onSuccess = () => {
    toast.success('Tạo địa điểm thành công!', {
      position: 'top-right',
      autoClose: 3000,
      closeButton: true
    })
    form.resetFields()

    setTimeout(() => {
      history.push('/location/list')
    }, 500)
  }

  const onFinish = (data) => {
    const formData = new FormData()
    formData.append('locationName', data?.locationName || '')
    formData.append('description', data?.description)
    formData.append('locationImage', data?.imageLocation?.file)
    formData.append('lat', data?.lat || '')
    formData.append('address', data?.address)
    createLocation(formData)
  }
  return (
    <div className='wrapper-product'>
      <div className='container-fluid' style={{ marginBottom: '10px' }}>
        <div className='card shadow mb-4'>
          <div className='card-header py-3'>
            <h6 className='m-0 font-weight-bold text-primary'>Tạo địa điểm</h6>
          </div>
        </div>
      </div>
      <div className='post-wrapper'>
        <Form layout='vertical' onFinish={onFinish} form={form}>
          <Form.Item
            label='Location Name'
            rules={[
              {
                required: true,
                message: 'This field is required'
              }
            ]}
            name={'locationName'}
          >
            <Input name='locationName' />
          </Form.Item>
          <Form.Item label='Description' name={'description'}>
            <ReactQuill />
          </Form.Item>
          <Form.Item
            label='Adress'
            name={'address'}
            rules={[
              {
                required: true,
                message: 'This field is required'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name={'lat'} label='Lat'>
            <Input />
          </Form.Item>
          <Form.Item
            label='Image'
            getValueFromEvent={(file) => file}
            rules={[
              {
                required: true,
                message: 'This field is required'
              }
            ]}
            name={'imageLocation'}
          >
            <Upload maxCount={1} beforeUpload={() => false}>
              <Button icon={<CloudUploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              loading={loadingSubmit}
              type='primary'
              htmlType='submit'
              style={{ width: '100%' }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
