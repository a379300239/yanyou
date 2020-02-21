<template>
	<view style="width: 100%; background: #FAFAFA;">
		
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
			
			<uni-swiper-dot :info="info" :current="current" :mode="mode" :dots-styles="dotsStyles" field="content">
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
</template>

<script>
	import uniSwiperDot from '@/components/uni-swiper-dot/uni-swiper-dot.vue'
	export default{
		data(){
			return {
				// banner相关
				info: [],
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
				chengHuaInfo:[{
						colorClass: 'uni-bg-red',
						url: '../../static/index/banner_1.jpg',
						content: {
							name:'成华区推荐路线1',
							keyvalue:'雪白、好看',
						introduce:'雪山是台湾的次高山，海拔高度3886米。雪山位于苗栗县泰安乡和台中县和平乡的交界，标高3,886公尺，为雪山山系的最高峰，在百岳中仅次于玉山。雪山是雪山山脉的中心点，由此向外呈放射状延伸，支脉绵亘北台湾。全山是由赤褐色页岩、砂岩及板岩所构成。雪山地区有多处的「冰斗」地形，是台湾冰河遗迹最多的地方。'
						}
				}, {
						colorClass: 'uni-bg-red',
						url: '../../static/index/banner_2.jpg',
						content: {
							name:'成华区推荐路线2',
							keyvalue:'草地、干净',
							introduce:'草地是一种复合植物群落，由草、开花植物和喜光植物组成。开花植物和喜光植物所占的比例高低有所变化。草坪是长期维持低矮状态，而种类丰富的草地一年只修剪一次或两次，物种比较稀少的草地一年可以修剪多次，有时可以达到六次。除了当地因子(如土壤和气候)以外恢复性修剪也有助于调整物种组成。草地有其自有的生长、开花、结果和种子成熟的规律：一般来说，草地需要的维护管理很少．但是也不耐践踏。'
						}
				}, {
						colorClass: 'uni-bg-red',
						url: '../../static/index/banner_3.jpg',
						content: {
							name:'成华区推荐路线3',
							keyvalue:'神秘、古老',
							introduce:'金字塔在埃及和美洲等地均有分布，古埃及的上埃及、中埃及和下埃及，今苏丹和埃及境内。现在的尼罗河下游，散布着约80座金字塔遗迹。 大小不一，其中最高大的是胡夫金字塔，高146.5米，底长230米，共用230万块平均每块2.5吨的石块砌成，占地52000平方公尺。石块之间没有任何黏着物，靠石块的相互叠压和咬合垒成。国王哈佛拉的金字塔前，还矗立着一座象征国王权力与尊严的狮身人面像。埃及金字塔是古埃及的帝王（法老）陵墓。世界七大奇迹之一。数量众多，分布广泛。开罗西南尼罗河西古城孟菲斯一带的金字塔是占有集中的一部分。'
						}
				}],
				chengHuaRoutes:[
					{
						name:'东郊记忆',
						feature:"中国特色商业步行街1",
						price:"45",
						url:'../../static/index/dongjiaojiyi.jpg'
					},
					{
						name:'成都理工大学',
						feature:"中国特色商业步行街2",
						price:"45",
						url:'../../static/index/CDUT.jpg'
					},
					{
						name:'熊猫塔',
						feature:"中国特色商业步行街3",
						price:"45",
						url:'../../static/index/pandaTower.jpg'
					}					
				],
				jinNiuInfo:[{
						colorClass: 'uni-bg-red',
						url: '../../static/index/banner_1.jpg',
						content: {
							name:'金牛区推荐路线一',
							keyvalue:'雪白、好看',
						introduce:'雪山是台湾的次高山，海拔高度3886米。雪山位于苗栗县泰安乡和台中县和平乡的交界，标高3,886公尺，为雪山山系的最高峰，在百岳中仅次于玉山。雪山是雪山山脉的中心点，由此向外呈放射状延伸，支脉绵亘北台湾。全山是由赤褐色页岩、砂岩及板岩所构成。雪山地区有多处的「冰斗」地形，是台湾冰河遗迹最多的地方。'
						}
				}, {
						colorClass: 'uni-bg-red',
						url: '../../static/index/banner_2.jpg',
						content: {
							name:'金牛区推荐路线二',
							keyvalue:'草地、干净',
							introduce:'草地是一种复合植物群落，由草、开花植物和喜光植物组成。开花植物和喜光植物所占的比例高低有所变化。草坪是长期维持低矮状态，而种类丰富的草地一年只修剪一次或两次，物种比较稀少的草地一年可以修剪多次，有时可以达到六次。除了当地因子(如土壤和气候)以外恢复性修剪也有助于调整物种组成。草地有其自有的生长、开花、结果和种子成熟的规律：一般来说，草地需要的维护管理很少．但是也不耐践踏。'
						}
				}, {
						colorClass: 'uni-bg-red',
						url: '../../static/index/banner_3.jpg',
						content: {
							name:'金牛区推荐路线三',
							keyvalue:'神秘、古老',
							introduce:'金字塔在埃及和美洲等地均有分布，古埃及的上埃及、中埃及和下埃及，今苏丹和埃及境内。现在的尼罗河下游，散布着约80座金字塔遗迹。 大小不一，其中最高大的是胡夫金字塔，高146.5米，底长230米，共用230万块平均每块2.5吨的石块砌成，占地52000平方公尺。石块之间没有任何黏着物，靠石块的相互叠压和咬合垒成。国王哈佛拉的金字塔前，还矗立着一座象征国王权力与尊严的狮身人面像。埃及金字塔是古埃及的帝王（法老）陵墓。世界七大奇迹之一。数量众多，分布广泛。开罗西南尼罗河西古城孟菲斯一带的金字塔是占有集中的一部分。'
						}
				}],
				jinNiuRoutes:[
					{
						name:'成都植物园',
						feature:"中国特色商业步行街1",
						price:"45",
						url:'../../static/index/chengDuPlant.jpg'
					},
					{
						name:'欢乐谷',
						feature:"中国特色商业步行街2",
						price:"45",
						url:'../../static/index/huanleGu.jpg'
					},
					{
						name:'西华大学',
						feature:"中国特色商业步行街3",
						price:"45",
						url:'../../static/index/xiHuaUniversity.jpg'
					}					
				],
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
				switch (spot){
					case '成华区':{
						this.info=this.chengHuaInfo;
						this.routes=this.chengHuaRoutes;
					}break;
					case '金牛区':{
						this.info=this.jinNiuInfo;
						this.routes=this.jinNiuRoutes;
					}break;
					default:{
						this.info=this.chengHuaInfo;
						this.routes=this.chengHuaRoutes;
					}break;
				}
			},
			navigator_siteIntroduction:function(site){
				uni.navigateTo({
					url:"../siteIntroduction/siteIntroduction?siteName="+site+"&isEdit=true",
					animationType:"pop-in"
				});
			}
		},
		components:{
			uniSwiperDot,		//banner
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
