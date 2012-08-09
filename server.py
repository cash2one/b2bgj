#!/usr/bin/python
# -*- coding: utf8 -*-
import tornado.ioloop
import tornado.web
import tornado.escape
import os.path
import time

url_escape = tornado.escape.url_escape

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", MainHandler),
            (r"/jsonp/[^/]+", jsonpHandler),
            (r"/(guoji)/(?<!ajax)([^/]+).html", GuojiHandler),
            (r"/(guoji)/ajax/(.+)", GuojiAjaxHandler),
            (r"/(guonei)/(?<!ajax)([^/]+).html", GuoneiHandler),
            (r"/(guonei)/ajax/(.+)", GuoneiAjaxHandler),
        ]
        settings = dict(
            debug='yes',
            static_url_prefix='/static/',
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            #cookie_secret="43oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo=",
            #login_url="/auth/login",
            #xsrf_cookies=True,
            #autoescape="xhtml_escape",
        )

        tornado.web.Application.__init__(self, handlers, **settings)


class jsonpHandler(tornado.web.RequestHandler):
    def get(self):
        callback = self.get_argument('callback',default='null')
        currenttime = time.ctime()
        data = '''({"query":{"count":10,"created":"xxx","lang":"en-US","results":{"Result":[{"id":"21341983","Phone":"%s","Title":"Giovanni's Pizzaria","Address":"1127 N Lawrence Expy","City":"Sunnyvale"}]}}})'''%(currenttime)
        self.write(callback+data)


class MainHandler(tornado.web.RequestHandler):
    def get(self, pagename = 'index'):
        data = {
            'title':pagename,
        }
        self.render('index.html')


class GuoneiHandler(tornado.web.RequestHandler):
    def get(self, section, pagename = 'index'):
        usergroup = self.get_argument('usergroup',default='cgs')
        if(usergroup=='yys'):
            data = {
                'usergroup':'运营商',
                'sidebar':[
                    [u'机票采购',
                     [u'PNR预订',u'白屏预订']
                    ],
                    [u'国际订单管理',
                     [u'出票订单',u'改签订单',u'退票订单',u'废票订单',u'退款订单']
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
                     [u'国内PNR导入',u'国内航班查询',u'团队票申请',u'申请行程单']
                    ],
                    [u'国内机票订单',
                     [u'订单管理',u'改签订单',u'退废票订单',u'询价订单',u'查询所有订单',u'已购电子保险',u'航班延误证明']
                    ],
                    [u'行程单管理',
                     [u'我的行程单',u'行程单使用明细',u'行程单管理',u'设置邮寄地址']
                    ],
                    [u'保险服务',[
                        u'购买保险',u'保险订单',u'保险单管理',u'服务产品'
                    ]],
                    [u'基础信息查询',[
                        u'查询三字码',u'查询代理费',u'退改签公告',u'查询航班动态',u'行程单细则'
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
class GuojiHandler(tornado.web.RequestHandler):
    def get(self, section, pagename = 'index'):
        usergroup = self.get_argument('usergroup',default='cgs')
        if(usergroup=='yys'):
            data = {
                'usergroup':'运营商',
                'sidebar':[
                    [u'机票采购', [
                        u'PNR预订',u'白屏预订']
                    ],
                    [u'国际订单管理', [
                        u'出票订单',u'改签订单',u'退票订单',u'废票订单',u'退款订单']
                    ],
                    [u'机票出票管理', [u'处理已支付订单',u'待审核订单',u'退票订单',u'废票订单']
                    ],
                    [u'国际政策管理',
                        [u'国际返点查询',u'新增国际返点',u'国际政策导入'] 
                    ],
                    [u'发票信息管理',[
                        u'发票信息查询',
                        u'入库信息管理', ]
                    ],
                    [u'基础数据维护',[
                        u'基础数据维护', ]
                    ],
                ],
            }

        if (usergroup=='gys'):
            data = {
                'usergroup':'供应商',
                'sidebar':[
                    [u'国际订单管理',
                     [u'已支付订单',u'待审核订单',u'退票订单',u'废票订单']
                    ],
                    [u'国际政策管理',
                        [u'国际返点查询',u'新增国际返点',u'国际政策导入'] 
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
                    [u'机票采购',
                     [u'PNR预订',u'白屏预订']
                    ],
                    [u'国际订单管理',
                     [u'出票订单',u'改签订单',u'退票订单',u'废票订单',u'退款订单']
                    ],
                    [u'政策管理',
                     [u'普通政策',u'特价政策']
                    ],
                    [u'机票统计',[
                        u'机票统计',
                    ]],
                    [u'发票信息管理',[
                        u'发票信息查询',
                    ]],
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
        template = 'guoji/ajax/'+pagename.encode('utf-8')
        self.render(template)

#application = tornado.web.Application([
#    (r"/", MainHandler),
#])

if __name__ == "__main__":
    app = Application()
    app.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
