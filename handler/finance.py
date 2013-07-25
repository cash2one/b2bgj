#!/usr/bin/env python
# coding=utf-8
#
# Copyright 2012 F2E.im
# Do have a faith in what you're doing.
# Make your life a story worth telling.

import uuid
import hashlib
import StringIO
import time
import json
import re
import urllib2
import tornado.web
import lib.jsonp

from base import *
from lib.variables import *

class FinanceHandler(BaseHandler):
    def get(self, path, template_variables = {}):
        title = re.sub(r'^[^/]+/','',path)
        title = u'财务 '+title.replace('/', ' ')
        template_variables['title'] = title
        self.render(path+'.html', **template_variables)

