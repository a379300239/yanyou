<template>
	<view style="background-color: #F2F2F2;">
		<view style="width: 750rpx;text-align: center;margin:30rpx 0 30rpx 0;">
			<p style="font-size: 54rpx;">{{routeName}}</p>
		</view>
		
		<view style="width: 750rpx; text-align: center;">
		    <uni-calendar 
			:range="true"
		    :lunar="true" 
		    :start-date="startDate"
		    :end-date="endDate"
			:showMonth="true"
		    @change="change_date"
		     ></uni-calendar>
		</view>
		
		<view style="width: 750rpx;text-align: center; margin-top:42rpx;">
			<button style="width: 712rpx;-webkit-border-radius: 100px;background-color: #11B4D1;color: #FFFFFF;"
					@click="navigatorToChoosePlace"
			>下一步</button>
		</view>
		
		<!-- 路线名称弹窗 -->
		<hFormAlert v-if="showRouteNameChooseView"  
					name="chooseRouteNameView"
					placeholder="路线名称"
					title="请开启您的旅行吧！"
					@confirm="comfirm_choose" @cancel="cancel_choose"></hFormAlert>
					
		
	</view>
</template>

<script>
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'							//日历
	import hFormAlert from '@/components/h-form-alert/h-form-alert.vue';							//弹窗输入
	
	export default {
		data() {
			return {
				startDate:'',
				endDate:'',
				routeName:'',
				showRouteNameChooseView:true
			}
		},
		methods: {
			//记录日期
			change_date:function(e){
				var stime=new Date(e.range.before).getTime();
				var etime=new Date(e.range.after).getTime();		//转化为格林威治时间时间以比较先后
				
				//多选
				if(stime>etime){
					this.startDate=e.range.after;
					this.endDate=e.range.before;
				}
				else if(stime>=etime){
					this.startDate=e.range.before;
					this.endDate=e.range.after;
				}
				//单选
				else{
					this.startDate=e.fulldate;
					this.endDate=e.fulldate;
				}
				
			},
			//输入路线名称
			comfirm_choose:function(e){
				if(e.chooseRouteNameView==''){
					uni.showToast({
						title:"请输入路线名称",
						icon:"none"
					})
				}
				else{
					this.routeName=e.chooseRouteNameView;
					this.showRouteNameChooseView=false;
				}
			},
			cancel_choose:function(e){
				this.showRouteNameChooseView=false;
			},
			
			//跳转到地点选择页
			navigatorToChoosePlace:function(){
				//没有命名路线
				if(this.routeName==""){
					this.showRouteNameChooseView=true;
					uni.showToast({
						title:"请输入景点名称",
						icon:"none"
					});
				}
				else{
					//未触发点击事件，则默认为当前日期
					if(this.startDate=="" || this.endDate==""){
						var ndate=new Date();
						var year=ndate.getFullYear();
						var mon=ndate.getMonth() + 1 < 10 ? '0' + (ndate.getMonth() + 1) : ndate.getMonth() + 1;
						var day=ndate.getDate() < 10 ? '0' + ndate.getDate() : ndate.getDate();
						ndate=year+'-'+mon+'-'+day;
						this.startDate=ndate;
						this.endDate=ndate;
					}
					var routeDay=this.dateSpace(this.startDate,this.endDate);
					var surl="routeName="+this.routeName+"&startDate="+this.startDate+"&endDate="+this.endDate+"&routeDay="+routeDay;
					uni.redirectTo({
						url:"../choose_place/choose_place?"+surl,
					});
				}
			},
			// 日期差
			dateSpace:function (sDate1, sDate2) { //sDate1和sDate2是2006-12-18格式 得出量日期之间的天数
				var dateSpan, tempDate, iDays;
				sDate1 = Date.parse(sDate1);
				sDate2 = Date.parse(sDate2);
				dateSpan = sDate2 - sDate1;
				dateSpan = Math.abs(dateSpan);
				iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
				return iDays+1;
			},
		},
		components:{
			uniCalendar,			//日历
			hFormAlert,				//弹窗输入
		}
	}
</script>

<style>

</style>
