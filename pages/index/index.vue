<template>
	<view style="width: 100%; background: #FAFAFA;" v-if="isLoading">
		<!-- 导航栏 -->	
		<view class="navigator">
			<view style="width: 20%; display:inline-block;height: 100rpx;">
				<picker class="navigator-siteChoose" @change="change_currentSpot" @columnchange="change_site" mode="multiSelector" :range="currentSitesList" :value="currentSiteIndex">{{ currentSite }}</picker>
			</view>
			
			<view style="width: 60%; display: inline-block; height: 100rpx;text-align: center;">
				<input name="search" class="navigator-search" type="text" placeholder="搜索" placeholder-style="font:100"/>
				
			</view>
			<view style="width: 20%; display: inline-block;height: 100rpx;">
				<button class="navigator-submit">确认</button>
			</view>
		</view>
		
		<!-- banner -->
		<view style="background: #EBEBEB;" >
			
			<uni-swiper-dot :info="info" :current="current" :mode="mode" :dots-styles="dotsStyles">
				<swiper class="swiper-box" @change="change">
					<swiper-item v-for="(item, index) in info" :key="index">
						<view :class="item.colorClass" class="swiper-item">
							<image :src="item.url" mode="aspectFill" class="swiper-item-image"/>
						</view>
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
			
		</view>
				
		<!-- 推荐路线 -->
		<view class="siteIntroduce">
			<p class="siteIntroduce_title">{{info[current].content.name}}</p>
			<view style="padding-left:10%; padding-right: 10%; padding-top: 30rpx;">
				<image src="../../static/index/keyvalue_icon.png" class="siteIntroduce_icon"></image>
				<p class="siteIntroduce_text">看点 : {{info[current].content.keyvalue}}</p>
			</view>
			
			<view style="padding-left:10%; padding-right: 10%; padding-top: 20rpx;">
				<image src="../../static/index/introduce_icon.png" class="siteIntroduce_icon"></image>
				<p class="siteIntroduce_text">介绍 : {{info[current].content.introduce}}</p>
			</view>
		</view>
		
		<!-- 推荐景点 -->
		<view class="introduce_sites_title">
			<p>您好，欢迎来到{{currentSite}}</p>
		</view>
		
		<p style="font-size: 48rpx;padding-top: 30rpx;padding-left: 30rpx;">当地热门</p>
		
		<view class="introduce_sites">
			<view v-for="(item,index) in routes" :key="index" class="introduce_sites_view" @click="navigator_siteIntroduction(item.name)">
				<view class="introduce_sites_image">
					<image :src="item.url"/>
				</view>
				
				<view class="introduce_sites_text">
					<p style="font-size: 39rpx;">{{item.name}}</p>
					<p style="font-size: 25rpx;color:#0e21d4;background-color:#D4F2F8;display: inline;padding: 10rpx 20rpx 10rpx 20rpx;">{{item.feature}}</p>
					<p style="font-size: 33rpx;color:#EA975B;margin-top: 15rpx;">¥{{item.price}}起</p>
				</view>
			</view>
		</view>
		
		
	</view>
	
	<view v-else>
		<yanyouLoading></yanyouLoading>
	</view>
</template>

<script>
	import uniSwiperDot from '@/components/uni-swiper-dot/uni-swiper-dot.vue'
	import yanyouLoading from '@/components/yanyou-loading/yanyou-loading.vue'
	
	export default{
		data(){
			return {
				isLoading:false,		//是否正在加载数据
				// banner相关
				info: [
					{
						content:{}
					}
				],
				current: 0,
				mode: 'indexes',
				dotsStyles: {
						backgroundColor: 'rgba(0, 0, 0, .3)',
						border: '1px rgba(0, 0, 0, .3) solid',
						color: '#fff',
						selectedBackgroundColor: 'rgba(0, 0, 0, .9)',
						selectedBorder: '1px rgba(0, 0, 0, .9) solid',
					},
				text:"",
				
				//推荐路线相关
				routes:[],
				currentSite:"",
				currentSiteIndex:[0,0,0],
				currentSitesList:[	
				],
				sites:{
					province:['四川','陕西'],
					city:[
						['成都','都江堰','内江','大邑'],
						['西安','延安']
					],
					sites:[
						[
							['成华区','金牛区'],
							['都江堰1区','都江堰2区'],
							['内江1区','内江2区'],
							['大邑1区','大邑2区','大邑3区']
						],
						[
							['西安1区','西安2区'],
							['延安1区','延安2区']
						]
					]					
				},
				/************************************************************************/
				//页面数据
				chengHuaInfo:[],
				chengHuaRoutes:[],
				jinNiuInfo:[],
				jinNiuRoutes:[],
			}
		},
		methods:{
			onLoad:function(){
				//景点选择
				this.currentSite=this.sites.sites[this.currentSiteIndex[0]][this.currentSiteIndex[1]][this.currentSiteIndex[2]];
				this.currentSitesList.push(this.sites.province);
				this.currentSitesList.push(this.sites.city[0]);
				this.currentSitesList.push(this.sites.sites[0][0]);
				//加载页面数据
				this.load_spotData('成华区');

			},
			onShow:function(){
				this.current=0;
			},
			//图片框更改
			change:function(e) {
			    this.current = e.detail.current;
				this.text=this.info[e.detail.current].content
			},
			//景点更改
			change_site:function(e){
				//记录更改
				this.currentSiteIndex[e.detail.column]=e.detail.value;
				if (e.detail.column != 2)
					this.currentSiteIndex[e.detail.column+1]=0;
					
				//市
				this.currentSitesList[1]=this.sites.city[this.currentSiteIndex[0]];
				//景点
				this.currentSitesList[2]=this.sites.sites[this.currentSiteIndex[0]][this.currentSiteIndex[1]];
				
				//当前景点
				this.currentSite=this.sites.sites[this.currentSiteIndex[0]][this.currentSiteIndex[1]][this.currentSiteIndex[2]];
			},
			//改变当前景区
			change_currentSpot:function(){
				this.load_spotData(this.currentSite);
			},
			//加载地区数据
			load_spotData:function(spot){
				//获得推荐路线数据
				uni.request({
					url:getApp().globalData.baseUrl+"/spotRoute/"+spot,
					success:(data)=>{
						this.info=data.data._root_;
						this.isLoading=true;
					}
				});
				// 获得推荐景区数据
				uni.request({
					url:getApp().globalData.baseUrl+"/spotSite/"+spot,
					success:(data)=>{
						this.routes=data.data._root_;
					}
				});
			},
			navigator_siteIntroduction:function(site){
				uni.navigateTo({
					url:"../siteIntroduction/siteIntroduction?siteName="+site+"&isEdit=false",
					animationType:"pop-in"
				});
			}
		},
		components:{
			uniSwiperDot,		//banner
			yanyouLoading
		}
	}
</script>

<style>
.navigator{
	margin-top: 8%;
	width: 100%;
	font-size: 30rpx;
}

button::after{
	border:none;
} 

.navigator-siteChoose{
	display: inline-block;
	width: 150rpx;
	text-align: center;
	margin-top: 20%;
	vertical-align: top;
}

.navigator-search{
	display: inline-block;
	vertical-align: top;
	text-align: center;
	margin-top: 5%;
	margin-bottom: 5%;
	width: 95%;
	border: 1rpx solid black;		//边框
	-webkit-border-radius: 100px;	//圆角
	-moz-border-radius: 100px;		
	border-radius: 100px;
}

.navigator-submit{
	display: inline-block;
	margin-top: 5%;
	margin-left: 5%;
	text-align: center;
	vertical-align: top;
	font-size: 30rpx;
}

.nav-search-placeholder{
	font: 100;
}


.swiper-box {
	height: 400rpx;
	padding-top: 5%;
	padding-bottom: 10%;
}

.swiper-item {
	text-align: center;
}

.swiper-item-image {
	-webkit-border-radius:10px;
}

.siteIntroduce{
	padding-top: 30rpx;
}

.siteIntroduce_title{
	display: block;
	text-align: center;
	font-size: 45rpx;
}

.siteIntroduce_icon{
	width: 50rpx; 
	height: 50rpx;
	
}

@font-face {
    font-family: 'STLiti';
    /* src: url('../../static/global/font/hinted-STLiti.ttf') format('truetype'); */
    font-weight: normal;
    font-style: normal;
}

@import "./static/global/font/STLITI.css";
.siteIntroduce_text {
	padding-left: 2%;
	display: inline;
	font-size: 30rpx;
}

.introduce_sites_title{
	margin-top:75rpx;
	text-align: center;
	height: 120rpx;
	background-color: #F2F2F2;
}

.introduce_sites_title p{
	padding-top: 30rpx;
	font-size: 45rpx;
	color: #158093;
}

.introduce_sites{
	padding-top: 3%;
}

.introduce_sites_view {
	width:50%;
	position:relative;
	display: inline-block;
}

.introduce_sites_image{
	display: inline-block;
	width: 100%;
	text-align: center;
	overflow:hidden;
}

.introduce_sites_image image{
	/* width: 334rpx; */
	-webkit-border-radius: 15rpx 15rpx 0rpx 0rpx;	//圆角
	width: 95%;
	height: 278rpx;
	
}

.introduce_sites_text {
	margin-bottom: 45rpx;
	margin-left: 35rpx;
}
</style>
