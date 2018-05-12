"use strict";

var PunchInContract = function () {
    LocalContractStorage.defineProperties(this, {
        size: null,
        superuserAddress: null,
        transferLimit: null,
    });
    LocalContractStorage.defineMapProperty(this, 'tasks');
    LocalContractStorage.defineMapProperty(this, 'deposit');
    LocalContractStorage.defineMapProperty(this, 'operation');
};

PunchInContract.prototype = {

    init: function () {
        this.size = 0;
        this.superuserAddress = Blockchain.transaction.from;
        this.transferLimit = 0.001;
    },

    _setOperation: function (id, isCreate) {
        var opArray = this.operation.get(id) || [];
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
        this.operation.put(id, opArray)
    },

    // 创建打卡
    create: function (info) {
        this.size++;
        var from = Blockchain.transaction.from,
            task = {},
            tasks = this.tasks.get(from) || [];
        tasks.push(task);
        this.tasks.put(from, tasks);
    },

    // 打卡
    punch: function (id) {

    },

    transfer: function (value) {
        var from = Blockchain.transaction.from;
        var amount = new BigNumber(value);
        if (from === this.superuserAddress) {
            Blockchain.transfer(this.superuserAddress, amount);
        } else {
            var deposit = this.deposit.get(from);
            var balance = deposit ? new BigNumber(deposit.balance) : new BigNumber(0);
            if (deposit && amount.lte(balance) && amount.gt(this.transferLimit)) {
                Blockchain.transfer(from, amount);
                deposit.balance = balance.minus(amount);
                this.petRewards.put(from, reward);
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
