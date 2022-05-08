const  { exec } = require('../db/mysql') 
const xss = require('xss')
const getList = (author,keyword)=>{
  let sql = `select * from blogs where 1=1 `
  if(author){
    sql += `and author='${author}'`
  }
  if(keyword){
    sql += `and title like '%${keyword}%' `
  }
  sql += `order by createtime desc;`
  // 返回promise
  return exec(sql)
}

const getDetail = (id) => {
  // 先返回假数据
  // return {
  //   id:1,
  //   title:'标题A',
  //   content:'内容A',
  //   createTime:23345679987,
  //   author:'zhangsan'
  // }
  let sql = `select * from blogs where id=${id} `
  return exec(sql).then((rows)=>{
    return rows[0]
  })
}

const newBlog = (blogData = {})=>{
  // blogData是一个博客对象，包含title\content属性
  // console.log('newBlog blogData...', blogData);
  // return {
  //   id:3 //表示 新建博客,插入到数据表里的 id
  // }
  const title = xss(blogData.title)
  const { content,author} = blogData
  const createTime = Date.now()

  const sql = `
    insert into blogs (title, content, createtime, author) values ('${title}', '${content}', ${createTime}, '${author}')
  `
  return exec(sql).then(insertData => {
    console.log('insertData is',insertData)
    return {
      id: insertData.insertId
    }
  })
}
const updateBlog = (id,blogData = {})=>{
  // blogData是一个博客对象，包含title\content属性
  // console.log('更新成功...', id,blogData);
  // id就是要更新博客的id
  // return true
  const {title, content} = blogData
  const sql = `update blogs set title='${title}', content='${content}' where id=${id} `

  return exec(sql).then(updateData =>{
    if(updateData.affectedRows > 0){
      return true
    }
    return false
  })
}
const delBlog = (id,author)=>{
  console.log(id,author);
  // id就是要删除博客的id
  let sql = `delete from blogs where id='${id}' and author='${author}';`
  console.log(sql,'delesql');
  return exec(sql).then(delData =>{
    if(delData.affectedRows > 0){
      return true
    }
    return false
  })
 
}
module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}