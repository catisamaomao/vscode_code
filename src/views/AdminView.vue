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
                @click="currentComponent = 'PeoplesList'"
              >用户一览</el-menu-item>
              <el-menu-item
                index="1-3"
                class="el-icon-s-order"
                @click="currentComponent = 'BorrowBooks'"
              >借阅记录一览</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <el-dropdown>
            <i class="el-icon-user-solid" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown"></el-dropdown-menu>
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
import BooksList from '@/adminComponents/BooksList.vue'
import BorrowBooks from '@/adminComponents/BorrowBooks.vue'
import PeoplesList from '@/adminComponents/PeoplesList.vue'

export default {
  data () {
    return {
      currentComponent: null, // 存储当前选中的组件名称
    }
  },
  components: {
    BooksList,
    BorrowBooks,
    PeoplesList,
  },
  mounted () {

  },
  methods: {

  }
};
</script>
