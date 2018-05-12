<style scoped>
    .index {
        width: 100%;
    }
    .pet-mb-32 {
        margin-bottom: 32px;
    }
    .pet-mb-160 {
        margin-bottom: 160px;
    }
</style>
<template>
    <div class="index">
        <Row type="flex" justify="center" align="middle" class="pet-mb-160" v-if="!created">
            <Col span="12">
            <Form ref="punchInfo" :model="punchInfo" :rules="ruleValidate" :label-width="80">
                <FormItem label="打卡名称" prop="name">
                    <Input v-model="punchInfo.name" placeholder="请输入打卡项目的名称"></Input>
                </FormItem>
                <FormItem label="打卡描述" prop="desc">
                    <Input v-model="punchInfo.desc" placeholder="请输入打卡项目的描述"></Input>
                </FormItem>
                <FormItem label="打卡时长" prop="cycle">
                    <Input v-model="punchInfo.cycle"></Input>
                </FormItem>
                <FormItem label="激励金额">
                    <Input v-model="punchInfo.deposit" placeholder="请输入激励金额"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleConfirmClick">确定</Button>
                </FormItem>
            </Form>
            </Col>
            <Spin size="large" fix v-if="loading"></Spin>
        </Row>
        <Row type="flex" justify="center" align="middle" class="pet-mb-160" v-if="created">
            <Col span="12">
            <div style="text-align: center">
                <h1><img :src="require('../plane.png')" alt=""></h1>
                <h2 class="pet-mb-32">新的打卡项目「{{ punchInfo.name }}」已经创建，你可以在「我的打卡」中查看</h2>
                <p class="pet-mb-32">* 数据写入需要一点时间，如果不能马上看到新创建的打卡内容，可以稍候再刷新查看</p>
                <router-link to="/">
                    <Button type="primary" size="large">我的打卡</Button>
                </router-link>
            </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    import util from '../libs/util';
    import NebPay from '../libs/nebpay';
    import BigNumber from 'bignumber.js';
    import {Account} from 'nebulas';

    var nebPay = new NebPay();

    export default {
        data() {
            return {
                account: null,
                created: false,
                punchInfo: {
                    name: '',
                    desc: '',
                    cycle: '',
                    deposit: ''
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '请输入打卡项目的名称', trigger: 'blur' }
                    ],
                    desc: [
                        { required: true, message: '请输入打卡项目的描述', trigger: 'blur' }
                    ],
                    cycle: [
                        { required: true, message: '请选择一个打卡周期', trigger: 'change' }
                    ]
                },
                loading: false,
                interval: null,
                exCount: 0
            }
        },
        created() {
            this.interval = setInterval(() => {
                if (this.exCount > 5) {
                    clearInterval(this.interval);
                    this.showError();
                }
                this.exCount++;
                this.initAccount();
            }, 1000);
        },
        methods: {
            initAccount() {
                const address = localStorage.getItem('nasAddress');
                if (address) {
                    clearInterval(this.interval);
                    this.account = Account.fromAddress(address);
                }
            },
            handleConfirmClick() {
                this.$refs['punchInfo'].validate((valid) => {
                    if (valid) {
                        if (this.account) {
                            this.loading = true;
                            let info = {
                                name: this.punchInfo.name,
                                desc: this.punchInfo.desc,
                                cycle: this.punchInfo.cycle,
                                createDate: +new Date()
                            };
                            this.handleCreate(info, this.punchInfo.deposit);
                        } else {
                            this.$Modal.warning();
                        }
                    } else {
                        this.$Message.error('请将信息填写完整');
                    }
                });
            },
            handleCreate(info, value) {
                let to = util.getContractAddress(),
                    args = util.toSting([info]),
                    amount = value ? new BigNumber(value) : '0';
                nebPay.call(to, amount, 'create', args, {
                    listener: (data) => {
                        if (typeof data === 'object') {
                            // todo
                        } else {
                            this.$Modal.error({
                                title: '创建失败',
                                content: '交易被取消，打卡创建失败'
                            });
                        }
                        this.created = true;
                        this.loading = false;
                    }
                });
            }
        }
    };
</script>