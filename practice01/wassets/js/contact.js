(function($){

	$(function(){
		contactEvn.init();
	});

	var contactEvn = {
		// 增加/编辑联系人
		addOrEditContact : function(){
			
			// 领域下拉窗
			var $body = $('body'),
				$inputForm = $('#ContactForm'),
				$dropBox = $('.drop-area'),
				$dropBoxForPerson = $('.drop-for-person'),
				$dropBoxForCompany = $('.drop-for-company');

			// 选择关注领域
			$concern = $('.concern-area');
			// 选择关注领域(个人)
			$personConcern = $('#person-concern');
			// 展开领域下拉窗
			$personConcern.on('click','.load-more',function(){
				$(this).addClass('expanding');
				$dropBoxForPerson.slideDown();
			});
			// 收起
			$dropBoxForPerson.on('click','.collapse-drop',function(){
				// 
				var $itemArr = $('.drop-for-person .area-list .active'),
					htmlArr = [];
				if($itemArr){
					for(var i=0;i<$itemArr.length;i++){
						// console.log($itemArr[i]);
						$('.expanding').parent('.area-list').append($itemArr[i]);
						// $('.drop-for-person .area-list').prepend($itemArr[i]);
					}
				}

				$('.expanding').parent('.area-list').append('<li class="load-more"><a href="javascript:void(0);">更多&gt;&gt;</a></li>')
				$('.expanding').remove();
				$dropBoxForPerson.fadeOut();
			});
			
			// 选择关注领域(公司)
			$companyConcern = $('#company-concern');
			// 展开领域下拉窗
			$companyConcern.on('click','.load-more',function(){
				$(this).addClass('expanding');
				$dropBoxForCompany.slideDown();
			});
			// 收起
			$dropBoxForCompany.on('click','.collapse-drop',function(){
				// 
				var $itemArr = $('.drop-for-company .area-list .active'),
					htmlArr = [];
				if($itemArr){
					for(var i=0;i<$itemArr.length;i++){
						// console.log($itemArr[i]);
						$('.expanding').parent('.area-list').append($itemArr[i]);
						// $('.drop-for-company .area-list').prepend($itemArr[i]);
					}
				}

				$('.expanding').parent('.area-list').append('<li class="load-more"><a href="javascript:void(0);">更多&gt;&gt;</a></li>')
				$('.expanding').remove();
				$dropBoxForCompany.fadeOut();
			});

			// 添加领域弹窗
			$dropBox.on('click','.add-more',function(){
				var contentHtml = '<div class="add-area">'+
									'<label for="areaName">'+
										'<p>领域<span>*</span></p>'+
										'<input type="text" name="areaName" id="areaName" data-null="请输入领域分类">'+
									'</label>'+
									'<div class="user-operate-part">'+
										'<a href="javascript:void(0)" class="btn sure-btn">确定</a>'+
										'<a href="javascript:void(0)" class="btn cancell-btn">取消</a>'+
									'</div>'+
								'</div>';
				baseEvn.popFun({
					mainClass : 'pop-area',
					Content : contentHtml
				});
			});
			// 添加领域
			$body.on('click','.add-area .sure-btn',function(){
				var _area_name = $('.add-area #areaName').val();
				if(baseEvn.validate($('.add-area #areaName'))){
					baseEvn.postData({
						params:{
							url : baseEvn.dataApi.addConcernArea,
							name : _area_name
						},
						okCallBack :function(backData){
							// 页面上要即时生效→后端返回id
							baseEvn.popFun2({
								Content:'添加领域成功'
							});
						},
						errCallBack :function(backData){
							baseEvn.popFun({
								Content : msg
							});
						}
					});
				}
				return false;
			});
			 //上传名片
			webUploaderEvn.init({
				wrap : $inputForm.find('.user-related-info'),
				// 添加图片按钮
				pick: {
					id: $inputForm.find('.user-related-info .filePicker'),
					innerHTML: '上传名片'
				},
				auto : true,
				server: baseEvn.dataApi.doUploadImage,
				// server:'/People/upload_images',
				// 图片压缩
				// compress: {
				// 	width: 120,
				// 	height: 120,

				// 	// 图片质量，只有type为`image/jpeg`的时候才有效。
				// 	quality: 90,

				// 	// 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
				// 	allowMagnify: false,

				// 	// 是否允许裁剪。
				// 	crop: false,

				// 	// 是否保留头部meta信息。
				// 	preserveHeaders: true,

				// 	// 如果发现压缩后文件大小比原来还大，则使用原来图片
				// 	// 此属性可能会影响图片自动纠正功能
				// 	noCompressIfLarger: false,

				// 	// 单位字节，如果图片大小小于此值，不会采用压缩。
				// 	compressSize: 0
				// },
				progressCallBack : function(file, percentage){

				},
				successCallBack: function( file, response ){
					console.log(file, response);
					// console.log("response.image:"+response.image);
					// if(response.image){
					// 	$userInfo.find('.user-img').attr('src',baseEvn.RES_URL + 'uploads/' + response.image);
					// 	$userInfo.find('.user-photo  #user-head').val(response.image);
					// }else{
					// 	baseEvn.popFun({
					// 		Content:'<p class="state-tip">头像上传失败，请使用其他浏览器尝试或通过电脑端更换头像</p>'
					// 	})
					// }

				}
			});
			// 重新上传
			
			// 提交联系人信息
			$inputForm.on('click','.save-btn',function(){
				var $this = $(this),
				errNum=0,
				inputObjArr = {
					url : baseEvn.dataApi.addContact,
					name : $inputForm.find('#name'),
					phone : $inputForm.find('#phone'),
					company : $inputForm.find('#company'),
					position : $inputForm.find('#position'),
					email : $inputForm.find('#email'),
					tel : $inputForm.find('#tel'),
					address : $inputForm.find('#address'),
					image:'',
					person_area:[],
					company_area:[]
				}
				if($this.hasClass('posting')){
					return false;
				}
				// 个人关注领域
				$inputForm.find('#person-concern .active').each(function(){
					inputObjArr.person_area.push($this.data('id'));
				});
				// 公司关注领域
				$inputForm.find('#company-concern .active').each(function(){
					inputObjArr.company_area.push($this.data('id'));
				});
				for(var i in inputObjArr){
					if(i == 'url' || i=='person_area' || i=='company_area' || i=='image'){
						continue;
					}
					if(i=='company' || i=='position' || i=='email' || i=='tel' || i=='address'){
						if(inputObjArr[i].val()!=''){
							if(baseEvn.validate(inputObjArr[i])){
								inputObjArr[i] = inputObjArr[i].val();
							}else{
								errNum++;
							}
						}else{
							inputObjArr[i] = inputObjArr[i].val();
						}
						continue;
					}

					if(baseEvn.validate(inputObjArr[i])){
						inputObjArr[i] = inputObjArr[i].val();
					}else{
						errNum++;
					}
				}
				console.log("errNum:"+errNum);
				if(errNum==0){
					$this.addClass('posting').html('提交中。。');
					// 编辑
					if($this.data('type')=='edit'){
						inputObjArr.url==baseEvn.dataApi.editContact,
						inputObjArr.id == '';
					}
					baseEvn.postData({
						params:inputObjArr,
						okCallBack : function(backData){
							baseEvn.popFun2({
								Content : '保存成功！'
							});
							// 需要把id添加至取消按钮
							$this.removeClass('posting').html('保存');
						},
						errCallBack :function(backData){
							baseEvn.popFun({
								Content : backData.msg
							});
							$this.removeClass('posting').html('保存');
						}
					})
				}else{
				// 返回表单顶部
					baseEvn.popFun({
						Content : '信息未完全填写正确，请检查！'
					});
					$('html,body').stop().animate({
						scrollTop : $inputForm.offset().top
					},1200)
					$this.removeClass('posting').html('保存');
				}
				return false;

			});
			// 取消返回上一次保存的状态
			$inputForm.on('click','.cancell-btn',function(){
				var _id = $(this).data('id');
				if(_id){
					baseEvn.postData({
						params:{
							url : baseEvn.dataApi.getLastSaveInfo,
							_id:''
						},
						okCallBack : function(backData){

						},
						errCallBack :function(backData){
							baseEvn.popFun({
								Content : backData.msg
							});
						}
					});
				}else{
					// 未保存→刷新？？
				}
				
			});
			// 解除绑定弹窗
			$inputForm.on('click','.unbind-weixin',function(){
				
				var contentHtml = '<div class="confirm-con">'+
									'<p>确定解绑该联系人微信？</p>'+
									'<div class="user-operate-part">'+
										'<a href="javascript:void(0)" class="btn sure-btn unblind">确定</a>'+
										'<a href="javascript:void(0)" class="btn cancell-btn">取消</a>'+
									'</div>'+
								'</div>';
				baseEvn.popFun({
					mainClass : 'pop-confirm',
					Content : contentHtml
				});
			});
			// 确定解除绑定
			$inputForm.on('click','.pop-confirm .unblind',function(){
				baseEvn.postData({
					params:{
						url:baseEvn.dataApi.unbindWeixin
					},
					okCallBack :function(backData){
						$inputForm.find('.weixin-box').html('<a href="bind-weixin.html" class="bind-weixin">点击绑定微信</a>')
					},
					errCallBack:function(backData){
						baseEvn.popFun({
							Content:backData.msg
						});
					}
				})
			});
			// 排序
			$body.on('click','#sortArea',function(){
				$('.area-sort').show();
				$('.concern-area').hide();
			});
		},
		// 全部联系人
		allContacts : function(){
			// 领域选择
			var $allContacts =$('.all-contacts');
			$allContacts.on('click','.area-choice li',function(){
				if(!$(this).hasClass('load-more')){
					$(this).addClass('active').siblings().removeClass('active');
					$('.drop-area li').removeClass('active');
					var _id = $(this).data('id');
					baseEvn.postData({
						params:{
							url : baseEvn.dataApi.contactsInArea,
							_id : _id
						},
						okCallBack :function(backData){
							var htmlArr = [];
							for( i in backData){
								htmlArr.push('<li>');
								htmlArr.push('	<a href="contact-detail.html" class="clearfix">');
								htmlArr.push('		<div class="left"><img src="../../wassets/images/contact-phpto.png"></div>');
								htmlArr.push('		<div class="right">');
								htmlArr.push('			<h2>韩玉</h2>');
								htmlArr.push('			<div class="contact-phone">13800138000</div>');
								htmlArr.push('			<div class="contact-company">深圳可购百技术有限公司</div>');
								htmlArr.push('		</div>');
								htmlArr.push('	</a>');
								htmlArr.push('</li>');
							}
							$('.related-contacts').html(htmlArr.join(''));
						},
						errCallBack : function(backData){
							baseEvn.popFun({
								Content:backData.msg
							});
						}
					});
				}
			});

			// 展开领域下拉窗
			var $dropBox = $('.drop-area'),
				$expandBtn = $('#expandArea');
			$expandBtn.on('click',function(){
				$dropBox.slideDown(500);
				
				// 选择领域
				$dropBox.find('.area-choice li').on('click',function(){
					$allContacts.find('.area-choice li').removeClass('active');
					$(this).addClass('active').siblings().removeClass('active');
					var _id = $(this).data('id');
					$dropBox.fadeOut();
					baseEvn.postData({
						params:{
							url : baseEvn.dataApi.contactsInArea,
							_id : _id
						},
						okCallBack :function(backData){
							var htmlArr = [];
							for( i in backData){
								htmlArr.push('<li>');
								htmlArr.push('	<a href="contact-detail.html" class="clearfix">');
								htmlArr.push('		<div class="left"><img src="../../wassets/images/contact-phpto.png"></div>');
								htmlArr.push('		<div class="right">');
								htmlArr.push('			<h2>韩玉</h2>');
								htmlArr.push('			<div class="contact-phone">13800138000</div>');
								htmlArr.push('			<div class="contact-company">深圳可购百技术有限公司</div>');
								htmlArr.push('		</div>');
								htmlArr.push('	</a>');
								htmlArr.push('</li>');
							}
							$('.related-contacts').html(htmlArr.join(''));
						},
						errCallBack : function(backData){
							baseEvn.popFun({
								Content:backData.msg
							});
						}
					});
				});
			});
			// 收起
			$dropBox.on('click','#collapseDrop',function(){
				$dropBox.fadeOut();
			});
		},
		// 绑定微信
		bindWeixin : function(){
			// 选择/取消绑定
			var $contactList = $('.contact-list');
			$contactList.on('click','.list-item label',function(){
				$('.contact-list').find('.icon').removeClass('active');
				$(this).find('.icon').toggleClass('active');
				baseEvn.postData({
					params:{

					},
					okCallBack : function(backData){
						window.location.href="";
						    // <div class="bind-user-head"><img src="../../wassets/images/weixin-head.png"></div>
          //                   <p class="bind-user-name">shellalia</p>
          //                   <a href="javascript:void(0);" class="unbind-weixin">解绑</a>
					},
					errCallBack :function(backData){
						baseEvn.postFun({
							Content :backData.msg
						});
					}
				});
				return false;
			});
		},
		init : function(){
			// 增加联系人
			if($('#ContactForm').length>0){
				this.addOrEditContact();
			}
			
			// 全部联系人
			if($('#allContacts').length>0){
				this.allContacts();
			}
			// 绑定微信
			if($('#bindWeixin').length>0){
				this.bindWeixin();
			}
			// 领域选择/取消
			var $areaList = $('.area-list');
			if($('.contactDetail').length<=0){
				// 详情页不可编辑
				$areaList.on('click','li',function(){
					if(!$(this).hasClass('load-more') && !$(this).hasClass('add-more')){
						$(this).toggleClass('active');
					}
				});
			}
		}
	}
	
	
}(jQuery))