<template>
  <div>
    <el-container style="height: 1000px; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1', '3']">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-message"></i>导航一
            </template>
            <el-menu-item-group>
              <el-menu-item
                index="1-1"
                class="el-icon-s-management"
                @click="currentComponent = 'BooksList'"
              >图书一览</el-menu-item>
              <el-menu-item
                index="1-2"
                class="el-icon-s-order"
                @click="currentComponent = 'BorrowBooks'"
              >借阅记录</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <el-dropdown>
            <i class="el-icon-user-solid" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <span>你的余额：{{ debt }}</span>
            </el-dropdown-menu>
          </el-dropdown>
          <span>{{ name }}</span>
        </el-header>
        <el-main>
          <!-- 根据当前选中的组件名称动态展示组件 -->
          <component :is="currentComponent"></component>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import BooksList from '@/components/BooksList.vue'
import BorrowBooks from '@/components/BorrowBooks.vue'


export default {
  data () {
    return {
      name: localStorage.getItem('name'),
      currentComponent: null, // 存储当前选中的组件名称
      debt: null, // 存储欠款信息
      updateForm: { // 更新个人信息表单数据
        name: '',
        password: ''
      }
    }
  },
  components: {
    BooksList,
    BorrowBooks,
  },
  mounted () {
    // 获取欠款信息
    this.fetchDebt()
  },
  methods: {
    async fetchDebt () {
      try {
        const response = await this.$axios.post('http://localhost:8080/bill/getBill', {
          jwtToken: localStorage.getItem('token')
        })
        if (response.data.code === 1) {
          // 如果成功获取到欠款信息，则更新组件中的 debt 数据
          this.debt = response.data.data
        } else {
          console.error('获取欠款信息失败:', response.data.msg)
        }
      } catch (error) {
        console.error('获取欠款信息失败:', error)
      }
    }
  }
};
</script>
