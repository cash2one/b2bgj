Ext.onReady(function(){
    Ext.create('Ext.data.Store', {
        storeId:'table1',
        fields:['hkgs', 'cw', 'oh','zdcl','qzgl','tpgd','gqgd','khbz','nbbz','yxq'],
        data:{'items':[
            { 'hkgs': 'MU',  "cw":"FC",  "zdcl":"是","qzgl":"是","tpgd":"退票：免手续；不可废票","gqgd":"改期：免手续费；不可升舱；","qzgd":"不可签转"  },
            { 'hkgs': 'MU',  "cw":"FC",  "zdcl":"是","qzgl":"是","tpgd":"退票：免手续；不可废票","gqgd":"改期：免手续费；不可升舱；","qzgd":"不可签转"  },
            { 'hkgs': 'MU',  "cw":"FC",  "zdcl":"是","qzgl":"是","tpgd":"退票：免手续；不可废票","gqgd":"改期：免手续费；不可升舱；","qzgd":"不可签转"  },
            { 'hkgs': 'MU',  "cw":"FC",  "zdcl":"是","qzgl":"是","tpgd":"退票：免手续；不可废票","gqgd":"改期：免手续费；不可升舱；","qzgd":"不可签转"  },
            { 'hkgs': 'MU',  "cw":"FC",  "zdcl":"是","qzgl":"是","tpgd":"退票：免手续；不可废票","gqgd":"改期：免手续费；不可升舱；","qzgd":"不可签转"  },
            { 'hkgs': 'MU',  "cw":"FC",  "zdcl":"是","qzgl":"是","tpgd":"退票：免手续；不可废票","gqgd":"改期：免手续费；不可升舱；","qzgd":"不可签转"  },
            { 'hkgs': 'MU',  "cw":"FC",  "zdcl":"是","qzgl":"是","tpgd":"退票：免手续；不可废票","gqgd":"改期：免手续费；不可升舱；","qzgd":"不可签转"  },
            { 'hkgs': 'MU',  "cw":"FC",  "zdcl":"是","qzgl":"是","tpgd":"退票：免手续；不可废票","gqgd":"改期：免手续费；不可升舱；","qzgd":"不可签转"  },
            { 'hkgs': 'MU',  "cw":"FC",  "zdcl":"是","qzgl":"是","tpgd":"退票：免手续；不可废票","gqgd":"改期：免手续费；不可升舱；","qzgd":"不可签转"  },
            { 'hkgs': 'MU',  "cw":"FC",  "zdcl":"是","qzgl":"是","tpgd":"退票：免手续；不可废票","gqgd":"改期：免手续费；不可升舱；","qzgd":"不可签转"  }
        ]},
        proxy: {
            type: 'memory',
            reader: {
                type: 'json',
                root: 'items'
            }
        }
    });

    var selModel = Ext.create('Ext.selection.CheckboxModel', {
        listeners: {
            selectionchange: function(sm, selections) {
                grid4.down('#removeButton').setDisabled(selections.length == 0);
            }
        }
    });

    Ext.create('Ext.grid.Panel', {
        store: Ext.data.StoreManager.lookup('table1'),
        selModel: selModel,
        columns: [
            { text: '航空公司', dataIndex: 'hkgs' },
            { text: '舱位', dataIndex: 'cw' },
            { text: 'OFFICE号', dataIndex: 'oh' },
            { text: '自动处理', dataIndex: 'zdcl' },
            { text: '强制关联', dataIndex: 'qzgl' },
            { text: '退票规定', dataIndex: 'tpgd' },
            { text: '改签规定', dataIndex: 'gqgd' },
            { text: '客户备注', dataIndex: 'khbz' },
            { text: '内部备注', dataIndex: 'nbbz' },
            { text: '有效期', dataIndex: 'yxq' }
        ],
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            layout: {
                pack: 'center'
            },
            items: [{
                minWidth: 80,
                text: '保存'
            },{
                minWidth: 80,
                text: '重置'
            }]
        }, {
            xtype: 'toolbar',
            items: [{
                text:'添加'
            }, '-', {
                text:'修改'
            },'-',{
                text:'删除'
            },'-',{
                text:'批量导入'
            },'-',{
                text:'批量导出'
            },'-',{
                text:'下载模板'
            }]
        }],
        renderTo: Ext.getBody()
    });

});
