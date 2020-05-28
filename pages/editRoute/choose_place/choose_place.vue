<template>
	<view class="list_box">
		<view class="left">
			<scroll-view scroll-y="true" :style="{ 'height':scrollHeight }">
				<view class="item" 
					v-for="(item,index) in leftArray"
					:key="index" 
					:class="{ 'active':index==leftIndex }" 
					:data-index="index"
					@tap="leftTap"
				>{{item}}</view>
            </scroll-view>
		</view>
		
		<view class="main">
			<swiper class="swiper" :style="{ 'height':scrollHeight }"
				:current="leftIndex" @change="swiperChange"
				 vertical="true" duration="300">
				<swiper-item v-for="(item,index) in mainArray" :key="index">
					<scroll-view  scroll-y="true" :style="{ 'height':scrollHeight }">
						<view class="item">
							<view class="title">
							</view>
							<view class="goods" v-for="(item2,index2) in item.list" :key="index2" @click="navigator_editRoutePage(item2.cityName)">
								<image :src="item2.cityImg" mode=""></image>
								<view>
									<view>{{item2.cityName}}</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollHeight:'500px',
				leftArray:[],
				mainArray:[],
				leftIndex:0,
				startDate:"",
				endDate:"",
				routeDay:"",
				routeName:"",
				userInformation:"",
				isAdd:false
			}
		},
		onLoad(e){
			/* 设置当前滚动容器的高 */
			uni.getSystemInfo({
				success:(res)=>{
					this.scrollHeight=`${res.windowHeight}px`;
				}
			});
			this.get_province_online();
			this.get_cities_online();
			
			/* 是否从增加景点数据跳转 */
			if(e.isAdd=='true'){
				this.isAdd=true;
			}
			else{
				/* 获得前页数据 */
				this.routeName=e.routeName;
				this.startDate=e.startDate;
				this.endDate=e.endDate;
				this.routeDay=Number(e.routeDay);
				
				/* 获得用户信息 */
				this.userInformation=uni.getStorageSync("currentUser");
			}
		},
		mounted(){
		},
		methods: {
			/* 左侧导航点击 */
			leftTap(e){
				let index=e.currentTarget.dataset.index;
				this.leftIndex=Number(index);
				
			},
			/* 轮播图切换 */
			swiperChange(e){
				let index=e.detail.current;
				this.leftIndex=Number(index);
			},
			/* 网络请求,获得城市数据 */
			get_cities_online:function(){
				uni.request({
					url:getApp().globalData.baseUrl+"/cities",
					success: (data) => {
						this.mainArray=data.data._root_;
					}
				})
			},
			/* 网络请求,获得省份数据 */
			get_province_online:function(){
				uni.request({
					url:"https://getman.cn/mock/yanyou_province",
					success: (data) => {
						this.leftArray=data.data;
					}
				})
			},
			/* 跳转至路线编辑页，存储路线并跳转 */
			navigator_editRoutePage:function(cityName){
				/* 若为从景点选择页跳转，则使用emit回传数据，并跳转 */
				if(this.isAdd){
					uni.$emit('routeCity',cityName);
					uni.navigateBack();
				}
				else{
					/* 取出用户路线 */
					// 若为第一次
					if(uni.getStorageSync(this.userInformation.userName+"_route")==''){
						uni.setStorageSync(this.userInformation.userName+"_route",{});
					}
					
					var userRoute=uni.getStorageSync(this.userInformation.userName+"_route");
					var routeId=this.get_routeId(this.userInformation.userName);
					userRoute[routeId]={
						routeName:this.routeName.trim(),
						routeImg:"/static/editRoute/default.jpg",
						routeStartTime:this.startDate,
						routeEndTime:this.endDate,
						routeDay:this.routeDay,
						routePlace:cityName,
						route:[]
					}
					/* 将当前路线加入用户路线 */
					uni.setStorageSync(this.userInformation.userName+"_route",userRoute)
					
					uni.redirectTo({
						url:"../editRoute?routeId="+routeId
					})
				}
				
			},
			//获取路线ID，根据用户+当前时间(格林威治时间-秒)，格式：userName_time
			get_routeId:function(userName){
				var nday=new Date();
				return userName+nday.getTime()
			}
		}
	}
</script>

<style lang="scss">
.list_box{
	display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
	font-size: 36rpx;
	
	
	.left{
		width: 146rpx;
		background-color: #f6f6f6;
		line-height: 80rpx;
		box-sizing: border-box;
		font-size: 32rpx;
		
		.item{
			padding-left: 20rpx;
			position: relative;
			&:not(:first-child) {
				margin-top: 1px;
			
				&::after {
					content: '';
					display: block;
					height: 0;
					border-top: #d6d6d6 solid 1px;
					width: 620upx;
					position: absolute;
					top: -1px;
					right: 0;
					transform:scaleY(0.5);	/* 1px像素 */
				}
			}
			
			&.active,&:active{
				color: #42b983;
				background-color: #fff;
			}
		}
	}
	.main{
		background-color: #fff;
		padding-left: 10rpx;
		margin-top: 20rpx;
		flex-grow: 1;
		box-sizing: border-box;
		display: inline-block;
		width: 750rpx;
		
		.swiper{
			height: 500px;
		}
		
		.item{
			padding-bottom: 10rpx;
		}
		
		.goods{
			display: inline-block;
			width: 180rpx;
			overflow: hidden;
			text-align: center;
			margin-left: 10rpx;
			margin-right: 10rpx;
			margin: 10rpx 10rpx 0rpx 10rpx;
			
			&>image{
				width: 168rpx;
				height: 168rpx;
			}
			
			.describe{
				font-size: 24rpx;
				color: #999;
			}
			
			.money{
				font-size: 24rpx;
				color: #efba21;
			}
		}
	}
}
</style>

