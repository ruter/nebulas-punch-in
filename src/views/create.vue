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
                <FormItem label="打卡目标" prop="name">
                    <Input v-model="punchInfo.name" placeholder="请输入打卡目标"></Input>
                </FormItem>
                <FormItem label="打卡描述" prop="desc">
                    <Input v-model="punchInfo.desc" placeholder="请输入打卡目标的描述"></Input>
                </FormItem>
                <FormItem label="打卡时长" prop="cycle">
                    <RadioGroup v-model="punchInfo.cycle">
                        <Radio label="7">
                            <span>7天</span>
                        </Radio>
                        <Radio label="15">
                            <span>15天</span>
                        </Radio>
                        <Radio label="30">
                            <span>30天</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="激励金额">
                    <Input v-model="punchInfo.deposit" placeholder="请输入激励金额"></Input>
                    <p>* 激励金是用于激励用户完成打卡的机制，在完成指定打卡时长后将全额返还你存入星云打卡中的激励金，为鼓励你养成打卡习惯，提取激励金将免除手续费</p>
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
                <h3 class="pet-mb-32">坚持每天打卡完成目标，养成良好的习惯，成功一定会离你越来越近的~</h3>
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

    let nebPay = new NebPay();

    export default {
        data() {
            return {
                address: '',
                created: false,
                punchInfo: {
                    name: '',
                    desc: '',
                    cycle: '7',
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
                loading: true,
                timeoutObj: null
            }
        },
        watch: {
            address() {
                this.startApp();
            }
        },
        created() {
            if (util.noWallet) {
                this.loading = false;
                this.showError();
            } else {
                this.timeoutObj = setTimeout(() => {
                    this.showWarning();
                }, 5000);
                util.getAccount(this);
            }
        },
        methods: {
            startApp() {
                clearTimeout(this.timeoutObj);
                this.loading = false;
            },
            showError() {
                this.$Modal.warning(util.PocketErr);
            },
            showWarning() {
                this.$Modal.warning(util.WalletWarning);
            },
            handleConfirmClick() {
                this.$refs['punchInfo'].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        let info = {
                            name: this.punchInfo.name,
                            desc: this.punchInfo.desc,
                            cycle: parseInt(this.punchInfo.cycle)
                        };
                        this.handleCreate(info, this.punchInfo.deposit);
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
                            this.created = true;
                            console.log(data)
                        } else {
                            this.$Modal.error({
                                title: '创建失败',
                                content: '交易被取消，打卡创建失败'
                            });
                        }
                        this.loading = false;
                    }
                });
            }
        }
    };
</script>