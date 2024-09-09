// nodes/timerScheduler/timerScheduler.js

const utils = require('../../lib/utils');

module.exports = function(RED) {
  // 定义定时任务调度节点
  function TimerSchedulerNode(config) {
    // 创建Node-RED节点实例
    RED.nodes.createNode(this, config);
    this.name = config.name; // 设置节点名称
    this.timers = {}; // 存储所有活动定时器的对象

    // 初始化函数
    initialize.call(this);

    // 当节点接收到消息时触发
    this.on('input', handleInput.bind(this));

    // 当节点关闭时（例如，当流程停止时），清除所有定时器
    this.on('close', handleNodeClose.bind(this));
  }

  // 注册自定义节点类型
  RED.nodes.registerType("timerScheduler", TimerSchedulerNode);

  // 初始化函数
  function initialize() {
    // 设置初始状态
    this.status({ fill: "grey", shape: "dot", text: "Ready" });

    // 示例：从配置文件或数据库加载初始数据（暂未实现）
    // const initialData = loadInitialData();
    // this.initialData = initialData;

    // 示例：记录初始化日志
    this.log("TimerSchedulerNode initialized.");
  }

  // 处理输入消息
  function handleInput(msg, send, done) {
    // Node-RED v1.0+ 兼容性代码
    send = send || function() { this.send.apply(this, arguments); };

    try {
      // 检查消息负载是否为有效对象
      if (typeof msg.payload !== 'object' || msg.payload === null) {
        done(new Error("Payload is not a valid JSON object"));
        return;
      }

      const command = msg.payload.command;
      switch (command) {
        case 'start':
          startTimer.call(this, msg.payload, done);
          break;
        case 'stop':
          stopTimer.call(this, msg.payload, done);
          break;
        case 'update':
          updateTimer.call(this, msg.payload, done);
          break;
        default:
          done(new Error("Invalid command in payload"));
      }
    } catch (error) {
      done(error); // 处理捕获到的任何异常
    }
  }

  // 启动一个新的定时任务
  function startTimer(payload, done) {
    utils.validatePayload(payload, done);

    const timerName = payload.name;
    const intervalTime = payload.intervalTime;
    const messagePayload = payload.payload;

    if (!this.timers[timerName]) {
      // 创建新的定时器
      this.timers[timerName] = {
        interval: setInterval(() => {
          this.send({ payload: messagePayload }); // 使用this.send
        }, intervalTime * 1000),
        payload: messagePayload
      };
      this.status({ fill: "green", shape: "dot", text: `Timer '${timerName}' active` }); // 设置节点状态
      this.log(`Timer '${timerName}' started with interval ${intervalTime} seconds.`); // 记录日志
    } else {
      this.warn(`Timer '${timerName}' already exists. Use 'update' command to modify it.`);
    }

    done(); // 完成处理
  }

  // 停止一个现有的定时任务
  function stopTimer(payload, done) {
    utils.validatePayload(payload, done);

    const timerName = payload.name;

    if (this.timers[timerName]) {
      clearInterval(this.timers[timerName].interval); // 清除定时器
      delete this.timers[timerName]; // 从定时器列表中删除
      this.status({}); // 清空节点状态
      this.log(`Timer '${timerName}' stopped.`); // 记录日志
    } else {
      this.warn(`No timer found with name '${timerName}'.`); // 如果定时器不存在，发出警告
    }

    done(); // 完成处理
  }

  // 更新一个现有的定时任务的时间间隔
  function updateTimer(payload, done) {
    utils.validatePayload(payload, done);

    const timerName = payload.name;
    const newIntervalTime = payload.intervalTime;

    if (this.timers[timerName]) {
      clearInterval(this.timers[timerName].interval); // 清除旧的定时器

      this.timers[payload.name] = {
        interval: setInterval(() => {
          this.send({ payload: payload.payload }); // 使用this.send
        }, payload.intervalTime * 1000),
        payload: payload.payload
      };

      this.status({ fill: "green", shape: "dot", text: `Timer '${timerName}' active` }); // 设置节点状态
      this.log(`Timer '${timerName}' updated to ${newIntervalTime} seconds.`); // 记录日志
    } else {
      this.warn(`No timer found with name '${timerName}'.`); // 如果定时器不存在，发出警告
    }

    done(); // 完成处理
  }

  // 清除所有定时器
  function handleNodeClose() {
    Object.keys(this.timers).forEach(timerName => {
      clearInterval(this.timers[timerName].interval); // 清除每个定时器
    });
    this.timers = {}; // 清空定时器列表
  }
};
