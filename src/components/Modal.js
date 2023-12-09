import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Spinners from './Spinners';
function Modal(props) {
    const {
        openModal,
        handleToggleModal,
        titleModal,
        code,
        handleSubmitEditCode,
        loadingBtn,
        handleAddCode
    } = props;
    const [type, setType] = useState('%');
    const { register, handleSubmit, formState: { errors } } = useForm();
    useEffect(() => {
        if (code.type) {
            setType(code.type)
        }
    }, [code])
    function isNaN(x) {
        x = Number(x);
        return x !== x;
    }
    const handleCloseModal = (bool) => {
        handleToggleModal(bool)
    }
    const onSubmitForm = (data) => {
        if (titleModal === 'Sửa') {
            if (data.code === "" && isNaN(data.discount)) {
                handleSubmitEditCode({
                    code: code.code,
                    discount: code.discount,
                    type: type
                }, code._id, true);
            } else if (data.code === "") {
                data.code = code.code;
                data.type = type;
                handleSubmitEditCode(data, code._id, true)
            } else if (isNaN(data.discount)) {
                data.type = type;
                data.discount = code.discount;
                handleSubmitEditCode(data, code._id, true)
            }
            else {
                handleSubmitEditCode(data, code._id, true);
            }
        }
        else {
            if (data.code === "" || isNaN(data.discount)) {
                toast.error("Vui lòng nhập đầy đủ thông tin!", {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true
                })
            }
            else {
                data.type = type;
                handleAddCode(data)
            }
        }
    }
    const onChangeType = (e) => {
        setType(e.target.value)
    }
    return (
        <div className={`modal ${openModal ? 'show' : ''} fade`} id="exampleModal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{titleModal} mã giảm giá</h5>
                        <button type="button" className="close" onClick={() => handleCloseModal(false)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit(onSubmitForm)}>
                            <div className="form-group">
                                <label className="col-form-label">Code</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    defaultValue={code.code}
                                    {...register('code', { required: false, minLength: 6 })}
                                />
                                {errors.code && <span style={{ color: 'red' }}>Vui lòng nhập mã giảm giá</span>}
                            </div>
                            <div className="form-group">
                                <label className="col-form-label">Discount</label>
                                <input type="text"
                                    {...register('discount', { required: false, valueAsNumber: true })}
                                    defaultValue={code.discount}
                                    className="form-control" />
                                {errors.discount && <span style={{ color: 'red' }}>Vui lòng nhập mã giảm giá</span>}
                            </div>
                            <div className="form-group">
                                <label className="col-form-label">Loại</label>
                                <select
                                    className="custom-select"
                                    defaultValue={code.type}
                                    onChange={onChangeType}
                                >
                                    <option selected={code.type === "%"} value="%">%</option>
                                    <option selected={code.type === "đ"} value="đ">đ</option>
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary">
                                    {loadingBtn ? <Spinners /> : ""}
                                    {titleModal}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Modal;