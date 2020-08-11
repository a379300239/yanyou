<template>
	<view>
		<view style="width: 750rpx;">
			<QSInput
				name="routeName" 
				:required="false"
				layout="column"
				title="路线名称"
				:placeholder="routeInfomation.routeName"
				v-model="routeInfomation.routeName"
				></QSInput>
		</view>
				
		
		<view>
			<QSPickerDate
				name="startTime"
				title="开始时间"
				:placherhold="routeStartTime"
				v-model="routeInfomation.routeStartTime"
				:dataSet="startDataSet"
				></QSPickerDate>
		</view>
		
		<view>
			<QSPickerDate
				name="endTime"
				title="结束时间"
				:placherhold="routeEndTime"
				v-model="routeInfomation.routeEndTime"
				:dataSet="endDataSet"
				></QSPickerDate>
		</view>
		
		<view>
			<QSInfinitePics 
				name="backgroundImg"
				title="背景图片"	
				max="1"
				v-model="backgroundImg"
				></QSInfinitePics>
		</view>
		
		<view style="width: 750rpx;text-align: center;">
			<button @click="save" style="width: 500rpx; background-color: #00BEC6;color: #FFFFFF;">保存</button>
		</view>
		
		
	</view>
</template>

<script>
	import QSInput from '@/components/QS-inputs-split/elements/QS-input/index.vue';
	import QSPickerDate from '@/components/QS-inputs-split/elements/QS-picker-date/index.vue';
	import QSInfinitePics from '@/components/QS-inputs-split/elements/QS-infinitePics/index.vue';
	export default {
		data() {
			return {
				routeName_before:"",		//用户更改前路线
				routeId:"",					//路线名
				userInfomation:"",			//用户信息
				userRoute:"",				//用户所有路线
				routeInfomation:"",			//当前路线
				routeStartTime:"",			//路线开始时间
				routeEndTime:"",			//路线结束时间
				backgroundImg:"",			//路线图片
				isChooseOver:false			,//弹窗是否选择结束
				startDataSet:{},
				endDataSet:{}
			}
		},
		methods: {
			onLoad:function(e){
				//加载数据
				this.routeId=e.routeId;
				this.userInfomation=uni.getStorageSync("currentUser");
				this.userRoute=uni.getStorageSync(this.userInfomation.userName+"_route");
				this.routeInfomation=this.userRoute[this.routeId];
				
				//因类型转化故特拿出来重新定义
				this.routeStartTime=this.routeInfomation.routeStartTime.replace(/-/g,'/');
				this.routeEndTime=this.routeInfomation.routeEndTime.replace(/-/g,'/');
				
				//日期默认值设置
				this.startDataSet={
					startYear:new Date().getFullYear() - 20,
					endYear:new Date().getFullYear() + 20,
					defaultValue:this.routeStartTime
				}
				this.endDataSet={
					startYear:new Date().getFullYear() - 20,
					endYear:new Date().getFullYear() + 20,
					defaultValue:this.routeEndTime
				}
			},
			
			//保存到本地数据库
			save:function(){
				/* 日期检查二周目，直接跳过以下验证 */
				if(!this.isChooseOver){
					//改变了日期
					if(typeof(this.routeInfomation.routeStartTime)!="string"){
						this.routeInfomation.routeStartTime=this.get_specialFormat(this.routeInfomation.routeStartTime.data);
					}
					if(typeof(this.routeInfomation.routeEndTime)!="string"){
						this.routeInfomation.routeEndTime=this.get_specialFormat(this.routeInfomation.routeEndTime.data);
					}
				
					//日期检查
					var dateStatus=this.check_date(this.routeInfomation.routeStartTime,this.routeInfomation.routeEndTime);
					var nowRouteDay=this.dateSpace(this.routeInfomation.routeStartTime,this.routeInfomation.routeEndTime)
					var beforeRouteDay=this.routeInfomation.routeDay;
					switch (dateStatus){
						case "true-true":				//日期相反，小于行程天数，不允许保存
						case "true-false":{				//日期相反，大于行程天数，不允许保存
							uni.showModal({
								title:"提示",
								content:"结束日期应大于或等于开始日期",
								showCancel:false
							});
							return;
						}break;
						case "false-true":{				//日期不相反，小于行程天数，删除多余天数
							uni.showModal({
								title:"提示",
								content:"改动后的天数小于行程天数，这将删除多余安排，确定这样操作吗",
								showCancel:true,
								success: (res) => {
									if(res.confirm){
										this.routeInfomation.route.splice(nowRouteDay,this.routeInfomation.route.length-nowRouteDay);
										this.isChooseOver=true;
										this.save();	//再次进入，直接跳过本部分
									}
								}
							});
							return;
						}break;
						case "false-false":{			//日期不相反，大于行程天数，扩展日期
							var cach=[]
							
							for(var i=0;i<nowRouteDay;i++){
								if(typeof(this.routeInfomation.route[i]) == "object"){
									cach[i]=this.routeInfomation.route[i]
								}
								else{
									cach[i]=[];
								}
							}
							this.routeInfomation.route=cach;
						}break;
					}
					this.isChooseOver=false;
				}
				
				this.routeInfomation.routeDay=this.dateSpace(this.routeInfomation.routeStartTime,this.routeInfomation.routeEndTime);
				
				
				// 改了背景图
				if(this.backgroundImg!=""){
					//保存图片
					uni.saveFile({
						tempFilePath: this.backgroundImg[0].path,
						success: (res) => {
							//存入图片信息
							this.routeInfomation.routeImg=res.savedFilePath;
							
							/* 保存到数据库 */
							//加入新数据
							this.userRoute[this.routeId]=this.routeInfomation;
							//存到本地数据库
							uni.setStorageSync(this.userInfomation.userName+"_route",this.userRoute);
							uni.navigateBack();
						},
						fail: (res) => {
							uni.showToast({
								title:"图片保存失败",
								icon:"none"
							});
						}
					});
					return;
				}
				else{
					/* 保存到数据库 */
					//加入新数据
					this.userRoute[this.routeId]=this.routeInfomation;
					//存到本地数据库
					uni.setStorageSync(this.userInfomation.userName+"_route",this.userRoute);
					var s=uni.getStorageSync(this.userInfomation.userName+"_route")
				}
				// uni.reLaunch({
				// 	url:"../editRoute?routeId="+this.routeId
				// });
				uni.navigateBack();
				
			},
			
			//将时间转换为特定格式
			get_specialFormat:function(date){
				var s=date.split('/');
				var nDate=new Date(parseInt(s[0]),parseInt(s[1])-1,parseInt(s[2]));
				var year=nDate.getFullYear();
				var mon=nDate.getMonth() + 1 < 10 ? '0' + (nDate.getMonth() + 1) : nDate.getMonth() + 1;
				var day=nDate.getDate() < 10 ? '0' + nDate.getDate() : nDate.getDate();
				return year+'-'+mon+'-'+day;
			},
			/* 时间检查
				// 开始日期大于结束日期		Status_A
				// 调整后天数小于行程天数		Status_B
				// return "Status_A-Status_B"
			*/
			check_date:function(sDate,eDate){
				var Status_A,Status_B;
				var sDay=new Date(sDate);
				var eDay=new Date(eDate);
				var day=this.dateSpace(sDate,eDate);
				
				Status_A = sDay.getTime()>eDay.getTime()?true:false;
				Status_B = day<this.routeInfomation.routeDay?true:false;
				
				return Status_A+"-"+Status_B
				
			},
			//计算日期差
			dateSpace(sDate1, sDate2) { //sDate1和sDate2是2006-12-18格式 得出量日期之间的天数
				var dateSpan, tempDate, iDays;
				sDate1 = Date.parse(sDate1);
				sDate2 = Date.parse(sDate2);
				dateSpan = sDate2 - sDate1;
				dateSpan = Math.abs(dateSpan);
				iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
				return iDays+1;
			}
		},
		components:{
			QSInput,
			QSPickerDate,
			QSInfinitePics
		}
	}
</script>

<style>

</style>
