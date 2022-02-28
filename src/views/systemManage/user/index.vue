<template>
  <div class="app-container">
    <div class="filter-container" style="padding-left: 0">
      <el-input
        v-model="listQuery.name"
        placeholder="名称"
        style="width: 15%"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-button class="filter-item" type="primary" @click="handleFilter">
        查询
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        :disabled="ish"
        @click="addUser"
      >
        添加
      </el-button>
    </div>
    <el-table
      :data="userList"
      :header-cell-style="{ background: '#eef1f6' }"
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="序号" type="index" width="100" align="center">
        <template slot-scope="scope">
          <span>{{
            (listQuery.page - 1) * listQuery.rows + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" prop="name" align="center" />
      <el-table-column label="登陆账号" prop="login" align="center" />
      <el-table-column label="角色" prop="roleName" align="center" />
      <el-table-column
        label="最后登录时间"
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
          <el-button size="mini" type="text" @click="handleEdit(row)"
            >编辑</el-button
          >

          <el-button size="mini" type="text" @click="handleResetPwd(row)"
            >重置密码</el-button
          >

          <el-button size="mini" type="text" @click="handleDelete(row)"
            >删除</el-button
          >
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
      title="添加用户"
      :visible.sync="addUserDialog"
      center
      width="30%"
    >
      <el-form
        ref="userFormdata"
        :model="userForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名称" prop="name">
          <el-input v-model="userForm.name" />
        </el-form-item>
        <el-form-item label="登录账号" prop="login">
          <el-input v-model="userForm.login" />
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select
            v-model="userForm.roleId"
            placeholder="所属角色"
            @change="showAreaList"
          >
            <el-option
              v-for="item in rolelist"
              :key="item.value"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="roleName === '区域负责人'"
          label="大区"
          prop="areaCode"
        >
          <el-select v-model="userForm.areaCode" placeholder="所属大区">
            <el-option
              v-for="item in areaList"
              :key="item.areaCode"
              :value="item.areaCode"
              :label="item.areaName"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="设置密码" prop="password">
          <el-input v-model="userForm.password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="passwordCheck">
          <el-input v-model="userForm.passwordCheck" show-password />
        </el-form-item>

        <el-form-item>
          <el-button @click="cancelSubmit">取消</el-button>
          <el-button type="primary" @click="submitForm('userForm')"
            >确认</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editUserDialog"
      center
      width="30%"
    >
      <el-form
        ref="userForm"
        :model="userForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名称" prop="name">
          <el-input v-model="userForm.name" />
        </el-form-item>
        <el-form-item label="登录名称" prop="login">
          <el-input v-model="userForm.login" />
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select
            v-model="userForm.roleId"
            placeholder="所属角色"
            @change="showAreaList"
          >
            <el-option
              v-for="item in rolelist"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="roleName === '区域负责人'"
          label="大区"
          prop="areaCode"
        >
          <el-select v-model="userForm.areaCode" placeholder="所属大区">
            <el-option
              v-for="item in areaList"
              :key="item.areaCode"
              :value="item.areaCode"
              :label="item.areaName"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelEditSubmit">取消</el-button>
          <el-button type="primary" @click="submitEditForm('userForm')"
            >确认</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--重置密码-->
    <el-dialog
      title="重置密码"
      :visible.sync="resetPwdDialog"
      center
      width="30%"
    >
      <el-form
        ref="resetForm"
        :model="resetForm"
        :rules="resetRules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="新密码" prop="password">
          <el-input v-model="resetForm.password" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="passwordCheck">
          <el-input
            v-model="resetForm.passwordCheck"
            placeholder="请再次输入密码"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelResetSubmit">取消</el-button>
          <el-button type="primary" @click="submitResetForm('resetForm')"
            >确认</el-button
          >
        </el-form-item>
      </el-form>
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
  getUserList,
  getRoleList,
  getAreaParent,
  updatePwdAdmin,
  addUser,
  editUser,
  deleteUser,
} from "@/api/user";
import Pagination from "@/components/Pagination";
import * as fecha from "element-ui/lib/utils/date";
export default {
  components: { Pagination },
  data() {
    return {
      lod: false,
      total: 0,
      ish: true,
      listQuery: {
        page: 1,
        rows: 10,
        startTime: "",
        endTime: "",
        condition: "",
        orderType: "",
        descSort: null,
        description: false,
      },
      userList: [],
      addUserDialog: false,
      editUserDialog: false,
      resetPwdDialog: false,
      showArea: false,
      userForm: {},
      rolelist: [],
      areaList: [],
      rules: {
        name: [
          { required: true, message: "请输入用户名称", trigger: "change" },
          {
            max: 20,
            message: "长度最多20 个字符",
            trigger: "blur",
          },
        ],
        login: [
          { required: true, message: "请输入登录名称", trigger: "change" },
          {
            min: 4,
            max: 10,
            message: "长度在 4到 10 个字符",
            trigger: "blur",
          },
        ],
        roleId: [{ required: true, message: "请选择角色", trigger: "change" }],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
          {
            min: 6,
            max: 20,
            message: "长度在 6到 20 个字符",
            trigger: "blur",
          },
        ],
        passwordCheck: [
          { required: true, message: "请输入确认密码", trigger: "change" },
          {
            min: 6,
            max: 20,
            message: "长度在 6到 20 个字符",
            trigger: "blur",
          },
        ],
      },
      resetRules: {
        password: [
          { required: true, message: "请输入新密码", trigger: "change" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
        passwordCheck: [
          { required: true, message: "请再次输入新密码", trigger: "change" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
      roleName: "",
      resetForm: {
        password: "",
        passwordCheck: "",
      },
    };
  },
  created() {
    this.getList();
    this.getRoleList();
  },
  methods: {
    // 获取用户列表
    async getList() {
      const getResul = await getUserList(this.listQuery);
      console.log(getResul);
      this.lod = false;
      this.userList = getResul.data.records;
      this.total = getResul.data.total;
    },
    getRoleList(roleId) {
      getRoleList().then((res) => {
        this.rolelist = res.data.records;
        this.ish = false;
        if (roleId !== undefined) {
          let obj = {};
          obj = this.rolelist.find((item) => item.id === roleId);
          if (obj.name === "区域负责人") {
            this.roleName = "区域负责人";
            getAreaParent().then((res) => {
              this.areaList = res.data.records;
            });
          } else {
            this.roleName = "";
          }
        }
      });
    },
    async handleFilter() {
      this.lod = true;
      this.getList();
    },
    // 添加用户
    addUser() {
      if (this.$refs["userFormdata"] !== undefined) {
        this.$refs["userFormdata"].resetFields();
      }
      this.userForm = {};
      this.addUserDialog = true;
      this.getRoleList();
    },
    // 保存用户信息
    submitForm(formName) {
      if (this.userForm.areaCode === "undefined") {
        this.userForm.areaCode = null;
      }
      this.$refs["userFormdata"].validate((valid) => {
        if (valid) {
          if (this.userForm.password !== this.userForm.passwordCheck) {
            this.$message({
              message: "两次密码输入不一致！",
              type: "warning",
            });
            return false;
          }
          this.$confirm("确认添加该用户吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              const formData = new FormData();
              formData.append("name", this.userForm.name);
              formData.append("login", this.userForm.login);
              formData.append("roleId", this.userForm.roleId);
              formData.append("password", this.userForm.password);
              formData.append("passwordCheck", this.userForm.passwordCheck);
              // eslint-disable-next-line eqeqeq
              formData.append(
                "areaCode",
                this.userForm.areaCode == "undefined"
                  ? null
                  : this.userForm.areaCode
              );
              addUser(this.userForm)
                .then((res) => {
                  this.addUserDialog = false;
                  this.$message({
                    message: "操作成功！",
                    type: "success",
                  });
                  this.getList();
                })
                .catch((error) => {
                  this.$message({
                    message: error,
                    type: "error",
                  });
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消",
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cancelSubmit() {
      this.addUserDialog = false;
    },
    // 时间格式转换
    dataFormat(row, column, cellValue) {
      return cellValue
        ? fecha.format(new Date(cellValue), "yyyy-MM-dd HH:mm:ss")
        : "";
    },
    // 显示大区控制
    showAreaList(value) {
      let obj = {};
      obj = this.rolelist.find((item) => item.id === value);
      if (obj.name === "区域负责人") {
        this.roleName = "区域负责人";
        getAreaParent().then((res) => {
          this.areaList = res.data;
        });
      } else {
        this.roleName = "";
      }
    },
    // 编辑
    handleEdit(row) {
      this.editUserDialog = true;
      this.getRoleList(row.roleId);
      this.$set(this.userForm, "id", row.id);
      this.$set(this.userForm, "name", row.name);
      this.$set(this.userForm, "login", row.login);
      this.$set(this.userForm, "roleId", row.roleId);
      this.$set(this.userForm, "areaCode", row.areaCode);
    },
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("确认修改吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              const formData = new FormData();
              formData.append("id", this.userForm.id);
              formData.append("name", this.userForm.name);
              formData.append("login", this.userForm.login);
              formData.append("roleId", this.userForm.roleId);
              editUser(this.userForm)
                .then((res) => {
                  console.log("res>>>>", res);
                  this.editUserDialog = false;
                  this.$message({
                    message: "操作成功！",
                    type: "success",
                  });
                  this.getList();
                })
                .catch((error) => {
                  this.$message({
                    message: error,
                    type: "error",
                  });
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消",
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 取消编辑
    cancelEditSubmit() {
      this.editUserDialog = false;
    },
    // 重置密码
    handleResetPwd(row) {
      if (this.$refs["resetForm"] !== undefined) {
        this.$refs["resetForm"].resetFields();
      }
      this.resetForm = {};
      this.resetPwdDialog = true;
      this.resetForm.userId = row.id;
    },
    // 重置密码取消
    cancelResetSubmit() {
      this.resetPwdDialog = false;
    },
    // 重置密码提交
    submitResetForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.resetForm.password !== this.resetForm.passwordCheck) {
            this.$message({
              message: "两次密码输入不一致！",
              type: "warning",
            });
            return false;
          }
          this.$confirm("确认修改密码吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              const formData = new FormData();
              formData.append("userId", this.resetForm.userId);
              formData.append("newPassword", this.resetForm.password);
              formData.append("newPasswordCheck", this.resetForm.passwordCheck);
              let from = {
                userId: this.resetForm.userId,
                newPassword: this.resetForm.password,
                newPasswordCheck: this.resetForm.passwordCheck,
              };
              updatePwdAdmin(from)
                .then((res) => {
                  this.resetPwdDialog = false;
                  this.$message({
                    message: "操作成功！",
                    type: "success",
                  });
                  this.getList();
                })
                .catch((error) => {
                  this.$message({
                    message: error,
                    type: "error",
                  });
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消",
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除
    handleDelete(row) {
      this.$confirm("确认删除该用户吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteUser({ id: row.id })
            .then((res) => {
              this.$message({
                message: "操作成功！",
                type: "success",
              });
              this.getList();
            })
            .catch((error) => {
              this.$message({
                message: error,
                type: "error",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
  },
};
</script>
