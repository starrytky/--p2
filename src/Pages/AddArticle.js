import React, { useState, useEffect } from 'react'
import marked from 'marked'
import '../static/css/AddArticle.css'
import { Row, Col, Input, Select, Button, DatePicker, message } from 'antd'
import axios from 'axios'
import moment from 'moment'
import servicePath from '../config/apiUrl'

const { Option } = Select
const { TextArea } = Input

function AddArticle(props) {
    const [articleId, setArticleId] = useState(0)  // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
    const [articleTitle, setArticleTitle] = useState('')   //文章标题
    const [articleContent, setArticleContent] = useState('')  //markdown的编辑内容
    const [markdownContent, setMarkdownContent] = useState('预览内容') //html内容
    const [introducemd, setIntroducemd] = useState()            //简介的markdown内容
    const [introducehtml, setIntroducehtml] = useState('等待编辑') //简介的html内容
    const [showDate, setShowDate] = useState()   //发布日期
    // const [updateDate, setUpdateDate] = useState('2020-02-03') //修改日志的日期
    const [typeInfo, setTypeInfo] = useState([]) // 文章类别信息
    const [selectedType, setSelectType] = useState() //选择的文章类别
    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        pedantic: false,
        sanitize: false,
        tables: true,
        breaks: false,
        smartLists: true,
        smartypants: false,
    });

    useEffect(() => {
        getTypeInfo()
        let tmpId = props.match.params.id
        if(tmpId){
            setArticleId(tmpId)
            getArticleById(tmpId)
        }
    }, [])

    const changeContent = (e) => {
        setArticleContent(e.target.value)
        let html = marked(e.target.value)
        setMarkdownContent(html)
    }

    const changeIntroduce = (e) => {
        setIntroducemd(e.target.value)
        let html = marked(e.target.value)
        setIntroducehtml(html)
    }

    const getTypeInfo = () => {
        axios({
            method: 'get',
            url: servicePath.getTypeInfo,
            header:{'Access-Control-Allow-Origin':'*'},
            withCredentials: true
        }).then(
            res => {
                if (res.data.data === "未登录") {
                    localStorage.removeItem('openId')
                    props.history.push('/')
                } else {
                    setTypeInfo(res.data.data)
                }
            }
        )
    }

    const selectTypeHandler = (value) => {
        setSelectType(value)
        console.log('value',value)
    }

    const saveArticle = () => {
        if (!selectedType) {
            message.error(`必须选择文章类别${selectedType}`)
            return false
        } else if (!articleTitle) {
            message.error('文章名称不能为空')
            return false
        } else if (!articleContent) {
            message.error('文章内容不能为空')
            return false
        } else if (!introducemd) {
            message.error('简介不能为空')
            return false
        } else if (!showDate) {
            message.error('发布日期不能为空')
            return false
        }
        message.success('检验通过')
        let dataProps = {}
        console.log('selectedType====校验中',selectedType)
        dataProps.type_id = selectedType
        dataProps.title = articleTitle
        dataProps.article_content = articleContent
        dataProps.introduce = introducemd
        let datetext = showDate.replace(/-/g, '/') //把字符串转换成时间戳
        dataProps.addTime = (new Date(datetext).getTime()) / 1000
        if (articleId === 0) {
            dataProps.view_count = Math.ceil(Math.random()*1000)+1000
            axios({
                method: 'post',
                url: servicePath.addArticle,
                data: dataProps,
                withCredentials: true
            }).then(
                res => {
                    setArticleId(res.data.insertId)
                    if (res.data.isSuccess) {
                        message.success('文章添加成功')
                    } else {
                        message.error('文章添加失败')
                    }
                }
            )
        } else {
            console.log("articleId",articleId)
            dataProps.id = articleId
            axios({
                method: 'post',
                url: servicePath.updateArticle,
                header:{'Access-Control-Allow-Origin':'*'},
                data: dataProps,
                withCredentials: true
            }).then(
                res=>{
                    if(res.data.isSuccess){
                        message.success('文章保存成功')
                    }else{
                        message.error('文章保存失败')
                    }
                }
            )
        }
    }
    const getArticleById = (id)=>{
        axios(servicePath.getArticleById+id,{
            withCredentials:true,
            header:{ 'Access-Control-Allow-Origin':'*'}
        }).then(
            res=>{
                let {title,article_content,introduce,addTime,typeId}=res.data.data[0]
                setArticleTitle(title)
                setArticleContent(article_content)
                let html = marked(""+article_content)
                setMarkdownContent(html)
                setIntroducemd(introduce)
                let tmpInt = marked(""+introduce)
                setIntroducehtml(tmpInt)
                setShowDate(addTime)
                // setUpdateDate(addTime)
                setSelectType(typeId)
            }
        )
    }

    return (
        <div>
            <Row gutter={5}>
                <Col span={18}>
                    <Row gutter={10}>
                        <Col span={16}>
                            <Input
                                value={articleTitle}
                                placeholder="博客标题"
                                size="large"
                                onChange={e => {
                                    setArticleTitle(e.target.value)
                                }}
                            />
                        </Col>
                        <Col span={4}>
                            {/* &nbsp; */}
                            <Select  
                                
                                // labelInValue
                                defaultValue={"请输入值"}
                                value={selectedType==null?"请输入值":selectedType} 
                                size="large" style={{ width: 120 }} onChange={selectTypeHandler}>
                                {
                                    typeInfo.map((item, index) => {
                                        return (
                                        <Option key={index} value={item.Id}>{item.typeName}</Option>
                                        )
                                    })
                                }
                            </Select>
                        </Col>
                    </Row>
                    <br />
                    <Row gutter={10}>
                        <Col span={12}>
                            <TextArea
                                value={articleContent}
                                className="markdown-content"
                                rows={35}
                                onChange={changeContent}
                                onPressEnter={changeContent}
                                placeholder="文章内容"
                            />
                        </Col>
                        <Col span={12}>
                            <div className="show-html"
                                dangerouslySetInnerHTML={{ __html: markdownContent }}
                            ></div>
                        </Col>
                    </Row>

                </Col>
                <Col span={6}>
                    <Row>
                        <Col span={24}>
                            <Button size="large">暂存文章</Button>&nbsp;
                            <Button type="primary" size="large" onClick={saveArticle}>发布文章</Button>
                            <br />
                        </Col>
                        <Col span={24}>
                            <br />
                            <TextArea
                                rows={4}
                                value={introducemd}
                                onChange={changeIntroduce}
                                onPressEnter={changeIntroduce}
                                placeholder="文章简介"
                            ></TextArea>
                            <br />
                            <br />
                            <div className="introduce-html"
                                dangerouslySetInnerHTML={{ __html: "文章简介：" + introducehtml }}
                            ></div>
                        </Col>
                        <Col span={12}>
                            <div className="date-select">
                                <DatePicker 
                                    // showTime
                                    defaultValue={null} 
                                    format={'YYYY/MM/DD'} 
                                    value={moment(showDate, 'YYYY/MM/DD')==null?null:moment(showDate, 'YYYY/MM/DD')}
                                    // defaultValue={moment(new Date(), 'YYYY/MM/DD')} 
                                    
                                    // initialValue={moment(showDate, 'YYYY/MM/DD')}
                                    onChange={(date, dateString) => {
                                        setShowDate(dateString)
                                    }}
                                    placeholder="发布日期"
                                    size="large"
                                    />
                                {/* <div>{showDate}</div>
                                <div>{selectedType}</div> */}
                            </div>
                        </Col>
                    </Row>

                </Col>
            </Row>
        </div>
    )
}
export default AddArticle