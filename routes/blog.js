var express = require('express');
var router = express.Router();
const { getList,getDetail,newBlog,updateBlog,delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModle')
const loginCheck = require('../middleware/loginCheck')

router.get('/list', function(req, res, next) {
  let author = req.query.author || ''
  const keyword = req.query.keyword || ''
  if(req.query.isadmin){
    //管理员界面
    if(req.session.username == null){
      //未登录
      res.json(
        new ErrorModel('未登录')
      )
      return
    }
    //强制查询自己的博客
    author = req.session.username
  }
  const result = getList(author,keyword)
  return result.then(listData=>{
    res.json(new SuccessModel(listData)) 
  })
});
router.get('/detail', function(req, res, next) {
  const result = getDetail(req.query.id)
  return result.then(data => {
    res.json(
      new SuccessModel(data)
    ) 
  })
});
router.post('/new',loginCheck, function(req, res, next) {
    req.body.author = req.session.username
    let result = newBlog(req.body)
    return result.then(data =>{
      res.json(new SuccessModel(data))
    })
});
router.post('/update',loginCheck, function(req, res, next) {

    const result = updateBlog(req.body.id,req.body)
    return result.then(val =>{
      if(val){
        res.json(new SuccessModel())
        return
      }else{
        res.json(new ErrorModel('更新博客失败'))
        return
      }
    })
});
router.post('/delete',loginCheck, function(req, res, next) {

  const author = req.session.username
  const result = delBlog(req.body.id,author)
  return result.then(val =>{
    if(val) {
      res.json( new SuccessModel())
      return
    }else{
      res.json(new ErrorModel('删除博客失败'))
      return 
    }
  })
});

module.exports = router;