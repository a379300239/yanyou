<template>
	<view style="background-color: #F2F2F2;width: 750rpx;" v-if="!isLoading">
		<image :src="siteInformation.siteImg" style="width: 750rpx;height: 520rpx;position: absolute;z-index: 1;overflow: hidden;"></image>
		<navigator open-type="navigateBack">
			<image src="../../static/siteIntroduction/back.png" style="width:52rpx;height: 75rpx; position: absolute;z-index: 2;margin-top:50rpx;margin-left: 30rpx;"></image>
		</navigator>
		
		<view class="cardBackgroundCss">
			<view class="siteCardCss">
				<!-- 景点名 -->
				<p class="titleCss">{{siteInformation.siteName}}</p>
				
				<!-- 景点特色 -->
				<p class="featureCss">“{{siteInformation.siteFeature}}”</p>
				
				<!-- 景点位置 -->
				<view class="locationCss" @click="open_map">
					<view class="location_iconView">
						<image src="../../static/siteIntroduction/location.png" class="locationCss_iconCss"></image>
					</view>
					<view style="display: inline-block;">
						<p class="locationCss_location">{{siteInformation.siteLocation}}</p>
						<p class="locationCss_distance">{{siteInformation.siteDistanceToCity}}</p>
					</view>
				</view>
				
				<!-- 横线 -->
				<view style="text-align: center;">
					<hr style="height:1rpx; width: 638rpx; border:none;border-top:1px solid  #EBF8FB; margin-top: :;rpx;" />
				</view>
				
				<!-- 游玩时间 -->
				<view class="playTimeCss">
					<view class="location_iconView">
						<image class="locationCss_iconCss" src="../../static/siteIntroduction/playTime.png"></image>
					</view>
					
					<view style="display: inline-block;">
						<p class="playTimeCss_siteOpenTime">{{siteInformation.siteOpenTime}}</p>
						<p class="playTimeCss_sitePlaytime">游玩约需{{siteInformation.sitePlayTime}}</p>
					</view>
					
					<view
						style="display: inline-block;position: relative;left: 100rpx;margin-bottom: 20rpx;vertical-align: bottom;"
						@click="open_introductionView">
						<view style="display: inline-block;text-align: right;">
							<p style="color: #5FD0DA;">更多详情></p>
						</view>
						
						<uni-popup ref="introductionView" type="center" class="introductionView">
							
							<view class="introductionMask" >
								<view class="introductionViewView">
									
									<view class="introductionViewViewTitle">
										介绍
									</view>
									
									<image src="../../static/modifySite/closeButton.png" @click="close_introductionView"></image>
									
									<scroll-view class="introductionViewViewContent" scroll-y="true">
										
										{{siteInformation.siteIntroduction}}
									</scroll-view>
									
								</view>
							</view>
							
						</uni-popup>
					</view>
					
					
					
				</view>
				
			</view>
			
			<!-- 增加按钮，当isEdit为true时出现 -->
			<view v-if="isEdit" class="addButtonCss">
				<image src="../../static/siteIntroduction/add.png" @click="add_site"></image>
			</view>
			
		</view>		
	</view>
	
	<view v-else>
		<yanyouLoading></yanyouLoading>
	</view>
	
</template>

<script>
	import yanyouLoading from '@/components/yanyou-loading/yanyou-loading.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	export default {
		data() {
			return {
				currentSite:"",
				isEdit:"",
				siteInformation:"",	//当前景点数据
				isLoading:true
			}
		},
		methods: {
			onLoad:function(data){
				this.currentSite=data.siteName;		//确定当前景点
				if(data.isEdit=="true"){			//是否为路线编辑->是否需要显示加入按钮
					this.isEdit=true;
				}
				else{
					this.isEdit=false;
				}
				
				this.load_siteInformation(this.currentSite);
			},
			onBackPress:function(){
				return false;
			},
			open_map:function(){
				try{
					// plus.runtime.openURL("androidamap://navi?sourceApplication=appname&poiname=fangheng&lat=36.547901&lon=104.258354&dev=1&style=2");
					plus.runtime.openURL("androidamap://navi");
				}catch(e){
					//TODO handle the exception
				}
			},
			load_siteInformation:function(siteName){
				uni.request({
					url:getApp().globalData.baseUrl+'/site/'+siteName,
					success:(data)=>{
						this.siteInformation=data.data;
						this.isLoading=false;
					}
				});
			},
			
			// 打开更多详情
			open_introductionView:function(){
				this.$refs.introductionView.open();
			},
			
			// 关闭更多详情
			close_introductionView:function(){
				this.$refs.introductionView.close();
			},
			
			// 通过emit传值
			add_site:function(){
				var site={
					"siteType":this.siteInformation.siteType,
					"siteName":this.siteInformation.siteName,
					"siteImg":this.siteInformation.siteImg,
					"sitePlayTime":this.siteInformation.sitePlayTime,
					"siteGrade":this.siteInformation.siteGrade,
					"siteCity":this.siteInformation.siteCity
				};
				uni.$emit('addSite',site);
				uni.showToast({
					title:"成功加入"+this.siteInformation.siteName
				});
				uni.navigateBack();
			}
			
		},
		components:{
			yanyouLoading,
			uniPopup
		}
	}
</script>

<style>
.cardBackgroundCss{
	position: absolute;
	z-index: 3;
	width: 750rpx;
	margin-top: 490rpx;
	display: inline-block;
	text-align: center;
}
	
.siteCardCss{
	width: 700rpx;
	background-color: #FAFAFA;
	-webkit-border-radius: 20px;	//圆角
	display: inline-block;
	text-align: left;
}

.titleCss{
	font-size: 65rpx;
	margin-left: 30rpx;
	padding-top: 30rpx;
}

.featureCss{
	font-size: 33rpx;
	margin-left: 20rpx;
	margin-top: 15rpx;
	margin-bottom: 15rpx;
	color: #00bec6;
}

.locationCss{
	display: inline-block;
	/* width: 750rpx; */
	margin-left: 20rpx;
	margin-top: 60rpx;
	margin-bottom:30rpx;
}

.location_iconView{
	display: inline-block;
	margin-right: 20rpx;
	padding-bottom: 10rpx;
	vertical-align: bottom;
}

.locationCss_iconCss{
	display: inline-block;
	width: 64rpx;
	height: 64rpx;
}

.locationCss_location{
	display: inline-block;
	font-size: 40rpx;
	vertical-align: bottom;
	padding-bottom: 25rpx;
}

.locationCss_distance{
	font-size: 30rpx;
	color: #999999;
}

.playTimeCss{
	display: inline-block;
	/* width: 750rpx; */
	margin-left: 20rpx;
	margin-top: 30rpx;
	margin-bottom:250rpx;
}

.playTimeCss_siteOpenTime{
	display: inline-block;
	font-size: 40rpx;
	vertical-align: bottom;
	padding-bottom: 25rpx;
}

.playTimeCss_sitePlaytime{
	font-size: 30rpx;
	color: #999999;
}

.addButtonCss{
	position: relative;
	z-index: 5;
	width: 750rpx;
	text-align: center;
	bottom:50rpx;
}

.addButtonCss image{
	width: 162rpx;
	height: 100rpx;
}

.introductionMask{
	width: 750rpx;
	height: 100%;
	display: flex;
	position: fixed;
	align-items: center;
	justify-content: center;
	left: 0;
	top: 0;
	z-index: -1;
}

.introductionView{
	position: absolute;
	z-index: 100;
}

.introductionViewView{
	width: 630rpx;
	background-color: #FFFFFF;
	padding: 40rpx 30rpx 40rpx 30rpx;
	border-radius: 30rpx;
}

.introductionViewView image{
	position: relative;
	left: 480rpx;
	bottom: 15rpx;
	width: 60rpx;
	height: 60rpx;
}

.introductionViewViewTitle{
	font-weight: 1000;
	font-size: 45rpx;
	display: inline-block;
	margin:0rpx 0 0 0;
}
.introductionViewViewContent{
	height: 600rpx;
	padding-top: 30rpx;
	font-size: 35rpx;
	line-height: 2;
}

</style>
