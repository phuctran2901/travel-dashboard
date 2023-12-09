import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import {
  addProduct,
  deleteProduct,
  getAllProduct,
  onToggleModal
} from '../../action/index'
import { URL_API } from '../../constants/config'
import ReactPaginate from 'react-paginate'
import AddProduct from '../../components/product/AddProduct'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Row, Col, Popover, Menu } from 'antd'
import moment from 'moment'
import 'antd/dist/antd.css'
import TimeSvg from '../../resources/svg/TimeSvg.svg'
import UserSvg from '../../resources/svg/UserSvg.svg'
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined
} from '@ant-design/icons'
export const ProductItem = styled.div`
  border-radius: 10px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  background-color: inherit;
  padding: 4px;
`
export const CustomRow = styled(Row)`
  margin-top: 24px;
  padding-left: 24px;
  padding-right: 24px;
`

export const ImageStyle = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
  max-height: 200px;
`

export const CreatedAt = styled.p`
  font-size: 12px;
  font-weight: 500;
  margin-top: 8px;
  margin-bottom: 8px;
  color: gray;
`
export const ProductItemTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`

export const Duration = styled.p`
  display: flex;
  gap: 8px;
  & > span {
    font-weight: 600;
    font-size: 12px;
  }
`

const ActionProductItem = styled.div``
function ProductPage(props) {
  const dispatch = useDispatch()
  const products = useSelector((state) => state.products)
  const [totalPage, setTotalPage] = useState(null)
  const [updateProduct, setUpdateProduct] = useState(null)
  const [rsForm, setRsForm] = useState(false)
  const isToggle = useSelector((state) => state.toggleModal)
  const [isLoadingPage, setIsLoadingPage] = useState(false)
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [types, setTypes] = useState([{ _id: '' }])
  const [nxb, setNxb] = useState([{ _id: '' }])
  const [page, setPage] = useState({
    page: 1,
    limit: 5
  })
  const style = { background: '#0092ff', padding: '8px 0' }
  const handleShowModal = () => {
    dispatch(onToggleModal(true))
  }
  const handleCloseModal = () => {
    dispatch(onToggleModal(false))
  }
  const onChangeSelect = (e) => {
    let value = e.target.value
    handleChangeLimit(value)
  }
  function fetchAllTypeAndNxb() {
    axios
      .get(`${URL_API}/tn/type`)
      .then((res) => res.data)
      .then((data) => {
        setTypes(data.types)
      })
    axios
      .get(`${URL_API}/tn/nxb`)
      .then((res) => res.data)
      .then((data) => {
        setNxb(data.nxb)
      })
  }
  function fetchProduct() {
    setIsLoadingPage(true)
    const config = {
      method: 'GET',
      url: `${URL_API}/products?limit=${page.limit}&page=${page.page}`
    }
    axios(config)
      .then((res) => res.data)
      .then((data) => {
        setIsLoadingPage(false)
        setTotalPage(data.totalPage)
        console.log(data.products)
        dispatch(getAllProduct(Object.values(data.products)))
      })
  }
  const handleRsForm = (bool) => {
    setRsForm(bool)
  }
  useEffect(() => {
    fetchAllTypeAndNxb()
    let unsubcribe = fetchProduct()
    return unsubcribe
  }, [page, updateProduct])
  const handleAddProduct = (data, files) => {
    setLoadingBtn(true)
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('image', file)
    })
    formData.append('product', JSON.stringify(data))
    const token = sessionStorage.getItem('token')
    axios({
      url: `${URL_API}/products`,
      method: 'POST',
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .catch((err) => {
        console.log(err)
      })
      .then((res) => res.data)
      .then((data) => {
        setLoadingBtn(false)
        dispatch(addProduct(data.product))
        console.log(data)
        toast.success('Thêm sản phẩm thành công!', {
          position: 'top-right',
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true
        })
        handleRsForm(true)
        setUpdateProduct(data.product._id)
        dispatch(onToggleModal(false))
      })
  }
  const handleDeleteProduct = (id) => {
    const token = sessionStorage.getItem('token')
    axios({
      method: 'DELETE',
      url: `${URL_API}/products/${id}`,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.data)
      .then((data) => {
        dispatch(deleteProduct(id))
        toast.success('Xóa sản phẩm thành công!', {
          position: 'top-right',
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true
        })
      })
      .catch((err) => {
        toast.warning('Xóa sản phẩm thất bại!', {
          position: 'top-right',
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true
        })
      })
  }
  const handleChangePage = (indexPage) => {
    setPage({ ...page, page: indexPage.selected + 1 })
  }
  const handleChangeLimit = (limit) => {
    setPage({ ...page, limit })
  }

  console.log(products)
  return (
    <div className='wrapper-product'>
      {isToggle === true ? (
        <div className='modal-cu' onClick={handleCloseModal}></div>
      ) : (
        ''
      )}
      <div class='container-fluid'>
        <div class='card shadow mb-4'>
          <div class='card-header py-3'>
            <h6 class='m-0 font-weight-bold text-primary'>
              Danh sách sản phẩm
            </h6>
          </div>
        </div>
        <div className='justify-content-between' style={{ display: 'flex' }}>
          <button className='btn btn-success btn-cus' onClick={handleShowModal}>
            <i class='fas fa-plus-circle'></i>
            Thêm
          </button>
          <div className='result-product'>
            <span>Result :</span>
            <select className='custom-se' onChange={onChangeSelect}>
              <option value='5'>5</option>
              <option value='10'>10</option>
              <option value='15'>15</option>
              <option value='20'>20</option>
            </select>
          </div>
        </div>
      </div>
      <CustomRow gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {products?.map((product) => (
          <Col className='gutter-row' span={8} key={product._id}>
            <ProductItem>
              <Row gutter={10}>
                <Col span={16}>
                  <ImageStyle src={product?.urls?.[0]?.url || ''} alt='aa' />
                </Col>
                <Col span={8}>
                  <div style={{ marginBottom: 10 }}>
                    <ImageStyle src={product?.urls?.[1]?.url || ''} alt='aa' />
                  </div>
                  <div>
                    <ImageStyle src={product?.urls?.[2]?.url || ''} alt='aa' />
                  </div>
                </Col>
              </Row>
              <div style={{ paddingLeft: 10, paddingRight: 10 }}>
                <CreatedAt>
                  Posted date:{' '}
                  {moment(product?.createdAt).format('DD/MM/YYYY, HH:mm A')}
                </CreatedAt>
                <ProductItemTitle>{product?.title}</ProductItemTitle>
                <Duration>
                  <img src={TimeSvg} alt='svg' />
                  <span>
                    {moment(product?.startDate, 'DDMMYYYY')?.format(
                      'DD/MM/YYYY'
                    )}{' '}
                    -{' '}
                    {moment(product?.endDate, 'DDMMYYYY')?.format('DD/MM/YYYY')}{' '}
                    -{' '}
                    {moment(product?.endDate, 'DDMMYYYY').diff(
                      moment(product?.startDate, 'DDMMYYYY'),
                      'days'
                    )}{' '}
                    ngày
                  </span>
                </Duration>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Duration>
                    <img src={UserSvg} alt='svg' />
                    <span>12 users</span>
                  </Duration>
                  <Popover
                    trigger={['click']}
                    content={
                      <Menu>
                        <Menu.Item icon={<EyeOutlined />}>View</Menu.Item>
                        <Menu.Item icon={<EditOutlined />}>Edit</Menu.Item>
                        <Menu.Item
                          onClick={() => {
                            handleDeleteProduct(product?._id)
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
      {/* <div class="card-body m-0 pt-0">
                <div class="table-responsive">
                    <table class="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                        <thead>
                            <tr>
                                <th className="text-center">Tên sách</th>
                                <th className="text-center">Tên tác giả</th>
                                <th className="text-center">Hình ảnh</th>
                                <th className="text-center">Số lượng</th>
                                <th className="text-center">Giá</th>
                                <th className="text-center">Thể loại</th>
                                <th className="text-center">Thao tác</th>
                            </tr>
                        </thead>
                        {isLoadingPage ? '' : products.map(product => {
                            return (
                                <tbody key={product._id}>
                                    <tr>
                                        <td className="text-center">{product.title}</td>
                                        <td className="text-center">{product.author}</td>
                                        <td className="text-center">
                                            <div style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>
                                                {product.urls.map(img => {
                                                    return <img key={img.id} src={img.url} alt={product.title} style={{ width: "40px", height: "50px", objectFit: "contain" }}></img>
                                                })}
                                            </div>
                                        </td>
                                        <td className="text-center">{product.inStock}</td>
                                        <td className="text-center">{`${product.price}(VND)`}</td>
                                        <td className="text-center">{product.types.name}</td>
                                        <td className="text-center">
                                            <Link to={`edit/${product._id}`} className="btn btn-primary"><i class="fas fa-pen-square"></i></Link>
                                            <button
                                                onClick={() => handleDeleteProduct(product._id)}
                                                className="btn btn-warning"><i class="far fa-trash-alt"></i></button>
                                        </td>
                                    </tr>
                                </tbody>
                            )
                        })}
                    </table>
                </div>
                {isLoadingPage ? <Loading /> : ''}
            </div> */}
      <ReactPaginate
        containerClassName='container-pagination'
        pageClassName='page-pagination'
        pageCount={totalPage}
        pageRangeDisplayed={1}
        initialPage={0}
        nextLabel={<i class='fas fa-chevron-circle-right'></i>}
        previousLabel={<i class='fas fa-chevron-circle-left'></i>}
        previousClassName='control-pagination'
        nextClassName='control-pagination'
        onPageChange={handleChangePage}
        activeClassName='active-pagination'
      />
      <div className={isToggle === true ? 'show-custom' : 'hide'}>
        <AddProduct
          rsForm={rsForm}
          handleCloseModal={handleCloseModal}
          handleAddProduct={handleAddProduct}
          handleRsForm={handleRsForm}
          loadingBtn={loadingBtn}
          types={types}
          nxb={nxb}
        ></AddProduct>
      </div>
    </div>
  )
}

export default ProductPage
