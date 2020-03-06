<template>
	<view style="background-color: #F5F5F5;">
		
		<!-- 标题栏 -->
		<view style="background-color: #11B4D1;position: relative;z-index: 1;width: 750rpx;height: 258rpx;display: flex;justify-content: center;">
			
			<p style="position: absolute;z-index: 1;top: 60rpx;color: #FFFFFF;font-size: 50rpx;">添加行程</p>
			
			<!-- 地点选择 -->
			<navigator
				url="../../choose_place/choose_place?isAdd=true"
				style="position: absolute;z-index: 1;top:150rpx;color: #FFFFFF;font-size: 45rpx;display: flex;justify-content: center;align-items: center;"
				>
				{{siteCity}}
				<p style="font-size: 35rpx;margin-left: 10rpx;vertical-align: bottom;">▼</p>
			</navigator>
			
		</view>
		
		<!-- 类型选择按钮 -->
		<view class="typeChooseCss">
			<view v-for="(item,index) in typeDate" @click="chage_type(item.key)" v-bind:class="{isChoosed:siteType===item.key}" :key="item.key">
				{{item.name}}
			</view>
		</view>
		
		<!-- 下方操作 -->
		<view id="siteChooseView">
			<view 
				v-if="isLoading"
				:style="{'height':scrollHeight}"
				style="display: flex;width: 750rpx;justify-content: center;align-items: center;position: relative;bottom:50rpx"
				>正在加载中...
			</view>
			
			<view
				v-if="isNoDate && !isLoading"
				:style="{'height':scrollHeight}"
				style="display: flex;width: 750rpx;justify-content: center;align-items: center;position: relative;bottom:50rpx"
				>暂无数据</view>

			<view v-else>
				
				<!-- 景点 -->
				<scroll-view
					v-if="siteType=='site'"
					scroll-y="true"
					class="siteCss"
					:style="{'height':scrollHeight}"
					>
					
					<view style="width: 750rpx;height: 60rpx;position: relative;z-index: 2;"></view>
					
					<navigator
						v-for="(site,index) in siteInforamtion"
						class="aSiteCss"
						:key="index"
						:url="siteIntroductionBaseUrl+site.siteName"
						>
						
						<!-- 控制位置 -->
						<view class="aSiteCss_left"> 
							<!-- 控制形状 -->
							<view class="aSiteCss_image">
								<img :src="site.siteImg"/>
							</view>
						</view>
						
						<view class="aSiteCss_text">
							<p class="aSiteCss_text_siteName">{{site.siteName}}</p>
							<p class="aSiteCss_text_siteGrade fontFormat">{{site.siteGrade}}</p>
							<p class="aSiteCss_text_siteOpenTime fontFormat">开放时间：{{site.siteOpenTime}}</p>
							<p class="aSiteCss_text_introduction fontFormat">{{site.siteIntroduction}}</p>
						</view>
						
					</navigator>
				</scroll-view>
				
				<!-- 美食、及酒店 -->
				<scroll-view
					v-if="siteType=='food' || siteType=='hotel'"
					scroll-y="true"
					class="siteCss"
					:style="{'height':scrollHeight}"
					>
					
					<view style="width: 750rpx;height: 60rpx;position: relative;z-index: 2;"></view>
					
					<navigator
						v-for="(food,index) in siteInforamtion"
						class="aSiteCss"
						:key="index"
						:url="siteIntroductionBaseUrl+food.foodName"
						>
						
						<!-- 控制位置 -->
						<view class="aSiteCss_left"> 
							<!-- 控制形状 -->
							<view class="aSiteCss_image">
								<img :src="food.foodImg"/>
							</view>
						</view>
						
						<view class="aSiteCss_text">
							<p class="aSiteCss_text_siteName">{{food.foodName}}</p>
							<p class="aSiteCss_text_siteGrade fontFormat">{{food.foodGrade}}</p>
							<p class="aSiteCss_text_siteOpenTime fontFormat">开放时间：{{food.foodLocation}}</p>
							<p class="aSiteCss_text_introduction fontFormat">{{food.foodIntroduction}}</p>
						</view>
						
					</navigator>
				</scroll-view>
				
				
				<!-- 交通 -->
				<view v-if="siteType=='traffic'" class="trafficCss">
					
					<!-- 开始地点 -->
					<view style="width: 750rpx;">
						<QSInput
							name="startPlace" 
							:required="false"
							title="开始地点"
							titleColor="#000000"
							layout="column"
							v-model="trafficData.startPlace"
							></QSInput>
					</view>
					
					<!-- 结束地点 -->
					<view style="width: 750rpx;">
						<QSInput
							name="endPlace" 
							:required="false"
							title="结束地点"
							titleColor="#000000"
							layout="column"
							v-model="trafficData.endPlace"
							></QSInput>
					</view>
					
					<!-- 交通工具 -->
					<view class="VehcileCss">
						<p>请选择交通工具</p>
						<picker @change="chooseVehcileChange" :range="vehcile" mode="selector" v-model="trafficData.vehcile">
							<view v-if="currentVehcileId==-1" class="VehcileCss_unChoose">请选择></view>
							<view v-if="currentVehcileId!=-1" class="VehcileCss_choose">{{vehcile[currentVehcileId]}}</view>
						</picker>
					</view>
					
					<!-- 备注 -->
					<view style="width: 750rpx;">
						<QSInput
							name="remark" 
							:required="false"
							title="备注"
							titleColor="#000000"
							layout="column"
							v-model="trafficData.remark"
							></QSInput>
					</view>
					
					<view style="width: 750rpx;">
					
						<button @click="save_traffic">增加</button>
					
					</view>

				</view>
					
					
				<!-- 自定义 -->
				<view v-if="siteType=='custom'" style="margin-top: 30rpx;">
					<!-- 标题 -->
					<view style="width: 750rpx;">
						<QSInput
							name="title" 
							:required="true"
							title="标题"
							titleColor="#000000"
							layout="column"
							v-model="customData.title"
							></QSInput>
					</view>
					
					<!-- 内容 -->
					<view style="width: 750rpx;">
						<QSTextarea
							name="content" 
							:required="true"
							title="内容"
							titleColor="#000000"
							layout="column"
							v-model="customData.content"
							></QSTextarea>
							
						<button @click="save_custom">增加</button>
					</view>
				</view>	
					
			</view>
				
				
		</view>
			
	</view>
		
</template>

<script>
	import QSInput from '@/components/QS-inputs-split/elements/QS-input/index.vue';
	import QSPickerCustom from '@/components/QS-inputs-split/elements/QS-picker-custom/index.vue';
	import QSTextarea from '@/components/QS-inputs-split/elements/QS-textarea/index.vue';
	
	export default {
		data() {
			return {
				/* 上页数据 */
				routeId:"",
				userInformation:"",
				userRoute:"",
				routeInformaion:"",
				dayId:"",
				siteType:"",
				siteCity:"",
				/* 本页数据 */
				typeDate:[			//景点类型
					{
						name:'景点',
						key:'site'
					},
					{
						name:'美食',
						key:'food'
					},
					{
						name:'住宿',
						key:'hotel'
					},
					{
						name:'交通',
						key:'traffic'
					},
					{
						name:'自定义',
						key:'custom'
					},
				],
				scrollHeight:"",
				siteInforamtion:"",
				isNoDate:true,
				isLoading:true,
				// 跳转的链接
				siteIntroductionBaseUrl:"../../../siteIntroduction/siteIntroduction?isEdit=true&siteName=",
				// 交通数据的格式
				trafficData:{
					siteType:"traffic",
					startPlace:"",
					endPlace:"",
					vehicle:"",
					remark:""
				},
				vehcile:['飞机','汽车','铁路','地铁','其他'],
				currentVehcileId:-1,
				customData:{
					siteType:"custom",
					title:"",
					content:""
				}
				
			}
		},
		methods: {
			onLoad:function(e){
				// 用户信息
				this.userInformation=uni.getStorageSync("currentUser");
				// 用户路线
				this.routeId=e.routeId;
				this.userRoute=uni.getStorageSync(this.userInformation.userName+"_route");
				this.routeInformaion=this.userRoute[this.routeId];
				this.siteCity=this.routeInformaion.routePlace;
				this.dayId=e.dayId;
				//路线类型
				this.siteType=e.siteType;
				//获取数据
				this.chage_type(this.siteType)
				
				//开始监听当前城市改变
				uni.$on('routeCity',(cityName)=>{
					this.siteCity=cityName;
					this.chage_type(this.siteType);
				});
				
				//开始监听增加景点
				uni.$on('addSite',(siteName)=>{
					this.add_site(siteName)
				});
				
			},
			
			onShow:function(){
			},
			
			//第一次加载时
			onReady:function(){
				//设置当前滚动容器的高
				this.get_scrollHeight(); 
			},
			
			onUnload:function(){
				//结束监听
				uni.$off('routeCity');
				uni.$off('addSite');
			},
			
			//获取当前应有的高度
			get_scrollHeight:function(){
				
				//获得屏幕高度
				uni.getSystemInfo({
					success:(res)=>{
						//获得列表高度
						let dom = uni.createSelectorQuery().in(this);
						dom.select("#siteChooseView").boundingClientRect(data =>{
							this.scrollHeight=`${res.windowHeight-data.top}px`;
						}).exec();
					}
				});
						
			},
			
			start_operate:function(){
				this.siteInforamtion="";
				this.isLoading=true;
				this.isNoDate=true;
			},
			
			//status表示获取数据是否成功
			over_operate:function(status){
				this.isLoading=false;
				this.isNoDate=!status;
			},
			
			//点击上方选择按钮，改变景点类型，并刷新数据，根据城市及景点类型
			chage_type:function(type){
				this.start_operate();
				//切换景点
				this.siteType=type;
				
				//景区、美食、住宿获取数据
				if(type=='food' || type=='site' || type=='hotel'){
					//开始获取数据
					uni.request({
						url:getApp().globalData.baseUrl+"/"+this.siteCity+"/"+this.siteType,
						success: (data) => {
							this.siteInforamtion=data.data._root_;
						},
						complete: () => {
							if(this.siteInforamtion){
								this.over_operate(true);
							}
							else{
								this.over_operate(false);
							}
							
						}
					});	
				}
				
				//交通
				if(type=='traffic' || type=='custom')
				{
					this.over_operate(true);
				}
			},
			
			//增加景点
			add_site:function(siteObject){
				if(siteObject){
					console.log(this.dayId)
					this.routeInformaion.route[this.dayId].push(siteObject);
					this.save();
				}
			},
			
			//选择的交通改变时
			chooseVehcileChange:function(e){
				this.currentVehcileId=e.detail.value;
			},
			
			//保存交通
			save_traffic:function(){
				if(this.currentVehcileId!=-1 && this.trafficData.startPlace!="" && this.trafficData.endPlace!=""){
						this.trafficData.vehicle=this.vehcile[this.currentVehcileId];
						
						this.add_site(this.trafficData);
						
						uni.showToast({
							title:'保存成功'
						});
						
						this.currentVehcileId=-1;
						
						//清空数据
						this.trafficData={
							siteType:"traffic",
							startPlace:"",
							endPlace:"",
							vehicle:"",
							remark:""
						};
				}
				else{
					uni.showToast({
						title:'请输入完整',
						icon:"none"
					});
				}
				
			},
			
			//保存自定义
			save_custom:function(){
				if(this.customData.title!="" && this.customData.content!=""){
					this.add_site(this.customData);
					
					uni.showToast({
						title:'保存成功'
					})
					
					this.customData={
						siteType:"custom",
						title:"",
						content:""
					}
					
				}
				else{
					uni.showToast({
						title:'请输入完整',
						icon:"none"
					});
				}
			},
			
			//保存当前信息到数据库
			save:function(){
				this.userRoute[this.routeId]=this.routeInformaion;
				uni.setStorageSync(this.userInformation.userName+"_route",this.userRoute);
			},
		},
		
		components:{
			QSInput,
			QSPickerCustom,
			QSTextarea
		}
	}
</script>

<style>
.typeChooseCss{
	width: 750rpx;
	position: absolute;
	top: 240rpx;
	display: flex;
	align-items: center;
	justify-content: space-around;
	z-index: 3;
}

.typeChooseCss view{
	font-size: 32rpx;
	width: 120rpx;
	height: 50rpx;
	background-color: #FFFFFF;
	border-radius: 15rpx;
	display: flex;
	justify-content: center;
}

/* 按钮被选中 */
.isChoosed{
	color: #0ba6c2;
}

.siteCss{
}

/* 一个景点 */
.aSiteCss{
	width: 750rpx;
}

.aSiteCss_left{
	display: inline-block;
	width:300rpx;
	text-align: center;
	
}

.aSiteCss_image{
	overflow: hidden;
	display: inline-block;
	text-align: center;
	width: 260rpx;
	height: 260rpx;
}

.aSiteCss_image img{
	width:500rpx;
	position: relative;
	right: 130rpx;
}

.aSiteCss_text{
	display: inline-block;
	width: 450rpx;
}

.aSiteCss_text_siteName{
	font-size: 36rpx;
	color: #333333;
	font-weight: bolder;
}

.fontFormat{
	margin-top: 9rpx;
	font-size: 28rpx;
}

.aSiteCss_text_siteGrade{
	color: #11b4d1;
}

.aSiteCss_text_siteOpenTime{
	color: #999999;
}

.aSiteCss_text_introduction{
	color: #999999;
	overflow: hidden;
	height: 115rpx;
	/* 省略号 */
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;
	overflow: hidden;
}

.trafficCss{
	margin-top: 30rpx;
}

button{
	width: 500rpx;
	background-color: #0077EE;
	color: #FFFFFF;
}

.VehcileCss{
	display: flex;
	justify-content: left;
	flex-direction: column;
	padding: 0 0rpx 0 40rpx;
	font-size: 32rpx;
}

.VehcileCss view{
	position: relative;
	right: 20rpx;
	margin: 30rpx;
}

.VehcileCss_choose{
	color: #000000;
}

.VehcileCss_unChoose{
	color: #A1A1A1;
}
</style>
