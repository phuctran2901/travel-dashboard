import React, { useState } from 'react';
import { URL_API } from '../../constants/config';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Spinners from '../../components//Spinners';
import { useHistory } from 'react-router';
function CreateUserPage(props) {
    const history = useHistory();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoad, setIsLoad] = useState(false);
    const onSubmitForm = (data) => {
        setIsLoad(true);
        axios({
            method: "POST",
            url: `${URL_API}/auth/register`,
            data
        })
            .then(res => res.data)
            .then(data => {
                setIsLoad(false);
                if (data.messenger) {
                    toast.error(data.messenger, {
                        position: "top-right",
                        autoClose: 3000,
                        closeOnClick: true,
                        pauseOnHover: true
                    })
                }
                if (data.status === 'success') history.push('/users/list');
            })
            .catch(err => {
                console.log(err);
            })
    }
    return (
        <div className="tm-block-col tm-col-account-settings">
            <div className="tm-bg-primary-dark tm-block tm-block-settings">
                <h2 className="tm-block-title">Tạo tài khoản</h2>
                <form
                    className="tm-signup-form row"
                    onSubmit={handleSubmit(onSubmitForm)}>
                    <div className="form-group col-lg-6">
                        <label for="name">Họ</label>
                        <input
                            id="name"
                            name="firstName"
                            type="text"
                            className="form-control validate"
                            {...register("firstName", { required: true })}
                        />
                        {errors.firstName && <span style={{ color: "red" }}>Vui lòng nhập trường này</span>}
                    </div>
                    <div className="form-group col-lg-6">
                        <label for="name">Tên</label>
                        <input
                            id="name"
                            name="lastName"
                            type="text"
                            className="form-control validate"
                            {...register("lastName", { required: true })}
                        />
                        {errors.lastName && <span style={{ color: "red" }}>Vui lòng nhập trường này</span>}
                    </div>
                    <div className="form-group col-lg-6">
                        <label for="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-control validate"
                            {...register("email", { required: true })}
                        />
                        {errors.email && <span style={{ color: "red" }}>Vui lòng nhập trường này</span>}
                    </div>
                    <div className="form-group col-lg-6">
                        <label for="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="form-control validate"
                            {...register("password", { required: true, minLength: 6 })}
                        />
                        {errors.password && <span style={{ color: "red" }}>Mật khẩu phải trên 6 ký tự</span>}
                    </div>
                    <div className="form-group col-lg-6">
                        <label for="password2">Quyền</label>
                        <select
                            {...register("role", { required: true })}
                            className="custom-select" style={{ border: "1px solid black", outline: "none" }}>
                            <option value="user" >user</option>
                            <option value="admin" >admin</option>
                        </select>
                    </div>
                    <div className="form-group col-lg-6">
                        <label for="phone">Phone</label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            className="form-control validate"
                            {...register("phone", { required: true })}
                        />
                        {errors.firstName && <span style={{ color: "red" }}>Vui lòng nhập trường này</span>}
                    </div>
                    <div className="col-12">
                        <button
                            type="submit"
                            className="btn btn-primary btn-block text-uppercase"
                        >
                            {isLoad ? <Spinners /> : ''}
                            Tạo tài khoản
              </button>
                    </div>
                </form>
            </div>
        </div >

    );
}

export default CreateUserPage;