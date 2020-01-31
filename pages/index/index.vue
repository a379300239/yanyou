<template>
	<view style="width: 100%; background: #FAFAFA;">
		<!-- 留海设置 -->
		<view style="width: 100%; height: 65rpx; display: block;background: #000000;"></view>
		
		<!-- 导航栏 -->
		<view class="navigator">
			<view style="width: 20%; display:inline-block;height: 100rpx;">
				<picker class="navigator-siteChoose" @columnchange="change_site" mode="multiSelector" :range="currentSitesList" :value="currentSiteIndex">{{ currentSite }}</picker>
			</view>
			
			<view style="width: 60%; display: inline-block; height: 100rpx;text-align: center;">
				<input name="search" class="navigator-search" type="text" placeholder="搜索" placeholder-style="font:100"/>
				
			</view>
			<view style="width: 20%; display: inline-block;height: 100rpx;">
				<button class="navigator-submit">确认</button>
			</view>
						

			
		</view>
		
		<!-- banner -->
		<view style="background: #EBEBEB;">
			
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
		
		<!-- 景点介绍 -->
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
		
		<view class="introduce_routes">
			<view v-for="(item,index) in routes" :key="index" class="introduce_routes_view">
				<view class="introduce_routes_text">{{item.name}}</view>
				<image :src="item.url" class="introduce_routes_image"/>
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
				info: [{
						colorClass: 'uni-bg-red',
						url: '../../static/index/banner_1.jpg',
						content: {
							name:'雪山',
							keyvalue:'雪白、好看',
						introduce:'雪山是台湾的次高山，海拔高度3886米。雪山位于苗栗县泰安乡和台中县和平乡的交界，标高3,886公尺，为雪山山系的最高峰，在百岳中仅次于玉山。雪山是雪山山脉的中心点，由此向外呈放射状延伸，支脉绵亘北台湾。全山是由赤褐色页岩、砂岩及板岩所构成。雪山地区有多处的「冰斗」地形，是台湾冰河遗迹最多的地方。'
						}
				}, {
						colorClass: 'uni-bg-red',
						url: '../../static/index/banner_2.jpg',
						content: {
							name:'草地',
							keyvalue:'草地、干净',
							introduce:'草地是一种复合植物群落，由草、开花植物和喜光植物组成。开花植物和喜光植物所占的比例高低有所变化。草坪是长期维持低矮状态，而种类丰富的草地一年只修剪一次或两次，物种比较稀少的草地一年可以修剪多次，有时可以达到六次。除了当地因子(如土壤和气候)以外恢复性修剪也有助于调整物种组成。草地有其自有的生长、开花、结果和种子成熟的规律：一般来说，草地需要的维护管理很少．但是也不耐践踏。'
						}
				}, {
						colorClass: 'uni-bg-red',
						url: '../../static/index/banner_3.jpg',
						content: {
							name:'金字塔',
							keyvalue:'神秘、古老',
							introduce:'金字塔在埃及和美洲等地均有分布，古埃及的上埃及、中埃及和下埃及，今苏丹和埃及境内。现在的尼罗河下游，散布着约80座金字塔遗迹。 大小不一，其中最高大的是胡夫金字塔，高146.5米，底长230米，共用230万块平均每块2.5吨的石块砌成，占地52000平方公尺。石块之间没有任何黏着物，靠石块的相互叠压和咬合垒成。国王哈佛拉的金字塔前，还矗立着一座象征国王权力与尊严的狮身人面像。埃及金字塔是古埃及的帝王（法老）陵墓。世界七大奇迹之一。数量众多，分布广泛。开罗西南尼罗河西古城孟菲斯一带的金字塔是占有集中的一部分。'
						}
				}],
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
				routes:[
					{
						name:'推荐路线一',
						url:'../../static/index/pic_1.jpg'
					},
					{
						name:'推荐路线二',
						url:'../../static/index/pic_2.jpg'
					},
					{
						name:'推荐路线三',
						url:'../../static/index/pic_3.jpg'
					}					
				],
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
				}
			}
		},
		methods:{
			onLoad:function(){
				//景点选择
				this.currentSite=this.sites.sites[this.currentSiteIndex[0]][this.currentSiteIndex[1]][this.currentSiteIndex[2]];
				this.currentSitesList.push(this.sites.province);
				this.currentSitesList.push(this.sites.city[0]);
				this.currentSitesList.push(this.sites.sites[0][0]);
			},
			change:function(e) {
			    this.current = e.detail.current;
				this.text=this.info[e.detail.current].content
			},
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
			}
		},
		components:{
			uniSwiperDot
		}
	}
</script>

<style>
.navigator{
	margin-top: 3%;
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

.introduce_routes{
	padding-top: 5%;
}

.introduce_routes_view {
	text-align: center;
	position:relative;
	display: inline-block;
}

.introduce_routes_text {
	z-indenx:1;
	background-color: #EBEBEB;
	color: #000000;
}

.introduce_routes_image{
	padding-top: 1%;
	width: 750rpx;
	height: 250rpx;
}
</style>
