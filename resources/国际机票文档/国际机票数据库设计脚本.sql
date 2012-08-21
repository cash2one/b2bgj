/*GO
USE MASTER
IF DB_ID (N'INTERNATIONAL_FLIGHT') IS NOT NULL
BEGIN
--ɾ�����ݿ�
DECLARE   HCFOREACH   CURSOR   GLOBAL   FOR 
SELECT   'KILL   '+RTRIM(SPID)   
FROM   MASTER.DBO.SYSPROCESSES   
WHERE   DBID=DB_ID('INTERNATIONAL_FLIGHT')   
EXEC   SP_MSFOREACH_WORKER   '?' 
DROP DATABASE INTERNATIONAL_FLIGHT
END
GO
--�������ݿ�
CREATE DATABASE INTERNATIONAL_FLIGHT
GO


GO
USE INTERNATIONAL_FLIGHT
GO
--ɾ�����б�
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
--�û���ͽ�ɫ��Ȩ�ޱ���ù���ģ��
CREATE TABLE IAT_FLIGHT_ORDER --��Ʊ������
  (
     ORDER_ID              UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--����ID
     SUPLIER_POLICY_ID     UNIQUEIDENTIFIER NOT NULL,--����ID
     SUPLIER_ID            INT NOT NULL,--��Ӧ��ID(��Ӧ��SUPLIER_POLICY --��Ӧ�����߱��SUPLIER_ID �����ֶ�)
     PURCHASE_ID            INT NOT NULL,--�ɹ���ID
     ORDER_NO              VARCHAR(20) NOT NULL UNIQUE,--������
     ORIGINAL_ORDER_NO     VARCHAR(20),--ԭ���Ķ�����
     PNR                   CHAR(6),--������¼���
     ORDER_STATUS          INT NOT NULL,--����״̬ ��Ԥ������� (10) ������˻�(11)����֧��(12)����Ʊ��(13)���ѳ�Ʊ(14)��ȡ��Ԥ��(15)��
     UPDATE_STATUS_TIME    DATETIME NOT NULL DEFAULT(GETDATE()),--���¶���״̬ʱ��(�����������ͨ��ʱ�䣬�����˻�ʱ���,����ÿ������ʱ����Բ�ѯ������־)
     ORDER_DATE            DATETIME NOT NULL DEFAULT(GETDATE()),--Ԥ��ʱ��
     ORDER_REPLAY          NVARCHAR(50),--��˻ظ�
     ORDER_REMARK          NVARCHAR(200),--������ע 
     LOCKED                BIT NOT NULL DEFAULT(0),--�Ƿ�����
     LOCKED_OPERATOR       INT,--������ID
     LOCKED_OPERATOR_NAME  NVARCHAR(10),--����������
     LOCKED_TIME           DATETIME DEFAULT(GETDATE()),--����ʱ��
     ORDER_PAYMENT_ID      UNIQUEIDENTIFIER,--����֧��ID
     --==========================������ϸ=====================
     FREIGHT               MONEY NOT NULL DEFAULT(0),--�˼�
     AGENT_FEE_RATE        DECIMAL NOT NULL DEFAULT(0),--�������
     REWARD_RATE           DECIMAL NOT NULL DEFAULT(0),--��������
     REWARD_FEE            MONEY NOT NULL DEFAULT(0),--�������
     TAX                   MONEY NOT NULL DEFAULT(0),--˰��
     TRADING_FORMALITY_FEE MONEY NOT NULL DEFAULT(0),--����������
     SETTLEMENT_PRICE      MONEY NOT NULL DEFAULT(0),--���Ž����
     OTHER_FEE             MONEY NOT NULL DEFAULT(0),--��������
     OTHER_FEE_DESC        NVARCHAR(20),--��������˵��(����Ӥ��Ʊ 100)
     FREIGHT_SOURCE        NVARCHAR(20),--�˼���Դ
     OPEN_TICKET_FEE       MONEY NOT NULL DEFAULT(0),--��Ӧ�̿�Ʊ��
     TOTAL_PRICE           MONEY NOT NULL DEFAULT(0),--�����ܼ�
     --==========================������ϸ=====================
     REFUND_RULE           NVARCHAR(300)--�˸�ǩ����
  )

IF OBJECT_ID('IAT_ORDER_PAYMENT') IS NOT NULL
	DROP TABLE IAT_ORDER_PAYMENT

CREATE TABLE IAT_ORDER_PAYMENT --����֧����Ϣ��
  (
     ORDER_PAYMENT_ID UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--����ID
     ORDER_NO         VARCHAR(20) NOT NULL,--������
     ORDER_TICKET_ID  UNIQUEIDENTIFIER,--Ʊ��
     PAYMENT_TYPE     NVARCHAR(20) NOT NULL,--֧����ʽ
     PAYMENT_AMOUNT   MONEY NOT NULL DEFAULT(0),--֧�����
     SERIAL_NUMBER    VARCHAR(50) NOT NULL,--֧����ˮ��
     PAYMENT_ACCOUNT  VARCHAR(50) NOT NULL,--֧���˺�
     PROCEEDS_ACCOUNT VARCHAR(50) NOT NULL,--�տ��˺�
     NET_BANK_CODE    VARCHAR(50) NOT NULL,--��������
     PAYMENT_TIME     DATETIME NOT NULL DEFAULT(GETDATE()),--֧��ʱ��
     PAYMENT_STATUS   INT NOT NULL DEFAULT(0) --֧��״̬(0:֧��ʧ�ܣ�1��֧���ɹ�  2��δ֪)
  )

IF OBJECT_ID('IAT_ORDER_MESSAGE') IS NOT NULL
	DROP TABLE IAT_ORDER_MESSAGE

CREATE TABLE IAT_ORDER_MESSAGE--�������Ա�
  (
     ORDER_MESSAGE_ID UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--����ID
     ORDER_NO         VARCHAR(20) NOT NULL,--������
     MESSAGE_LEVEL    INT NOT NULL DEFAULT(0),--��Ϣ��������(0:��ͨ 1:�ϼ�  2:����  3:�ؼ�)
     MESSAGE_TITLE    NVARCHAR(50) NOT NULL,--��Ϣ����
     MESSAGE_CONTENT  NVARCHAR(200) NOT NULL,--��Ϣ����
     LEAVE_WORD_TIME  DATETIME NOT NULL DEFAULT(GETDATE()),--����ʱ��
     OPERATOR_ID      INT NOT NULL,--����ԱID
     OPERATOR_NAME    INT NOT NULL,--����Ա����
     PARTNER_ID       INT NOT NULL,--������ID
     PARTNER_NAME     NVARCHAR(50) NOT NULL --����������
  )

IF OBJECT_ID('IAT_ORDER_INSURANCE') IS NOT NULL
	DROP TABLE IAT_ORDER_INSURANCE

CREATE TABLE IAT_ORDER_INSURANCE --�������շѱ�
  (
     ORDER_INSURANCE_ID UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--����ID
     ORDER_NO           VARCHAR(20) NOT NULL,--������
     ORDER_PASSENGER_ID UNIQUEIDENTIFIER,--�˻���ID
     INS_UNIT_PRICE     MONEY NOT NULL DEFAULT(0),--���յ���
     INS_NUMBER         INT NOT NULL DEFAULT(0)--���շ���
  )
  
  
  IF OBJECT_ID('IAT_ORDER_LOG') IS NOT NULL
	DROP TABLE IAT_ORDER_LOG

--��Ҫ����һ����־��ʷ��
CREATE TABLE IAT_ORDER_LOG --������־��
  (
     ORDER_LOG_ID  UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--����ID
     ORDER_NO      VARCHAR(20) NOT NULL,--������
     LOG_TYPE      VARCHAR(10) NOT NULL,--��־����
     TITLE         NVARCHAR(50) NOT NULL,--����
     CONTENT       NVARCHAR(200) NOT NULL,--����
     OPERATE_TIME  DATETIME NOT NULL DEFAULT(GETDATE()),--����ʱ��
     OPERATOR_NAME NVARCHAR(10) NOT NULL,--������
     OPERATOR_ID   INT NOT NULL,--������ID
     PARTNER_NAME  NVARCHAR(50) NOT NULL,--������
     PARTNER_ID    INT NOT NULL --������ID
  )
  
  
    IF OBJECT_ID('IAT_FLIGHT_INFO') IS NOT NULL
	DROP TABLE IAT_FLIGHT_INFO

CREATE TABLE IAT_FLIGHT_INFO --����������Ϣ��
  (
     FLIGHT_INFO_ID    UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--����ID
     ORDER_NO          VARCHAR(20) NOT NULL,--������
     TAKEOFF_DATE      DATETIME NOT NULL,--�������
     TAKEOFF_TIME      CHAR(4) NOT NULL,--���ʱ��
     DEPARTURE_AIRPORT CHAR(3) NOT NULL,--��������������
     ARRIVE_AIRPORT    CHAR(3) NOT NULL,--�������������
     AIRLINE           VARCHAR(3) NOT NULL,--���չ�˾
     FLIGHTS           VARCHAR(4) NOT NULL,--�����(�4λ)
     ARRIVE_DATE       DATETIME NOT NULL,--��������
     ARRIVE_TIME       CHAR(4) NOT NULL,--����ʱ��
     BERTH             VARCHAR(2) NOT NULL --��λ(�2λ)
  )

    IF OBJECT_ID('IAT_ORDER_TICKET') IS NOT NULL
	DROP TABLE IAT_ORDER_TICKET
	
CREATE TABLE IAT_ORDER_TICKET --����Ʊ�ű�
  (
     ORDER_TICKET_ID     UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--����ID,
     ORDER_NO            VARCHAR(20) NOT NULL,--������
     ORDER_PASSENGERS_ID UNIQUEIDENTIFIER,--�˻���ID
     TICKET_NO           VARCHAR(15),--Ʊ��
     TICKET_STATUS       INT NOT NULL DEFAULT(0),--Ʊ��״̬
     FINANCIAL_REFUND_ID UNIQUEIDENTIFIER --�����˿�ID
  )
  
     IF OBJECT_ID('IAT_ORDER_PASSENGER') IS NOT NULL
	DROP TABLE IAT_ORDER_PASSENGER

CREATE TABLE IAT_ORDER_PASSENGER --�˻�����Ϣ��
  (
     ORDER_PASSENGER_ID     UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--����ID
     ORDER_NO               VARCHAR(20) NOT NULL,--������
     PASSENGER_EN_NAME      VARCHAR(50) NOT NULL,--�˿�Ӣ������
     PASSENGER_TYPE_ID      UNIQUEIDENTIFIER NOT NULL,--�˿�����(���ˣ���ͯ��Ӥ�� PASSENGER_TYPE�������ID��
     GENDER                 CHAR(1) NOT NULL,--�˿��Ա�(�У�Ů)
     DOCUMENT_TYPE_ID       UNIQUEIDENTIFIER NOT NULL,--֤������ID
     IDENTIFICATION_NUMBERS VARCHAR(20) NOT NULL,--֤������
     VALIDITY_PERIOD        DATETIME NOT NULL,--֤����Ч��
     BIRTHDATE              DATETIME NOT NULL,--��������
     NATIONALITY            VARCHAR(20) NOT NULL --����
  )


  IF OBJECT_ID('IAT_ORDER_CONTACT') IS NOT NULL
	DROP TABLE IAT_ORDER_CONTACT
CREATE TABLE IAT_ORDER_CONTACT --������ϵ�˱�
  (
     ORDER_CONTACT_ID UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--����ID
     ORDER_NO         VARCHAR(20) NOT NULL,--������
     CONTACT_NAME     NVARCHAR(20) NOT NULL,--��ϵ������
     MOBILE           VARCHAR(20) NOT NULL,--��ϵ���ֻ�
     ADDRESS          NVARCHAR(100) NOT NULL,--��ϵ�˵�ַ
     TELEPHONE        VARCHAR(20),--��ϵ�˵绰
     EMAIL            VARCHAR(50),--��ϵ��EMAIL
     QQ               VARCHAR(13),--��ϵ��QQ
     MSN              VARCHAR(50)--��ϵ��MSN
  )


  IF OBJECT_ID('IAT_ORDER_ALTERATIONS') IS NOT NULL
	DROP TABLE IAT_ORDER_ALTERATIONS
CREATE TABLE IAT_ORDER_ALTERATIONS --������ǩ��
  (
     ORDER_ALTERATIONS_ID UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--����ID
     ORDER_TICKET_ID      UNIQUEIDENTIFIER NOT NULL,--��ǩƱ��
     PNR                  CHAR(6),--��ǩ��PNR
     ORDER_NO             VARCHAR(20) NOT NULL,--������
     TAKEOFF_DATE         DATETIME NOT NULL,--��������
     TAKEOFF_AIRPORT      CHAR(3) NOT NULL,--��ɻ���
     ARRIVE_AIRPORT       CHAR(3) NOT NULL,--�������
     AIRLINE              VARCHAR(3) NOT NULL,--���չ�˾
     FLIGHT               VARCHAR(4) NOT NULL,--�����
     TAKEOFF_TIME         CHAR(4) NOT NULL,--���ʱ��
     ARRIVE_TIME          CHAR(4) NOT NULL,--����ʱ��
     ARRIVE_DATE          DATETIME NOT NULL,--��������
     ALTERATIONS_INFO     NVARCHAR(200),--��ǩ��Ϣ
     REPLENISH            MONEY DEFAULT(0),--��ǩ����
     REPLAY               NVARCHAR(50),--�ظ�
     ALTERATION_REMARK    NVARCHAR(200),--��ǩ��ע
     ALTERATION_STATUS    INT NOT NULL,--��ǩ״̬(��ǩ�����(20)������˻�(21)����ǩ��(22)����֧��(23)���Ѹ�ǩ(24)����ȡ��(25)(ȡ�������˿�ģ�ֱ����ɡ���Ҫ�˿�����˿�����¼�һ����¼��״̬Ϊ���˿�))
     LOCKED               BIT NOT NULL DEFAULT(0),--�Ƿ�����
     LOCKED_OPERATOR      INT,--������ID
     LOCKED_OPERATOR_NAME NVARCHAR(10),--����������
     LOCKED_TIME          DATETIME DEFAULT(GETDATE()), --����ʱ��
     CREATE_TIME		 DATETIME NOT NULL DEFAULT(GETDATE()) --����ʱ��
  )


  IF OBJECT_ID('IAT_ORDER_REFUND') IS NOT NULL
	DROP TABLE IAT_ORDER_REFUND
CREATE TABLE IAT_ORDER_REFUND--������Ʊ��
  (
     ORDER_REFUND_ID      UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--����ID
     ORDER_NO             VARCHAR(20) NOT NULL,--������(��Ϊ�����ֶ�)
     ORDER_TICKET_ID      UNIQUEIDENTIFIER NOT NULL,--����Ʊ��ID
     REFUND_TITLE         NVARCHAR(50) NOT NULL DEFAULT('��Ʊ'),--��Ʊ����
     REFUND_REASON        NVARCHAR(200),--��Ʊԭ��˵��
     REFUND_TIME          DATETIME NOT NULL DEFAULT(GETDATE()),--������Ʊʱ��
     REAL_AMOUNT          MONEY NOT NULL DEFAULT(0),--ʵ����Ӧ�õ��ڶ������ж�Ӧ�����ŵĵ��Ž���ۣ�
     DEDUCT_AMOUNT        MONEY NOT NULL DEFAULT(0),--�ۿ���
     REFUND_AMOUNT AS REAL_AMOUNT - DEDUCT_AMOUNT,--ʵ�˽��
     REFUND_STATUS        INT NOT NULL DEFAULT(0),--�˷�Ʊ״̬(��Ʊ�����(30)������˻�(31)����Ʊ��(32)������Ʊ(33)(�ύ�����˿�,��Ҫ�˿�����˿�����¼�һ����¼��״̬Ϊ���˿�)����ȡ��(34) ,  ��Ʊ�����(40)������˻�(41)����Ʊ��(42)��ȡ����Ʊ(43)����Ʊ���(44))
     LOCKED               BIT NOT NULL DEFAULT(0),--�Ƿ�����
     LOCKED_OPERATOR      INT,--������ID
     LOCKED_OPERATOR_NAME NVARCHAR(10),--����������
     LOCKED_TIME          DATETIME DEFAULT(GETDATE()),--����ʱ��
     IS_INVALIDATE        BIT NOT NULL DEFAULT(0),--�Ƿ��Ʊ
     REPLY                NVARCHAR(20),--�ظ�
     RETURN_REASON        NVARCHAR(200)--�˻�ԭ��
  )

/*.
һ��һ�Ŷ���ֻ��һ�ŷ�Ʊ��
���һ�Ŷ������ж��˵Ļ������Էֿ����ģ�
���������ܳ����ܺͣ�
Ҳ���ܳ���ÿ�˹涨��ƽ����
��Ӧ�ڶ�������һ�Զ�Ĺ�ϵ

����һ��3000�Ķ�������3���ˣ�
���ŷ�Ʊ���չ�˾�涨ÿ����10%�ĸ�����
Ҳ�������ÿ��һ�ŷ�Ʊ�����Ҳֻ��1100��
��3�ţ������ܹ�һ��3300��������һ�˿�2300��
����2�˿�1000....����������һ���Ǹ߿���Ʊ��Υ����
*/

  IF OBJECT_ID('IAT_ORDER_INVOICE') IS NOT NULL
	DROP TABLE IAT_ORDER_INVOICE
CREATE TABLE IAT_ORDER_INVOICE --������Ʊ��
  (
     ORDER_INVOICE_ID    UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--����ID
     ORDER_NO            VARCHAR(20) NOT NULL,--������
     INVOICE_AMOUNT      MONEY NOT NULL DEFAULT(0),--���
     INVOICE_TITLE       NVARCHAR(50) NOT NULL,--̧ͷ
     INVOICE_SEND_TYPE   NVARCHAR(10) NOT NULL,--��Ʊ���ͷ�ʽ(��ȡ������)
     GET_INVOICE_ADDRESS NVARCHAR(100),--	��ȡ��ַ
     CONTACT             NVARCHAR(10),--��ϵ��
     CONTACT_PHONE       VARCHAR(20),-- ��ϵ�绰
     SEND_ADDRESS        NVARCHAR(100),--���͵�ַ
     IS_INVALID          BIT DEFAULT(0),--�Ƿ�����(Ĭ��Ϊ0����ʾ��Ч)
     EXPRESS_NO          VARCHAR(25),--��ݺ�
     INVOICE_STATUS      INT NOT NULL DEFAULT(0),--��Ʊ״̬(0:������1���ѿ�)
     INVOICE_NO          VARCHAR(25),--��Ʊ��
     OPEN_INVOICE_DATE   DATETIME DEFAULT(GETDATE())--����Ʊ����
  )


 IF OBJECT_ID('IAT_DOCUMENT_TYPE') IS NOT NULL
	DROP TABLE IAT_DOCUMENT_TYPE
CREATE TABLE IAT_DOCUMENT_TYPE --֤�����ͱ�
  (
     DOCUMENT_TYPE_ID          UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--����ID
     DOCUMENT_TYPE_CODE        VARCHAR(20) UNIQUE,--֤�����ͱ���
     DOCUMENT_TYPE_DESCRIPTION NVARCHAR(20) NOT NULL UNIQUE,-- ֤����������
     CREATER                   NVARCHAR(10) NOT NULL,--������
     CREATER_ID                INT NOT NULL,--������ID
     CREATE_TIME               DATETIME NOT NULL DEFAULT(GETDATE()) --����ʱ��
  )


 IF OBJECT_ID('IAT_PASSENGER_TYPE') IS NOT NULL
	DROP TABLE IAT_PASSENGER_TYPE
CREATE TABLE IAT_PASSENGER_TYPE --�˿����ͱ�
  (
     PASSENGER_TYPE_ID UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--����ID
     PASSENGER_CODE    VARCHAR(20) UNIQUE NOT NULL,--�˿����ͱ���(ADT,CHD,)
     [DESCRIPTION]     NVARCHAR(20) UNIQUE NOT NULL,--�˿����������� ��ͨ�ÿ͡���������ѧ���� ������Ա��  ��Ա���⽻�١���ͯ��Ӥ��)
     CREATER           NVARCHAR(10) NOT NULL,--������
     CREATER_ID        INT NOT NULL,--������ID
     CREATE_TIME       DATETIME NOT NULL DEFAULT(GETDATE()) --����ʱ��
  )

--��ṹͬ���߱���ͬ

 IF OBJECT_ID('IAT_ORDER_POLICY') IS NOT NULL
	DROP TABLE IAT_ORDER_POLICY
CREATE TABLE IAT_ORDER_POLICY --�������߱�(���ɶ���ʱƥ������ߣ��������޸�)
  (
	 ORDER_POLICY_ID  UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--����ID
     ORDER_NO                       VARCHAR(20) NOT NULL,--������
     SUPLIER_POLICY_ID              UNIQUEIDENTIFIER,--����ID
     SUPPLIER_ID                     INT NOT NULL,--��Ӧ��ID
     ORIGINAL_POLICY_ID             INT,--Դ����ID����������ʱ�ã�
     POLICY_TYPE                    INT NOT NULL DEFAULT(1),--�������ͣ�1������  2������  3������  4��ȱ�ڣ�
     POLICY_START_DATE              DATETIME NOT NULL DEFAULT(GETDATE()),--������Ч��ʼ����
     POLICY_END_DATE                DATETIME NOT NULL DEFAULT(GETDATE()),--������Ч��������
     POLICY_CONTINUE_DATE           DATETIME,--�س̽�������������
     OPEN_TICKET_START_DATE         DATETIME NOT NULL DEFAULT(GETDATE()),--��Ʊ��Ч�ڿ�ʼ���ڣ�����ʱ��( ʱ��Ҫ��Ҫ�ֿ�)
     OPEN_TICKET_END_DATE           DATETIME NOT NULL DEFAULT(GETDATE()),--��Ʊ��Ч�ڽ������ڣ�����ʱ��( ʱ��Ҫ��Ҫ�ֿ�)
     WEEKEND_OPEN_TICKET_START_TIME CHAR(4),--˫���տ�Ʊ��ʼʱ�䣨ʱ�֣�
     WEEKEND_OPEN_TICKET_END_TIME   CHAR(4),--˫���տ�Ʊ����ʱ�䣨ʱ�֣�
     OFFICE_NO1                     VARCHAR(20) NOT NULL,--��Ȩ��1
     OFFICE_NO2                     VARCHAR(20),--��Ȩ��2
     AIRLINE                        VARCHAR(3) NOT NULL,--���չ�˾������
     BASIC_AGENT_FEE_RATE           DECIMAL NOT NULL DEFAULT(0),--�����������
     REWARD_RATE                    DECIMAL NOT NULL DEFAULT(0),--��������
     REWARD_FEE                     MONEY NOT NULL DEFAULT(0),--�������
     OPEN_TICKET_FEE                MONEY NOT NULL DEFAULT(0),--��Ʊ��
     BERTH                          VARCHAR(50) NOT NULL,--��λ����/�ָ���
     DEPARTURE_CITY                 CHAR(3) NOT NULL,--��������������
     ARRIVE_CITY                    CHAR(3) NOT NULL,--�������������
     
     GO_FLIGHT_INCLUDE               VARCHAR(2000),--ȥ�̺������(���������/ �ָ�)
     BACK_FLIGHT_INCLUDE              VARCHAR(2000),--���̺������(���������/�ָ�)
     
     TICKET_TYPE                    VARCHAR(3),--��Ʊ���B2B,BSP,OET__�������Ʊ��
     ALLOW_INVALID                  BIT DEFAULT(0),--�Ƿ���������
     CHILD_EQUAL_ADULT              BIT DEFAULT(0),--��ͯƱ�Ƿ������Ʊ����һ��
     ALLOW_INFANT                   BIT DEFAULT(0),--Ӥ���Ƿ�ɿ�Ʊ
     PNR_LIMIT                      INT,--PNR���ƣ�1���������Ʊ 2:������Ʊ(���軻��) 3��������Ʊ(�軻��) ��
     RETURN_RATE_LIMIT              INT,--���㲻����(1:Ӥ����2:��ͯ��3:���ţ�4:SOTO,5:���빲��)
     POLICY_SOURCE                  NVARCHAR(20),--������Դ(ȷ��������Դ��ʲô��˼)
     INTERNAL_REMARK                NVARCHAR(200),--�ڲ���ע
     EXTERNAL_REMARK                NVARCHAR(200),--�ⲿ��ע
     CREATER                        NVARCHAR(10) NOT NULL,--������
     CREATER_ID                     INT NOT NULL,--������ID
     CREATE_TIME                    DATETIME NOT NULL DEFAULT(GETDATE())--����ʱ��
  )

--���Կ�����ʼ�����У�������У����չ�˾�����ֶ��ϼ�����
 IF OBJECT_ID('IAT_SUPLIER_POLICY') IS NOT NULL
	DROP TABLE IAT_SUPLIER_POLICY
	
CREATE TABLE IAT_SUPLIER_POLICY --��Ӧ�����߱�
  (
     SUPLIER_POLICY_ID              UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--����ID
     SUPPLIER_ID                     INT NOT NULL,--��Ӧ��ID
     ORIGINAL_POLICY_ID             INT,--Դ����ID����������ʱ�ã�
     POLICY_TYPE                    INT NOT NULL DEFAULT(1),--�������ͣ�1������  2������  3������  4��ȱ�ڣ�
     POLICY_START_DATE              DATETIME NOT NULL DEFAULT(GETDATE()),--������Ч��ʼ����
     POLICY_END_DATE                DATETIME NOT NULL DEFAULT(GETDATE()),--������Ч��������
     POLICY_CONTINUE_DATE           DATETIME,--�س̽�������������
     OPEN_TICKET_START_DATE         DATETIME NOT NULL DEFAULT(GETDATE()),--��Ʊ��Ч�ڿ�ʼ����
     OPEN_TICKET_START_TIME         CHAR(4),--ƽʱ��Ʊ��ʼʱ��
     OPEN_TICKET_END_DATE           DATETIME NOT NULL DEFAULT(GETDATE()),--��Ʊ��Ч�ڽ�������
     OPEN_TICKET_END_TIME           CHAR(4),--ƽʱ��Ʊ����ʱ��
     WEEKEND_OPEN_TICKET_START_TIME CHAR(4),--˫���տ�Ʊ��ʼʱ�䣨ʱ�֣�
     WEEKEND_OPEN_TICKET_END_TIME   CHAR(4),--˫���տ�Ʊ����ʱ�䣨ʱ�֣�
     OFFICE_NO1                     VARCHAR(20) NOT NULL,--��Ȩ��1
     OFFICE_NO2                     VARCHAR(20),--��Ȩ��2
     AIRLINE                        VARCHAR(3) NOT NULL,--���չ�˾������
     BASIC_AGENT_FEE_RATE           DECIMAL NOT NULL DEFAULT(0),--�����������
     REWARD_RATE                    DECIMAL NOT NULL DEFAULT(0),--��������
     REWARD_FEE                     MONEY NOT NULL DEFAULT(0),--�������
     OPEN_TICKET_FEE                MONEY NOT NULL DEFAULT(0),--��Ʊ��
     BERTH                          VARCHAR(50) NOT NULL,--��λ����/�ָ�,*�������в�λ��
     DEPARTURE_CITY                 CHAR(3) NOT NULL,--��������������
     ARRIVE_CITY                    CHAR(3) NOT NULL,--�������������
     
     GO_FLIGHT_INCLUDE               VARCHAR(2000),--ȥ�̺������(���������/ �ָ������ܺ��ų��г�ͻ)
     BACK_FLIGHT_INCLUDE              VARCHAR(2000),--���̺������(���������/�ָ������ܺ��ų��г�ͻ)
     
     TICKET_TYPE                    VARCHAR(3),--��Ʊ���B2B,BSP,OET__�������Ʊ��
     ALLOW_INVALID                  BIT DEFAULT(0),--�Ƿ���������
     CHILD_EQUAL_ADULT              BIT DEFAULT(0),--��ͯƱ�Ƿ������Ʊ����һ��
     ALLOW_INFANT                   BIT DEFAULT(0),--Ӥ���Ƿ�ɿ�Ʊ(0:���ɿ� 1���ɿ�)
     PNR_LIMIT                      INT,--PNR���ƣ�1���������Ʊ 2:������Ʊ(���軻��) 3��������Ʊ(�軻��) ��
     RETURN_RATE_LIMIT              VARCHAR(5),--���㲻���� ���뷽ʽΪ12345(1:Ӥ����2:��ͯ��3:���ţ�4:SOTO,5:���빲��)
     POLICY_SOURCE                  NVARCHAR(20),--������Դ(ȷ��������Դ��ʲô��˼)
     INTERNAL_REMARK                NVARCHAR(200),--�ڲ���ע
     EXTERNAL_REMARK                NVARCHAR(200),--�ⲿ��ע
     CREATER                        NVARCHAR(10) NOT NULL,--������
     CREATER_ID                     INT NOT NULL,--������ID
     CREATE_TIME                    DATETIME NOT NULL DEFAULT(GETDATE()), --����ʱ��
     SUSPENDED                      BIT NOT NULL DEFAULT(0),--�����Ƿ����
     SET_SUSPENDED_OPERATOR         INT,--���ù���״̬�Ĳ�����ID
     SUSPENDED_TIME                 DATETIME DEFAULT(GETDATE())--���ù����ʱ��
  )


 IF OBJECT_ID('IAT_PLATFORM_CONFIG') IS NOT NULL
	DROP TABLE IAT_PLATFORM_CONFIG
CREATE TABLE IAT_PLATFORM_CONFIG --ƽ̨���ñ�
  (
     PLATFORM_CONFIG_ID             UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--����ID
     PARTNER_ID                     INT NOT NULL UNIQUE,--������ID
     WORKDAY_OPEN_TICKET_START_TIME CHAR(4),--�����տ�Ʊ��ʼʱ��
     WORKDAY_OPEN_TICKET_END_TIME   CHAR(4),--�����տ�Ʊ����ʱ��
     WEEKEND_OPEN_TICKET_START_TIME CHAR(4),--��ĩ��Ʊ��ʼʱ��
     WEEKEND_OPEN_TICKET_END_TIME   CHAR(4),--��ĩ��Ʊ����ʱ��
     REST_NO_TICKET                 BIT DEFAULT(0),--�����Ƿ�Ʊ��0����Ʊ��1������Ʊ��
     INVALID_TIME                   CHAR(4),--��Ʊʱ��(���� 18:00��ǰ)
     OPEN_TICKET_FEE                MONEY DEFAULT(0),--��Ʊ��
     INVALID_TICKET_FEE             MONEY DEFAULT(0),--��Ʊ��
     CREATER                        NVARCHAR(10) NOT NULL,--������
     CREATER_ID                     INT NOT NULL,--������ID
     CREATE_TIME                    DATETIME NOT NULL DEFAULT(GETDATE()) --����ʱ��
  )

 IF OBJECT_ID('IAT_PLATFORM_EXPRESS') IS NOT NULL
	DROP TABLE IAT_PLATFORM_EXPRESS
CREATE TABLE IAT_PLATFORM_EXPRESS --ƽ̨��ݱ�
  (
     PLATFORM_EXPRESS_ID UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--����ID
     EXPRESS_NAME        NVARCHAR(20) NOT NULL UNIQUE,--�������
     PARTNER_ID          INT NOT NULL UNIQUE,--������ID
     CREATER             NVARCHAR(10) NOT NULL,--������
     CREATER_ID          INT NOT NULL,--������ID
     CREATE_TIME         DATETIME NOT NULL DEFAULT(GETDATE()) --����ʱ��
  )

 IF OBJECT_ID('IAT_FREQUENT_FLYER') IS NOT NULL
	DROP TABLE IAT_FREQUENT_FLYER
CREATE TABLE IAT_FREQUENT_FLYER --���ÿ�
  (
     FREQUENT_FLYER_ID      UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--����ID
     PARTNER_ID             INT NOT NULL,--������ID
     ENGLIGH_NAME           VARCHAR(20) NOT NULL,--Ӣ������
     PASSENGER_TYPE_ID      UNIQUEIDENTIFIER NOT NULL,--�˿�����ID
     GENDER                 CHAR(1) NOT NULL,--�˿��Ա�(�У�Ů)
     DOCUMENT_TYPE_ID       UNIQUEIDENTIFIER NOT NULL,--֤������ID
     IDENTIFICATION_NUMBERS VARCHAR(20) NOT NULL,--֤������
     VALIDITY_PERIOD        DATETIME NOT NULL,--֤����Ч��
     BIRTHDATE              DATETIME NOT NULL,--��������
     NATIONALITY            VARCHAR(20) NOT NULL, --����
     CONSTRAINT USER_UNIQUE UNIQUE (ENGLIGH_NAME, IDENTIFICATION_NUMBERS)
  )

--������
 IF OBJECT_ID('IAT_INVOICE_INFO') IS NOT NULL
	DROP TABLE IAT_INVOICE_INFO
CREATE TABLE IAT_INVOICE_INFO-- ��Ʊ��Ϣ�����
  (
     INVOICE_INFO_ID     UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--����ID
     INVOICE_BOOK_NUMBER INT NOT NULL UNIQUE,--��Ʊ����
     PAGES_PER_BOOK      INT,--ÿ������
     START_NUMBER        VARCHAR(15) NOT NULL,--��ʼƱ��
     END_NUMBER          VARCHAR(15) NOT NULL,--����Ʊ��
     ADD_TIME            DATETIME NOT NULL DEFAULT(GETDATE()),--���ʱ��
     GRANT_TIME          DATETIME DEFAULT(GETDATE()),--����ʱ��
     GRANT_SOURCE        VARCHAR(20),--���ų���
     STATUS              BIT NOT NULL DEFAULT(0),--����״̬ ��0��δ���� 1���ѷ��ţ�
     OPERATOR            NVARCHAR(10) NOT NULL,--�����
     OPERATOR_ID         INT NOT NULL,--�����ID
     GRANT_OPERATOR_ID   INT,--������ID
     GRANT_OPERATOR_NAME NVARCHAR(10)--����������
  )
  
   IF OBJECT_ID('IAT_FINANCIAL_REFUND') IS NOT NULL
	DROP TABLE IAT_FINANCIAL_REFUND
CREATE TABLE IAT_FINANCIAL_REFUND --�����˿��
  (
     FINANCIAL_REFUND_ID  UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED,--����ID
     SUPPLIER_ID		  INT  NOT NULL ,--��Ӧ��ID
     ORDER_NO             VARCHAR(20),--������ 
     ORDER_TICKET_ID      UNIQUEIDENTIFIER,--Ʊ��
     REFUND_AMOUNT        MONEY NOT NULL DEFAULT(0),--�˿���
     REFUND_STATUS        INT NOT NULL DEFAULT(50),--�˿�״̬  �˿������(50)������˻�(51)���˿���(52)���˿����(53)
     REQUEST_REFUND_ID    INT NOT NULL ,--�ύ�˿���ID
     REQUEST_REFUND_TIME  DATETIME NOT NULL DEFAULT(GETDATE()),--�ύ�˿�ʱ��
     PAYMENT_SERIAL_NUMBER VARCHAR(50) ,--�ͻ�֧����ˮ��
     REFUND_BATCH_NO       VARCHAR(50),--�˿����κ�
     LOCKED               BIT NOT NULL DEFAULT(0),--�Ƿ�����
     LOCKED_OPERATOR      INT,--������ID
     LOCKED_OPERATOR_NAME NVARCHAR(10),--����������
     LOCKED_TIME          DATETIME DEFAULT(GETDATE()),--����ʱ��
     REFUND_TYPE		  INT NOT NULL DEFAULT(1),--�˿����ͣ�1����Ʊ��2����Ʊ ��3����ǩ��
     ORDER_REFUND_ID	  UNIQUEIDENTIFIER  ,--��ƱID
     ORDER_ALTERATIONS_ID  UNIQUEIDENTIFIER,--��ǩID
     INVALID_ID				UNIQUEIDENTIFIER,--��ƱID
     REFUND_OPERATOR_ID  INT, --�˿���ID
     REFUND_OPERATOR_NAME NVARCHAR(10),--�˿�������
     REFUND_TIME  DATETIME ,--�˿�ʱ��
     CREATE_TIME		 DATETIME NOT NULL DEFAULT(GETDATE()) --����ʱ��
  ) 
