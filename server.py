#!/usr/bin/python
# -*- coding: utf8 -*- 
import tornado.ioloop
import tornado.web
import tornado.escape
import os.path

url_escape = tornado.escape.url_escape

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", MainHandler),
            (r"/guoji/(?<!ajax)([^/]+).html", GuojiHandler),
            (r"/guoji/ajax/(.+)", GuojiAjaxHandler),
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


class MainHandler(tornado.web.RequestHandler):
    def get(self, pagename = 'index'):
        data = {
            'title':pagename,
        }
        self.write('首页')

class GuojiHandler(tornado.web.RequestHandler):
    def get(self, pagename = 'index'):
        usergroup = self.get_argument('usergroup',default='cgs')
        if(usergroup=='yys'):
            data = {
                'parent_title':'国际机票',
                'usergroup':'运营商',
                'usergroup-id':'yys',
                'title':pagename,
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
                'parent_title':'国际机票',
                'usergroup':'供应商',
                'usergroup-id':'gys',
                'title':pagename,
                'sidebar':[
                    [u'国际订单管理',
                     [u'出票订单',u'审核订单',u'退票订单',u'废票订单'] 
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
                'parent_title':'国际机票',
                'usergroup':'采购商',
                'usergroup-id':'cgs',
                'title':pagename,
                'sidebar':[
                    [u'机票采购',
                     [u'PNR预订',u'白屏预订'] 
                    ],
                    [u'国际订单管理',
                     [u'出票订单',u'改签订单',u'退票订单',u'废票订单',u'退款订单'] 
                    ],
                    [u'政策管理',
                     [u'系统政策',u'特价政策',u'普通政策'] 
                    ],
                    [u'机票统计',[
                        u'机票统计', 
                    ]],
                    [u'发票信息管理',[
                        u'发票信息查询', 
                    ]],
                ],
            }

        template = 'guoji/'+pagename.encode('utf-8')+'.html'
        self.render(template, data = data)

    #def post(self):
    #    self.set_header("Content-Type", "text/plain")
    #    self.write("You wrote " + self.get_argument("message"))

class GuojiAjaxHandler(GuojiHandler):
    def get(self, pagename = 'index'):
        template = 'guoji/ajax/'+pagename.encode('utf-8')
        self.render(template)

#application = tornado.web.Application([
#    (r"/", MainHandler),
#])

if __name__ == "__main__":
    app = Application()
    app.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
