#!/usr/bin/python
# -*- coding: utf8 -*-
import tornado.ioloop
import tornado.web
import tornado.escape
import os.path
import time
import tornado.template

import handler.base
import handler.finance
import handler.kh
import handler.gjjp
import handler.gnjp

from tornado.options import define, options
from lib.loader import Loader
from lib.session import Session, SessionManager
from jinja2 import Environment, FileSystemLoader


tpl = tornado.template
template_path=os.path.join(os.path.dirname(__file__), "templates")
loader = tpl.Loader(template_path)

url_escape = tornado.escape.url_escape

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", MainHandler),
            (r"/jsonp/[^/]+", jsonpHandler),

            # (r"/images/(.*)", tornado.web.StaticFileHandler, {"path": "/home/sean/www/proto-b2b/static/images"}),
            # (r"/css/(.*)", tornado.web.StaticFileHandler, {"path": "/home/sean/www/proto-b2b/static/css"}),
            # (r"/js/(.*)", tornado.web.StaticFileHandler, {"path": "/home/sean/www/proto-b2b/static/js"}),

            (r"/(finance/.+[^/]+).html", handler.finance.FinanceHandler),
            (r"/(kh/.+[^/]+).html", handler.kh.KhHandler),
            (r"/(gnjp/.+[^/]+).html", handler.gnjp.GnjpHandler),
            (r"/(gjjp/.+[^/]+).html", handler.gjjp.GjjpHandler)
        ]

        settings = dict(
            debug = 'yes',
            blog_title = u"F2E Community",
            template_path = os.path.join(os.path.dirname(__file__), "templates"),
            # static_path = os.path.join(os.path.dirname(__file__), "static"),
            xsrf_cookies = True,
            cookie_secret = "cookie_secret_code",
            login_url = "/login",
            autoescape = None,
            jinja2 = Environment(loader = FileSystemLoader(os.path.join(os.path.dirname(__file__), "templates")), trim_blocks = True),
            reserved = ["user", "topic", "home", "setting", "forgot", "login", "logout", "register", "admin"],
        )

        # settings = dict(
        #     debug='yes',
        #     # static_url_prefix='//static.b2b.com/',
        #     static_path=os.path.join(os.path.dirname(__file__), "static"),
        #     template_path=template_path,
        #     #cookie_secret="43oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo=",
        #     #login_url="/auth/login",
        #     #xsrf_cookies=True,
        #     autoescape=None,
        #     compress_whitespace=None
        # )

        tornado.web.Application.__init__(self, handlers, **settings)


class jsonpHandler(tornado.web.RequestHandler):
    def get(self):
        callback = self.get_argument('callback',default='null')
        currenttime = time.ctime()
        data = '''({"query":{"count":10,"created":"xxx","lang":"en-US","results":{"Result":[{"id":"21341983","Phone":"%s","Title":"Giovanni's Pizzaria","Address":"1127 N Lawrence Expy","City":"Sunnyvale"}]}}})'''%(currenttime)
        self.write(callback+data)


class MainHandler(tornado.web.RequestHandler):
    def get(self, pagename = 'index'):
        self.render('index.html')


class GuoneiHandler(MainHandler):
    def get(self, section, pagename = 'index'):
        usergroup = self.get_argument('usergroup',default='cgs')
        if(usergroup=='yys'):
            data = {
                'usergroup':'运营商',
                'sidebar':[
                    [u'机票采购',
                     [
                         [u'PNR预订',u'PNR预订'],
                         [u'白屏预订',u'白屏预订'],
                     ]
                    ],
                    [u'国际订单管理',
                     [
                         [u'出票订单',u'出票订单'],
                         [u'改签订单',u'改签订单'],
                         [u'退票订单',u'退票订单'],
                         [u'废票订单',u'废票订单'],
                         [u'退款订单',u'退款订单'],
                     ]
                    ],
                    [u'发票信息管理',[
                        u'发票信息查询',
                        u'入库信息管理',
                    ]],
                    [u'基础数据维护',[
                        u'基础数据维护',
                    ]],
                ],
            }

        if (usergroup=='gys'):
            data = {
                'usergroup':'供应商',
                'sidebar':[
                    [u'国际订单管理',
                     [u'已支付订单',u'待审核订单',u'退票订单',u'废票订单']
                    ],
                    [u'政策管理',
                     [u'国际返点管理']
                    ],
                    [u'财务管理',
                     [u'退款订单',u'机票统计']
                    ],
                    [u'基础数据维护',[
                        u'基础数据维护',
                    ]],
                ],
            }

        if (usergroup=='cgs'):
            data = {
                'usergroup':'采购商',
                'sidebar':[
                    [u'查询预订',
                     [
                         [u'国内PNR导入',u'1-1国内机票PNR导入-成人'],
                         [u'国内航班查询',u'2-1国内航班查询-默认'],
                         [u'团队票申请',u'团队票申请'],
                         [u'申请行程单',u'申请行程单'],
                     ]
                    ],
                    [u'国内机票订单',
                     [
                         [u'订单管理',u'订单管理'],
                         [u'改签订单',u'改签订单'],
                         [u'退废票订单',u'退废票订单'],
                         [u'询价订单',u'询价订单'],
                         [u'查询所有订单',u'查询所有订单'],
                         [u'已购电子保险',u'已购电子保险'],
                         [u'航班延误证明',u'航班延误证明'],
                     ]
                    ],
                    [u'行程单管理',
                     [
                         [u'我的行程单',u'我的行程单'],
                         [u'行程单使用明细',u'行程单使用明细'],
                         [u'行程单管理',u'行程单管理'],
                         [u'设置邮寄地址',u'设置邮寄地址'],
                     ]
                    ],
                    [u'保险服务',[
                        [u'购买保险',u'购买保险'],
                        [u'保险订单',u'保险订单'],
                        [u'保险单管理',u'保险单管理'],
                        [u'服务产品',u'服务产品'],
                    ]],
                    [u'基础信息查询',[
                        [u'查询三字码',u'查询三字码'],
                        [u'查询代理费',u'查询代理费'],
                        [u'退改签公告',u'退改签公告'],
                        [u'查询航班动态',u'查询航班动态'],
                        [u'行程单细则',u'行程单细则'],
                    ]],
                ],
            }

        data['parent_title']='国内机票'
        data['title']=pagename
        data['section']=section

        template = 'guonei/'+pagename.encode('utf-8')+'.html'
        self.render(template, data = data, usergroup = usergroup)


class GuoneiAjaxHandler(GuoneiHandler):
    def get(self, section, pagename = 'index'):
        template = 'guonei/ajax/'+pagename.encode('utf-8')
        self.render(template)


#GUOJI
#######################
class GuojiHandler(MainHandler):
    def post(self, section, pagename = 'index'):
        args = self.request.arguments
        self.set_header("Content-Type", "text/plain")
        self.write('0,GJJP120905B1000061');

    def get(self, section, pagename = 'index'):
        usergroup = self.get_argument('usergroup',default='cgs')
        if(usergroup=='yys'):
            data = {
                'usergroup':'运营商',
                'sidebar':[
                    [u'机票采购', [
                        [u'PNR预订',u'PNR预订'],
                        [u'白屏预订',u'白屏预订'],
                    ]
                    ],
                    [u'国际订单管理', [
                        [u'出票订单',u'出票订单'],
                        [u'改签订单',u'改签订单'],
                        [u'退票订单',u'退票订单'],
                        [u'废票订单',u'废票订单'],
                        [u'退款订单',u'退款订单'],
                    ]
                    ],
                    [u'机票出票管理', [
                        [u'已支付订单',u'已支付订单'],
                        [u'待审核订单',u'待审核订单'],
                    ]
                    ],
                    [u'国际政策管理',
                        [
                            [u'国际返点查询',u'国际返点查询'],
                            [u'新增国际返点',u'新增国际返点'],
                            [u'国际政策导入',u'国际政策导入'],
                        ]
                    ],
                    [u'发票信息管理',[
                        [u'发票信息查询',u'发票信息查询'],
                        [u'入库信息管理',u'入库信息管理'],
                    ]
                    ],
                    [u'基础数据维护',[
                        [u'基础数据维护',u'基础数据维护'],
                    ]
                    ],
                    [u'线下订单管理',[
                        [u'待出票定单',u'线下订单管理出票订单'],
                        [u'待改签订单',u'线下订单管理改签订单'],
                        [u'待退废订单',u'线下订单管理退废票订单'],
                        [u'PNR提交预定单',u'线下订单管理PNR提交预订单'],
                        [u'预定单',u'线下订单管理预订单'],
                        [u'出票定单',u'线下订单管理出票订单'],
                        [u'已改签订单',u'线下订单管理改签订单'],
                        [u'退废票订单',u'线下订单管理退废票订单'],
                    ]]
                ],
            }

        if (usergroup=='gys'):
            data = {
                'usergroup':'供应商',
                'sidebar':[
                    [u'国际订单管理',
                     [
                         [u'已支付订单',u'已支付订单'],
                         [u'待审核订单',u'待审核订单'],
                         [u'退票订单',u'退票订单'],
                         [u'废票订单',u'废票订单'],
                     ]
                    ],
                    [u'国际政策管理',
                        [
                            [u'国际返点查询',u'国际返点查询'],
                            [u'新增国际返点',u'新增国际返点'],
                            [u'国际政策导入',u'国际政策导入'],
                        ]
                    ],
                    [u'财务管理',
                     [
                         [u'退款订单',u'退款订单'],
                         [u'机票统计',u'机票统计'],
                     ]
                    ],
                    [u'基础数据维护',[
                        [u'基础数据维护',u'基础数据维护'],
                    ]],
                ],
            }

        if (usergroup=='cgs'):
            data = {
                'usergroup':'采购商',
                'sidebar':[
                    [u'机票采购',
                     [
                         [u'PNR预订',u'PNR预订'],
                         [u'白屏预订',u'白屏预订'],
                     ]
                    ],
                    [u'国际订单管理',
                     [
                         [u'出票订单',u'出票订单'],
                         [u'改签订单',u'改签订单'],
                         [u'退票订单',u'退票订单'],
                         [u'废票订单',u'废票订单'],
                         [u'退款订单',u'退款订单'],
                     ]
                    ],
                    [u'政策管理',
                     [
                         [u'普通政策',u'普通政策'],
                         [u'特价政策',u'特价政策'],
                     ]
                    ],
                    [u'机票统计',[
                        [u'机票统计',u'机票统计'],
                    ]],
                    [u'发票信息管理',[
                        [u'发票信息查询',u'发票信息查询'],
                    ]],
                    [u'线下订单管理',[
                        [u'PNR提交预定单',u'线下订单管理PNR提交预订单'],
                        [u'预定单',u'线下订单管理预订单'],
                        [u'出票定单',u'线下订单管理出票订单'],
                        [u'已改签订单',u'线下订单管理改签订单'],
                        [u'退废票订单',u'线下订单管理退废票订单'],
                    ]]
                ],
            }

        data['parent_title']='国际机票'
        data['title']=pagename
        data['section']=section

        template = 'guoji/'+pagename.encode('utf-8')+'.html'
        self.render(template, data = data, usergroup = usergroup)

    #def post(self):
        #    self.set_header("Content-Type", "text/plain")
        #    self.write("You wrote " + self.get_argument("message"))


class GuojiAjaxHandler(GuojiHandler):
    def get(self, section, pagename = 'index'):
        args = self.request.arguments
        template = 'guoji/ajax/'+pagename.encode('utf-8')
        self.render(template,args=args)

#application = tornado.web.Application([
#    (r"/", MainHandler),
#])

class GnjpHandler(MainHandler):
    def post(self, section, pagename = 'index'):
        args = self.request.arguments
        self.set_header("Content-Type", "text/plain")
        self.write('0,GJJP120905B1000061')

    def get(self, section, pagename = 'index'):
        usergroup = self.get_argument('usergroup',default='cgs')
        data={}
        data['parent_title']='国内机票'
        data['title']=pagename
        data['section']=section

        template = 'gnjp/'+pagename.encode('utf-8')+'.html'
        self.render(template, data = data, usergroup = usergroup)


class GjjpHandler(MainHandler):
    def post(self, section, pagename = 'index'):
        args = self.request.arguments
        self.set_header("Content-Type", "text/plain")
        self.write('0,GJJP120905B1000061')

    def get(self, section, pagename = 'index'):
        usergroup = self.get_argument('usergroup',default='cgs')
        data={}
        data['parent_title']='国际机票'
        data['title']=pagename
        data['section']=section

        template = 'gjjp/'+pagename.encode('utf-8')+'.html'
        self.render(template, data = data, usergroup = usergroup)


class KhHandler(MainHandler):
    def post(self, section, pagename = 'index'):
        args = self.request.arguments
        self.set_header("Content-Type", "text/plain")
        self.write('0,GJJP120905B1000061');

    def get(self, section, pagename = 'index'):
        usergroup = self.get_argument('usergroup',default='cgs')
        data={}
        data['parent_title']='国际机票'
        data['title']=pagename
        data['section']=section

        template = 'kh/'+pagename.encode('utf-8')+'.html'
        self.render(template, data = data, usergroup = usergroup)


class FinanceHandler(MainHandler):
    def get(self, section, pagename = 'index'):
        template = 'finance/'+pagename.encode('utf-8')+'.html'
        self.render(template)


if __name__ == "__main__":
    app = Application()
    app.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
