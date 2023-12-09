import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import { URL_API } from '../../constants/config';
import OrdersDetail from '../../components/orders/ordersDetail';
import axios from 'axios';
import { toast } from 'react-toastify'

function OrdersPage(props) {
    const [orders, setOrders] = useState([]);
    const [isLoadingPage, setIsLoadingPage] = useState(false);
    const [statusOrders, setStatusOrder] = useState(-1);
    const [isToggleBtn, setIsToggleBtn] = useState(false);
    const [ordersDetail, setOrdersDetail] = useState({
        productDetail: [],
        userID: '',
        address: '',
        status: '',
        saleCode: { discount: 0, code: null, type: "%" },
        total: 0
    });
    function fetchAllOrders() {
        setIsLoadingPage(true);
        const config = {
            method: "GET",
            url: `${URL_API}/orders?status=${statusOrders}`
        }
        axios(config)
            .then(res => res.data)
            .then(data => {
                setIsLoadingPage(false);
                setOrders(data.orders);
            })
    }
    const handleDeleteOrder = (id) => {
        axios({
            url: `${URL_API}/orders/${id}`,
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem('token')}`
            }
        })
            .then(res => res.data)
            .then(data => {
                if (data.status === 'success') {
                    fetchAllOrders();
                    toast.success("Xóa đơn hàng thành công!", {
                        autoClose: 3000,
                        position: "top-right",
                        closeButton: true
                    })
                }
                else {
                    toast.error("Xóa đơn hàng thất bại!", {
                        autoClose: 3000,
                        position: "top-right",
                        closeButton: true
                    })
                }
            })
    }
    const handleToggleBtn = (bool) => {
        setIsToggleBtn(bool);
    }
    const handleDetailsOrders = (orders, bool) => {
        setOrdersDetail(orders);
        setIsToggleBtn(bool);
    }
    useEffect(() => {
        let unsubcribe = fetchAllOrders();
        return unsubcribe;
    }, [statusOrders])
    const onChangeStatus = (e) => {
        setStatusOrder(Number(e.target.value));

    }
    const handleStatus = (num) => {
        switch (num) {
            case 0:
                return 'Chờ xác nhận';
            case 1:
                return 'Đã xác nhận';
            case 2:
                return 'Đang giao hàng';
            case 3:
                return 'Đã giao hàng';
            default:
                return 'Errors';
        }
    }
    const handleChangeStatusOrders = (e, id) => {
        axios({
            method: "POST",
            url: `${URL_API}/orders/status`,
            data: {
                status: Number(e.target.value),
                orderID: id
            },
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem('token')}`
            }
        })
            .then(res => console.log(res))
    }
    return (
        <div className="wrapper-product">
            <div class="container-fluid">
                <div class="card shadow mb-4">
                    <div class="card-header py-3">
                        <h6 class="m-0 font-weight-bold text-primary">Đơn hàng</h6>
                    </div>
                </div>
                <div className="justify-content-between" style={{ display: 'flex', marginBottom: "10px" }}>
                    <div className="result-product">
                        <select className="custom-se" name="result" onChange={onChangeStatus}>
                            <option value="-1">Tất cả</option>
                            <option value="0">Chờ xác nhận</option>
                            <option value="1">Đã xác nhận</option>
                            <option value="2">Đang giao hàng</option>
                            <option value="3">Đã giao hàng</option>
                        </select>
                    </div>
                    <div className="result-product">
                        <span>Result :</span>
                        <select className="custom-se" name="result">
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="card-body m-0 pt-0">
                <div class="table-responsive">
                    <table class="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                        <thead>
                            <tr>
                                <th className="text-center">STT</th>
                                <th className="text-center">Người đặt</th>
                                <th className="text-center">Địa chỉ</th>
                                <th className="text-center">SĐT</th>
                                <th className="text-center">Ngày Đặt</th>
                                <th className="text-center">Trạng Thái</th>
                                <th className="text-center">Chi Tiết</th>
                                <th className="text-center">Xóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoadingPage ? '' : orders.map((order, index) => {
                                return (
                                    <tr key={order._id}>
                                        <td className="text-center">{index + 1}</td>
                                        <td className="text-center">{order.name}</td>
                                        <td className="text-center">{order.address}</td>
                                        <td className="text-center">{order.phone}</td>
                                        <td className="text-center">{new Date(order.createdAt).toLocaleString()}</td>
                                        <td className="text-center">
                                            <select
                                                className="select-cus"
                                                onChange={(e) => handleChangeStatusOrders(e, order._id)}
                                                defaultValue={order.status}
                                            >
                                                <option value={0} >Chờ xác nhận</option>
                                                <option value={1} >Đã xác nhận</option>
                                                <option value={2} >Đang giao hàng</option>
                                                <option value={3} >Đã giao hàng</option>
                                            </select>
                                        </td>
                                        <td className="text-center">
                                            <span
                                                onClick={() => handleDetailsOrders(order, true)}
                                                className="details-order"
                                            >
                                                <i class="fas fa-info-circle"></i>
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <span
                                                onClick={() => handleDeleteOrder(order._id)}
                                                className="order-delete">
                                                <i class="far fa-trash-alt"></i>
                                            </span>
                                        </td>
                                    </tr>)
                            })}</tbody>
                    </table>
                </div>
                {isLoadingPage ? <Loading /> : ''}
            </div>
            <div className={isToggleBtn ? 'show-orders' : 'hide-orders'}>
                <OrdersDetail
                    ordersDetail={ordersDetail}
                    handleToggleBtn={handleToggleBtn}
                    handleStatus={handleStatus}
                />
            </div>
            {isToggleBtn === true ? <div className="modal-cu" onClick={() => handleToggleBtn(false)}>
            </div> : ''}
        </div >
    );
}

export default OrdersPage;