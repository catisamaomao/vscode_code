<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" title="编辑用户信息">
      <el-form :model="editedPeople" label-width="80px">
        <el-form-item label="用户id">
          <el-input v-model="editedPeople.id"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="editedPeople.name"></el-input>
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input v-model="editedPeople.password"></el-input>
        </el-form-item>
        <el-form-item label="用户余额">
          <el-input v-model="editedPeople.fine"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </el-dialog>
    <!-- 表单 -->
    <el-form :model="formData" inline id="peopleForm">
      <el-form-item label="用户id">
        <el-input v-model="formData.id"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="用户密码">
        <el-input v-model="formData.password"></el-input>
      </el-form-item>
      <el-form-item label="欠款">
        <el-input v-model="formData.fine"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">搜索</el-button>
        <el-button type="primary" @click="addPeople">添加新用户</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="id" label="用户id" width="150"></el-table-column>
      <el-table-column prop="name" label="用户名" width="120"></el-table-column>
      <el-table-column prop="password" label="用户密码" width="120"></el-table-column>
      <el-table-column prop="fine" label="用户余额" width="120"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="openDialog(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="deletePeople(scope.row)" type="text" size="small">删除</el-button>
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
      editedPeople: {
        id: '',
        name: '',
        password: '',
        fine: '',
      },
      formData: {
        id: '',
        name: '',
        password: '',
        fine: '',
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
      this.editedPeople = { ...row }
      this.dialogVisible = true
    },

    async deletePeople (row) {
      try {
        const response = await axiosInstance.post('/admin/people/delete', {
          id: row.id,
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
        const response = await axiosInstance.post('/admin/people/update', {
          name: this.editedPeople.name,
          id: this.editedPeople.id,
          password: this.editedPeople.password,
        })
        await axiosInstance.post('/admin/bill/update', {
          peopleId: this.editedPeople.id,
          fine: this.editedPeople.fine,
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
        const response = await axiosInstance.post('/admin/people/getpage', {
          name: this.formData.name,
          id: this.formData.id,
          password: this.formData.password,
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
    async addPeople () {
      try {
        const response = await axiosInstance.post('/admin/people/add', {
          name: this.formData.name,
          password: this.formData.password,
          fine: this.formData.fine,
        })
        if (response.data.code === 1) {
          /* 将查询条件置空 */
          this.formData.password = ''
          this.formData.name = ''
          this.formData.peopleId = ''
          this.formData.fine = ''
          this.fetchData()
        } else {
          console.error('请求失败:', response.data.msg)
        }
      } catch (error) {
        console.error('请求失败:', error)
      }
    },

  },
  mounted () {
    this.fetchData()
  },
};
</script>
