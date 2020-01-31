<template>
	<view style="width: 100%; background: #FAFAFA;">
		<!-- 留海设置 -->
		<view style="width: 100%; height: 65rpx; display: block; background: #000000;"></view>
		
		<!-- 日期选择 -->
		<uni-calendar ref="calendar" :insert="false" @confirm="confirm" :range="true"></uni-calendar>
		<view @click="open_calendar" style="padding-top:3%;border-bottom: #000000;">
			<view>
				<view class="DayCss">
					出发<br>{{ goodDatePickerOption2.currentRangeStartDate }}
				</view>
				<view class="dateNumCss">共{{ currentDateNum }}天</view>
				<view class="DayCss">
					结束<br>{{ goodDatePickerOption2.currentRangeEndDate }}
				</view>
			</view>
		</view>
		
		<!-- 景点选择 -->
		<view style="margin-top: 5%;">
			<!-- 一天的游览线路 -->
			<!-- 第几天 -->
			<view v-for="(oneDay,dayId) in siteRoute_all" style="text-align: center;">
				<view class="oneDayCss">
					<uni-swipe-action style="margin-top: 3%;">
					    <uni-swipe-action-item :options="dayChoose" @click="click_day($event,dayId)" mode="day">
					        <view class='dayChooseCss'>第{{oneDay.dayNum}}天</view>
					    </uni-swipe-action-item>
					</uni-swipe-action>
				</view>
				
				<!-- 景点 -->
				<view v-for="(onesite,currentSiteIndex) in oneDay.siteRoute_oneDay">
					<view class="oneSiteCss">
						<view style="display: inline-block; width: 90%; text-align: left;">
							<uni-swipe-action>
							    <uni-swipe-action-item :options="siteChoose" @click="click_site($event,dayId)" mode="site">
							        <view>{{onesite}}</view>
							    </uni-swipe-action-item>
							</uni-swipe-action>
						</view>
					</view>
				</view>
				<!-- 因使用侧滑框，该按钮废弃			 -->
				<!-- <button @click="open_chooseView(currentDayIndex)" style="width: 80%;margin-bottom: 2%; margin-top: 2%;">增加路线</button>	 -->
			</view>
			
			<!-- 日期更改框 -->
			<hFormAlert v-if="modifySiteInputShow"  name="cancel_desc" placeholder="更改至第几天？" @confirm="comfirm_modifyDay" @cancel="cancel_modifyDay"></hFormAlert>
			
			<!-- 因使用侧滑框，该按钮废弃			 -->
			<!-- 增加日期按钮
			<view @click="add_day" style="margin-top: 3%;">
				<button>增加一天</button>
			</view> -->
			
			<uni-popup ref="chooseView" type="center">
				<view class="chooseViewCss">
					 <view class="chooseViewCss_option">
						<!-- <button>景区</button> -->
						<picker class="navigator-siteChoose" @columnchange="change_site" @change="add_site" mode="multiSelector" :range="currentSitesList" :value="currentSiteIndex"><button>景区</button></picker>
					 </view>
					 					 
					 <view class="chooseViewCss_option">
					 	<button>吃饭</button>
					 </view>
										  
					 <view class="chooseViewCss_option">
					 	<button>住宿</button>
					 </view>
					 
					<view class="chooseViewCss_option">
						<button>交通</button>
					 </view>
					 
					 <view class="chooseViewCss_option">
					 	<button @click="open_customView">自定义</button>	
					  </view>
					 
				</view>
				
				<!-- 弹出层 -->
				<!-- 吃饭选择 -->
				<uni-popup ref="customView" type="bottom">
					<view class="customViewCss">
						<input style="background: white;" type="text" v-model="currentCustom"/>
						<view class="subOrCancelCss">
							<view class="subOrCancel_cancelCss" @click="cancel_custom">取消</view>
							<view class="subOrCancel_subCss" @click="sub_custom">确认</view>
						</view>
					</view>
				</uni-popup>
				
			</uni-popup>
		</view>
				
		
	</view>
</template>

<script>
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'							//日历
	import uniPopup from '@/components/uni-popup/uni-popup.vue'										//弹窗
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'	//策划
	import hFormAlert from '@/components/h-form-alert/h-form-alert.vue';							//弹窗输入

	export default {
		data() {
			
			return {
/*-----------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------*/
				/*日期数据*/
				// 配置时间区间不超过一年
				goodDatePickerOption2: { 
					currentRangeStartDate: ' ',
					currentRangeEndDate: ' ',
					// initStartDate: ' ', //可选起始时间，可为空,默认今天
					// initEndDate: '2022-12-30', //可选结束时间，可为空,默认12个月后
					isRange: true ,//是否开启范围选择，必填
				},
								
/*-----------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------*/
				/*景点选择*/
				dayChoose:[				//日期选项
					{
						text: '增加一天',
						style: {
						}
					},
					{
						text: '修改一天',
						style: {
							backgroundColor: 'rgb(205,129,131)'
						}
					},
					{
						text: '删除一天',
						style: {
							backgroundColor: 'rgb(255,58,49)'
						}
					},
					{
						text: '增加景点',
						style: {
							backgroundColor: 'rgb(254,156,1)'
						},
					}
				],
				siteChoose:[				//景点选项
					{
						text: '增加景点',
						style: {
						}
					},
					{
						text: '删除景点',
						style: {
							backgroundColor: 'rgb(255,58,49)'
						}
					},
					{
						text: '修改景点',
						style: {
							backgroundColor: 'rgb(254,156,1)'
						},
					}
				],
				modifySiteInputShow:false,
				currentDayId:"",
				currentDayIndex:"",		//当前选择日期
				currentSite:"",			//当前选择景点
				currentCustom:"",		//当前自定义
				currentSiteIndex:[0,0,0],
				currentSitesList:[],	//复选框中景点列表
				sites:{//应有景点数据
					province:['四川','陕西'],
					city:[
						['成都','都江堰','内江','大邑'],
						['西安','延安']
					],
					sites:[
						[
							['熊猫基地','成都理工大学'],
							['都江堰','青城山'],
							['张大千纪念馆','内江小面'],
							['安仁古镇','建川博物馆','刘氏庄园']
						],
						[
							['城墙','大唐不夜城'],
							['景点1','景点2']
						]
					]					
				},
				//路线数据
				/*
				格式：
				[{
						dayNum:this.currentDateNum,
						siteRoute_oneDay:[""]
					},]
				*/
			   	siteRoute_all:[],
			}
		},
		components: {
			uniPopup,				//弹窗
			uniCalendar,			//日历
			uniSwipeAction,
			uniSwipeActionItem,		//侧滑
			hFormAlert,				//弹窗输入
		},
		computed: {
			//旅游持续时间
			currentDateNum:function(){
				if(this.goodDatePickerOption2.currentRangeStartDate==' ')
					return 0;
				return this.dateSpace(this.goodDatePickerOption2.currentRangeStartDate, this.goodDatePickerOption2.currentRangeEndDate);
			}
		},
		onLoad() {
			//默认景点
			this.currentSite=this.sites.sites[this.currentSiteIndex[0]][this.currentSiteIndex[1]][this.currentSiteIndex[2]];
			//更新景点选择列表
			this.currentSitesList.push(this.sites.province);
			this.currentSitesList.push(this.sites.city[0]);
			this.currentSitesList.push(this.sites.sites[0][0]);
		},
		methods: {
/*-----------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------*/
			/*日期*/
			//计算日期差
			dateSpace(sDate1, sDate2) { //sDate1和sDate2是2006-12-18格式 得出量日期之间的天数
				var dateSpan, tempDate, iDays;
				sDate1 = Date.parse(sDate1);
				sDate2 = Date.parse(sDate2);
				dateSpan = sDate2 - sDate1;
				dateSpan = Math.abs(dateSpan);
				iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
				return iDays+1;
			},
			//打开日历，进行日期选择
			open_calendar(){
				this.$refs.calendar.open();
			},
			//日历确认后逻辑
			confirm(e) {
				//设置开始结束日期
				if (e.range.before=="" || e.range.after==""){ //单选
					this.goodDatePickerOption2.currentRangeStartDate=e.fulldate;
					this.goodDatePickerOption2.currentRangeEndDate=e.fulldate;
				} 
				else{ //多选
					this.goodDatePickerOption2.currentRangeStartDate=e.range.before;
					this.goodDatePickerOption2.currentRangeEndDate=e.range.after;
				}
								
				//设置天数
				var i=0;
				this.siteRoute_all=[] //清空天数
				for(i;i<this.currentDateNum;i++){
					this.siteRoute_all.push({
						dayNum:i+1,
						siteRoute_oneDay:[]
					});
				}
			},
			//得到输入data的后day天
			get_nextDate:function (date,day) {
				var s=date.split('-');
				var nDate=new Date(parseInt(s[0]),parseInt(s[1])-1,parseInt(s[2]));
				var nextDate=new Date(Date.parse(nDate)+day*24*60*60*1000);
				var year=nextDate.getFullYear();
				var mon=nextDate.getMonth() + 1 < 10 ? '0' + (nextDate.getMonth() + 1) : nextDate.getMonth() + 1;
				var day=nextDate.getDate() < 10 ? '0' + nextDate.getDate() : nextDate.getDate();
				return year+'-'+mon+'-'+day;
			},
			/**********************************************************/
			/*天数操作*/
			//日期操作
			click_day:function(e,dayId){
				switch(e.content.text){
					case "增加一天":this.add_day(dayId);break;
					case "修改一天":this.modify_day(dayId);break;
					case "删除一天":this.delete_day(dayId);break;
					case "增加景点":this.open_chooseView(dayId);break;
				}
			},
			//增加一天
			add_day:function(dayId){
				if (this.goodDatePickerOption2.currentRangeStartDate==" "|| this.goodDatePickerOption2.currentRangeEndDate==" "){
					uni.showToast({
						title:"请选择日期",
						duration:2000,
						icon:"none"
					});
				}
				else{
					//结束日期往后移一天
					this.goodDatePickerOption2.currentRangeEndDate=this.get_nextDate(this.goodDatePickerOption2.currentRangeEndDate,1);
					
					
					this.siteRoute_all.splice(dayId+1,0,
						{
							dayNum:dayId+2,
							siteRoute_oneDay:[]
						}
					);
					
					for(var i=dayId;i<this.siteRoute_all.length;i++){							//重新进行日期编号
						this.siteRoute_all[i].dayNum=i+1;
					}
				}	

			},
			//删除一天
			delete_day:function(dayId){
				//删除元素
				this.siteRoute_all.splice(dayId,1);
				//数组元素存在时，更改数组元素
				if(this.siteRoute_all.length!=0){
					for(var i=dayId;i<this.siteRoute_all.length;i++){
						this.siteRoute_all[i].dayNum=i+1;
					}
					this.goodDatePickerOption2.currentRangeEndDate=this.get_nextDate(this.goodDatePickerOption2.currentRangeEndDate,-1);
				}
				else{
					this.goodDatePickerOption2.currentRangeStartDate=' ';
					this.goodDatePickerOption2.currentRangeEndDate=' ';
				}
			},
			//修改一天
			modify_day:function(dayId){
				this.modifySiteInputShow=true;
				this.currentDayId=dayId;
			},
			comfirm_modifyDay:function(e){
				//检验合法性
				if(Number(e.cancel_desc)>=0 && Number(e.cancel_desc)<=this.siteRoute_all.length){
					var startDayId=this.currentDayId;
					var aimDayId=e.cancel_desc-1;
					
					this.siteRoute_all.splice(aimDayId,0,this.siteRoute_all[startDayId]);	//插入
					this.siteRoute_all.splice(startDayId+1,1)								//删除原来
					for(var i=0;i<this.siteRoute_all.length;i++){							//重新进行日期编号
						this.siteRoute_all[i].dayNum=i+1;
					}
					
			
					//隐藏
					this.modifySiteInputShow=false;
				}
				else{
					uni.showToast({
						title:"请输入合法天数",
						duration:2000,
						icon:"none"						
					});
				}
			},
			cancel_modifyDay:function(){
				this.modifySiteInputShow=false;
			},
/*-----------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------*/	
			/*景点*/
			/**********************************************************/
			//景点操作
			click_site:function(e,dayId){
				switch(e.content.text){
					case "增加景点":this.open_chooseView(dayId);break;
					case "删除景点":this.delete_site(dayId,siteId);break;
					case "修改景点":this.modify_site(dayId,siteId);break;
				}
			},
			//打开景点选择弹窗
			open_chooseView:function(dayId){
				this.currentDayIndex=dayId;
				this.$refs.chooseView.open();
			},
			//增加景点
			add_site:function(){
				//关闭chooseView
				this.$refs.chooseView.close();
				this.siteRoute_all[this.currentDayIndex].siteRoute_oneDay.push(this.currentSite)
			},
			//复选框改变时触发
			change_site:function(e){
				//记录更改
				this.currentSiteIndex[e.detail.column]=e.detail.value
				if (e.detail.column != 2)
					this.currentSiteIndex[e.detail.column+1]=0
				//市
				this.currentSitesList[1]=this.sites.city[this.currentSiteIndex[0]]
				//景点
				this.currentSitesList[2]=this.sites.sites[this.currentSiteIndex[0]][this.currentSiteIndex[1]]
				//当前景点
				this.currentSite=this.sites.sites[this.currentSiteIndex[0]][this.currentSiteIndex[1]][this.currentSiteIndex[2]]
			},
			//删除景点
			delete_site:function(dayId,siteId){
				
			},
			//更改景点
			modify_site:function(dayId,siteId){
				
			},


			/**********************************************************/
			/*增加吃饭*/
			
			/**********************************************************/
			/*增加住宿*/
			
			/**********************************************************/
			/*增加交通*/
			
			/**********************************************************/
			/*增加自定义*/
			//打开自定义view
			open_customView:function(e){
				this.$refs.customView.open();
			},
			//提交自定义路线
			sub_custom:function(e){
				if(this.currentCustom==""){
					uni.showToast({	
						title:"请输入自定义景点",
						duration:2000,
						icon:"none"						
					});
				}
				else{
					this.siteRoute_all[this.currentDayIndex].siteRoute_oneDay.push(this.currentCustom);
					//关闭自定义框及选择框	
					this.$refs.chooseView.close();
					this.$refs.customView.close();
				}
			},
			//取消自定义
			cancel_custom:function(e){
				this.$refs.customView.close();
			}
		}
	}
</script>

<style>
.DayCss{
	display: inline-block;
	width: 40%;
	text-align: center;
	vertical-align: top;
	
}

.dayChooseCss{
	padding-top: 2%;
	padding-bottom: 2%;
	margin-left: 43%;
}


.dateNumCss{
	width: 20%;
	text-align: center;
	display: inline-block;
	padding-top: 3%;
}

.oneDayCss{
	margin-top: 2%;
	padding-bottom: 2%;
}

.oneSiteCss{
}


.oneDayCss img{
	text-align: right;
	display: inline-block;
	width: 45%;
	height: 45%;
}

.chooseViewCss{
	width: 100%;
	text-align: center;
	padding-bottom: 5%;
	padding-top: 5%;
}

.chooseViewCss_option{
	display: inline-block;
	margin: 10% 5%;
	width: 40%;
}

.customViewCss{
	vertical-align:middle;
	background: white;
	height: 200rpx;
	padding-top: 5%;
	margin-bottom: 10%;
}

.subOrCancelCss{
	background: white;
	width: 100%;
}

.subOrCancel_subCss{
	display: inline-block;
	text-align: center;
	width: 49%;
	margin-top: 5%;
}

.subOrCancel_cancelCss{
	display: inline-block;
	text-align: center;
	width: 50%;
	margin-top: 5%;
	border-right: 1rpx solid black;
}

.customViewCss input{
	width: 80%;
	text-align: center;
	margin-left: 10%;
	border: 1rpx solid black;		//边框
	-webkit-border-radius: 100px;	//圆角
	-moz-border-radius: 100px;		
	border-radius: 100px;
	height:60rpx;
}
</style>