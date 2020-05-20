import React, { useState, useEffect } from 'react'
import { DatePicker, Button } from 'antd'
import moment from 'moment'

function Test() {
    const [showDate, setShowDate] = useState('2018/01/01')
    // useCallback(() => {
    //     setShowDate('2018/01/02')
    // },[])
    useEffect(() => {

        setShowDate('2018/01/02')
        console.log("========`1`======")
    }, [showDate])
    const handleClick = () => {
        // setShowDate('2018/01/02')
        console.log('===============')
    }
    const f1 = () => {
        var name = "The Window";

        var object = {
            name: "My Object",
            getNameFunc: function () {
                return function () {
                    return this.name
                };
            }
        };

        alert(object.getNameFunc()());
    }
    const f2 = () => {
        var name = "The Window";

        var object = {
            name: "My Object",
            getNameFunc: function () {
                var that = this;
                return function () {
                    return that.name;
                };
            }
        };

        alert(object.getNameFunc()());
    }

    return (
        <div>
            <DatePicker
                showTime
                format={'YYYY/MM/DD'}
                defaultValue={moment(showDate, 'YYYY/MM/DD')}
                onChange={(date, dateString) => {
                    setShowDate(dateString)
                }}
                placeholder="发布日期"
                size="large"
            />
            <Button
                onClick={f1}
            >按钮</Button>
                        <Button
                onClick={f2}
            >按钮</Button>
            <div>
                {showDate}
            </div>
        </div>
    )
}
export default Test