<template>
  <div>
    <h2>登录</h2>
    <form @submit.prevent="login">
      <div>
        <label for="name">用户名:</label>
        <input type="text" id="name" v-model="name" required />
      </div>
      <div>
        <label for="password">密码:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">登录</button>
    </form>
    <div v-if="message">{{ message }}</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      password: '',
      message: '',
    }
  },
  methods: {
    async login () {
      try {
        const response = await this.$axios.post('http://localhost:8080/people/login', {
          name: this.name,
          password: this.password
        }/* , {
          headers: {
            'Content-Type': 'application/json'
          }
        } */)


        // 请求成功，处理响应
        console.log(response.data)
        if (response.data.code === 1) {
          // 登录成功，保存 token 或者跳转到其他页面
          localStorage.setItem('token', response.data.data)
          localStorage.setItem('name', this.name)
          // 例如跳转到首页
          if (this.name == "admin") {
            this.$router.push('/admin')
          } else {
            this.$router.push('/index')
          }


        } else {
          // 登录失败，显示错误消息
          this.message = response.data.msg
        }
      } catch (error) {
        // 请求失败，处理错误
        console.error('登录失败:', error)
        this.message = '登录失败，请重试。'
        // 判断状态码是否为 401，如果是则执行重定向
        if (error.response.status === 401) {
          // 重定向到登录页
          console.log("接口未授权")
          this.$router.push('/')
        }
      }
    }
  }
};
</script>

<style>
/* 可以根据需要添加样式 */
</style>
