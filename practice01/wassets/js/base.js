(function(){
	$(function(){
		baseEvn.init();
		// webUploaderEvn.init();
	});
	var baseEvn = {
		// 弹出框
		popFun: function(popOpts){
			var isPop = $('#pop').length > 0 ? true : false;
			var $pop = null;
			var popHtml = [];

			var defaults = {
				// 弹出框内容
				Content : '',
				// 弹出框标题
				// Title : '温馨提示',
				// 自定义弹出框class
				mainClass: '',
				// 头部内容
                Tips:'',
				headContent: '',
				// 是否隐藏头部关闭按钮

				// isHideCloseBtn:'<a href="javascript:void(0);" class="pop-close pop-btn-close">关闭</a>',
				// 是否关闭点击背景事件
				isOffMaskFun: false,
				// 回调事件
				callback : function(){}
			};

			var popData = $.extend(defaults, popOpts);

			// console.log(defaults,popOpts);

			// popHtml.push('		<div class="pop-head">');
			// popHtml.push('			<span>'+ popData.Title +'</span>'+ popData.headContent + popData.isHideCloseBtn +'<em>'+popData.Tips+'</em></div>');
			popHtml.push('		<div class="pop-content">'+ popData.Content +'</div>');


			if(isPop){
				// 存在
				$('#pop .pop-main').attr('class', 'pop-main ' + popData.mainClass).html(popHtml.join('')).parent().fadeIn();

			}else{

				// 不存在
				$pop = $('<div class="pop" id="pop"><div class="pop-mask"></div><div class="pop-main '+ popData.mainClass +'"></div></div>');

				$pop.find('.pop-main').append(popHtml.join(''));

				$('body').append($pop).find('.pop').fadeIn();

				$pop.on('click','.pop-btn-close,.pop-mask,.cancell-btn',function(){
					$pop.fadeOut();
				});
			}

			if(typeof(popData.callback) == 'function'){
				popData.callback($pop || $('#pop'));
			}
		},
		// 提示性弹窗
        popFun2: function(popOpts){
            var isPop = $('#pop').length > 0 ? true : false;
            var $pop = null;
            var popHtml = [];

            var defaults = {
                // 弹出框内容
                Content : '',
                // 自定义弹出框class
                mainClass: '',
                // 是否关闭点击背景事件
                isOffMaskFun: false,
                // 回调事件
                callback : function(){}
            };
            var popData = $.extend(defaults, popOpts);
            popHtml.push('      <div >'+ popData.Content +'</div>');
            if(isPop){
                // 存在
                $('#pop .pop-main').attr('class', 'pop-main ' + popData.mainClass).html(popHtml.join('')).parent().fadeIn();
            }else{
                // 不存在
                $pop = $('<div class="pop" id="pop"><div class="pop-mask2"></div><div class="pop-main '+ popData.mainClass +'"></div></div>');

                $pop.find('.pop-main').append(popHtml.join(''));

                $('body').append($pop).find('.pop').fadeIn();
            }

            if(typeof(popData.callback) == 'function'){
                popData.callback($pop || $('#pop'));
            }
        },
        // 输入表单验证验证
        validate : function(inputObj){
            // console.log(inputObj);
            var inputName = inputObj.attr('name'),
                inputVal = $.trim(inputObj.val()),
                isTrue = 0,
                isRepassword = false;
            // 值的长度，中文占2个长度
            // var inputLen = inputVal.match(/[^ -~]/g) == null ? inputVal.length : inputVal.length + inputVal.match(/[^ -~]/g).length;
            var inputLen = inputVal.length;

            // 验证是否为空
            if(inputVal == '')
            {
                isTrue++;
                inputObj.val('');
                baseEvn.validationTxtTips(inputObj,0);
                return false;
            }

            // 验证是否特殊字符
            if($.inArray(inputName, ['name','company','position','address']) >= 0 && baseEvn.validateRex.specialChar.test(inputVal))
            {
                isTrue++;

                baseEvn.validationTxtTips(inputObj,1);
                return false;
            }

            if($.inArray(inputName, ['phone','tel']) >= 0 && baseEvn.validateRex.numChar.test(inputVal)){
                isTrue++;

                baseEvn.validationTxtTips(inputObj,1);
                return false;
            }

            if($.inArray(inputName, ['email']) >= 0 && baseEvn.validateRex.emailSpecialChar.test(inputVal)){
                isTrue++;

                baseEvn.validationTxtTips(inputObj,1);
                return false;
            }

            // 验证格式是否正确
            switch(inputName){
            	// 联系人姓名
            	case 'name':
            		isTrue = (inputLen >= 1 && inputLen <= 68) ?isTrue : (isTrue + 1);
            		break;
            	// 公司名称
            	case 'company':
            	// 职位
            	case 'position':
            		isTrue = (inputLen >= 0 && inputLen <= 68) ?isTrue : (isTrue + 1);
            		break;
            	// 地址
            	case 'address':
            		isTrue = (inputLen >= 0 && inputLen <= 200) ?isTrue : (isTrue + 1);
            		break;
            	// 数字
            	case 'phone':
            	case 'tel':
            		isTrue = baseEvn.validateRex.integer.test(inputVal) ? isTrue : (isTrue + 1);
            		break;
            	case 'email':
                    isTrue = baseEvn.validateRex.email.test(inputVal) ? isTrue : (isTrue + 1);
                    break; 
                //领域名称 
                case 'area_name':
                	isTrue = (inputLen >= 1 && inputLen <= 68) ?isTrue : (isTrue + 1);
                	break;
                default:
                    break;
            }
            // console.log("isTrue:"+isTrue);
            if(isTrue > 0){
                if(isRepassword){
                    // 确认密码，特殊处理
                    baseEvn.validationTxtTips(inputObj,3);
                }else{
                    baseEvn.validationTxtTips(inputObj,2);
                }

                return false;
            }

            // 验证通过
            baseEvn.validationTxtTips(inputObj,-1);

            return true;
        },
        // 表单验证错误提示
        validationTxtTips : function(inputObj,type){

            var txt = '',
                $tips = inputObj;
            switch(type){
                case 0 :
                    // 为空
                    txt = $tips.attr('data-null') || '不能为空';
                    break;
                case 1 :
                    // 特殊字符
                    txt = $tips.attr('data-specialChar') || '您的输入含有特殊字符';
                    break;
                case 2 :
                    //格式错误
                    txt = $tips.attr('data-formatErr') || '您的输入格式有误';
                    break;
                case 3 :
                    //确认密码输入错误
                    txt = $tips.attr('data-rePasswordErr') || '两次输入的密码不一致';
                    break;
                default :
                    // 缺省
                    txt = $tips.attr('data-through') || '&nbsp;';
                    break;
            }

            // 提示
            if(type >= 0){
                inputObj.addClass('in-err').removeClass('in-ok');
                alert(txt);
            }else{
                inputObj.addClass('in-ok').removeClass('in-err');
            }
        },
        // 发送数据
		postData:function(postDataParams){
			var form_url = postDataParams.params.url ? postDataParams.params.url : '/';
			
			$.post(form_url, postDataParams.params, function(backData){

				// console.log(backData);

				if(backData.status == 'ok'){
					// 成功
					if($.isFunction(postDataParams.okCallBack)){
						postDataParams.okCallBack(backData);
					}
				}else{
					// 失败
					if($.isFunction(postDataParams.errCallBack)){
						postDataParams.errCallBack(backData);
					}
				}
			}, 'json');
		},
		publicEvn : function(){


			// 搜索
			var $searchPart = $('.search-part'),
				$defaultBox = $searchPart.find('.default-state'),
				$enterBox = $searchPart.find('.enter-state'),
				$clearBtn = $enterBox.find('.clear-icon'),
				$cancellBtn = $enterBox.find('#cancellBtn');
			$defaultBox.on('click',function(){
				// baseEvn.popFun2({
				// 	Content:'测试测试',
				// 	mainClass :'pop-suc-tip' 
				// });
				$(this).hide();
				$enterBox.show().find('input').focus();
			});	
			// 清空输入框
			$clearBtn.on('click',function(){
				$enterBox.find('#searchKey').val('').focus();
				$(this).hide();
			});
			// 取消
			$cancellBtn.on('click',function(){
				$enterBox.hide();
				$defaultBox.show();
			});
			// 实时返回搜索结果
			$enterBox.find('#searchKey').bind('input propertychange',function(){
				console.log("searchKey:"+$(this).val());
				$(this).val() != '' ? $clearBtn.show() : $clearBtn.hide();

				var _searchKey = $enterBox.find('#searchKey').val();
				baseEvn.postData({
					params:{
						url : baseEvn.dataApi.searchContact,
						searchKey : _searchKey
					},
					okCallBack : function(backData){
						var htmlArr = [],
						imgUrl = baseEvn.RES_URL + 'uploads/',
                		i=0
               			Data=backData.data;
						if($('#allContacts').length>0){
							// 联系人页面
							for(i in backData){
								htmlArr.push('<li>');
								htmlArr.push('	<a href="contact-detail.html">');
								htmlArr.push('		<div class="left"><img src="../../wassets/images/contact-phpto.png"></div>');
								htmlArr.push('		<div class="right">');
								htmlArr.push('			<h2>韩玉</h2>');
								htmlArr.push('			<div class="contact-phone">13800138000</div>');
								htmlArr.push('			<div class="contact-company">深圳可购百技术有限公司</div>');
								htmlArr.push('		</div>');
								htmlArr.push('	</a>');
								htmlArr.push('<li>');
							}


							$('.contacts-search-result').show();
							$('.related-contacts ul').html(htmlArr.join(''));

						}else if($('#bindWeixin').length>0){
							// 绑定微信页面
							for(i in backData){
								htmlArr.push('<li class="list-item">');
								htmlArr.push('	<label for="1">');
								htmlArr.push('		<div class="contact-info">');
								htmlArr.push('			<div class="contact-head"><img src="../../wassets/images/user-head.png"></div>');
								htmlArr.push('			<p class="contact-name">shellalia</p>');
								htmlArr.push('		</div>');
								htmlArr.push('		<input type="checkbox" id="2" class="icon">');
								htmlArr.push('	</label>');
								htmlArr.push('<li>');
							}


							$('.recent-concern-contacts').show();
							$('.contact-list').html(htmlArr.join(''));

						}
					},
					errCallBack :function(){
                		baseEvn.popFun({
                			Content : backData.msg
                		});
					}
				});
				return false;
			});
		},
		init :function(){

			// 资源文件URL
            this.RES_URL = (typeof(resourceUrl) == 'undefined') ? 'http://nres.ingdan.com/' : resourceUrl;

            // 验证表单的正则表达式
            this.validateRex = {
                // 整数
                integer : /^[1-9]\d*$/,
                // 0-9的数字
                integer2 : /^[0-9]\d*$/,
                integer3 : /^(?!0)(?:[0-9]{1,3}|1000)$/,
                // 数字
                num : /^\d+(\.\d+)?$/,
                // 邮箱
                email: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
                // 昵称（下划线、字母、数字、汉字开头）
                nickname: /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
                // 密码 6-16位
                password: /^\w{6,16}$/,
                // 电话号码
                tel: /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/,
                // 手机号码
                // phone: /^\w{11}$/,
                phone: /^[1]\d{10}$/,
                // 邮件地址特殊字符
                emailSpecialChar: /[`~!#$%^&*+<>{}\/'[\]]/im,
                // 数字的特殊字符
                numChar: /[`~!@#$%^&*-+<>{}\/'[\]]/im,
                // 特殊字符
                specialChar: /[`~!@#$%^&*-+.<>{}\/'[\]]/im,
                // specialChar: /[`~@#$%^&*<>{}\/'[\]]/im,
                // 网址
                url: /^(https?|ftp|mms):\/\/([A-z0-9_\-]+\.)*[A-z0-9]+\-?[A-z0-9]+\.[A-z]{2,}(\/.*)*\/?/
            };


			// 接口
			this.dataApi = {
				
				// 图片上传入口
				doUploadImage : '/commonapi/do_upload_image',
				
				// 增加联系人
				addContact : '',

				// 获取上一次保存的联系人信息
				getLastSaveInfo :'',

				// 编辑联系人
				editContact : '',

				// 联系人搜索
				searchContact : '',

				// 获取领域相关联系人
				contactsInArea :'',

				// 增加领域
				addConcernArea : '',

				// 解除微信
				unbindWeixin : ''



			};

			// 公共事件
			this.publicEvn();
		}
	}
	//图片上传
	var webUploaderEvn = {
	        init: function(options){
	            var $wrap = options.wrap,

	            // 图片容器
	                $queue = $wrap.find( '.filelist' ),

	            // 状态栏，包括进度和控制按钮
	                $statusBar = $wrap.find( '.statusBar' ),

	            // 文件总体选择信息。
	                $info = $statusBar.find( '.info' ),

	            // 上传按钮
	                $upload = $wrap.find( '.uploadBtn' ),

	            // 没选择文件之前的内容。
	                $placeHolder = $wrap.find( '.placeholder' ),

	                $progress = $statusBar.find( '.progress' ).hide(),

	            // 添加的文件数量
	                fileCount = 0,

	            // 添加的文件总大小
	                fileSize = 0,

	            // 优化retina, 在retina下这个值是2
	                ratio = window.devicePixelRatio || 1,

	            // 缩略图大小
	                thumbnailWidth = 110 * ratio,
	                thumbnailHeight = 110 * ratio,

	            // 可能有pedding, ready, uploading, confirm, done.
	                state = 'pedding',

	            // 所有文件的进度信息，key为file id
	                percentages = {},
	            // 判断浏览器是否支持图片的base64
	                isSupportBase64 = ( function() {
	                    var data = new Image();
	                    var support = true;
	                    data.onload = data.onerror = function() {
	                        if( this.width != 1 || this.height != 1 ) {
	                            support = false;
	                        }
	                    }
	                    data.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
	                    return support;
	                } )(),

	            // 检测是否已经安装flash，检测flash的版本
	                flashVersion = ( function() {
	                    var version;

	                    try {
	                        version = navigator.plugins[ 'Shockwave Flash' ];
	                        version = version.description;
	                    } catch ( ex ) {
	                        try {
	                            version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
	                                .GetVariable('$version');
	                        } catch ( ex2 ) {
	                            version = '0.0';
	                        }
	                    }
	                    version = version.match( /\d+/g );
	                    return parseFloat( version[ 0 ] + '.' + version[ 1 ], 10 );
	                } )(),

	            // 为css3属性添加前缀
	                supportTransition = (function(){
	                    var s = document.createElement('p').style,
	                        r = 'transition' in s ||
	                            'WebkitTransition' in s ||
	                            'MozTransition' in s ||
	                            'msTransition' in s ||
	                            'OTransition' in s;
	                    s = null;
	                    return r;
	                })(),

	            // WebUploader实例
	                uploader;

	            var defaults = {
	                // 添加图片按钮
	                pick: {
	                    id: $wrap.find('.filePicker'),
	                    innerHTML: '点击选择图片'
	                },
	                // 继续添加按钮
	                pickAdd : {
	                    id: $wrap.find('.filePicker2'),
	                    innerHTML: '继续添加'
	                },
	                // 指定接受哪些类型的文件。 由于目前还有ext转mimeType表，所以这里需要分开指定
	                accept:{
	                    // title: 'Images',
	                    // extensions: 'gif,jpg,jpeg,bmp,png',
	                    extensions: 'gif,jpg,jpeg,png'
	                    // mimeTypes: 'image/*'
	                },
	                // 选择图片后自动上传
	                // auto : true,
	                // 文件上传请求的参数表，每次发送都会发送此对象中的参数
	                formData: {
	                    uid: 123
	                },
	                // 指定Drag And Drop拖拽的容器，如果不指定，则不启动
	                // dnd: '#dndArea',
	                // 指定监听paste事件的容器，如果不指定，不启用此功能。此功能为通过粘贴来添加截屏的图片。建议设置为document.body
	                // paste: document.body,
	                swf: baseEvn.RES_URL + 'bassets/plug/webuploader/Uploader.swf',
	                // 是否要分片处理大文件上传
	                chunked: false,
	                // 如果要分片，分多大一片？ 默认大小为5M
	                chunkSize: 512 * 1024,
	                server: '/commonapi/do_upload_image',


	                // 此页面用来协助 IE6/7 预览图片
	                previewServer: baseEvn.RES_URL + 'bassets/plug/webuploader/server/preview.php',

	                // 指定运行时启动顺序。默认会想尝试 html5 是否支持，如果支持则使用 html5, 否则则使用 flash
	                // runtimeOrder: 'flash',

	                // 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
	                disableGlobalDnd: true,
	                // 验证文件总数量, 超出则不允许加入队列
	                fileNumLimit: 300,
	                // 验证文件总大小是否超出限制, 超出则不允许加入队列
	                fileSizeLimit: 200 * 1024 * 1024,    // 200 M
	                // 验证单个文件大小是否超出限制, 超出则不允许加入队
	                fileSingleSizeLimit: 12 * 1024 * 1024,    // 50 M
	                successCallBack: function(){},
	                progressCallBack: function(){}
	            };

	            var Opts = $.extend(defaults, options);

	            // 如果是ie浏览器且不支持html5，判断flash版本
	            if ( !WebUploader.Uploader.support('flash') && WebUploader.browser.ie ) {

	                // flash 安装了但是版本过低。
	                if (flashVersion) {
	                    (function(container) {
	                        window['expressinstallcallback'] = function( state ) {
	                            switch(state) {
	                                case 'Download.Cancelled':
	                                    alert('您取消了更新！')
	                                    break;

	                                case 'Download.Failed':
	                                    alert('安装失败')
	                                    break;

	                                default:
	                                    alert('安装已成功，请刷新！');
	                                    break;
	                            }
	                            delete window['expressinstallcallback'];
	                        };

	                        var swf = './expressInstall.swf';
	                        // insert flash object
	                        var html = '<object type="application/' +
	                            'x-shockwave-flash" data="' +  swf + '" ';

	                        if (WebUploader.browser.ie) {
	                            html += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
	                        }

	                        html += 'width="100%" height="100%" style="outline:0">'  +
	                        '<param name="movie" value="' + swf + '" />' +
	                        '<param name="wmode" value="transparent" />' +
	                        '<param name="allowscriptaccess" value="always" />' +
	                        '</object>';

	                        container.html(html);

	                    })($wrap);

	                    // 压根就没有安装
	                } else {
	                    $wrap.html('<a href="http://www.adobe.com/go/getflashplayer" target="_blank" border="0"><img alt="get flash player" src="http://www.adobe.com/macromedia/style_guide/images/160x41_Get_Flash_Player.jpg" /></a>');
	                }

	                return;
	            } else if (!WebUploader.Uploader.support()) {
	                alert( 'Web Uploader 不支持您的浏览器！');
	                return;
	            }

	            // 实例化
	            uploader = WebUploader.create(Opts);

	            // 拖拽时不接受 js, txt 文件。
	            uploader.on( 'dndAccept', function( items ) {
	                var denied = false,
	                    len = items.length,
	                    i = 0,
	                // 修改js类型
	                    unAllowed = 'text/plain;application/javascript ';

	                for ( ; i < len; i++ ) {
	                    // 如果在列表里面
	                    if ( ~unAllowed.indexOf( items[ i ].type ) ) {
	                        denied = true;
	                        break;
	                    }
	                }

	                return !denied;
	            });

	            uploader.on('dialogOpen', function() {
	                // console.log('here');
	            });

	            // uploader.on('filesQueued', function() {
	            //     uploader.sort(function( a, b ) {
	            //         if ( a.name < b.name )
	            //           return -1;
	            //         if ( a.name > b.name )
	            //           return 1;
	            //         return 0;
	            //     });
	            // });

	            if(Opts.pickAdd){
	                // 添加“添加文件”的按钮，
	                uploader.addButton(Opts.pickAdd);
	            }

	            uploader.on('ready', function() {
	                // window.uploader = uploader;
	                // console.log(Opts);
	            });

	            // 当有文件添加进来时执行，负责view的创建
	            function addFile( file ) {
	                var $li = $( '<li id="' + file.id + '">' +
	                    '<p class="title">' + file.name + '</p>' +
	                    '<p class="imgWrap"></p>'+
	                    '<p class="progress"><span></span></p>' +
	                    '</li>' ),

	                // $btns = $('<div class="file-panel">' +
	                //     '<span class="cancel">删除</span>' +
	                //     '<span class="rotateRight">向右旋转</span>' +
	                //     '<span class="rotateLeft">向左旋转</span></div>').appendTo( $li ),
	                    $btns = $('<div class="file-panel"><span class="cancel">删除</span></div>').appendTo( $li ),
	                    $prgress = $li.find('p.progress span'),
	                    $wrap = $li.find( 'p.imgWrap' ),
	                    $info = $('<p class="error"></p>'),

	                    showError = function( code ) {
	                        switch( code ) {
	                            case 'exceed_size':
	                                text = '文件大小超出';
	                                break;

	                            case 'interrupt':
	                                text = '上传暂停';
	                                break;

	                            default:
	                                text = '上传失败，请重试';
	                                break;
	                        }

	                        $info.text( text ).appendTo( $li );
	                    };

	                if ( file.getStatus() === 'invalid' ) {
	                    showError( file.statusText );
	                } else {
	                    // @todo lazyload
	                    $wrap.text( '预览中' );

	                    // 生成预览图片
	                    uploader.makeThumb( file, function( error, src ) {
	                        var img;

	                        if ( error ) {
	                            $wrap.text( '不能预览' );
	                            return;
	                        }

	                        if( isSupportBase64 ) {
	                            img = $('<img src="'+src+'">');
	                            $wrap.empty().append( img );
	                        } else {
	                            $.ajax(Opts.previewServer, {
	                                method: 'POST',
	                                data: src,
	                                dataType:'json'
	                            }).done(function( response ) {
	                                if (response.result) {
	                                    img = $('<img src="'+response.result+'">');
	                                    $wrap.empty().append( img );
	                                } else {
	                                    $wrap.text("预览出错");
	                                }
	                            });
	                        }
	                    }, thumbnailWidth, thumbnailHeight );

	                    percentages[ file.id ] = [ file.size, 0 ];
	                    file.rotation = 0;
	                }

	                file.on('statuschange', function( cur, prev ) {
	                    if ( prev === 'progress' ) {
	                        $prgress.hide().width(0);
	                    } else if ( prev === 'queued' ) {
	                        $li.off( 'mouseenter mouseleave' );
	                        $btns.remove();
	                    }

	                    // 成功
	                    if ( cur === 'error' || cur === 'invalid' ) {
	                        // console.log( file.statusText );
	                        showError( file.statusText );
	                        percentages[ file.id ][ 1 ] = 1;
	                    } else if ( cur === 'interrupt' ) {
	                        showError( 'interrupt' );
	                    } else if ( cur === 'queued' ) {
	                        percentages[ file.id ][ 1 ] = 0;
	                    } else if ( cur === 'progress' ) {
	                        $info.remove();
	                        $prgress.css('display', 'block');
	                    } else if ( cur === 'complete' ) {
	                        $li.append( '<span class="success"></span>' );
	                    }

	                    $li.removeClass( 'state-' + prev ).addClass( 'state-' + cur );
	                });

	                $li.on( 'mouseenter', function() {
	                    $btns.stop().animate({height: 30});
	                });

	                $li.on( 'mouseleave', function() {
	                    $btns.stop().animate({height: 0});
	                });

	                $btns.on( 'click', 'span', function() {
	                    var index = $(this).index(),
	                        deg;

	                    switch ( index ) {
	                        case 0:
	                            uploader.removeFile( file );
	                            return;

	                        case 1:
	                            file.rotation += 90;
	                            break;

	                        case 2:
	                            file.rotation -= 90;
	                            break;
	                    }

	                    if ( supportTransition ) {
	                        deg = 'rotate(' + file.rotation + 'deg)';
	                        $wrap.css({
	                            '-webkit-transform': deg,
	                            '-mos-transform': deg,
	                            '-o-transform': deg,
	                            'transform': deg
	                        });
	                    } else {
	                        $wrap.css( 'filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ (~~((file.rotation/90)%4 + 4)%4) +')');
	                        // use jquery animate to rotation
	                        // $({
	                        //     rotation: rotation
	                        // }).animate({
	                        //     rotation: file.rotation
	                        // }, {
	                        //     easing: 'linear',
	                        //     step: function( now ) {
	                        //         now = now * Math.PI / 180;

	                        //         var cos = Math.cos( now ),
	                        //             sin = Math.sin( now );

	                        //         $wrap.css( 'filter', "progid:DXImageTransform.Microsoft.Matrix(M11=" + cos + ",M12=" + (-sin) + ",M21=" + sin + ",M22=" + cos + ",SizingMethod='auto expand')");
	                        //     }
	                        // });
	                    }


	                });

	                $li.prependTo( $queue );
	            }

	            // 负责view的销毁
	            function removeFile( file ) {
	                var $li = $('#'+file.id);

	                delete percentages[ file.id ];
	                updateTotalProgress();
	                $li.off().find('.file-panel').off().end().remove();
	            }

	            // 上传总进度
	            function updateTotalProgress() {
	                var loaded = 0,
	                    total = 0,
	                    spans = $progress.children(),
	                    percent;

	                $.each( percentages, function( k, v ) {
	                    total += v[ 0 ];
	                    loaded += v[ 0 ] * v[ 1 ];
	                } );

	                percent = total ? loaded / total : 0;


	                spans.eq( 0 ).text( Math.round( percent * 100 ) + '%' );
	                spans.eq( 1 ).css( 'width', Math.round( percent * 100 ) + '%' );
	                updateStatus();
	            }

	            function updateStatus() {
	                var text = '', stats;

	                if ( state === 'ready' ) {
	                    text = '选中' + fileCount + '张图片，共' +
	                    WebUploader.formatSize( fileSize ) + '。';
	                } else if ( state === 'confirm' ) {
	                    stats = uploader.getStats();
	                    if ( stats.uploadFailNum ) {
	                        text = '已成功上传' + stats.successNum+ '张图片，'+
	                        stats.uploadFailNum + '张图片上传失败，<a class="retry" href="javascript:void(0);">重新上传</a>失败图片或<a class="ignore" href="javascript:void(0);">忽略</a>'
	                    }

	                } else {
	                    stats = uploader.getStats();
	                    text = '共' + fileCount + '张（' +
	                    WebUploader.formatSize( fileSize )  +
	                    '），已上传' + stats.successNum + '张';

	                    if ( stats.uploadFailNum ) {
	                        text += '，失败' + stats.uploadFailNum + '张';
	                    }
	                }

	                $info.html( text );
	            }

	            function setState( val ) {
	                var file, stats;

	                if ( val === state ) {
	                    return;
	                }

	                $upload.removeClass( 'state-' + state );
	                $upload.addClass( 'state-' + val );
	                state = val;

	                switch ( state ) {
	                    case 'pedding':
	                        $placeHolder.removeClass( 'element-invisible' );
	                        $queue.hide();
	                        $statusBar.addClass( 'element-invisible' );
	                        uploader.refresh();
	                        break;

	                    case 'ready':
	                        $placeHolder.addClass( 'element-invisible' );
	                        $( Opts.pickAdd.id ).removeClass( 'element-invisible');
	                        $queue.show();
	                        $statusBar.removeClass('element-invisible');
	                        uploader.refresh();
	                        break;

	                    case 'uploading':
	                        $( Opts.pickAdd.id ).addClass( 'element-invisible' );
	                        $progress.show();
	                        $upload.text( '暂停上传' );
	                        break;

	                    case 'paused':
	                        $progress.show();
	                        $upload.text( '继续上传' );
	                        break;

	                    case 'confirm':
	                        $progress.hide();
	                        $( Opts.pickAdd.id ).removeClass( 'element-invisible' );
	                        $upload.text( '开始上传' );

	                        stats = uploader.getStats();
	                        if ( stats.successNum && !stats.uploadFailNum ) {
	                            setState( 'finish' );
	                            return;
	                        }
	                        break;
	                    case 'finish':
	                        stats = uploader.getStats();
	                        if ( stats.successNum ) {
	                            // alert( '上传成功' );
	                        } else {
	                            // 没有成功的图片，重设
	                            state = 'done';
	                            location.reload();
	                        }
	                        break;
	                }

	                updateStatus();
	            }

	            // 上传过程中触发，携带上传进度
	            // uploader.onUploadProgress = function( file, percentage ) {
	            uploader.on('uploadProgress', function( file, percentage ) {
	                var $li = $('#'+file.id),
	                    $percent = $li.find('.progress span');

	                $percent.css( 'width', percentage * 100 + '%' );
	                percentages[ file.id ][ 1 ] = percentage;
	                updateTotalProgress();

	                // 执行回调
	                if(typeof(Opts.progressCallBack) == 'function'){
	                    Opts.progressCallBack( file, percentage );
	                }
	            });

	            // 当文件被加入队列以后触发
	            // uploader.onFileQueued = function( file ) {
	            uploader.on('fileQueued', function( file ) {
	                fileCount++;
	                fileSize += file.size;

	                if ( fileCount === 1 ) {
	                    $placeHolder.addClass( 'element-invisible' );
	                    $statusBar.show();
	                }

	                addFile( file );
	                setState( 'ready' );
	                updateTotalProgress();
	            });

	            // 当文件被移除队列后触发
	            // uploader.onFileDequeued = function( file ) {
	            uploader.on('fileDequeued', function( file ) {
	                fileCount--;
	                fileSize -= file.size;

	                if ( !fileCount ) {
	                    setState( 'pedding' );
	                }

	                removeFile( file );
	                updateTotalProgress();

	            });

	            // 所有事件-用于改变状态
	            uploader.on( 'all', function( type, file, response ) {
	                var stats;
	                switch( type ) {
	                    case 'uploadFinished':
	                        setState( 'confirm' );
	                        break;

	                    case 'startUpload':
	                        setState( 'uploading' );
	                        break;

	                    case 'stopUpload':
	                        setState( 'paused' );
	                        break;

	                    // 上传成功
	                    case 'uploadSuccess':
	                        setState( 'confirm' );

	                        // 执行回调
	                        if(typeof(Opts.successCallBack) == 'function'){
	                            Opts.successCallBack( file, response );
	                        }

	                        break;
	                }
	            });

	            // 上传校验出错时触发
	            uploader.on('error', function( code ) {
	                var txt = '未知错误，请联系我们或提交反馈意见！';

	                switch(code){
	                    case 'Q_EXCEED_NUM_LIMIT':
	                        // 文件数量超出限定
	                        txt = '你只能上传' + Opts.fileNumLimit + '个文件哦！';
	                        break;
	                    case 'Q_EXCEED_SIZE_LIMIT':
	                        // 文件总大小超出规定
	                        txt = '你上传文件总大小超过了' + Math.ceil(Opts.fileSizeLimit /1024) + 'KB，请重新选择！';
	                        break;
	                    case 'F_EXCEED_SIZE':
	                        // 单个文件超出大小
	                        // txt = '您上传的文件中，有超过了' + Math.ceil(Opts.fileSingleSizeLimit / 1024)  +'kB的文件，请重新选择！';
	                        txt = '你上传的文件中，有超过了' + Math.ceil(Opts.fileSingleSizeLimit / 1024 / 1024)  +'M的文件，请重新选择！';
	                        break;
	                    case 'Q_TYPE_DENIED':
	                        // 文件类型不对
	                        txt = '你上传的文件中，有不符合' + Opts.accept.extensions + '格式的文件，请重新选择！';
	                        break;
	                    case 'F_DUPLICATE':
	                        // 文件重复
	                        txt = '不能上传同一张图片，请重新选择！';
	                        break;
	                    default:
	                        break;

	                }

	                baseEvn.popFun({
	                    Content : '<p class="state-tip">'+ txt + '</p>'
	                });
	            });

	            // 点击上传按钮
	            $upload.on('click', function() {
	                if ( $(this).hasClass( 'disabled' ) ) {
	                    return false;
	                }

	                if ( state === 'ready' ) {
	                    uploader.upload();
	                } else if ( state === 'paused' ) {
	                    uploader.upload();
	                } else if ( state === 'uploading' ) {
	                    uploader.stop();
	                }
	            });

	            // 上传失败-点击重试
	            $info.on( 'click', '.retry', function() {
	                uploader.retry();
	            });

	            // 上传失败-忽略
	            $info.on( 'click', '.ignore', function() {
	                // alert( 'todo' );
	            });

	            // 默认状态
	            $upload.addClass( 'state-' + state );

	            // 上传总进度
	            updateTotalProgress();
	        }
	};	

	window.baseEvn = baseEvn;
	window.webUploaderEvn = webUploaderEvn;
})();