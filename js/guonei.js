head.js('http://gnjp.10106266.com/js/kendo/kendo.web.min.js' ,'http://gnjp.10106266.com/js/kendo/cultures/kendo.culture.zh-CHS.min.js' ,'http://gnjp.10106266.com/css/kendo/kendo.common.min.css' ,'http://gnjp.10106266.com/css/kendo/kendo.default.min.css');
head.ready(function(){
    kendo.culture("zh-CHS");
    /* /FlightReserve/DataAssistant/GetCitys.aspx */

    $(".suggest-city").kendoAutoComplete({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: 'http://testgnjp.10106266.com/FlightReserve/DataAssistant/GetCitys.aspx',
        filter: "contains",
        suggest: true,
        index: 3
    });

    $(".timepicker").kendoTimePicker();
    $(".datepicker").kendoDatePicker();
    $(".sel_airlines").kendoComboBox({
        filter: "contains",
        suggest: true,
        index: 3
    });
    // var eve = {"2013\/02\/05":["\u00a516800","BM-1302056S-001"],"0":null}
    // $(document).ready(function () {
    //     run_sale_calendar();
    //     function run_sale_calendar() {
    //         var today = new Date();
    //         var sale = (function () {
    //             var arr = [];
    //             for (name in eve) {
    //                 arr.push(+new Date(name));
    //             }
    //             return arr;
    //         })();

    //         $.dateToString = function (s, sep) {
    //             var sep = sep || '/'
    //             return [s.getFullYear(), (s.getMonth() < 9 ? "0" : "") + (s.getMonth() + 1), (s.getDate() < 10 ? "0" : "") + s.getDate()].join(sep);
    //         };

    //         $.go = function (date) {
    //             if(typeof(eve[date]) != undefined){
    //                 location.href="?c=travel&m=detail&teamid=" + eve[date][1];
    //             }
    //         };

    //         $("#tour_calendar").kendoCalendar({
    //             max: new Date(today.getFullYear(), today.getMonth() + 2, 31),
    //             min: new Date(today.getFullYear(), today.getMonth() - 1, 1),
    //             value: today,
    //             dates: sale,
    //             month: {
    //                 // template for dates in month view
    //                 content:
    //                     '<div onclick="$.go(\'#= $.dateToString(date) #\')">' +
    //                     '#= data.value #' +
    //                     '# if ($.inArray(+data.date, data.dates) != -1) { #' +
    //                     '<div class="price">' +
    //                     '#= eve[$.dateToString(date)][0] #' +
    //                     '</div>' +
    //                     '# }else{ #' +
    //                     '<div class="price">&nbsp;</div>' +
    //                     '# } #' +
    //                     '</a></div>'
    //             }
    //             , footer: "今天- #=kendo.toString(data, 'd') #"
    //         });
    //         var cancellables = $(".k-nav-fast,.k-other-month")
    //         cancellables.unbind();
    //         cancellables.click(function (e) {
    //             e.preventDefault();
    //             e.stopPropagation();
    //         });
    //     }
    // });
});

function process_py(arr) {
    var obj = {
        "AF": [],
        "GL": [],
        "MR": [],
        "SZ": []
    };

    $.each(arr, function(i, index) {
        var first_letter = i.AirportCode.charCodeAt(0);
        if (first_letter >= 65 && first_letter <= 70) {
            obj["AF"].push(i);
        }

        if (first_letter >= 71 && first_letter <= 76) {
            obj["GL"].push(i);
        }

        if (first_letter >= 77 && first_letter <= 82) {
            obj["MR"].push(i);
        }

        if (first_letter >= 83 && first_letter <= 90) {
            obj["SZ"].push(i);
        }
    });

    return obj;
}
