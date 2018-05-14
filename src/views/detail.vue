<style scoped>
    .index {
        width: 100%;
    }
    .task-info {
        font-size: 16px;
    }
    .task-info p {
        padding: 8px 0;
    }
</style>
<template>
    <div class="index">
        <div v-if="'hash' in $route.params && task">
            <Row type="flex" justify="center" align="middle" class="mb32">
                <Col span="12">
                    <Row type="flex" align="middle" class="task-info mb32">
                        <Col span="3">
                            <p>打卡目标：</p>
                        </Col>
                        <Col span="21">
                            <p>{{ task.name }}</p>
                        </Col>
                        <Col span="3">
                            <p>打卡描述：</p>
                        </Col>
                        <Col span="21">
                            <p>{{ task.desc }}</p>
                        </Col>
                        <Col span="3">
                            <p>打卡时长：</p>
                        </Col>
                        <Col span="21">
                            <p>{{ task.cycle }}天</p>
                        </Col>
                        <Col span="3">
                            <p>激励金额：</p>
                        </Col>
                        <Col span="21">
                            <p>{{ task.deposit }} Wei</p>
                        </Col>
                        <Col span="3">
                            <p>创建时间：</p>
                        </Col>
                        <Col span="21">
                            <p>{{ task.datetime | dateFmt }}</p>
                        </Col>
                        <Col span="3">
                            <p>唯一ID：</p>
                        </Col>
                        <Col span="21">
                            <p>{{ task.hash }}</p>
                        </Col>
                    </Row>
                    <Table stripe :columns="punchCol" :data="punchList"></Table>
                </Col>
            </Row>
        </div>
        <Row type="flex" justify="center" align="middle" v-else>
            <Col span="12">
            <div style="text-align: center">
                <h1><img :src="require('../map.png')" alt=""></h1>
                <h2 class="mb32">没有找到相关内容，重新查找试试吧</h2>
                <Input v-model="taskHash" placeholder="请输入要查找的打卡目标唯一 ID...">
                    <Button slot="append" icon="ios-search" @click.native="handleSearchClick"></Button>
                </Input>
            </div>
            </Col>
        </Row>
        <Spin size="large" fix v-if="loading"></Spin>
    </div>
</template>
<script>
    import util from '../libs/util';
    import NebPay from '../libs/nebpay';
    import {Account, Neb, HttpRequest} from 'nebulas';

    let neb = new Neb();
    neb.setRequest(new HttpRequest(util.ChainHost));

    let nebApi = neb.api;
    let nebPay = new NebPay();

    export default {
        data() {
            return {
                taskHash: '',
                task: {
                    name: '',
                    desc: '',
                    cycle: '',
                    deposit: '',
                    hash: '',
                    datetime: '',
                    from: ''
                },
                punchCol: [
                    {
                        title: 'ID',
                        key: 'hash'
                    },
                    {
                        title: '操作时间',
                        key: 'datetime',
                        width: 200,
                        render: (h, params) => {
                            return h('div', util.dateFmt(params.row.datetime));
                        }
                    },
                    {
                        title: '操作类型',
                        key: 'type',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', this.punchType[params.row.type]);
                        }
                    }
                ],
                punchList: [],
                punchType: {
                    '0': '创建',
                    '1': '打卡'
                },
                loading: true
            }
        },
        filters: {
            dateFmt: function (dateString) {
                if (dateString) {
                    return util.dateFmt(dateString);
                } else {
                    return '未知';
                }
            }
        },
        watch: {
            '$route': function () {
                this.loading = true;
                this.startApp();
            }
        },
        created() {
            this.startApp();
        },
        methods: {
            startApp() {
                nebApi.getNebState().then((state) => {
                    this.getTaskByHash(state);
                    this.getPunchDetail(state);
                });
            },
            getTaskByHash(state) {
                const hash = this.$route.params.hash;
                let self = this,
                    to = util.getContractAddress(),
                    args = util.toSting([hash]);
                nebApi.call({
                    chainID: state.chain_id,
                    from: to,
                    to: to,
                    value: 0,
                    gasPrice: 1000000,
                    gasLimit: 2000000,
                    contract: {
                        function: 'getTaskByHash',
                        args: args
                    }
                }).then(function (resp) {
                    self.task = util.parse(resp.result);
                });
            },
            getPunchDetail(state) {
                const hash = this.$route.params.hash;
                let self = this,
                    to = util.getContractAddress(),
                    args = util.toSting([hash]);
                nebApi.call({
                    chainID: state.chain_id,
                    from: to,
                    to: to,
                    value: 0,
                    gasPrice: 1000000,
                    gasLimit: 2000000,
                    contract: {
                        function: 'getPunchDetail',
                        args: args
                    }
                }).then(function (resp) {
                    self.punchList = util.parse(resp.result) || [];
                    self.loading = false;
                });
            },
            handleSearchClick() {
                this.loading = true;
                this.$router.push(`/detail/${this.taskHash}`);
            }
        }
    };
</script>