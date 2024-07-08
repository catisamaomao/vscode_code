<template>
  <div>
    <el-form :model="formData" inline>
      <el-form-item label="图书ID">
        <el-input v-model.number="formData.bookId"></el-input>
      </el-form-item>
      <el-form-item label="开始日期">
        <el-date-picker v-model="formData.startTime" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期">
        <el-date-picker v-model="formData.endTime" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="startTime" label="开始日期" width="180"></el-table-column>
      <el-table-column prop="endTime" label="结束日期" width="180"></el-table-column>
      <el-table-column prop="bookId" label="图书ID" width="180"></el-table-column>
      <el-table-column prop="peopleId" label="用户ID"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.endTime !== null"
            :type="scope.row.endTime !== null ? 'default' : 'danger'"
            size="mini"
            @click="returnBook(scope.row)"
          >{{ scope.row.endTime !== null ? '已还书' : '还书' }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import axiosInstance from '@/untils/axiosInstance' // 导入 Axios 实例
export default {
  data () {
    return {
      formData: {
        peopleId: '',
        bookId: '',
        startTime: '',
        endTime: '',
        page: 1,
        pageSize: 10
      },
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10
    }
  },
  methods: {
    async fetchData () {
      try {
        const response = await axiosInstance.post('/record/page', {
          jwtToken: localStorage.getItem('token'),
          bookId: this.formData.bookId,
          startTime: this.formData.startTime,
          endTime: this.formData.endTime,
          page: this.formData.page,
          pageSize: this.formData.pageSize,
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
    async returnBook (row) {
      try {
        if (row.endTime !== null) return // 如果结束日期不为空，直接返回
        const response = await axiosInstance.post('/book/back', {

          bookId: row.bookId,
          peopleId: row.peopleId

        })
        if (response.data.code === 1) {
          alert(response.data.data)
          // 成功后重新加载数据
          this.fetchData()
        } else {
          console.error('归还失败:', response.data.msg)
        }
      } catch (error) {
        console.error('归还失败:', error)
      }
    },
    handleSizeChange (size) {
      this.pageSize = size
      this.formData.pageSize = size
      this.fetchData()
    },
    handleCurrentChange (page) {
      this.currentPage = page
      this.formData.page = page
      this.fetchData()
    }
  },
  mounted () {
    this.fetchData()
  }
};
</script>
