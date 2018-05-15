"use strict";

var PunchInContract = function () {
    LocalContractStorage.defineProperties(this, {
        size: null,
        superuserAddress: null,
        transferLimit: null
    });
    LocalContractStorage.defineMapProperty(this, 'tasks');
    LocalContractStorage.defineMapProperty(this, 'validTasks');
    LocalContractStorage.defineMapProperty(this, 'deposit');
    LocalContractStorage.defineMapProperty(this, 'operation');
    LocalContractStorage.defineMapProperty(this, 'taskByOwner');
};

PunchInContract.prototype = {

    init: function () {
        this.size = 0;
        this.superuserAddress = Blockchain.transaction.from;
        this.transferLimit = 0.001;
    },

    _setOperation: function (hash, isCreate) {
        var opArray = this.operation.get(hash) || [];
        var info = {
            hash: Blockchain.transaction.hash,
            datetime: Date.now()
        };
        if (isCreate) {
            info.type = 0;
        } else {
            info.type = 1;
        }
        opArray.push(info);
        this.operation.put(hash, opArray);
    },

    _setTaskByOwner: function (hash) {
        var from = Blockchain.transaction.from,
            taskByOwner = this.taskByOwner.get(from) || [];
        taskByOwner.push(hash);
        this.taskByOwner.put(from, taskByOwner);
    },

    _getTaskState: function (hash, cycle) {
        /**
         * @param hash {string} task's hash
         * @param cycle {int} task's cycle
         * return state {int} 1: finished, 0: doing
         */
        var opArr = this.operation.get(hash),
            punchDays = opArr.length - 1,
            state = 0;
        if (cycle <= punchDays) {
            state = 1;
        }
        return state;
    },

    _getPunchState: function (hash, createTime) {
        /**
         * @param hash {string} task's hash
         * @param createTime {Date} task's create date
         * return state {int} 1: punched, 0: should punch, -1: failed
         */
        var opArr = this.operation.get(hash),
            punchDays = opArr.length - 1,
            now = new Date(),
            startDate = new Date(createTime),
            DAYMS = 86400000;
        var start = [startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate()].join('-'),
            end = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-');
        var delta = (new Date(end) - new Date(start)) / DAYMS;
        if (delta < punchDays) {
            return 1;
        } else if (delta === punchDays) {
            return 0;
        } else {
            return -1;
        }
    },

    _setValidTasks: function (hash, deposit) {
        var from = Blockchain.transaction.from,
            validTask = this.validTasks.get(from) || [],
            newValidTask = [hash],
            amount = new BigNumber(0),
            reward = new BigNumber(0);
        for (var i = 0; i < validTask.length; i++) {
            var key = validTask[i],
                task = this.tasks.get(key),
                state = this._getPunchState(key, task.datetime);
            if (state !== -1) {
                var taskState = this._getTaskState(task.hash, task.cycle);
                if (!!taskState) {
                    reward = reward.plus(task.deposit);
                } else {
                    newValidTask.push(key);
                }
            } else {
                amount = amount.plus(task.deposit);
            }
        }
        if (!deposit) {
            deposit = this.deposit.get(from);
            if (!deposit) {
                deposit = {
                    balance: new BigNumber(0),
                    reward: new BigNumber(0)
                };
            }
        }
        var balance = deposit.balance instanceof BigNumber ? deposit.balance : new BigNumber(deposit.balance);
        deposit.reward = reward.plus(deposit.reward);
        deposit.balance = balance.minus(amount);
        this.deposit.put(from, deposit);
        this.validTasks.put(from, newValidTask);
    },

    _setDepositBalance: function (value, get) {
        var from = Blockchain.transaction.from,
            deposit = this.deposit.get(from);
        if (!deposit) {
            deposit = {
                balance: new BigNumber(0),
                reward: new BigNumber(0)
            };
        }
        var balance = new BigNumber(deposit.balance);
        deposit.balance = balance.plus(value);
        if (get) {
            return deposit;
        } else {
            this.deposit.put(from, deposit);
        }
    },

    getTransferLimit: function () {
        return this.transferLimit;
    },

    // create task
    create: function (info) {
        this.size++;
        if (info.cycle < 7) {
            throw new Error("Invalid Cycle");
        }
        var from = Blockchain.transaction.from,
            hash = Blockchain.transaction.hash,
            amount = Blockchain.transaction.value,
            task = {
                name: info.name,
                desc: info.desc,
                cycle: info.cycle,
                deposit: amount,
                hash: hash,
                datetime: Date.now(),
                from: from
            };
        this.tasks.put(hash, task);
        var deposit = this._setDepositBalance(amount, true);
        this._setValidTasks(hash, deposit);
        this._setTaskByOwner(hash);
        this._setOperation(hash, true);
        Event.Trigger('createTask', {
            hash: hash,
            amount: amount
        });
    },

    // punch in
    punch: function (hash) {
        var from = Blockchain.transaction.from,
            task = this.tasks.get(hash);
        if (!task) {
            throw new Error("Invalid Hash");
        }
        if (from !== task.from) {
            throw new Error("Permission Denied");
        }
        var state = this._getPunchState(hash, task.datetime);
        if (state === -1) {
            throw new Error("Task is Failed");
        } else if (state === 0) {
            this._setOperation(hash, false);
        } else {
            throw new Error("Already Punched In");
        }
        Event.Trigger('punchIn', {
            hash: hash,
            datetime: Date.now()
        });
    },

    // get owner's tasks
    getTasksByOwner: function (page, limit) {
        if (!page) {
            page = 1;
        }
        if (!limit) {
            limit = 10;
        }
        var from = Blockchain.transaction.from,
            tasks = this.taskByOwner.get(from) || [],
            allTasks = [],
            len = tasks.length,
            maxPage = Math.ceil(len / limit),
            start = (page - 1) * limit,
            end = page * limit;
        if (maxPage < page) {
            throw new Error("No More Data");
        }
        if (end > len) {
            end = len;
        }
        for (var i = start; i < end; i++) {
            var tmpTask = this.tasks.get(tasks[i]),
                hash = tmpTask.hash,
                opArray = this.operation.get(hash),
                days = opArray.length - 1,
                punchState = this._getPunchState(hash, tmpTask.datetime),
                state = punchState;
            if (punchState !== -1) {
                state = this._getTaskState(hash, tmpTask.cycle);
            }
            tmpTask.days = days;
            tmpTask.state = state;
            allTasks.push(tmpTask);
        }
        return {
            tasks: allTasks,
            total: len,
            limit: limit,
            page: page
        };
    },

    // get valid tasks
    getValidTasks: function () {
        var from = Blockchain.transaction.from,
            validTask = this.validTasks.get(from) || [],
            tasks = [];
        for (var i = 0; i < validTask.length; i++) {
            var task = this.tasks.get(validTask[i]);
            task.state = this._getPunchState(task.hash, task.datetime);
            tasks.push(task);
        }
        return tasks;
    },

    // get task by hash
    getTaskByHash: function (hash) {
        return this.tasks.get(hash);
    },

    // get punch in detail by hash
    getPunchDetail: function (hash) {
        return this.operation.get(hash);
    },

    getBalance: function () {
        var from = Blockchain.transaction.from,
            deposit = this.deposit.get(from);
        if (!deposit) {
            deposit = {
                balance: new BigNumber(0),
                reward: new BigNumber(0)
            }
        } else {
            var validTasks = this.getValidTasks(),
                amount = new BigNumber(0),
                reward = new BigNumber(0);
            for (var i = 0; i < validTasks.length; i++) {
                var task = validTasks[i],
                    hash = task.hash,
                    state = this._getPunchState(hash, task.datetime);
                if (state !== -1) {
                    var taskState = this._getTaskState(hash, task.cycle);
                    if (!!taskState) {
                        reward = reward.plus(task.deposit);
                    }
                } else {
                    amount = amount.plus(task.deposit);
                }
            }
            var balance = deposit.balance instanceof BigNumber ? deposit.balance : new BigNumber(deposit.balance);
            deposit.reward = reward.plus(deposit.reward);
            deposit.balance = balance.minus(amount);
        }
        return deposit;
    },

    transfer: function (value) {
        var from = Blockchain.transaction.from,
            amount = new BigNumber(value);
        if (from === this.superuserAddress) {
            Blockchain.transfer(this.superuserAddress, amount);
        } else {
            var deposit = this.getBalance(),
                balance = deposit.balance,
                reward = deposit.reward;
            if (amount.lte(reward) && amount.gt(this.transferLimit)) {
                Blockchain.transfer(from, amount);
                deposit.balance = balance.minus(amount);
                deposit.reward = reward.minus(amount);
                this.petRewards.put(from, deposit);
                return deposit;
            } else {
                throw new Error("Insufficient Balance");
            }
        }
    },

    setSuperuserAddress: function(address) {
        if (Blockchain.transaction.from === this.superuserAddress) {
            this.superuserAddress = address;
        } else {
            throw new Error("Permission Denied");
        }
    },

    setTransferLimit: function (value) {
        if (Blockchain.transaction.from === this.superuserAddress) {
            this.transferLimit = new BigNumber(value);
        } else {
            throw new Error("Permission Denied");
        }
    },
};

module.exports = PunchInContract;
