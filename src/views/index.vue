<style scoped>
    .index {
        width: 100%;
    }
    .card-task {
        width: 400px;
        height: 500px;
    }
    .card-header {
        height: 160px;
    }
    .card-body {
        padding: 16px 0;
    }
    .card-footer {
        position: absolute;
        width: 100%;
        margin: 8px auto;
        bottom: 8px;
        left: 0;
        right: 0;
    }
    .card-footer button {
        width: 80px !important;
        height: 80px !important;
        font-size: 24px !important;
    }
    .card-header h1 {
        line-height: 160px;
    }
    .ellip {
        text-overflow: ellipsis;
        /*display: -webkit-box;*/
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        height: 80px;
        overflow: hidden;
    }
    .task-create {
        width: 400px !important;
        height: 500px !important;
        border: 1px dashed #a6a6a6;
        font-size: 64px !important;
    }
</style>
<template>
    <div class="index">
        <Row type="flex" justify="center" align="middle">
            <Col span="12">
                <div class="mb32" style="text-align: center">
                    <Input v-model="taskHash" placeholder="请输入要查找的打卡目标唯一 ID...">
                        <Button slot="append" icon="ios-search" @click.native="handleSearchClick"></Button>
                    </Input>
                </div>
            </Col>
        </Row>
        <Row type="flex" justify="center" align="middle" class="mb32">
            <Col span="6" class="mr8" v-for="(task, idx) in tasks" :key="task.hash">
                <Card class="text-center card-task" style="cursor: pointer"
                      @click.native="handleTaskClick(task.hash)">
                    <div :class="`gradient-${idx} card-header`">
                        <h1>第 {{ task.datetime | dateDelta }} 天</h1>
                    </div>
                    <div class="card-body">
                        <h2>{{ task.name }}</h2>
                        <p class="ellip mt8">{{ task.desc }}</p>
                        <p class="mt8">{{ task.datetime | dateInterval(task.cycle) }}</p>
                        <p :class="`state${task.state}`">{{ state[task.state] }}</p>
                    </div>
                    <div class="card-footer">
                        <Button type="ghost" shape="circle" icon="checkmark-round"
                                size="large" @click.stop="handlePunchClick(idx)"></Button>
                    </div>
                </Card>
            </Col>
            <Col span="6" class="mr8" v-for="i in (3 - tasks.length)" :key="i">
                <router-link to="/create">
                    <Button type="ghost" icon="plus-circled"
                            class="task-create" size="large"></Button>
                </router-link>
            </Col>
        </Row>
        <Spin size="large" fix v-if="loading"></Spin>
    </div>
</template>
<script>
    import util from '../libs/util';
    import NebPay from '../libs/nebpay';
    import {Account} from 'nebulas';

    let nebPay = new NebPay();

    export default {
        data() {
            return {
                address: '',
                tasks: [],
                state: {
                    '-1': '未完成',
                    '0': '未打卡',
                    '1': '已打卡'
                },
                taskHash: '',
                loading: true,
                timeoutObj: null,
            }
        },
        filters: {
            dateInterval: function (dateString, cycle) {
                if (dateString) {
                    let date = typeof dateString !== 'object' ? new Date(dateString) : dateString;
                    let endDate =  new Date(date.getTime() + (cycle - 1) * 86400000);
                    const start = util.dateSep(date);
                    const end = util.dateSep(endDate);
                    return `${start.year}.${start.month}.${start.day} ~ ${end.year}.${end.month}.${end.day}`;
                } else {
                    return '未知时间';
                }
            },
            dateDelta: function (dateString) {
                if (dateString) {
                    return util.dateDelta(dateString);
                } else {
                    return '?';
                }
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
                    this.loading = false;
                    this.showWarning();
                }, 5000);
                util.getAccount(this);
            }
        },
        methods: {
            startApp() {
                clearTimeout(this.timeoutObj);
                this.getValidTasks();
            },
            showError() {
                this.$Modal.warning(util.PocketErr);
            },
            showWarning() {
                this.$Modal.warning(util.WalletWarning);
            },
            getValidTasks() {
                let to = util.getContractAddress();
                nebPay.simulateCall(to, '0', 'getValidTasks', "[]", {
                    listener: (data) => {
                        let tasks = util.parse(data.result);
                        this.tasks = tasks.filter((task) => {
                            return task.state !== -1 && (util.dateDelta(task.datetime) <= task.cycle);
                        });
                        this.loading = false;
                        console.log('>>>', tasks)
                    }
                });
            },
            handleTaskClick(hash) {
                this.loading = true;
                this.$router.push(`/detail/${hash}`);
            },
            handleSearchClick() {
                this.loading = true;
                this.$router.push(`/detail/${this.taskHash}`);
            },
            handlePunchClick(idx) {
                const task = this.tasks[idx];
                const hash = task.hash;
                if (task.state === 1) {
                    this.$Modal.info({
                        title: '已打卡',
                        content: '今日已打卡，无需重复操作'
                    });
                    return;
                }
                this.loading = true;
                let to = util.getContractAddress(),
                    args = util.toSting([hash]);
                nebPay.call(to, '0', 'punch', args, {
                    listener: (data) => {
                        task.state = 1;
                        this.tasks.splice(idx, 1, task);
                        if (typeof data === 'object') {
                            this.$Modal.success({
                                title: '打卡成功',
                                content: `今日目标「${task.name}」已完成，奖励一下自己吧`
                            });
                        } else {
                            this.$Modal.error({
                                title: '创建失败',
                                content: '交易被取消，打卡失败'
                            });
                        }
                        this.loading = false;
                    }
                });
            }
        }
    };
</script>