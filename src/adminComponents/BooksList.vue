<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" title="编辑图书信息">
      <el-form :model="editedBook" label-width="80px">
        <el-form-item label="书名">
          <el-input v-model="editedBook.name"></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="editedBook.author"></el-input>
        </el-form-item>
        <el-form-item label="出版日期">
          <el-date-picker v-model="editedBook.publicationTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="出版社">
          <el-input v-model="editedBook.press"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </el-dialog>
    <!-- 表单 -->
    <el-form :model="formData" inline id="bookForm">
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
        <el-button type="primary" @click="addBook">添加新图书</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="name" label="书名" width="150"></el-table-column>
      <el-table-column prop="author" label="作者" width="120"></el-table-column>
      <el-table-column prop="publicationTime" label="出版日期" width="120"></el-table-column>
      <el-table-column prop="press" label="出版社" width="120"></el-table-column>
      <el-table-column prop="bookId" label="书ID" width="120"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="openDialog(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="deleteBook(scope.row)" type="text" size="small">删除</el-button>
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
      dialogVisible: false,
      editedBook: {
        bookId: '',
        name: '',
        author: '',
        publicationTime: '',
        press: ''
      },
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
    openDialog (row) {
      // 将当前行的信息填充到表单中
      this.editedBook = { ...row }
      this.dialogVisible = true
    },

    async deleteBook (row) {
      try {
        const response = await axiosInstance.post('/admin/book/delete', {
          bookId: row.bookId,
          jwtToken: localStorage.getItem('token')
        })
        if (response.data.code === 1) {
          this.fetchData()
        } else {
          console.error('请求失败:', response.data.msg)
        }
      } catch (error) {
        console.error('请求失败:', error)
      }
    },
    async handleSave () {
      try {
        const response = await axiosInstance.post('/admin/book/update', {
          name: this.editedBook.name,
          author: this.editedBook.author,
          publicationTime: this.editedBook.publicationTime,
          press: this.editedBook.press,
          bookId: this.editedBook.bookId,
          jwtToken: localStorage.getItem('token')
        })
        if (response.data.code === 1) {
          this.fetchData()
          this.dialogVisible = false
        } else {
          console.error('请求失败:', response.data.msg)
        }
      } catch (error) {
        console.error('请求失败:', error)
      }
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
    async addBook () {
      try {
        const response = await axiosInstance.post('admin/book/add', {
          name: this.formData.name,
          author: this.formData.author,
          publicationTime: this.formData.publicationTime,
          press: this.formData.press,
          jwtToken: localStorage.getItem('token')
        })
        if (response.data.code === 1) {
          /* 将查询条件置空 */
          this.formData.author = ''
          this.formData.name = ''
          this.formData.press = ''
          this.formData.publicationTime = ''
          this.fetchData()
        } else {
          console.error('请求失败:', response.data.msg)
        }
      } catch (error) {
        console.error('请求失败:', error)
      }
    },
    async handleClick (row) {
      try {
        const token = localStorage.getItem('token')
        const response = await axiosInstance.post('/book/borrow', {
          bookId: row.bookId,
          jwtToken: localStorage.getItem('token')
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
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
