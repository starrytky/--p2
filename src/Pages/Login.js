import React, { useState } from 'react'
import 'antd/dist/antd.css'
import { Card, Input, Icon, Button, Spin, message } from 'antd'
import '../static/css/Login.css'
import servicePath from '../config/apiUrl'
import axios from 'axios'


function Login(props) {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const checkLogin = () => {
        setIsLoading(true)
        if (!userName) {
            message.error('用户名不能为空')
            setTimeout(() => {
                setIsLoading(false)
            }, 1000)
            return false
        } else if (!password) {
            message.error('密码不能为空')
            setTimeout(() => {
                setIsLoading(false)
            }, 1000)
            return false
        }
        let dataProps = {
            'userName': userName,
            'password': password
        }
        // console.log("dataProps",dataProps)
        // axios({
        //     method: 'post',
        //     url: servicePath.checkLogin,
        //     data: dataProps,
        //     withCredentials: true
        // }).then(
        //     res => {
        //         setIsLoading(false)
        //         console.log("res.data",res.data)
        //         if (res.data.data === "登录成功") {
        //             localStorage.setItem('openId', res.data.openId)
        //             props.history.push('/index')
        //         } else {
        //             message.error('用户名或密码错误')
        //         }
        //     }
        // )
        axios({
            method: 'post',
            url: servicePath.checkLogin,
            data:dataProps,
            withCredentials: true
        }).then(
           res=>{
                setIsLoading(false)
                console.log("object")
                if(res.data.data==='登录成功'){
                    localStorage.setItem('openId',res.data.openId)
                    props.history.push('/index')
                }else{
                    message.error('用户名密码错误')
                }
           }
        ).catch(err => {
            console.log("err",err)
        })
        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
    }

    return (
        <div className="login-div">
            <Spin tip="Loading..." spinning={isLoading}>
                <Card titile="card title -blog" bordered={true} style={{ width: 400 }}>
                    <Input
                        id="userName"
                        size="large"
                        placeholder="Enter your userName"
                        prefix={<Icon type="user" style={{ color: 'rbga(0,0,0,.25)' }} />}
                        onChange={(e) => { setUserName(e.target.value) }}
                    />
                    <br /><br />
                    <Input
                        id="password"
                        size="large"
                        placeholder="Enter your password"
                        prefix={<Icon type="key" style={{ color: 'rbga(0,0,0,.25)' }} />}
                        onChange={(e) => { setPassword(e.target.value) }}
                    />
                    <br /><br />
                    <Button type="primary" size="large" block onClick={checkLogin}>登录</Button>
                </Card>
            </Spin>
        </div>
    )
}

export default Login