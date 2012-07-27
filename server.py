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
            (r"/guoji/(.+)\.html", GuojiHandler),
        ]
        settings = dict(
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
        #template = 'templates/'+pagename.encode('utf-8')+'.html'
        #self.render(template, data = data )


class GuojiHandler(tornado.web.RequestHandler):
    def get(self, pagename = 'index'):
        data = {
            'title':pagename,
            'sidebar':[
                [u'机票采购',
                    [u'PNR码预订',u'白屏预订'] 
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

#application = tornado.web.Application([
#    (r"/", MainHandler),
#])

if __name__ == "__main__":
    app = Application()
    app.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
