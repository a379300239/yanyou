<template>
	<view style="background-color: #F2F2F2;width: 750rpx;">
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
					
					<navigator style="display: inline-block;position: relative;left: 100rpx;margin-bottom: 20rpx;vertical-align: bottom;">
						<view style="display: inline-block;text-align: right;">
							<p style="color: #5FD0DA;">更多详情></p>
						</view>
					</navigator>
					
				</view>
				
			</view>
			
			<!-- 增加按钮，当isEdit为true时出现 -->
			<view v-if="isEdit" class="addButtonCss">
				<image src="../../static/siteIntroduction/add.png"></image>
			</view>
			
		</view>		
	</view>
</template>

<script>
	export default {
		onLoad:function(data){
			this.currentSite=data.siteName;		//确定当前景点
			if(data.isEdit=="true"){			//是否为路线编辑->是否需要显示加入按钮
				this.isEdit=true;
			}
			else{
				this.isEdit=false;
			}
				
			switch (this.currentSite){
				case "东郊记忆":this.siteInformation=this.dongjiaojiyi;break;
				case "成都理工大学":this.siteInformation=this.CDUT;break;
				case "熊猫塔":this.siteInformation=this.pandaTower;break;
				case "成都植物园":this.siteInformation=this.chengDuPlant;break;
				case "欢乐谷":this.siteInformation=this.huanleGu;break;
				case "西华大学":this.siteInformation=this.xiHuaUniversity;break;
				default:case "东郊记忆":this.siteInformation=this.dongjiaojiyi;break;
					break;
			}
		},
		data() {
			return {
				currentSite:"",
				isEdit:"",
				siteInformation:"",	//当前景点数据
				//景点数据
				dongjiaojiyi:{
					siteName:"东郊记忆",
					siteImg:"../../static/index/dongjiaojiyi.jpg",
					siteGrade:"5",
					siteFeature:"中国特色步行街",
					siteLocation:"成华区二仙桥东三路一号",
					siteDistanceToCity:"距市中心100m",
					siteOpenTime:"全年 05:00-23:00",
					sitePlayTime:"2-3小时"
				},
				CDUT:{
					siteName:"成都理工大学",
					siteImg:"../../static/index/CDUT.jpg",
					siteGrade:"5",
					siteFeature:"恐龙大学",
					siteLocation:"成华区二仙桥东三路一号",
					siteDistanceToCity:"距市中心100m",
					siteOpenTime:"全年 05:00-23:00",
					sitePlayTime:"2-3小时"
				},
				pandaTower:{
					siteName:"熊猫塔",
					siteImg:"../../static/index/pandaTower.jpg",
					siteGrade:"5",
					siteFeature:"好高好高的塔",
					siteLocation:"成华区二仙桥东三路一号",
					siteDistanceToCity:"距市中心100m",
					siteOpenTime:"全年 05:00-23:00",
					sitePlayTime:"2-3小时"
				},
				chengDuPlant:{
					siteName:"成都植物园",
					siteImg:"../../static/index/chengDuPlant.jpg",
					siteGrade:"5",
					siteFeature:"植物园",
					siteLocation:"金牛区",
					siteDistanceToCity:"距市中心100m",
					siteOpenTime:"全年 05:00-23:00",
					sitePlayTime:"2-3小时"
				},
				huanleGu:{
					siteName:"欢乐谷",
					siteImg:"../../static/index/huanleGu.jpg",
					siteGrade:"5",
					siteFeature:"欢乐谷",
					siteLocation:"金牛区",
					siteDistanceToCity:"距市中心100m",
					siteOpenTime:"全年 05:00-23:00",
					sitePlayTime:"2-3小时"
				},
				xiHuaUniversity:{
					siteName:"西华大学",
					siteImg:"../../static/index/xiHuaUniversity.jpg",
					siteGrade:"5",
					siteFeature:"大学",
					siteLocation:"金牛区",
					siteDistanceToCity:"距市中心100m",
					siteOpenTime:"全年 05:00-23:00",
					sitePlayTime:"2-3小时"
				}
			}
		},
		methods: {
			open_map:function(){
				try{
					// plus.runtime.openURL("androidamap://navi?sourceApplication=appname&poiname=fangheng&lat=36.547901&lon=104.258354&dev=1&style=2");
					plus.runtime.openURL("androidamap://navi");
				}catch(e){
					//TODO handle the exception
				}
			}
			
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
</style>
