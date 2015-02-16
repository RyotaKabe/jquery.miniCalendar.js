(function($) {
    //プラグイン定義
    $.fn.call_miniCalendar = function call_miniCalendar(baseOption,cssOption,dayClickMotion){
         
        var calContainer = $(this);

        //引数を設定する
        var baseOptionDefault = {
            lastIcon:'<<',
            nextIcon:'>>',
            yearLeft: '',
            yearRight: '年',
            monthLeft: '',
            monthRight: '月',
            weekWord:['日','月','火','水','木','金','土'],
            dateLeft: '',
            dateRight: '',
            monthChanger: 0
        };

        var cssOptionDefault = {
            lastIcom: '',
            nextIcon: '',
            year: '',
            month: '',
            weekHeaderFont:{
                fontWeight:'bold'
            },
            weekHeaderColor:{
                sun:'',
                mon:'',
                tue:'',
                wed:'',
                thu:'',
                fri:'',
                sat:''
            },
            weekColor:{
                sun:'red',
                mon:'silver',
                tue:'silver',
                wed:'silver',
                thu:'silver',
                fri:'silver',
                sat:'blue'
            }
        }
        //引数をデフォルトオブジェクトに上書き（マージ）
        var baseOption = $.extend(baseOptionDefault, baseOption);
        var cssOption = $.extend(cssOptionDefault, cssOption);

        //カレンダーをつくる
        var calHtml = make_miniCalendar(baseOption);

        //カレンダーを表示する
        calContainer.html(calHtml);

        //カレンダーを装飾する
        design_miniCalendar(cssOption);

        //マウスオーバーの設定
        $('.mC_date,#mC_last,#mC_next').on({
            'mouseenter': function() {
                $(this).css('cursor','pointer');
            },
            'mouseleave': function() {
                $(this).css('cursor','default');
            }
        });


        //リスナーを準備する bwClckLisはbetweenClickListenerの略。（これを挟まないと、引数をリスナーに渡せない）
        function bwClckLis_next(calContainer){
            return function(){
                baseOption.monthChanger++;
                calContainer.call_miniCalendar(baseOption,cssOption,dayClickMotion);
            }
        }
        $('#mC_next').on('click',bwClckLis_next(calContainer));
        
        function bwClckLis_last(calContainer){
            return function(){
                baseOption.monthChanger--;
                calContainer.call_miniCalendar(baseOption,cssOption,dayClickMotion);
            }
        }
        $('#mC_last').on('click',bwClckLis_last(calContainer));
        
        function bwClckLis_day(calContainer){
            return function(){
                var selectDay = {
                    year:   Number(($('#mC_year').text()).match(/\d+/)),
                    month:  Number(($('#mC_month').text()).match(/\d+/)),
                    date:   Number($(this).text()),//日付
                    day:    Number($(this).attr('day'))//曜日
                }
                dayClickMotion(selectDay);//ユーザーがつくった関数（jQueryでもらった関数）
            }
        }
        $('.mC_date').on('click',bwClckLis_day(calContainer));

        //メソッドチェーン対応(thisを返す)
        return(this);

        function make_miniCalendar(bo){

            var date = new Date();
            date.setMonth(date.getMonth() + bo.monthChanger);

            var header = '<div id="mC"><div id="mC_move"><div id="mC_last">' + bo.lastIcon + '</div><div id="mC_next">' + bo.nextIcon + '</div></div><mC_year id="mC_year">' + date.getFullYear() + bo.yearRight + '</mC_year><mC_month id="mC_month"> ' + (date.getMonth() +1) + bo.monthRight + ' </mC_month><br/>';
            var table = '<table id="mC_table">' + make_table(bo) + '</table>';
            var footer = '</div>'

            function make_table(bo){

                //ヘッダー作成
                var content = '<tr id="mC_days">';
                for(var i=0; i<7; i++){
                    content += '<th day="' + i + '">' + bo.weekWord[i] + '</th>';
                }
                content += '</tr>';

                //カレンダー本体の初期化処理
                var firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
                var firstDayOfWeek = firstDate.getDay();//週の最初の曜日を取得
                var dateCnt = 1;
                var maxDate = calc_maxOfMonth(bo);

                //カレンダー本体の作成
                for(var i=1; i<7; i++){
                    content += '<tr>';
                    for(var j=0; j<7; j++){
                        content += '<td class="mC_date" day="' + j + '">';
                        if(i==1){//最初の行の
                            if(j >= firstDayOfWeek){//始まり曜日以降であるか
                                content += dateCnt;
                                dateCnt++;
                            }
                        }else{
                            if(dateCnt <= maxDate){//最終日まで繰り返す
                                content += dateCnt;
                                dateCnt++;    
                            }
                        }

                        content += '</td>';
                    }
                    content += '</tr>';
                }

                return content;

                function calc_maxOfMonth(bo){
                    var thisMonth = date.getMonth()+1;
                    if(thisMonth == 2){
                        var year = date.getFullYear();
                        if(year%4 == 0){
                            if(year%100 == 0){
                                if(year%400 == 0){
                                    return 29;
                                }
                                return 28;//100年に一度の年は平年に戻る
                            }
                            return 29;
                        }
                        return 28;
                    }
                    switch(thisMonth){
                        case 4:
                            return 30;
                        case 6:
                            return 30;
                        case 9:
                            return 30;
                        case 11:
                            return 30;
                        default:
                            return 31;
                    }
                }
            }

            return header + table + footer;
        }

        function design_miniCalendar(co){
                // $('mC_days')        .css('font-weight'          ,co.weekHeaderFont          );
                $('#mC').css('width','150');
//                $('#mC').css('text-align','center');
                $('#mC').css('margin','0 auto');
                $('mC_move').css('color'      ,'green'         );
                $('#mC_last').css('float','left');
                $('#mC_last').css('text-align','left');
                $('#mC_next').css('text-align','right');
                $('#mC_days').css('font-weight','lighter');
                $('#mC_days').css('color'         ,'green'      );
                $('td[day="0"]')   .css('color'     ,co.weekColor.sun       );
                $('td[day="1"]')   .css('color'     ,co.weekColor.mon       );
                $('td[day="2"]')   .css('color'     ,co.weekColor.tue       );
                $('td[day="3"]')   .css('color'     ,co.weekColor.wed       );
                $('td[day="4"]')   .css('color'     ,co.weekColor.thu       );
                $('td[day="5"]')   .css('color'     ,co.weekColor.fri       );
                $('td[day="6"]')   .css('color'     ,co.weekColor.sat       );
        }
    };

})(jQuery);