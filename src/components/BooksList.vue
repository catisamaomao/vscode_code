<template>
  <div>
    <!-- 表单 -->
    <el-form :model="formData" inline>
      <el-form-item label="书名">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="formData.author"></el-input>
      </el-form-item>
      <el-form-item label="出版日期">
        <el-date-picker v-model="formData.publicationTime" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="出版社">
        <el-input v-model="formData.press"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">搜索</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="name" label="书名" width="150"></el-table-column>
      <el-table-column prop="author" label="作者" width="120"></el-table-column>
      <el-table-column prop="publicationTime" label="出版日期" width="120"></el-table-column>
      <el-table-column prop="press" label="出版社" width="120"></el-table-column>
      <el-table-column prop="bookId" label="书ID" width="120"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">借阅</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="formData.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="formData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
/* const token = localStorage.getItem('token'); */
import axiosInstance from '@/untils/axiosInstance' // 导入 Axios 实例
export default {

  data () {
    return {
      formData: {
        name: '',
        author: '',
        publicationTime: '',
        press: '',
        page: 1, // 初始页码为1
        pageSize: 10, // 初始每页显示条数为10
      },
      tableData: [],
      total: 0,
    }
  },
  methods: {
    handleSizeChange (val) {
      this.formData.pageSize = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.formData.page = val
      this.fetchData()
    },
    async fetchData () {
      try {
        const response = await axiosInstance.post('/book/page', {
          name: this.formData.name,
          author: this.formData.author,
          publicationTime: this.formData.publicationTime,
          press: this.formData.press,
          page: this.formData.page,
          pageSize: this.formData.pageSize,
          jwtToken: localStorage.getItem('token')
        })
        if (response.data.code === 1) {
          this.tableData = response.data.data.rows
          this.total = response.data.data.total
        } else {
          console.error('请求失败:', response.data.msg)
        }
      } catch (error) {
        console.error('请求失败:', error)
      }
    },

    async handleClick (row) {
      try {
        const response = await axiosInstance.post('/book/borrow', {
          bookId: row.bookId,
          jwtToken: localStorage.getItem('token')
        })

        // 处理成功响应
        if (response.data.code === 1) {
          alert(response.data.msg)
          this.borrowResult = response.data.msg
        } else {
          alert(response.data.msg)
          this.borrowResult = response.data.msg
        }
      } catch (error) {
        // 处理错误
        console.error('Error:', error)
        this.borrowResult = '借阅图书失败'
      }
    },
  },
  mounted () {
    this.fetchData()
  },
};
</script>
