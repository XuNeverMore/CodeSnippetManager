# 启动单机 MongoDB 实例
mongod --dbpath /data/db --port 27017

# 常用参数
--dbpath    # 指定数据存储目录
--port      # 指定监听端口(默认27017)
--fork      # 以守护进程方式运行
--logpath   # 指定日志文件路径
--bind_ip   # 指定绑定IP(默认localhost)