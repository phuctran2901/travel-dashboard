import React, { useEffect, useState } from 'react'
import {
  CreatedAt,
  CustomRow,
  Duration,
  ImageStyle,
  ProductItem,
  ProductItemTitle
} from '../product/ListProductPage'
import { Col, Menu, Popover, Row } from 'antd'
import moment from 'moment'
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined
} from '@ant-design/icons'
import { URL_API } from '../../constants/config'
import axios from 'axios'
import ReactPaginate from 'react-paginate'
import { useHistory } from 'react-router-dom'
export default function ListLocationPage() {
  const history = useHistory()
  const [locations, setLocations] = useState([])
  const [page, setPage] = useState({
    page: 1,
    limit: 10,
    totalPage: 1
  })

  const fetchLocations = async () => {
    const config = {
      method: 'GET',
      url: `${URL_API}/location?limit=${page.limit}&page=${page.page}`
    }
    axios(config)
      .then((res) => res.data)
      .then((data) => {
        console.log(data)
        if (data?.status === 'success') {
          setLocations(data?.location)
        }
      })
  }
  const handleChangePage = (indexPage) => {
    setPage({ ...page, page: indexPage.selected + 1 })
  }
  const handleChangeLimit = (limit) => {
    setPage({ ...page, limit })
  }
  useEffect(() => {
    fetchLocations()
  }, [])

  const onRedirectAddLocationPage = () => {
    history.push('/location/add')
  }
  return (
    <div className='wrapper-product'>
      <div class='container-fluid'>
        <div class='card shadow mb-4'>
          <div class='card-header py-3'>
            <h6 class='m-0 font-weight-bold text-primary'>
              Danh sách địa điểm
            </h6>
          </div>
        </div>
        <div className='justify-content-between' style={{ display: 'flex' }}>
          <button
            className='btn btn-success btn-cus'
            onClick={onRedirectAddLocationPage}
          >
            <i class='fas fa-plus-circle'></i>
            Thêm
          </button>
          <div className='result-product'>
            <span>Result :</span>
          </div>
        </div>
      </div>
      <CustomRow gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {locations?.map((location) => (
          <Col className='gutter-row' span={8} key={location._id}>
            <ProductItem>
              <Row gutter={10}>
                <ImageStyle src={location?.image || ''} alt='aa' />
              </Row>
              <div style={{ paddingLeft: 10, paddingRight: 10 }}>
                <CreatedAt>
                  Posted date:{' '}
                  {moment(location?.createdAt).format('DD/MM/YYYY, HH:mm A')}
                </CreatedAt>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <ProductItemTitle>{location?.locationName}</ProductItemTitle>
                  <Popover
                    trigger={['click']}
                    content={
                      <Menu>
                        <Menu.Item icon={<EyeOutlined />}>View</Menu.Item>
                        <Menu.Item icon={<EditOutlined />}>Edit</Menu.Item>
                        <Menu.Item
                          onClick={() => {
                            // handleDeleteProduct(product?._id)
                          }}
                          icon={<DeleteOutlined />}
                        >
                          Delete
                        </Menu.Item>
                      </Menu>
                    }
                  >
                    <MoreOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
                  </Popover>
                </div>
              </div>
            </ProductItem>
          </Col>
        ))}
      </CustomRow>

      <ReactPaginate
        containerClassName='container-pagination'
        pageClassName='page-pagination'
        pageCount={page.totalPage}
        pageRangeDisplayed={1}
        initialPage={0}
        nextLabel={<i class='fas fa-chevron-circle-right'></i>}
        previousLabel={<i class='fas fa-chevron-circle-left'></i>}
        previousClassName='control-pagination'
        nextClassName='control-pagination'
        onPageChange={handleChangePage}
        activeClassName='active-pagination'
      />
    </div>
  )
}
