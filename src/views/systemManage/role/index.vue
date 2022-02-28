<template>
  <div class="app-container">
    <div class="filter-container" style="padding-left: 0">
      <el-input
        v-model="listQuery.name"
        placeholder="名称"
        style="width: 15%"
        class="filter-item"
        clearable
        @keyup.enter.native="getList"
      />
      <el-button class="filter-item" type="primary" @click="handleFilter">
        查询
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        @click="addUser"
      >
        添加
      </el-button>
    </div>
    <el-table
      :data="roleList"
      :header-cell-style="{ background: '#eef1f6' }"
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="序号" type="index" align="center">
        <template slot-scope="scope">
          <span>{{
            (listQuery.page - 1) * listQuery.rows + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" align="center" />
      <el-table-column
        label="创建时间"
        prop="createTime"
        align="center"
        :formatter="dataFormat"
      />

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            type="text"
            @click="handleEdit(row)"
          >编辑</el-button>

          <el-button
            size="mini"
            type="text"
            @click="handleQx(row)"
          >权限</el-button>

          <el-button
            size="mini"
            type="text"
            @click="handleDelete(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.rows"
      @pagination="getList"
    />

    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialog"
      center
      width="30%"
    >
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelSubmit">取消</el-button>
          <el-button
            type="primary"
            @click="submitForm('roleForm')"
          >确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRoleDialog"
      center
      width="30%"
    >
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelEditSubmit">取消</el-button>
          <el-button
            type="primary"
            @click="submitEditForm('roleForm')"
          >确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--权限-->
    <el-dialog title="权限配置" :visible.sync="qxDialog" center width="30%">
      <el-tree
        ref="tree"
        :data="privList"
        show-checkbox
        default-expand-all
        node-key="code"
        highlight-current
        :default-checked-keys="priCheckData"
        :props="defaultProps"
      />
      <el-row type="flex" class="row-bg" :gutter="40" justify="center">
        <el-col
          :span="4"
        ><el-button @click="cancelPrvSubmit">取消</el-button></el-col>
        <el-col
          :span="4"
        ><el-button
          type="primary"
          @click="submitPrvForm"
        >确认</el-button></el-col>
      </el-row>
    </el-dialog>
    <!-- 遮罩层loding -->
    <div
      v-if="lod"
      v-loading="true"
      class="app-gloab-loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.7)"
    />
  </div>
</template>

<script>
import {
  getRoleList,
  addRole,
  updateRole,
  deleteRole,
  getPriList,
  updatePriv
} from '@/api/role'
import Pagination from '@/components/Pagination'
import * as fecha from 'element-ui/lib/utils/date'
// import { getUserList } from '@/api/user'
export default {
  components: { Pagination },
  data() {
    return {
      lod: false,
      total: 0,
      listQuery: {
        page: 1,
        rows: 10,
        startTime: '',
        endTime: '',
        condition: '',
        orderType: '',
        descSort: null,
        description: false
      },
      roleList: [],
      addRoleDialog: false,
      editRoleDialog: false,
      qxDialog: false,
      roleForm: {},
      rolelist: [],
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'change' }
        ]
      },
      privList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      priCheckData: [],
      roleId: '',
      arr: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取角色列表
    async getList() {
      const getResul = await getRoleList(this.listQuery)
      console.log(getResul)
      this.roleList = getResul.data.records
      this.total = getResul.data.total
      this.lod = false
    },
    // 添加角色
    addUser() {
      if (this.$refs['roleForm'] !== undefined) {
        this.$refs['roleForm'].resetFields()
      }
      this.addRoleDialog = true
    },
    // 保存角色信息
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('确认添加该角色吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              const formData = new FormData()
              formData.append('name', this.roleForm.name)
              addRole(formData)
                .then((res) => {
                  this.addRoleDialog = false
                  this.$message({
                    message: '操作成功！',
                    type: 'success'
                  })
                  this.getList()
                })
                .catch((error) => {
                  this.$message({
                    message: error,
                    type: 'error'
                  })
                })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    cancelSubmit() {
      this.addRoleDialog = false
    },
    // 时间格式转换
    dataFormat(row, column, cellValue) {
      return cellValue
        ? fecha.format(new Date(cellValue), 'yyyy-MM-dd HH:mm:ss')
        : ''
    },

    // 编辑
    handleEdit(row) {
      this.editRoleDialog = true
      this.$set(this.roleForm, 'name', row.name)
      this.$set(this.roleForm, 'id', row.id)
    },
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('确认修改吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              const formData = new FormData()
              formData.append('roleId', this.roleForm.id)
              formData.append('newName', this.roleForm.name)
              updateRole(formData)
                .then((res) => {
                  this.editRoleDialog = false
                  this.$message({
                    message: '操作成功！',
                    type: 'success'
                  })
                  this.getList()
                })
                .catch((error) => {
                  this.$message({
                    message: error,
                    type: 'error'
                  })
                })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消编辑
    cancelEditSubmit() {
      this.editRoleDialog = false
    },
    // 删除
    handleDelete(row) {
      this.$confirm('确认删除该角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteRole({ id: row.id })
            .then((res) => {
              if (res.success === true) {
                this.$message({
                  message: res.message,
                  type: 'success'
                })
              } else {
                this.$message({
                  message: res.message,
                  type: 'error'
                })
              }
              this.getList()
            })
            .catch((error) => {
              this.$message({
                message: error,
                type: 'error'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    async handleFilter() {
      this.lod = true
      this.getList()
    },
    // 权限
    handleQx(row) {
      this.priCheckData = []
      this.privList = []
      this.qxDialog = true
      this.roleId = row.id
      const param = { roleId: row.id }
      getPriList(param).then((res) => {
        this.privList = res.data
        this.priCheckData = []
        this.arr = []
        this.getTree(res.data)
        this.arr.forEach((i) => {
          if (i.ish) {
            this.priCheckData.push(i.code)
          }
        })
      })
    },
    // 已有权限默认选中
    getTree(tree) {
      tree.forEach((i) => {
        if (i.children.length == 0) {
          this.arr.push({ code: i.code, ish: i.check })
        }
      })
      if (tree.length !== 0) {
        tree.forEach((item) => {
          if (item.children.length !== 0) {
            this.getTree(item.children)
          }
        })
      }
    },
    cancelPrvSubmit() {
      this.qxDialog = false
    },
    submitPrvForm() {
      const array = this.$refs.tree
        .getCheckedKeys()
        .concat(this.$refs.tree.getHalfCheckedKeys())
      this.$confirm('确认保存权限吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const formData = new FormData()
          formData.append('roleId', this.roleId)
          formData.append('codeList', array)
          updatePriv(formData)
            .then((res) => {
              this.qxDialog = false
              this.$message({
                message: '操作成功！',
                type: 'success'
              })
              this.getList()
            })
            .catch((error) => {
              this.$message({
                message: error,
                type: 'error'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    }
  }
}
</script>

