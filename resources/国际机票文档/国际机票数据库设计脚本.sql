/*GO
USE MASTER
IF DB_ID (N'INTERNATIONAL_FLIGHT') IS NOT NULL
BEGIN
--删除数据库
DECLARE   HCFOREACH   CURSOR   GLOBAL   FOR 
SELECT   'KILL   '+RTRIM(SPID)   
FROM   MASTER.DBO.SYSPROCESSES   
WHERE   DBID=DB_ID('INTERNATIONAL_FLIGHT')   
EXEC   SP_MSFOREACH_WORKER   '?' 
DROP DATABASE INTERNATIONAL_FLIGHT
END
GO
--创建数据库
CREATE DATABASE INTERNATIONAL_FLIGHT
GO


GO
USE INTERNATIONAL_FLIGHT
GO
--删除所有表
GO
DECLARE @SQL VARCHAR(8000)
WHILE (SELECT COUNT(*) FROM SYSOBJECTS WHERE TYPE='U')>0
BEGIN
SELECT @SQL='DROP TABLE ' + NAME
FROM SYSOBJECTS
WHERE (TYPE = 'U' AND NAME LIKE 'IAT%')
ORDER BY 'DROP TABLE ' + NAME
--EXEC(@SQL) 
PRINT @SQL
END
*/
GO

USE AOS2012

GO


IF OBJECT_ID('IAT_FLIGHT_ORDER') IS NOT NULL
	DROP TABLE IAT_FLIGHT_ORDER
--用户表和角色和权限表调用公共模块
CREATE TABLE IAT_FLIGHT_ORDER --机票订单表
  (
     ORDER_ID              UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--主键ID
     SUPLIER_POLICY_ID     UNIQUEIDENTIFIER NOT NULL,--政策ID
     SUPLIER_ID            INT NOT NULL,--供应商ID(对应于SUPLIER_POLICY --供应商政策表的SUPLIER_ID 冗余字段)
     PURCHASE_ID            INT NOT NULL,--采购商ID
     ORDER_NO              VARCHAR(20) NOT NULL UNIQUE,--订单号
     ORIGINAL_ORDER_NO     VARCHAR(20),--原来的订单号
     PNR                   CHAR(6),--订座记录编号
     ORDER_STATUS          INT NOT NULL,--订单状态 （预定审核中 (10) 、审核退回(11)、待支付(12)、出票中(13)、已出票(14)、取消预定(15)）
     UPDATE_STATUS_TIME    DATETIME NOT NULL DEFAULT(GETDATE()),--更新订单状态时间(可以用作审核通过时间，或者退回时间等,具体每步操作时间可以查询订单日志)
     ORDER_DATE            DATETIME NOT NULL DEFAULT(GETDATE()),--预定时间
     ORDER_REPLAY          NVARCHAR(50),--审核回复
     ORDER_REMARK          NVARCHAR(200),--订单备注 
     LOCKED                BIT NOT NULL DEFAULT(0),--是否被锁定
     LOCKED_OPERATOR       INT,--锁定者ID
     LOCKED_OPERATOR_NAME  NVARCHAR(10),--锁定者姓名
     LOCKED_TIME           DATETIME DEFAULT(GETDATE()),--锁定时间
     ORDER_PAYMENT_ID      UNIQUEIDENTIFIER,--订单支付ID
     --==========================费用明细=====================
     FREIGHT               MONEY NOT NULL DEFAULT(0),--运价
     AGENT_FEE_RATE        DECIMAL NOT NULL DEFAULT(0),--代理费率
     REWARD_RATE           DECIMAL NOT NULL DEFAULT(0),--奖励扣率
     REWARD_FEE            MONEY NOT NULL DEFAULT(0),--奖励金额
     TAX                   MONEY NOT NULL DEFAULT(0),--税费
     TRADING_FORMALITY_FEE MONEY NOT NULL DEFAULT(0),--交易手续费
     SETTLEMENT_PRICE      MONEY NOT NULL DEFAULT(0),--单张结算价
     OTHER_FEE             MONEY NOT NULL DEFAULT(0),--其他费用
     OTHER_FEE_DESC        NVARCHAR(20),--其他费用说明(比如婴儿票 100)
     FREIGHT_SOURCE        NVARCHAR(20),--运价来源
     OPEN_TICKET_FEE       MONEY NOT NULL DEFAULT(0),--供应商开票费
     TOTAL_PRICE           MONEY NOT NULL DEFAULT(0),--订单总价
     --==========================费用明细=====================
     REFUND_RULE           NVARCHAR(300)--退改签规则
  )

IF OBJECT_ID('IAT_ORDER_PAYMENT') IS NOT NULL
	DROP TABLE IAT_ORDER_PAYMENT

CREATE TABLE IAT_ORDER_PAYMENT --订单支付信息表
  (
     ORDER_PAYMENT_ID UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--主键ID
     ORDER_NO         VARCHAR(20) NOT NULL,--订单号
     ORDER_TICKET_ID  UNIQUEIDENTIFIER,--票号
     PAYMENT_TYPE     NVARCHAR(20) NOT NULL,--支付方式
     PAYMENT_AMOUNT   MONEY NOT NULL DEFAULT(0),--支付金额
     SERIAL_NUMBER    VARCHAR(50) NOT NULL,--支付流水号
     PAYMENT_ACCOUNT  VARCHAR(50) NOT NULL,--支付账号
     PROCEEDS_ACCOUNT VARCHAR(50) NOT NULL,--收款账号
     NET_BANK_CODE    VARCHAR(50) NOT NULL,--网银代码
     PAYMENT_TIME     DATETIME NOT NULL DEFAULT(GETDATE()),--支付时间
     PAYMENT_STATUS   INT NOT NULL DEFAULT(0) --支付状态(0:支付失败，1：支付成功  2：未知)
  )

IF OBJECT_ID('IAT_ORDER_MESSAGE') IS NOT NULL
	DROP TABLE IAT_ORDER_MESSAGE

CREATE TABLE IAT_ORDER_MESSAGE--订单留言表
  (
     ORDER_MESSAGE_ID UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--主键ID
     ORDER_NO         VARCHAR(20) NOT NULL,--订单号
     MESSAGE_LEVEL    INT NOT NULL DEFAULT(0),--消息紧急级别(0:普通 1:较急  2:紧急  3:特急)
     MESSAGE_TITLE    NVARCHAR(50) NOT NULL,--消息标题
     MESSAGE_CONTENT  NVARCHAR(200) NOT NULL,--消息内容
     LEAVE_WORD_TIME  DATETIME NOT NULL DEFAULT(GETDATE()),--留言时间
     OPERATOR_ID      INT NOT NULL,--操作员ID
     OPERATOR_NAME    INT NOT NULL,--操作员名称
     PARTNER_ID       INT NOT NULL,--合作方ID
     PARTNER_NAME     NVARCHAR(50) NOT NULL --合作方名称
  )

IF OBJECT_ID('IAT_ORDER_INSURANCE') IS NOT NULL
	DROP TABLE IAT_ORDER_INSURANCE

CREATE TABLE IAT_ORDER_INSURANCE --订单保险费表
  (
     ORDER_INSURANCE_ID UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--主键ID
     ORDER_NO           VARCHAR(20) NOT NULL,--订单号
     ORDER_PASSENGER_ID UNIQUEIDENTIFIER,--乘机人ID
     INS_UNIT_PRICE     MONEY NOT NULL DEFAULT(0),--保险单价
     INS_NUMBER         INT NOT NULL DEFAULT(0)--保险份数
  )
  
  
  IF OBJECT_ID('IAT_ORDER_LOG') IS NOT NULL
	DROP TABLE IAT_ORDER_LOG

--还要创建一个日志历史表
CREATE TABLE IAT_ORDER_LOG --订单日志表
  (
     ORDER_LOG_ID  UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--主键ID
     ORDER_NO      VARCHAR(20) NOT NULL,--订单号
     LOG_TYPE      VARCHAR(10) NOT NULL,--日志类型
     TITLE         NVARCHAR(50) NOT NULL,--标题
     CONTENT       NVARCHAR(200) NOT NULL,--内容
     OPERATE_TIME  DATETIME NOT NULL DEFAULT(GETDATE()),--操作时间
     OPERATOR_NAME NVARCHAR(10) NOT NULL,--操作者
     OPERATOR_ID   INT NOT NULL,--操作者ID
     PARTNER_NAME  NVARCHAR(50) NOT NULL,--合作方
     PARTNER_ID    INT NOT NULL --合作方ID
  )
  
  
    IF OBJECT_ID('IAT_FLIGHT_INFO') IS NOT NULL
	DROP TABLE IAT_FLIGHT_INFO

CREATE TABLE IAT_FLIGHT_INFO --订单航班信息表
  (
     FLIGHT_INFO_ID    UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--主键ID
     ORDER_NO          VARCHAR(20) NOT NULL,--订单号
     TAKEOFF_DATE      DATETIME NOT NULL,--起飞日期
     TAKEOFF_TIME      CHAR(4) NOT NULL,--起飞时间
     DEPARTURE_AIRPORT CHAR(3) NOT NULL,--出发机场三字码
     ARRIVE_AIRPORT    CHAR(3) NOT NULL,--到达机场三字码
     AIRLINE           VARCHAR(3) NOT NULL,--航空公司
     FLIGHTS           VARCHAR(4) NOT NULL,--航班号(最长4位)
     ARRIVE_DATE       DATETIME NOT NULL,--到达日期
     ARRIVE_TIME       CHAR(4) NOT NULL,--到达时间
     BERTH             VARCHAR(2) NOT NULL --舱位(最长2位)
  )

    IF OBJECT_ID('IAT_ORDER_TICKET') IS NOT NULL
	DROP TABLE IAT_ORDER_TICKET
	
CREATE TABLE IAT_ORDER_TICKET --订单票号表
  (
     ORDER_TICKET_ID     UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--主键ID,
     ORDER_NO            VARCHAR(20) NOT NULL,--订单号
     ORDER_PASSENGERS_ID UNIQUEIDENTIFIER,--乘机人ID
     TICKET_NO           VARCHAR(15),--票号
     TICKET_STATUS       INT NOT NULL DEFAULT(0),--票号状态
     FINANCIAL_REFUND_ID UNIQUEIDENTIFIER --财务退款ID
  )
  
     IF OBJECT_ID('IAT_ORDER_PASSENGER') IS NOT NULL
	DROP TABLE IAT_ORDER_PASSENGER

CREATE TABLE IAT_ORDER_PASSENGER --乘机人信息表
  (
     ORDER_PASSENGER_ID     UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--主键ID
     ORDER_NO               VARCHAR(20) NOT NULL,--订单号
     PASSENGER_EN_NAME      VARCHAR(50) NOT NULL,--乘客英文姓名
     PASSENGER_TYPE_ID      UNIQUEIDENTIFIER NOT NULL,--乘客类型(成人，儿童，婴儿 PASSENGER_TYPE表的主键ID）
     GENDER                 CHAR(1) NOT NULL,--乘客性别(男，女)
     DOCUMENT_TYPE_ID       UNIQUEIDENTIFIER NOT NULL,--证件类型ID
     IDENTIFICATION_NUMBERS VARCHAR(20) NOT NULL,--证件号码
     VALIDITY_PERIOD        DATETIME NOT NULL,--证件有效期
     BIRTHDATE              DATETIME NOT NULL,--出生日期
     NATIONALITY            VARCHAR(20) NOT NULL --国籍
  )


  IF OBJECT_ID('IAT_ORDER_CONTACT') IS NOT NULL
	DROP TABLE IAT_ORDER_CONTACT
CREATE TABLE IAT_ORDER_CONTACT --订单联系人表
  (
     ORDER_CONTACT_ID UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--主键ID
     ORDER_NO         VARCHAR(20) NOT NULL,--订单号
     CONTACT_NAME     NVARCHAR(20) NOT NULL,--联系人姓名
     MOBILE           VARCHAR(20) NOT NULL,--联系人手机
     ADDRESS          NVARCHAR(100) NOT NULL,--联系人地址
     TELEPHONE        VARCHAR(20),--联系人电话
     EMAIL            VARCHAR(50),--联系人EMAIL
     QQ               VARCHAR(13),--联系人QQ
     MSN              VARCHAR(50)--联系人MSN
  )


  IF OBJECT_ID('IAT_ORDER_ALTERATIONS') IS NOT NULL
	DROP TABLE IAT_ORDER_ALTERATIONS
CREATE TABLE IAT_ORDER_ALTERATIONS --订单改签表
  (
     ORDER_ALTERATIONS_ID UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--主键ID
     ORDER_TICKET_ID      UNIQUEIDENTIFIER NOT NULL,--改签票号
     PNR                  CHAR(6),--改签后PNR
     ORDER_NO             VARCHAR(20) NOT NULL,--订单号
     TAKEOFF_DATE         DATETIME NOT NULL,--航班日期
     TAKEOFF_AIRPORT      CHAR(3) NOT NULL,--起飞机场
     ARRIVE_AIRPORT       CHAR(3) NOT NULL,--到达机场
     AIRLINE              VARCHAR(3) NOT NULL,--航空公司
     FLIGHT               VARCHAR(4) NOT NULL,--航班号
     TAKEOFF_TIME         CHAR(4) NOT NULL,--起飞时间
     ARRIVE_TIME          CHAR(4) NOT NULL,--到达时间
     ARRIVE_DATE          DATETIME NOT NULL,--到达日期
     ALTERATIONS_INFO     NVARCHAR(200),--改签信息
     REPLENISH            MONEY DEFAULT(0),--改签补款
     REPLAY               NVARCHAR(50),--回复
     ALTERATION_REMARK    NVARCHAR(200),--改签备注
     ALTERATION_STATUS    INT NOT NULL,--改签状态(改签审核中(20)、审核退回(21)、改签中(22)、待支付(23)、已改签(24)、已取消(25)(取消不必退款的，直接完成。需要退款的在退款表中新加一条记录，状态为待退款))
     LOCKED               BIT NOT NULL DEFAULT(0),--是否被锁定
     LOCKED_OPERATOR      INT,--锁定者ID
     LOCKED_OPERATOR_NAME NVARCHAR(10),--锁定者姓名
     LOCKED_TIME          DATETIME DEFAULT(GETDATE()), --锁定时间
     CREATE_TIME		 DATETIME NOT NULL DEFAULT(GETDATE()) --生成时间
  )


  IF OBJECT_ID('IAT_ORDER_REFUND') IS NOT NULL
	DROP TABLE IAT_ORDER_REFUND
CREATE TABLE IAT_ORDER_REFUND--订单退票表
  (
     ORDER_REFUND_ID      UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--主键ID
     ORDER_NO             VARCHAR(20) NOT NULL,--订单号(作为冗余字段)
     ORDER_TICKET_ID      UNIQUEIDENTIFIER NOT NULL,--订单票号ID
     REFUND_TITLE         NVARCHAR(50) NOT NULL DEFAULT('退票'),--退票标题
     REFUND_REASON        NVARCHAR(200),--退票原因说明
     REFUND_TIME          DATETIME NOT NULL DEFAULT(GETDATE()),--申请退票时间
     REAL_AMOUNT          MONEY NOT NULL DEFAULT(0),--实付金额（应该等于订单表中对应订单号的单张结算价）
     DEDUCT_AMOUNT        MONEY NOT NULL DEFAULT(0),--扣款金额
     REFUND_AMOUNT AS REAL_AMOUNT - DEDUCT_AMOUNT,--实退金额
     REFUND_STATUS        INT NOT NULL DEFAULT(0),--退废票状态(退票审核中(30)、审核退回(31)、退票中(32)、已退票(33)(提交财务退款,需要退款的在退款表中新加一条记录，状态为待退款)、已取消(34) ,  废票审核中(40)、审核退回(41)、废票中(42)、取消废票(43)、废票完成(44))
     LOCKED               BIT NOT NULL DEFAULT(0),--是否被锁定
     LOCKED_OPERATOR      INT,--锁定者ID
     LOCKED_OPERATOR_NAME NVARCHAR(10),--锁定者姓名
     LOCKED_TIME          DATETIME DEFAULT(GETDATE()),--锁定时间
     IS_INVALIDATE        BIT NOT NULL DEFAULT(0),--是否废票
     REPLY                NVARCHAR(20),--回复
     RETURN_REASON        NVARCHAR(200)--退回原因
  )

/*.
一般一张订单只开一张发票，
如果一张订单里有多人的话，可以分开开的，
但总数不能超过总和，
也不能超过每人规定的平均和
对应于订单表是一对多的关系

比如一张3000的订单里有3个人，
这张发票航空公司规定每人有10%的浮动，
也就是如果每人一张发票，最高也只能1100，
共3张；或者总共一张3300；不可以一人开2300，
其余2人开1000....那样等于那一个是高开发票，违规了
*/

  IF OBJECT_ID('IAT_ORDER_INVOICE') IS NOT NULL
	DROP TABLE IAT_ORDER_INVOICE
CREATE TABLE IAT_ORDER_INVOICE --订单发票表
  (
     ORDER_INVOICE_ID    UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--主键ID
     ORDER_NO            VARCHAR(20) NOT NULL,--订单号
     INVOICE_AMOUNT      MONEY NOT NULL DEFAULT(0),--金额
     INVOICE_TITLE       NVARCHAR(50) NOT NULL,--抬头
     INVOICE_SEND_TYPE   NVARCHAR(10) NOT NULL,--发票派送方式(自取，到付)
     GET_INVOICE_ADDRESS NVARCHAR(100),--	自取地址
     CONTACT             NVARCHAR(10),--联系人
     CONTACT_PHONE       VARCHAR(20),-- 联系电话
     SEND_ADDRESS        NVARCHAR(100),--派送地址
     IS_INVALID          BIT DEFAULT(0),--是否作废(默认为0，表示有效)
     EXPRESS_NO          VARCHAR(25),--快递号
     INVOICE_STATUS      INT NOT NULL DEFAULT(0),--发票状态(0:待开，1：已开)
     INVOICE_NO          VARCHAR(25),--发票号
     OPEN_INVOICE_DATE   DATETIME DEFAULT(GETDATE())--开发票日期
  )


 IF OBJECT_ID('IAT_DOCUMENT_TYPE') IS NOT NULL
	DROP TABLE IAT_DOCUMENT_TYPE
CREATE TABLE IAT_DOCUMENT_TYPE --证件类型表
  (
     DOCUMENT_TYPE_ID          UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--主键ID
     DOCUMENT_TYPE_CODE        VARCHAR(20) UNIQUE,--证件类型编码
     DOCUMENT_TYPE_DESCRIPTION NVARCHAR(20) NOT NULL UNIQUE,-- 证件类型描述
     CREATER                   NVARCHAR(10) NOT NULL,--创建人
     CREATER_ID                INT NOT NULL,--创建人ID
     CREATE_TIME               DATETIME NOT NULL DEFAULT(GETDATE()) --创建时间
  )


 IF OBJECT_ID('IAT_PASSENGER_TYPE') IS NOT NULL
	DROP TABLE IAT_PASSENGER_TYPE
CREATE TABLE IAT_PASSENGER_TYPE --乘客类型表
  (
     PASSENGER_TYPE_ID UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--主键ID
     PASSENGER_CODE    VARCHAR(20) UNIQUE NOT NULL,--乘客类型编码(ADT,CHD,)
     [DESCRIPTION]     NVARCHAR(20) UNIQUE NOT NULL,--乘客类型描述（ 普通旅客、新移民、留学生、 劳务人员、  海员、外交官、儿童、婴儿)
     CREATER           NVARCHAR(10) NOT NULL,--创建人
     CREATER_ID        INT NOT NULL,--创建人ID
     CREATE_TIME       DATETIME NOT NULL DEFAULT(GETDATE()) --创建时间
  )

--表结构同政策表相同

 IF OBJECT_ID('IAT_ORDER_POLICY') IS NOT NULL
	DROP TABLE IAT_ORDER_POLICY
CREATE TABLE IAT_ORDER_POLICY --订单政策表(生成订单时匹配的政策，不允许修改)
  (
	 ORDER_POLICY_ID  UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--主键ID
     ORDER_NO                       VARCHAR(20) NOT NULL,--订单号
     SUPLIER_POLICY_ID              UNIQUEIDENTIFIER,--主键ID
     SUPPLIER_ID                     INT NOT NULL,--供应商ID
     ORIGINAL_POLICY_ID             INT,--源政策ID（复制政策时用）
     POLICY_TYPE                    INT NOT NULL DEFAULT(1),--政策类型（1：单程  2：往返  3：联程  4：缺口）
     POLICY_START_DATE              DATETIME NOT NULL DEFAULT(GETDATE()),--政策有效起始日期
     POLICY_END_DATE                DATETIME NOT NULL DEFAULT(GETDATE()),--政策有效结束日期
     POLICY_CONTINUE_DATE           DATETIME,--回程奖励政策沿用至
     OPEN_TICKET_START_DATE         DATETIME NOT NULL DEFAULT(GETDATE()),--开票有效期开始日期，包含时分( 时间要不要分开)
     OPEN_TICKET_END_DATE           DATETIME NOT NULL DEFAULT(GETDATE()),--开票有效期结束日期，包含时分( 时间要不要分开)
     WEEKEND_OPEN_TICKET_START_TIME CHAR(4),--双休日开票开始时间（时分）
     WEEKEND_OPEN_TICKET_END_TIME   CHAR(4),--双休日开票结束时间（时分）
     OFFICE_NO1                     VARCHAR(20) NOT NULL,--授权号1
     OFFICE_NO2                     VARCHAR(20),--授权号2
     AIRLINE                        VARCHAR(3) NOT NULL,--航空公司二字码
     BASIC_AGENT_FEE_RATE           DECIMAL NOT NULL DEFAULT(0),--基本代理费率
     REWARD_RATE                    DECIMAL NOT NULL DEFAULT(0),--奖励扣率
     REWARD_FEE                     MONEY NOT NULL DEFAULT(0),--奖励金额
     OPEN_TICKET_FEE                MONEY NOT NULL DEFAULT(0),--开票费
     BERTH                          VARCHAR(50) NOT NULL,--舱位（以/分隔）
     DEPARTURE_CITY                 CHAR(3) NOT NULL,--出发城市三字码
     ARRIVE_CITY                    CHAR(3) NOT NULL,--到达城市三字码
     
     GO_FLIGHT_INCLUDE               VARCHAR(2000),--去程航班包含(多个航班以/ 分隔)
     BACK_FLIGHT_INCLUDE              VARCHAR(2000),--返程航班包含(多个航班以/分隔)
     
     TICKET_TYPE                    VARCHAR(3),--机票类别（B2B,BSP,OET__境外电子票）
     ALLOW_INVALID                  BIT DEFAULT(0),--是否允许作废
     CHILD_EQUAL_ADULT              BIT DEFAULT(0),--儿童票是否与成人票返点一致
     ALLOW_INFANT                   BIT DEFAULT(0),--婴儿是否可开票
     PNR_LIMIT                      INT,--PNR限制（1：换编码出票 2:大编码出票(无需换编) 3：大编码出票(需换编) ）
     RETURN_RATE_LIMIT              INT,--返点不适用(1:婴儿，2:儿童，3:整团，4:SOTO,5:代码共享)
     POLICY_SOURCE                  NVARCHAR(20),--政策来源(确认政策来源是什么意思)
     INTERNAL_REMARK                NVARCHAR(200),--内部备注
     EXTERNAL_REMARK                NVARCHAR(200),--外部备注
     CREATER                        NVARCHAR(10) NOT NULL,--创建人
     CREATER_ID                     INT NOT NULL,--创建人ID
     CREATE_TIME                    DATETIME NOT NULL DEFAULT(GETDATE())--创建时间
  )

--可以考虑在始发城市，到达城市，航空公司三个字段上加索引
 IF OBJECT_ID('IAT_SUPLIER_POLICY') IS NOT NULL
	DROP TABLE IAT_SUPLIER_POLICY
	
CREATE TABLE IAT_SUPLIER_POLICY --供应商政策表
  (
     SUPLIER_POLICY_ID              UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--主键ID
     SUPPLIER_ID                     INT NOT NULL,--供应商ID
     ORIGINAL_POLICY_ID             INT,--源政策ID（复制政策时用）
     POLICY_TYPE                    INT NOT NULL DEFAULT(1),--政策类型（1：单程  2：往返  3：联程  4：缺口）
     POLICY_START_DATE              DATETIME NOT NULL DEFAULT(GETDATE()),--政策有效起始日期
     POLICY_END_DATE                DATETIME NOT NULL DEFAULT(GETDATE()),--政策有效结束日期
     POLICY_CONTINUE_DATE           DATETIME,--回程奖励政策沿用至
     OPEN_TICKET_START_DATE         DATETIME NOT NULL DEFAULT(GETDATE()),--开票有效期开始日期
     OPEN_TICKET_START_TIME         CHAR(4),--平时开票起始时间
     OPEN_TICKET_END_DATE           DATETIME NOT NULL DEFAULT(GETDATE()),--开票有效期结束日期
     OPEN_TICKET_END_TIME           CHAR(4),--平时开票结束时间
     WEEKEND_OPEN_TICKET_START_TIME CHAR(4),--双休日开票开始时间（时分）
     WEEKEND_OPEN_TICKET_END_TIME   CHAR(4),--双休日开票结束时间（时分）
     OFFICE_NO1                     VARCHAR(20) NOT NULL,--授权号1
     OFFICE_NO2                     VARCHAR(20),--授权号2
     AIRLINE                        VARCHAR(3) NOT NULL,--航空公司二字码
     BASIC_AGENT_FEE_RATE           DECIMAL NOT NULL DEFAULT(0),--基本代理费率
     REWARD_RATE                    DECIMAL NOT NULL DEFAULT(0),--奖励扣率
     REWARD_FEE                     MONEY NOT NULL DEFAULT(0),--奖励金额
     OPEN_TICKET_FEE                MONEY NOT NULL DEFAULT(0),--开票费
     BERTH                          VARCHAR(50) NOT NULL,--舱位（以/分隔,*代表所有舱位）
     DEPARTURE_CITY                 CHAR(3) NOT NULL,--出发城市三字码
     ARRIVE_CITY                    CHAR(3) NOT NULL,--到达城市三字码
     
     GO_FLIGHT_INCLUDE               VARCHAR(2000),--去程航班包含(多个航班以/ 分隔，不能和排除有冲突)
     BACK_FLIGHT_INCLUDE              VARCHAR(2000),--返程航班包含(多个航班以/分隔，不能和排除有冲突)
     
     TICKET_TYPE                    VARCHAR(3),--机票类别（B2B,BSP,OET__境外电子票）
     ALLOW_INVALID                  BIT DEFAULT(0),--是否允许作废
     CHILD_EQUAL_ADULT              BIT DEFAULT(0),--儿童票是否与成人票返点一致
     ALLOW_INFANT                   BIT DEFAULT(0),--婴儿是否可开票(0:不可开 1：可开)
     PNR_LIMIT                      INT,--PNR限制（1：换编码出票 2:大编码出票(无需换编) 3：大编码出票(需换编) ）
     RETURN_RATE_LIMIT              VARCHAR(5),--返点不适用 编码方式为12345(1:婴儿，2:儿童，3:整团，4:SOTO,5:代码共享)
     POLICY_SOURCE                  NVARCHAR(20),--政策来源(确认政策来源是什么意思)
     INTERNAL_REMARK                NVARCHAR(200),--内部备注
     EXTERNAL_REMARK                NVARCHAR(200),--外部备注
     CREATER                        NVARCHAR(10) NOT NULL,--创建人
     CREATER_ID                     INT NOT NULL,--创建人ID
     CREATE_TIME                    DATETIME NOT NULL DEFAULT(GETDATE()), --创建时间
     SUSPENDED                      BIT NOT NULL DEFAULT(0),--政策是否挂起
     SET_SUSPENDED_OPERATOR         INT,--设置挂起状态的操作者ID
     SUSPENDED_TIME                 DATETIME DEFAULT(GETDATE())--设置挂起的时间
  )


 IF OBJECT_ID('IAT_PLATFORM_CONFIG') IS NOT NULL
	DROP TABLE IAT_PLATFORM_CONFIG
CREATE TABLE IAT_PLATFORM_CONFIG --平台配置表
  (
     PLATFORM_CONFIG_ID             UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--主键ID
     PARTNER_ID                     INT NOT NULL UNIQUE,--合作方ID
     WORKDAY_OPEN_TICKET_START_TIME CHAR(4),--工作日开票开始时间
     WORKDAY_OPEN_TICKET_END_TIME   CHAR(4),--工作日开票结束时间
     WEEKEND_OPEN_TICKET_START_TIME CHAR(4),--周末开票开始时间
     WEEKEND_OPEN_TICKET_END_TIME   CHAR(4),--周末开票结束时间
     REST_NO_TICKET                 BIT DEFAULT(0),--公休是否开票（0：开票，1：不开票）
     INVALID_TIME                   CHAR(4),--废票时间(比如 18:00以前)
     OPEN_TICKET_FEE                MONEY DEFAULT(0),--开票费
     INVALID_TICKET_FEE             MONEY DEFAULT(0),--废票费
     CREATER                        NVARCHAR(10) NOT NULL,--创建人
     CREATER_ID                     INT NOT NULL,--创建人ID
     CREATE_TIME                    DATETIME NOT NULL DEFAULT(GETDATE()) --创建时间
  )

 IF OBJECT_ID('IAT_PLATFORM_EXPRESS') IS NOT NULL
	DROP TABLE IAT_PLATFORM_EXPRESS
CREATE TABLE IAT_PLATFORM_EXPRESS --平台快递表
  (
     PLATFORM_EXPRESS_ID UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--主键ID
     EXPRESS_NAME        NVARCHAR(20) NOT NULL UNIQUE,--快递名称
     PARTNER_ID          INT NOT NULL UNIQUE,--合作方ID
     CREATER             NVARCHAR(10) NOT NULL,--创建人
     CREATER_ID          INT NOT NULL,--创建人ID
     CREATE_TIME         DATETIME NOT NULL DEFAULT(GETDATE()) --创建时间
  )

 IF OBJECT_ID('IAT_FREQUENT_FLYER') IS NOT NULL
	DROP TABLE IAT_FREQUENT_FLYER
CREATE TABLE IAT_FREQUENT_FLYER --常旅客
  (
     FREQUENT_FLYER_ID      UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--主键ID
     PARTNER_ID             INT NOT NULL,--合作方ID
     ENGLIGH_NAME           VARCHAR(20) NOT NULL,--英文姓名
     PASSENGER_TYPE_ID      UNIQUEIDENTIFIER NOT NULL,--乘客类型ID
     GENDER                 CHAR(1) NOT NULL,--乘客性别(男，女)
     DOCUMENT_TYPE_ID       UNIQUEIDENTIFIER NOT NULL,--证件类型ID
     IDENTIFICATION_NUMBERS VARCHAR(20) NOT NULL,--证件号码
     VALIDITY_PERIOD        DATETIME NOT NULL,--证件有效期
     BIRTHDATE              DATETIME NOT NULL,--出生日期
     NATIONALITY            VARCHAR(20) NOT NULL, --国籍
     CONSTRAINT USER_UNIQUE UNIQUE (ENGLIGH_NAME, IDENTIFICATION_NUMBERS)
  )

--有疑问
 IF OBJECT_ID('IAT_INVOICE_INFO') IS NOT NULL
	DROP TABLE IAT_INVOICE_INFO
CREATE TABLE IAT_INVOICE_INFO-- 发票信息管理表
  (
     INVOICE_INFO_ID     UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--主键ID
     INVOICE_BOOK_NUMBER INT NOT NULL UNIQUE,--发票册编号
     PAGES_PER_BOOK      INT,--每册张数
     START_NUMBER        VARCHAR(15) NOT NULL,--初始票号
     END_NUMBER          VARCHAR(15) NOT NULL,--结束票号
     ADD_TIME            DATETIME NOT NULL DEFAULT(GETDATE()),--入库时间
     GRANT_TIME          DATETIME DEFAULT(GETDATE()),--发放时间
     GRANT_SOURCE        VARCHAR(20),--发放出处
     STATUS              BIT NOT NULL DEFAULT(0),--发放状态 （0：未发放 1：已发放）
     OPERATOR            NVARCHAR(10) NOT NULL,--添加人
     OPERATOR_ID         INT NOT NULL,--添加人ID
     GRANT_OPERATOR_ID   INT,--发放人ID
     GRANT_OPERATOR_NAME NVARCHAR(10)--发放人姓名
  )
  
   IF OBJECT_ID('IAT_FINANCIAL_REFUND') IS NOT NULL
	DROP TABLE IAT_FINANCIAL_REFUND
CREATE TABLE IAT_FINANCIAL_REFUND --财务退款表
  (
     FINANCIAL_REFUND_ID  UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--主键ID
     SUPPLIER_ID		  INT  NOT NULL ,--供应商ID
     ORDER_NO             VARCHAR(20),--订单号 
     ORDER_TICKET_ID      UNIQUEIDENTIFIER,--票号
     REFUND_AMOUNT        MONEY NOT NULL DEFAULT(0),--退款金额
     REFUND_STATUS        INT NOT NULL DEFAULT(50),--退款状态  退款审核中(50)、审核退回(51)、退款中(52)、退款完成(53)
     REQUEST_REFUND_ID    INT NOT NULL ,--提交退款人ID
     REQUEST_REFUND_TIME  DATETIME NOT NULL DEFAULT(GETDATE()),--提交退款时间
     PAYMENT_SERIAL_NUMBER VARCHAR(50) ,--客户支付流水号
     REFUND_BATCH_NO       VARCHAR(50),--退款批次号
     LOCKED               BIT NOT NULL DEFAULT(0),--是否被锁定
     LOCKED_OPERATOR      INT,--锁定者ID
     LOCKED_OPERATOR_NAME NVARCHAR(10),--锁定者姓名
     LOCKED_TIME          DATETIME DEFAULT(GETDATE()),--锁定时间
     REFUND_TYPE		  INT NOT NULL DEFAULT(1),--退款类型（1：退票，2：废票 ，3：改签）
     ORDER_REFUND_ID	  UNIQUEIDENTIFIER  ,--退票ID
     ORDER_ALTERATIONS_ID  UNIQUEIDENTIFIER,--改签ID
     INVALID_ID				UNIQUEIDENTIFIER,--废票ID
     REFUND_OPERATOR_ID  INT, --退款人ID
     REFUND_OPERATOR_NAME NVARCHAR(10),--退款人姓名
     REFUND_TIME  DATETIME ,--退款时间
     CREATE_TIME		 DATETIME NOT NULL DEFAULT(GETDATE()) --生成时间
  ) 
