$( window ).on( "load", function(){
    waterfall('main','box');

    //模拟数据json
    var dataJson = {'data': [{'src':'30.jpg'},{'src':'31.jpg'},{'src':'32.jpg'},{'src':'33.jpg'},{'src':'34.jpg'},{'src':'35.jpg'},{'src':'36.jpg'},{'src':'37.jpg'},{'src':'38.jpg'},{'src':'39.jpg'},{'src':'40.jpg'},{'src':'41.jpg'},{'src':'42.jpg'},{'src':'43.jpg'},{'src':'44.jpg'},{'src':'45.jpg'}]};

    window.onscroll=function(){
        var isPosting = false;
        if(checkscrollside('main','box') && !isPosting){
            isPosting = true;
            $.each(dataJson.data,function(index,dom){
                var $box = $('<div class="box"></div>');
                $box.html('<div class="pic"><img src="./images/'+$(dom).attr('src')+'"></div>');
                $('#main').append($box);
                waterfall('main','box');
                isPosting = false;
            });
        }
    }
});

/*
 parend 父级id
 clsName 元素class
 */
function waterfall(parent,clsName){
    var $parent = $('#'+parent);//父元素
    var $boxs = $parent.find('.'+clsName);//所有box元素
    var iPinW = $boxs.eq( 0 ).width()+15;// 一个块框box的宽
    var cols = Math.floor( $( window ).width() / iPinW );//列数
    $parent.width(iPinW * cols).css({'margin': '0 auto'});

    var pinHArr=[];//用于存储 每列中的所有块框相加的高度。

    $boxs.each( function( index, dom){
        if( index < cols ){
            pinHArr[ index ] = $(dom).height(); //所有列的高度
        }else{
            var minH = Math.min.apply( null, pinHArr );//数组pinHArr中的最小值minH
            var minHIndex = $.inArray( minH, pinHArr );
            $(dom).css({
                'position': 'absolute',
                'top': minH + 15,
                'left': $boxs.eq( minHIndex ).position().left
            });
            //添加元素后修改pinHArr
            pinHArr[ minHIndex ] += $(dom).height() + 15;//更新添加了块框后的列高
        }
    });
}

//检验是否满足加载数据条件，即触发添加块框函数waterfall()的高度：最后一个块框的距离网页顶部+自身高的一半(实现未滚到底就开始加载)
function checkscrollside(parent,clsName){
    //最后一个块框
    var $lastBox = $('#'+parent).find('.'+clsName).last(),
        lastBoxH = $lastBox.offset().top + $lastBox.height()/ 2,
        scrollTop = $(window).scrollTop(),
        documentH = $(document).height();
    return lastBoxH < scrollTop + documentH ? true : false;
}