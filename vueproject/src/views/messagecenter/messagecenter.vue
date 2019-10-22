/**
 * 支付管理 支付配置
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>支付配置</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input  size="small" v-model="formInline.name" placeholder="输入消息内容"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="index" width="60">
      </el-table-column>
      <el-table-column sortable prop="messageContent" label="消息内容" width="600" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="messageTime" label="发布时间" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 //添加页面-->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog('editForm')">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="消息内容" prop="messageContent">
          <el-input type="textarea"  size="small" v-model="editForm.messageContent" auto-complete="off" placeholder="请输入消息内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog('editForm')">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { messageList, messageinsertSave, messageupdateSave,messageDelete } from '../../api/message.js'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '添加',
      editForm: {
        messageContent:'',
        token: localStorage.getItem('logintoken')
      },
      // rules表单验证
      rules: {
        messageContent: [{ required: true, message: '请输入消息内容', trigger: 'blur' }]
      },
      formInline: {  //搜索框
        page: 1,
        limit: 10,
        name: '',
        payType: 0,
        partner: '',
        token: localStorage.getItem('logintoken')
      },
      // 删除部门
      seletedata: {
        ids: '',
        token: localStorage.getItem('logintoken')
      },
      userparm: [], //搜索权限
      listData: [], //用户数据
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      }
    }
  },
  // 注册组件
  components: {
    Pagination
  },
  /**
   * 数据发生改变
   */

  /**
   * 创建完毕
   */
  created() {
    this.getdata(this.formInline)
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
//----------------------------------------------------------------------
      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
      getdata(){
      var data={
        pagenum: this.formInline.page
      }
      messageList(data).then(res => {

          this.loading = false
          if (res.success == false) {
            this.$message({
              type: 'info',
              message: res.msg
            })
          } else {
            this.listData = res.list
            // 分页赋值
            this.pageparm.currentPage = res.pageNum
            this.pageparm.pageSize = res.pageSize
            this.pageparm.total = res.pages
          }
        })
        .catch(err => {
          this.loading = false
          this.$message.error('菜单加载失败，请稍后再试！')
        })
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage
      this.formInline.limit = parm.pageSize
      this.getdata(this.formInline)
    },
    // 搜索事件
    search() {
      this.getdata(this.formInline)
    },
    //显示编辑界面--弹框
    handleEdit: function(index, row) {
      this.editFormVisible = true
      if (row != undefined && row != 'undefined') {
        this.title = '修改'
        this.editForm.messageId=row.messageId
        this.editForm.messageContent = row.messageContent
      } else {
        this.title = '添加'
        this.editForm.messageContent = ''
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          if(this.editForm.title=='修改'){
            messageupdateSave(this.editForm).then(res => {
                this.editFormVisible = false
                this.loading = false
                if (res==1) {
                  this.getdata(this.formInline)
                  this.$message({
                    type: 'success',
                    message: '消息保存成功！'
                  })
                } else {

                  this.$message({
                    type: 'info',
                    message: res.msg
                  })
                }
              })  .catch(err => {
              this.editFormVisible = false
              this.loading = false
              this.$message.error('消息保存失败，请稍后再试！')
            })

          }else{
            messageinsertSave(this.editForm).then(res => {
                this.editFormVisible = false
                this.loading = false
                if (res==1) {
                  this.getdata(this.formInline)
                  this.$message({
                    type: 'success',
                    message: '消息保存成功！'
                  })
                } else {

                  this.$message({
                    type: 'info',
                    message: res.msg
                  })
                }
              })  .catch(err => {
              this.editFormVisible = false
              this.loading = false
              this.$message.error('消息保存失败，请稍后再试！')
            })
          }

        } else {
          return false
        }
      })
    },
    // 删除消息
    deleteUser(index, row) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          messageDelete(row.messageId).then(res => {
              if (res==1) {
                this.$message({
                  type: 'success',
                  message: '消息已删除!'
                })
                this.getdata(this.formInline)
              } else {
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message.error('消息删除失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 关闭编辑、增加弹出框
    closeDialog(formName) {
      this.editFormVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.user-search {
  margin-top: 20px;
}
.userRole {
  width: 100%;
}
</style>
